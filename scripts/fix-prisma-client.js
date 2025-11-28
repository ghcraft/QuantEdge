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
// Solução: Construir PrismaClient diretamente do runtime usando o config do arquivo gerado
// Isso evita o loop circular completamente
const jsContent = `// Export PrismaClient from runtime
// This file is required by @prisma/client/index.js: ...require('.prisma/client/default')
// We construct PrismaClient directly from runtime to avoid circular dependency

const runtime = require('@prisma/client/runtime/client');
const path = require('path');
const fs = require('fs');

// Read the config from the generated class.ts file
// The config is embedded in the file, we'll extract it
let config;
try {
  // Try to read the config from internal/class.ts
  const classPath = path.join(__dirname, 'internal', 'class.ts');
  const classContent = fs.readFileSync(classPath, 'utf-8');
  
  // Extract config object from the file
  // The config is defined as: const config: runtime.GetPrismaClientConfig = { ... }
  const configMatch = classContent.match(/const config[^=]*=\\s*({[\\s\\S]*?});/);
  if (configMatch) {
    // Evaluate the config object (it's valid JavaScript)
    config = eval('(' + configMatch[1] + ')');
  }
} catch (e) {
  console.warn('Could not read config from class.ts, using fallback');
}

// If we couldn't read the config, try to get PrismaClient from @prisma/client
// This will cause a circular dependency, but it's the only fallback
if (!config) {
  try {
    const prisma = require('@prisma/client');
    if (typeof prisma.PrismaClient === 'function') {
      module.exports = prisma;
      return;
    }
  } catch (e) {
    // Ignore
  }
}

// Construct PrismaClient from runtime
let PrismaClientClass;
try {
  if (config) {
    PrismaClientClass = runtime.getPrismaClient(config);
  } else {
    // Fallback: try to get from @prisma/client
    const prisma = require('@prisma/client');
    PrismaClientClass = prisma.PrismaClient;
  }
} catch (e) {
  console.error('Error constructing PrismaClient:', e.message);
  // Last resort: dummy constructor
  PrismaClientClass = class PrismaClient {
    constructor() {
      throw new Error('PrismaClient could not be loaded. Please run: npx prisma generate');
    }
  };
}

// Export what @prisma/client/index.js expects
module.exports = {
  PrismaClient: PrismaClientClass,
};
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
