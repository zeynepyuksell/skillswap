import { apiClient } from '@/api/axiosInstance';
import type { ApiResponse, Skill, UserSkillItem } from '@/types/api';

export interface AddUserSkillInput {
  skillId: string;
  type: 'OFFERING' | 'SEEKING';
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsExperience?: number;
  description?: string;
}

export const skillService = {
  getSkills: async (search?: string, category?: string): Promise<Skill[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'Tümü') params.append('category', category);

    const response = await apiClient.get<ApiResponse<Skill[]>>(`/skills?${params.toString()}`);
    return response.data.data || [];
  },

  createSkill: async (data: { name: string; category: string; description?: string }): Promise<Skill> => {
    const response = await apiClient.post<ApiResponse<Skill>>('/skills', data);
    return response.data.data!;
  },

  addUserSkill: async (data: AddUserSkillInput): Promise<UserSkillItem> => {
    const response = await apiClient.post<ApiResponse<UserSkillItem>>('/skills/my-skills', data);
    return response.data.data!;
  },

  removeUserSkill: async (userSkillId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/skills/my-skills/${userSkillId}`);
    return response.data.data!;
  },
};
