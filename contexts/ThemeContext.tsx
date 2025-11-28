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

const ThemeContext = createContext<ThemeContextType>(defaultThemeValue);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Durante SSR/build, retorna apenas children sem usar hooks
  const [mounted, setMounted] = useState(false);
  const theme: Theme = "dark";

  useEffect(() => {
    // Só executa no cliente
    if (typeof window === "undefined") return;
    
    setMounted(true);
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    // Função vazia - tema sempre dark
  };

  // Durante SSR/build, retorna children diretamente sem Provider
  // Isso evita o erro de useContext durante prerender
  if (typeof window === "undefined" || !mounted) {
    return <>{children}</>;
  }

  // No cliente, usa o Provider normalmente
  const contextValue = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook seguro que nunca usa useContext durante SSR/prerender
// IMPORTANTE: Este hook NUNCA deve usar useContext durante SSR/prerender
// O Next.js tenta fazer prerender mesmo com "use client" e dynamic = 'force-dynamic'
// Por isso, sempre retornamos o valor padrão durante SSR/prerender
export function useTheme(): ThemeContextType {
  // CRÍTICO: Durante SSR/build/prerender, NUNCA use useContext
  // O erro "Cannot read properties of null (reading 'useContext')" acontece
  // quando o React Context não está disponível durante o prerender
  
  // Verifica se está no cliente (window e document estão disponíveis)
  // Se não estiver, retorna valor padrão SEM usar useContext
  // Isso evita o erro durante o prerender
  // IMPORTANTE: Esta verificação deve ser feita ANTES de qualquer chamada a useContext
  if (typeof window === "undefined" || typeof document === "undefined") {
    return defaultThemeValue;
  }
  
  // Verifica se estamos em um ambiente de build/prerender
  // Durante o build, mesmo com window disponível, o Context pode não estar
  // Usa uma verificação adicional para garantir que estamos no cliente real
  // Em produção durante o build, tenta usar useContext com try-catch
  try {
    // Tenta usar useContext, mas pode falhar durante build/prerender
    const context = useContext(ThemeContext);
    
    // Se o context for undefined ou null, retorna o valor padrão
    if (!context) {
      return defaultThemeValue;
    }
    
    return context;
  } catch (error) {
    // Se houver erro ao usar useContext (por exemplo, durante build/prerender),
    // retorna o valor padrão
    // Isso captura o erro "Cannot read properties of null (reading 'useContext')"
    return defaultThemeValue;
  }
}

