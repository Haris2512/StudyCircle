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
router.post('/', requireAuth, validate(createGroupSchema), groupsController.createGroup);
router.get('/', optionalAuth, groupsController.getGroups);
router.get('/:groupId', optionalAuth, validate(groupIdParamSchema), groupsController.getGroupById);
router.patch('/:groupId', requireAuth, validate(updateGroupSchema), groupsController.updateGroup);
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
