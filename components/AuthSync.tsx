"use client";

import { useEffect } from "react";
import { AuthService } from "@/lib/auth";

/**
 * Componente para sincronizar autenticação entre abas/dispositivos
 * Inicializa a sincronização de cookies e localStorage
 */
export default function AuthSync() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Carrega dados de cookies ao iniciar
    AuthService.loadFromCookies();

    // Escuta mudanças em outras abas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authSession" || e.key === "users" || e.key === "credentials") {
        // Recarrega dados quando outra aba faz mudanças
        AuthService.loadFromCookies();
        // Dispara evento customizado para atualizar UI
        window.dispatchEvent(new CustomEvent("authChange"));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Escuta eventos customizados de mudança de auth
    const handleAuthChange = () => {
      // Força recarregamento da página se necessário
      // Ou atualiza estado dos componentes que dependem de auth
    };

    window.addEventListener("authChange", handleAuthChange);

    // Sincroniza periodicamente (a cada 5 segundos)
    const syncInterval = setInterval(() => {
      // Sincroniza sessão atual com cookies
      const session = AuthService.getSession();
      if (session) {
        AuthService.syncToCookies("authSession", session);
      }
    }, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
      clearInterval(syncInterval);
    };
  }, []);

  return null; // Componente invisível
}

