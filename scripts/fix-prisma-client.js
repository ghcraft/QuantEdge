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
// O spread operator precisa de um objeto com propriedades, não getters
// Solução: Exportar diretamente do @prisma/client
// Node.js cacheia módulos, então o require circular é seguro
// O spread operator vai pegar as propriedades do objeto já carregado
const jsContent = `// Export from @prisma/client
// This file is required by @prisma/client/index.js: ...require('.prisma/client/default')
// Node.js caches modules, so circular require is safe
// The spread operator will get properties from the cached module
let prismaExports;

// Check if @prisma/client is already in cache (loaded)
const prismaPath = require.resolve('@prisma/client');
if (require.cache[prismaPath] && require.cache[prismaPath].exports) {
  // Use cached version to avoid re-execution
  prismaExports = require.cache[prismaPath].exports;
} else {
  // Load @prisma/client (Node.js will cache it)
  // This may cause a circular dependency, but Node.js handles it
  prismaExports = require('@prisma/client');
}

// Export everything that @prisma/client exports
// The spread operator in @prisma/client/index.js expects this
module.exports = prismaExports;
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
