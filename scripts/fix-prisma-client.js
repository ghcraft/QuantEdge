const fs = require('fs');
const path = require('path');

const prismaClientPath = path.resolve(__dirname, '../node_modules/.prisma/client');
const defaultDtsPath = path.join(prismaClientPath, 'default.d.ts');
const defaultJsPath = path.join(prismaClientPath, 'default.js');

if (!fs.existsSync(prismaClientPath)) {
  console.warn('⚠️  Prisma Client not found, skipping default.d.ts/default.js creation');
  process.exit(1);
}

// Cria o arquivo default.d.ts que re-exporta do index.ts (ou client.ts se existir)
const dtsContent = `export * from './index';
export { PrismaClient } from './index';
`;

// Cria o arquivo default.js
// Solução mais simples: Exportar diretamente do @prisma/client
// O Node.js gerencia loops circulares através do cache de módulos
// Quando há um loop, o Node.js retorna o objeto parcial já carregado
const jsContent = `// Export from @prisma/client
// This file is required by @prisma/client/index.js: ...require('.prisma/client/default')
// 
// IMPORTANT: Node.js handles circular dependencies by caching modules.
// When @prisma/client/index.js requires this file, and this file requires @prisma/client,
// Node.js will return the partially loaded module from cache.
// 
// The spread operator in @prisma/client/index.js will get properties from the cached module.
// We need to ensure PrismaClient is available even during the circular dependency.

let prismaExports;

// Check if we're in a circular dependency situation
const prismaPath = require.resolve('@prisma/client');
const cachedModule = require.cache[prismaPath];

if (cachedModule && cachedModule.exports && typeof cachedModule.exports.PrismaClient === 'function') {
  // Module is already loaded (or partially loaded), use cached version
  prismaExports = cachedModule.exports;
} else {
  // Module not in cache yet, require it
  // This may cause circular dependency, but Node.js will handle it
  try {
    prismaExports = require('@prisma/client');
    
    // Verify PrismaClient is a constructor
    if (typeof prismaExports.PrismaClient !== 'function') {
      // If PrismaClient is not available yet (circular dependency), 
      // create a proxy that will get it when accessed
      prismaExports = new Proxy({}, {
        get: function(target, prop) {
          if (prop === 'PrismaClient') {
            // Try to get PrismaClient from the now-loaded module
            const prisma = require('@prisma/client');
            if (typeof prisma.PrismaClient === 'function') {
              return prisma.PrismaClient;
            }
          }
          // For other properties, get from @prisma/client
          const prisma = require('@prisma/client');
          return prisma[prop];
        },
        has: function(target, prop) {
          const prisma = require('@prisma/client');
          return prop in prisma;
        },
        ownKeys: function(target) {
          const prisma = require('@prisma/client');
          return Object.keys(prisma);
        }
      });
    }
  } catch (e) {
    console.error('Error loading @prisma/client in default.js:', e.message);
    // Return minimal object to prevent complete failure
    prismaExports = {
      PrismaClient: class PrismaClient {
        constructor() {
          throw new Error('PrismaClient could not be loaded. Please ensure prisma generate has been run and the database is accessible.');
        }
      }
    };
  }
}

module.exports = prismaExports;
`;

// Cria default.d.ts (TypeScript types)
fs.writeFileSync(defaultDtsPath, dtsContent);
console.log('✅ Created default.d.ts for Prisma Client');

// Cria default.js (JavaScript runtime - CommonJS)
fs.writeFileSync(defaultJsPath, jsContent);
console.log('✅ Created default.js for Prisma Client');
