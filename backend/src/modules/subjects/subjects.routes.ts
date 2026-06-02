import { Router } from 'express';
import { prisma } from '../../config/database';
import { requireAuth } from '../../middleware/auth.middleware';

export const subjectsRouter = Router();

// Retrieve all subjects (ordered by code)
subjectsRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { code: 'asc' }
    });
    res.status(200).json({ success: true, data: subjects });
  } catch (error) {
    next(error);
  }
});
