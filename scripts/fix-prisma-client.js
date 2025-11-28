const fs = require('fs');
const path = require('path');

const prismaClientPath = path.resolve(__dirname, '../node_modules/.prisma/client');
const defaultDtsPath = path.join(prismaClientPath, 'default.d.ts');
const defaultJsPath = path.join(prismaClientPath, 'default.js');

if (!fs.existsSync(prismaClientPath)) {
  console.warn('⚠️  Prisma Client not found, skipping default.d.ts/default.js creation');
  process.exit(1);
}

// Cria o arquivo default.d.ts que re-exporta do client.ts
const dtsContent = `export * from './client';
export { PrismaClient } from './client';
`;

// Cria o arquivo default.js
// Solução mais direta: Exportar diretamente do @prisma/client sem verificação complexa
// O Node.js gerencia loops circulares através do cache de módulos
// Quando há um loop, o Node.js retorna o objeto parcial já carregado
// O spread operator em @prisma/client/index.js vai pegar as propriedades disponíveis
const jsContent = `// Export from @prisma/client
// This file is required by @prisma/client/index.js: ...require('.prisma/client/default')
// 
// Node.js handles circular dependencies by caching modules.
// When there's a circular dependency, Node.js returns the partially loaded module.
// The spread operator will get whatever properties are available at that moment.
//
// Simply export from @prisma/client - Node.js will handle the circular dependency
module.exports = require('@prisma/client');
`;

// Cria default.d.ts (TypeScript types)
fs.writeFileSync(defaultDtsPath, dtsContent);
console.log('✅ Created default.d.ts for Prisma Client');

// Cria default.js (JavaScript runtime - CommonJS)
fs.writeFileSync(defaultJsPath, jsContent);
console.log('✅ Created default.js for Prisma Client');
