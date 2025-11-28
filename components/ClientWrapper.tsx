"use client";

import { Suspense, useEffect, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";
import ClientLayout from "./ClientLayout";

/**
 * Wrapper que carrega todos os componentes client-side
 * Isso evita problemas de hidratação e webpack
 */
export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Garante que está no cliente
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  // Não renderiza nada até estar montado no cliente
  if (!isMounted) {
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
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="min-h-screen bg-dark-bg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-dark-accent/30 border-t-dark-accent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-dark-text-muted font-light">Carregando...</p>
            </div>
          </div>
        }
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </Suspense>
    </ErrorBoundary>
  );
}

