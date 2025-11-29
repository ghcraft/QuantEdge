"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { NewsItem, NewsData } from "@/types/news";
import NewsCard from "./NewsCard";
import SkeletonLoader from "./SkeletonLoader";

interface NewsFeedProps {
  filterSources?: string[]; // Filtrar por fontes específicas
}

/**
 * Componente NewsFeed
 * Gerencia o feed de notícias com auto-refresh
 * Estilo tipo chat/terminal financeiro
 */
export default function NewsFeed({ filterSources }: NewsFeedProps = {}) {
  // Estado das notícias
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sincroniza o ref com o estado quando news muda
  useEffect(() => {
    newsRef.current = news;
  }, [news]);

  // Refs para controlar animações de novas entradas
  const previousNewsIds = useRef<Set<string>>(new Set());
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const newsRef = useRef<NewsItem[]>([]);

  /**
   * Busca notícias da API
   * Otimizado com retry e tratamento de rate limiting
   */
  const fetchNews = useCallback(async (retryCount = 0) => {
    try {
      setError(null);
      const response = await fetch("/api/news", {
        cache: "default", // Usa cache do navegador quando apropriado
        headers: {
          "Cache-Control": "max-age=30",
        },
      });

      // Trata rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
        
        if (retryCount < 2) {
          setTimeout(() => fetchNews(retryCount + 1), waitTime);
          return;
        }
        
        throw new Error("Muitas requisições. Aguarde alguns instantes.");
      }

      if (!response.ok) {
        throw new Error(`Erro ao buscar notícias: ${response.status}`);
      }

      const data: NewsData = await response.json();

      // Verifica se há notícias válidas
      if (!data) {
        console.warn("[NewsFeed] Resposta da API sem dados");
        setNews([]);
        setLoading(false);
        return;
      }

      // Filtra por fontes se especificado
      let filteredNews = (data.news || []);
      if (filterSources && filterSources.length > 0 && filteredNews.length > 0) {
        filteredNews = filteredNews.filter((n) => filterSources.includes(n.source));
      }
      
      // Valida que as notícias têm os campos necessários
      filteredNews = filteredNews.filter((n) => n && n.title && n.link);

      // Ordena por data (mais recentes primeiro)
      filteredNews.sort((a, b) => {
        return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
      });

      // Detecta quais notícias são novas comparando IDs
      const currentIds = new Set(filteredNews.map((n) => n.id));
      const newNewsIds = filteredNews
        .filter((n) => !previousNewsIds.current.has(n.id))
        .map((n) => n.id);

      // Atualiza o estado
      setNews(filteredNews);
      newsRef.current = filteredNews; // Atualiza o ref também
      setLastUpdate(data.lastUpdate);
      setLoading(false);

      // Atualiza o ref com os IDs atuais
      previousNewsIds.current = currentIds;

      // Se há notícias novas, loga (pode ser usado para notificações)
      if (newNewsIds.length > 0) {
        console.log(`📰 ${newNewsIds.length} nova(s) notícia(s)`);
      }
    } catch (err) {
      console.error("Erro ao buscar notícias:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar notícias. Tente novamente.";
      setError(errorMessage);
      setLoading(false);
      
      // Se houver notícias antigas, mantém elas visíveis
      if (newsRef.current.length > 0) {
        // Não limpa as notícias existentes em caso de erro
        return;
      }
    }
  }, [filterSources]);

  /**
   * Efeito para buscar notícias na montagem e configurar auto-refresh
   */
  useEffect(() => {
    // Busca imediatamente
    fetchNews();

    // Configura auto-refresh a cada 75 segundos (entre 60-90s)
    refreshIntervalRef.current = setInterval(() => {
      fetchNews();
    }, 75000); // 75 segundos

    // Cleanup: limpa o interval quando o componente desmonta
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchNews]);

  /**
   * Formata o timestamp da última atualização
   */
  const formatLastUpdate = (timestamp: string | null): string => {
    if (!timestamp) return "Nunca";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full">
      {/* Header estilo TradingView */}
      <div className="bg-dark-card border-b border-dark-border">
        <div className="px-3 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <h2 className="text-xs sm:text-sm font-semibold text-dark-text-primary">Notícias</h2>
            {lastUpdate && (
              <span className="text-xs text-dark-text-secondary">
                Atualizado {formatLastUpdate(lastUpdate)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!loading && news.length > 0 && (
              <span className="text-xs text-dark-text-secondary">
                {news.length} itens
              </span>
            )}
            {lastUpdate && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-green-500 font-medium">Live</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && <SkeletonLoader />}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 m-4 text-red-400 text-center">
          {error}
          <button
            onClick={() => fetchNews()}
            className="mt-2 px-4 py-2 bg-dark-accent text-dark-bg rounded hover:bg-dark-accent-hover transition-colors text-sm"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* News Feed - estilo TradingView (lista compacta) */}
      {!loading && !error && (
        <div className="bg-dark-card border border-dark-border">
          {news.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4">
              <div className="text-4xl mb-4">📰</div>
              <p className="text-dark-text-primary font-medium mb-2">Nenhuma notícia disponível</p>
              <p className="text-sm text-dark-text-secondary mb-4">
                As notícias serão atualizadas automaticamente.
              </p>
              <button
                onClick={() => {
                  setLoading(true);
                  fetch("/api/cron/update", { method: "POST" })
                    .then(() => {
                      setTimeout(() => fetchNews(), 2000);
                    })
                    .catch(() => {
                      setLoading(false);
                    });
                }}
                className="px-4 py-2 bg-dark-accent/20 text-dark-accent border border-dark-accent/50 rounded-xl hover:bg-dark-accent/30 transition-colors text-sm"
              >
                Forçar Atualização
              </button>
            </div>
          ) : (
            <div className="divide-y divide-dark-border/50">
              {news.map((item) => {
                // Verifica se é uma notícia nova (não estava na lista anterior)
                const isNew = !previousNewsIds.current.has(item.id);
                return (
                  <NewsCard
                    key={item.id}
                    news={item}
                    isNew={isNew}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Footer minimalista */}
      {!loading && news.length > 0 && (
        <div className="px-4 py-3 bg-dark-card border-t border-dark-border">
          <div className="flex items-center justify-center text-xs text-dark-text-secondary">
            <span>Auto-atualização a cada 75 segundos</span>
          </div>
        </div>
      )}
    </div>
  );
}

