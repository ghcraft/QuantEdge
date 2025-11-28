"use client";

import { Suspense, useEffect, useState } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import ClientLayout from "@/components/ClientLayout";

/**
 * Providers que envolvem toda a aplicação
 * Renderiza apenas no cliente para evitar problemas de hidratação
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

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

