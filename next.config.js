/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para permitir leitura de arquivos JSON
  reactStrictMode: true,
  
  // Otimizações de performance para múltiplos acessos simultâneos
  compress: true, // Habilita compressão GZIP
  
  // Configurações de cache
  // experimental: {
  //   // Otimizações de renderização
  //   optimizeCss: true,
  // },
  
  // Headers de segurança e performance
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=30, stale-while-revalidate=60',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Otimizações de build
  swcMinify: true,
  
  // Configurações de produção
  poweredByHeader: false,
  
  // Desabilita geração estática para rotas de API que usam Prisma
  // Isso evita problemas com dependência circular durante o build
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Configurações do webpack para melhor resolução de módulos
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Garante que os módulos sejam resolvidos corretamente no cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        net: false,
        tls: false,
      };
    }
    
    // Resolve Prisma Client gerado
    const path = require("path");
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    
    // Alias para Prisma Client gerado em node_modules/.prisma/client
    config.resolve.alias[".prisma/client"] = path.resolve(__dirname, "node_modules/.prisma/client");
    
    // Adiciona o diretório raiz aos módulos para resolver caminhos relativos
    config.resolve.modules = [
      path.resolve(__dirname),
      ...(config.resolve.modules || ["node_modules"]),
    ];
    
    // Ignora warnings de módulos opcionais
    config.ignoreWarnings = [
      { module: /node_modules/ },
    ];
    
    // Externaliza @prisma/client completamente para evitar problemas com dependência circular
    if (isServer) {
      // Força externalização do Prisma Client
      config.externals = config.externals || [];
      
      const externalizePrisma = (context: any, request: string, callback: any) => {
        if (request.includes('@prisma/client') || request.includes('.prisma/client')) {
          return callback(null, `commonjs ${request}`);
        }
        if (typeof config.externals === 'function') {
          return config.externals(context, request, callback);
        }
        callback();
      };
      
      if (Array.isArray(config.externals)) {
        config.externals.push(externalizePrisma);
      } else if (typeof config.externals === 'function') {
        const originalExternals = config.externals;
        config.externals = [originalExternals, externalizePrisma];
      } else {
        config.externals = [externalizePrisma];
      }
    }
    
    return config;
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/icon.svg',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig

