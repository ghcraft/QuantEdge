"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Sempre usa tema dark
  const theme: Theme = "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    // Função vazia - tema sempre dark
  };

  // Fornece um valor padrão durante SSR/build
  const contextValue = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  // Durante SSR/build, retorna um valor padrão em vez de lançar erro
  if (context === undefined) {
    // Retorna um valor padrão durante SSR/build para evitar erros
    return { theme: "dark" as Theme, toggleTheme: () => {} };
  }
  return context;
}

