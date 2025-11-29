"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NewsFeed from "@/components/NewsFeed";
import MarketOverview from "@/components/MarketOverview";
import MarketStats from "@/components/MarketStats";
import QuickAccess from "@/components/QuickAccess";
import TopMovers from "@/components/TopMovers";
import Footer from "@/components/Footer";
import FinancialChart from "@/components/FinancialChart";
import FeedbackWidget from "@/components/FeedbackWidget";
import { AuthService } from "@/lib/auth";
import { PortfolioService, PortfolioAsset } from "@/lib/portfolio";
import { FavoritesService, FavoriteAsset } from "@/lib/favorites";
import Providers from "../providers";

// Força renderização dinâmica (usa Context e hooks do cliente)
export const dynamic = 'force-dynamic';

/**
 * Componente de Resumo do Portfolio
 */
function PortfolioSummary() {
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>([]);

  useEffect(() => {
    const loadPortfolio = () => {
      setPortfolio(PortfolioService.getAll());
    };
    loadPortfolio();
    const interval = setInterval(loadPortfolio, 2000);
    return () => clearInterval(interval);
  }, []);

  if (portfolio.length === 0) {
    return (
      <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-10 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-dark-border/50">
          <svg className="w-10 h-10 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-light text-dark-text-primary mb-2">Seu portfólio está vazio</h3>
        <p className="text-sm text-dark-text-muted font-light mb-6 max-w-md mx-auto">
          Comece a acompanhar seus investimentos adicionando ativos ao seu portfólio
        </p>
        <Link
          href="/portfolio"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-dark-accent/20 hover:bg-dark-accent/30 text-dark-accent border border-dark-accent/50 rounded-2xl font-light transition-all hover:border-dark-accent"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Adicionar Primeiro Ativo</span>
        </Link>
      </div>
    );
  }

  const totalValue = portfolio.reduce((sum, item) => {
    const currentPrice = item.currentPrice || item.avgPrice;
    return sum + (currentPrice * item.quantity);
  }, 0);

  const totalCost = portfolio.reduce((sum, item) => sum + (item.avgPrice * item.quantity), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost > 0 ? ((totalGain / totalCost) * 100) : 0;

  // Top 3 ativos por valor
  const topAssets = portfolio
    .map((asset) => {
      const currentPrice = asset.currentPrice || asset.avgPrice;
      const value = currentPrice * asset.quantity;
      const cost = asset.avgPrice * asset.quantity;
      const gain = value - cost;
      const gainPercent = cost > 0 ? ((gain / cost) * 100) : 0;
      return { ...asset, value, gain, gainPercent };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  // Distribuição por tipo
  const assetsByType = portfolio.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 hover:border-dark-accent/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-light text-dark-text-muted uppercase tracking-[0.15em]">Valor Total</span>
            <div className="w-8 h-8 bg-gradient-to-br from-dark-accent/10 to-dark-info/10 rounded-lg flex items-center justify-center border border-dark-border/30 group-hover:border-dark-accent/30 transition-colors">
              <svg className="w-4 h-4 text-dark-text-muted group-hover:text-dark-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-extralight text-dark-text-primary mb-2 tracking-tight">
            R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-dark-border/30">
            <span className="text-xs text-dark-text-muted font-light">Investido</span>
            <span className="text-xs font-light text-dark-text-primary">
              R$ {totalCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 hover:border-dark-accent/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-light text-dark-text-muted uppercase tracking-[0.15em]">Ganho/Perda</span>
            <div className={`w-8 h-8 bg-gradient-to-br ${totalGain >= 0 ? 'from-dark-success/10 to-dark-success/5' : 'from-dark-danger/10 to-dark-danger/5'} rounded-lg flex items-center justify-center border ${totalGain >= 0 ? 'border-dark-success/30' : 'border-dark-danger/30'}`}>
              <svg className={`w-4 h-4 ${totalGain >= 0 ? "text-dark-success" : "text-dark-danger"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {totalGain >= 0 ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                )}
              </svg>
            </div>
          </div>
          <p className={`text-3xl font-extralight mb-2 tracking-tight ${totalGain >= 0 ? "text-dark-success" : "text-dark-danger"}`}>
            {totalGain >= 0 ? "+" : ""}R$ {totalGain.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-dark-border/30">
            <span className="text-xs text-dark-text-muted font-light">Percentual</span>
            <span className={`text-xs font-light ${totalGainPercent >= 0 ? "text-dark-success" : "text-dark-danger"}`}>
              {totalGainPercent >= 0 ? "+" : ""}{totalGainPercent.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 hover:border-dark-accent/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-light text-dark-text-muted uppercase tracking-[0.15em]">Ativos</span>
            <div className="w-8 h-8 bg-gradient-to-br from-dark-info/10 to-dark-accent/10 rounded-lg flex items-center justify-center border border-dark-border/30 group-hover:border-dark-info/30 transition-colors">
              <svg className="w-4 h-4 text-dark-text-muted group-hover:text-dark-info transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-extralight text-dark-text-primary mb-2 tracking-tight">{portfolio.length}</p>
          <div className="flex items-center justify-between pt-3 border-t border-dark-border/30">
            <span className="text-xs text-dark-text-muted font-light">Posições abertas</span>
            <span className="text-xs font-light text-dark-text-primary">
              {Object.values(assetsByType).reduce((a, b) => a + b, 0)} tipos
            </span>
          </div>
        </div>
      </div>

      {/* Top 3 Ativos */}
      {topAssets.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-light text-dark-text-muted uppercase tracking-[0.15em]">Maiores Posições</h3>
            <Link
              href="/portfolio"
              className="text-xs font-light text-dark-accent hover:text-dark-info transition-colors"
            >
              Ver completo →
            </Link>
          </div>
          <div className="space-y-3">
            {topAssets.map((asset, index) => (
              <Link
                key={asset.id}
                href="/portfolio"
                className="block bg-dark-bg-secondary/30 border border-dark-border/30 rounded-2xl p-4 hover:border-dark-accent/50 hover:bg-dark-card-hover/30 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-xl flex items-center justify-center border border-dark-border/50 group-hover:border-dark-accent/50 transition-colors">
                        <span className="text-xs font-extralight text-dark-accent">{asset.symbol}</span>
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-dark-accent rounded-full flex items-center justify-center border-2 border-dark-bg">
                          <span className="text-[8px] font-light text-dark-bg">1</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-light text-dark-text-primary group-hover:text-dark-accent transition-colors">{asset.name}</p>
                      <p className="text-xs text-dark-text-muted font-mono">{asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-light text-dark-text-primary mb-1">
                      R$ {asset.value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className={`text-xs font-light ${asset.gainPercent >= 0 ? "text-dark-success" : "text-dark-danger"}`}>
                      {asset.gainPercent >= 0 ? "+" : ""}{asset.gainPercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Componente de Favoritos Recentes
 */
function RecentFavorites() {
  const [favorites, setFavorites] = useState<FavoriteAsset[]>([]);
  const [priceData, setPriceData] = useState<Record<string, { price: number; change: number; changePercent: number }>>({});

  useEffect(() => {
    const loadFavorites = () => {
      const allFavorites = FavoritesService.getAll();
      const sorted = allFavorites.sort((a, b) => 
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      ).slice(0, 4);
      setFavorites(sorted);
    };
    loadFavorites();
    const interval = setInterval(loadFavorites, 2000);
    return () => clearInterval(interval);
  }, []);

  // Atualiza preços reais dos favoritos
  useEffect(() => {
    const updatePrices = async () => {
      if (favorites.length === 0) return;
      
      try {
        const { fetchMultipleMarketDataClient } = await import("@/lib/market-data-client");
        
        const symbolsToFetch = favorites.map((asset) => {
          const symbol = getSymbolForChart(asset);
          let type: "Crypto" | "Ação" | "Ação BR" | "Índice" = "Ação";
          if (asset.type === "crypto") type = "Crypto";
          else if (asset.type === "index") type = "Índice";
          else if ((asset as any).exchange === "B3" || asset.symbol.includes("3") || asset.symbol.includes("4")) type = "Ação BR";
          
          return { symbol, type };
        });
        
        const realData = await fetchMultipleMarketDataClient(symbolsToFetch);
        
        const newPriceData: Record<string, { price: number; change: number; changePercent: number }> = {};
        
        favorites.forEach((asset) => {
          const symbol = getSymbolForChart(asset);
          const marketData = realData.get(symbol);
          
          if (marketData) {
            newPriceData[asset.id] = {
              price: marketData.price,
              change: marketData.change,
              changePercent: marketData.changePercent,
            };
          }
        });
        
        setPriceData(newPriceData);
      } catch (error) {
        console.error("Erro ao atualizar preços dos favoritos:", error);
      }
    };
    
    updatePrices();
    const priceInterval = setInterval(updatePrices, 10000); // Atualiza a cada 10 segundos
    
    return () => clearInterval(priceInterval);
  }, [favorites]);

  if (favorites.length === 0) {
    return (
      <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-10 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-dark-border/50">
          <svg className="w-10 h-10 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <h3 className="text-lg font-light text-dark-text-primary mb-2">Nenhum ativo favoritado</h3>
        <p className="text-sm text-dark-text-muted font-light mb-6 max-w-md mx-auto">
          Adicione ativos aos favoritos para acompanhá-los rapidamente
        </p>
        <Link
          href="/favoritos"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-dark-accent/20 hover:bg-dark-accent/30 text-dark-accent border border-dark-accent/50 rounded-2xl font-light transition-all hover:border-dark-accent"
        >
          <span>Ver Favoritos</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    );
  }

  const getSymbolForChart = (asset: FavoriteAsset): string => {
    if (asset.type === "crypto") {
      return `BINANCE:${asset.symbol}USDT`;
    } else if (asset.type === "index") {
      return `INDEX:${asset.symbol}`;
    } else {
      if ((asset as any).exchange === "B3" || asset.symbol.includes("3") || asset.symbol.includes("4")) {
        return `BMFBOVESPA:${asset.symbol}`;
      }
      return `NASDAQ:${asset.symbol}`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-light text-dark-text-muted uppercase tracking-[0.15em]">Favoritos Recentes</h3>
        <Link
          href="/favoritos"
          className="text-xs font-light text-dark-accent hover:text-dark-info transition-colors"
        >
          Ver todos →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {favorites.map((asset) => {
          const currentPriceData = priceData[asset.id] || { price: 0, change: 0, changePercent: 0 };
          const isPositive = currentPriceData.changePercent >= 0;
          
          return (
            <Link
              key={asset.id}
              href="/favoritos"
              className="bg-dark-bg-secondary/30 border border-dark-border/30 rounded-2xl p-4 hover:border-dark-accent/50 hover:bg-dark-card-hover/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-xl flex items-center justify-center border border-dark-border/50 group-hover:border-dark-accent/50 transition-colors flex-shrink-0">
                    <span className="text-xs font-extralight text-dark-accent">{asset.symbol.substring(0, 3).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-light text-dark-text-primary group-hover:text-dark-accent transition-colors truncate">{asset.name}</p>
                    <p className="text-xs text-dark-text-muted font-mono truncate">{asset.symbol}</p>
                  </div>
                </div>
              </div>
              
              {/* Informações de Preço - Layout melhorado */}
              <div className="mb-3">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <p className="text-lg font-extralight text-dark-text-primary">
                    {currentPriceData.price > 0 ? `$${currentPriceData.price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-"}
                  </p>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${currentPriceData.price > 0 ? (isPositive ? "bg-dark-success" : "bg-dark-danger") : "bg-dark-text-muted"}`}></div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-light px-2 py-0.5 rounded-lg ${currentPriceData.price > 0 ? (isPositive ? "text-dark-success bg-dark-success/10" : "text-dark-danger bg-dark-danger/10") : "text-dark-text-muted bg-dark-bg-secondary/30"}`}>
                    {currentPriceData.price > 0 ? `${isPositive ? "+" : ""}${currentPriceData.changePercent.toFixed(2)}%` : "-"}
                  </span>
                  <span className={`text-xs font-light ${currentPriceData.price > 0 ? (isPositive ? "text-dark-success" : "text-dark-danger") : "text-dark-text-muted"}`}>
                    {currentPriceData.price > 0 ? `(${isPositive ? "+" : ""}$${currentPriceData.change.toFixed(2)})` : ""}
                  </span>
                </div>
              </div>
              
              {/* Gráfico Compacto */}
              <div className="h-20 rounded-xl overflow-hidden border border-dark-border/20">
                <FinancialChart
                  symbol={getSymbolForChart(asset)}
                  height={80}
                  interval="60"
                  hideTopToolbar={true}
                  hideSideToolbar={true}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Página de Dashboard (Principal após login)
 * Layout completo e elegante com múltiplas seções
 */
export default function DashboardPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        setUser({ name: currentUser.name, email: currentUser.email });
      }
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (typeof window !== "undefined") {
      const isAuthenticated = AuthService.isAuthenticated();
      if (!isAuthenticated) {
        router.replace("/demo");
      }
    }
  }, [router, isMounted]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dark-accent/30 border-t-dark-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-text-muted font-light">Carregando...</p>
        </div>
      </div>
    );
  }

  const currentDate = new Date();
  const timeString = currentDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const dateString = currentDate.toLocaleDateString("pt-BR", { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });

  return (
    <Providers>
      <main className="min-h-screen bg-dark-bg relative">
        {/* Background Financeiro Global */}
        <div className="fixed inset-0 bg-dark-bg pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.01)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 2000 1200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,255,136,0.1)" stopOpacity="0"/>
                <stop offset="50%" stopColor="rgba(0,255,136,0.15)" stopOpacity="1"/>
                <stop offset="100%" stopColor="rgba(0,255,136,0.1)" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M 0,800 Q 500,600 1000,500 T 2000,300" fill="none" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="10,20"/>
            <path d="M 0,400 Q 500,500 1000,600 T 2000,800" fill="none" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="10,20"/>
          </svg>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]"></div>
        </div>
        
        <div className="relative z-10">
          {/* Header Personalizado */}
          <section className="border-b border-dark-border/50 bg-dark-bg-secondary/30 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extralight text-dark-text-primary mb-2 tracking-tight">
                    Bem-vindo, <span className="bg-gradient-to-r from-dark-accent to-dark-info bg-clip-text text-transparent">{user?.name || "Investidor"}</span>
                  </h1>
                  <p className="text-sm text-dark-text-muted font-light capitalize">
                    {dateString}
                  </p>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-[10px] font-light text-dark-text-muted uppercase tracking-[0.2em] mb-1">Última Atualização</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-dark-accent rounded-full animate-pulse"></div>
                      <p className="text-sm font-light text-dark-text-primary">{timeString}</p>
                    </div>
                  </div>
                  <div className="h-12 w-px bg-dark-border/50"></div>
                  <div className="text-right">
                    <p className="text-[10px] font-light text-dark-text-muted uppercase tracking-[0.2em] mb-1">Status</p>
                    <p className="text-xs font-light text-dark-success">Online</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Conteúdo principal */}
          <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
            <div className="relative z-10 space-y-12">
              {/* Resumo do Portfolio */}
              <section>
                <div className="mb-6">
                  <div className="inline-flex items-center space-x-2 mb-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-transparent"></div>
                    <h2 className="text-2xl font-extralight text-dark-text-primary tracking-tight">
                      Resumo do Portfolio
                    </h2>
                  </div>
                  <p className="text-sm text-dark-text-muted/80/80 font-light ml-3">
                    Visão geral dos seus investimentos e performance
                  </p>
                </div>
                <div className="bg-dark-card/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8">
                  <PortfolioSummary />
                </div>
              </section>

              {/* Estatísticas Rápidas */}
              <section>
                <div className="mb-6">
                  <div className="inline-flex items-center space-x-2 mb-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-dark-accent to-transparent"></div>
                    <h2 className="text-2xl font-extralight text-dark-text-primary tracking-tight">
                      Indicadores do Mercado
                    </h2>
                  </div>
                  <p className="text-sm text-dark-text-muted/80/80 font-light ml-3">
                    Principais índices e indicadores em tempo real
                  </p>
                </div>
                <div className="bg-dark-card/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8">
                  <MarketStats />
                </div>
              </section>

              {/* Grid com Acesso Rápido e Favoritos */}
              <section>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Acesso Rápido */}
                  <div>
                    <div className="mb-6">
                      <div className="inline-flex items-center space-x-2 mb-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-dark-info to-transparent"></div>
                        <h2 className="text-2xl font-extralight text-dark-text-primary tracking-tight">
                          Acesso Rápido
                        </h2>
                      </div>
                      <p className="text-sm text-dark-text-muted/80/80 font-light ml-3">
                        Navegação rápida para principais funcionalidades
                      </p>
                    </div>
                    <div className="bg-dark-card/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8">
                      <QuickAccess />
                    </div>
                  </div>

                  {/* Favoritos Recentes */}
                  <div>
                    <div className="mb-6">
                      <div className="inline-flex items-center space-x-2 mb-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-dark-accent to-transparent"></div>
                        <h2 className="text-2xl font-extralight text-dark-text-primary tracking-tight">
                          Favoritos Recentes
                        </h2>
                      </div>
                      <p className="text-sm text-dark-text-muted/80/80 font-light ml-3">
                        Seus ativos favoritos mais recentes com gráficos
                      </p>
                    </div>
                    <div className="bg-dark-card/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8">
                      <RecentFavorites />
                    </div>
                  </div>
                </div>
              </section>

              {/* Top Movers */}
              <section>
                <div className="mb-6">
                  <div className="inline-flex items-center space-x-2 mb-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-dark-accent to-transparent"></div>
                    <h2 className="text-2xl font-extralight text-dark-text-primary tracking-tight">
                      Destaques do Dia
                    </h2>
                  </div>
                  <p className="text-sm text-dark-text-muted/80/80 font-light ml-3">
                    Maiores ganhadores e perdedores do mercado
                  </p>
                </div>
                <div className="bg-dark-card/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8">
                  <TopMovers />
                </div>
              </section>

              {/* Seção de Gráficos */}
              <section className="mb-8">
                <div className="mb-6">
                  <div className="inline-flex items-center space-x-2 mb-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-dark-info to-transparent"></div>
                    <h2 className="text-2xl font-extralight text-dark-text-primary tracking-tight">
                      Visão Geral do Mercado
                    </h2>
                  </div>
                  <p className="text-sm text-dark-text-muted/80/80 font-light ml-3">
                    Gráficos interativos em tempo real de ações, índices e criptomoedas
                  </p>
                </div>
                <div className="bg-dark-card/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 overflow-hidden">
                  <MarketOverview />
                </div>
              </section>

              {/* Seção de Notícias */}
              <section>
                <div className="mb-6">
                  <div className="inline-flex items-center space-x-2 mb-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-dark-accent to-transparent"></div>
                    <h2 className="text-2xl font-extralight text-dark-text-primary tracking-tight">
                      Notícias Financeiras
                    </h2>
                  </div>
                  <p className="text-sm text-dark-text-muted/80/80 font-light ml-3">
                    Últimas atualizações e análises do mercado financeiro
                  </p>
                </div>
                <div className="bg-dark-card/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8">
                  <NewsFeed />
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </main>
      <FeedbackWidget minimal={true} />
    </Providers>
  );
}
