// Validator untuk memvalidasi data input pada operasi sesi belajar
import { z } from 'zod';
import { SessionStatus } from '@prisma/client';

export const createSessionSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    description: z.string().optional(),
    scheduledStartTime: z.coerce.date(),
    scheduledEndTime: z.coerce.date(),
  }).refine((data) => data.scheduledStartTime < data.scheduledEndTime, {
    message: "Scheduled start time must be earlier than scheduled end time",
    path: ["scheduledEndTime"],
  }),
});

export const updateSessionSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long').optional(),
    description: z.string().optional(),
    scheduledStartTime: z.coerce.date().optional(),
    scheduledEndTime: z.coerce.date().optional(),
    status: z.enum([
      SessionStatus.scheduled,
      SessionStatus.active,
      SessionStatus.completed,
      SessionStatus.cancelled
    ]).optional(),
  }).refine((data) => {
    if (data.scheduledStartTime && data.scheduledEndTime) {
      return data.scheduledStartTime < data.scheduledEndTime;
    }
    return true; // Cannot validate if only one is updated, rely on service logic
  }, {
    message: "Scheduled start time must be earlier than scheduled end time",
    path: ["scheduledEndTime"],
  }),
});
