"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { FavoritesService } from "@/lib/favorites";
import FavoriteButton from "./FavoriteButton";

interface SearchResult {
  id: string;
  symbol: string;
  name: string;
  type: "stock" | "index" | "crypto";
  exchange?: string;
}

/**
 * Barra de Pesquisa Avançada
 * Permite buscar e favoritar ativos (ações, índices, criptomoedas)
 */
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  // Base de dados de ativos populares
  const allAssets: SearchResult[] = useMemo(() => [
    // Ações Brasileiras
    { id: "BMFBOVESPA:VALE3", symbol: "VALE3", name: "Vale S.A.", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:PETR4", symbol: "PETR4", name: "Petrobras", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:ITUB4", symbol: "ITUB4", name: "Itaú Unibanco", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:BBDC4", symbol: "BBDC4", name: "Bradesco", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:ABEV3", symbol: "ABEV3", name: "Ambev S.A.", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:WEGE3", symbol: "WEGE3", name: "WEG S.A.", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:MGLU3", symbol: "MGLU3", name: "Magazine Luiza", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:RENT3", symbol: "RENT3", name: "Localiza", type: "stock", exchange: "B3" },
    
    // Ações Americanas
    { id: "NASDAQ:AAPL", symbol: "AAPL", name: "Apple Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:MSFT", symbol: "MSFT", name: "Microsoft Corporation", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:GOOGL", symbol: "GOOGL", name: "Alphabet Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:AMZN", symbol: "AMZN", name: "Amazon.com Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:TSLA", symbol: "TSLA", name: "Tesla Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:NVDA", symbol: "NVDA", name: "NVIDIA Corporation", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:META", symbol: "META", name: "Meta Platforms Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NYSE:JPM", symbol: "JPM", name: "JPMorgan Chase & Co.", type: "stock", exchange: "NYSE" },
    { id: "NYSE:V", symbol: "V", name: "Visa Inc.", type: "stock", exchange: "NYSE" },
    { id: "NYSE:WMT", symbol: "WMT", name: "Walmart Inc.", type: "stock", exchange: "NYSE" },
    
    // Índices
    { id: "BMFBOVESPA:IBOVESPA", symbol: "IBOV", name: "Ibovespa", type: "index", exchange: "B3" },
    { id: "INDEX:SPX", symbol: "SPX", name: "S&P 500", type: "index", exchange: "NYSE" },
    { id: "INDEX:IXIC", symbol: "IXIC", name: "NASDAQ Composite", type: "index", exchange: "NASDAQ" },
    { id: "INDEX:DJI", symbol: "DJI", name: "Dow Jones Industrial", type: "index", exchange: "NYSE" },
    { id: "INDEX:FTSE", symbol: "FTSE", name: "FTSE 100", type: "index", exchange: "LSE" },
    { id: "INDEX:NKY", symbol: "NKY", name: "Nikkei 225", type: "index", exchange: "TSE" },
    
    // Criptomoedas
    { id: "BINANCE:BTCUSDT", symbol: "BTC", name: "Bitcoin", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:ETHUSDT", symbol: "ETH", name: "Ethereum", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:BNBUSDT", symbol: "BNB", name: "Binance Coin", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:SOLUSDT", symbol: "SOL", name: "Solana", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:ADAUSDT", symbol: "ADA", name: "Cardano", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:XRPUSDT", symbol: "XRP", name: "Ripple", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:DOTUSDT", symbol: "DOT", name: "Polkadot", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:DOGEUSDT", symbol: "DOGE", name: "Dogecoin", type: "crypto", exchange: "Binance" },
  ], []);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = allAssets.filter(
        (asset) =>
          asset.symbol.toLowerCase().includes(query.toLowerCase()) ||
          asset.name.toLowerCase().includes(query.toLowerCase()) ||
          asset.exchange?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 8));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, allAssets]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (asset: SearchResult) => {
    setQuery("");
    setIsOpen(false);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "stock":
        return "AÇÃO";
      case "index":
        return "ÍNDICE";
      case "crypto":
        return "CRIPTO";
      default:
        return "";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "stock":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "index":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "crypto":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "";
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Campo de Pesquisa */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none">
          <svg
            className="w-7 h-7 text-dark-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder="Buscar ativos, índices, criptomoedas..."
          className="w-full pl-16 pr-14 py-7 bg-dark-card/60 backdrop-blur-2xl border-2 border-dark-border/50 
                   text-dark-text-primary text-2xl font-extralight tracking-tight
                   focus:border-dark-accent focus:outline-none focus:ring-4 focus:ring-dark-accent/15
                   placeholder:text-dark-text-secondary placeholder:font-light placeholder:opacity-50
                   transition-all duration-700 hover:border-dark-accent/60 hover:bg-dark-card/80
                   shadow-2xl shadow-dark-accent/10 hover:shadow-dark-accent/20"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            <svg
              className="w-5 h-5 text-dark-text-muted hover:text-dark-text-primary transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Resultados da Pesquisa Premium */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-3 w-full bg-dark-card/98 backdrop-blur-2xl border-2 border-dark-accent/40 shadow-2xl shadow-dark-accent/30 z-50 max-h-96 overflow-y-auto">
          {results.map((asset, index) => (
            <div
              key={asset.id}
              onClick={() => handleSelect(asset)}
              className={`
                p-4 border-b border-dark-border last:border-b-0
                hover:bg-dark-card-hover cursor-pointer transition-colors
                ${selectedIndex === index ? "bg-dark-card-hover" : ""}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1.5">
                    <span
                      className={`px-2.5 py-1 text-xs font-black rounded border ${getTypeColor(
                        asset.type
                      )}`}
                    >
                      {getTypeLabel(asset.type)}
                    </span>
                    <span className="text-base font-black text-dark-text-primary">
                      {asset.symbol}
                    </span>
                    {asset.exchange && (
                      <span className="text-xs text-dark-text-secondary font-semibold">
                        {asset.exchange}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-dark-text-muted font-medium">{asset.name}</p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <FavoriteButton
                    asset={{
                      id: asset.id,
                      symbol: asset.symbol,
                      name: asset.name,
                      type: asset.type,
                    }}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensagem quando não há resultados */}
      {isOpen && query.length > 0 && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-dark-card border-2 border-dark-border rounded-xl shadow-2xl z-50 p-6 text-center">
          <p className="text-sm text-dark-text-muted">
            Nenhum resultado encontrado para &quot;{query}&quot;
          </p>
        </div>
      )}
    </div>
  );
}

