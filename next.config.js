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
  
  // Ignora erros do ESLint durante o build (warnings não impedem o deploy)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Não falhar o build por causa de erros de tipo
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Desabilita completamente a geração estática durante o build
  // Isso evita problemas com Context durante o prerender
  output: 'standalone',
  
  // Desabilita completamente o prerender para evitar erros com Context
  // Isso força todas as páginas a serem renderizadas dinamicamente
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  
  // Configurações experimentais
  // Desabilita geração estática para rotas de API que usam Prisma
  // Isso evita problemas com dependência circular durante o build
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Desabilita completamente o prerender
    isrMemoryCacheSize: 0,
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

