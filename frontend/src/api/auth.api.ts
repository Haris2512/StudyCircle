/**
 * Definisi API untuk proses autentikasi (login, register, logout, getMe).
 */
import { axiosInstance } from './axiosInstance';
import type { ApiResponse, User } from '../types';

export const authApi = {
  register: async (data: any): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.post<ApiResponse<User>>('/auth/register', data);
    return response.data;
  },

  login: async (data: any): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.post<ApiResponse<User>>('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
};
