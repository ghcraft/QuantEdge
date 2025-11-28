"use client";

import { useEffect, useState } from "react";
import { FavoritesService, SourcesService, FavoriteAsset, FavoriteSource } from "@/lib/favorites";
import FinancialChart from "@/components/FinancialChart";
import FavoriteButton from "@/components/FavoriteButton";
import NewsFeed from "@/components/NewsFeed";
import FollowSourceButton from "@/components/FollowSourceButton";
import Providers from "../providers";

// Função auxiliar para determinar tipo e símbolo do ativo
const getAssetSymbolAndType = (asset: FavoriteAsset): { symbol: string; type: "Crypto" | "Ação" | "Ação BR" | "Índice" } => {
  if (asset.type === "crypto") {
    return { symbol: `BINANCE:${asset.symbol}USDT`, type: "Crypto" };
  } else if (asset.type === "index") {
    return { symbol: `INDEX:${asset.symbol}`, type: "Índice" };
  } else {
    if ((asset as any).exchange === "B3" || asset.symbol.includes("3") || asset.symbol.includes("4")) {
      return { symbol: `BMFBOVESPA:${asset.symbol}`, type: "Ação BR" };
    }
    return { symbol: `NASDAQ:${asset.symbol}`, type: "Ação" };
  }
};

/**
 * Página de Favoritos
 * Exibe todos os ativos e fontes favoritados pelo usuário com informações detalhadas
 */
