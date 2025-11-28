import { NextResponse } from "next/server";
import { fetchMultipleMarketData } from "@/lib/market-data";

/**
 * API Route: POST /api/market-data
 * Busca dados de mercado para múltiplos ativos
 * Executa no servidor, evitando problemas de CSP
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symbols } = body;

    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json(
        { error: "Lista de símbolos inválida" },
        { status: 400 }
      );
    }

    // Busca dados no servidor
    const marketData = await fetchMultipleMarketData(symbols);

    // Converte Map para objeto para serialização JSON
    const dataObject: Record<string, any> = {};
    marketData.forEach((value, key) => {
      // Garante que os dados são válidos antes de adicionar
      if (value && value.price > 0 && !isNaN(value.price)) {
        dataObject[key] = value;
      } else {
        console.warn(`[API Market Data] Dados inválidos para ${key}:`, value);
      }
    });

    // Log para debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      const cryptoCount = symbols.filter(s => s.type === 'Crypto').length;
      const cryptoReceived = Object.keys(dataObject).filter(k => k.includes('BINANCE:')).length;
      console.log(`[API Market Data] Criptomoedas: ${cryptoReceived}/${cryptoCount} recebidas`);
    }

    return NextResponse.json({
      success: true,
      data: dataObject,
      count: Object.keys(dataObject).length,
    });
  } catch (error) {
    console.error("[API Market Data] Erro:", error);
    return NextResponse.json(
      { 
        error: "Erro ao buscar dados de mercado",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/market-data
 * Busca dados de mercado para um único ativo via query params
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const typeParam = searchParams.get("type");

    console.log(`[API Market Data] GET request: symbol=${symbol}, type=${typeParam}`);

    if (!symbol || !typeParam) {
      console.warn(`[API Market Data] Parâmetros faltando: symbol=${symbol}, type=${typeParam}`);
      return NextResponse.json(
        { error: "Parâmetros 'symbol' e 'type' são obrigatórios" },
        { status: 400 }
      );
    }

    // Decodifica o tipo (pode vir com encoding)
    // Normaliza o tipo para garantir compatibilidade
    let type = decodeURIComponent(typeParam).trim() as "Crypto" | "Ação" | "Ação BR" | "Índice";
    
    // Normaliza variações comuns
    if (type === "Crypto" || type.toLowerCase() === "crypto") {
      type = "Crypto";
    } else if (type === "Ação BR" || type.toLowerCase().includes("ação br") || type.toLowerCase().includes("acao br")) {
      type = "Ação BR";
    } else if (type === "Índice" || type.toLowerCase() === "índice" || type.toLowerCase() === "indice") {
      type = "Índice";
    } else {
      type = "Ação"; // Default
    }

    // Tratamento especial para USDBRL (dólar)
    if (symbol === "USDBRL") {
      try {
        const response = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/USDBRL=X?interval=1d&range=1d`,
          { cache: 'no-store' }
        );
        
        if (!response.ok) {
          throw new Error(`Yahoo Finance API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.chart?.result?.[0]?.meta) {
          const meta = data.chart.result[0].meta;
          const price = meta.regularMarketPrice || meta.previousClose || 4.95;
          const previousClose = meta.previousClose || price;
          const change = price - previousClose;
          const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

          return NextResponse.json({
            success: true,
            data: {
              symbol: "USDBRL",
              price,
              change,
              changePercent,
              volume: meta.regularMarketVolume || 0,
              high24h: meta.regularMarketDayHigh || price,
              low24h: meta.regularMarketDayLow || price,
              timestamp: Date.now(),
            },
          });
        }
      } catch (error) {
        console.error("[API Market Data] Erro ao buscar dólar:", error);
        // Retorna dados padrão em caso de erro
        return NextResponse.json({
          success: true,
          data: {
            symbol: "USDBRL",
            price: 4.95,
            change: 0,
            changePercent: 0,
            volume: 0,
            high24h: 4.95,
            low24h: 4.95,
            timestamp: Date.now(),
          },
        });
      }
    }

    try {
      const { fetchMarketData } = await import("@/lib/market-data");
      const marketData = await fetchMarketData(symbol, type);

      if (!marketData) {
        console.warn(`[API Market Data] Dados não encontrados para ${symbol} (${type})`);
        // Retorna dados vazios ao invés de 404 para evitar quebrar o frontend
        return NextResponse.json({
          success: false,
          error: "Dados não encontrados",
          data: null,
        });
      }

      return NextResponse.json({
        success: true,
        data: marketData,
      });
    } catch (fetchError) {
      console.error(`[API Market Data] Erro ao buscar ${symbol}:`, fetchError);
      // Retorna erro 500 ao invés de 404 para indicar erro de processamento
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao processar requisição",
          details: fetchError instanceof Error ? fetchError.message : "Erro desconhecido",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[API Market Data] Erro:", error);
    return NextResponse.json(
      { 
        error: "Erro ao buscar dados de mercado",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}


