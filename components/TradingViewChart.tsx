"use client";

import { useEffect, useRef, useState, useMemo } from "react";

interface TradingViewChartProps {
  symbol: string;
  width?: string | number;
  height?: string | number;
  theme?: "dark" | "light";
  interval?: "1" | "5" | "15" | "60" | "240" | "1D";
  hideTopToolbar?: boolean;
  hideSideToolbar?: boolean;
}

// Estado global
let scriptPromise: Promise<void> | null = null;
let scriptLoaded = false;

const ensureScript = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve();
  
  if (scriptLoaded && window.TradingView) {
    return Promise.resolve();
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  const existing = document.querySelector('script[src*="tradingview.com/tv.js"]');
  if (existing) {
    scriptPromise = new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 300;
      const check = setInterval(() => {
        attempts++;
        if (window.TradingView) {
          scriptLoaded = true;
          clearInterval(check);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(check);
          scriptPromise = null;
          reject(new Error("Timeout aguardando TradingView"));
        }
      }, 100);
    });
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    
    script.onload = () => {
      let attempts = 0;
      const maxAttempts = 150;
      const check = setInterval(() => {
        attempts++;
        if (window.TradingView) {
          scriptLoaded = true;
          clearInterval(check);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(check);
          scriptPromise = null;
          reject(new Error("TradingView não disponível"));
        }
      }, 200);
    };
    
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Erro ao carregar script"));
    };
    
    document.head.appendChild(script);
  });

  return scriptPromise;
};

export default function TradingViewChart({
  symbol,
  width = "100%",
  height = 350,
  theme: propTheme,
  interval = "15",
  hideTopToolbar = true,
  hideSideToolbar = true,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const theme = propTheme || "dark";
  
  const containerId = useMemo(() => {
    return `tv_${symbol.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}`;
  }, [symbol]);

  useEffect(() => {
    let mounted = true;
    let timeout: NodeJS.Timeout;

    const init = async () => {
      try {
        setState("loading");
        setErrorMsg("");

        await ensureScript();

        if (!mounted) return;

        // Aguarda container estar disponível
        let containerAttempts = 0;
        while (!containerRef.current && containerAttempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          containerAttempts++;
        }

        if (!containerRef.current) {
          throw new Error("Container não encontrado");
        }

        if (!window.TradingView?.widget) {
          throw new Error("TradingView não disponível");
        }

        containerRef.current.innerHTML = "";

        const widget = new window.TradingView.widget({
          autosize: true,
          symbol,
          interval,
          timezone: "America/Sao_Paulo",
          theme,
          style: "1",
          locale: "br",
          toolbar_bg: theme === "dark" ? "#151515" : "#f5f5f5",
          enable_publishing: false,
          hide_top_toolbar: hideTopToolbar,
          hide_side_toolbar: hideSideToolbar,
          allow_symbol_change: false,
          container_id: containerId,
          width,
          height,
          loading_screen: { backgroundColor: theme === "dark" ? "#151515" : "#f5f5f5" },
          disabled_features: ["use_localstorage_for_settings"],
          save_image: false,
          hide_volume: false,
        });

        widgetRef.current = widget;

        timeout = setTimeout(() => {
          if (mounted) {
            setState("ready");
            if (containerRef.current) {
              containerRef.current.style.pointerEvents = 'auto';
            }
          }
        }, 2500);

      } catch (err: any) {
        if (mounted) {
          setState("error");
          setErrorMsg(err?.message || "Erro ao carregar gráfico");
        }
      }
    };

    // Pequeno delay para garantir que o DOM está pronto
    const timer = setTimeout(init, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (timeout) clearTimeout(timeout);
      if (widgetRef.current) {
        try {
          widgetRef.current.remove?.();
        } catch (e) {}
        widgetRef.current = null;
      }
    };
  }, [symbol, theme, interval, hideTopToolbar, hideSideToolbar, containerId, width, height]);

  const h = typeof height === 'number' ? height : 350;

  if (state === "error") {
    return (
      <div style={{ width, height: h, minHeight: h }} className="rounded-lg bg-dark-card/50 flex items-center justify-center border border-dark-border/50">
        <div className="text-center p-6 max-w-md">
          <div className="w-16 h-16 bg-dark-danger/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-dark-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-dark-text-muted text-sm mb-2 font-light">{errorMsg}</p>
          <p className="text-dark-text-muted text-xs mb-4 font-mono">{symbol}</p>
          <button
            onClick={() => {
              scriptLoaded = false;
              scriptPromise = null;
              setState("loading");
              setErrorMsg("");
            }}
            className="px-4 py-2 text-xs bg-dark-accent/20 hover:bg-dark-accent/30 text-dark-accent border border-dark-accent/50 rounded-xl transition-all"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div style={{ width, height: h, minHeight: h }} className="rounded-lg bg-dark-card/50 flex items-center justify-center border border-dark-border/50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-dark-accent/30 border-t-dark-accent rounded-full animate-spin mx-auto mb-3"></div>
          <div className="text-dark-text-muted text-sm font-light">Carregando gráfico...</div>
          <div className="text-dark-text-muted text-xs mt-2 font-mono">{symbol}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={containerId}
      ref={containerRef}
      style={{ 
        width, 
        height: h, 
        minHeight: h, 
        position: 'relative', 
        pointerEvents: 'auto', 
        zIndex: 1 
      }}
      className="rounded-lg overflow-hidden"
    />
  );
}

declare global {
  interface Window {
    TradingView: any;
  }
}
