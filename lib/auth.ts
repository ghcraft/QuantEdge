/**
 * Sistema de Autenticação
 * Gerencia login, cadastro e sessão de usuários
 * Usa localStorage para persistência (em produção, usar backend real)
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
   */
  register(email: string, password: string, name: string): { success: boolean; error?: string } {
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

    // Salva credenciais (em produção, NUNCA fazer isso - usar backend)
    const credentials = this.getCredentials();
    credentials.push({
      email: email.toLowerCase().trim(),
      password: this.hashPassword(password), // Hash simples (em produção, usar bcrypt)
    });
    localStorage.setItem("credentials", JSON.stringify(credentials));

    // Auto-login após cadastro
    this.createSession(newUser);

    return { success: true };
  },

  /**
   * Faz login do usuário
   */
  login(email: string, password: string): { success: boolean; error?: string; user?: User } {
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

    // Cria sessão
    this.createSession(user);

    return { success: true, user };
  },

  /**
   * Faz logout
   */
  logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("authSession");
  },

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    const session = this.getSession();
    if (!session) return false;
    
    // Verifica se sessão expirou
    if (Date.now() > session.expiresAt) {
      this.logout();
      return false;
    }

    return true;
  },

  /**
   * Obtém usuário atual
   */
  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    const session = this.getSession();
    if (!session || Date.now() > session.expiresAt) {
      return null;
    }
    return session.user;
  },

  /**
   * Cria sessão de autenticação
   * Sessão persiste por 30 dias (lembrar-me sempre ativo)
   */
  createSession(user: User): void {
    if (typeof window === "undefined") return;
    
    const session: AuthSession = {
      user,
      token: this.generateToken(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 dias (persistente)
    };

    localStorage.setItem("authSession", JSON.stringify(session));
  },

  /**
   * Obtém sessão atual
   */
  getSession(): AuthSession | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("authSession");
    return stored ? JSON.parse(stored) : null;
  },

  /**
   * Obtém todos os usuários (apenas para desenvolvimento)
   */
  getAllUsers(): User[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Obtém credenciais (apenas para desenvolvimento - NUNCA em produção)
   */
  getCredentials(): Array<{ email: string; password: string }> {
    if (typeof window === "undefined") return [];
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

