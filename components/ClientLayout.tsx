"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import AuthGuard from "./AuthGuard";
import { ThemeProvider } from "@/contexts/ThemeContext";

/**
 * Client Layout Wrapper
 * Necessário para usar componentes client-side no layout
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Garante que está no cliente
    if (typeof window !== "undefined") {
      // Pequeno delay para garantir que tudo está pronto
      const timer = setTimeout(() => {
        setIsMounted(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  // Previne scroll automático apenas se necessário
  useEffect(() => {
    if (typeof window !== "undefined" && isMounted) {
      // Não faz scroll automático, deixa o comportamento padrão do Next.js
      // Mas garante que a navegação fique visível
    }
  }, [pathname, isMounted]);

  // Não renderiza nada até estar montado no cliente
  if (typeof window === "undefined" || !isMounted) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dark-accent/30 border-t-dark-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-text-muted font-light">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthGuard>
        <div className="relative" style={{ position: 'relative', zIndex: 0 }}>
          <div className="relative" style={{ position: 'relative', zIndex: 100, pointerEvents: 'auto' }}>
            <Navigation />
          </div>
          <div className="relative" style={{ position: 'relative', zIndex: 1 }}>
            {children}
          </div>
        </div>
      </AuthGuard>
    </ThemeProvider>
  );
}

