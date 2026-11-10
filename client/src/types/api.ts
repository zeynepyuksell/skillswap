export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  rating: number;
  totalReviews?: number;
  role?: string[];
  permissions?: string[];
  createdAt?: string;
  skills?: UserSkillItem[];
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string | null;
  createdAt?: string;
  users?: { userId: string }[];
}

export interface UserSkillItem {
  id: string;
  userId: string;
  skillId: string;
  type: 'OFFERING' | 'SEEKING';
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsExperience?: number;
  description?: string | null;
  skill: Skill;
}

export interface SwapRequest {
  id: string;
  requesterId: string;
  receiverId: string;
  offeredSkillId: string;
  requestedSkillId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  message?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  requester: Partial<User>;
  receiver: Partial<User>;
  offeredSkill: Skill;
  requestedSkill: Skill;
}
