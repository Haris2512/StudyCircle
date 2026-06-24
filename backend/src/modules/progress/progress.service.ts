// Service untuk logika perhitungan dan pembaruan progres
import { ProgressRepository } from './progress.repository';
import { Prisma } from '@prisma/client';

export class ProgressService {
  private repository: ProgressRepository;

  constructor() {
    this.repository = new ProgressRepository();
  }

  private calculateMasteryLevel(totalStudyHours: number): string {
    if (totalStudyHours < 5) return 'Beginner';
    if (totalStudyHours < 15) return 'Intermediate';
    return 'Advanced';
  }

  async updateProgress(
    userId: string,
    subjectId: string,
    status: 'completed' | 'left_early',
    durationMinutes: number
  ) {
    let progress = await this.repository.findProgress(userId, subjectId);

    const durationHours = durationMinutes / 60;
    
    if (!progress) {
      // Create new progress record
      const sessionsAttended = status === 'completed' ? 1 : 0;
      const totalStudyHours = durationHours;
      const estimatedMasteryLevel = this.calculateMasteryLevel(totalStudyHours);

      progress = await this.repository.createProgress({
        userId,
        subjectId,
        sessionsAttended,
        totalStudyHours,
        estimatedMasteryLevel,
        lastStudiedAt: new Date(),
      });
    } else {
      // Update existing
      const sessionsAttended = progress.sessionsAttended + (status === 'completed' ? 1 : 0);
      const totalStudyHours = progress.totalStudyHours + durationHours;
      const estimatedMasteryLevel = this.calculateMasteryLevel(totalStudyHours);

      progress = await this.repository.updateProgress(progress.id, {
        sessionsAttended,
        totalStudyHours,
        estimatedMasteryLevel,
        lastStudiedAt: new Date(),
      });
    }

    return progress;
  }

  async getUserProgress(userId: string) {
    return this.repository.findAllUserProgress(userId);
  }

  async getUserProgressSummary(userId: string) {
    const allProgress = await this.repository.findAllUserProgress(userId);

    let subjectsTracked = allProgress.length;
    let totalStudyHours = 0;
    let completedSessions = 0;
    let advancedSubjects = 0;
    let intermediateSubjects = 0;
    let beginnerSubjects = 0;

    for (const p of allProgress) {
      totalStudyHours += p.totalStudyHours;
      completedSessions += p.sessionsAttended;

      if (p.estimatedMasteryLevel === 'Advanced') {
        advancedSubjects++;
      } else if (p.estimatedMasteryLevel === 'Intermediate') {
        intermediateSubjects++;
      } else {
        beginnerSubjects++;
      }
    }

    return {
      subjectsTracked,
      totalStudyHours,
      completedSessions,
      advancedSubjects,
      intermediateSubjects,
      beginnerSubjects
    };
  }
}
