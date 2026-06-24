// File routing untuk modul Users
import { Router } from 'express';
import * as usersController from './users.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { updateProfileSchema, updateLearningStyleSchema } from '../../validators/users.validator';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @openapi
 * /api/v1/users/leaderboard:
 *   get:
 *     tags: [Users]
 *     summary: Get user leaderboard
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Leaderboard retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/leaderboard', requireAuth, usersController.getLeaderboard);

/**
 * @openapi
 * /api/v1/users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', requireAuth, usersController.getProfile);

/**
 * @openapi
 * /api/v1/users/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update current user profile
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Validation Error
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', requireAuth, validate(updateProfileSchema), usersController.updateProfile);

/**
 * @openapi
 * /api/v1/users/learning-style:
 *   put:
 *     tags: [Users]
 *     summary: Update user learning style
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - learningStyle
 *             properties:
 *               learningStyle:
 *                 type: string
 *                 enum: [visual, auditory, kinesthetic, reading_writing]
 *     responses:
 *       200:
 *         description: Learning style updated successfully
 *       400:
 *         description: Validation Error
 *       401:
 *         description: Unauthorized
 */
router.put('/learning-style', requireAuth, validate(updateLearningStyleSchema), usersController.updateLearningStyle);

export default router;
