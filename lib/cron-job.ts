import cron from "node-cron";
import { fetchAllNews } from "./rss-fetcher";
import { saveNews } from "./news-storage";

// Variável para controlar se o cron já foi iniciado
let cronStarted = false;
let cronTask: cron.ScheduledTask | null = null;

/**
 * Função que executa a busca e salvamento de notícias
 * Esta é a função que será chamada pelo cron job
 */
async function updateNews(): Promise<void> {
  console.log("🔄 Iniciando atualização de notícias...");
  const startTime = Date.now();

  try {
    // Busca notícias de todos os feeds RSS
    const news = await fetchAllNews();

    if (news.length > 0) {
      // Salva as notícias no arquivo JSON
      await saveNews(news);
      const duration = Date.now() - startTime;
      console.log(
        `✅ Atualização concluída! ${news.length} notícias em ${duration}ms`
      );
    } else {
      // Log apenas em desenvolvimento
      if (process.env.NODE_ENV === "development") {
        console.warn("⚠️ Nenhuma notícia encontrada - verificando feeds disponíveis...");
      }
      // Tenta buscar notícias novamente após 60 segundos se não encontrou nada
      setTimeout(() => {
        updateNews();
      }, 60000);
    }
  } catch (error) {
    console.error("❌ Erro na atualização de notícias:", error);
  }
}

/**
 * Inicia o cron job que roda a cada 1 hora
 * Formato do cron: "0 * * * *" = a cada hora, no minuto 0
 * 
 * Para testar mais rápido, você pode alterar a linha 58:
 * - A cada 5 minutos: use o padrão de 5 minutos
 * - A cada 1 minuto: use o padrão de 1 minuto (apenas desenvolvimento)
 * Veja documentação do node-cron para formatos alternativos
 */
export function startCronJob(): void {
  // Evita iniciar múltiplas vezes
  if (cronStarted) {
    console.log("ℹ️ Cron job já está rodando");
    return;
  }

  // Marca como iniciado
  cronStarted = true;

  // Executa imediatamente na primeira vez
  updateNews();

  // Agenda para rodar a cada 1 hora (em produção)
  // Em desenvolvimento, pode rodar mais frequentemente
  const cronSchedule = process.env.NODE_ENV === "development" 
    ? "*/15 * * * *" // A cada 15 minutos em desenvolvimento
    : "0 * * * *";   // A cada 1 hora em produção
  
  cronTask = cron.schedule(cronSchedule, () => {
    updateNews();
  });

  console.log(`⏰ Cron job iniciado - atualização a cada ${process.env.NODE_ENV === "development" ? "15 minutos" : "1 hora"}`);
}

/**
 * Para desenvolvimento: atualiza imediatamente
 * Útil para testar sem esperar o cron
 */
export async function updateNewsNow(): Promise<void> {
  await updateNews();
}

