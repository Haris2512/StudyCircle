import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SubjectsController {
  async getSubjects(req: Request, res: Response, next: NextFunction) {
    try {
      const subjects = await prisma.subject.findMany({
        orderBy: { code: 'asc' }
      });
      res.status(200).json({ success: true, data: subjects });
    } catch (error) {
      next(error);
    }
  }
}
