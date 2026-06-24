// File repository untuk modul Materials
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class MaterialsRepository {
  async createMaterial(data: Prisma.MaterialCreateInput) {
    return prisma.material.create({ data });
  }

  async findMaterialById(materialId: string) {
    return prisma.material.findUnique({
      where: { id: materialId },
      include: {
        studyGroup: true,
      }
    });
  }

  async findMaterialsByGroupId(groupId: string, page?: number, limit?: number) {
    const where = { studyGroupId: groupId };

    if (page && limit) {
      const skip = (page - 1) * limit;
      const take = limit;
      const [materials, total] = await prisma.$transaction([
        prisma.material.findMany({
          where,
          orderBy: { uploadedAt: 'desc' },
          include: {
            uploader: {
              select: {
                id: true,
                fullName: true,
                username: true,
              }
            }
          },
          skip,
          take
        }),
        prisma.material.count({ where })
      ]);
      return {
        materials,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total
        }
      };
    }

    const materials = await prisma.material.findMany({
      where,
      orderBy: { uploadedAt: 'desc' },
      include: {
        uploader: {
          select: {
            id: true,
            fullName: true,
            username: true,
          }
        }
      }
    });

    return { materials };
  }

  async deleteMaterial(materialId: string) {
    return prisma.material.delete({
      where: { id: materialId },
    });
  }
}
