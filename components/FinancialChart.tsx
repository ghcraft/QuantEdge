"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { isMarketOpen, getUpdateInterval } from "@/lib/market-hours";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface FinancialChartProps {
  symbol: string;
  width?: string | number;
  height?: string | number;
  theme?: "dark" | "light";
  interval?: "1" | "5" | "15" | "60" | "240" | "1D";
  hideTopToolbar?: boolean;
  hideSideToolbar?: boolean;
}

interface PriceData {
  time: string;
  price: number;
  volume?: number;
}

const getIntervalMs = (interval: string): number => {
  switch (interval) {
    case "1": return 60000;
    case "5": return 300000;
    case "15": return 900000;
    case "60": return 3600000;
    case "240": return 14400000;
    case "1D": return 86400000;
    default: return 900000;
  }
};

const getBasePrice = (symbol: string): number => {
  const upperSymbol = symbol.toUpperCase();
  
  if (upperSymbol.includes("BTC")) return 42850;
  if (upperSymbol.includes("ETH")) return 2650;
  if (upperSymbol.includes("BNB")) return 315;
  if (upperSymbol.includes("SOL")) return 98.5;
  if (upperSymbol.includes("ADA")) return 0.52;
  if (upperSymbol.includes("XRP")) return 0.62;
  
  if (upperSymbol.includes("AAPL")) return 195.50;
  if (upperSymbol.includes("MSFT")) return 378.90;
  if (upperSymbol.includes("GOOGL")) return 142.30;
  if (upperSymbol.includes("AMZN")) return 152.40;
  if (upperSymbol.includes("TSLA")) return 248.60;
  if (upperSymbol.includes("META")) return 485.20;
  if (upperSymbol.includes("NVDA")) return 875.40;
  
  if (upperSymbol.includes("VALE")) return 70.25;
  if (upperSymbol.includes("PETR")) return 34.50;
  if (upperSymbol.includes("ITUB")) return 28.90;
  if (upperSymbol.includes("BBDC")) return 14.85;
  if (upperSymbol.includes("ABEV")) return 12.40;
  
  if (upperSymbol.includes("SPX") || upperSymbol.includes("S&P")) return 4850;
  if (upperSymbol.includes("IXIC") || upperSymbol.includes("NASDAQ")) return 15280;
  if (upperSymbol.includes("DJI") || upperSymbol.includes("DOW")) return 38250;
  if (upperSymbol.includes("IBOV")) return 128450;
  
  return 100;
};

const getVolatility = (symbol: string): number => {
  const upperSymbol = symbol.toUpperCase();
  
  if (upperSymbol.includes("BTC") || upperSymbol.includes("ETH") || 
      upperSymbol.includes("SOL") || upperSymbol.includes("BNB")) {
    return 0.015;
  }
  
  if (upperSymbol.includes("AAPL") || upperSymbol.includes("MSFT") || 
      upperSymbol.includes("GOOGL") || upperSymbol.includes("AMZN")) {
    return 0.004;
  }
  
  if (upperSymbol.includes("SPX") || upperSymbol.includes("IXIC") || 
      upperSymbol.includes("DJI") || upperSymbol.includes("IBOV")) {
    return 0.002;
  }
  
  return 0.008;
};

// Gera dados iniciais de forma mais suave
const generatePriceData = (symbol: string, interval: string, basePrice: number): PriceData[] => {
  const data: PriceData[] = [];
  const now = new Date();
  const volatility = getVolatility(symbol);
  const points = interval === "1D" ? 24 : interval === "240" ? 12 : interval === "60" ? 24 : 50;
  const intervalMs = getIntervalMs(interval);
  
  let currentPrice = basePrice;
  
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * intervalMs);
    // Variação mais suave e realista
    const change = (Math.random() - 0.5) * volatility * 2;
    currentPrice = Math.max(0.01, currentPrice * (1 + change));
    
    data.push({
      time: time.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      price: Number(currentPrice.toFixed(2)),
      volume: Math.random() * 1000000,
    });
  }
  
  return data;
};

