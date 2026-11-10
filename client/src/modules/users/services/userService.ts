import { apiClient } from '@/api/axiosInstance';
import type { ApiResponse, User } from '@/types/api';

export interface UpdateProfileInput {
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
}

export const userService = {
  getUsers: async (page = 1, limit = 20): Promise<{ users: User[]; pagination: any }> => {
    const response = await apiClient.get<ApiResponse<{ users: User[]; pagination: any }>>(
      `/users?page=${page}&limit=${limit}`
    );
    return response.data.data || { users: [], pagination: {} };
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data!;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/me');
    return response.data.data!;
  },

  updateMe: async (data: UpdateProfileInput): Promise<User> => {
    const response = await apiClient.patch<ApiResponse<User>>('/users/me', data);
    return response.data.data!;
  },
};
