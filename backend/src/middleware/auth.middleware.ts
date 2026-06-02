import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';

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
