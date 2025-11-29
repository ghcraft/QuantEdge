import Parser from "rss-parser";
import { NewsItem } from "@/types/news";

// Instância do parser RSS
const parser = new Parser();

/**
 * URLs dos feeds RSS gratuitos de notícias financeiras
 * Principais fontes do mercado financeiro brasileiro e internacional
 * 
 * Nota: Alguns feeds podem estar temporariamente indisponíveis
 * O sistema tentará todos e usará os que funcionarem
 */
const RSS_FEEDS = [
  // ========== FONTES BRASILEIRAS - MERCADO FINANCEIRO ==========
  {
    name: "InfoMoney",
    url: "https://www.infomoney.com.br/feed/",
  },
  {
    name: "Valor Econômico",
    url: "https://www.valor.com.br/financas/rss",
  },
  {
    name: "Exame",
    url: "https://exame.com/feed/",
  },
  {
    name: "Investing.com Brasil",
    url: "https://br.investing.com/rss/news.rss",
  },
  {
    name: "Folha de S.Paulo - Mercado",
    url: "https://feeds.folha.uol.com.br/mercado/rss091.xml",
  },
  {
    name: "Estadão - Economia",
    url: "https://www.estadao.com.br/economia/rss.xml",
  },
  {
    name: "O Globo - Economia",
    url: "https://oglobo.globo.com/rss/economia/",
  },
  {
    name: "IstoÉ Dinheiro",
    url: "https://www.istoedinheiro.com.br/feed/",
  },
  {
    name: "Agência Estado",
    url: "https://www.ae.com.br/rss/economia",
  },
  {
    name: "Seu Dinheiro",
    url: "https://www.seudinheiro.com/feed/",
  },
  {
    name: "Suno Notícias",
    url: "https://www.suno.com.br/feed/",
  },
  {
    name: "Brasil 247 - Economia",
    url: "https://www.brasil247.com/rss/economia",
  },
  
  // ========== FONTES INTERNACIONAIS - MERCADO FINANCEIRO ==========
  {
    name: "Yahoo Finance",
    url: "https://feeds.finance.yahoo.com/rss/2.0/headline?s=^BVSP,^GSPC,^IXIC&region=US&lang=pt-BR",
  },
  {
    name: "MarketWatch",
    url: "https://www.marketwatch.com/rss/topstories",
  },
  {
    name: "Financial Times",
    url: "https://www.ft.com/?format=rss",
  },
  {
    name: "Bloomberg",
    url: "https://www.bloomberg.com/feed/topics/economics",
  },
  {
    name: "CNBC",
    url: "https://www.cnbc.com/id/100003114/device/rss/rss.html",
  },
  {
    name: "Investing.com Global",
    url: "https://www.investing.com/rss/news.rss",
  },
  
  // Feeds removidos temporariamente devido a erros:
  // - UOL Economia: Feed não reconhecido como RSS 1 ou 2
  // - CNN Brasil: Caracteres inválidos no XML
  // - Terra: Status 404
  // - Reuters Brasil: Status 401 (requer autenticação)
  // - G1 Economia: Unable to parse XML
];

/**
 * Busca notícias de um feed RSS específico
 * @param feedUrl - URL do feed RSS
 * @param feedName - Nome da fonte
 * @returns Array de notícias formatadas
 */
async function fetchFeedNews(
  feedUrl: string,
  feedName: string
): Promise<NewsItem[]> {
  try {
    // Faz o parse do feed RSS com timeout de 10 segundos
    const feed = await Promise.race([
      parser.parseURL(feedUrl),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 10000)
      ),
    ]) as Awaited<ReturnType<typeof parser.parseURL>>;

    // Converte os itens do feed para o formato NewsItem
    const newsItems: NewsItem[] = (feed.items || []).map((item, index) => ({
      id: `${feedName}-${Date.now()}-${index}`, // ID único
      title: item.title || "Sem título",
      link: item.link || "",
      pubDate: item.pubDate
        ? new Date(item.pubDate).toISOString()
        : new Date().toISOString(),
      source: feedName,
      description: item.contentSnippet || item.content || undefined,
      content: item.content || undefined,
    }));

    return newsItems;
  } catch (error) {
    // Em caso de erro, retorna array vazio
    // NÃO loga erros em produção para não poluir logs
    // Apenas retorna array vazio silenciosamente
    return [];
  }
}

/**
 * Busca notícias de todos os feeds RSS configurados
 * Retorna entre 10 e 20 notícias das principais fontes do mercado financeiro
 * 
 * Fontes incluídas:
 * - Brasileiras: InfoMoney, Valor, Exame, Investing.com, Folha, Estadão, Globo, IstoÉ, etc.
 * - Internacionais: Yahoo Finance, MarketWatch, Financial Times, Bloomberg, CNBC, etc.
 * 
 * @returns Array de notícias (10-20 itens)
 */
export async function fetchAllNews(): Promise<NewsItem[]> {
  try {
    // Busca notícias de todos os feeds em paralelo
    // Usa Promise.allSettled para não falhar se alguns feeds derem erro
    const allPromises = RSS_FEEDS.map((feed) =>
      fetchFeedNews(feed.url, feed.name).catch(() => []) // Retorna array vazio em caso de erro
    );

    // Aguarda todas as requisições (mesmo que algumas falhem)
    const allResults = await Promise.all(allPromises);

    // Flatten: junta todos os arrays em um só
    // (os erros já foram tratados em fetchFeedNews, retornando array vazio)
    const allNews = allResults.flat();

    // Remove duplicatas baseado no título (case-insensitive)
    const uniqueNews = allNews.filter(
      (news, index, self) =>
        index ===
        self.findIndex(
          (n) => n.title.toLowerCase() === news.title.toLowerCase()
        )
    );

    // Se não há notícias, retorna array vazio
    if (uniqueNews.length === 0) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[RSS] Nenhuma notícia encontrada em nenhum feed");
      }
      return [];
    }

    // Embaralha e pega entre 10 e 20 notícias (mais fontes disponíveis agora)
    const shuffled = uniqueNews.sort(() => Math.random() - 0.5);
    const count = Math.min(
      Math.max(10, Math.floor(Math.random() * 11) + 10), // Entre 10 e 20
      shuffled.length
    );
    
    return shuffled.slice(0, count);
  } catch (error) {
    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      console.error("Erro ao buscar notícias:", error);
    }
    return [];
  }
}

