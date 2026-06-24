// Rute API untuk panel admin
import { Router } from 'express';
import { AdminController } from './admin.controller';
import { requireAdmin } from '../../middleware/auth.middleware';

const router = Router();
const adminController = new AdminController();

// Protect all admin routes
router.use(requireAdmin);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/role', adminController.updateUserRole);
router.get('/groups', adminController.getGroups);
router.delete('/groups/:id', adminController.deleteGroup);

export default router;
