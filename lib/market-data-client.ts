/**
 * Cliente para buscar dados de mercado via API route
 * Evita problemas de CSP fazendo requisições server-side
 */

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  marketCap?: number;
  timestamp: number;
}

/**
 * Busca dados de um único ativo via API route
 */
export async function fetchMarketDataClient(
  symbol: string,
  type: "Crypto" | "Ação" | "Ação BR" | "Índice"
): Promise<MarketData | null> {
  try {
    const response = await fetch(
      `/api/market-data?symbol=${encodeURIComponent(symbol)}&type=${encodeURIComponent(type)}`
    );

    if (!response.ok) {
      console.error(`[Market Data Client] Erro ${response.status} para ${symbol}`);
      return null;
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error(`[Market Data Client] Erro ao buscar ${symbol}:`, error);
    return null;
  }
}

/**
 * Busca dados de múltiplos ativos via API route
 */
export async function fetchMultipleMarketDataClient(
  symbols: Array<{ symbol: string; type: "Crypto" | "Ação" | "Ação BR" | "Índice" }>
): Promise<Map<string, MarketData>> {
  const results = new Map<string, MarketData>();

  try {
    const response = await fetch("/api/market-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symbols }),
    });

    if (!response.ok) {
      console.error(`[Market Data Client] Erro ${response.status} ao buscar múltiplos ativos`);
      return results;
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      return results;
    }

    // Converte objeto para Map
    Object.entries(result.data).forEach(([key, value]) => {
      results.set(key, value as MarketData);
    });

    return results;
  } catch (error) {
    console.error("[Market Data Client] Erro ao buscar múltiplos ativos:", error);
    return results;
  }
}


