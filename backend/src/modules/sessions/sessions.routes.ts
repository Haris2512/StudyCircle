// File routing untuk modul Sessions
import { Router } from 'express';
import { SessionsController } from './sessions.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createSessionSchema, updateSessionSchema } from '../../validators/sessions.validator';

const router = Router({ mergeParams: true });
const controller = new SessionsController();

router.use(requireAuth);

// Group-level session routes (mounted at /api/groups/:groupId/sessions)
// But we can also mount them separately. Let's export two routers or use one with careful mounting.
// Actually, it's better to define routes carefully based on how they will be mounted in app.ts.

// If mounted at /api/sessions:
const sessionsRouter = Router();
sessionsRouter.use(requireAuth);
sessionsRouter.get('/:sessionId', controller.getSessionDetails);
sessionsRouter.patch('/:sessionId', validate(updateSessionSchema), controller.updateSession);
sessionsRouter.delete('/:sessionId', controller.deleteSession);
sessionsRouter.post('/:sessionId/attend', controller.joinSession);
sessionsRouter.post('/:sessionId/leave', controller.leaveSession);

// Group specific session routes to be mounted in groups.routes.ts
export const groupSessionsRouter = Router({ mergeParams: true });
groupSessionsRouter.use(requireAuth);
groupSessionsRouter.get('/optimal-schedule', controller.getOptimalSchedule);
groupSessionsRouter.post('/', validate(createSessionSchema), controller.createSession);
groupSessionsRouter.get('/', controller.getGroupSessions);

export { sessionsRouter };
