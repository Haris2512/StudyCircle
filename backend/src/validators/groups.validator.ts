import { z } from 'zod';

export const createGroupSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name must be less than 100 characters"),
    subjectId: z.string().uuid("Invalid subject ID format"),
    description: z.string().max(500, "Description must be less than 500 characters").optional(),
    maxMembers: z.number().int().min(2, "At least 2 members required").max(50, "Maximum 50 members allowed").default(10)
  })
});

export const updateGroupSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100).optional(),
    description: z.string().max(500).optional(),
    maxMembers: z.number().int().min(2).max(50).optional()
  })
});

export const groupIdParamSchema = z.object({
  params: z.object({
    groupId: z.string().uuid("Invalid group ID format")
  })
});

export const removeMemberSchema = z.object({
  params: z.object({
    groupId: z.string().uuid("Invalid group ID format"),
    userId: z.string().uuid("Invalid user ID format")
  })
});
