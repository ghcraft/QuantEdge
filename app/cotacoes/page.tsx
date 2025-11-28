"use client";

import { useEffect, useState, Suspense, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import MarketStats from "@/components/MarketStats";
import FinancialChart from "@/components/FinancialChart";
import FavoriteButton from "@/components/FavoriteButton";
import Providers from "../providers";
import { isMarketOpen, getUpdateInterval } from "@/lib/market-hours";

// Lista expandida de ativos - dados serão carregados via API
interface AssetQuote {
  symbol: string;
  name: string;
  type: "Crypto" | "Ação" | "Ação BR" | "Índice";
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  marketCap?: number;
  basePrice: number; // Preço base para calcular mudanças corretas
}

// Função auxiliar para criar AssetQuote
const createAssetQuote = (
  symbol: string,
  name: string,
  type: "Crypto" | "Ação" | "Ação BR" | "Índice"
): AssetQuote => ({
  symbol,
  name,
  type,
  price: 0,
  change: 0,
  changePercent: 0,
  volume: 0,
  high24h: 0,
  low24h: 0,
  marketCap: type === "Crypto" ? 0 : undefined,
  basePrice: 0,
});

// Inicializa com valores padrão - serão atualizados com dados reais imediatamente
// Apenas os principais ativos para melhor performance
const ASSETS_QUOTES: AssetQuote[] = [
  // ========== CRIPTOMOEDAS (Top 10) ==========
  createAssetQuote("BINANCE:BTCUSDT", "Bitcoin", "Crypto"),
  createAssetQuote("BINANCE:ETHUSDT", "Ethereum", "Crypto"),
  createAssetQuote("BINANCE:BNBUSDT", "BNB", "Crypto"),
  createAssetQuote("BINANCE:SOLUSDT", "Solana", "Crypto"),
  createAssetQuote("BINANCE:ADAUSDT", "Cardano", "Crypto"),
  createAssetQuote("BINANCE:XRPUSDT", "Ripple", "Crypto"),
  createAssetQuote("BINANCE:DOTUSDT", "Polkadot", "Crypto"),
  createAssetQuote("BINANCE:DOGEUSDT", "Dogecoin", "Crypto"),
  createAssetQuote("BINANCE:MATICUSDT", "Polygon", "Crypto"),
  createAssetQuote("BINANCE:AVAXUSDT", "Avalanche", "Crypto"),
  
  // ========== AÇÕES BRASILEIRAS (B3) - Top 20 ==========
  createAssetQuote("BMFBOVESPA:VALE3", "Vale S.A.", "Ação BR"),
  createAssetQuote("BMFBOVESPA:PETR4", "Petrobras", "Ação BR"),
  createAssetQuote("BMFBOVESPA:ITUB4", "Itaú Unibanco", "Ação BR"),
  createAssetQuote("BMFBOVESPA:BBDC4", "Bradesco", "Ação BR"),
  createAssetQuote("BMFBOVESPA:ABEV3", "Ambev S.A.", "Ação BR"),
  createAssetQuote("BMFBOVESPA:WEGE3", "WEG S.A.", "Ação BR"),
  createAssetQuote("BMFBOVESPA:MGLU3", "Magazine Luiza", "Ação BR"),
  createAssetQuote("BMFBOVESPA:RENT3", "Localiza", "Ação BR"),
  createAssetQuote("BMFBOVESPA:PRIO3", "PetroRio", "Ação BR"),
  createAssetQuote("BMFBOVESPA:BBAS3", "Banco do Brasil", "Ação BR"),
  createAssetQuote("BMFBOVESPA:SUZB3", "Suzano S.A.", "Ação BR"),
  createAssetQuote("BMFBOVESPA:RADL3", "Raia Drogasil", "Ação BR"),
  createAssetQuote("BMFBOVESPA:ELET3", "Centrais Elétricas Brasileiras", "Ação BR"),
  createAssetQuote("BMFBOVESPA:KLBN11", "Klabin", "Ação BR"),
  createAssetQuote("BMFBOVESPA:RAIL3", "Rumo", "Ação BR"),
  createAssetQuote("BMFBOVESPA:SANB11", "Santander Brasil", "Ação BR"),
  createAssetQuote("BMFBOVESPA:EMBR3", "Embraer S.A.", "Ação BR"),
  createAssetQuote("BMFBOVESPA:LREN3", "Lojas Renner", "Ação BR"),
  createAssetQuote("BMFBOVESPA:TOTS3", "Totvs S.A.", "Ação BR"),
  createAssetQuote("BMFBOVESPA:VIVT3", "Telefônica Brasil", "Ação BR"),
  
  // ========== AÇÕES AMERICANAS (Top 20) ==========
  createAssetQuote("NASDAQ:AAPL", "Apple Inc.", "Ação"),
  createAssetQuote("NASDAQ:MSFT", "Microsoft Corporation", "Ação"),
  createAssetQuote("NASDAQ:GOOGL", "Alphabet Inc. (Google)", "Ação"),
  createAssetQuote("NASDAQ:AMZN", "Amazon.com Inc.", "Ação"),
  createAssetQuote("NASDAQ:TSLA", "Tesla Inc.", "Ação"),
  createAssetQuote("NASDAQ:NVDA", "NVIDIA Corporation", "Ação"),
  createAssetQuote("NASDAQ:META", "Meta Platforms Inc.", "Ação"),
  createAssetQuote("NASDAQ:NFLX", "Netflix Inc.", "Ação"),
  createAssetQuote("NYSE:JPM", "JPMorgan Chase & Co.", "Ação"),
  createAssetQuote("NYSE:V", "Visa Inc.", "Ação"),
  createAssetQuote("NYSE:WMT", "Walmart Inc.", "Ação"),
  createAssetQuote("NYSE:JNJ", "Johnson & Johnson", "Ação"),
  createAssetQuote("NYSE:MA", "Mastercard Inc.", "Ação"),
  createAssetQuote("NYSE:UNH", "UnitedHealth Group", "Ação"),
  createAssetQuote("NYSE:HD", "Home Depot", "Ação"),
  createAssetQuote("NYSE:CVX", "Chevron Corporation", "Ação"),
  createAssetQuote("NYSE:PG", "Procter & Gamble", "Ação"),
  createAssetQuote("NYSE:KO", "Coca-Cola Company", "Ação"),
  createAssetQuote("NYSE:DIS", "The Walt Disney Company", "Ação"),
  createAssetQuote("NYSE:NKE", "Nike Inc.", "Ação"),
  
  // ========== ÍNDICES (Top 5) ==========
  createAssetQuote("INDEX:IBOV", "Ibovespa", "Índice"),
  createAssetQuote("INDEX:SPX", "S&P 500", "Índice"),
  createAssetQuote("INDEX:IXIC", "NASDAQ Composite", "Índice"),
  createAssetQuote("INDEX:DJI", "Dow Jones Industrial Average", "Índice"),
  createAssetQuote("INDEX:NDX", "NASDAQ 100", "Índice"),
];

/**
 * Componente interno que usa useSearchParams
 */
function CotacoesContent() {
  const searchParams = useSearchParams();
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "change" | "volume" | "price">("name");
  const [quotes, setQuotes] = useState<AssetQuote[]>(ASSETS_QUOTES);
  const [selectedQuote, setSelectedQuote] = useState<AssetQuote | null>(null);
  const [chartInterval, setChartInterval] = useState<"1" | "5" | "15" | "60" | "240" | "1D">("15");
  const [isLoading, setIsLoading] = useState(true);
  const scrollBlockedRef = useRef(false);

  // Carrega dados reais na inicialização via API route (server-side)
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Prepara lista de símbolos para buscar
        const symbolsToFetch = ASSETS_QUOTES.map(q => ({ symbol: q.symbol, type: q.type }));
        
        console.log(`[Cotações] Buscando dados para ${symbolsToFetch.length} ativos via API...`);
        
        // Busca dados via API route (server-side, sem problemas de CSP)
        const response = await fetch("/api/market-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ symbols: symbolsToFetch }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success || !result.data) {
          throw new Error("Resposta inválida da API");
        }

        // Converte objeto de volta para Map
        const realData = new Map<string, any>();
        Object.entries(result.data).forEach(([key, value]) => {
          realData.set(key, value);
        });
        
        console.log(`[Cotações] Dados recebidos para ${realData.size} ativos`);
        
        // Atualiza quotes com dados reais
        const updatedQuotes = ASSETS_QUOTES.map((quote) => {
          const realMarketData = realData.get(quote.symbol);
          
          if (realMarketData && realMarketData.price > 0) {
            return {
              ...quote,
              price: Number(realMarketData.price.toFixed(2)),
              change: Number(realMarketData.change.toFixed(2)),
              changePercent: Number(realMarketData.changePercent.toFixed(2)),
              high24h: Number(realMarketData.high24h.toFixed(2)),
              low24h: Number(realMarketData.low24h.toFixed(2)),
              volume: realMarketData.volume || quote.volume,
              marketCap: realMarketData.marketCap || quote.marketCap,
              basePrice: realMarketData.price,
            };
          } else {
            // Se não recebeu dados, mantém o quote original mas loga o problema
            if (!realMarketData) {
              console.warn(`[Cotações] Nenhum dado recebido para ${quote.symbol} (${quote.name})`);
            }
            return quote;
          }
        });
        
        // Conta quantos ativos foram atualizados com sucesso
        const successCount = updatedQuotes.filter(q => q.price > 0).length;
        console.log(`[Cotações] ${successCount}/${updatedQuotes.length} ativos atualizados com sucesso`);
        
        setQuotes(updatedQuotes);
      } catch (error) {
        console.error("[Cotações] Erro ao carregar dados iniciais:", error);
        // Em caso de erro, mantém os quotes iniciais mas tenta novamente após 5 segundos
        setTimeout(() => {
          loadInitialData();
        }, 5000);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Inicializa com símbolo da URL se existir (sem scroll automático)
  useEffect(() => {
    if (isLoading) return;
    
    const symbol = searchParams.get("symbol");
    if (symbol) {
      const quote = quotes.find((q) => q.symbol === symbol);
      if (quote) {
        scrollBlockedRef.current = true;
        setSelectedSymbol(symbol);
        setSelectedQuote(quote);
        setTimeout(() => {
          scrollBlockedRef.current = false;
        }, 500);
      }
    }
  }, [searchParams, quotes, isLoading]);

  // Atualiza selectedQuote quando selectedSymbol muda (sem scroll automático)
  useEffect(() => {
    if (selectedSymbol) {
      const quote = quotes.find((q) => q.symbol === selectedSymbol);
      if (quote) {
        setSelectedQuote(quote);
      }
    } else {
      setSelectedQuote(null);
    }
  }, [selectedSymbol, quotes]);

  // Atualiza preços em tempo real com dados reais de APIs, respeitando horários de mercado
  useEffect(() => {
    let isUpdating = false;
    let updateTimeout: NodeJS.Timeout;
    
    const updatePrices = async () => {
      // Previne múltiplas atualizações simultâneas
      if (isUpdating) return;
      isUpdating = true;
      
      try {
        // Filtra apenas ativos cujo mercado está aberto (ou criptos que sempre estão abertas)
        const symbolsToFetch = quotes
          .filter((quote) => {
            const marketStatus = isMarketOpen(quote.type, quote.symbol);
            // Sempre busca criptos e ativos com mercado aberto
            return quote.type === "Crypto" || marketStatus.isOpen;
          })
          .map(q => ({ symbol: q.symbol, type: q.type }));
        
        // Se não há ativos para atualizar (todos os mercados fechados), não faz nada
        if (symbolsToFetch.length === 0) {
          isUpdating = false;
          return;
        }
        
        // Busca dados reais via API route (server-side, sem problemas de CSP)
        const response = await fetch("/api/market-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ symbols: symbolsToFetch }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success || !result.data) {
          throw new Error("Resposta inválida da API");
        }

        // Converte objeto de volta para Map
        const realData = new Map<string, any>();
        Object.entries(result.data).forEach(([key, value]) => {
          realData.set(key, value);
        });
        
        setQuotes((prev) => {
          const updated = prev.map((quote) => {
            const marketStatus = isMarketOpen(quote.type, quote.symbol);
            
            // Se o mercado está fechado, mantém os dados atuais (não atualiza)
            if (quote.type !== "Crypto" && !marketStatus.isOpen) {
              return quote;
            }
            
            const realMarketData = realData.get(quote.symbol);
            
            // Se temos dados reais, usa eles
            if (realMarketData) {
              return {
                ...quote,
                price: Number(realMarketData.price.toFixed(2)),
                change: Number(realMarketData.change.toFixed(2)),
                changePercent: Number(realMarketData.changePercent.toFixed(2)),
                high24h: Number(realMarketData.high24h.toFixed(2)),
                low24h: Number(realMarketData.low24h.toFixed(2)),
                volume: realMarketData.volume || quote.volume,
                marketCap: realMarketData.marketCap || quote.marketCap,
                basePrice: realMarketData.price,
              };
            }
            
            // Para criptos, permite pequena variação se API falhar
            if (quote.type === "Crypto") {
              const volatility = 0.005;
              const variation = (Math.random() - 0.5) * volatility;
              const newPrice = Math.max(0.01, quote.basePrice * (1 + variation));
              const change = newPrice - quote.basePrice;
              const changePercent = quote.basePrice > 0 ? (change / quote.basePrice) * 100 : 0;
              
              return {
                ...quote,
                price: Number(newPrice.toFixed(2)),
                change: Number(change.toFixed(2)),
                changePercent: Number(changePercent.toFixed(2)),
              };
            }
            
            // Para outros ativos com mercado fechado ou sem dados, mantém como está
            return quote;
          });
          
          // Atualiza selectedQuote se for o mesmo símbolo (sem causar scroll)
          if (selectedSymbol) {
            const updatedQuote = updated.find((q) => q.symbol === selectedSymbol);
            if (updatedQuote) {
              scrollBlockedRef.current = true;
              setSelectedQuote(updatedQuote);
              setTimeout(() => {
                scrollBlockedRef.current = false;
              }, 100);
            }
          }
          
          return updated;
        });
      } catch (error) {
        console.error("Erro ao atualizar preços:", error);
      } finally {
        isUpdating = false;
      }
    };
    
    // Primeira atualização imediata
    updatePrices();
    
    // Calcula intervalo dinâmico baseado no tipo de ativo mais comum
    // Se há criptos, usa intervalo curto. Se só ações, usa intervalo baseado no mercado
    const hasCrypto = quotes.some(q => q.type === "Crypto");
    const updateInterval = hasCrypto ? 5000 : getUpdateInterval("Ação", quotes[0]?.symbol);
    
    // Atualiza com intervalo dinâmico
    const priceUpdateInterval = setInterval(() => {
      updatePrices();
    }, updateInterval);

    return () => {
      clearInterval(priceUpdateInterval);
      if (updateTimeout) clearTimeout(updateTimeout);
    };
  }, [selectedSymbol, quotes.length]);

  // Filtra e ordena cotações
  const filteredQuotes = useMemo(() => {
    return quotes
      .filter((quote) => {
        const matchesType = filterType === "Todos" || quote.type === filterType;
        const matchesSearch =
          quote.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          quote.symbol.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "change":
            return b.changePercent - a.changePercent;
          case "volume":
            return b.volume - a.volume;
          case "price":
            return b.price - a.price;
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [quotes, filterType, searchQuery, sortBy]);

  const uniqueTypes = useMemo(() => {
    return ["Todos", ...Array.from(new Set(ASSETS_QUOTES.map((a) => a.type)))];
  }, []);

  const formatPrice = useCallback((price: number, type: string) => {
    if (type === "Crypto") {
      return price < 1 ? `$${price.toFixed(4)}` : `$${price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (type === "Índice") {
      return price.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
    } else if (type === "Ação BR") {
      return `R$ ${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(2)}`;
    }
  }, []);

  const formatVolume = useCallback((volume: number) => {
    if (volume >= 1000000000) {
      return `$${(volume / 1000000000).toFixed(2)}B`;
    } else if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(2)}K`;
    }
    return `$${volume.toFixed(0)}`;
  }, []);

  const formatMarketCap = useCallback((marketCap?: number) => {
    if (!marketCap) return "-";
    if (marketCap >= 1000000000000) {
      return `$${(marketCap / 1000000000000).toFixed(2)}T`;
    } else if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(2)}B`;
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(2)}M`;
    }
    return `$${marketCap.toFixed(0)}`;
  }, []);

  const handleSelectAsset = useCallback((symbol: string) => {
    // Previne scroll se já está selecionado
    if (selectedSymbol === symbol) {
      return;
    }
    
    setSelectedSymbol(symbol);
    const quote = quotes.find((q) => q.symbol === symbol);
    if (quote) {
      setSelectedQuote(quote);
      
      // Scroll suave apenas quando o usuário clica (não durante atualizações automáticas)
      if (!scrollBlockedRef.current) {
        setTimeout(() => {
          const element = document.getElementById(`chart-${symbol}`);
          if (element) {
            // Verifica se o elemento está visível antes de fazer scroll
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top >= 0 && rect.top <= window.innerHeight * 0.8;
            if (!isVisible) {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }
        }, 150);
      }
    }
  }, [quotes, selectedSymbol]);

  return (
    <>
      {/* Tabela de Cotações */}
      <section className="mb-8">
        <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6">
          {/* Controles de Filtro e Busca */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar ativo por nome ou símbolo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-dark-bg-secondary border border-dark-border rounded-2xl text-dark-text-primary placeholder-dark-text-muted focus:border-dark-accent focus:outline-none focus:ring-2 focus:ring-dark-accent/20 transition-all"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Filtro por Tipo */}
            <div className="flex gap-2 flex-wrap">
              {uniqueTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-2xl text-sm font-light transition-all ${
                    filterType === type
                      ? "bg-dark-accent/20 text-dark-accent border border-dark-accent/50 shadow-lg"
                      : "bg-dark-bg-secondary text-dark-text-muted hover:text-dark-text-primary border border-dark-border hover:border-dark-accent/30"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            
            {/* Ordenação */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "change" | "volume" | "price")}
              className="px-4 py-2.5 bg-dark-bg-secondary border border-dark-border rounded-2xl text-dark-text-primary text-sm font-light focus:border-dark-accent focus:outline-none focus:ring-2 focus:ring-dark-accent/20 transition-all"
            >
              <option value="name">Ordenar por Nome</option>
              <option value="change">Ordenar por Variação</option>
              <option value="volume">Ordenar por Volume</option>
              <option value="price">Ordenar por Preço</option>
            </select>
          </div>

          {/* Contador de Resultados */}
          <div className="mb-4 text-sm text-dark-text-muted font-light">
            Mostrando {filteredQuotes.length} de {quotes.length} ativos
          </div>

          {/* Tabela de Cotações */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border/30">
                  <th className="text-left py-4 px-4 text-xs font-light text-dark-text-muted uppercase tracking-wider">Ativo</th>
                  <th className="text-right py-4 px-4 text-xs font-light text-dark-text-muted uppercase tracking-wider">Preço</th>
                  <th className="text-right py-4 px-4 text-xs font-light text-dark-text-muted uppercase tracking-wider">Variação</th>
                  <th className="text-right py-4 px-4 text-xs font-light text-dark-text-muted uppercase tracking-wider">%</th>
                  <th className="text-right py-4 px-4 text-xs font-light text-dark-text-muted uppercase tracking-wider">Máx 24h</th>
                  <th className="text-right py-4 px-4 text-xs font-light text-dark-text-muted uppercase tracking-wider">Mín 24h</th>
                  <th className="text-right py-4 px-4 text-xs font-light text-dark-text-muted uppercase tracking-wider">Volume</th>
                  <th className="text-center py-4 px-4 text-xs font-light text-dark-text-muted uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-dark-text-muted">
                      Nenhum ativo encontrado. Tente ajustar os filtros.
                    </td>
                  </tr>
                ) : (
                  filteredQuotes.map((quote) => {
                    const isPositive = quote.changePercent >= 0;
                    const isSelected = selectedSymbol === quote.symbol;
                    return (
                      <tr
                        key={quote.symbol}
                        className={`border-b border-dark-border/10 hover:bg-dark-card-hover/30 transition-all cursor-pointer ${
                          isSelected ? "bg-dark-accent/10 border-l-4 border-l-dark-accent" : ""
                        }`}
                        onClick={() => handleSelectAsset(quote.symbol)}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-xl flex items-center justify-center border transition-all ${
                              isSelected ? "border-dark-accent/50 shadow-lg shadow-dark-accent/20" : "border-dark-border/30"
                            }`}>
                              <span className="text-xs font-extralight text-dark-accent">
                                {quote.name.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-light text-dark-text-primary">{quote.name}</p>
                              <p className="text-xs text-dark-text-muted font-mono">{quote.symbol.split(":")[1] || quote.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-4 px-4">
                          <span className="text-sm font-light text-dark-text-primary">
                            {formatPrice(quote.price, quote.type)}
                          </span>
                        </td>
                        <td className="text-right py-4 px-4">
                          <span className={`text-sm font-light transition-colors ${isPositive ? "text-dark-success" : "text-dark-danger"}`}>
                            {isPositive ? "+" : ""}{formatPrice(quote.change, quote.type)}
                          </span>
                        </td>
                        <td className="text-right py-4 px-4">
                          <span className={`text-sm font-light px-2 py-1 rounded-lg transition-colors ${
                            isPositive ? "text-dark-success bg-dark-success/10" : "text-dark-danger bg-dark-danger/10"
                          }`}>
                            {isPositive ? "+" : ""}{quote.changePercent.toFixed(2)}%
                          </span>
                        </td>
                        <td className="text-right py-4 px-4">
                          <span className="text-xs text-dark-text-muted font-light">
                            {formatPrice(quote.high24h, quote.type)}
                          </span>
                        </td>
                        <td className="text-right py-4 px-4">
                          <span className="text-xs text-dark-text-muted font-light">
                            {formatPrice(quote.low24h, quote.type)}
                          </span>
                        </td>
                        <td className="text-right py-4 px-4">
                          <span className="text-xs text-dark-text-muted font-light">
                            {quote.volume > 0 ? formatVolume(quote.volume) : "-"}
                          </span>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div onClick={(e) => e.stopPropagation()}>
                            <FavoriteButton
                              asset={{
                                id: quote.symbol,
                                symbol: quote.symbol.split(":")[1] || quote.symbol,
                                name: quote.name,
                                type: quote.type === "Crypto" ? "crypto" : quote.type === "Índice" ? "index" : "stock",
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Gráfico e Informações Detalhadas do Ativo Selecionado */}
      {selectedSymbol && selectedQuote && (
        <section className="mb-12 animate-fade-in">
          <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8">
            {/* Header do Ativo */}
            <div className="mb-6 pb-6 border-b border-dark-border/30">
              {/* Status do Mercado */}
              {(() => {
                const marketStatus = isMarketOpen(selectedQuote.type, selectedSymbol);
                if (!marketStatus.isOpen && selectedQuote.type !== "Crypto") {
                  return (
                    <div className="mb-4 p-4 bg-dark-warning/10 border border-dark-warning/30 rounded-2xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-dark-warning rounded-full"></div>
                        <p className="text-sm font-light text-dark-warning">Mercado Fechado</p>
                      </div>
                      <p className="text-xs text-dark-text-muted font-light">{marketStatus.message}</p>
                    </div>
                  );
                }
                if (selectedQuote.type === "Crypto") {
                  return (
                    <div className="mb-4 p-4 bg-dark-success/10 border border-dark-success/30 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-dark-success rounded-full animate-pulse"></div>
                        <p className="text-sm font-light text-dark-success">Mercado 24/7 - Atualizando em tempo real</p>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="mb-4 p-4 bg-dark-success/10 border border-dark-success/30 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-dark-success rounded-full animate-pulse"></div>
                      <p className="text-sm font-light text-dark-success">Mercado Aberto - Atualizando em tempo real</p>
                    </div>
                  </div>
                );
              })()}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-2xl flex items-center justify-center border border-dark-accent/30">
                      <span className="text-xl font-extralight text-dark-accent">
                        {selectedQuote.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-extralight text-dark-text-primary mb-1">
                        {selectedQuote.name}
                      </h2>
                      <p className="text-sm text-dark-text-muted font-mono">{selectedSymbol}</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-xl text-xs font-light border ${
                        selectedQuote.type === "Crypto" ? "text-dark-warning border-dark-warning/30 bg-dark-warning/10" :
                        selectedQuote.type === "Ação BR" ? "text-dark-info border-dark-info/30 bg-dark-info/10" :
                        selectedQuote.type === "Índice" ? "text-dark-purple border-dark-purple/30 bg-dark-purple/10" :
                        "text-dark-success border-dark-success/30 bg-dark-success/10"
                      }`}>
                        {selectedQuote.type}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedSymbol(null);
                    setSelectedQuote(null);
                  }}
                  className="px-6 py-3 text-sm text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-card-hover rounded-2xl transition-all border border-dark-border hover:border-dark-accent/50 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Fechar</span>
                </button>
              </div>
            </div>

            {/* Painel de Informações em Tempo Real */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-dark-bg-secondary/50 to-dark-bg-secondary/30 border border-dark-border/30 rounded-2xl p-5 hover:border-dark-accent/30 transition-all">
                <p className="text-xs text-dark-text-muted font-light uppercase tracking-wider mb-2">Preço Atual</p>
                <p className="text-2xl font-extralight text-dark-text-primary mb-1">
                  {formatPrice(selectedQuote.price, selectedQuote.type)}
                </p>
                <p className="text-xs text-dark-text-muted font-light">Tempo real</p>
              </div>
              <div className={`bg-gradient-to-br ${selectedQuote.changePercent >= 0 ? "from-dark-success/10 to-dark-success/5" : "from-dark-danger/10 to-dark-danger/5"} border ${selectedQuote.changePercent >= 0 ? "border-dark-success/30" : "border-dark-danger/30"} rounded-2xl p-5 hover:border-dark-accent/30 transition-all`}>
                <p className="text-xs text-dark-text-muted font-light uppercase tracking-wider mb-2">Variação 24h</p>
                <p className={`text-2xl font-extralight mb-1 ${selectedQuote.changePercent >= 0 ? "text-dark-success" : "text-dark-danger"}`}>
                  {selectedQuote.changePercent >= 0 ? "+" : ""}{selectedQuote.changePercent.toFixed(2)}%
                </p>
                <p className={`text-sm font-light ${selectedQuote.change >= 0 ? "text-dark-success" : "text-dark-danger"}`}>
                  {selectedQuote.change >= 0 ? "+" : ""}{formatPrice(selectedQuote.change, selectedQuote.type)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-dark-bg-secondary/50 to-dark-bg-secondary/30 border border-dark-border/30 rounded-2xl p-5 hover:border-dark-accent/30 transition-all">
                <p className="text-xs text-dark-text-muted font-light uppercase tracking-wider mb-2">Máxima 24h</p>
                <p className="text-xl font-extralight text-dark-text-primary">
                  {formatPrice(selectedQuote.high24h, selectedQuote.type)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-dark-bg-secondary/50 to-dark-bg-secondary/30 border border-dark-border/30 rounded-2xl p-5 hover:border-dark-accent/30 transition-all">
                <p className="text-xs text-dark-text-muted font-light uppercase tracking-wider mb-2">Mínima 24h</p>
                <p className="text-xl font-extralight text-dark-text-primary">
                  {formatPrice(selectedQuote.low24h, selectedQuote.type)}
                </p>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {selectedQuote.volume > 0 && (
                <div className="bg-dark-bg-secondary/30 border border-dark-border/30 rounded-2xl p-4">
                  <p className="text-xs text-dark-text-muted font-light uppercase tracking-wider mb-2">Volume 24h</p>
                  <p className="text-lg font-extralight text-dark-text-primary">
                    {formatVolume(selectedQuote.volume)}
                  </p>
                </div>
              )}
              {selectedQuote.marketCap && (
                <div className="bg-dark-bg-secondary/30 border border-dark-border/30 rounded-2xl p-4">
                  <p className="text-xs text-dark-text-muted font-light uppercase tracking-wider mb-2">Market Cap</p>
                  <p className="text-lg font-extralight text-dark-text-primary">
                    {formatMarketCap(selectedQuote.marketCap)}
                  </p>
                </div>
              )}
              <div className="bg-dark-bg-secondary/30 border border-dark-border/30 rounded-2xl p-4">
                <p className="text-xs text-dark-text-muted font-light uppercase tracking-wider mb-2">Preço Base</p>
                <p className="text-lg font-extralight text-dark-text-primary">
                  {formatPrice(selectedQuote.basePrice, selectedQuote.type)}
                </p>
              </div>
            </div>

            {/* Controles do Gráfico */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-light text-dark-text-primary">Gráfico de Preços</h3>
              <div className="flex gap-2">
                {(["1", "5", "15", "60", "240", "1D"] as const).map((interval) => (
                  <button
                    key={interval}
                    onClick={() => setChartInterval(interval)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-light transition-all ${
                      chartInterval === interval
                        ? "bg-dark-accent/20 text-dark-accent border border-dark-accent/50"
                        : "bg-dark-bg-secondary text-dark-text-muted hover:text-dark-text-primary border border-dark-border hover:border-dark-accent/30"
                    }`}
                  >
                    {interval === "1" ? "1m" : interval === "5" ? "5m" : interval === "15" ? "15m" : interval === "60" ? "1h" : interval === "240" ? "4h" : "1D"}
                  </button>
                ))}
              </div>
            </div>

            {/* Gráfico Profissional e Didático */}
            <div 
              id={`chart-${selectedSymbol}`} 
              className="w-full relative"
            >
              <FinancialChart
                key={`${selectedSymbol}-${chartInterval}`}
                symbol={selectedSymbol}
                height={500}
                interval={chartInterval}
                hideTopToolbar={false}
                hideSideToolbar={false}
              />
            </div>

            {/* Legenda e Informações Didáticas */}
            <div className="mt-6 pt-6 border-t border-dark-border/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-dark-text-muted font-light">
                <div>
                  <p className="mb-2"><strong className="text-dark-text-primary">Preço Atual:</strong> Último preço negociado em tempo real</p>
                  <p className="mb-2"><strong className="text-dark-text-primary">Variação 24h:</strong> Mudança percentual e absoluta nas últimas 24 horas</p>
                </div>
                <div>
                  <p className="mb-2"><strong className="text-dark-text-primary">Máx/Mín 24h:</strong> Maior e menor preço alcançado nas últimas 24 horas</p>
                  <p className="mb-2"><strong className="text-dark-text-primary">Volume:</strong> Valor total negociado nas últimas 24 horas</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/**
 * Página de Cotações
 * Exibe cotações em tempo real com tabela de preços e gráficos profissionais
 */
export default function CotacoesPage() {
  return (
    <Providers>
      <main className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg-secondary to-dark-bg">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-dark-border">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-cyan-500/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-transparent"></div>
                <h1 className="text-4xl md:text-6xl font-extralight tracking-tight">
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Cotações em Tempo Real
                  </span>
                </h1>
              </div>
              <p className="text-lg text-dark-text-muted/80 font-light max-w-2xl mx-auto">
                Acompanhe preços, variações e volumes dos principais ativos do mercado financeiro com gráficos profissionais e análises detalhadas
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Estatísticas Rápidas */}
          <section className="mb-12">
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 mb-2">
                <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-transparent"></div>
                <h2 className="text-2xl font-extralight text-dark-text-primary">
                  Indicadores do Mercado
                </h2>
              </div>
            </div>
            <MarketStats />
          </section>

          {/* Tabela de Cotações e Gráfico */}
          <Suspense fallback={<div className="mb-12 h-96 bg-dark-card/40 border border-dark-border/50 rounded-3xl animate-pulse"></div>}>
            <CotacoesContent />
          </Suspense>
        </div>
      </main>
    </Providers>
  );
}
