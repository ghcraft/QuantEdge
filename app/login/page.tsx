"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthService } from "@/lib/auth";
import { adminService } from "@/lib/admin";
import Logo from "@/components/Logo";

// Força renderização dinâmica (usa Context e hooks do cliente)
export const dynamic = 'force-dynamic';

/**
 * Página de Login
 * Design elegante e profissional alinhado ao tema do site
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Se já estiver autenticado, redireciona para home
    const checkAuth = () => {
      if (AuthService.isAuthenticated()) {
        router.push("/");
      }
    };
    
    // Pequeno delay para evitar flash
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Verifica primeiro se são credenciais de admin (invisível para outros usuários)
      const normalizedEmail = email.trim().toLowerCase();
      const adminResult = adminService.login(normalizedEmail, password);
      
      if (adminResult.success) {
        // Login admin bem-sucedido - redireciona silenciosamente para admin
        router.push("/admin");
        return;
      }

      // Se não for admin, tenta login normal
      const result = AuthService.login(email, password);

      if (result.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.error || "Email ou senha incorretos");
      }
    } catch (error) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-dark-bg flex items-center justify-center relative overflow-hidden">
      {/* Background decorativo profissional */}
      <div className="absolute inset-0 bg-dark-bg">
        {/* Grid financeiro sutil */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
        
        {/* Linhas de tendência abstratas */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="loginGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,255,136,0.1)" stopOpacity="0"/>
              <stop offset="50%" stopColor="rgba(0,255,136,0.2)" stopOpacity="1"/>
              <stop offset="100%" stopColor="rgba(0,255,136,0.1)" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M 0,400 Q 300,300 600,400 T 1200,400" fill="none" stroke="url(#loginGradient)" strokeWidth="2" strokeDasharray="10,20"/>
          <path d="M 0,600 Q 300,500 600,600 T 1200,600" fill="none" stroke="url(#loginGradient)" strokeWidth="2" strokeDasharray="10,20"/>
        </svg>
        
        {/* Overlay radial */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Card de Login Premium */}
        <div className="bg-dark-card/95 backdrop-blur-2xl border-2 border-dark-border rounded-3xl p-10 shadow-2xl animate-fade-in">
          {/* Header Premium */}
          <div className="text-center mb-10">
            {/* Logo/Brand */}
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <Logo size="lg" showText={true} />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-extralight text-dark-text-primary">
                <span className="bg-gradient-to-r from-dark-text-primary via-dark-accent to-dark-text-primary bg-clip-text text-transparent">
                  Bem-vindo de volta
                </span>
              </h1>
              <p className="text-dark-text-muted font-light text-sm">
                Acesse sua conta para continuar
              </p>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-light text-dark-text-muted mb-2 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-dark-bg-secondary border border-dark-border rounded-2xl text-dark-text-primary font-light focus:border-dark-accent focus:outline-none focus:ring-2 focus:ring-dark-accent/20 transition-all duration-300 placeholder:text-dark-text-secondary"
                  placeholder="seu@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-xs font-light text-dark-text-muted mb-2 uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-dark-bg-secondary border border-dark-border rounded-2xl text-dark-text-primary font-light focus:border-dark-accent focus:outline-none focus:ring-2 focus:ring-dark-accent/20 transition-all duration-300 placeholder:text-dark-text-secondary"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-dark-text-muted hover:text-dark-text-primary transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="p-4 bg-dark-danger/20 border border-dark-danger/50 rounded-2xl text-dark-danger text-sm font-light animate-fade-in">
                {error}
              </div>
            )}

            {/* Botão Submit Premium */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-dark-accent/20 via-dark-info/20 to-dark-accent/20 hover:from-dark-accent/30 hover:via-dark-info/30 hover:to-dark-accent/30 text-dark-accent border-2 border-dark-accent/50 rounded-2xl font-light transition-all duration-300 hover:border-dark-accent hover:shadow-lg hover:shadow-dark-accent/20 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10">{loading ? "Entrando..." : "Entrar"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-dark-accent/0 via-dark-accent/10 to-dark-accent/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 pt-6 border-t border-dark-border space-y-3">
            <p className="text-center text-sm text-dark-text-muted font-light">
              Não tem uma conta?{" "}
              <Link href="/cadastro" className="text-dark-accent hover:text-dark-info transition-colors font-semibold underline">
                Fazer cadastro
              </Link>
            </p>
            <div className="p-3 bg-dark-info/10 border border-dark-info/30 rounded-xl">
              <p className="text-xs text-dark-text-muted font-light text-center">
                💡 <strong>Nota:</strong> As credenciais são armazenadas localmente no navegador. Para acessar em outro dispositivo, você precisará fazer login novamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

