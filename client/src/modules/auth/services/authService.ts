import { apiClient } from '@/api/axiosInstance';
import type { ApiResponse } from '@/types/api';
import type { AuthData, LoginCredentials, RegisterCredentials } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthData> => {
    const response = await apiClient.post<ApiResponse<AuthData>>('/auth/login', credentials);
    return response.data.data!;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthData> => {
    const response = await apiClient.post<ApiResponse<AuthData>>('/auth/register', credentials);
    return response.data.data!;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/users/me');
    return response.data.data!;
  },
};
