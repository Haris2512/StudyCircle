// Controller untuk fitur rekomendasi dan pencocokan grup belajar
import { Request, Response, NextFunction } from 'express';
import { MatchService } from './match.service';

const matchService = new MatchService();

export class MatchController {
  async getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { subjectId } = req.query;
      
      const recommendations = await matchService.getRecommendations(userId, subjectId as string | undefined);
      res.status(200).json({ success: true, data: recommendations });
    } catch (error) {
      next(error);
    }
  }
}
