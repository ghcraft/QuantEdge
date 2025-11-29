// Lazy import do Prisma Client para evitar problemas de bundling
let PrismaClient: any;
let prismaInstance: any;

function getPrismaClient() {
  if (!PrismaClient) {
    PrismaClient = require('@prisma/client').PrismaClient;
  }
  return PrismaClient;
}

function getPrisma() {
  if (prismaInstance) {
    return prismaInstance;
  }

  const Prisma = getPrismaClient();
  const prismaOptions: any = {};

  if (process.env.NODE_ENV === 'development') {
    prismaOptions.log = ['error', 'warn'];
  }

  prismaInstance = new Prisma(prismaOptions);

  if (process.env.NODE_ENV !== 'production') {
    (globalThis as any).prisma = prismaInstance;
  }

  return prismaInstance;
}

export const prisma = getPrisma();

