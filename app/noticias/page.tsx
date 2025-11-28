"use client";

import { useState, useEffect, useMemo } from "react";
import NewsFeed from "@/components/NewsFeed";
import Providers from "../providers";
import { NewsItem } from "@/types/news";

const NEWS_CATEGORIES = [
  { id: "all", label: "Todas", icon: "📰" },
  { id: "mercado", label: "Mercado", icon: "📈" },
  { id: "economia", label: "Economia", icon: "💰" },
  { id: "tecnologia", label: "Tecnologia", icon: "💻" },
  { id: "politica", label: "Política", icon: "🏛️" },
  { id: "empresas", label: "Empresas", icon: "🏢" },
  { id: "crypto", label: "Cripto", icon: "₿" },
];

const NEWS_SOURCES = [
  "Reuters",
  "Yahoo Finance",
  "Bloomberg",
  "Financial Times",
  "Valor Econômico",
  "Infomoney",
];

const TIME_FILTERS = [
  { id: "all", label: "Todas" },
  { id: "1h", label: "Última hora" },
  { id: "24h", label: "Últimas 24h" },
  { id: "7d", label: "Última semana" },
  { id: "30d", label: "Último mês" },
];

/**
 * Página de Notícias - Versão Profissional e Complexa
 * Layout em grid com destaque, filtros avançados e estatísticas
 */
