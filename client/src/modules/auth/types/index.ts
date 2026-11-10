import type { User } from '@/types/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
  bio?: string;
}

export interface AuthData {
  user: User;
  token: string;
}
