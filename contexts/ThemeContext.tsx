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

export function useTheme() {
  // Durante SSR/build, retorna valor padrão
  if (typeof window === "undefined") {
    return defaultThemeValue;
  }
  
  // No cliente, usa o Context normalmente
  const context = useContext(ThemeContext);
  return context;
}

