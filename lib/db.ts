/**
 * Cliente Prisma para acesso ao banco de dados
 * Singleton para evitar múltiplas instâncias
 */

// Lazy import to avoid circular dependency issues during Next.js build
// This ensures PrismaClient is only loaded when actually needed
let PrismaClient: any;
let prismaInstance: any;

declare global {
  // eslint-disable-next-line no-var
  var prisma: any;
}

function getPrismaClient() {
  if (!PrismaClient) {
    // Dynamic import to avoid circular dependency
    PrismaClient = require("@prisma/client").PrismaClient;
  }
  return PrismaClient;
}

// Singleton pattern para evitar múltiplas conexões em desenvolvimento
const prismaOptions = process.env.NODE_ENV === "development" 
  ? { log: ["query", "error", "warn"] as const }
  : { log: ["error"] as const };

function createPrismaInstance() {
  const PrismaClientClass = getPrismaClient();
  return new PrismaClientClass(prismaOptions as any);
}

export const prisma =
  global.prisma ||
  (prismaInstance || (prismaInstance = createPrismaInstance()));

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Helper para desconectar (útil em testes)
export async function disconnect() {
  await prisma.$disconnect();
}

