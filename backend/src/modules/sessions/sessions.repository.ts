// File repository untuk modul Sessions
import { PrismaClient, Prisma, AttendanceStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class SessionsRepository {
  async createSession(data: Prisma.SessionCreateInput) {
    return prisma.session.create({ data });
  }

  async findSessionById(sessionId: string) {
    return prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        studyGroup: true,
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          }
        },
        attendances: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              }
            }
          }
        }
      }
    });
  }

  async findSessionsByGroupId(groupId: string) {
    return prisma.session.findMany({
      where: { studyGroupId: groupId },
      orderBy: { scheduledStartTime: 'asc' },
      include: {
        attendances: true,
      }
    });
  }

  async updateSession(sessionId: string, data: Prisma.SessionUpdateInput) {
    return prisma.session.update({
      where: { id: sessionId },
      data,
    });
  }

  async deleteSession(sessionId: string) {
    return prisma.session.delete({
      where: { id: sessionId },
    });
  }

  async checkOverlappingSessions(groupId: string, startTime: Date, endTime: Date, excludeSessionId?: string) {
    const whereClause: Prisma.SessionWhereInput = {
      studyGroupId: groupId,
      status: { not: 'cancelled' },
      AND: [
        { scheduledStartTime: { lt: endTime } },
        { scheduledEndTime: { gt: startTime } }
      ]
    };

    if (excludeSessionId) {
      whereClause.id = { not: excludeSessionId };
    }

    const overlap = await prisma.session.findFirst({
      where: whereClause
    });

    return overlap !== null;
  }

  async findActiveAttendanceForUser(userId: string) {
    return prisma.sessionAttendance.findFirst({
      where: {
        userId,
        status: AttendanceStatus.active,
      },
      include: {
        session: true
      }
    });
  }

  async findAttendance(sessionId: string, userId: string) {
    return prisma.sessionAttendance.findUnique({
      where: {
        sessionId_userId: {
          sessionId,
          userId,
        }
      }
    });
  }

  async createAttendance(sessionId: string, userId: string) {
    return prisma.sessionAttendance.create({
      data: {
        session: { connect: { id: sessionId } },
        user: { connect: { id: userId } },
        status: AttendanceStatus.active,
      }
    });
  }

  async updateAttendance(id: string, data: Prisma.SessionAttendanceUpdateInput) {
    return prisma.sessionAttendance.update({
      where: { id },
      data,
    });
  }

  async cancelActiveAttendances(sessionId: string) {
    const activeAttendances = await prisma.sessionAttendance.findMany({
      where: { sessionId, status: AttendanceStatus.active }
    });
    
    const now = new Date();
    const updates = activeAttendances.map(att => {
      const durationMs = now.getTime() - att.joinedAt.getTime();
      let durationMinutes = Math.floor(durationMs / 60000);
      if (durationMinutes > 8 * 60) durationMinutes = 8 * 60; // Max 8 hours

      return prisma.sessionAttendance.update({
        where: { id: att.id },
        data: {
          leftAt: now,
          durationMinutes,
          status: AttendanceStatus.left_early
        }
      });
    });

    return prisma.$transaction(updates);
  }
}
