// Rute API untuk fitur progres pembelajaran
import { Router } from 'express';
import { ProgressController } from './progress.controller';
import { requireAuth } from '../../middleware/auth.middleware';

export const progressRouter = Router();
const controller = new ProgressController();

progressRouter.use(requireAuth);

progressRouter.get('/', controller.getUserProgress);
progressRouter.get('/summary', controller.getProgressSummary);
