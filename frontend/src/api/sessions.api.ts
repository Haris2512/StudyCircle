/**
 * Definisi API untuk fitur sesi belajar.
 */
import { axiosInstance } from './axiosInstance';
import type { CreateSessionPayload } from '../types';

export const sessionsApi = {
  getGroupSessions: async (groupId: string) => {
    const response = await axiosInstance.get(`/groups/${groupId}/sessions`);
    return response.data;
  },

  createSession: async (groupId: string, data: CreateSessionPayload) => {
    const response = await axiosInstance.post(`/groups/${groupId}/sessions`, data);
    return response.data;
  },

  getSessionDetails: async (sessionId: string) => {
    const response = await axiosInstance.get(`/sessions/${sessionId}`);
    return response.data;
  },

  updateSession: async (sessionId: string, data: { status?: string; title?: string }) => {
    const response = await axiosInstance.patch(`/sessions/${sessionId}`, data);
    return response.data;
  },

  deleteSession: async (sessionId: string) => {
    const response = await axiosInstance.delete(`/sessions/${sessionId}`);
    return response.data;
  },

  joinSession: async (sessionId: string) => {
    const response = await axiosInstance.post(`/sessions/${sessionId}/attend`);
    return response.data;
  },

  leaveSession: async (sessionId: string) => {
    const response = await axiosInstance.post(`/sessions/${sessionId}/leave`);
    return response.data;
  },
};
