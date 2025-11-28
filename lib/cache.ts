/**
 * Sistema de Cache em Memória
 * Para suportar múltiplos acessos simultâneos sem sobrecarregar o sistema
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly defaultTTL: number = 60000; // 60 segundos por padrão
  private readonly maxSize: number = 1000; // Limite máximo de entradas para prevenir uso excessivo de memória

  /**
   * Armazena um valor no cache
   * Implementa LRU (Least Recently Used) quando atinge o limite
   */
  set<T>(key: string, data: T, ttl?: number): void {
    // Se atingiu o limite, remove a entrada mais antiga
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      // Remove a entrada mais antiga (LRU simples)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    });
  }

  /**
   * Obtém um valor do cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Verifica se expirou
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Verifica se uma chave existe e não expirou
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Remove uma chave do cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Limpa entradas expiradas
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Retorna o tamanho do cache
   */
  size(): number {
    return this.cache.size;
  }
}

// Instância global do cache
export const memoryCache = new MemoryCache();

// Limpa cache expirado a cada 5 minutos
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    memoryCache.cleanup();
  }, 5 * 60 * 1000);
}

/**
 * Helper para cache com função assíncrona
 */
export async function cached<T>(
  key: string,
  fn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Tenta obter do cache primeiro
  const cached = memoryCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Se não estiver em cache, executa a função
  const result = await fn();
  
  // Armazena no cache
  memoryCache.set(key, result, ttl);
  
  return result;
}

