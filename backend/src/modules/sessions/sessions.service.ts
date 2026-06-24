// File service untuk modul Sessions
import { SessionsRepository } from './sessions.repository';
import { GroupsRepository } from '../groups/groups.repository';
import { Prisma, SessionStatus, AttendanceStatus } from '@prisma/client';
import { ProgressService } from '../progress/progress.service';

export class SessionsService {
  private repository: SessionsRepository;
  private groupsRepository: GroupsRepository;
  private progressService: ProgressService;

  constructor() {
    this.repository = new SessionsRepository();
    this.groupsRepository = new GroupsRepository();
    this.progressService = new ProgressService();
  }

  async createSession(userId: string, groupId: string, data: {
    title: string;
    description?: string;
    scheduledStartTime: Date;
    scheduledEndTime: Date;
  }) {
    // 1. Only Group Admins can create sessions
    await this.requireAdmin(groupId, userId);

    // 4. Sessions within the same study group may not overlap in time
    const hasOverlap = await this.repository.checkOverlappingSessions(
      groupId,
      data.scheduledStartTime,
      data.scheduledEndTime
    );

    if (hasOverlap) {
      throw new Error('Session overlaps with an existing session in this study group');
    }

    const sessionData: Prisma.SessionCreateInput = {
      title: data.title,
      description: data.description,
      scheduledStartTime: data.scheduledStartTime,
      scheduledEndTime: data.scheduledEndTime,
      studyGroup: { connect: { id: groupId } },
      creator: { connect: { id: userId } }
    };

    const session = await this.repository.createSession(sessionData);

    // Gamification: +5 points for creating a session
    const gamification = new (require('../gamification/gamification.service').GamificationService)();
    await gamification.awardPoints(userId, 5);

    // Notify group members via DB & Socket
    const { NotificationsService } = require('../notifications/notifications.service');
    const notificationsService = new NotificationsService();
    await notificationsService.notifyGroupMembers(
      groupId,
      userId,
      'Sesi Diskusi Baru',
      `Sesi diskusi baru "${session.title}" dijadwalkan!`,
      'SESSION_CREATED',
      `/groups/${groupId}`
    );

    return session;
  }

  async getGroupSessions(userId: string, groupId: string) {
    // 1. Only group members can view group sessions
    await this.requireMember(groupId, userId);
    return this.repository.findSessionsByGroupId(groupId);
  }

  async getSessionDetails(userId: string, sessionId: string) {
    const session = await this.repository.findSessionById(sessionId);
    if (!session) throw new Error('Session not found');

    // Only group members can view group sessions
    await this.requireMember(session.studyGroupId, userId);
    
    return session;
  }

  async updateSession(userId: string, sessionId: string, data: {
    title?: string;
    description?: string;
    scheduledStartTime?: Date;
    scheduledEndTime?: Date;
    status?: SessionStatus;
  }) {
    const session = await this.repository.findSessionById(sessionId);
    if (!session) throw new Error('Session not found');

    // 7. Update Session: Group Admin only
    await this.requireAdmin(session.studyGroupId, userId);

    // 5. scheduledStartTime must be earlier than scheduledEndTime
    const startTime = data.scheduledStartTime || session.scheduledStartTime;
    const endTime = data.scheduledEndTime || session.scheduledEndTime;

    if (startTime >= endTime) {
      throw new Error('Scheduled start time must be earlier than scheduled end time');
    }

    // Check overlap if dates are updated
    if (data.scheduledStartTime || data.scheduledEndTime) {
      const hasOverlap = await this.repository.checkOverlappingSessions(
        session.studyGroupId,
        startTime,
        endTime,
        sessionId
      );

      if (hasOverlap) {
        throw new Error('Session times overlap with an existing session in this study group');
      }
    }

    const updatedSession = await this.repository.updateSession(sessionId, data);

    // 3. Handle active attendees when a session is cancelled
    if (data.status === SessionStatus.cancelled && session.status !== SessionStatus.cancelled) {
      const cancelledAttendances = await this.repository.cancelActiveAttendances(sessionId);
      
      // Update progress for all cancelled attendances
      for (const att of cancelledAttendances) {
        if (att.durationMinutes && att.durationMinutes > 0) {
          await this.progressService.updateProgress(
            att.userId,
            session.studyGroup.subjectId,
            'left_early',
            att.durationMinutes
          );
        }
      }
    }

    return updatedSession;
  }

  async deleteSession(userId: string, sessionId: string) {
    const session = await this.repository.findSessionById(sessionId);
    if (!session) throw new Error('Session not found');

    // 7. Delete Session: Group Admin only
    await this.requireAdmin(session.studyGroupId, userId);

    return this.repository.deleteSession(sessionId);
  }

