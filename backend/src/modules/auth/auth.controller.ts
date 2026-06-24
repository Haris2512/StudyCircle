import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

// Fungsi untuk menangani registrasi akun baru
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    // Memanggil service register untuk memproses data pendaftaran dari request body
    const result = await authService.register(req.body);
    
    // Menyimpan token JWT ke dalam cookie untuk otentikasi sesi
    res.cookie('token', result.token, {
      httpOnly: true, // Tidak bisa diakses dari JavaScript (untuk keamanan)
      secure: true,   // Hanya kirim cookie di HTTPS
      sameSite: 'none', // Mengizinkan cookie lintas domain (cross-site)
      maxAge: 7 * 24 * 60 * 60 * 1000 // Kedaluwarsa dalam 7 hari
    });

    // Mengembalikan response sukses HTTP 201 Created beserta data pengguna
    res.status(201).json({
      success: true,
      data: result.user,
    });
  } catch (error) {
    // Teruskan error ke error handler global jika terjadi kegagalan
    next(error);
  }
}

// Fungsi untuk menangani proses login
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    // Memanggil service login untuk memverifikasi kredensial
    const result = await authService.login(req.body);
    
    // Mengatur token JWT ke dalam cookie saat login berhasil
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
    });

    // Mengembalikan response sukses HTTP 200 OK beserta data pengguna
    res.status(200).json({
      success: true,
      data: result.user,
    });
  } catch (error) {
    next(error);
  }
}

// Fungsi untuk menangani logout pengguna
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    // Menghapus cookie token dari browser
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    // Beri tahu klien bahwa logout berhasil
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
}

// Fungsi untuk mendapatkan data profil pengguna yang sedang login
export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    // Mengambil userId dari payload token yang sudah didekode di middleware auth
    const userId = (req as any).user!.userId;
    
    // Memanggil service untuk mengambil data detail profil pengguna dari database
    const user = await authService.getMe(userId);
    
    // Mengembalikan data profil
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
