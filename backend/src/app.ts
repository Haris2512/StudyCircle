import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import { setupSwagger } from './config/swagger';

const app = express();
setupSwagger(app);

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', // Ensure frontend origin is allowed for credentials
  credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Body Parsing & Cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Removed static file serving for uploads to enforce authorization

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health Check
 *     description: Returns the health status of the server
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import groupsRoutes from './modules/groups/groups.routes';
import { sessionsRouter } from './modules/sessions/sessions.routes';
import { materialsRouter } from './modules/materials/materials.routes';
import { progressRouter } from './modules/progress/progress.routes';
import subjectsRoutes from './modules/subjects/subjects.routes';
import adminRoutes from './modules/admin/admin.routes';
import { notificationsRouter } from './modules/notifications/notifications.routes';
import matchRoutes from './modules/match/match.routes';

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/groups', groupsRoutes);
app.use('/api/v1/sessions', sessionsRouter);
app.use('/api/v1/materials', materialsRouter);
app.use('/api/v1/progress', progressRouter);
app.use('/api/v1/subjects', subjectsRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1/match', matchRoutes);
// Swagger UI Documentation
setupSwagger(app);

// Global Error Handler
app.use(errorHandler);

export default app;