export default function FavoritosPage() {
  const [favoriteAssets, setFavoriteAssets] = useState<FavoriteAsset[]>([]);
  const [favoriteSources, setFavoriteSources] = useState<FavoriteSource[]>([]);
  const [activeTab, setActiveTab] = useState<"assets" | "sources">("assets");
  const [assetPrices, setAssetPrices] = useState<Record<string, { price: number; change: number; changePercent: number }>>({});
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("Todos");

  useEffect(() => {
    loadFavorites();
    // Atualiza quando o localStorage muda
    const interval = setInterval(loadFavorites, 2000);
    return () => clearInterval(interval);
  }, []);

  // Atualiza preços reais dos favoritos
  useEffect(() => {
    const updatePrices = async () => {
      if (favoriteAssets.length === 0) return;
      
      try {
        const { fetchMultipleMarketDataClient } = await import("@/lib/market-data-client");
        
        const symbolsToFetch = favoriteAssets.map((asset) => {
          const { symbol, type } = getAssetSymbolAndType(asset);
          return { symbol, type };
        });
        
        const realData = await fetchMultipleMarketDataClient(symbolsToFetch);
        
        const prices: Record<string, { price: number; change: number; changePercent: number }> = {};
        
        favoriteAssets.forEach((asset) => {
          const { symbol } = getAssetSymbolAndType(asset);
          const marketData = realData.get(symbol);
          
          if (marketData) {
            prices[asset.id] = {
              price: marketData.price,
              change: marketData.change,
              changePercent: marketData.changePercent,
            };
          }
        });
        
        setAssetPrices(prices);
      } catch (error) {
        console.error("Erro ao atualizar preços dos favoritos:", error);
      }
    };

    updatePrices();
    const priceInterval = setInterval(updatePrices, 10000); // Atualiza a cada 10 segundos
    return () => clearInterval(priceInterval);
  }, [favoriteAssets]);

  const loadFavorites = () => {
    setFavoriteAssets(FavoritesService.getAll());
    setFavoriteSources(SourcesService.getAll());
  };

  const getSymbolForChart = (asset: FavoriteAsset): string => {
    if (asset.type === "crypto") {
      return `BINANCE:${asset.symbol}USDT`;
    } else if (asset.type === "index") {
      return `INDEX:${asset.symbol}`;
    } else {
      if (asset.symbol.includes("3") || asset.symbol.includes("4")) {
        return `BMFBOVESPA:${asset.symbol}`;
      }
      return `NASDAQ:${asset.symbol}`;
    }
  };

  const filteredAssets = favoriteAssets.filter((asset) => {
    if (filterType === "Todos") return true;
    const typeMap: Record<string, string> = {
      "Crypto": "crypto",
      "Ações": "stock",
      "Índices": "index",
    };
    return asset.type === typeMap[filterType];
  });

  const uniqueTypes = ["Todos", ...Array.from(new Set(favoriteAssets.map((a) => 
    a.type === "crypto" ? "Crypto" : a.type === "stock" ? "Ações" : "Índices"
  )))];

  // Estatísticas dos favoritos
  const totalAssets = favoriteAssets.length;
  const assetsByType = favoriteAssets.reduce((acc, asset) => {
    const type = asset.type === "crypto" ? "Crypto" : asset.type === "stock" ? "Ações" : "Índices";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalGain = Object.values(assetPrices).reduce((sum, price) => sum + (price.changePercent || 0), 0);
  const avgGain = totalAssets > 0 ? totalGain / totalAssets : 0;

  return (
    <Providers>
      <main className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg-secondary to-dark-bg">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-dark-border">
          <div className="absolute inset-0 bg-gradient-to-r from-dark-accent/5 via-transparent to-dark-info/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-dark-accent to-transparent"></div>
                <h1 className="text-4xl md:text-6xl font-extralight tracking-tight">
                  <span className="bg-gradient-to-r from-dark-accent via-dark-info to-dark-accent bg-clip-text text-transparent">
                    Meus Favoritos
                  </span>
                </h1>
              </div>
              <p className="text-lg text-dark-text-muted/80 font-light max-w-2xl mx-auto">
                Acompanhe seus ativos e fontes de notícias favoritos em um só lugar
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Estatísticas Rápidas - Apenas para Ativos */}
          {activeTab === "assets" && favoriteAssets.length > 0 && (
            <section className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-light text-dark-text-muted uppercase tracking-wider">Total de Ativos</span>
                    <svg className="w-4 h-4 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <p className="text-3xl font-extralight text-dark-text-primary">{totalAssets}</p>
                </div>

                <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-light text-dark-text-muted uppercase tracking-wider">Média de Variação</span>
                    <svg className={`w-4 h-4 ${avgGain >= 0 ? "text-dark-success" : "text-dark-danger"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {avgGain >= 0 ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      )}
                    </svg>
                  </div>
                  <p className={`text-3xl font-extralight ${avgGain >= 0 ? "text-dark-success" : "text-dark-danger"}`}>
                    {avgGain >= 0 ? "+" : ""}{avgGain.toFixed(2)}%
                  </p>
                </div>

                {Object.entries(assetsByType).map(([type, count]) => (
                  <div key={type} className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-light text-dark-text-muted uppercase tracking-wider">{type}</span>
                    </div>
                    <p className="text-3xl font-extralight text-dark-text-primary">{count}</p>
                    <p className="text-xs text-dark-text-muted font-light mt-1">
                      {((count / totalAssets) * 100).toFixed(0)}% do total
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex space-x-2 bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-2">
              <button
                onClick={() => setActiveTab("assets")}
                className={`flex-1 px-6 py-3 font-light text-sm rounded-2xl transition-all duration-300 ${
                  activeTab === "assets"
                    ? "text-dark-accent bg-dark-accent/20 border border-dark-accent/50 shadow-lg"
                    : "text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-card-hover border border-transparent"
                }`}
              >
                Ativos ({favoriteAssets.length})
              </button>
              <button
                onClick={() => setActiveTab("sources")}
                className={`flex-1 px-6 py-3 font-light text-sm rounded-2xl transition-all duration-300 ${
                  activeTab === "sources"
                    ? "text-dark-accent bg-dark-accent/20 border border-dark-accent/50 shadow-lg"
                    : "text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-card-hover border border-transparent"
                }`}
              >
                Fontes ({favoriteSources.length})
              </button>
            </div>
          </div>

          {/* Conteúdo das Tabs */}
          {activeTab === "assets" && (
            <div>
              {favoriteAssets.length === 0 ? (
                <div className="text-center py-16 bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <p className="text-dark-text-primary font-light text-lg mb-2">
                    Nenhum ativo favoritado
                  </p>
                  <p className="text-sm text-dark-text-muted font-light">
                    Adicione ativos aos favoritos nas páginas de Cotações e Análises
                  </p>
                </div>
              ) : (
                <>
                  {/* Filtros */}
                  <div className="mb-6 flex gap-3 flex-wrap">
                    {uniqueTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-4 py-2 rounded-2xl text-sm font-light transition-all ${
                          filterType === type
                            ? "bg-dark-accent/20 text-dark-accent border border-dark-accent/50"
                            : "bg-dark-bg-secondary text-dark-text-muted hover:text-dark-text-primary border border-dark-border hover:border-dark-accent/30"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {/* Grid de Ativos */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredAssets.map((asset) => {
                      const priceData = assetPrices[asset.id] || { price: 0, change: 0, changePercent: 0 };
                      const isPositive = priceData.changePercent >= 0;
                      const typeLabel = asset.type === "crypto" ? "Crypto" : asset.type === "stock" ? "Ação" : "Índice";

                      return (
                        <div
                          key={asset.id}
                          className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 hover:border-dark-accent/30 transition-all group"
                        >
                          {/* Header do Card */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-xl flex items-center justify-center border border-dark-border/50">
                                <span className="text-sm font-extralight text-dark-accent">
                                  {asset.symbol.substring(0, 3).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-lg font-light text-dark-text-primary mb-1 group-hover:text-dark-accent transition-colors">
                                  {asset.name}
                                </h3>
                                <div className="flex items-center space-x-2">
                                  <p className="text-xs text-dark-text-muted font-mono">{asset.symbol}</p>
                                  <span className="text-xs px-2 py-0.5 bg-dark-bg-secondary/50 text-dark-text-muted rounded-lg border border-dark-border/30">
                                    {typeLabel}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <FavoriteButton
                              asset={{
                                id: asset.id,
                                symbol: asset.symbol,
                                name: asset.name,
                                type: asset.type,
                              }}
                            />
                          </div>

                          {/* Informações de Preço */}
                          <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-dark-bg-secondary/30 rounded-2xl border border-dark-border/20">
                            <div>
                              <p className="text-xs text-dark-text-muted font-light uppercase tracking-wider mb-1">Preço</p>
                              <p className="text-sm font-light text-dark-text-primary">
                                {priceData.price > 0 ? `R$ ${priceData.price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "Carregando..."}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-dark-text-muted font-light uppercase tracking-wider mb-1">Variação</p>
                              <p className={`text-sm font-light ${priceData.price > 0 ? (isPositive ? "text-dark-success" : "text-dark-danger") : "text-dark-text-muted"}`}>
                                {priceData.price > 0 ? `${isPositive ? "+" : ""}${priceData.change.toFixed(2)}` : "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-dark-text-muted font-light uppercase tracking-wider mb-1">%</p>
                              <p className={`text-sm font-light ${priceData.price > 0 ? (isPositive ? "text-dark-success" : "text-dark-danger") : "text-dark-text-muted"}`}>
                                {priceData.price > 0 ? `${isPositive ? "+" : ""}${priceData.changePercent.toFixed(2)}%` : "-"}
                              </p>
                            </div>
                          </div>

                          {/* Gráfico */}
                          <div className="mb-4">
                            <FinancialChart
                              symbol={getSymbolForChart(asset)}
                              height={250}
                              theme="dark"
                              interval="15"
                              hideTopToolbar={true}
                              hideSideToolbar={true}
                            />
                          </div>

                          {/* Botão para ver gráfico completo */}
                          <button
                            onClick={() => setSelectedAsset(selectedAsset === asset.id ? null : asset.id)}
                            className="w-full px-4 py-2 text-xs font-light bg-dark-bg-secondary/50 hover:bg-dark-card-hover text-dark-text-muted hover:text-dark-text-primary border border-dark-border/30 hover:border-dark-accent/50 rounded-xl transition-all"
                          >
                            {selectedAsset === asset.id ? "Ocultar Gráfico Completo" : "Ver Gráfico Completo"}
                          </button>

                          {/* Gráfico Completo */}
                          {selectedAsset === asset.id && (
                            <div className="mt-4 pt-4 border-t border-dark-border/30 animate-fade-in">
                              <FinancialChart
                                symbol={getSymbolForChart(asset)}
                                height={400}
                                theme="dark"
                                interval="15"
                                hideTopToolbar={false}
                                hideSideToolbar={false}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "sources" && (
            <div>
              {favoriteSources.length === 0 ? (
                <div className="text-center py-16 bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <p className="text-dark-text-primary font-light text-lg mb-2">
                    Nenhuma fonte seguida
                  </p>
                  <p className="text-sm text-dark-text-muted font-light">
                    Siga fontes de notícias nos cards de notícias
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Lista de Fontes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {favoriteSources.map((source) => (
                      <div
                        key={source.id}
                        className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 hover:border-dark-accent/30 transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-dark-info/20 to-dark-accent/20 rounded-xl flex items-center justify-center border border-dark-border/50">
                            <svg className="w-6 h-6 text-dark-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                          <FollowSourceButton
                            source={{
                              id: source.id,
                              name: source.name,
                            }}
                          />
                        </div>
                        <h3 className="text-lg font-light text-dark-text-primary mb-2">
                          {source.name}
                        </h3>
                        <p className="text-xs text-dark-text-muted font-light">
                          Seguindo desde {new Date(source.addedAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Notícias das Fontes */}
                  <div className="mt-8">
                    <div className="mb-6">
                      <div className="inline-flex items-center space-x-2 mb-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-dark-info to-transparent"></div>
                        <h3 className="text-2xl font-extralight text-dark-text-primary">
                          Notícias das Fontes Seguidas
                        </h3>
                      </div>
                      <p className="text-sm text-dark-text-muted/80 font-light ml-3">
                        Últimas notícias das suas fontes favoritas
                      </p>
                    </div>
                    <NewsFeed filterSources={favoriteSources.map((s) => s.name)} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </Providers>
  );
}
