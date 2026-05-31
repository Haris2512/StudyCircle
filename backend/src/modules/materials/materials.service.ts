import { MaterialsRepository } from './materials.repository';
import { GroupsRepository } from '../groups/groups.repository';
import { Prisma } from '@prisma/client';
import fs from 'fs';
import path from 'path';

export class MaterialsService {
  private repository: MaterialsRepository;
  private groupsRepository: GroupsRepository;

  constructor() {
    this.repository = new MaterialsRepository();
    this.groupsRepository = new GroupsRepository();
  }

  async uploadMaterial(userId: string, groupId: string, data: {
    title: string;
    description?: string;
    fileUrl: string;
    fileType?: string;
    fileSize?: number;
  }) {
    // Check membership
    await this.requireMember(groupId, userId);

    const materialData: Prisma.MaterialCreateInput = {
      title: data.title,
      description: data.description,
      fileUrl: data.fileUrl,
      fileType: data.fileType,
      fileSize: data.fileSize,
      studyGroup: { connect: { id: groupId } },
      uploader: { connect: { id: userId } },
    };

    return this.repository.createMaterial(materialData);
  }

  async getGroupMaterials(userId: string, groupId: string) {
    // 5. Only group members can view materials
    await this.requireMember(groupId, userId);
    return this.repository.findMaterialsByGroupId(groupId);
  }

  async deleteMaterial(userId: string, materialId: string) {
    const material = await this.repository.findMaterialById(materialId);
    if (!material) throw new Error('Material not found');

    // 6. Material deletion allowed only for original uploader or group admin
    const member = await this.groupsRepository.findMember(material.studyGroupId, userId);
    if (!member) throw new Error('You are not a member of this group');

    if (material.uploadedBy !== userId && member.role !== 'admin') {
      throw new Error('Forbidden: Only the original uploader or a group admin can delete this material');
    }

    // Delete from database
    await this.repository.deleteMaterial(materialId);

    // Delete physical file
    const filePath = path.join(process.cwd(), material.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  async getMaterialDownloadPath(userId: string, materialId: string) {
    const material = await this.repository.findMaterialById(materialId);
    if (!material) throw new Error('Material not found');

    await this.requireMember(material.studyGroupId, userId);

    const basePath = path.join(process.cwd(), 'uploads', 'materials');
    // Ensure we construct the absolute path properly from fileUrl (which might contain uploads/materials already depending on saving logic, or might just be the relative string).
    // In our upload Material, fileUrl is stored relative to project root.
    const requestedPath = path.resolve(process.cwd(), material.fileUrl);

    if (!requestedPath.startsWith(basePath)) {
      throw new Error('Invalid file path access');
    }

    if (!fs.existsSync(requestedPath)) {
      throw new Error('File not found on server');
    }

    return requestedPath;
  }

  // --- Helper Methods ---

  private async requireMember(groupId: string, userId: string) {
    const member = await this.groupsRepository.findMember(groupId, userId);
    if (!member) throw new Error('You are not a member of this group');
    return member;
  }
}
