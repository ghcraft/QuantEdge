"use client";

import { useEffect, useState } from "react";

interface Stat {
  label: string;
  value: string;
  change: string;
  changeValue: string;
  positive: boolean;
  gradient: string;
  borderGlow: string;
  symbol: string;
  type: "Crypto" | "Ação" | "Ação BR" | "Índice";
}

/**
 * Componente MarketStats
 * Exibe estatísticas rápidas do mercado com dados reais em tempo real
 */
export default function MarketStats() {
  const [stats, setStats] = useState<Stat[]>([
    {
      label: "Ibovespa",
      value: "128.450",
      change: "+2.34%",
      changeValue: "+2.950",
      positive: true,
      gradient: "from-dark-success/20 to-dark-success/10",
      borderGlow: "border-dark-success/30",
      symbol: "INDEX:IBOV",
      type: "Índice",
    },
    {
      label: "S&P 500",
      value: "4.850",
      change: "+1.25%",
      changeValue: "+60.50",
      positive: true,
      gradient: "from-dark-info/20 to-dark-info/10",
      borderGlow: "border-dark-info/30",
      symbol: "INDEX:SPX",
      type: "Índice",
    },
    {
      label: "Bitcoin",
      value: "$42.850",
      change: "+3.12%",
      changeValue: "+1.295",
      positive: true,
      gradient: "from-dark-warning/20 to-dark-warning/10",
      borderGlow: "border-dark-warning/30",
      symbol: "BINANCE:BTCUSDT",
      type: "Crypto",
    },
    {
      label: "Dólar",
      value: "R$ 4.95",
      change: "-0.45%",
      changeValue: "-0.02",
      positive: false,
      gradient: "from-dark-danger/20 to-dark-danger/10",
      borderGlow: "border-dark-danger/30",
      symbol: "USDBRL",
      type: "Ação",
    },
  ]);

  // Atualiza dados em tempo real via API route (server-side, sem problemas de CSP)
  useEffect(() => {
    const updateStats = async () => {
      try {
        const updatedStats = await Promise.all(
          stats.map(async (stat) => {
            try {
              // Busca dados via API route (server-side)
              const response = await fetch(
                `/api/market-data?symbol=${encodeURIComponent(stat.symbol)}&type=${encodeURIComponent(stat.type)}`
              );
              
              if (!response.ok) {
                console.warn(`[MarketStats] Erro ao buscar ${stat.symbol}: ${response.status}`);
                return stat;
              }
              
              const result = await response.json();
              
              if (!result.success || !result.data) {
                return stat;
              }
              
              const marketData = result.data;
              
              // Dólar tem tratamento especial
              if (stat.symbol === "USDBRL") {
                const price = marketData.price || 4.95;
                const change = marketData.change || 0;
                const changePercent = marketData.changePercent || 0;
                
                return {
                  ...stat,
                  value: `R$ ${price.toFixed(2)}`,
                  change: `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`,
                  changeValue: `${change >= 0 ? "+" : ""}${change.toFixed(2)}`,
                  positive: changePercent >= 0,
                };
              }
              
              const formattedValue = stat.type === "Crypto" 
                ? `$${marketData.price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : stat.type === "Índice"
                ? marketData.price.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                : `R$ ${marketData.price.toFixed(2)}`;
              
              return {
                ...stat,
                value: formattedValue,
                change: `${marketData.changePercent >= 0 ? "+" : ""}${marketData.changePercent.toFixed(2)}%`,
                changeValue: `${marketData.change >= 0 ? "+" : ""}${marketData.change.toFixed(2)}`,
                positive: marketData.changePercent >= 0,
              };
            } catch (error) {
              console.error(`[MarketStats] Erro ao buscar ${stat.symbol}:`, error);
              return stat;
            }
          })
        );
        
        setStats(updatedStats);
      } catch (error) {
        console.error("[MarketStats] Erro ao atualizar estatísticas:", error);
      }
    };

    // Atualiza imediatamente e depois a cada 15 segundos
    updateStats();
    const interval = setInterval(updateStats, 15000);

    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`group relative bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 p-6 rounded-3xl
                       ${stat.positive ? 'hover:border-dark-success/50' : 'hover:border-dark-danger/50'} 
                       hover:bg-dark-card/60 transition-all duration-300
                       hover:-translate-y-1 hover:shadow-xl ${stat.positive ? 'hover:shadow-dark-success/10' : 'hover:shadow-dark-danger/10'}`}
          >
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-light text-dark-text-muted uppercase tracking-[0.3em]">
                  {stat.label}
                </h3>
                <div className={`px-3 py-1 text-xs font-light border backdrop-blur-sm rounded-xl ${
                  stat.positive 
                    ? "text-dark-success border-dark-success/40 bg-dark-success/10" 
                    : "text-dark-danger border-dark-danger/40 bg-dark-danger/10"
                }`}>
                  {stat.change}
                </div>
              </div>
              
              <p className="text-4xl font-extralight text-dark-text-primary mb-3 tracking-tight">
                {stat.value}
              </p>
              
              <div className={`text-sm font-light flex items-center space-x-2 ${
                stat.positive ? "text-dark-success" : "text-dark-danger"
              }`}>
                <span className="text-base">{stat.positive ? "↑" : "↓"}</span>
                <span>{stat.changeValue}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
