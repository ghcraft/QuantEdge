/**
 * Gerenciamento de Horários de Mercado
 * Controla quando os mercados estão abertos e quando as cotações devem atualizar
 */

export interface MarketHours {
  isOpen: boolean;
  nextOpen?: Date;
  nextClose?: Date;
  message: string;
}

/**
 * Verifica se o mercado brasileiro (B3) está aberto
 * Horário: Segunda a Sexta, 10h às 17h (horário de Brasília)
 */
export function isBrazilianMarketOpen(): MarketHours {
  const now = new Date();
  const brasiliaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
  
  const day = brasiliaTime.getDay(); // 0 = Domingo, 6 = Sábado
  const hour = brasiliaTime.getHours();
  const minute = brasiliaTime.getMinutes();
  const currentTime = hour * 60 + minute;
  
  // Segunda a Sexta (1-5)
  const isWeekday = day >= 1 && day <= 5;
  
  // Horário de pregão: 10:00 às 17:00 (600 a 1020 minutos)
  const marketOpen = 10 * 60; // 10:00
  const marketClose = 17 * 60; // 17:00
  
  const isOpen = isWeekday && currentTime >= marketOpen && currentTime < marketClose;
  
  if (isOpen) {
    const closeTime = new Date(brasiliaTime);
    closeTime.setHours(17, 0, 0, 0);
    
    return {
      isOpen: true,
      nextClose: closeTime,
      message: "Mercado aberto",
    };
  }
  
  // Calcula próximo horário de abertura
  const nextOpen = new Date(brasiliaTime);
  
  if (!isWeekday || currentTime < marketOpen) {
    // Se é fim de semana ou antes das 10h, abre na próxima segunda ou amanhã às 10h
    if (day === 0) { // Domingo
      nextOpen.setDate(nextOpen.getDate() + 1); // Segunda
    } else if (day === 6) { // Sábado
      nextOpen.setDate(nextOpen.getDate() + 2); // Segunda
    } else if (currentTime < marketOpen) {
      // Hoje, mas antes das 10h
      nextOpen.setHours(10, 0, 0, 0);
    } else {
      // Hoje, mas depois das 17h - próxima segunda
      const daysUntilMonday = (8 - day) % 7 || 7;
      nextOpen.setDate(nextOpen.getDate() + daysUntilMonday);
    }
    nextOpen.setHours(10, 0, 0, 0);
  } else {
    // Depois das 17h em dia útil - próxima segunda
    const daysUntilMonday = (8 - day) % 7 || 7;
    nextOpen.setDate(nextOpen.getDate() + daysUntilMonday);
    nextOpen.setHours(10, 0, 0, 0);
  }
  
  return {
    isOpen: false,
    nextOpen,
    message: `Mercado fechado. Abre ${nextOpen.toLocaleDateString("pt-BR", { weekday: "long", hour: "2-digit", minute: "2-digit" })}`,
  };
}

/**
 * Verifica se o mercado americano (NYSE/NASDAQ) está aberto
 * Horário: Segunda a Sexta, 9:30 às 16:00 (horário de Nova York - ET)
 */
export function isUSMarketOpen(): MarketHours {
  const now = new Date();
  const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  
  const day = nyTime.getDay();
  const hour = nyTime.getHours();
  const minute = nyTime.getMinutes();
  const currentTime = hour * 60 + minute;
  
  const isWeekday = day >= 1 && day <= 5;
  const marketOpen = 9 * 60 + 30; // 9:30
  const marketClose = 16 * 60; // 16:00
  
  const isOpen = isWeekday && currentTime >= marketOpen && currentTime < marketClose;
  
  if (isOpen) {
    const closeTime = new Date(nyTime);
    closeTime.setHours(16, 0, 0, 0);
    
    return {
      isOpen: true,
      nextClose: closeTime,
      message: "Mercado aberto",
    };
  }
  
  const nextOpen = new Date(nyTime);
  
  if (!isWeekday || currentTime < marketOpen) {
    if (day === 0) {
      nextOpen.setDate(nextOpen.getDate() + 1);
    } else if (day === 6) {
      nextOpen.setDate(nextOpen.getDate() + 2);
    } else if (currentTime < marketOpen) {
      nextOpen.setHours(9, 30, 0, 0);
    } else {
      const daysUntilMonday = (8 - day) % 7 || 7;
      nextOpen.setDate(nextOpen.getDate() + daysUntilMonday);
    }
    nextOpen.setHours(9, 30, 0, 0);
  } else {
    const daysUntilMonday = (8 - day) % 7 || 7;
    nextOpen.setDate(nextOpen.getDate() + daysUntilMonday);
    nextOpen.setHours(9, 30, 0, 0);
  }
  
  return {
    isOpen: false,
    nextOpen,
    message: `Mercado fechado. Abre ${nextOpen.toLocaleDateString("pt-BR", { weekday: "long", hour: "2-digit", minute: "2-digit" })}`,
  };
}

/**
 * Verifica se o mercado está aberto baseado no tipo de ativo
 */
export function isMarketOpen(assetType: "Crypto" | "Ação" | "Ação BR" | "Índice", symbol?: string): MarketHours {
  // Criptomoedas: sempre abertas
  if (assetType === "Crypto") {
    return {
      isOpen: true,
      message: "Mercado 24/7",
    };
  }
  
  // Ações brasileiras e Ibovespa: horário B3
  if (assetType === "Ação BR" || (assetType === "Índice" && symbol?.includes("IBOV"))) {
    return isBrazilianMarketOpen();
  }
  
  // Ações internacionais e índices americanos: horário NYSE/NASDAQ
  if (assetType === "Ação" || (assetType === "Índice" && (symbol?.includes("SPX") || symbol?.includes("IXIC") || symbol?.includes("DJI")))) {
    return isUSMarketOpen();
  }
  
  // Índices: seguem o mercado correspondente
  if (assetType === "Índice") {
    // Por padrão, assume mercado brasileiro
    return isBrazilianMarketOpen();
  }
  
  // Fallback: assume fechado
  return {
    isOpen: false,
    message: "Horário de mercado não disponível",
  };
}

/**
 * Calcula o intervalo de atualização baseado no status do mercado
 */
export function getUpdateInterval(assetType: "Crypto" | "Ação" | "Ação BR" | "Índice", symbol?: string): number {
  const marketStatus = isMarketOpen(assetType, symbol);
  
  // Criptomoedas: atualiza a cada 5 segundos (24/7)
  if (assetType === "Crypto") {
    return 5000;
  }
  
  // Mercado aberto: atualiza a cada 10 segundos
  if (marketStatus.isOpen) {
    return 10000;
  }
  
  // Mercado fechado: atualiza a cada 5 minutos (para verificar quando abrir)
  return 300000; // 5 minutos
}


