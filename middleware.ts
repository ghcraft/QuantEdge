import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware para segurança e otimizações globais
 * - Headers de segurança robustos
 * - Content Security Policy
 * - HSTS
 * - Proteção contra clickjacking
 * - Validação de origem
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  // Headers de segurança básicos
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  // HSTS (HTTP Strict Transport Security) - apenas em HTTPS
  if (request.nextUrl.protocol === "https:") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://s3.tradingview.com https://*.tradingview.com", // TradingView requer unsafe-inline
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Permite Google Fonts
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com", // Permite fontes do Google
    // Permite conexões para APIs de mercado em tempo real e CDNs
    "connect-src 'self' https://s3.tradingview.com https://*.tradingview.com wss://*.tradingview.com https://api.binance.com https://query1.finance.yahoo.com https://cdn.jsdelivr.net https://geo.datav.aliyun.com https://raw.githubusercontent.com https://api.worldbank.org",
    "frame-src 'self' https://s3.tradingview.com https://*.tradingview.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  // Validação de origem para APIs
  if (request.nextUrl.pathname.startsWith("/api")) {
    // Permite apenas requisições do mesmo origin ou origens conhecidas
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        const hostUrl = new URL(`https://${host}`);
        
        // Se a origem não é do mesmo domínio, verifica se é permitida
        if (originUrl.hostname !== hostUrl.hostname) {
          // Em produção, adicionar lista de origens permitidas
          const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
          if (!allowedOrigins.includes(origin)) {
            // Bloqueia requisições de origens não autorizadas
            return new NextResponse("Forbidden", { status: 403 });
          }
        }
      } catch {
        // Se não conseguir parsear, bloqueia
        return new NextResponse("Forbidden", { status: 403 });
      }
    }
  }

  // Headers de performance
  if (request.nextUrl.pathname.startsWith("/_next/static")) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (request.nextUrl.pathname.startsWith("/api")) {
    // Cache para APIs é gerenciado individualmente
    response.headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
  }

  // Limita tamanho de requisição para prevenir DoS
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB
    return new NextResponse("Request too large", { status: 413 });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next (all Next.js internal files)
     * - api (API routes are handled separately)
     * - static files (images, fonts, etc.)
     */
    "/((?!_next|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
};

