// File controller untuk modul Sessions
import { Request, Response } from 'express';
import { SessionsService } from './sessions.service';

export class SessionsController {
  private service: SessionsService;

  constructor() {
    this.service = new SessionsService();
  }

  createSession = async (req: Request, res: Response) => {
    try {
      const groupId = req.params.groupId as string;
      const userId = req.user!.userId; // from auth middleware
      const data = req.body;

      const session = await this.service.createSession(userId, groupId, data);
      res.status(201).json({ data: session });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getGroupSessions = async (req: Request, res: Response) => {
    try {
      const groupId = req.params.groupId as string;
      const userId = req.user!.userId;

      const sessions = await this.service.getGroupSessions(userId, groupId);
      res.status(200).json({ data: sessions });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getOptimalSchedule = async (req: Request, res: Response) => {
    try {
      const groupId = req.params.groupId as string;
      const schedules = await this.service.getOptimalSchedule(groupId);
      res.status(200).json({ success: true, data: schedules });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getSessionDetails = async (req: Request, res: Response) => {
    try {
      const sessionId = req.params.sessionId as string;
      const userId = req.user!.userId;

      const session = await this.service.getSessionDetails(userId, sessionId);
      res.status(200).json({ data: session });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  updateSession = async (req: Request, res: Response) => {
    try {
      const sessionId = req.params.sessionId as string;
      const userId = req.user!.userId;
      const data = req.body;

      const session = await this.service.updateSession(userId, sessionId, data);
      res.status(200).json({ data: session });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteSession = async (req: Request, res: Response) => {
    try {
      const sessionId = req.params.sessionId as string;
      const userId = req.user!.userId;

      await this.service.deleteSession(userId, sessionId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  joinSession = async (req: Request, res: Response) => {
    try {
      const sessionId = req.params.sessionId as string;
      const userId = req.user!.userId;

      const attendance = await this.service.joinSession(userId, sessionId);
      res.status(201).json({ data: attendance, message: 'Successfully joined the session' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  leaveSession = async (req: Request, res: Response) => {
    try {
      const sessionId = req.params.sessionId as string;
      const userId = req.user!.userId;

      const attendance = await this.service.leaveSession(userId, sessionId);
      res.status(200).json({ data: attendance, message: 'Successfully left the session' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
