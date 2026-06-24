/**
 * Definisi API untuk mendapatkan rekomendasi teman belajar atau grup belajar.
 */
import { axiosInstance } from './axiosInstance';

export const matchApi = {
  getRecommendations: async (subjectId?: string) => {
    const params = new URLSearchParams();
    if (subjectId) {
      params.append('subjectId', subjectId);
    }
    const response = await axiosInstance.get(`/match/recommendations?${params.toString()}`);
    return response.data;
  },
};
