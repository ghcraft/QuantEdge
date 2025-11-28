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
const jsContent = `// Export from @prisma/client with lazy loading
// This file is required by @prisma/client/index.js: ...require('.prisma/client/default')
// 
// IMPORTANT: This file MUST be CommonJS (enforced by package.json in this directory)
// We use a getter to lazily load PrismaClient, avoiding circular dependency issues

const exports = {};

// Use Object.defineProperty to create a lazy getter for PrismaClient
Object.defineProperty(exports, 'PrismaClient', {
  get: function() {
    // Lazy load from @prisma/client when accessed
    const prisma = require('@prisma/client');
    return prisma.PrismaClient;
  },
  enumerable: true,
  configurable: true
});

// For other properties, we can copy them immediately
// But we need to be careful about circular dependencies
try {
  const prisma = require('@prisma/client');
  // Copy all properties except PrismaClient (which we handle with getter)
  for (const key in prisma) {
    if (key !== 'PrismaClient' && !exports.hasOwnProperty(key)) {
      try {
        exports[key] = prisma[key];
      } catch (e) {
        // Ignore errors for individual properties
      }
    }
  }
} catch (e) {
  // If there's an error, at least PrismaClient will work via getter
  // Don't log in production to avoid noise
  if (process.env.NODE_ENV === 'development') {
    console.warn('Warning: Could not copy all properties from @prisma/client:', e.message);
  }
}

module.exports = exports;
`;

// Cria default.d.ts (TypeScript types)
fs.writeFileSync(defaultDtsPath, dtsContent);
console.log('✅ Created default.d.ts for Prisma Client');

// Cria default.js (JavaScript runtime - CommonJS)
fs.writeFileSync(defaultJsPath, jsContent);
console.log('✅ Created default.js for Prisma Client');
