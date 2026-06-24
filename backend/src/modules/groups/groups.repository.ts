// File repository untuk modul Groups
import { Prisma, StudyGroup, Member } from '@prisma/client';
import { prisma } from '../../config/database';

export class GroupsRepository {
  async createGroup(data: Prisma.StudyGroupCreateInput) {
    return prisma.studyGroup.create({
      data,
      include: {
        subject: true,
        members: true
      }
    });
  }

  async findGroupById(id: string) {
    return prisma.studyGroup.findUnique({
      where: { id },
      include: {
        subject: true,
        creator: {
          select: { id: true, username: true, fullName: true }
        },
        _count: {
          select: { members: true }
        }
      }
    });
  }

  async findAllGroups(filters?: { subjectId?: string; search?: string; page?: number; limit?: number }) {
    const where: Prisma.StudyGroupWhereInput = {};
    if (filters?.subjectId) {
      where.subjectId = filters.subjectId;
    }
    if (filters?.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    const page = filters?.page;
    const limit = filters?.limit;

    if (page && limit) {
      const skip = (page - 1) * limit;
      const take = limit;

      const [groups, total] = await prisma.$transaction([
        prisma.studyGroup.findMany({
          where,
          include: {
            subject: true,
            members: {
              select: { userId: true }
            },
            _count: {
              select: { members: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take
        }),
        prisma.studyGroup.count({ where })
      ]);

      return {
        groups,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total
        }
      };
    }

    const groups = await prisma.studyGroup.findMany({
      where,
      include: {
        subject: true,
        members: {
          select: { userId: true }
        },
        _count: {
          select: { members: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return { groups };
  }


  async updateGroup(id: string, data: Prisma.StudyGroupUpdateInput): Promise<StudyGroup> {
    return prisma.studyGroup.update({
      where: { id },
      data
    });
  }

  async deleteGroup(id: string): Promise<StudyGroup> {
    return prisma.studyGroup.delete({
      where: { id }
    });
  }

  async addMember(studyGroupId: string, userId: string, role: 'admin' | 'member' = 'member'): Promise<Member> {
    return prisma.member.create({
      data: {
        studyGroup: { connect: { id: studyGroupId } },
        user: { connect: { id: userId } },
        role
      }
    });
  }

  async findMember(studyGroupId: string, userId: string) {
    return prisma.member.findUnique({
      where: {
        studyGroupId_userId: {
          studyGroupId,
          userId
        }
      }
    });
  }

  async findGroupMembers(studyGroupId: string) {
    return prisma.member.findMany({
      where: { studyGroupId },
      include: {
        user: {
          select: { id: true, username: true, fullName: true, semester: true }
        }
      },
      orderBy: { joinedAt: 'asc' }
    });
  }

  async removeMember(studyGroupId: string, userId: string) {
    return prisma.member.delete({
      where: {
        studyGroupId_userId: {
          studyGroupId,
          userId
        }
      }
    });
  }

  async getAdminCount(studyGroupId: string): Promise<number> {
    return prisma.member.count({
      where: {
        studyGroupId,
        role: 'admin'
      }
    });
  }

  async findGroupChats(studyGroupId: string) {
    return prisma.chatMessage.findMany({
      where: { studyGroupId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            role: true,
            level: true,
          }
        }
      },
      orderBy: { createdAt: 'asc' },
      // Optional: limit to last 50 messages for simplicity
      take: 50,
    });
  }
}
