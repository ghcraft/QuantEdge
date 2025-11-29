import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaOptions: any = {};

if (process.env.NODE_ENV === 'development') {
  prismaOptions.log = ['error', 'warn'];
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

