const fs = require('fs');
const path = require('path');

const prismaClientPath = path.resolve(__dirname, '../node_modules/.prisma/client');
const defaultDtsPath = path.join(prismaClientPath, 'default.d.ts');
const defaultJsPath = path.join(prismaClientPath, 'default.js');
const packageJsonPath = path.join(prismaClientPath, 'package.json');

if (!fs.existsSync(prismaClientPath)) {
  console.warn('⚠️  Prisma Client not found, skipping default.d.ts/default.js creation');
  process.exit(1);
}

// Cria package.json para forçar CommonJS
const packageJsonContent = {
  type: "commonjs"
};
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 2));
console.log('✅ Created package.json to force CommonJS');

// Cria o arquivo default.d.ts que re-exporta do client.ts
const dtsContent = `export * from './client';
export { PrismaClient } from './client';
`;

// Cria o arquivo default.js
// IMPORTANTE: O arquivo precisa ser CommonJS puro
// Criamos package.json acima para garantir que seja tratado como CommonJS
// Solução: re-exportar diretamente de @prisma/client
// Node.js lida com dependências circulares retornando módulos parcialmente inicializados
// O Webpack também deve lidar com isso corretamente
const jsContent = `// Export from @prisma/client
// This file is required by @prisma/client/index.js: ...require('.prisma/client/default')
// 
// IMPORTANT: This file MUST be CommonJS (enforced by package.json in this directory)
// Simple solution: re-export everything from @prisma/client
// Node.js and Webpack handle circular dependencies by returning partially initialized modules

// Direct re-export - Node.js/Webpack will handle the circular dependency
module.exports = require('@prisma/client');
`;

// Cria default.d.ts (TypeScript types)
fs.writeFileSync(defaultDtsPath, dtsContent);
console.log('✅ Created default.d.ts for Prisma Client');

// Cria default.js (JavaScript runtime - CommonJS)
fs.writeFileSync(defaultJsPath, jsContent);
console.log('✅ Created default.js for Prisma Client');
