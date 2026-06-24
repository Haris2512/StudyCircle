// Rute API untuk fitur notifikasi
import { Router } from 'express';
import { NotificationsController } from './notifications.controller';
import { requireAuth } from '../../middleware/auth.middleware';

export const notificationsRouter = Router();
const controller = new NotificationsController();

notificationsRouter.use(requireAuth);

notificationsRouter.get('/', controller.getNotifications);
notificationsRouter.put('/read-all', controller.markAllAsRead);
notificationsRouter.put('/:notificationId/read', controller.markAsRead);
notificationsRouter.delete('/:notificationId', controller.deleteNotification);
