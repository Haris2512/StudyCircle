import { Request, Response, NextFunction } from 'express';
import * as usersService from './users.service';

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const profile = await usersService.getProfile(userId);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const profile = await usersService.updateProfile(userId, req.body);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

export async function updateLearningStyle(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { primaryStyle, secondaryStyle } = req.body;
    const profile = await usersService.updateLearningStyle(userId, primaryStyle, secondaryStyle);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}
