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

    // Se não há notícias, retorna estrutura válida mas vazia
    if (!newsData || !newsData.news || newsData.news.length === 0) {
      // Força atualização em background (não bloqueia)
      import("@/lib/cron-job").then(({ updateNewsNow }) => {
        updateNewsNow().catch(() => {
          // Ignora erros em background
        });
      }).catch(() => {
        // Ignora erros de import
      });
      
      // Retorna estrutura válida mesmo sem notícias
      return NextResponse.json({
        lastUpdate: null,
        news: [],
      } as NewsData, {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30", // Cache menor quando vazio
          "X-RateLimit-Limit": "200",
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.resetAt.toString(),
        },
      });
    }
    
    // Valida e filtra notícias inválidas
    const validNews = newsData.news.filter((n) => 
      n && 
      n.title && 
      n.link && 
      typeof n.title === 'string' && 
      typeof n.link === 'string' &&
      n.title.trim().length > 0 &&
      n.link.trim().length > 0
    );
    
    // Se após validação não há notícias válidas, retorna vazio
    if (validNews.length === 0) {
      return NextResponse.json({
        lastUpdate: newsData.lastUpdate,
        news: [],
      } as NewsData, {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
          "X-RateLimit-Limit": "200",
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.resetAt.toString(),
        },
      });
    }

    // Retorna as notícias válidas com status 200 e headers otimizados
    return NextResponse.json({
      lastUpdate: newsData.lastUpdate,
      news: validNews,
    } as NewsData, {
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

