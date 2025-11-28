/**
 * Sistema de Rate Limiting
 * Previne abuso e sobrecarga do servidor
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  /**
   * Verifica se uma requisição pode ser processada
   */
  check(identifier: string): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    // Se não existe entrada ou a janela expirou, cria nova
    if (!entry || now > entry.resetAt) {
      this.limits.set(identifier, {
        count: 1,
        resetAt: now + this.windowMs,
      });

      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetAt: now + this.windowMs,
      };
    }

    // Se ainda está na janela, incrementa contador
    if (entry.count < this.maxRequests) {
      entry.count++;
      this.limits.set(identifier, entry);

      return {
        allowed: true,
        remaining: this.maxRequests - entry.count,
        resetAt: entry.resetAt,
      };
    }

    // Limite excedido
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  /**
   * Limpa entradas expiradas
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetAt) {
        this.limits.delete(key);
      }
    }
  }
}

// Rate limiters para diferentes endpoints
export const apiRateLimiter = new RateLimiter(60000, 100); // 100 req/min
export const newsRateLimiter = new RateLimiter(60000, 200); // 200 req/min (mais permissivo para notícias)
export const authRateLimiter = new RateLimiter(60000, 5); // 5 req/min para autenticação (proteção contra brute force)

// Limpa rate limits expirados a cada minuto
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    apiRateLimiter.cleanup();
    newsRateLimiter.cleanup();
  }, 60000);
}

/**
 * Obtém identificador do cliente (IP ou chave)
 */
export function getClientIdentifier(request: Request): string {
  // Tenta obter IP do header X-Forwarded-For ou X-Real-IP
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback para um identificador genérico
  return "unknown";
}

