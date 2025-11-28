"use client";

import { useState, useEffect, useRef, useMemo } from "react";

interface SearchResult {
  id: string;
  symbol: string;
  name: string;
  type: "stock" | "index" | "crypto";
  exchange?: string;
}

interface PortfolioSearchProps {
  onSelect: (asset: SearchResult) => void;
}

/**
 * Componente de Busca para Portfólio
 * Versão simplificada para seleção de ativos
 */
export default function PortfolioSearch({ onSelect }: PortfolioSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Base completa de ativos - Importa a mesma lista do CompactSearchBar
  // Por simplicidade, incluindo os principais ativos aqui
  // Em produção, isso poderia ser um arquivo compartilhado
  const allAssets: SearchResult[] = useMemo(() => [
    // Principais ativos - lista completa disponível no CompactSearchBar
    { id: "BMFBOVESPA:VALE3", symbol: "VALE3", name: "Vale S.A.", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:PETR4", symbol: "PETR4", name: "Petrobras", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:ITUB4", symbol: "ITUB4", name: "Itaú Unibanco", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:BBDC4", symbol: "BBDC4", name: "Bradesco", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:ABEV3", symbol: "ABEV3", name: "Ambev S.A.", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:WEGE3", symbol: "WEGE3", name: "WEG S.A.", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:MGLU3", symbol: "MGLU3", name: "Magazine Luiza", type: "stock", exchange: "B3" },
    { id: "BMFBOVESPA:RENT3", symbol: "RENT3", name: "Localiza", type: "stock", exchange: "B3" },
    { id: "NASDAQ:AAPL", symbol: "AAPL", name: "Apple Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:MSFT", symbol: "MSFT", name: "Microsoft Corporation", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:GOOGL", symbol: "GOOGL", name: "Alphabet Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:AMZN", symbol: "AMZN", name: "Amazon.com Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:TSLA", symbol: "TSLA", name: "Tesla Inc.", type: "stock", exchange: "NASDAQ" },
    { id: "NASDAQ:NVDA", symbol: "NVDA", name: "NVIDIA Corporation", type: "stock", exchange: "NASDAQ" },
    { id: "NYSE:JPM", symbol: "JPM", name: "JPMorgan Chase & Co.", type: "stock", exchange: "NYSE" },
    { id: "NYSE:V", symbol: "V", name: "Visa Inc.", type: "stock", exchange: "NYSE" },
    { id: "BMFBOVESPA:IBOVESPA", symbol: "IBOV", name: "Ibovespa", type: "index", exchange: "B3" },
    { id: "INDEX:SPX", symbol: "SPX", name: "S&P 500", type: "index", exchange: "NYSE" },
    { id: "BINANCE:BTCUSDT", symbol: "BTC", name: "Bitcoin", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:ETHUSDT", symbol: "ETH", name: "Ethereum", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:BNBUSDT", symbol: "BNB", name: "BNB", type: "crypto", exchange: "Binance" },
    { id: "BINANCE:SOLUSDT", symbol: "SOL", name: "Solana", type: "crypto", exchange: "Binance" },
  ], []);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = allAssets.filter(
        (asset) =>
          asset.symbol.toLowerCase().includes(query.toLowerCase()) ||
          asset.name.toLowerCase().includes(query.toLowerCase())
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "stock": return "AÇÃO";
      case "index": return "ÍNDICE";
      case "crypto": return "CRIPTO";
      default: return "";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "stock":
        return "bg-dark-info/20 text-dark-info border-dark-info/30";
      case "index":
        return "bg-dark-purple/20 text-dark-purple border-dark-purple/30";
      case "crypto":
        return "bg-dark-warning/20 text-dark-warning border-dark-warning/30";
      default:
        return "";
    }
  };

  const handleSelect = (asset: SearchResult) => {
    onSelect(asset);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-dark-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder="Buscar ativo..."
          className="w-full pl-10 pr-8 py-2.5 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text-primary text-sm font-light focus:border-dark-accent focus:outline-none focus:ring-2 focus:ring-dark-accent/20 placeholder:text-dark-text-muted transition-all duration-300"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              className="w-4 h-4 text-dark-text-muted hover:text-dark-text-primary transition-colors"
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

      {/* Resultados */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-dark-card border-2 border-dark-border shadow-2xl z-50 max-h-64 overflow-y-auto">
          {results.map((asset) => (
            <div
              key={asset.id}
              onClick={() => handleSelect(asset)}
              className="p-3 border-b border-dark-border/50 last:border-b-0 hover:bg-dark-card-hover hover:border-dark-accent/50 cursor-pointer transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-0.5 text-[10px] font-light rounded border ${getTypeColor(asset.type)}`}>
                      {getTypeLabel(asset.type)}
                    </span>
                    <span className="text-sm font-light text-dark-text-primary truncate group-hover:text-dark-accent transition-colors">
                      {asset.symbol}
                    </span>
                  </div>
                  <p className="text-xs text-dark-text-muted font-light truncate">{asset.name}</p>
                  {asset.exchange && (
                    <p className="text-xs text-dark-text-secondary font-light mt-0.5">{asset.exchange}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

