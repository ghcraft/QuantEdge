/**
 * Cliente Prisma para acesso ao banco de dados
 * Singleton para evitar múltiplas instâncias
 */

import { PrismaClient } from "../src/generated";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Singleton pattern para evitar múltiplas conexões em desenvolvimento
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Helper para desconectar (útil em testes)
export async function disconnect() {
  await prisma.$disconnect();
}

