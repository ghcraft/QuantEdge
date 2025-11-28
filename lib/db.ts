/**
 * Cliente Prisma para acesso ao banco de dados
 * Singleton para evitar múltiplas instâncias
 */

import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Singleton pattern para evitar múltiplas conexões em desenvolvimento
const prismaOptions = process.env.NODE_ENV === "development" 
  ? { log: ["query", "error", "warn"] as const }
  : { log: ["error"] as const };

export const prisma =
  global.prisma ||
  new PrismaClient(prismaOptions as any);

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Helper para desconectar (útil em testes)
export async function disconnect() {
  await prisma.$disconnect();
}

