import { promises as fs } from "fs";
import path from "path";
import { NewsData, NewsItem } from "@/types/news";
import { memoryCache } from "@/lib/cache";

// Caminho do arquivo JSON onde as notícias serão salvas
// Na Vercel, usa /tmp (único diretório writable)
// Em desenvolvimento/local, usa data/
const DATA_DIR = process.env.VERCEL 
  ? "/tmp" 
  : path.join(process.cwd(), "data");
const NEWS_FILE = path.join(DATA_DIR, "news.json");

// Chave para cache em memória (fallback para Vercel onde /tmp é efêmero)
const MEMORY_CACHE_KEY = "news:storage";

/**
 * Garante que o diretório data existe
 * Cria o diretório se não existir
 */
async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    // Se o diretório não existe, cria
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * Salva as notícias no arquivo JSON
 * @param news - Array de notícias para salvar
 */
export async function saveNews(news: NewsItem[]): Promise<void> {
  try {
    // Cria o objeto de dados com timestamp
    const data: NewsData = {
      lastUpdate: new Date().toISOString(),
      news: news,
    };

    // SEMPRE salva em memória primeiro (funciona em qualquer ambiente)
    memoryCache.set(MEMORY_CACHE_KEY, data, 3600000); // 1 hora de cache

    // Tenta salvar no arquivo (pode falhar na Vercel, mas não é crítico)
    try {
      await ensureDataDir();
      await fs.writeFile(NEWS_FILE, JSON.stringify(data, null, 2), "utf-8");
      
      if (process.env.NODE_ENV === "development") {
        console.log(`✅ ${news.length} notícias salvas em ${NEWS_FILE}`);
      }
    } catch (fileError) {
      // Se falhar ao salvar em arquivo, não é crítico - já está em memória
      if (process.env.NODE_ENV === "development") {
        console.warn("Aviso: Não foi possível salvar em arquivo, usando apenas cache em memória:", fileError);
      }
    }
    
    // Log de sucesso
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ ${news.length} notícias salvas (memória + arquivo)`);
    } else {
      console.log(`✅ ${news.length} notícias salvas`);
    }
  } catch (error) {
    console.error("Erro ao salvar notícias:", error);
    throw error;
  }
}

/**
 * Lê as notícias do arquivo JSON
 * @returns Dados das notícias ou null se o arquivo não existir
 */
export async function loadNews(): Promise<NewsData | null> {
  // Primeiro tenta carregar do cache em memória (mais rápido e funciona sempre)
  const cachedData = memoryCache.get<NewsData>(MEMORY_CACHE_KEY);
  if (cachedData) {
    return cachedData;
  }

  // Se não está em cache, tenta carregar do arquivo
  try {
    const fileContent = await fs.readFile(NEWS_FILE, "utf-8");
    const data: NewsData = JSON.parse(fileContent);
    
    // Salva no cache em memória para próximas leituras
    memoryCache.set(MEMORY_CACHE_KEY, data, 3600000); // 1 hora
    
    return data;
  } catch (error) {
    // Se o arquivo não existe ou há erro, retorna null
    // O cron job criará as notícias na próxima execução
    if (process.env.NODE_ENV === "development") {
      console.log("Arquivo de notícias não encontrado, será criado na primeira atualização");
    }
    return null;
  }
}

/**
 * Retorna o caminho do arquivo (útil para debug)
 */
export function getNewsFilePath(): string {
  return NEWS_FILE;
}

