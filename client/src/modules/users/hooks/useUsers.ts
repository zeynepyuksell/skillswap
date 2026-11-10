import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userService, type UpdateProfileInput } from '../services/userService';
import { useAuthStore } from '@/modules/auth/services/authStore';

export const useUsers = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['users', { page, limit }],
    queryFn: () => userService.getUsers(page, limit),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
};

export const useCurrentUser = () => {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['currentUser', user?.id],
    queryFn: () => userService.getMe(),
    enabled: isAuthenticated && !!user?.id,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => userService.updateMe(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['user', updatedUser.id] });
      toast.success('Profiliniz başarıyla güncellendi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Profil güncellenirken bir hata oluştu');
    },
  });
};