export default function FinancialChart({
  symbol,
  width = "100%",
  height = 350,
  theme: propTheme,
  interval = "15",
}: FinancialChartProps) {
  const theme = propTheme || "dark";
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);
  
  // Usa refs para manter valores estáveis
  const basePriceRef = useRef<number>(0);
  const initialPriceRef = useRef<number>(0);
  const lastPriceRef = useRef<number>(0);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calcula preço base uma vez
  const basePrice = useMemo(() => {
    const price = getBasePrice(symbol);
    basePriceRef.current = price;
    return price;
  }, [symbol]);

  // Busca dados reais desde o início
  useEffect(() => {
    let mounted = true;
    
    const initializeWithRealData = async () => {
      try {
        // Determina tipo do ativo baseado no símbolo
        let assetType: "Crypto" | "Ação" | "Ação BR" | "Índice" = "Ação";
        if (symbol.includes("BINANCE:") || symbol.includes("BTC") || symbol.includes("ETH") || 
            symbol.includes("SOL") || symbol.includes("BNB") || symbol.includes("ADA") || symbol.includes("XRP")) {
          assetType = "Crypto";
        } else if (symbol.includes("INDEX:") || symbol.includes("SPX") || symbol.includes("IXIC") || 
                   symbol.includes("DJI") || symbol.includes("IBOV")) {
          assetType = "Índice";
        } else if (symbol.includes("BMFBOVESPA:") || symbol.includes("VALE") || symbol.includes("PETR")) {
          assetType = "Ação BR";
        }
        
        // Busca preço real atual via API route (server-side, sem CSP)
        const { fetchMarketDataClient } = await import("@/lib/market-data-client");
        const realData = await fetchMarketDataClient(symbol, assetType);
        
        if (!mounted) return;
        
        // Se temos dados reais, usa eles. Caso contrário, usa fallback
        const currentRealPrice = realData?.price || basePrice;
        basePriceRef.current = currentRealPrice;
        
        // Gera histórico baseado no preço real atual
        const initialData = generatePriceData(symbol, interval, currentRealPrice);
        
        if (initialData.length > 0) {
          const latest = initialData[initialData.length - 1];
          const first = initialData[0];
          
          // Garante que o último preço seja o real
          if (realData) {
            const now = new Date();
            initialData[initialData.length - 1] = {
              time: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
              price: Number(realData.price.toFixed(2)),
              volume: realData.volume || 0,
            };
            latest.price = realData.price;
          }
          
          initialPriceRef.current = first.price;
          lastPriceRef.current = latest.price;
          
          setPriceData(initialData);
          setCurrentPrice(latest.price);
          
          const change = latest.price - first.price;
          const changePercent = first.price > 0 ? (change / first.price) * 100 : 0;
          setPriceChange(change);
          setPriceChangePercent(changePercent);
        }
      } catch (error) {
        console.error("Erro ao inicializar com dados reais:", error);
        // Fallback para dados simulados se API falhar
        if (mounted) {
          const initialData = generatePriceData(symbol, interval, basePrice);
          if (initialData.length > 0) {
            const latest = initialData[initialData.length - 1];
            const first = initialData[0];
            
            initialPriceRef.current = first.price;
            lastPriceRef.current = latest.price;
            
            setPriceData(initialData);
            setCurrentPrice(latest.price);
            
            const change = latest.price - first.price;
            const changePercent = first.price > 0 ? (change / first.price) * 100 : 0;
            setPriceChange(change);
            setPriceChangePercent(changePercent);
          }
        }
      }
    };
    
    initializeWithRealData();
    
    return () => {
      mounted = false;
    };
  }, [symbol, interval, basePrice]);

  // Determina tipo do ativo uma vez (memoizado)
  const assetType = useMemo<"Crypto" | "Ação" | "Ação BR" | "Índice">(() => {
    if (symbol.includes("BINANCE:") || symbol.includes("BTC") || symbol.includes("ETH") || 
        symbol.includes("SOL") || symbol.includes("BNB") || symbol.includes("ADA") || symbol.includes("XRP")) {
      return "Crypto";
    } else if (symbol.includes("INDEX:") || symbol.includes("SPX") || symbol.includes("IXIC") || 
               symbol.includes("DJI") || symbol.includes("IBOV")) {
      return "Índice";
    } else if (symbol.includes("BMFBOVESPA:") || symbol.includes("VALE") || symbol.includes("PETR")) {
      return "Ação BR";
    }
    return "Ação";
  }, [symbol]);

  // Atualiza preço em tempo real com dados reais de APIs
  useEffect(() => {
    // Limpa intervalo anterior se existir
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }

    // Não atualiza se não houver dados
    if (priceData.length === 0) {
      return;
    }
    
    // Calcula intervalo dinâmico baseado no horário de mercado
    const updateIntervalMs = getUpdateInterval(assetType, symbol);
    let isUpdating = false;

    const updateChart = async () => {
      // Previne múltiplas atualizações simultâneas
      if (isUpdating) return;
      isUpdating = true;

      try {
        // Determina tipo do ativo baseado no símbolo
        let assetType: "Crypto" | "Ação" | "Ação BR" | "Índice" = "Ação";
        if (symbol.includes("BINANCE:") || symbol.includes("BTC") || symbol.includes("ETH") || 
            symbol.includes("SOL") || symbol.includes("BNB") || symbol.includes("ADA") || symbol.includes("XRP")) {
          assetType = "Crypto";
        } else if (symbol.includes("INDEX:") || symbol.includes("SPX") || symbol.includes("IXIC") || 
                   symbol.includes("DJI") || symbol.includes("IBOV")) {
          assetType = "Índice";
        } else if (symbol.includes("BMFBOVESPA:") || symbol.includes("VALE") || symbol.includes("PETR")) {
          assetType = "Ação BR";
        }
        
        // Busca dados reais
        const { fetchMarketDataClient } = await import("@/lib/market-data-client");
        const realData = await fetchMarketDataClient(symbol, assetType);
        
        if (realData) {
          const newPrice = realData.price;
          
          setPriceData((prev) => {
            if (prev.length === 0) {
              isUpdating = false;
              return prev;
            }
            
            const newData = [...prev];
            
            // Remove o primeiro ponto e adiciona um novo com preço real
            newData.shift();
            const now = new Date();
            newData.push({
              time: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
              price: Number(newPrice.toFixed(2)),
              volume: realData.volume || Math.random() * 1000000,
            });
            
            // Atualiza referência do último preço
            lastPriceRef.current = newPrice;
            
            // Calcula mudança em relação ao preço inicial do período
            const firstPrice = initialPriceRef.current || newData[0].price;
            const changeValue = newPrice - firstPrice;
            const changePercent = firstPrice > 0 ? (changeValue / firstPrice) * 100 : 0;
            
            // Atualiza estados
            requestAnimationFrame(() => {
              setCurrentPrice(newPrice);
              setPriceChange(changeValue);
              setPriceChangePercent(changePercent);
              isUpdating = false;
            });
            
            return newData;
          });
        } else {
          // Fallback: variação simulada se API falhar
          setPriceData((prev) => {
            if (prev.length === 0) {
              isUpdating = false;
              return prev;
            }
            
            const newData = [...prev];
            const lastPrice = lastPriceRef.current || newData[newData.length - 1].price;
            const volatility = getVolatility(symbol);
            const change = (Math.random() - 0.5) * volatility * 0.8;
            const newPrice = Math.max(0.01, lastPrice * (1 + change));
            
            newData.shift();
            const now = new Date();
            newData.push({
              time: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
              price: Number(newPrice.toFixed(2)),
              volume: Math.random() * 1000000,
            });
            
            lastPriceRef.current = newPrice;
            const firstPrice = initialPriceRef.current || newData[0].price;
            const changeValue = newPrice - firstPrice;
            const changePercent = firstPrice > 0 ? (changeValue / firstPrice) * 100 : 0;
            
            requestAnimationFrame(() => {
              setCurrentPrice(newPrice);
              setPriceChange(changeValue);
              setPriceChangePercent(changePercent);
              isUpdating = false;
            });
            
            return newData;
          });
        }
      } catch (error) {
        console.error("Erro ao atualizar gráfico:", error);
        isUpdating = false;
      }
    };

    // Primeira atualização
    updateChart();
    
    // Atualiza periodicamente
    updateIntervalRef.current = setInterval(updateChart, updateIntervalMs);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
      isUpdating = false;
    };
  }, [symbol, interval, priceData.length, assetType]);

  // Memoiza valores calculados
  const isPositive = useMemo(() => priceChange >= 0, [priceChange]);
  const chartColor = useMemo(() => isPositive ? "#00d4aa" : "#ff4444", [isPositive]);
  const textColor = useMemo(() => theme === "dark" ? "#e0e0e0" : "#1a1a1a", [theme]);
  const gridColor = useMemo(() => theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)", [theme]);

  const formatPrice = useCallback((price: number): string => {
    if (price >= 1000) {
      return price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (price >= 1) {
      return price.toFixed(2);
    } else {
      return price.toFixed(4);
    }
  }, []);

  const CustomTooltip = useCallback(({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const price = data.price;
      const firstPrice = priceData[0]?.price || price;
      const change = price - firstPrice;
      const changePercent = firstPrice > 0 ? ((change / firstPrice) * 100) : 0;
      const isTooltipPositive = change >= 0;
      
      return (
        <div className="bg-dark-card/95 backdrop-blur-xl border border-dark-border rounded-xl p-4 shadow-2xl">
          <p className="text-xs text-dark-text-muted font-light mb-2">{data.time}</p>
          <div className="flex items-baseline space-x-2 mb-2">
            <p className={`text-lg font-light ${isTooltipPositive ? "text-dark-success" : "text-dark-danger"}`}>
              {formatPrice(price)}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded ${isTooltipPositive ? "text-dark-success bg-dark-success/10" : "text-dark-danger bg-dark-danger/10"}`}>
              {isTooltipPositive ? "+" : ""}{changePercent.toFixed(2)}%
            </span>
          </div>
          {data.volume && (
            <p className="text-xs text-dark-text-muted font-light">
              Volume: {data.volume >= 1000000 ? `$${(data.volume / 1000000).toFixed(2)}M` : `$${(data.volume / 1000).toFixed(2)}K`}
            </p>
          )}
        </div>
      );
    }
    return null;
  }, [formatPrice, priceData]);

  const chartHeight = useMemo(() => {
    // Para gráficos pequenos (compactos), usa todo o espaço disponível
    if (typeof height === 'number' && height < 150) {
      return Math.max(height, 200); // Garante mínimo de 200px para evitar erro do recharts
    }
    const calculated = typeof height === 'number' ? height - 100 : 250;
    return Math.max(calculated, 200); // Garante mínimo de 200px para o gráfico
  }, [height]);

  if (priceData.length === 0) {
    return (
      <div
        style={{ width, height: typeof height === 'number' ? height : 350 }}
        className="rounded-lg bg-dark-card/50 flex items-center justify-center border border-dark-border/50"
      >
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-dark-accent/30 border-t-dark-accent rounded-full animate-spin mx-auto mb-3"></div>
          <div className="text-dark-text-muted text-sm">Carregando gráfico...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ width, height: typeof height === 'number' ? height : 350 }}
      className="rounded-lg bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 p-6 relative overflow-hidden"
    >
      {/* Header com preço atual - Adaptável para gráficos compactos */}
      {typeof height === 'number' && height >= 150 ? (
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <h3 className="text-xl font-light text-dark-text-primary mb-1">{symbol.split(":")[1] || symbol}</h3>
            <p className="text-xs text-dark-text-muted font-mono">{symbol}</p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-extralight text-dark-text-primary transition-all duration-300">
                {formatPrice(currentPrice)}
              </p>
              <span className={`text-sm font-light px-2 py-1 rounded-lg transition-colors duration-300 ${
                isPositive ? "text-dark-success bg-dark-success/10" : "text-dark-danger bg-dark-danger/10"
              }`}>
                {isPositive ? "↗" : "↘"}
              </span>
            </div>
            <p className={`text-base font-light mt-1 transition-colors duration-300 ${isPositive ? "text-dark-success" : "text-dark-danger"}`}>
              {isPositive ? "+" : ""}{formatPrice(priceChange)} ({isPositive ? "+" : ""}{priceChangePercent.toFixed(2)}%)
            </p>
            <p className="text-xs text-dark-text-muted font-light mt-1">Última atualização: {new Date().toLocaleTimeString("pt-BR")}</p>
          </div>
        </div>
      ) : (
        // Header compacto para gráficos pequenos - oculto para economizar espaço
        null
      )}

      {/* Gráfico Profissional */}
      <div 
        className="relative w-full" 
        style={{ 
          height: `${Math.max(chartHeight, 200)}px`, 
          minHeight: "200px", 
          width: "100%",
          position: "relative",
          display: "block"
        }}
      >
        {chartHeight >= 200 && (
          <ResponsiveContainer 
            width="100%" 
            height="100%" 
            minHeight={200} 
            minWidth={300}
            debounce={1}
          >
            <AreaChart 
            data={priceData} 
            margin={{ top: 20, right: 20, left: 20, bottom: 30 }}
            syncId={symbol}
          >
            <defs>
              <linearGradient id={`gradient-${symbol.replace(/[^a-zA-Z0-9]/g, "_")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.4} />
                <stop offset="50%" stopColor={chartColor} stopOpacity={0.15} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
          <XAxis
            dataKey="time"
            stroke={textColor}
            style={{ fontSize: typeof height === 'number' && height < 150 ? "9px" : "11px" }}
            tick={{ fill: textColor }}
            interval="preserveStartEnd"
            tickLine={{ stroke: textColor, opacity: 0.3 }}
            hide={typeof height === 'number' && height < 120}
          />
          <YAxis
            stroke={textColor}
            style={{ fontSize: typeof height === 'number' && height < 150 ? "8px" : "11px" }}
            tick={{ fill: textColor }}
            domain={['auto', 'auto']}
            width={typeof height === 'number' && height < 150 ? 45 : 70}
            tickLine={{ stroke: textColor, opacity: 0.3 }}
            tickCount={typeof height === 'number' && height < 150 ? 3 : 5}
            tickFormatter={(value) => {
              // Formatação mais compacta para gráficos pequenos
              if (typeof height === 'number' && height < 150) {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                if (value >= 1) return value.toFixed(1);
                return value.toFixed(2);
              }
              return formatPrice(value);
            }}
          />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: chartColor, strokeWidth: 1, strokeDasharray: "5 5", opacity: 0.5 }}
            />
            <ReferenceLine
              y={currentPrice}
              stroke={chartColor}
              strokeDasharray="3 3"
              strokeOpacity={0.6}
              label={{ value: "Preço Atual", position: "right", fill: chartColor, fontSize: 10 }}
            />
          <Area
            type="monotone"
            dataKey="price"
            stroke={chartColor}
            strokeWidth={typeof height === 'number' && height < 150 ? 2 : 2.5}
            fill={`url(#gradient-${symbol.replace(/[^a-zA-Z0-9]/g, "_")})`}
            dot={false}
            activeDot={{ 
              r: typeof height === 'number' && height < 150 ? 3 : 5, 
              fill: chartColor, 
              stroke: "#fff", 
              strokeWidth: typeof height === 'number' && height < 150 ? 1 : 2 
            }}
            isAnimationActive={priceData.length > 0}
            animationDuration={typeof height === 'number' && height < 150 ? 200 : 300}
            animationEasing="ease-in-out"
            connectNulls={false}
          />
          </AreaChart>
          </ResponsiveContainer>
        )}
        
        {/* Indicadores Visuais */}
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-2 py-1 bg-dark-card/80 backdrop-blur-sm rounded-lg border border-dark-border/30">
            <div className={`w-2 h-2 rounded-full ${isPositive ? "bg-dark-success" : "bg-dark-danger"}`}></div>
            <span className="text-xs text-dark-text-muted font-light">
              {isPositive ? "Alta" : "Baixa"}
            </span>
          </div>
        </div>
      </div>
      
      {/* Legenda e Estatísticas - Apenas para gráficos maiores */}
      {priceData.length > 0 && typeof height === 'number' && height >= 150 && (
        <div className="mt-4 pt-4 border-t border-dark-border/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-dark-text-muted font-light mb-1">Preço Inicial</p>
              <p className="text-dark-text-primary font-light">{formatPrice(priceData[0].price)}</p>
            </div>
            <div>
              <p className="text-dark-text-muted font-light mb-1">Preço Atual</p>
              <p className="text-dark-text-primary font-light">{formatPrice(currentPrice)}</p>
            </div>
            <div>
              <p className="text-dark-text-muted font-light mb-1">Variação</p>
              <p className={`font-light ${isPositive ? "text-dark-success" : "text-dark-danger"}`}>
                {isPositive ? "+" : ""}{priceChangePercent.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-dark-text-muted font-light mb-1">Pontos no Gráfico</p>
              <p className="text-dark-text-primary font-light">{priceData.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
