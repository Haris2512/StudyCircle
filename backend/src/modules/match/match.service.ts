// Service untuk logika bisnis pencocokan grup belajar berdasarkan kriteria pengguna
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MatchService {
  async getRecommendations(userId: string, subjectId?: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { learningStyle: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const whereClause: any = {};
    if (subjectId) {
      whereClause.subjectId = subjectId;
    }

    // Ambil grup beserta anggotanya untuk dievaluasi kecocokannya
    const groups = await prisma.studyGroup.findMany({
      where: whereClause,
      include: {
        members: {
          include: {
            user: {
              include: {
                learningStyle: true
              }
            }
          }
        },
        subject: true
      }
    });

    const recommendedGroups = groups.map(group => {
      let score = 0;
      let matchReasons: string[] = [];

      // 1. Ketersediaan tempat
      if (group.members.length < group.maxMembers) {
        score += 20;
      } else {
        score -= 50; // Penuh
      }

      // 2. Kecocokan Timezone
      const timezoneMatches = group.members.filter(m => m.user.timezone === user.timezone).length;
      if (timezoneMatches > 0) {
        score += Math.min(30, timezoneMatches * 10);
        matchReasons.push('Sama Timezone');
      }

      // 3. Kecocokan Learning Style
      if (user.learningStyle) {
        const styleMatches = group.members.filter(m => 
          m.user.learningStyle?.primaryStyle === user.learningStyle?.primaryStyle
        ).length;

        if (styleMatches > 0) {
          score += Math.min(50, styleMatches * 15);
          matchReasons.push('Sama Learning Style');
        }
      }

      // Pastikan score maksimal 100
      const finalScore = Math.min(100, Math.max(0, score));

      return {
        ...group,
        matchScore: finalScore,
        matchReasons
      };
    });

    // Urutkan berdasarkan skor tertinggi
    recommendedGroups.sort((a, b) => b.matchScore - a.matchScore);

    return recommendedGroups;
  }
}
