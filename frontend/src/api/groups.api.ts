/**
 * Definisi API untuk fitur terkait grup belajar.
 */
import { axiosInstance } from './axiosInstance';
import type { CreateGroupPayload } from '../types';

export const groupsApi = {
  getAllGroups: async (params?: { subjectId?: string; search?: string; page?: number; limit?: number }) => {
    const response = await axiosInstance.get('/groups', { params });
    return response.data;
  },

  getGroupById: async (groupId: string) => {
    const response = await axiosInstance.get(`/groups/${groupId}`);
    return response.data;
  },

  createGroup: async (data: CreateGroupPayload) => {
    const response = await axiosInstance.post('/groups', data);
    return response.data;
  },

  updateGroup: async (groupId: string, data: Partial<CreateGroupPayload>) => {
    const response = await axiosInstance.patch(`/groups/${groupId}`, data);
    return response.data;
  },

  deleteGroup: async (groupId: string) => {
    const response = await axiosInstance.delete(`/groups/${groupId}`);
    return response.data;
  },

  joinGroup: async (groupId: string) => {
    const response = await axiosInstance.post(`/groups/${groupId}/join`);
    return response.data;
  },

  leaveGroup: async (groupId: string) => {
    const response = await axiosInstance.post(`/groups/${groupId}/leave`);
    return response.data;
  },

  getMembers: async (groupId: string) => {
    const response = await axiosInstance.get(`/groups/${groupId}/members`);
    return response.data;
  },

  removeMember: async (groupId: string, userId: string) => {
    const response = await axiosInstance.delete(`/groups/${groupId}/members/${userId}`);
    return response.data;
  },

  getGroupChats: async (groupId: string) => {
    const response = await axiosInstance.get(`/groups/${groupId}/chats`);
    return response.data;
  },
};
