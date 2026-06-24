import http from 'http';
import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { socketService } from './socket';

// Membuat HTTP Server berdasarkan instance aplikasi Express
const server = http.createServer(app);

// Inisialisasi koneksi Socket.io menggunakan HTTP Server
socketService.initialize(server);

// Fungsi utama untuk menjalankan server HTTP
const startServer = () => {
  server.listen(env.PORT, () => {
    // Logging informasi ketika server berhasil berjalan di port yang ditentukan
    logger.info(`Server is running on port ${env.PORT}`);
  });
};

// Panggil fungsi startServer untuk memulai eksekusi server
startServer();
