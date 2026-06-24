// Controller untuk mengelola notifikasi pengguna
import { Request, Response } from 'express';
import { NotificationsService } from './notifications.service';

export class NotificationsController {
  private service: NotificationsService;

  constructor() {
    this.service = new NotificationsService();
  }

  getNotifications = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const notifications = await this.service.getUserNotifications(userId);
      res.status(200).json({ data: notifications });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  markAsRead = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const notificationId = req.params.notificationId as string;
      await this.service.markAsRead(notificationId, userId);
      res.status(200).json({ message: 'Notification marked as read' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  markAllAsRead = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      await this.service.markAllAsRead(userId);
      res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteNotification = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const notificationId = req.params.notificationId as string;
      await this.service.deleteNotification(notificationId, userId);
      res.status(200).json({ message: 'Notification deleted' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
