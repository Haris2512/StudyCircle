import { PrismaClient } from '@prisma/client';
import { beforeAll, afterAll, afterEach } from 'vitest';

export const prisma = new PrismaClient();

beforeAll(async () => {
  // Connect to the database
  await prisma.$connect();
});

afterEach(async () => {
  // Clean up database tables after each test if necessary
  // To avoid deleting development data, make sure DATABASE_URL in test env points to a test database.
});

afterAll(async () => {
  // Disconnect
  await prisma.$disconnect();
});
