// Rute API untuk pencocokan dan rekomendasi (match)
import { Router } from 'express';
import { MatchController } from './match.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();
const matchController = new MatchController();

router.use(requireAuth);

router.get('/recommendations', matchController.getRecommendations);

export default router;