export default function NoticiasPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca notícias para estatísticas
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        if (response.ok) {
          const data = await response.json();
          setNews(data.news || []);
        }
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Calcula estatísticas
  const stats = useMemo(() => {
    const now = new Date();
    const last24h = news.filter((n) => {
      const pubDate = new Date(n.pubDate);
      return now.getTime() - pubDate.getTime() < 24 * 60 * 60 * 1000;
    }).length;

    const sourcesCount = news.reduce((acc, n) => {
      acc[n.source] = (acc[n.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topSources = Object.entries(sourcesCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([source]) => source);

    return {
      total: news.length,
      last24h,
      topSources,
    };
  }, [news]);

  // Filtra notícias em destaque (mais recentes)
  const featuredNews = useMemo(() => {
    return news
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, 3);
  }, [news]);

  return (
    <Providers>
      <main className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg-secondary to-dark-bg">
        {/* Hero Section Aprimorado */}
        <section className="relative overflow-hidden border-b border-dark-border">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-orange-500/5"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,193,7,0.03),transparent_50%)]"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 mb-6">
                <div className="w-1 h-10 bg-gradient-to-b from-amber-400 to-transparent"></div>
                <h1 className="text-5xl md:text-7xl font-extralight tracking-tight">
                  <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                    Notícias Financeiras
                  </span>
                </h1>
              </div>
              <p className="text-xl text-dark-text-muted/80 font-light max-w-3xl mx-auto mb-8">
                Mantenha-se informado com as últimas notícias do mercado financeiro brasileiro e internacional
              </p>
              
              {/* Estatísticas Rápidas */}
              <div className="flex items-center justify-center gap-8 mt-8">
                <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-border/50 rounded-2xl px-6 py-4">
                  <div className="text-3xl font-extralight text-dark-text-primary">{stats.total}</div>
                  <div className="text-xs text-dark-text-muted uppercase tracking-wider mt-1">Total</div>
                </div>
                <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-border/50 rounded-2xl px-6 py-4">
                  <div className="text-3xl font-extralight text-dark-accent">{stats.last24h}</div>
                  <div className="text-xs text-dark-text-muted uppercase tracking-wider mt-1">Últimas 24h</div>
                </div>
                <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-border/50 rounded-2xl px-6 py-4">
                  <div className="text-sm font-light text-dark-text-primary">
                    {stats.topSources.join(", ")}
                  </div>
                  <div className="text-xs text-dark-text-muted uppercase tracking-wider mt-1">Top Fontes</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Coluna Principal */}
            <div className="lg:col-span-3 space-y-8">
              {/* Barra de Busca e Filtros Avançados */}
              <section className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-3xl p-6">
                {/* Busca */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar notícias..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-dark-bg-secondary/50 border border-dark-border rounded-2xl px-6 py-4 text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:border-dark-accent/50 focus:ring-2 focus:ring-dark-accent/20 transition-all"
                    />
                    <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Filtros */}
                <div className="space-y-4">
                  {/* Categorias */}
                  <div>
                    <label className="text-xs font-light text-dark-text-muted uppercase tracking-wider mb-2 block">
                      Categorias
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {NEWS_CATEGORIES.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`px-4 py-2 rounded-xl text-sm font-light transition-all flex items-center gap-2 ${
                            selectedCategory === category.id
                              ? "bg-dark-accent/20 text-dark-accent border border-dark-accent/50"
                              : "bg-dark-bg-secondary/50 text-dark-text-muted hover:text-dark-text-primary border border-dark-border hover:border-dark-accent/30"
                          }`}
                        >
                          <span>{category.icon}</span>
                          {category.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filtro de Tempo */}
                  <div>
                    <label className="text-xs font-light text-dark-text-muted uppercase tracking-wider mb-2 block">
                      Período
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {TIME_FILTERS.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => setSelectedTimeFilter(filter.id)}
                          className={`px-4 py-2 rounded-xl text-sm font-light transition-all ${
                            selectedTimeFilter === filter.id
                              ? "bg-dark-info/20 text-dark-info border border-dark-info/50"
                              : "bg-dark-bg-secondary/50 text-dark-text-muted hover:text-dark-text-primary border border-dark-border hover:border-dark-info/30"
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filtro de Fonte */}
                  <div>
                    <label className="text-xs font-light text-dark-text-muted uppercase tracking-wider mb-2 block">
                      Fontes
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedSource(null)}
                        className={`px-4 py-2 rounded-xl text-sm font-light transition-all ${
                          selectedSource === null
                            ? "bg-dark-success/20 text-dark-success border border-dark-success/50"
                            : "bg-dark-bg-secondary/50 text-dark-text-muted hover:text-dark-text-primary border border-dark-border hover:border-dark-success/30"
                        }`}
                      >
                        Todas
                      </button>
                      {NEWS_SOURCES.map((source) => (
                        <button
                          key={source}
                          onClick={() => setSelectedSource(source)}
                          className={`px-4 py-2 rounded-xl text-sm font-light transition-all ${
                            selectedSource === source
                              ? "bg-dark-success/20 text-dark-success border border-dark-success/50"
                              : "bg-dark-bg-secondary/50 text-dark-text-muted hover:text-dark-text-primary border border-dark-border hover:border-dark-success/30"
                          }`}
                        >
                          {source}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Notícias em Destaque */}
              {!loading && featuredNews.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-extralight text-dark-text-primary">
                      <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                        Em Destaque
                      </span>
                    </h2>
                    <span className="text-xs text-dark-text-muted uppercase tracking-wider">
                      Mais Recentes
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {featuredNews.map((item, index) => (
                      <a
                        key={item.id}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-2xl p-6 hover:border-dark-accent/50 hover:bg-dark-card-hover/50 transition-all"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-medium text-dark-accent uppercase tracking-wide">
                            {item.source}
                          </span>
                          {index === 0 && (
                            <span className="px-2 py-0.5 bg-dark-accent/20 text-dark-accent text-xs rounded-full">
                              NOVO
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-light text-dark-text-primary line-clamp-3 mb-2 group-hover:text-dark-accent transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-dark-text-muted line-clamp-2 mb-3">
                          {item.description}
                        </p>
                        <div className="text-xs text-dark-text-secondary font-mono">
                          {new Date(item.pubDate).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* Feed de Notícias */}
              <section>
                <NewsFeed 
                  filterSources={selectedSource ? [selectedSource] : undefined}
                />
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Estatísticas Detalhadas */}
              <section className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-3xl p-6">
                <h3 className="text-lg font-extralight text-dark-text-primary mb-4">
                  Estatísticas
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-dark-border/50">
                    <span className="text-sm text-dark-text-muted">Total de Notícias</span>
                    <span className="text-lg font-light text-dark-text-primary">{stats.total}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-dark-border/50">
                    <span className="text-sm text-dark-text-muted">Últimas 24h</span>
                    <span className="text-lg font-light text-dark-accent">{stats.last24h}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-text-muted">Fontes Ativas</span>
                    <span className="text-lg font-light text-dark-text-primary">
                      {Object.keys(news.reduce((acc, n) => ({ ...acc, [n.source]: true }), {})).length}
                    </span>
                  </div>
                </div>
              </section>

              {/* Fontes Mais Ativas */}
              <section className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-3xl p-6">
                <h3 className="text-lg font-extralight text-dark-text-primary mb-4">
                  Fontes Mais Ativas
                </h3>
                <div className="space-y-3">
                  {Object.entries(
                    news.reduce((acc, n) => {
                      acc[n.source] = (acc[n.source] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([source, count]) => (
                      <div key={source} className="flex items-center justify-between">
                        <span className="text-sm text-dark-text-muted">{source}</span>
                        <span className="text-sm font-light text-dark-accent">{count}</span>
                      </div>
                    ))}
                </div>
              </section>

              {/* Timeline de Atualizações */}
              <section className="bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-3xl p-6">
                <h3 className="text-lg font-extralight text-dark-text-primary mb-4">
                  Timeline
                </h3>
                <div className="space-y-3">
                  {news
                    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
                    .slice(0, 5)
                    .map((item) => (
                      <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-dark-border/30 last:border-0">
                        <div className="w-2 h-2 bg-dark-accent rounded-full mt-1.5"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-dark-text-muted font-mono mb-1">
                            {new Date(item.pubDate).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="text-xs text-dark-text-primary line-clamp-2">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </Providers>
  );
}

