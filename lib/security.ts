/**
 * Sistema de Segurança
 * Proteção contra ataques comuns e validação de dados
 */

/**
 * Sanitiza strings para prevenir XSS
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  // Limita tamanho primeiro para prevenir DoS
  if (input.length > 10000) {
    logSecurityEvent("invalid_input", { reason: "input_too_large", length: input.length });
    return "";
  }

  // Remove caracteres perigosos
  return input
    .replace(/[<>]/g, "") // Remove < e >
    .replace(/javascript:/gi, "") // Remove javascript:
    .replace(/on\w+=/gi, "") // Remove event handlers (onclick, onerror, etc.)
    .replace(/data:/gi, "") // Remove data: URLs
    .replace(/vbscript:/gi, "") // Remove vbscript:
    .trim()
    .slice(0, 1000); // Limita tamanho final
}

/**
 * Valida e sanitiza símbolo de ativo
 */
export function validateSymbol(symbol: string): string | null {
  if (typeof symbol !== "string") {
    return null;
  }

  // Apenas letras, números e alguns caracteres especiais
  const sanitized = symbol
    .toUpperCase()
    .replace(/[^A-Z0-9:._-]/g, "")
    .trim()
    .slice(0, 20);

  if (sanitized.length < 1 || sanitized.length > 20) {
    return null;
  }

  return sanitized;
}

/**
 * Valida e sanitiza nome de ativo
 */
export function validateAssetName(name: string): string | null {
  if (typeof name !== "string") {
    return null;
  }

  const sanitized = sanitizeString(name).slice(0, 100);

  if (sanitized.length < 1 || sanitized.length > 100) {
    return null;
  }

  return sanitized;
}

/**
 * Valida quantidade (número positivo)
 */
export function validateQuantity(quantity: string | number): number | null {
  const num = typeof quantity === "string" ? parseFloat(quantity) : quantity;

  if (isNaN(num) || !isFinite(num)) {
    return null;
  }

  if (num < 0 || num > 1000000000) {
    return null; // Limite máximo de 1 bilhão
  }

  // Arredonda para 8 casas decimais (para criptomoedas)
  return Math.round(num * 100000000) / 100000000;
}

/**
 * Valida preço (número positivo)
 */
export function validatePrice(price: string | number): number | null {
  const num = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(num) || !isFinite(num)) {
    return null;
  }

  if (num < 0 || num > 1000000000) {
    return null; // Limite máximo de 1 bilhão
  }

  // Arredonda para 2 casas decimais
  return Math.round(num * 100) / 100;
}

/**
 * Valida tipo de ativo
 */
export function validateAssetType(type: string): "stock" | "index" | "crypto" | null {
  if (type === "stock" || type === "index" || type === "crypto") {
    return type;
  }
  return null;
}

/**
 * Valida ID de ativo
 */
export function validateAssetId(id: string): string | null {
  if (typeof id !== "string") {
    return null;
  }

  // Apenas letras, números, dois pontos e alguns caracteres especiais
  const sanitized = id
    .replace(/[^A-Z0-9:._-]/gi, "")
    .trim()
    .slice(0, 100);

  if (sanitized.length < 1 || sanitized.length > 100) {
    return null;
  }

  return sanitized;
}

/**
 * Gera token CSRF simples
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback para ambientes sem crypto
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Valida token CSRF
 */
export function validateCSRFToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) {
    return false;
  }

  // Comparação segura (timing-safe)
  if (token.length !== storedToken.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Valida origem da requisição
 */
export function validateOrigin(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) {
    return false;
  }

  try {
    const url = new URL(origin);
    return allowedOrigins.some((allowed) => {
      try {
        const allowedUrl = new URL(allowed);
        return url.hostname === allowedUrl.hostname && url.protocol === allowedUrl.protocol;
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}

/**
 * Log de segurança (em produção, enviar para serviço de logging)
 */
export function logSecurityEvent(
  type: "invalid_input" | "rate_limit" | "csrf_failure" | "xss_attempt" | "unauthorized",
  details: Record<string, any>
): void {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[SECURITY] ${type}:`, details);
  }
  // Em produção, enviar para serviço de logging/monitoramento
}

/**
 * Valida estrutura de dados do portfólio
 */
export function validatePortfolioAsset(data: any): {
  valid: boolean;
  sanitized?: {
    id: string;
    symbol: string;
    name: string;
    type: "stock" | "index" | "crypto";
    exchange?: string;
    quantity: number;
    avgPrice: number;
  };
  errors?: string[];
} {
  const errors: string[] = [];

  // Valida ID
  const id = validateAssetId(data?.id);
  if (!id) {
    errors.push("ID inválido");
  }

  // Valida símbolo
  const symbol = validateSymbol(data?.symbol);
  if (!symbol) {
    errors.push("Símbolo inválido");
  }

  // Valida nome
  const name = validateAssetName(data?.name);
  if (!name) {
    errors.push("Nome inválido");
  }

  // Valida tipo
  const type = validateAssetType(data?.type);
  if (!type) {
    errors.push("Tipo inválido");
  }

  // Valida exchange (opcional)
  const exchange = data?.exchange ? sanitizeString(data.exchange).slice(0, 50) : undefined;

  // Valida quantidade
  const quantity = validateQuantity(data?.quantity);
  if (quantity === null) {
    errors.push("Quantidade inválida");
  }

  // Valida preço médio
  const avgPrice = validatePrice(data?.avgPrice);
  if (avgPrice === null) {
    errors.push("Preço médio inválido");
  }

  if (errors.length > 0 || !id || !symbol || !name || !type || quantity === null || avgPrice === null) {
    logSecurityEvent("invalid_input", { errors, data });
    return { valid: false, errors };
  }

  return {
    valid: true,
    sanitized: {
      id,
      symbol,
      name,
      type,
      exchange,
      quantity,
      avgPrice,
    },
  };
}

