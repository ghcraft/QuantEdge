/**
 * Serviço de Administração
 * Gerencia autenticação e permissões de administrador
 */

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "ceo";
  createdAt: string;
}

class AdminService {
  private storageKey = "quantedge_admin";
  private adminEmail = "admin@quantedge.com"; // Email do CEO/Admin
  private adminPassword = "QuantEdge2024!CEO"; // Senha master - deve ser alterada em produção
  
  // Método público para verificar credenciais (para debug)
  public getCredentials() {
    return {
      email: this.adminEmail,
      password: this.adminPassword,
    };
  }

  /**
   * Verifica se o usuário atual é admin
   */
  isAdmin(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const adminData = localStorage.getItem(this.storageKey);
      if (!adminData) return false;
      
      const admin = JSON.parse(adminData);
      return admin.isAuthenticated === true && admin.role === "ceo";
    } catch {
      return false;
    }
  }

  /**
   * Autentica como admin
   */
  login(email: string, password: string): { success: boolean; message: string } {
    // Validação de entrada
    if (!email || !password) {
      return { success: false, message: "Email e senha são obrigatórios" };
    }
    
    // Remove espaços e normaliza
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password; // Mantém senha exata (sem trim para preservar espaços intencionais)
    
    const expectedEmail = this.adminEmail.toLowerCase();
    const expectedPassword = this.adminPassword;
    
    // Comparação direta
    const emailMatch = cleanEmail === expectedEmail;
    const passwordMatch = cleanPassword === expectedPassword;
    
    // Logs de debug removidos por segurança (não expor credenciais)
    // Apenas log em desenvolvimento e sem informações sensíveis
    if (typeof window !== "undefined" && process.env.NODE_ENV === 'development') {
      console.log("Admin login attempt:", { emailMatch, passwordLength: cleanPassword.length });
    }
    
    if (emailMatch && passwordMatch) {
      const adminData = {
        isAuthenticated: true,
        role: "ceo",
        email: this.adminEmail,
        name: "CEO",
        loginTime: new Date().toISOString(),
      };
      
      if (typeof window !== "undefined") {
        localStorage.setItem(this.storageKey, JSON.stringify(adminData));
      }
      return { success: true, message: "Autenticação realizada com sucesso" };
    }
    
    // Mensagem de erro genérica (não revela qual campo está errado por segurança)
    return { 
      success: false, 
      message: "Credenciais inválidas. Verifique seu email e senha." 
    };
  }

  /**
   * Faz logout do admin
   */
  logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Retorna dados do admin atual
   */
  getCurrentAdmin(): AdminUser | null {
    if (typeof window === "undefined") return null;
    try {
      const adminData = localStorage.getItem(this.storageKey);
      if (!adminData) return null;
      
      const admin = JSON.parse(adminData);
      return {
        id: "ceo-001",
        email: admin.email,
        name: admin.name,
        role: admin.role,
        createdAt: admin.loginTime || new Date().toISOString(),
      };
    } catch {
      return null;
    }
  }
}

export const adminService = new AdminService();

