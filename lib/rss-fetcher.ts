import Parser from "rss-parser";
import { NewsItem } from "@/types/news";

// Instância do parser RSS
const parser = new Parser();

/**
 * URLs dos feeds RSS gratuitos de notícias financeiras em PORTUGUÊS
 * Feeds de fontes brasileiras e internacionais em português
 * 
 * Nota: Alguns feeds podem estar temporariamente indisponíveis
 * O sistema tentará todos e usará os que funcionarem
 */
const RSS_FEEDS = [
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
    name: "G1 Economia",
    url: "https://g1.globo.com/rss/g1/economia/",
  },
  {
    name: "UOL Economia",
    url: "https://rss.uol.com.br/feed/economia.xml",
  },
  {
    name: "Folha de S.Paulo - Mercado",
    url: "https://feeds.folha.uol.com.br/mercado/rss091.xml",
  },
  {
    name: "CNN Brasil - Economia",
    url: "https://www.cnnbrasil.com.br/economia/feed/",
  },
  {
    name: "Terra - Economia",
    url: "https://www.terra.com.br/rss/economia.xml",
  },
  {
    name: "Reuters Brasil",
    url: "https://br.reuters.com/rssFeed/businessNews",
  },
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
    // Faz o parse do feed RSS
    const feed = await parser.parseURL(feedUrl);

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
    // Em caso de erro, retorna array vazio e loga o erro
    console.error(`Erro ao buscar feed ${feedName}:`, error);
    return [];
  }
}

/**
 * Busca notícias de todos os feeds RSS configurados
 * Retorna entre 3 e 6 notícias aleatórias de todas as fontes
 * @returns Array de notícias (3-6 itens)
 */
export async function fetchAllNews(): Promise<NewsItem[]> {
  try {
    // Busca notícias de todos os feeds em paralelo
    const allPromises = RSS_FEEDS.map((feed) =>
      fetchFeedNews(feed.url, feed.name)
    );

    // Aguarda todas as requisições
    const allResults = await Promise.all(allPromises);

    // Flatten: junta todos os arrays em um só
    const allNews = allResults.flat();

    // Remove duplicatas baseado no título (case-insensitive)
    const uniqueNews = allNews.filter(
      (news, index, self) =>
        index ===
        self.findIndex(
          (n) => n.title.toLowerCase() === news.title.toLowerCase()
        )
    );

    // Embaralha e pega entre 5 e 10 notícias (mais fontes disponíveis)
    const shuffled = uniqueNews.sort(() => Math.random() - 0.5);
    const count = Math.min(
      Math.max(5, Math.floor(Math.random() * 6) + 5), // Entre 5 e 10
      shuffled.length
    );

    return shuffled.slice(0, count);
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    return [];
  }
}

