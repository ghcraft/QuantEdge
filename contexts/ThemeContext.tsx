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
  // Sempre retorna um valor válido, mesmo durante SSR/build
  // O Context sempre terá um valor padrão, então nunca será undefined
  const context = useContext(ThemeContext);
  return context;
}

