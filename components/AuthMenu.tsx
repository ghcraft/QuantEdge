"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/auth";

/**
 * Componente de Menu de Autenticação
 * Menu dropdown com opções de login/cadastro ou perfil do usuário
 */
export default function AuthMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = AuthService.isAuthenticated();
      
      // Atualiza apenas se o estado realmente mudou
      setIsAuthenticated((prev) => {
        if (prev !== authenticated) {
          return authenticated;
        }
        return prev;
      });
      
      if (authenticated) {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
          const newUser = { name: currentUser.name, email: currentUser.email };
          setUser((prev) => {
            // Atualiza apenas se os dados realmente mudaram
            if (!prev || prev.name !== newUser.name || prev.email !== newUser.email) {
              return newUser;
            }
            return prev;
          });
        }
      } else {
        // Limpa o usuário apenas se estava autenticado antes
        setUser((prev) => {
          if (prev !== null) {
            return null;
          }
          return prev;
        });
      }
    };

    checkAuth();
    // Aumenta o intervalo para 5 segundos para reduzir verificações desnecessárias
    const interval = setInterval(checkAuth, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setIsOpen(false);
    router.push("/demo");
    router.refresh();
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-full border-2 border-dark-border hover:border-dark-accent/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-dark-accent/20"
      >
        {isAuthenticated && user ? (
          <span className="text-sm font-light text-dark-accent">
            {user.name.charAt(0).toUpperCase()}
          </span>
        ) : (
          <svg className="w-5 h-5 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-dark-card border-2 border-dark-border rounded-3xl shadow-2xl z-[90] animate-fade-in overflow-hidden">
          {isAuthenticated ? (
            <>
              {/* User Info */}
              <div className="p-4 border-b border-dark-border bg-gradient-to-r from-dark-accent/10 to-dark-info/10">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-full flex items-center justify-center border-2 border-dark-accent/50">
                    <span className="text-lg font-light text-dark-accent">
                      {user?.name.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-light text-dark-text-primary truncate">
                      {user?.name || "Usuário"}
                    </p>
                    <p className="text-xs text-dark-text-muted truncate">
                      {user?.email || ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <Link
                  href="/portfolio"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2.5 text-sm font-light text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-card-hover rounded-2xl transition-all duration-300"
                >
                  Meu Portfólio
                </Link>
                <Link
                  href="/favoritos"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2.5 text-sm font-light text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-card-hover rounded-2xl transition-all duration-300"
                >
                  Favoritos
                </Link>
                <div className="my-1 border-t border-dark-border"></div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-sm font-light text-dark-danger hover:bg-dark-danger/20 rounded-2xl transition-all duration-300 text-left"
                >
                  Sair
                </button>
              </div>
            </>
          ) : (
            <div className="p-4">
              <p className="text-sm font-light text-dark-text-muted mb-4 text-center">
                Faça login para acessar o site
              </p>
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-2.5 text-sm font-light bg-dark-accent/20 hover:bg-dark-accent/30 text-dark-accent border border-dark-accent/50 rounded-2xl transition-all duration-300 text-center"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-2.5 text-sm font-light text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-card-hover border border-dark-border rounded-2xl transition-all duration-300 text-center"
                >
                  Cadastrar
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

