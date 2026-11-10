import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { swapService, type CreateSwapInput } from '../services/swapService';
import { useAuthStore } from '@/modules/auth/services/authStore';

export const useMySwaps = (status?: string) => {
  const { user, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['mySwaps', user?.id, status],
    queryFn: () => swapService.getMySwaps(status),
    enabled: isAuthenticated && !!user?.id,
  });
};

export const useCreateSwap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSwapInput) => swapService.createSwap(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySwaps'] });
      toast.success('Takas teklifiniz başarıyla iletildi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Takas teklifi gönderilemedi.');
    },
  });
};

export const useUpdateSwapStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      swapService.updateSwapStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySwaps'] });
      toast.success('Takas durumu güncellendi.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Takas durumu güncellenemedi.');
    },
  });
};
