// Controller untuk melacak dan mengelola progres pembelajaran
import { Request, Response } from 'express';
import { ProgressService } from './progress.service';

export class ProgressController {
  private service: ProgressService;

  constructor() {
    this.service = new ProgressService();
  }

  getUserProgress = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const progress = await this.service.getUserProgress(userId);
      const mappedProgress = progress.map((p: any) => ({
        id: p.id,
        subjectId: p.subjectId,
        subjectName: p.subject.name,
        masteryLevel: p.estimatedMasteryLevel.toUpperCase(),
        totalStudyHours: p.totalStudyHours,
        sessionsAttended: p.sessionsAttended,
        lastStudiedAt: p.lastStudiedAt
      }));
      res.status(200).json({ data: mappedProgress });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getProgressSummary = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const summary = await this.service.getUserProgressSummary(userId);
      res.status(200).json({ data: summary });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
