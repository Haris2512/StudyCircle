// Validator untuk memvalidasi data input terkait materi pembelajaran
import { z } from 'zod';

export const createMaterialSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(150, 'Title is too long'),
    description: z.string().optional(),
  }),
});
