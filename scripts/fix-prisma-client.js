const fs = require('fs');
const path = require('path');

const prismaClientPath = path.resolve(__dirname, '../node_modules/.prisma/client');
const defaultDtsPath = path.join(prismaClientPath, 'default.d.ts');
const defaultJsPath = path.join(prismaClientPath, 'default.js');

// Cria o arquivo default.d.ts que re-exporta do client.ts
const dtsContent = `export * from './client';
export { PrismaClient } from './client';
`;

// Cria o arquivo default.js que re-exporta do client.js
const jsContent = `module.exports = require('./client');
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

