// Pengujian unit untuk Notifications Controller
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Request, Response } from 'express';

vi.mock('./notifications.service');

describe('Notifications Controller', () => {
  let controller: NotificationsController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    controller = new NotificationsController();

    mockReq = {
      user: { userId: 'user-1' } as any,
      body: {},
      params: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    vi.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should return user notifications and 200 status', async () => {
      const mockNotifications = [
        { id: 'notif-1', userId: 'user-1', title: 'Test Notif', message: 'Hello', read: false },
      ];

      vi.mocked(NotificationsService.prototype.getUserNotifications).mockResolvedValue(mockNotifications as any);

      await controller.getNotifications(mockReq as Request, mockRes as Response);

      expect(NotificationsService.prototype.getUserNotifications).toHaveBeenCalledWith('user-1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockNotifications });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read and return 200 status', async () => {
      mockReq.params = { notificationId: 'notif-1' };
      vi.mocked(NotificationsService.prototype.markAsRead).mockResolvedValue({} as any);

      await controller.markAsRead(mockReq as Request, mockRes as Response);

      expect(NotificationsService.prototype.markAsRead).toHaveBeenCalledWith('notif-1', 'user-1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Notification marked as read' });
    });
  });
});
