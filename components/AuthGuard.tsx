"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthService } from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Componente de Proteção de Rotas
 * Redireciona para login se usuário não estiver autenticado
 * Evita problemas de hidratação renderizando conteúdo inicialmente
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Rotas públicas (não requerem autenticação)
  const publicRoutes = useMemo(() => ["/login", "/cadastro", "/demo", "/"], []);

  // Garante que só executa no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Só executa após montagem no cliente
    if (!isMounted) return;

    // Pequeno delay para garantir que está no cliente
    const timer = setTimeout(async () => {
      try {
        // Verifica se está no cliente
        if (typeof window === "undefined") return;

        const isAuthenticated = await AuthService.isAuthenticated();
        const isPublicRoute = publicRoutes.includes(pathname);

        if (!isAuthenticated && !isPublicRoute) {
          // Redireciona para demo se não estiver autenticado e não for rota pública
          // Usa push para manter histórico do navegador
          router.push("/demo");
          return;
        }

        if (isAuthenticated && isPublicRoute && (pathname === "/login" || pathname === "/cadastro")) {
          // Se já estiver autenticado e tentar acessar login/cadastro, redireciona para dashboard
          // Usa push para manter histórico do navegador
          router.push("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        // Em caso de erro, não faz nada (fallback)
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [pathname, router, isMounted, publicRoutes]);

  // Renderiza conteúdo imediatamente para evitar problemas de hidratação
  // A verificação de autenticação acontece em background
  return <>{children}</>;
}

