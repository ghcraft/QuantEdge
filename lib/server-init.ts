/**
 * Arquivo de inicialização do servidor
 * Este arquivo é importado automaticamente quando o servidor Next.js inicia
 * 
 * IMPORTANTE: Este arquivo só roda no servidor, nunca no cliente
 */

import { startCronJob } from "./cron-job";

// Verifica se está rodando no servidor (não no cliente)
if (typeof window === "undefined") {
  // Inicia o cron job automaticamente quando o módulo é carregado
  // Isso acontece quando qualquer API route é acessada pela primeira vez
  try {
    startCronJob();
  } catch (error) {
    console.error("Erro ao iniciar cron job automaticamente:", error);
  }
}

