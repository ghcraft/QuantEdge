import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const prismaOptions: any = {};
  
  if (process.env.NODE_ENV === 'development') {
    prismaOptions.log = ['error', 'warn'];
  }
  
  return new PrismaClient(prismaOptions);
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

