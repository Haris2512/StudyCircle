import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies?.token;

  // Fallback to Authorization header for API testing tools like Postman
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const payload = verifyToken(token);
    (req as any).user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const payload = verifyToken(token);
    (req as any).user = payload;
  } catch (error) {
    // Just ignore invalid tokens for optional auth
  }
  next();
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  requireAuth(req, res, async () => {
    try {
      const userId = (req as any).user.userId;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      if (!user || user.role !== 'ADMIN') {
        res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error during authorization' });
      return;
    }
  });
};
