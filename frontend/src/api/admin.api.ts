/**
 * Definisi API untuk fitur administratif aplikasi.
 */
import { axiosInstance } from './axiosInstance';

export const adminApi = {
  getStats: async () => {
    const response = await axiosInstance.get('/admin/stats');
    return response.data.data;
  },
  getUsers: async (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
    const response = await axiosInstance.get('/admin/users', { params });
    return response.data; // Return full response to get meta
  },
  deleteUser: async (userId: string) => {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
  },
  updateUserRole: async (userId: string, role: string) => {
    const response = await axiosInstance.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },
  getGroups: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await axiosInstance.get('/admin/groups', { params });
    return response.data; // Return full response to get meta
  },
  deleteGroup: async (groupId: string) => {
    const response = await axiosInstance.delete(`/admin/groups/${groupId}`);
    return response.data;
  }
};
