/**
 * Sistema de Atualização de Preços em Tempo Real
 * Usa APIs reais para buscar preços de ativos do portfólio
 */

import { PortfolioAsset } from "./portfolio";

/**
 * Interface para resposta de preço
 */
interface PriceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

/**
 * Busca preço real de um ativo via API
 */
async function fetchPrice(symbol: string, type: "stock" | "index" | "crypto"): Promise<PriceData | null> {
  try {
    const { fetchMarketData } = await import("./market-data");
    
    // Converte tipo do portfólio para tipo da API
    let assetType: "Crypto" | "Ação" | "Ação BR" | "Índice" = "Ação";
    if (type === "crypto") {
      assetType = "Crypto";
    } else if (type === "index") {
      assetType = "Índice";
    } else {
      // Tenta determinar se é ação brasileira
      if (symbol.includes("3") || symbol.includes("4") || symbol.includes("VALE") || symbol.includes("PETR")) {
        assetType = "Ação BR";
      }
    }
    
    // Constrói símbolo completo para API
    let fullSymbol = symbol;
    if (type === "crypto") {
      fullSymbol = `BINANCE:${symbol}USDT`;
    } else if (type === "index") {
      fullSymbol = `INDEX:${symbol}`;
    } else if (assetType === "Ação BR") {
      fullSymbol = `BMFBOVESPA:${symbol}`;
    } else {
      fullSymbol = `NASDAQ:${symbol}`;
    }
    
    const marketData = await fetchMarketData(fullSymbol, assetType);
    
    if (marketData) {
      return {
        symbol,
        price: marketData.price,
        change: marketData.change,
        changePercent: marketData.changePercent,
        timestamp: marketData.timestamp,
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Erro ao buscar preço para ${symbol}:`, error);
    return null;
  }
}

/**
 * Atualiza preços de todos os ativos do portfólio
 */
export async function updatePortfolioPrices(assets: PortfolioAsset[]): Promise<Map<string, PriceData>> {
  const priceMap = new Map<string, PriceData>();

  // Busca preços em paralelo (limitado a 10 requisições simultâneas)
  const batchSize = 10;
  for (let i = 0; i < assets.length; i += batchSize) {
    const batch = assets.slice(i, i + batchSize);
    const promises = batch.map(asset => 
      fetchPrice(asset.symbol, asset.type).then(price => {
        if (price) {
          priceMap.set(asset.id, price);
        }
      })
    );
    await Promise.all(promises);
  }

  return priceMap;
}

/**
 * Atualiza preço de um ativo específico no portfólio
 */
export async function updateAssetPrice(asset: PortfolioAsset): Promise<number | null> {
  const priceData = await fetchPrice(asset.symbol, asset.type);
  return priceData ? priceData.price : null;
}


