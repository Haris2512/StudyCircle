import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';

export async function createUser(data: Prisma.UserCreateInput) {
  return prisma.user.create({
    data,
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}
