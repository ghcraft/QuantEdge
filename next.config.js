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
    
    // Resolve Prisma Client gerado - garante que o caminho relativo funcione
    const path = require("path");
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    // Adiciona alias para garantir resolução correta
    config.resolve.alias["@/src/generated"] = path.resolve(__dirname, "src/generated");
    // Também resolve caminhos relativos corretamente
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, "."),
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

