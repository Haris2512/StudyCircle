import * as usersRepo from './users.repository';

export async function getProfile(userId: string) {
  const user = await usersRepo.findUserById(userId);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }
  
  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function updateProfile(userId: string, data: { fullName?: string; semester?: number }) {
  const updatedUser = await usersRepo.updateUser(userId, data);
  const { passwordHash: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
}

export async function updateLearningStyle(userId: string, primaryStyle: string, secondaryStyle?: string) {
  await usersRepo.upsertLearningStyle(userId, primaryStyle, secondaryStyle);
  return getProfile(userId);
}
