"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchMultipleMarketDataClient } from "@/lib/market-data-client";

interface Mover {
  symbol: string;
  name: string;
  change: string;
  changeValue: string;
  price: string;
  volume: string;
  changePercent: number;
}

/**
 * Componente TopMovers
 * Exibe os maiores ganhadores e perdedores do dia com dados reais
 */
export default function TopMovers() {
  const [gainers, setGainers] = useState<Mover[]>([]);
  const [losers, setLosers] = useState<Mover[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateMovers = async () => {
      try {
        // Lista de ativos populares para verificar
        const popularStocks = [
          { symbol: "NASDAQ:TSLA", name: "Tesla Inc.", short: "TSLA", type: "Ação" as const },
          { symbol: "NASDAQ:NVDA", name: "NVIDIA Corp.", short: "NVDA", type: "Ação" as const },
          { symbol: "NASDAQ:AMD", name: "Advanced Micro", short: "AMD", type: "Ação" as const },
          { symbol: "NASDAQ:AAPL", name: "Apple Inc.", short: "AAPL", type: "Ação" as const },
          { symbol: "NASDAQ:MSFT", name: "Microsoft Corp.", short: "MSFT", type: "Ação" as const },
          { symbol: "NASDAQ:META", name: "Meta Platforms", short: "META", type: "Ação" as const },
          { symbol: "NASDAQ:GOOGL", name: "Alphabet Inc.", short: "GOOGL", type: "Ação" as const },
          { symbol: "NASDAQ:AMZN", name: "Amazon.com", short: "AMZN", type: "Ação" as const },
          { symbol: "NASDAQ:NFLX", name: "Netflix Inc.", short: "NFLX", type: "Ação" as const },
          { symbol: "NYSE:DIS", name: "Walt Disney Co.", short: "DIS", type: "Ação" as const },
        ];

        const realData = await fetchMultipleMarketDataClient(
          popularStocks.map(s => ({ symbol: s.symbol, type: s.type }))
        );

        const movers: Mover[] = popularStocks.map((stock) => {
          const marketData = realData.get(stock.symbol);
          if (marketData) {
            const isPositive = marketData.changePercent >= 0;
            return {
              symbol: stock.short,
              name: stock.name,
              change: `${isPositive ? "+" : ""}${marketData.changePercent.toFixed(2)}%`,
              changeValue: `${isPositive ? "+" : ""}$${marketData.change.toFixed(2)}`,
              price: `$${marketData.price.toFixed(2)}`,
              volume: marketData.volume >= 1000000 
                ? `${(marketData.volume / 1000000).toFixed(1)}M` 
                : `${(marketData.volume / 1000).toFixed(1)}K`,
              changePercent: marketData.changePercent,
            };
          }
          return null;
        }).filter((m): m is Mover => m !== null);

        // Ordena por variação percentual
        const sorted = movers.sort((a, b) => b.changePercent - a.changePercent);
        
        // Top 5 ganhadores e perdedores
        setGainers(sorted.filter(m => m.changePercent > 0).slice(0, 5));
        setLosers(sorted.filter(m => m.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 5));
        
        setLoading(false);
      } catch (error) {
        console.error("Erro ao atualizar Top Movers:", error);
        setLoading(false);
      }
    };

    updateMovers();
    const interval = setInterval(updateMovers, 30000); // Atualiza a cada 30 segundos
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 animate-pulse">
          <div className="h-6 bg-dark-bg-secondary/50 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-dark-bg-secondary/30 rounded"></div>
            ))}
          </div>
        </div>
        <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 animate-pulse">
          <div className="h-6 bg-dark-bg-secondary/50 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-dark-bg-secondary/30 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Maiores Ganhadores */}
      <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-dark-border/30 bg-gradient-to-r from-dark-success/10 via-dark-success/5 to-transparent">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-light text-dark-text-primary flex items-center">
              <span className="w-2 h-2 bg-dark-success rounded-full mr-3 animate-pulse"></span>
              Maiores Ganhadores
            </h3>
            <Link
              href="/cotacoes"
              className="text-xs font-light text-dark-accent hover:text-dark-info transition-colors"
            >
              Ver todos →
            </Link>
          </div>
        </div>
        <div className="divide-y divide-dark-border/30">
          {gainers.length > 0 ? gainers.map((stock, index) => (
            <Link
              key={index}
              href="/cotacoes"
              className="block p-4 hover:bg-dark-card-hover/30 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-dark-success/30 to-dark-success/10 rounded-xl flex items-center justify-center border border-dark-success/30">
                      <span className="text-xs font-extralight text-dark-success">{stock.symbol}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-light text-sm text-dark-text-primary group-hover:text-dark-success transition-colors mb-1">{stock.name}</p>
                      <p className="text-xs text-dark-text-muted font-mono">{stock.symbol}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 ml-13 text-xs">
                    <span className="text-dark-text-muted font-light">Vol: {stock.volume}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extralight text-dark-success mb-1">{stock.change}</p>
                  <p className="text-xs font-light text-dark-success">{stock.changeValue}</p>
                  <p className="text-sm font-light text-dark-text-primary mt-1">{stock.price}</p>
                </div>
              </div>
            </Link>
          )) : (
            <div className="p-8 text-center text-dark-text-muted">
              <p className="text-sm font-light">Nenhum ganhador no momento</p>
            </div>
          )}
        </div>
      </div>

      {/* Maiores Perdedores */}
      <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-dark-border/30 bg-gradient-to-r from-dark-danger/10 via-dark-danger/5 to-transparent">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-light text-dark-text-primary flex items-center">
              <span className="w-2 h-2 bg-dark-danger rounded-full mr-3 animate-pulse"></span>
              Maiores Perdedores
            </h3>
            <Link
              href="/cotacoes"
              className="text-xs font-light text-dark-accent hover:text-dark-info transition-colors"
            >
              Ver todos →
            </Link>
          </div>
        </div>
        <div className="divide-y divide-dark-border/30">
          {losers.length > 0 ? losers.map((stock, index) => (
            <Link
              key={index}
              href="/cotacoes"
              className="block p-4 hover:bg-dark-card-hover/30 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-dark-danger/30 to-dark-danger/10 rounded-xl flex items-center justify-center border border-dark-danger/30">
                      <span className="text-xs font-extralight text-dark-danger">{stock.symbol}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-light text-sm text-dark-text-primary group-hover:text-dark-danger transition-colors mb-1">{stock.name}</p>
                      <p className="text-xs text-dark-text-muted font-mono">{stock.symbol}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 ml-13 text-xs">
                    <span className="text-dark-text-muted font-light">Vol: {stock.volume}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extralight text-dark-danger mb-1">{stock.change}</p>
                  <p className="text-xs font-light text-dark-danger">{stock.changeValue}</p>
                  <p className="text-sm font-light text-dark-text-primary mt-1">{stock.price}</p>
                </div>
              </div>
            </Link>
          )) : (
            <div className="p-8 text-center text-dark-text-muted">
              <p className="text-sm font-light">Nenhum perdedor no momento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
