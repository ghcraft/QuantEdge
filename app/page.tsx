"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/auth";
import Providers from "./providers";

// Força renderização dinâmica (usa Context e hooks do cliente)
export const dynamic = 'force-dynamic';

/**
 * Página Principal (Home)
 * Redireciona para demo se não autenticado, ou para dashboard se autenticado
 */
export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const checkAuth = async () => {
      if (typeof window === "undefined") return;
      
      try {
        const isAuthenticated = await AuthService.isAuthenticated();
        
        if (isAuthenticated) {
          // Se autenticado, redireciona para dashboard
          router.replace("/dashboard");
        } else {
          // Se não autenticado, redireciona para demo
          router.replace("/demo");
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        // Em caso de erro, redireciona para demo
        router.replace("/demo");
      }
    };

    // Pequeno delay para garantir que está no cliente
    const timer = setTimeout(checkAuth, 150);
    return () => clearTimeout(timer);
  }, [router, isMounted]);

  // Mostra loading durante verificação
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
    <Providers>
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dark-accent/30 border-t-dark-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-text-muted font-light">Redirecionando...</p>
        </div>
      </div>
    </Providers>
  );
}
