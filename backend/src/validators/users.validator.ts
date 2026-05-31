import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    semester: z.number().int().positive().max(14).optional(),
  }),
});

export const updateLearningStyleSchema = z.object({
  body: z.object({
    primaryStyle: z.string().min(2),
    secondaryStyle: z.string().optional(),
  }),
});
