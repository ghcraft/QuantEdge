/**
 * Tipos TypeScript para as notícias
 * Define a estrutura dos dados que serão armazenados e exibidos
 */

export interface NewsItem {
  id: string; // ID único gerado para cada notícia
  title: string; // Título da notícia
  link: string; // URL da notícia original
  pubDate: string; // Data de publicação (ISO string)
  source: string; // Fonte da notícia (Reuters, Yahoo Finance, etc.)
  description?: string; // Descrição/resumo da notícia
  content?: string; // Conteúdo completo (se disponível)
}

export interface NewsData {
  lastUpdate: string | null; // Timestamp da última atualização (null se nunca atualizado)
  news: NewsItem[]; // Array de notícias
}

