import { z } from 'zod';

export const createSwapRequestSchema = z.object({
  body: z.object({
    receiverId: z.string().uuid('Geçerli bir kullanıcı kimliği giriniz'),
    offeredSkillId: z.string().uuid('Geçerli bir teklif yetenek kimliği giriniz'),
    requestedSkillId: z.string().uuid('Geçerli bir talep yetenek kimliği giriniz'),
    message: z.string().min(5, 'Lütfen en az 5 karakterlik bir mesaj yazınız').max(500),
  }),
});

export const updateSwapStatusSchema = z.object({
  body: z.object({
    status: z.enum(['ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED']),
    notes: z.string().optional(),
  }),
});

export type CreateSwapRequestDTO = z.infer<typeof createSwapRequestSchema>['body'];
export type UpdateSwapStatusDTO = z.infer<typeof updateSwapStatusSchema>['body'];
