import { GroupsRepository } from './groups.repository';
import { Prisma } from '@prisma/client';

export class GroupsService {
  private repository: GroupsRepository;

  constructor() {
    this.repository = new GroupsRepository();
  }

  async createGroup(userId: string, data: { name: string; subjectId: string; description?: string; maxMembers?: number }) {
    // 1. Group creator automatically becomes group admin
    const groupData: Prisma.StudyGroupCreateInput = {
      name: data.name,
      description: data.description,
      maxMembers: data.maxMembers,
      subject: { connect: { id: data.subjectId } },
      creator: { connect: { id: userId } },
      members: {
        create: {
          userId: userId,
          role: 'admin'
        }
      }
    };

    return this.repository.createGroup(groupData);
  }

  async getGroupById(groupId: string) {
    const group = await this.repository.findGroupById(groupId);
    if (!group) throw new Error('Group not found');
    return group;
  }

  async getAllGroups(filters?: { subjectId?: string; search?: string; page?: number; limit?: number }) {
    return this.repository.findAllGroups(filters);
  }

  async updateGroup(userId: string, groupId: string, data: Prisma.StudyGroupUpdateInput) {
    await this.requireAdmin(groupId, userId);
    return this.repository.updateGroup(groupId, data);
  }

  async deleteGroup(userId: string, groupId: string) {
    // 6. Only group admins can delete groups
    await this.requireAdmin(groupId, userId);
    return this.repository.deleteGroup(groupId);
  }

  async joinGroup(userId: string, groupId: string) {
    const group = await this.repository.findGroupById(groupId);
    if (!group) throw new Error('Group not found');

    // 2. User cannot join the same group twice
    const existingMember = await this.repository.findMember(groupId, userId);
    if (existingMember) throw new Error('You are already a member of this group');

    // 3. User cannot join a full group
    // Note for MVP: There is a known race condition here. If multiple users join simultaneously
    // when the group is 1 member away from maxMembers, it might exceed the limit.
    if (group._count.members >= group.maxMembers) {
      throw new Error('Group is already full');
    }

    return this.repository.addMember(groupId, userId, 'member');
  }

  async leaveGroup(userId: string, groupId: string) {
    const member = await this.repository.findMember(groupId, userId);
    if (!member) throw new Error('You are not a member of this group');

    // 5. The last remaining admin cannot leave the group
    if (member.role === 'admin') {
      const adminCount = await this.repository.getAdminCount(groupId);
      if (adminCount <= 1) {
        throw new Error('The last remaining admin cannot leave the group. Assign another admin or delete the group.');
      }
    }

    return this.repository.removeMember(groupId, userId);
  }

  async getMembers(groupId: string, userId?: string) {
    // Guests and non-members can view the member list
    return this.repository.findGroupMembers(groupId);
  }

  async getGroupChats(userId: string, groupId: string) {
    // Ensure user is member
    const isMember = await this.repository.findMember(groupId, userId);
    if (!isMember) {
      throw new Error('Forbidden: You are not a member of this group');
    }

    return this.repository.findGroupChats(groupId);
  }

  async removeMember(adminId: string, groupId: string, targetUserId: string) {
    // 4. Only group admins can manage members
    await this.requireAdmin(groupId, adminId);

    if (adminId === targetUserId) {
      throw new Error('You cannot remove yourself. Use the leave group functionality instead.');
    }

    const targetMember = await this.repository.findMember(groupId, targetUserId);
    if (!targetMember) throw new Error('Target user is not a member of this group');

    if (targetMember.role === "admin") {
      throw new Error("Admins cannot remove other admins");
    }

    return this.repository.removeMember(groupId, targetUserId);
  }

  // --- Helper Methods ---

  private async requireAdmin(groupId: string, userId: string) {
    const member = await this.repository.findMember(groupId, userId);
    if (!member) throw new Error('You are not a member of this group');
    if (member.role !== 'admin') throw new Error('Forbidden: Group Admin privileges required');
  }
}
