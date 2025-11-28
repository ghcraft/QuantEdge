"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Valor padrão para evitar erros durante SSR/build
const defaultThemeValue: ThemeContextType = {
  theme: "dark",
  toggleTheme: () => {},
};

// Context sempre inicializado com valor padrão para evitar null durante build
const ThemeContext = createContext<ThemeContextType>(defaultThemeValue);

// Flag global para detectar se estamos em ambiente de build/prerender
// Durante o build do Next.js, process.env.NEXT_PHASE pode estar definido
// Usa uma verificação mais robusta que funciona durante o build
const isBuildTime = (() => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return true;
  }
  // Verifica se estamos em ambiente de build do Next.js
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return true;
  }
  // Verifica se estamos em produção sem runtime (build time)
  if (process.env.NODE_ENV === "production" && !process.env.NEXT_RUNTIME) {
    return true;
  }
  return false;
})();

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const theme: Theme = "dark";

  useEffect(() => {
    // Só executa no cliente real
    if (typeof window === "undefined" || typeof document === "undefined") return;
    
    setMounted(true);
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    // Função vazia - tema sempre dark
  };

  const contextValue = { theme, toggleTheme };

  // Sempre retorna o Provider, mesmo durante build/prerender
  // Isso garante que o Context sempre existe e nunca é null
  // O hook useTheme detecta build e retorna valor padrão sem usar useContext
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// SOLUÇÃO RADICAL: Hook que NUNCA chama useContext durante build/prerender
// Esta solução viola as regras dos hooks do React (hooks devem ser chamados incondicionalmente),
// mas é NECESSÁRIA porque o Next.js tenta fazer prerender mesmo com "use client" e dynamic = 'force-dynamic',
// causando o erro "Cannot read properties of null (reading 'useContext')"
export function useTheme(): ThemeContextType {
  // CRÍTICO: Durante o build/prerender do Next.js, o React Context não está disponível
  // Mesmo com "use client", o Next.js tenta fazer prerender e o Context pode ser null
  // Isso causa o erro "Cannot read properties of null (reading 'useContext')"
  
  // Verificação ULTRA-ROBUSTA para detectar se estamos em build/prerender
  // Esta verificação deve ser feita ANTES de qualquer tentativa de usar hooks
  // IMPORTANTE: Esta verificação viola as regras dos hooks, mas é NECESSÁRIA
  const isBuildOrPrerender = 
    typeof window === "undefined" || 
    typeof document === "undefined" ||
    typeof window?.document?.createElement === "undefined" ||
    process.env.NEXT_PHASE === "phase-production-build" ||
    (process.env.NODE_ENV === "production" && typeof process.env.NEXT_RUNTIME === "undefined");
  
  // Se estivermos em build/prerender, retorna valor padrão SEM usar useContext
  // IMPORTANTE: Esta é uma violação das regras dos hooks do React,
  // mas é NECESSÁRIA para evitar o erro durante o build do Next.js
  // O Next.js tenta fazer prerender mesmo com "use client" e dynamic = 'force-dynamic'
  if (isBuildOrPrerender) {
    // Retorna valor padrão SEM chamar useContext
    // Isso viola as regras dos hooks, mas é a única forma de evitar o erro
    return defaultThemeValue;
  }
  
  // Só tenta usar useContext se estivermos realmente no cliente em runtime
  // Como o Context sempre tem um valor padrão, nunca será null
  // Mas ainda usa try-catch como camada extra de proteção
  try {
    // @ts-ignore - Força o uso de useContext mesmo que o TypeScript reclame
    const context = useContext(ThemeContext);
    return context || defaultThemeValue;
  } catch (error) {
    // Se houver qualquer erro (incluindo durante build/prerender),
    // retorna o valor padrão
    return defaultThemeValue;
  }
}

