/**
 * Cliente Prisma para acesso ao banco de dados
 * Singleton para evitar múltiplas instâncias
 * 
 * IMPORTANTE: Este arquivo usa require() dinâmico para evitar problemas
 * de dependência circular durante o build do Next.js
 */

declare global {
  // eslint-disable-next-line no-var
  var prisma: any;
}

// Lazy load PrismaClient - só carrega quando realmente necessário
// Isso evita problemas de dependência circular durante o build
let prismaInstance: any = null;

function getPrisma() {
  if (prismaInstance) {
    return prismaInstance;
  }

  // Usa require() em vez de import para evitar problemas no build
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require("@prisma/client");
  
  const prismaOptions = process.env.NODE_ENV === "development" 
    ? { log: ["query", "error", "warn"] as const }
    : { log: ["error"] as const };

  prismaInstance = new PrismaClient(prismaOptions as any);

  if (process.env.NODE_ENV !== "production") {
    global.prisma = prismaInstance;
  }

  return prismaInstance;
}

// Exporta uma função getter em vez de uma instância direta
// Isso garante que o Prisma só é carregado quando necessário
// Usa Proxy para interceptar todas as chamadas
export const prisma = new Proxy({} as any, {
  get(target, prop) {
    const instance = getPrisma();
    const value = instance[prop];
    // Se for uma função, bind para manter o contexto
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
  ownKeys() {
    const instance = getPrisma();
    return Object.keys(instance);
  },
  has(target, prop) {
    const instance = getPrisma();
    return prop in instance;
  },
  getOwnPropertyDescriptor(target, prop) {
    const instance = getPrisma();
    return Object.getOwnPropertyDescriptor(instance, prop);
  }
});

// Helper para desconectar (útil em testes)
export async function disconnect() {
  const instance = getPrisma();
  await instance.$disconnect();
}

// Helper para desconectar (útil em testes)
export async function disconnect() {
  await prisma.$disconnect();
}

