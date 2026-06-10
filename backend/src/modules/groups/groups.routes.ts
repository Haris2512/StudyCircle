import { Router } from 'express';
import { GroupsController } from './groups.controller';
import { requireAuth, optionalAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  createGroupSchema,
  updateGroupSchema,
  groupIdParamSchema,
  removeMemberSchema
} from '../../validators/groups.validator';
import { groupSessionsRouter } from '../sessions/sessions.routes';
import { groupMaterialsRouter } from '../materials/materials.routes';

const router = Router();
const groupsController = new GroupsController();

// Group CRUD
/**
 * @openapi
 * tags:
 *   name: Groups
 *   description: Group management endpoints
 */

/**
 * @openapi
 * /api/v1/groups:
 *   post:
 *     tags: [Groups]
 *     summary: Create a new group
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
 *               - name
 *               - subjectId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               subjectId:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               maxMembers:
 *                 type: number
 *               isPrivate:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Group created successfully
 */
router.post('/', requireAuth, validate(createGroupSchema), groupsController.createGroup);

/**
 * @openapi
 * /api/v1/groups:
 *   get:
 *     tags: [Groups]
 *     summary: Get all groups
 *     responses:
 *       200:
 *         description: List of groups
 */
router.get('/', optionalAuth, groupsController.getGroups);

/**
 * @openapi
 * /api/v1/groups/{groupId}:
 *   get:
 *     tags: [Groups]
 *     summary: Get a group by ID
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group details
 *       404:
 *         description: Group not found
 */
router.get('/:groupId', optionalAuth, validate(groupIdParamSchema), groupsController.getGroupById);

/**
 * @openapi
 * /api/v1/groups/{groupId}:
 *   patch:
 *     tags: [Groups]
 *     summary: Update a group
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group updated
 */
router.patch('/:groupId', requireAuth, validate(updateGroupSchema), groupsController.updateGroup);

/**
 * @openapi
 * /api/v1/groups/{groupId}:
 *   delete:
 *     tags: [Groups]
 *     summary: Delete a group
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group deleted
 */
router.delete('/:groupId', requireAuth, validate(groupIdParamSchema), groupsController.deleteGroup);

// Membership
router.post('/:groupId/join', requireAuth, validate(groupIdParamSchema), groupsController.joinGroup);
router.post('/:groupId/leave', requireAuth, validate(groupIdParamSchema), groupsController.leaveGroup);
router.get('/:groupId/members', optionalAuth, validate(groupIdParamSchema), groupsController.getMembers);
router.delete('/:groupId/members/:userId', requireAuth, validate(removeMemberSchema), groupsController.removeMember);

// Chats
router.get('/:groupId/chats', requireAuth, validate(groupIdParamSchema), groupsController.getChats);

// Sessions
router.use('/:groupId/sessions', groupSessionsRouter);

// Materials
router.use('/:groupId/materials', groupMaterialsRouter);

export default router;
