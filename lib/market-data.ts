/**
 * Serviço de Dados de Mercado em Tempo Real
 * Integra com APIs públicas para obter dados reais de cotações
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
 * Busca dados reais de criptomoedas via Binance API
 */
export async function fetchCryptoPrice(symbol: string): Promise<MarketData | null> {
  try {
    // Converte símbolo para formato Binance (ex: BTCUSDT, ETHUSDT)
    const binanceSymbol = symbol.replace('BINANCE:', '').replace(':', '');
    
    // Adiciona timestamp único para forçar atualização em tempo real
    const timestamp = Date.now();
    const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}&timestamp=${timestamp}`, {
      cache: 'no-store', // Sem cache - dados sempre em tempo real
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Usa lastPrice (preço mais recente) para tempo real
    const price = parseFloat(data.lastPrice || data.price || 0);
    const openPrice = parseFloat(data.openPrice || price);
    const change = price - openPrice;
    const changePercent = openPrice > 0 ? (change / openPrice) * 100 : 0;
    
    // Calcula variação percentual de 24h se disponível (mais preciso)
    const priceChange24h = parseFloat(data.priceChangePercent || '0');
    const finalChangePercent = priceChange24h !== 0 ? priceChange24h : changePercent;

    return {
      symbol,
      price,
      change,
      changePercent: finalChangePercent,
      volume: parseFloat(data.volume || '0'),
      high24h: parseFloat(data.highPrice || price.toString()),
      low24h: parseFloat(data.lowPrice || price.toString()),
      marketCap: parseFloat(data.quoteVolume || '0'),
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error(`Erro ao buscar ${symbol}:`, error);
    return null;
  }
}

/**
 * Busca dados de ações via Alpha Vantage API (gratuita, mas limitada)
 * Alternativa: usar Yahoo Finance API não oficial
 */
export async function fetchStockPrice(symbol: string): Promise<MarketData | null> {
  try {
    // Remove prefixos (NASDAQ:, BMFBOVESPA:, etc)
    const cleanSymbol = symbol.replace(/^(NASDAQ|NYSE|BMFBOVESPA|INDEX):/, '');
    
    if (!cleanSymbol || cleanSymbol.length < 1) {
      console.error(`[Market Data] Símbolo limpo inválido: ${cleanSymbol} (original: ${symbol})`);
      return null;
    }
    
    // Usa API do Yahoo Finance (não oficial, mas gratuita)
    const yahooSymbol = cleanSymbol;
    
    // Para ações brasileiras, adiciona .SA
    const finalSymbol = symbol.includes('BMFBOVESPA') ? `${yahooSymbol}.SA` : yahooSymbol;
    
    // Adiciona timestamp único para forçar atualização em tempo real
    const timestamp = Date.now();
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${finalSymbol}?interval=1m&range=1d`;
    
    const response = await fetch(url, {
      cache: 'no-store', // Sem cache - dados sempre em tempo real
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error(`[Market Data] Yahoo Finance API error para ${finalSymbol}: ${response.status} - ${errorText.substring(0, 100)}`);
      return null;
    }

    const data = await response.json();
    
    if (!data.chart?.result?.[0]) {
      console.warn(`[Market Data] Nenhum resultado do Yahoo Finance para ${finalSymbol}`);
      return null;
    }

    const result = data.chart.result[0];
    const meta = result.meta;
    const quote = result.indicators?.quote?.[0];
    
    if (!meta) {
      console.warn(`[Market Data] Sem meta para ${finalSymbol}`);
      return null;
    }
    
    if (!quote) {
      console.warn(`[Market Data] Sem quote para ${finalSymbol}, usando apenas meta`);
    }

    // Usa preço de mercado regular ou preço atual (mais preciso para tempo real)
    const price = meta.regularMarketPrice || meta.currentPrice || meta.previousClose || 0;
    
    if (!price || price === 0) {
      console.warn(`[Market Data] Preço inválido para ${finalSymbol}:`, meta);
      return null;
    }
    
    const previousClose = meta.previousClose || price;
    const change = price - previousClose;
    const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;
    
    // Para dados em tempo real, usa os valores mais recentes do array
    const high24h = quote && quote.high && quote.high.length > 0 
      ? Math.max(...quote.high.filter(v => v !== null && v !== undefined))
      : meta.regularMarketDayHigh || price;
    const low24h = quote && quote.low && quote.low.length > 0
      ? Math.min(...quote.low.filter(v => v !== null && v !== undefined))
      : meta.regularMarketDayLow || price;
    const volume = quote && quote.volume && quote.volume.length > 0
      ? quote.volume[quote.volume.length - 1] || 0
      : meta.regularMarketVolume || 0;

    return {
      symbol,
      price,
      change,
      changePercent,
      volume,
      high24h,
      low24h,
      marketCap: meta.marketCap,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error(`[Market Data] Erro ao buscar ${symbol}:`, error);
    return null;
  }
}

/**
 * Busca dados de índice via Yahoo Finance
 */
export async function fetchIndexPrice(symbol: string): Promise<MarketData | null> {
  try {
    // Mapeia símbolos de índices para Yahoo Finance
    const indexMap: Record<string, string> = {
      'INDEX:SPX': '^GSPC', // S&P 500
      'INDEX:IXIC': '^IXIC', // NASDAQ
      'INDEX:DJI': '^DJI',   // Dow Jones
      'INDEX:IBOV': '^BVSP', // Ibovespa
      'BMFBOVESPA:IBOVESPA': '^BVSP', // Ibovespa (alternativo)
    };

    const yahooSymbol = indexMap[symbol];
    if (!yahooSymbol) {
      // Tenta gerar automaticamente se não estiver no mapa
      const autoSymbol = symbol.replace('INDEX:', '^').replace('BMFBOVESPA:', '');
      console.warn(`[Market Data] Índice ${symbol} não mapeado, tentando ${autoSymbol}`);
      // Retorna null para índices não mapeados conhecidos
      return null;
    }
    
    // Adiciona timestamp único para forçar atualização em tempo real
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1m&range=1d`;
    
    const response = await fetch(url, {
      cache: 'no-store', // Sem cache - dados sempre em tempo real
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error(`[Market Data] Yahoo Finance API error para índice ${yahooSymbol}: ${response.status} - ${errorText.substring(0, 100)}`);
      return null;
    }

    const data = await response.json();
    
    if (!data.chart?.result?.[0]) {
      console.warn(`[Market Data] Nenhum resultado do Yahoo Finance para índice ${yahooSymbol}`);
      return null;
    }

    const result = data.chart.result[0];
    const meta = result.meta;
    
    if (!meta) {
      console.warn(`[Market Data] Sem meta para índice ${yahooSymbol}`);
      return null;
    }

    // Usa preço de mercado regular ou preço atual (mais preciso para tempo real)
    const price = meta.regularMarketPrice || meta.currentPrice || meta.previousClose || 0;
    
    if (!price || price === 0) {
      console.warn(`[Market Data] Preço inválido para índice ${yahooSymbol}:`, meta);
      return null;
    }
    
    const previousClose = meta.previousClose || price;
    const change = price - previousClose;
    const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

    return {
      symbol,
      price,
      change,
      changePercent,
      volume: meta.regularMarketVolume || 0,
      high24h: meta.regularMarketDayHigh || meta.chartPreviousClose || price,
      low24h: meta.regularMarketDayLow || meta.chartPreviousClose || price,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error(`Erro ao buscar ${symbol}:`, error);
    return null;
  }
}

/**
 * Busca dados de mercado baseado no tipo do ativo
 */
export async function fetchMarketData(symbol: string, type: "Crypto" | "Ação" | "Ação BR" | "Índice"): Promise<MarketData | null> {
  if (type === "Crypto") {
    return fetchCryptoPrice(symbol);
  } else if (type === "Índice") {
    return fetchIndexPrice(symbol);
  } else {
    return fetchStockPrice(symbol);
  }
}

/**
 * Busca múltiplos ativos em paralelo
 */
export async function fetchMultipleMarketData(
  symbols: Array<{ symbol: string; type: "Crypto" | "Ação" | "Ação BR" | "Índice" }>
): Promise<Map<string, MarketData>> {
  const results = new Map<string, MarketData>();
  
  console.log(`[Market Data] Buscando dados para ${symbols.length} ativos...`);
  
  // Busca em paralelo (limitado a 15 requisições simultâneas para melhor performance)
  const batchSize = 15;
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const promises = batch.map(({ symbol, type }) =>
      fetchMarketData(symbol, type)
        .then(data => {
          if (data && data.price > 0) {
            successCount++;
            return { symbol, data };
          } else {
            errorCount++;
            console.warn(`[Market Data] Dados inválidos para ${symbol}:`, data);
            return { symbol, data: null };
          }
        })
        .catch(error => {
          errorCount++;
          console.error(`[Market Data] Erro ao buscar ${symbol} (${type}):`, error);
          return { symbol, data: null };
        })
    );
    
    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ symbol, data }) => {
      if (data && data.price > 0) {
        results.set(symbol, data);
      }
    });
    
    // Delay reduzido entre batches (200ms) para atualizações mais rápidas
    if (i + batchSize < symbols.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  console.log(`[Market Data] Busca concluída: ${successCount} sucessos, ${errorCount} erros, ${results.size} resultados válidos`);
  
  return results;
}

