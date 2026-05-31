import { Router } from 'express';
import * as usersController from './users.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { updateProfileSchema, updateLearningStyleSchema } from '../../validators/users.validator';

const router = Router();

router.get('/profile', requireAuth, usersController.getProfile);
router.put('/profile', requireAuth, validate(updateProfileSchema), usersController.updateProfile);
router.put('/learning-style', requireAuth, validate(updateLearningStyleSchema), usersController.updateLearningStyle);

export default router;
