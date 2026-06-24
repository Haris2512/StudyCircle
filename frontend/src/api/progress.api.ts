/**
 * Definisi API untuk fitur progres belajar pengguna.
 */
import { axiosInstance } from './axiosInstance';

export const progressApi = {
  getUserProgress: async () => {
    const response = await axiosInstance.get('/progress');
    return response.data;
  },

  getProgressSummary: async () => {
    const response = await axiosInstance.get('/progress/summary');
    return response.data;
  },
};
