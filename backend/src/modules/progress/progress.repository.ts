import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class ProgressRepository {
  async findProgress(userId: string, subjectId: string) {
    return prisma.progress.findUnique({
      where: {
        userId_subjectId: {
          userId,
          subjectId
        }
      },
      include: {
        subject: true
      }
    });
  }

  async createProgress(data: Prisma.ProgressUncheckedCreateInput) {
    return prisma.progress.create({
      data,
      include: {
        subject: true
      }
    });
  }

  async updateProgress(id: string, data: Prisma.ProgressUpdateInput) {
    return prisma.progress.update({
      where: { id },
      data,
      include: {
        subject: true
      }
    });
  }

  async findAllUserProgress(userId: string) {
    return prisma.progress.findMany({
      where: { userId },
      include: {
        subject: true
      },
      orderBy: {
        lastStudiedAt: 'desc'
      }
    });
  }
}
