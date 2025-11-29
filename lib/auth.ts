/**
 * Sistema de Autenticação
 * Gerencia login, cadastro e sessão de usuários
 * Agora usa backend (APIs) para funcionar entre dispositivos
 * Mantém compatibilidade com localStorage para fallback
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
 * Serviço de Autenticação
 */
export const AuthService = {
  /**
   * Registra um novo usuário
   * Tenta usar API primeiro, fallback para localStorage
   */
  async register(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    // Tenta usar API primeiro
    if (typeof window !== "undefined") {
      try {
        const { AuthServiceAPI } = await import("./auth-api");
        const result = await AuthServiceAPI.register(email, password, name);
        if (result.success) {
          return { success: true };
        }
        // Se API falhar, continua com localStorage (fallback)
      } catch (error) {
        console.warn("API de autenticação não disponível, usando localStorage:", error);
      }
    }

    // Fallback para localStorage (compatibilidade)
    if (typeof window === "undefined") {
      return { success: false, error: "Apenas no cliente" };
    }

    // Validações básicas
    if (!email || !password || !name) {
      return { success: false, error: "Preencha todos os campos" };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "Email inválido" };
    }

    if (password.length < 8) {
      return { success: false, error: "Senha deve ter no mínimo 8 caracteres" };
    }

    // Valida força da senha
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return { 
        success: false, 
        error: "Senha deve conter letras maiúsculas, minúsculas e números" 
      };
    }

    if (name.length < 2) {
      return { success: false, error: "Nome deve ter no mínimo 2 caracteres" };
    }

    // Verifica se usuário já existe
    const users = this.getAllUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Email já cadastrado" };
    }

    // Cria novo usuário
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };

    // Salva usuário (em produção, enviar para backend)
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    this.syncToCookies("users", users);

    // Salva credenciais (em produção, NUNCA fazer isso - usar backend)
    const credentials = this.getCredentials();
    credentials.push({
      email: email.toLowerCase().trim(),
      password: this.hashPassword(password), // Hash simples (em produção, usar bcrypt)
    });
    localStorage.setItem("credentials", JSON.stringify(credentials));
    this.syncToCookies("credentials", credentials);

    // Auto-login após cadastro
    this.createSession(newUser);

    return { success: true };
  } as any, // Type assertion para compatibilidade

  /**
   * Faz login do usuário
   * Tenta usar API primeiro, fallback para localStorage
   */
  async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    // Tenta usar API primeiro
    if (typeof window !== "undefined") {
      try {
        const { AuthServiceAPI } = await import("./auth-api");
        const result = await AuthServiceAPI.login(email, password);
        if (result.success) {
          return { success: true, user: result.user };
        }
        // Se API falhar, continua com localStorage (fallback)
      } catch (error) {
        console.warn("API de autenticação não disponível, usando localStorage:", error);
      }
    }

    // Fallback para localStorage (compatibilidade)
    if (typeof window === "undefined") {
      return { success: false, error: "Apenas no cliente" };
    }

    if (!email || !password) {
      return { success: false, error: "Preencha todos os campos" };
    }

    // Busca credenciais
    const credentials = this.getCredentials();
    const credential = credentials.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === this.hashPassword(password)
    );

    if (!credential) {
      return { success: false, error: "Email ou senha incorretos" };
    }

    // Busca usuário
    const users = this.getAllUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, error: "Usuário não encontrado" };
    }

    // Atualiza último login
    user.lastLogin = new Date().toISOString();
    const updatedUsers = users.map((u) => (u.id === user.id ? user : u));
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    this.syncToCookies("users", updatedUsers);

    // Cria sessão
    this.createSession(user);

    return { success: true, user };
  } as any, // Type assertion para compatibilidade

  /**
   * Faz logout
   * Remove de localStorage e cookies
   * Tenta usar API primeiro
   */
  async logout(): Promise<void> {
    // Tenta usar API primeiro
    if (typeof window !== "undefined") {
      try {
        const { AuthServiceAPI } = await import("./auth-api");
        await AuthServiceAPI.logout();
        return;
      } catch (error) {
        console.warn("API de autenticação não disponível, usando localStorage:", error);
      }
    }

    // Fallback para localStorage (compatibilidade)
    if (typeof window === "undefined") return;
    localStorage.removeItem("authSession");
    // Remove cookie também
    if (typeof document !== "undefined") {
      document.cookie = "authSession=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    }
    window.dispatchEvent(new CustomEvent("authChange"));
  },

  /**
   * Verifica se usuário está autenticado
   * Tenta usar API primeiro, fallback para localStorage
   */
  async isAuthenticated(): Promise<boolean> {
    // Tenta usar API primeiro
    if (typeof window !== "undefined") {
      try {
        const { AuthServiceAPI } = await import("./auth-api");
        return await AuthServiceAPI.isAuthenticated();
      } catch (error) {
        console.warn("API de autenticação não disponível, usando localStorage:", error);
      }
    }

    // Fallback para localStorage (compatibilidade)
    if (typeof window === "undefined") return false;
    const session = this.getSession();
    if (!session) return false;
    
    // Verifica se sessão expirou
    if (Date.now() > session.expiresAt) {
      this.logout();
      return false;
    }

    return true;
  } as any, // Type assertion para compatibilidade

  /**
   * Obtém usuário atual
   * Tenta usar API primeiro, fallback para localStorage
   */
  async getCurrentUser(): Promise<User | null> {
    // Tenta usar API primeiro
    if (typeof window !== "undefined") {
      try {
        const { AuthServiceAPI } = await import("./auth-api");
        return await AuthServiceAPI.getCurrentUser();
      } catch (error) {
        console.warn("API de autenticação não disponível, usando localStorage:", error);
      }
    }

    // Fallback para localStorage (compatibilidade)
    if (typeof window === "undefined") return null;
    const session = this.getSession();
    if (!session || Date.now() > session.expiresAt) {
      return null;
    }
    return session.user;
  } as any, // Type assertion para compatibilidade

  /**
   * Cria sessão de autenticação
   * Sessão persiste por 30 dias (lembrar-me sempre ativo)
   * Sincroniza com cookies para funcionar entre dispositivos/abas
   */
  createSession(user: User): void {
    if (typeof window === "undefined") return;
    
    const session: AuthSession = {
      user,
      token: this.generateToken(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 dias (persistente)
    };

    localStorage.setItem("authSession", JSON.stringify(session));
    
    // Sincroniza com cookies
    this.syncToCookies("authSession", session);
    
    // Dispara evento para outras abas
    window.dispatchEvent(new CustomEvent("authChange"));
  },

  /**
   * Sincroniza dados com cookies para funcionar entre dispositivos/abas
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
   * Carrega dados de cookies para localStorage
   */
  loadFromCookies(): void {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    
    // Função auxiliar para ler cookies
    const getCookie = (name: string): string | null => {
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
    };

    // Carrega usuários de cookies se localStorage estiver vazio
    if (!localStorage.getItem("users")) {
      const usersCookie = getCookie("users");
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
      const credentialsCookie = getCookie("credentials");
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
      const sessionCookie = getCookie("authSession");
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
   * Obtém sessão atual
   * Carrega de cookies se localStorage estiver vazio
   */
  getSession(): AuthSession | null {
    if (typeof window === "undefined") return null;
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
   * Obtém todos os usuários (apenas para desenvolvimento)
   * Carrega de cookies se localStorage estiver vazio
   */
  getAllUsers(): User[] {
    if (typeof window === "undefined") return [];
    this.loadFromCookies();
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Obtém credenciais (apenas para desenvolvimento - NUNCA em produção)
   * Carrega de cookies se localStorage estiver vazio
   */
  getCredentials(): Array<{ email: string; password: string }> {
    if (typeof window === "undefined") return [];
    this.loadFromCookies();
    const stored = localStorage.getItem("credentials");
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Hash simples de senha (em produção, usar bcrypt)
   */
  hashPassword(password: string): string {
    // Hash simples - em produção, usar bcrypt ou similar
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  },

  /**
   * Gera token de autenticação
   */
  generateToken(): string {
    const array = new Uint8Array(32);
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  },
};

