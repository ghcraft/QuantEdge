import { NextResponse } from "next/server";
import { updateNewsNow } from "@/lib/cron-job";
import { apiRateLimiter, getClientIdentifier } from "@/lib/rate-limit";
import { memoryCache } from "@/lib/cache";
import { validateOrigin, logSecurityEvent } from "@/lib/security";
// Importa o módulo de inicialização para garantir que o cron job está rodando
import "@/lib/server-init";

/**
 * API Route: POST /api/cron/update
 * Endpoint manual para forçar atualização das notícias
 * 
 * Útil para:
 * - Testar a busca de notícias sem esperar o cron
 * - Forçar atualização manual
 * - Integração com serviços externos (opcional)
 * 
 * Otimizações:
 * - Rate limiting (10 req/min por IP)
 * - Invalida cache após atualização
 */
export async function POST(request: Request) {
  try {
    // Validação de origem (apenas requisições do mesmo origin)
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    
    if (origin && host) {
      const allowedOrigins = [
        `https://${host}`,
        `http://${host}`,
        ...(process.env.ALLOWED_ORIGINS?.split(",") || []),
      ];
      
      if (!validateOrigin(origin, allowedOrigins)) {
        logSecurityEvent("unauthorized", { origin, host, endpoint: "/api/cron/update" });
        return NextResponse.json(
          { error: "Origem não autorizada" },
          { status: 403 }
        );
      }
    }

    // Rate limiting mais restritivo para atualizações
    const clientId = getClientIdentifier(request);
    const rateLimit = apiRateLimiter.check(clientId);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: "Muitas requisições. Aguarde antes de tentar novamente.",
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.resetAt.toString(),
          }
        }
      );
    }

    // Força atualização imediata
    await updateNewsNow();

    // Invalida cache de notícias
    memoryCache.delete("news:latest");

    return NextResponse.json(
      { message: "Notícias atualizadas com sucesso" },
      { 
        status: 200,
        headers: {
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.resetAt.toString(),
        }
      }
    );
  } catch (error) {
    console.error("Erro ao atualizar notícias:", error);
    
    return NextResponse.json(
      { error: "Erro ao atualizar notícias. Tente novamente em alguns instantes." },
      { 
        status: 500,
        headers: {
          "Retry-After": "10",
        }
      }
    );
  }
}

