"use client";

import FinancialChart from "./FinancialChart";
import FavoriteButton from "./FavoriteButton";
import { useState, useEffect, useMemo } from "react";
import { fetchMultipleMarketDataClient } from "@/lib/market-data-client";
import { isMarketOpen } from "@/lib/market-hours";
import Link from "next/link";

interface Asset {
  symbol: string;
  name: string;
  short: string;
  type: "Crypto" | "Ação" | "Ação BR" | "Índice";
}

interface AssetData extends Asset {
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  marketCap?: number;
  lastUpdate: Date;
}

/**
 * Componente MarketOverview
 * Exibe visão geral profissional e complexa do mercado com dados em tempo real
 * Inclui ações, índices de bolsas e criptomoedas com métricas avançadas
 */
export default function MarketOverview() {
  const [activeTab, setActiveTab] = useState<"stocks" | "indices" | "crypto">("stocks");
  const [assetsData, setAssetsData] = useState<Map<string, AssetData>>(new Map());
  const [loading, setLoading] = useState(true);

  // Ativos principais para cada categoria - Reduzido para versão minimalista
  const stocks: Asset[] = [
    { symbol: "NASDAQ:AAPL", name: "Apple Inc.", short: "AAPL", type: "Ação" },
    { symbol: "NASDAQ:MSFT", name: "Microsoft", short: "MSFT", type: "Ação" },
    { symbol: "NYSE:TSLA", name: "Tesla Inc.", short: "TSLA", type: "Ação" },
  ];

  const indices: Asset[] = [
    { symbol: "INDEX:SPX", name: "S&P 500", short: "SPX", type: "Índice" },
    { symbol: "INDEX:IXIC", name: "NASDAQ", short: "IXIC", type: "Índice" },
    { symbol: "INDEX:IBOV", name: "Ibovespa", short: "IBOV", type: "Índice" },
  ];

  const crypto: Asset[] = [
    { symbol: "BINANCE:BTCUSDT", name: "Bitcoin", short: "BTC/USD", type: "Crypto" },
    { symbol: "BINANCE:ETHUSDT", name: "Ethereum", short: "ETH/USD", type: "Crypto" },
    { symbol: "BINANCE:SOLUSDT", name: "Solana", short: "SOL/USD", type: "Crypto" },
  ];

  const getActiveAssets = (): Asset[] => {
    switch (activeTab) {
      case "stocks":
        return stocks;
      case "indices":
        return indices;
      case "crypto":
        return crypto;
      default:
        return stocks;
    }
  };

  // Atualiza dados dos ativos em tempo real
  useEffect(() => {
    let mounted = true;
    
    const updateAssetsData = async () => {
      try {
        const activeAssets = getActiveAssets();
        const symbolsToFetch = activeAssets.map(a => ({ symbol: a.symbol, type: a.type }));
        
        const realData = await fetchMultipleMarketDataClient(symbolsToFetch);
        
        if (!mounted) return;
        
        setAssetsData((prevData) => {
          const newAssetsData = new Map<string, AssetData>();
          
          activeAssets.forEach((asset) => {
            const marketData = realData.get(asset.symbol);
            
            if (marketData) {
              newAssetsData.set(asset.symbol, {
                ...asset,
                price: marketData.price,
                change: marketData.change,
                changePercent: marketData.changePercent,
                high24h: marketData.high24h || marketData.price,
                low24h: marketData.low24h || marketData.price,
                volume: marketData.volume || 0,
                marketCap: marketData.marketCap,
                lastUpdate: new Date(),
              });
            } else {
              // Mantém dados anteriores se API falhar
              const previousData = prevData.get(asset.symbol);
              if (previousData) {
                newAssetsData.set(asset.symbol, previousData);
              }
            }
          });
          
          return newAssetsData;
        });
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Erro ao atualizar dados do mercado:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    updateAssetsData();
    const interval = setInterval(updateAssetsData, 15000); // Atualiza a cada 15 segundos
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [activeTab]);

  const formatPrice = (price: number, type: string): string => {
    if (type === "Crypto") {
      return `$${price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (type === "Índice") {
      return price.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    } else if (type === "Ação BR") {
      return `R$ ${price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(2)}B`;
    } else if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)}K`;
    }
    return volume.toFixed(0);
  };

  const activeAssets = getActiveAssets();

  return (
    <div className="w-full">
      {/* Tabs de navegação - Minimalista */}
      <div className="flex space-x-1 mb-6 bg-dark-bg-secondary/30 border border-dark-border/30 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab("stocks")}
          className={`relative px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
            activeTab === "stocks"
              ? "text-dark-accent bg-dark-accent/10"
              : "text-dark-text-muted hover:text-dark-text hover:bg-dark-card-hover/50"
          }`}
        >
          AÇÕES
        </button>
        <button
          onClick={() => setActiveTab("indices")}
          className={`relative px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
            activeTab === "indices"
              ? "text-dark-accent bg-dark-accent/10"
              : "text-dark-text-muted hover:text-dark-text hover:bg-dark-card-hover/50"
          }`}
        >
          ÍNDICES
        </button>
        <button
          onClick={() => setActiveTab("crypto")}
          className={`relative px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
            activeTab === "crypto"
              ? "text-dark-accent bg-dark-accent/10"
              : "text-dark-text-muted hover:text-dark-text hover:bg-dark-card-hover/50"
          }`}
        >
          CRIPTO
        </button>
        <div className="flex-1"></div>
        <Link
          href="/cotacoes"
          className="px-3 py-2 text-xs text-dark-text-muted hover:text-dark-accent transition-colors"
        >
          Ver todas →
        </Link>
      </div>

      {/* Grid compacto e minimalista */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-dark-card/30 backdrop-blur-sm border border-dark-border/40 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-dark-bg-secondary/50 rounded mb-3"></div>
              <div className="h-32 bg-dark-bg-secondary/30 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeAssets.map((asset) => {
            const data = assetsData.get(asset.symbol);
            const isPositive = data ? data.changePercent >= 0 : true;
            
            return (
              <Link
                key={asset.symbol}
                href={`/cotacoes?symbol=${encodeURIComponent(asset.symbol)}`}
                className="group relative bg-dark-card/30 backdrop-blur-sm border border-dark-border/40 rounded-xl p-4 hover:border-dark-accent/50 transition-all duration-300 hover:bg-dark-card/40"
              >
                {/* Header compacto */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-dark-card/50 rounded-lg flex items-center justify-center border border-dark-border/30">
                      <span className="text-xs font-light text-dark-accent">{asset.short.split("/")[0]}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-light text-dark-text-primary group-hover:text-dark-accent transition-colors">
                        {asset.name}
                      </h3>
                      <p className="text-xs text-dark-text-muted font-light">{asset.short}</p>
                    </div>
                  </div>
                  <FavoriteButton
                    asset={{
                      id: asset.symbol,
                      symbol: asset.short,
                      name: asset.name,
                      type: activeTab === "crypto" ? "crypto" : activeTab === "indices" ? "index" : "stock",
                    }}
                  />
                </div>
                
                {/* Preço e variação */}
                {data && (
                  <div className="mb-3">
                    <div className="flex items-baseline space-x-2 mb-1">
                      <span className={`text-xl font-extralight ${isPositive ? "text-dark-success" : "text-dark-danger"}`}>
                        {formatPrice(data.price, asset.type)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        isPositive 
                          ? "text-dark-success bg-dark-success/10" 
                          : "text-dark-danger bg-dark-danger/10"
                      }`}>
                        {isPositive ? "+" : ""}{data.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-dark-text-muted">
                      <span>H: {formatPrice(data.high24h, asset.type)}</span>
                      <span>L: {formatPrice(data.low24h, asset.type)}</span>
                    </div>
                  </div>
                )}
                
                {/* Gráfico compacto */}
                <div className="w-full relative" style={{ height: "120px" }}>
                  <FinancialChart
                    symbol={asset.symbol}
                    height={120}
                    interval="15"
                    hideTopToolbar={true}
                    hideSideToolbar={true}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

