import { NewsItem } from "@/types/news";

interface NewsCardProps {
  news: NewsItem;
  isNew?: boolean; // Flag para animar entradas novas
  variant?: "compact" | "detailed"; // Variante do card
}

/**
 * Componente NewsCard - Versão Profissional e Complexa
 * Suporta variantes compacta e detalhada
 */
export default function NewsCard({ news, isNew = false, variant = "compact" }: NewsCardProps) {
  // Formata a data para exibição
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "agora";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  // Determina categoria baseada em palavras-chave
  const getCategory = (title: string, description?: string): string => {
    const text = `${title} ${description || ""}`.toLowerCase();
    if (text.includes("bitcoin") || text.includes("cripto") || text.includes("crypto")) return "Crypto";
    if (text.includes("ibovespa") || text.includes("b3") || text.includes("bolsa")) return "Mercado";
    if (text.includes("economia") || text.includes("inflação") || text.includes("juros")) return "Economia";
    if (text.includes("tecnologia") || text.includes("tech") || text.includes("ai")) return "Tecnologia";
    if (text.includes("política") || text.includes("governo")) return "Política";
    return "Geral";
  };

  const category = getCategory(news.title, news.description);
  const categoryColors: Record<string, string> = {
    Crypto: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
    Mercado: "from-green-500/20 to-green-600/10 border-green-500/30",
    Economia: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    Tecnologia: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30",
    Política: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
    Geral: "from-gray-500/20 to-gray-600/10 border-gray-500/30",
  };

  if (variant === "detailed") {
    return (
      <article
        className={`
          group relative bg-gradient-to-br ${categoryColors[category] || categoryColors.Geral}
          border border-dark-border/50 rounded-2xl p-6
          hover:border-dark-accent/50 hover:shadow-xl hover:shadow-dark-accent/10
          transition-all duration-300 hover:-translate-y-1
          ${isNew ? "ring-2 ring-dark-accent/50" : ""}
        `}
      >
        <a
          href={news.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-dark-bg-secondary/50 rounded-lg border border-dark-border/50">
                <span className="text-xs font-medium text-dark-text-muted uppercase tracking-wide">
                  {news.source}
                </span>
              </div>
              <div className="px-3 py-1 bg-dark-bg-secondary/50 rounded-lg border border-dark-border/50">
                <span className="text-xs font-light text-dark-text-secondary">
                  {category}
                </span>
              </div>
              {isNew && (
                <div className="px-2 py-1 bg-dark-accent/20 rounded-lg border border-dark-accent/50">
                  <span className="text-xs font-medium text-dark-accent">NOVO</span>
                </div>
              )}
            </div>
            <div className="text-xs text-dark-text-secondary font-mono">
              {formatDate(news.pubDate)}
            </div>
          </div>

          <h3 className="text-lg font-light text-dark-text-primary leading-snug 
                        group-hover:text-dark-accent transition-colors duration-200
                        mb-3 line-clamp-2">
            {news.title}
          </h3>

          {news.description && (
            <p className="text-sm text-dark-text-secondary line-clamp-3 leading-relaxed mb-4">
              {news.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-dark-border/30">
            <div className="flex items-center gap-2 text-xs text-dark-text-muted">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{new Date(news.pubDate).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-dark-accent opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Ler mais</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </a>
      </article>
    );
  }

  // Variante compacta (padrão)
  return (
    <article
      className={`
        group relative border-b border-dark-border/50
        hover:bg-dark-card/30 transition-all duration-200
        ${isNew ? "bg-dark-accent/5 border-l-2 border-l-dark-accent" : ""}
      `}
    >
      <a
        href={news.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block px-4 py-4 relative"
      >
        <div className="flex items-start gap-4">
          {/* Timestamp */}
          <div className="flex-shrink-0 w-20 text-right">
            <div className="text-xs text-dark-text-secondary font-mono mb-1">
              {formatDate(news.pubDate)}
            </div>
            <div className="text-[10px] text-dark-text-muted">
              {new Date(news.pubDate).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="flex-1 min-w-0">
            {/* Fonte e Categoria */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-medium text-dark-text-muted uppercase tracking-wide">
                {news.source}
              </span>
              <div className="h-1 w-1 bg-dark-border rounded-full"></div>
              <span className="text-xs font-light text-dark-text-secondary">
                {category}
              </span>
              {isNew && (
                <>
                  <div className="h-1 w-1 bg-dark-border rounded-full"></div>
                  <span className="px-2 py-0.5 bg-dark-accent/20 text-dark-accent text-[10px] rounded-full">
                    NOVO
                  </span>
                </>
              )}
            </div>

            {/* Título */}
            <h3 className="text-sm font-normal text-dark-text-primary leading-snug 
                          group-hover:text-dark-accent transition-colors duration-200
                          line-clamp-2 mb-2">
              {news.title}
            </h3>

            {/* Descrição compacta */}
            {news.description && (
              <p className="text-xs text-dark-text-secondary line-clamp-2 leading-relaxed">
                {news.description}
              </p>
            )}
          </div>

          {/* Indicador de link externo */}
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1">
            <div className="w-8 h-8 rounded-lg bg-dark-bg-secondary/50 border border-dark-border/50 flex items-center justify-center">
              <svg className="w-4 h-4 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
}

