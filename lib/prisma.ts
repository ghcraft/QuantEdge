// Lazy import do Prisma Client para evitar problemas de bundling
// Usa uma função getter para carregar apenas quando necessário
let prismaInstance: any = null;
let prismaError: Error | null = null;

function getPrisma() {
  // Se já tentou carregar e deu erro, retorna null
  if (prismaError) {
    throw prismaError;
  }

  if (prismaInstance) {
    return prismaInstance;
  }

  try {
    // Carrega Prisma Client apenas quando necessário (runtime)
    const { PrismaClient } = require('@prisma/client');
    
    const prismaOptions: any = {};

    if (process.env.NODE_ENV === 'development') {
      prismaOptions.log = ['error', 'warn'];
    }

    prismaInstance = new PrismaClient(prismaOptions);

    // Testa conexão
    prismaInstance.$connect().catch((err: Error) => {
      console.error('Erro ao conectar Prisma:', err);
      prismaError = err;
    });

    if (process.env.NODE_ENV !== 'production') {
      (globalThis as any).prisma = prismaInstance;
    }

    return prismaInstance;
  } catch (error: any) {
    console.error('Erro ao inicializar Prisma Client:', error);
    prismaError = error as Error;
    throw error;
  }
}

// Exporta um proxy que carrega o Prisma Client apenas quando acessado
export const prisma = new Proxy({} as any, {
  get(_target, prop) {
    const instance = getPrisma();
    const value = instance[prop];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
  ownKeys() {
    const instance = getPrisma();
    return Object.keys(instance);
  },
  has(_target, prop) {
    const instance = getPrisma();
    return prop in instance;
  },
  getOwnPropertyDescriptor(_target, prop) {
    const instance = getPrisma();
    return Object.getOwnPropertyDescriptor(instance, prop);
  },
});

