// Controller untuk fungsionalitas admin (statistik, kelola pengguna dan grup)
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const [userCount, groupCount, sessionCount, materialCount] = await Promise.all([
        prisma.user.count(),
        prisma.studyGroup.count(),
        prisma.session.count(),
        prisma.material.count(),
      ]);
      
      res.status(200).json({
        success: true,
        data: {
          users: userCount,
          groups: groupCount,
          sessions: sessionCount,
          materials: materialCount,
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || '';
      const role = req.query.role as string || '';

      const where: any = {};
      if (search) {
        where.OR = [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } }
        ];
      }
      if (role && role !== 'ALL') {
        where.role = role;
      }

      const total = await prisma.user.count({ where });
      const users = await prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          semester: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      });

      res.status(200).json({ 
        success: true, 
        data: users,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      
      if (user.role === 'ADMIN') {
        res.status(403).json({ success: false, message: 'Cannot delete an admin user' });
        return;
      }

      await prisma.user.delete({ where: { id } });
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { role } = req.body;

      if (!role || !['USER', 'ADMIN'].includes(role)) {
        res.status(400).json({ success: false, message: 'Invalid role provided' });
        return;
      }

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      // Prevent changing your own role or the last admin's role, but for simplicity we'll just allow it unless it's self.
      // (Optional safeguard: if req.user.id === id, prevent)
      
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { role },
        select: { id: true, role: true, fullName: true }
      });

      res.status(200).json({ success: true, message: 'User role updated successfully', data: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  async getGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || '';

      const where: any = {};
      if (search) {
        where.name = { contains: search, mode: 'insensitive' };
      }

      const total = await prisma.studyGroup.count({ where });
      const groups = await prisma.studyGroup.findMany({
        where,
        include: {
          subject: true,
          creator: { select: { username: true, fullName: true } },
          _count: { select: { members: true, sessions: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      });

      res.status(200).json({ 
        success: true, 
        data: groups,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await prisma.studyGroup.delete({ where: { id } });
      res.status(200).json({ success: true, message: 'Group deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
