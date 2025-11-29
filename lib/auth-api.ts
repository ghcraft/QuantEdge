/**
 * Sistema de Autenticação com Backend
 * Usa APIs para funcionar entre dispositivos diferentes
 */

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}

/**
 * Serviço de Autenticação com Backend
 * Funciona entre dispositivos diferentes usando APIs
 */
export const AuthServiceAPI = {
  /**
   * Registra um novo usuário via API
   */
  async register(email: string, password: string, name: string): Promise<{ success: boolean; error?: string; user?: User; token?: string }> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Salva token no localStorage e cookies
        this.saveToken(data.token, data.user);
        return { success: true, user: data.user, token: data.token };
      }

      return { success: false, error: data.error || 'Erro ao criar conta' };
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return { success: false, error: 'Erro ao conectar com o servidor' };
    }
  },

  /**
   * Faz login via API
   */
  async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User; token?: string }> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Salva token no localStorage e cookies
        this.saveToken(data.token, data.user);
        return { success: true, user: data.user, token: data.token };
      }

      return { success: false, error: data.error || 'Email ou senha incorretos' };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { success: false, error: 'Erro ao conectar com o servidor' };
    }
  },

  /**
   * Faz logout via API
   */
  async logout(): Promise<void> {
    const token = this.getToken();
    
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      }
    }

    // Remove token localmente
    this.removeToken();
  },

  /**
   * Verifica se usuário está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success && data.user) {
        // Atualiza dados do usuário
        this.saveToken(token, data.user);
        return true;
      }

      // Token inválido ou expirado
      this.removeToken();
      return false;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return false;
    }
  },

  /**
   * Obtém usuário atual
   */
  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success && data.user) {
        // Atualiza dados do usuário
        this.saveToken(token, data.user);
        return data.user;
      }

      return null;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return null;
    }
  },

  /**
   * Salva token e usuário
   */
  saveToken(token: string, user: User): void {
    if (typeof window === "undefined") return;
    
    const session: AuthSession = {
      user,
      token,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 dias
    };

    localStorage.setItem("authSession", JSON.stringify(session));
    this.syncToCookies("authSession", session);
    
    // Dispara evento para outras abas
    window.dispatchEvent(new CustomEvent("authChange"));
  },

  /**
   * Obtém token do localStorage
   */
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("authSession");
    if (!stored) return null;
    try {
      const session = JSON.parse(stored);
      return session.token || null;
    } catch {
      return null;
    }
  },

  /**
   * Remove token
   */
  removeToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("authSession");
    this.removeCookie("authSession");
    window.dispatchEvent(new CustomEvent("authChange"));
  },

  /**
   * Sincroniza com cookies
   */
  syncToCookies(key: string, data: any): void {
    if (typeof document === "undefined") return;
    try {
      const expires = new Date();
      expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 dias
      document.cookie = `${key}=${encodeURIComponent(JSON.stringify(data))};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    } catch (e) {
      console.error("Erro ao sincronizar com cookies:", e);
    }
  },

  /**
   * Remove cookie
   */
  removeCookie(name: string): void {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  },
};

