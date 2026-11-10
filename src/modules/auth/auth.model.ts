import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
    fullName: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
    bio: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    password: z.string().min(1, 'Şifre zorunludur'),
  }),
});

export type RegisterDTO = z.infer<typeof registerSchema>['body'];
export type LoginDTO = z.infer<typeof loginSchema>['body'];

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    bio?: string | null;
    avatarUrl?: string | null;
    rating: number;
    role: string[];
    permissions: string[];
  };
  token: string;
}
