import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import { setupSwagger } from './config/swagger';

// Inisialisasi aplikasi Express utama
const app = express();

// Set up dokumentasi API menggunakan Swagger
setupSwagger(app);

// Security Middleware: Helmet untuk header HTTP yang aman
app.use(helmet());

// Mengaktifkan CORS agar frontend dapat mengakses backend dengan kredensial
app.use(cors({
  origin: env.FRONTEND_URL, // Ensure frontend origin is allowed for credentials
  credentials: true,
}));

// Rate Limiting: Membatasi jumlah request dari satu IP untuk mencegah spam/DDoS
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // Jendela waktu 1 menit
  max: 500, // Limit each IP to 500 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' },
});
// Terapkan rate limiter untuk semua route berawalan /api
app.use('/api', limiter);

// Body Parsing & Cookies Middleware
app.use(express.json()); // Mem-parsing request body berformat JSON
app.use(express.urlencoded({ extended: true })); // Mem-parsing URL-encoded data
app.use(cookieParser()); // Mem-parsing cookies dari request

// Removed static file serving for uploads to enforce authorization

/**
 * Endpoint Health Check
 * Mengembalikan status server untuk memastikan server berjalan dengan baik
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

// Import seluruh route modul aplikasi
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

// Registrasi API Routes dengan prefix /api/v1
app.use('/api/v1/auth', authRoutes); // Route otentikasi
app.use('/api/v1/users', usersRoutes); // Route pengguna
app.use('/api/v1/groups', groupsRoutes); // Route kelompok belajar
app.use('/api/v1/sessions', sessionsRouter); // Route sesi belajar
app.use('/api/v1/materials', materialsRouter); // Route materi belajar
app.use('/api/v1/progress', progressRouter); // Route progres
app.use('/api/v1/subjects', subjectsRoutes); // Route mata pelajaran
app.use('/api/v1/admin', adminRoutes); // Route admin
app.use('/api/v1/notifications', notificationsRouter); // Route notifikasi
app.use('/api/v1/match', matchRoutes); // Route algoritma pencocokan kelompok

// Panggil lagi Swagger (pastikan dokumentasi terupdate dengan route baru)
setupSwagger(app);

// Global Error Handler Middleware untuk menangkap dan memformat error tak terduga
app.use(errorHandler);

export default app;
