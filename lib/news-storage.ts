import { promises as fs } from "fs";
import path from "path";
import { NewsData, NewsItem } from "@/types/news";

// Caminho do arquivo JSON onde as notícias serão salvas
const DATA_DIR = path.join(process.cwd(), "data");
const NEWS_FILE = path.join(DATA_DIR, "news.json");

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
    // Garante que o diretório existe
    await ensureDataDir();

    // Cria o objeto de dados com timestamp
    const data: NewsData = {
      lastUpdate: new Date().toISOString(),
      news: news,
    };

    // Salva no arquivo JSON
    await fs.writeFile(NEWS_FILE, JSON.stringify(data, null, 2), "utf-8");
    console.log(`✅ ${news.length} notícias salvas em ${NEWS_FILE}`);
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
  try {
    // Tenta ler o arquivo
    const fileContent = await fs.readFile(NEWS_FILE, "utf-8");
    const data: NewsData = JSON.parse(fileContent);
    return data;
  } catch (error) {
    // Se o arquivo não existe ou há erro, retorna null
    console.log("Arquivo de notícias não encontrado, será criado na primeira atualização");
    return null;
  }
}

/**
 * Retorna o caminho do arquivo (útil para debug)
 */
export function getNewsFilePath(): string {
  return NEWS_FILE;
}

