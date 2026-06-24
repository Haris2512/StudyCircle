/**
 * Definisi API untuk fitur notifikasi.
 */
import { axiosInstance } from './axiosInstance';

export const notificationsApi = {
  getNotifications: async () => {
    const response = await axiosInstance.get('/notifications');
    return response.data;
  },

  markAsRead: async (notificationId: string) => {
    const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axiosInstance.put('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (notificationId: string) => {
    const response = await axiosInstance.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};
