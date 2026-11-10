import { z } from 'zod';

export const updateUserProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'İsim en az 2 karakter olmalıdır').optional(),
    bio: z.string().max(500, 'Bio en fazla 500 karakter olabilir').optional(),
    avatarUrl: z.string().url('Geçerli bir resim URL adresi giriniz').optional(),
  }),
});

export type UpdateUserProfileDTO = z.infer<typeof updateUserProfileSchema>['body'];

export interface UserProfileResponse {
  id: string;
  email: string;
  fullName: string;
  bio: string | null;
  avatarUrl: string | null;
  rating: number;
  totalReviews: number;
  createdAt: Date;
  skills?: any[];
}