  async joinSession(userId: string, sessionId: string) {
    const session = await this.repository.findSessionById(sessionId);
    if (!session) throw new Error('Session not found');

    // 2. Only group members can attend sessions
    await this.requireMember(session.studyGroupId, userId);

    // 3. Cancelled sessions cannot be attended
    if (session.status === SessionStatus.cancelled) {
      throw new Error('Cannot attend a cancelled session');
    }

    // 1. Prevent joining sessions that have already ended
    if (new Date() > session.scheduledEndTime) {
      throw new Error('Cannot join a session that has already ended');
    }

    // Check if user already joined
    const existingAttendance = await this.repository.findAttendance(sessionId, userId);
    if (existingAttendance) {
      if (existingAttendance.status === AttendanceStatus.active) {
        throw new Error('You have already joined this session');
      } else {
        throw new Error('You have already completed or left this session');
      }
    }

    // Single Active Session Rule
    const activeAttendance = await this.repository.findActiveAttendanceForUser(userId);
    if (activeAttendance) {
      throw new Error(`You are currently attending another active session (${activeAttendance.session.title}). Please leave it first.`);
    }

    return this.repository.createAttendance(sessionId, userId);
  }

  async leaveSession(userId: string, sessionId: string) {
    const attendance = await this.repository.findAttendance(sessionId, userId);
    if (!attendance) throw new Error('You have not joined this session');
    if (attendance.status !== AttendanceStatus.active) {
      throw new Error('You are not actively attending this session');
    }

    const session = await this.repository.findSessionById(sessionId);
    if (!session) throw new Error('Session not found');

    const leftAt = new Date();
    const durationMs = leftAt.getTime() - attendance.joinedAt.getTime();
    let durationMinutes = Math.floor(durationMs / 60000);

    // 6. Duration sanity threshold: Max 8 hours
    const maxValidMinutes = 8 * 60;
    
    let isAnomalous = false;
    if (durationMinutes > maxValidMinutes) {
      durationMinutes = maxValidMinutes; // Cap it
      isAnomalous = true;
    }

    // 2. Improve attendance completion logic
    let status: AttendanceStatus = AttendanceStatus.completed;
    const scheduledDurationMs = session.scheduledEndTime.getTime() - session.scheduledStartTime.getTime();
    
    if (scheduledDurationMs > 0) {
      const attendancePercentage = durationMs / scheduledDurationMs;
      if (attendancePercentage < 0.5) {
        status = AttendanceStatus.left_early;
      }
    }

    const result = await this.repository.updateAttendance(attendance.id, {
      leftAt,
      durationMinutes,
      status,
    });

    // Update Progress idempotently
    // Assuming the attendance was active, it hasn't been processed before
    if (durationMinutes > 0 || status === AttendanceStatus.completed) {
      await this.progressService.updateProgress(
        userId,
        session.studyGroup.subjectId,
        status,
        durationMinutes
      );
    }

    if (isAnomalous) {
      // In a real system we might log this or add an anomalous flag
      console.warn(`Anomalous attendance duration for user ${userId} in session ${sessionId}. Capped to 8 hours.`);
    }

    return result;
  }

  async getOptimalSchedule(groupId: string) {
    // Implementasi heuristic AI scheduling
    // Mencari waktu mulai (jam 10:00, 14:00, atau 19:00 UTC) di esok hari
    // Dalam skenario dunia nyata, kita akan mencocokkan ketersediaan anggota & timezone
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Hasilkan 3 opsi jadwal
    const options = [10, 14, 19].map(hour => {
      const start = new Date(tomorrow);
      start.setUTCHours(hour, 0, 0, 0);
      
      const end = new Date(start);
      end.setUTCHours(hour + 2, 0, 0, 0); // Sesi 2 jam
      
      return {
        scheduledStartTime: start,
        scheduledEndTime: end,
        confidenceScore: Math.floor(Math.random() * 20) + 80 // Mock score 80-99%
      };
    });

    // Urutkan berdasarkan score
    return options.sort((a, b) => b.confidenceScore - a.confidenceScore);
  }

  // --- Helper Methods ---

  private async requireMember(groupId: string, userId: string) {
    const member = await this.groupsRepository.findMember(groupId, userId);
    if (!member) throw new Error('You are not a member of this group');
    return member;
  }

  private async requireAdmin(groupId: string, userId: string) {
    const member = await this.groupsRepository.findMember(groupId, userId);
    if (!member) throw new Error('You are not a member of this group');
    if (member.role !== 'admin') throw new Error('Forbidden: Group Admin privileges required');
    return member;
  }
}
