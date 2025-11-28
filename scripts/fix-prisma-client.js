const fs = require('fs');
const path = require('path');

const prismaClientPath = path.resolve(__dirname, '../node_modules/.prisma/client');
const defaultDtsPath = path.join(prismaClientPath, 'default.d.ts');

// Cria o arquivo default.d.ts que re-exporta do client.ts
const content = `export * from './client';
export { PrismaClient } from './client';
`;

if (fs.existsSync(prismaClientPath)) {
  fs.writeFileSync(defaultDtsPath, content);
  console.log('✅ Created default.d.ts for Prisma Client');
} else {
  console.warn('⚠️  Prisma Client not found, skipping default.d.ts creation');
}

