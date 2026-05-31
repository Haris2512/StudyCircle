import { Router } from 'express';
import { GroupsController } from './groups.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  createGroupSchema,
  updateGroupSchema,
  groupIdParamSchema,
  removeMemberSchema
} from '../../validators/groups.validator';

const router = Router();
const groupsController = new GroupsController();

// All routes require authentication
router.use(requireAuth);

// Group CRUD
router.post('/', validate(createGroupSchema), groupsController.createGroup);
router.get('/', groupsController.getGroups);
router.get('/:groupId', validate(groupIdParamSchema), groupsController.getGroupById);
router.patch('/:groupId', validate(updateGroupSchema), groupsController.updateGroup);
router.delete('/:groupId', validate(groupIdParamSchema), groupsController.deleteGroup);

// Membership
router.post('/:groupId/join', validate(groupIdParamSchema), groupsController.joinGroup);
router.post('/:groupId/leave', validate(groupIdParamSchema), groupsController.leaveGroup);
router.get('/:groupId/members', validate(groupIdParamSchema), groupsController.getMembers);
router.delete('/:groupId/members/:userId', validate(removeMemberSchema), groupsController.removeMember);

export default router;
