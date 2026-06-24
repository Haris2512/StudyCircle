/**
 * Definisi API untuk mengelola materi pembelajaran di grup.
 */
import { axiosInstance } from './axiosInstance';

export const materialsApi = {
  getGroupMaterials: async (groupId: string, params?: { page?: number; limit?: number }) => {
    const response = await axiosInstance.get(`/groups/${groupId}/materials`, { params });
    return response.data;
  },

  uploadMaterial: async (groupId: string, formData: FormData) => {
    const response = await axiosInstance.post(`/groups/${groupId}/materials`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  downloadMaterial: async (materialId: string) => {
    const response = await axiosInstance.get(`/materials/${materialId}/download`, {
      responseType: 'blob',
    });
    return response;
  },

  deleteMaterial: async (materialId: string) => {
    const response = await axiosInstance.delete(`/materials/${materialId}`);
    return response.data;
  },
};
