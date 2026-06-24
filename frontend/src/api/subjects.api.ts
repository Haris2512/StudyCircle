/**
 * Definisi API untuk daftar mata pelajaran (subjects).
 */
import { axiosInstance } from './axiosInstance';

export interface Subject {
  id: string;
  code: string;
  name: string;
  description: string | null;
}

export const subjectsApi = {
  getSubjects: async (): Promise<Subject[]> => {
    const response = await axiosInstance.get('/subjects');
    return response.data.data;
  },
};
