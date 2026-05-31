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

  async findAllGroups(filters?: { subjectId?: string; search?: string }) {
    const where: Prisma.StudyGroupWhereInput = {};
    if (filters?.subjectId) {
      where.subjectId = filters.subjectId;
    }
    if (filters?.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    return prisma.studyGroup.findMany({
      where,
      include: {
        subject: true,
        _count: {
          select: { members: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
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
}
