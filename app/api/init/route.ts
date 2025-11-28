import { NextResponse } from "next/server";
import { startCronJob } from "@/lib/cron-job";

/**
 * API Route: GET /api/init
 * Endpoint para inicializar o cron job manualmente
 * 
 * Útil para garantir que o cron está rodando
 * Pode ser chamado uma vez ao iniciar o servidor
 * 
 * Este endpoint é chamado automaticamente quando o servidor inicia
 */
export async function GET() {
  try {
    // Inicia o cron job
    startCronJob();

    return NextResponse.json(
      { message: "Cron job iniciado com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao iniciar cron job:", error);
    
    return NextResponse.json(
      { error: "Erro ao iniciar cron job" },
      { status: 500 }
    );
  }
}
