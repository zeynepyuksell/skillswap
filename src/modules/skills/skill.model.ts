import { z } from 'zod';

export const createSkillSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Yetenek adı en az 2 karakter olmalıdır'),
    category: z.string().min(2, 'Kategori zorunludur'),
    description: z.string().optional(),
  }),
});

export const addUserSkillSchema = z.object({
  body: z.object({
    skillId: z.string().uuid('Geçerli bir yetenek kimliği (UUID) giriniz'),
    type: z.enum(['OFFERING', 'SEEKING']),
    proficiencyLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).default('BEGINNER'),
    yearsExperience: z.number().int().min(0).default(0),
    description: z.string().optional(),
  }),
});

export type CreateSkillDTO = z.infer<typeof createSkillSchema>['body'];
export type AddUserSkillDTO = z.infer<typeof addUserSkillSchema>['body'];
