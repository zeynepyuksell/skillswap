import { apiClient } from '@/api/axiosInstance';
import type { ApiResponse, SwapRequest } from '@/types/api';

export interface CreateSwapInput {
  receiverId: string;
  offeredSkillId: string;
  requestedSkillId: string;
  message: string;
}

export const swapService = {
  createSwap: async (data: CreateSwapInput): Promise<SwapRequest> => {
    const response = await apiClient.post<ApiResponse<SwapRequest>>('/swaps', data);
    return response.data.data!;
  },

  getMySwaps: async (status?: string): Promise<SwapRequest[]> => {
    const params = status ? `?status=${status}` : '';
    const response = await apiClient.get<ApiResponse<SwapRequest[]>>(`/swaps/my-swaps${params}`);
    return response.data.data || [];
  },

  updateSwapStatus: async (id: string, status: string, notes?: string): Promise<SwapRequest> => {
    const response = await apiClient.patch<ApiResponse<SwapRequest>>(`/swaps/${id}/status`, {
      status,
      notes,
    });
    return response.data.data!;
  },
};
