import { axiosInstance } from './axiosInstance';
import type { Subject } from '../types';

export const subjectsApi = {
  getAllSubjects: async () => {
    const response = await axiosInstance.get('/subjects');
    return response.data; // Response holds { success: true, data: Subject[] }
  },
};
