import { Router } from 'express';
import { SubjectsController } from './subjects.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();
const subjectsController = new SubjectsController();

router.use(requireAuth);

router.get('/', subjectsController.getSubjects);

export default router;
