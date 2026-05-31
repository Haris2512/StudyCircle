import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().min(2),
    semester: z.number().int().positive().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});
