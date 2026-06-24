// File controller untuk modul Groups
import { Request, Response, NextFunction } from 'express';
import { GroupsService } from './groups.service';

const groupsService = new GroupsService();

export class GroupsController {
  async createGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const group = await groupsService.createGroup(userId, req.body);
      res.status(201).json({ success: true, data: group });
    } catch (error) {
      next(error);
    }
  }

  async getGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const { subjectId, search, page, limit } = req.query;
      const result = await groupsService.getAllGroups({
        subjectId: subjectId as string,
        search: search as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      });
      res.status(200).json({ 
        success: true, 
        data: result.groups, 
        pagination: result.pagination 
      });
    } catch (error) {
      next(error);
    }
  }

  async getGroupById(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = req.params.groupId as string;
      const group = await groupsService.getGroupById(groupId);
      res.status(200).json({ success: true, data: group });
    } catch (error) {
      if (error instanceof Error && error.message === 'Group not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async updateGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const groupId = req.params.groupId as string;
      const group = await groupsService.updateGroup(userId, groupId, req.body);
      res.status(200).json({ success: true, data: group });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Forbidden')) {
        res.status(403).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async deleteGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const groupId = req.params.groupId as string;
      await groupsService.deleteGroup(userId, groupId);
      res.status(200).json({ success: true, message: 'Group deleted successfully' });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Forbidden')) {
        res.status(403).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async joinGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const groupId = req.params.groupId as string;
      const member = await groupsService.joinGroup(userId, groupId);
      res.status(200).json({ success: true, data: member });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Group not found') {
          res.status(404).json({ success: false, message: error.message });
          return;
        }
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async leaveGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const groupId = req.params.groupId as string;
      await groupsService.leaveGroup(userId, groupId);
      res.status(200).json({ success: true, message: 'Successfully left the group' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async getMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const groupId = req.params.groupId as string;
      const members = await groupsService.getMembers(groupId, userId);
      res.status(200).json({ success: true, data: members });
    } catch (error) {
      if (error instanceof Error && (error.message === 'Group not found' || error.message.includes('Forbidden'))) {
        res.status(error.message.includes('Forbidden') ? 403 : 404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async getChats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const groupId = req.params.groupId as string;
      const chats = await groupsService.getGroupChats(userId, groupId);
      res.status(200).json({ success: true, data: chats });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Forbidden')) {
        res.status(403).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.userId;
      const groupId = req.params.groupId as string;
      const targetUserId = req.params.userId as string;
      await groupsService.removeMember(adminId, groupId, targetUserId);
      res.status(200).json({ success: true, message: 'Member removed successfully' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Forbidden')) {
          res.status(403).json({ success: false, message: error.message });
          return;
        }
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }
}
