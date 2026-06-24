// File repository untuk modul Users
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { learningStyle: true },
  });
}

export async function updateUser(id: string, data: Prisma.UserUpdateInput) {
  return prisma.user.update({
    where: { id },
    data,
    include: { learningStyle: true },
  });
}

export async function upsertLearningStyle(userId: string, primaryStyle: string, secondaryStyle?: string) {
  return prisma.learningStyle.upsert({
    where: { userId },
    update: { primaryStyle, secondaryStyle },
    create: { userId, primaryStyle, secondaryStyle },
  });
}

export async function getLeaderboard(limit = 10) {
  return prisma.user.findMany({
    take: limit,
    orderBy: {
      points: 'desc',
    },
    select: {
      id: true,
      username: true,
      fullName: true,
      level: true,
      points: true,
    }
  });
}
