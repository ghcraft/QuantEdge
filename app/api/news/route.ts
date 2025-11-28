import { NextResponse } from "next/server";
import { loadNews } from "@/lib/news-storage";
import { NewsData } from "@/types/news";
import { cached } from "@/lib/cache";
import { newsRateLimiter, getClientIdentifier } from "@/lib/rate-limit";
// Importa o módulo de inicialização para garantir que o cron job está rodando
import "@/lib/server-init";

// Força renderização dinâmica (usa request.headers)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * API Route: GET /api/news
 * Retorna as notícias salvas no arquivo JSON
 * 
 * Esta rota é chamada pelo frontend para buscar as notícias
 * e atualizar o feed em tempo real
 * 
 * Otimizações:
 * - Cache em memória (30 segundos)
 * - Rate limiting (200 req/min por IP)
 * - Headers de cache apropriados
 */
export async function GET(request: Request) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimit = newsRateLimiter.check(clientId);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: "Muitas requisições. Tente novamente em alguns instantes.",
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": "200",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.resetAt.toString(),
          }
        }
      );
    }

    // Usa cache em memória (30 segundos) para reduzir I/O
    const newsData = await cached<NewsData | null>(
      "news:latest",
      async () => {
        return await loadNews();
      },
      30000 // 30 segundos
    );

    if (!newsData) {
      // Se não há notícias ainda, retorna array vazio
      return NextResponse.json({
        lastUpdate: null,
        news: [],
      } as NewsData, {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
          "X-RateLimit-Limit": "200",
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.resetAt.toString(),
        },
      });
    }

    // Retorna as notícias com status 200 e headers otimizados
    return NextResponse.json(newsData, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        "X-RateLimit-Limit": "200",
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        "X-RateLimit-Reset": rateLimit.resetAt.toString(),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    
    // Em caso de erro, retorna erro 500 com retry-after
    return NextResponse.json(
      { error: "Erro ao buscar notícias. Tente novamente em alguns instantes." },
      { 
        status: 500,
        headers: {
          "Retry-After": "5",
        }
      }
    );
  }
}

