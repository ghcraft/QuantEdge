/**
 * Sistema de Autenticação com Cookies
 * Permite sincronização entre abas e dispositivos (mesmo domínio)
 * Usa cookies para persistência entre dispositivos no mesmo domínio
 */

import { User, AuthSession } from "./auth";

/**
 * Utilitários para gerenciar cookies
 */
const cookieUtils = {
  set(name: string, value: string, days: number = 30): void {
    if (typeof document === "undefined") return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  },

  get(name: string): string | null {
    if (typeof document === "undefined") return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  },

  remove(name: string): void {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  },
};

/**
 * Serviço de Autenticação com Cookies
 * Sincroniza com localStorage e usa cookies para persistência
 */
export const AuthServiceCookies = {
  /**
   * Sincroniza dados entre localStorage e cookies
   */
  syncStorage(): void {
    if (typeof window === "undefined") return;

    // Sincroniza usuários
    const users = this.getAllUsers();
    if (users.length > 0) {
      cookieUtils.set("users", JSON.stringify(users), 365);
    }

    // Sincroniza credenciais (apenas para desenvolvimento)
    const credentials = this.getCredentials();
    if (credentials.length > 0) {
      cookieUtils.set("credentials", JSON.stringify(credentials), 365);
    }

    // Sincroniza sessão
    const session = this.getSession();
    if (session) {
      cookieUtils.set("authSession", JSON.stringify(session), 30);
    }
  },

  /**
   * Carrega dados de cookies para localStorage (se localStorage estiver vazio)
   */
  loadFromCookies(): void {
    if (typeof window === "undefined") return;

    // Carrega usuários de cookies se localStorage estiver vazio
    if (!localStorage.getItem("users")) {
      const usersCookie = cookieUtils.get("users");
      if (usersCookie) {
        try {
          localStorage.setItem("users", usersCookie);
        } catch (e) {
          console.error("Erro ao carregar usuários de cookies:", e);
        }
      }
    }

    // Carrega credenciais de cookies se localStorage estiver vazio
    if (!localStorage.getItem("credentials")) {
      const credentialsCookie = cookieUtils.get("credentials");
      if (credentialsCookie) {
        try {
          localStorage.setItem("credentials", credentialsCookie);
        } catch (e) {
          console.error("Erro ao carregar credenciais de cookies:", e);
        }
      }
    }

    // Carrega sessão de cookies se localStorage estiver vazio
    if (!localStorage.getItem("authSession")) {
      const sessionCookie = cookieUtils.get("authSession");
      if (sessionCookie) {
        try {
          const session = JSON.parse(sessionCookie);
          // Verifica se sessão não expirou
          if (session.expiresAt && Date.now() < session.expiresAt) {
            localStorage.setItem("authSession", sessionCookie);
          }
        } catch (e) {
          console.error("Erro ao carregar sessão de cookies:", e);
        }
      }
    }
  },

  /**
   * Escuta mudanças em outras abas
   */
  setupStorageSync(): void {
    if (typeof window === "undefined") return;

    // Escuta mudanças no localStorage de outras abas
    window.addEventListener("storage", (e) => {
      if (e.key === "authSession" || e.key === "users" || e.key === "credentials") {
        // Recarrega dados quando outra aba faz mudanças
        this.loadFromCookies();
        // Dispara evento customizado para atualizar UI
        window.dispatchEvent(new CustomEvent("authChange"));
      }
    });

    // Sincroniza ao carregar
    this.loadFromCookies();
    this.syncStorage();

    // Sincroniza periodicamente (a cada 5 segundos)
    setInterval(() => {
      this.syncStorage();
    }, 5000);
  },

  /**
   * Obtém todos os usuários (com sincronização)
   */
  getAllUsers(): User[] {
    if (typeof window === "undefined") return [];
    
    // Tenta carregar de cookies primeiro
    this.loadFromCookies();
    
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Obtém credenciais (com sincronização)
   */
  getCredentials(): Array<{ email: string; password: string }> {
    if (typeof window === "undefined") return [];
    
    // Tenta carregar de cookies primeiro
    this.loadFromCookies();
    
    const stored = localStorage.getItem("credentials");
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Obtém sessão atual (com sincronização)
   */
  getSession(): AuthSession | null {
    if (typeof window === "undefined") return null;
    
    // Tenta carregar de cookies primeiro
    this.loadFromCookies();
    
    const stored = localStorage.getItem("authSession");
    if (!stored) return null;
    
    try {
      const session = JSON.parse(stored);
      // Verifica se sessão não expirou
      if (session.expiresAt && Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  /**
   * Faz logout (limpa localStorage e cookies)
   */
  logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("authSession");
    cookieUtils.remove("authSession");
    window.dispatchEvent(new CustomEvent("authChange"));
  },
};

