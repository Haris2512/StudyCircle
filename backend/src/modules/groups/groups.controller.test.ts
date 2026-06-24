// File unit test untuk controller modul Groups
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { Request, Response, NextFunction } from 'express';

vi.mock('./groups.service');

describe('Groups Controller', () => {
  let groupsController: GroupsController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    groupsController = new GroupsController();
    
    mockReq = {
      user: { userId: 'user-1' } as any,
      body: {},
      query: {},
      params: {},
    };
    
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  describe('createGroup', () => {
    it('should create a group and return 201', async () => {
      mockReq.body = { name: 'Study Group 1', description: 'Test', subjectId: 'subj-1' };
      const mockGroup = { id: 'group-1', ...mockReq.body };
      
      vi.mocked(GroupsService.prototype.createGroup).mockResolvedValue(mockGroup as any);

      await groupsController.createGroup(mockReq as Request, mockRes as Response, mockNext);

      expect(GroupsService.prototype.createGroup).toHaveBeenCalledWith('user-1', mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockGroup });
    });
  });

  describe('getGroups', () => {
    it('should return paginated groups with 200', async () => {
      mockReq.query = { page: '1', limit: '10' };
      const mockResult = {
        groups: [{ id: 'group-1', name: 'Group 1' }],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 }
      };
      
      vi.mocked(GroupsService.prototype.getAllGroups).mockResolvedValue(mockResult as any);

      await groupsController.getGroups(mockReq as Request, mockRes as Response, mockNext);

      expect(GroupsService.prototype.getAllGroups).toHaveBeenCalledWith({
        subjectId: undefined,
        search: undefined,
        page: 1,
        limit: 10
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult.groups,
        pagination: mockResult.pagination
      });
    });
  });
});
