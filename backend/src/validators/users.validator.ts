// Validator untuk memvalidasi data input pada pembaruan profil pengguna
import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    semester: z.number().int().positive().max(14).optional(),
    timezone: z.string().optional(),
  }),
});

export const updateLearningStyleSchema = z.object({
  body: z.object({
    primaryStyle: z.string().min(2),
    secondaryStyle: z.string().optional(),
  }),
});
