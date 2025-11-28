const fs = require('fs');
const path = require('path');

const prismaClientPath = path.resolve(__dirname, '../node_modules/.prisma/client');
const defaultDtsPath = path.join(prismaClientPath, 'default.d.ts');
const defaultJsPath = path.join(prismaClientPath, 'default.js');

// Cria o arquivo default.d.ts que re-exporta do client.ts
const dtsContent = `export * from './client';
export { PrismaClient } from './client';
`;

// Cria o arquivo default.js
// O problema: @prisma/client/index.js faz: ...require('.prisma/client/default')
// Mas o Prisma 7 gera apenas .ts, não .js
// Solução: Como o Prisma gera apenas TypeScript, precisamos usar uma abordagem diferente
// Vamos criar um arquivo que exporta do @prisma/client, mas usando uma flag para evitar loop
// O spread operator no @prisma/client/index.js apenas espalha propriedades, então não há loop real
const jsContent = `// Export from @prisma/client
// This file is required by @prisma/client/index.js: ...require('.prisma/client/default')
// The spread operator only spreads properties, so circular require is safe
// We use a flag to prevent infinite recursion during module loading
if (global.__prisma_default_loading) {
  // If already loading, return empty object to break circular dependency
  module.exports = {};
} else {
  global.__prisma_default_loading = true;
  try {
    const prisma = require('@prisma/client');
    module.exports = prisma;
  } finally {
    delete global.__prisma_default_loading;
  }
}
`;

if (fs.existsSync(prismaClientPath)) {
  // Garante que o diretório existe
  if (!fs.existsSync(prismaClientPath)) {
    fs.mkdirSync(prismaClientPath, { recursive: true });
  }
  
  // Cria default.d.ts (TypeScript types)
  fs.writeFileSync(defaultDtsPath, dtsContent);
  console.log('✅ Created default.d.ts for Prisma Client');
  
  // Cria default.js (JavaScript runtime - CommonJS)
  fs.writeFileSync(defaultJsPath, jsContent);
  console.log('✅ Created default.js for Prisma Client');
} else {
  console.warn('⚠️  Prisma Client not found, skipping default.d.ts/default.js creation');
  process.exit(1);
}
