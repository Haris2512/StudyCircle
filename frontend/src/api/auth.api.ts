import { axiosInstance } from './axiosInstance';
import { ApiResponse, AuthResponse, User } from '../types';

export const authApi = {
  register: async (data: any): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data;
  },

  login: async (data: any): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>('/auth/login', data);
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
