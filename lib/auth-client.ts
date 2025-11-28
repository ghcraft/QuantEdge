/**
 * Cliente de Autenticação para uso no frontend
 * Faz requisições para as APIs de autenticação
 */

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
  token?: string;
}

/**
 * Serviço de Autenticação Client-Side
 * Usa APIs server-side para autenticação
 */
export const AuthServiceClient = {
  /**
   * Registra um novo usuário
   */
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthResult> {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || "Erro ao criar conta" };
      }

      // Salva token no localStorage para compatibilidade
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }

      return {
        success: true,
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro de conexão. Verifique sua internet.",
      };
    }
  },

  /**
   * Faz login do usuário
   */
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || "Erro ao fazer login" };
      }

      // Salva token no localStorage para compatibilidade
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }

      return {
        success: true,
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro de conexão. Verifique sua internet.",
      };
    }
  },

  /**
   * Faz logout
   */
  async logout(): Promise<void> {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      localStorage.removeItem("auth_token");
    }
  },

  /**
   * Obtém usuário atual
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user || null;
    } catch (error) {
      return null;
    }
  },

  /**
   * Verifica se está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  },
};

