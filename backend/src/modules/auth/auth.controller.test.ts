import { describe, it, expect, vi, beforeEach } from 'vitest';
import { register, login, logout } from './auth.controller';
import * as authService from './auth.service';
import { Request, Response, NextFunction } from 'express';

vi.mock('./auth.service');

describe('Auth Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      cookie: vi.fn(),
      clearCookie: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user and return 201', async () => {
      mockReq.body = { email: 'test@example.com', password: 'password123', name: 'Test User' };
      const mockResult = { token: 'mock-token', user: { id: '1', email: 'test@example.com', name: 'Test User' } };
      
      vi.mocked(authService.register).mockResolvedValue(mockResult as any);

      await register(mockReq as Request, mockRes as Response, mockNext);

      expect(authService.register).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.cookie).toHaveBeenCalledWith('token', 'mock-token', expect.any(Object));
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockResult.user });
    });

    it('should call next with error if registration fails', async () => {
      const error = new Error('Registration failed');
      vi.mocked(authService.register).mockRejectedValue(error);

      await register(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('should login a user and return 200', async () => {
      mockReq.body = { email: 'test@example.com', password: 'password123' };
      const mockResult = { token: 'mock-token', user: { id: '1', email: 'test@example.com', name: 'Test User' } };
      
      vi.mocked(authService.login).mockResolvedValue(mockResult as any);

      await login(mockReq as Request, mockRes as Response, mockNext);

      expect(authService.login).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.cookie).toHaveBeenCalledWith('token', 'mock-token', expect.any(Object));
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: mockResult.user });
    });
  });

  describe('logout', () => {
    it('should clear cookie and return 200', async () => {
      await logout(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.clearCookie).toHaveBeenCalledWith('token', expect.any(Object));
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, message: 'Logged out successfully' });
    });
  });
});
