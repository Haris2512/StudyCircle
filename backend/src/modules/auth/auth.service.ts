import bcrypt from 'bcryptjs';
import * as authRepo from './auth.repository';
import { signToken } from '../../config/jwt';

export async function register(data: any) {
  const existingUserByEmail = await authRepo.findUserByEmail(data.email);
  if (existingUserByEmail) {
    throw { status: 409, message: 'Email already in use' };
  }

  const existingUserByUsername = await authRepo.findUserByUsername(data.username);
  if (existingUserByUsername) {
    throw { status: 409, message: 'Username already in use' };
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await authRepo.createUser({
    username: data.username,
    email: data.email,
    passwordHash,
    fullName: data.fullName,
    semester: data.semester,
  });

  const token = signToken({ userId: user.id, role: user.role });

  const { passwordHash: _, ...userWithoutPassword } = user;
  
  return { user: userWithoutPassword, token };
}

export async function login(data: any) {
  const user = await authRepo.findUserByEmail(data.email);
  if (!user) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
  if (!isPasswordValid) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  const token = signToken({ userId: user.id, role: user.role });

  const { passwordHash: _, ...userWithoutPassword } = user;
  
  return { user: userWithoutPassword, token };
}

export async function getMe(userId: string) {
  const user = await authRepo.findUserById(userId);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const { passwordHash: _, ...userWithoutPassword } = user;
  
  return userWithoutPassword;
}
