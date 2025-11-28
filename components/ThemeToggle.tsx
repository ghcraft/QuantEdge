"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

/**
 * Componente ThemeToggle
 * Permite alternar entre tema dark e light
 */
export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Evita erro de hidratação e prerender
  // Não chama useTheme() durante SSR/prerender
  if (!mounted) {
    return (
      <div className="w-14 h-7 bg-dark-card/50 light:bg-light-card/50 backdrop-blur-sm border border-dark-border light:border-light-border rounded-full"></div>
    );
  }
  
  // Só chama useTheme() após montagem no cliente
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 bg-dark-card/50 light:bg-light-card/50 backdrop-blur-sm border border-dark-border light:border-light-border rounded-full p-1 transition-all duration-300 hover:border-dark-accent/50 light:hover:border-light-accent/50"
      aria-label="Toggle theme"
    >
      <div
        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-dark-accent light:bg-light-accent rounded-full transition-transform duration-500 shadow-lg ${
          theme === "light" ? "translate-x-7" : "translate-x-0"
        }`}
      />
      <div className="flex items-center justify-between h-full px-1.5">
        <svg
          className={`w-4 h-4 transition-opacity duration-300 ${
            theme === "dark" ? "opacity-100 text-dark-accent" : "opacity-30 text-dark-text-muted light:text-light-text-muted"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
        <svg
          className={`w-4 h-4 transition-opacity duration-300 ${
            theme === "light" ? "opacity-100 text-light-accent" : "opacity-30 text-dark-text-muted light:text-light-text-muted"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </button>
  );
}

