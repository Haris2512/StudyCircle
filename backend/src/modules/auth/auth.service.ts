import bcrypt from 'bcryptjs';
import * as authRepo from './auth.repository';
import { signToken } from '../../config/jwt';

// Logika bisnis utama untuk meregistrasi pengguna baru
export async function register(data: any) {
  // Mengecek apakah email pengguna sudah ada di database
  const existingUserByEmail = await authRepo.findUserByEmail(data.email);
  if (existingUserByEmail) {
    throw { status: 409, message: 'Email already in use' }; // Error konflik
  }

  // Mengecek apakah username juga sudah dipakai
  const existingUserByUsername = await authRepo.findUserByUsername(data.username);
  if (existingUserByUsername) {
    throw { status: 409, message: 'Username already in use' };
  }

  // Mengenkripsi password menggunakan bcrypt dengan salt rounds = 10
  const passwordHash = await bcrypt.hash(data.password, 10);

  // Menyimpan data pengguna baru ke database melalui repository
  const user = await authRepo.createUser({
    username: data.username,
    email: data.email,
    passwordHash,
    fullName: data.fullName,
    semester: data.semester,
    timezone: data.timezone,
  });

  // Membuat JSON Web Token (JWT) untuk sesi login pertama
  const token = signToken({ userId: user.id });

  // Memisahkan passwordHash dari objek user agar tidak ikut dikembalikan ke frontend
  const { passwordHash: _, ...userWithoutPassword } = user;
  
  return { user: userWithoutPassword, token };
}

// Logika bisnis untuk proses verifikasi kredensial saat login
export async function login(data: any) {
  // Cari pengguna di database berdasarkan email
  const user = await authRepo.findUserByEmail(data.email);
  if (!user) {
    throw { status: 401, message: 'Invalid credentials' }; // Jika email tidak ada
  }

  // Bandingkan password plain text dari request dengan passwordHash di database
  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
  if (!isPasswordValid) {
    throw { status: 401, message: 'Invalid credentials' }; // Jika sandi salah
  }

  // Generate JWT jika kredensial benar
  const token = signToken({ userId: user.id });

  // Jangan kembalikan hash password
  const { passwordHash: _, ...userWithoutPassword } = user;
  
  return { user: userWithoutPassword, token };
}

// Mengambil profil diri pengguna yang sedang login
export async function getMe(userId: string) {
  // Temukan pengguna di database
  const user = await authRepo.findUserById(userId);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  // Sembunyikan hash password
  const { passwordHash: _, ...userWithoutPassword } = user;
  
  return userWithoutPassword;
}
