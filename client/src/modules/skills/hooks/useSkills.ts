import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { skillService, type AddUserSkillInput } from '../services/skillService';

export const useSkills = (search?: string, category?: string) => {
  return useQuery({
    queryKey: ['skills', { search, category }],
    queryFn: () => skillService.getSkills(search, category),
  });
};

export const useAddUserSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddUserSkillInput) => skillService.addUserSkill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Yetenek profilinize eklendi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Yetenek eklenirken bir hata oluştu');
    },
  });
};

export const useRemoveUserSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userSkillId: string) => skillService.removeUserSkill(userSkillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Yetenek profilden kaldırıldı');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Yetenek silinirken bir hata oluştu');
    },
  });
};
