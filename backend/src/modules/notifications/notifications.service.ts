// Service untuk logika bisnis pengiriman dan manajemen notifikasi
import { NotificationsRepository } from './notifications.repository';
import { socketService } from '../../socket';
import { prisma } from '../../config/database';

export class NotificationsService {
  private repository = new NotificationsRepository();

  async getUserNotifications(userId: string) {
    return this.repository.findUserNotifications(userId);
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.repository.markAsRead(notificationId, userId);
  }

  async markAllAsRead(userId: string) {
    return this.repository.markAllAsRead(userId);
  }

  async deleteNotification(notificationId: string, userId: string) {
    return this.repository.deleteNotification(notificationId, userId);
  }

  async notifyGroupMembers(
    groupId: string,
    senderId: string,
    title: string,
    message: string,
    type: string,
    link?: string
  ) {
    // Get all members of the group except the sender
    const members = await prisma.member.findMany({
      where: {
        studyGroupId: groupId,
        userId: { not: senderId },
      },
      select: { userId: true },
    });

    // Create notification in database and emit via socket for each member
    const notifications = await Promise.all(
      members.map(async (member) => {
        const notif = await this.repository.createNotification({
          userId: member.userId,
          title,
          message,
          type,
          link,
        });

        // Emit socket notification
        socketService.sendToUser(member.userId, 'notification', {
          id: notif.id,
          title: notif.title,
          message: notif.message,
          type: notif.type,
          link: notif.link,
          read: notif.read,
          createdAt: notif.createdAt,
        });

        return notif;
      })
    );

    return notifications;
  }
}
