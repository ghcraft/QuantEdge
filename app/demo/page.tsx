"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamicImport from "next/dynamic";
import { AuthService } from "@/lib/auth";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import Logo from "@/components/Logo";
import { feedbackService } from "@/lib/feedback";

// Força renderização dinâmica (usa hooks do cliente)
export const dynamic = 'force-dynamic';

// Carrega FinancialChart apenas no cliente para evitar problemas de hidratação
const FinancialChart = dynamicImport(() => import("@/components/FinancialChart"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] bg-dark-card/50 rounded-lg flex items-center justify-center">
      <div className="text-dark-text-muted text-sm">Carregando gráfico...</div>
    </div>
  ),
});

/**
 * Página de Demonstração (Landing Page)
 * Página independente que apresenta o conceito do site
 * Sem vínculos com a página principal
 */
export default function DemoPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    // Verifica se já está autenticado
    const checkAuth = async () => {
      const isAuthenticated = await AuthService.isAuthenticated();
      if (isAuthenticated) {
        setIsAuthenticated(true);
        // Redireciona para dashboard após 1 segundo
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, [router]);

  // Carrega feedbacks públicos
  useEffect(() => {
    const loadFeedbacks = () => {
      const publicFeedbacks = feedbackService.getPublic();
      // Limita a 3 feedbacks mais recentes
      setFeedbacks(publicFeedbacks.slice(0, 3));
    };
    loadFeedbacks();
    const interval = setInterval(loadFeedbacks, 5000);
    return () => clearInterval(interval);
  }, []);

  // Se autenticado, mostra mensagem de redirecionamento
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dark-accent/30 border-t-dark-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-text-muted font-light">Redirecionando para o dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-dark-bg relative overflow-x-hidden">
      {/* Background Financeiro Global com Mais Efeitos */}
      <div className="fixed inset-0 bg-dark-bg pointer-events-none z-0">
        {/* Grid Financeiro Mais Visível */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:80px_80px] animate-pulse"></div>
        
        {/* Linhas de Tendência Abstratas - Mais Dinâmicas */}
        <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 2000 1200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="demoLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,255,136,0.15)" stopOpacity="0"/>
              <stop offset="50%" stopColor="rgba(0,255,136,0.25)" stopOpacity="1"/>
              <stop offset="100%" stopColor="rgba(0,255,136,0.15)" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="demoLineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,170,255,0.12)" stopOpacity="0"/>
              <stop offset="50%" stopColor="rgba(0,170,255,0.2)" stopOpacity="1"/>
              <stop offset="100%" stopColor="rgba(0,170,255,0.12)" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M 0,800 Q 500,600 1000,500 T 2000,300" fill="none" stroke="url(#demoLineGradient)" strokeWidth="2.5" strokeDasharray="10,20" className="animate-pulse"/>
          <path d="M 0,400 Q 500,500 1000,600 T 2000,800" fill="none" stroke="url(#demoLineGradient)" strokeWidth="2.5" strokeDasharray="10,20" className="animate-pulse" style={{ animationDelay: '1s' }}/>
          <path d="M 0,600 Q 300,400 600,500 T 2000,450" fill="none" stroke="url(#demoLineGradient2)" strokeWidth="2" strokeDasharray="8,15" className="animate-pulse" style={{ animationDelay: '0.5s' }}/>
        </svg>
        
        {/* Partículas Flutuantes Animadas */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-dark-accent/40 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-dark-info/40 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-dark-accent/30 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-dark-info/35 rounded-full animate-ping" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}></div>
        
        {/* Overlay com Gradiente Mais Pronunciado */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_100%_at_50%_0%,rgba(0,212,255,0.12),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_100%,rgba(0,255,136,0.08),transparent_70%)]"></div>
      </div>

      {/* Navegação Simplificada */}
      <nav className="relative z-50 border-b border-dark-border bg-dark-bg-secondary/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Sem link */}
            <Logo size="md" showText={true} />

            {/* Botões de Login/Cadastro com Badge de Confiança */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-dark-card/30 border border-dark-border/30 rounded-lg">
                <svg className="w-3.5 h-3.5 text-dark-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-light text-dark-text-muted">Plataforma Segura</span>
              </div>
              <Link
                href="/login"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-light text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-card rounded-lg transition-all duration-300 whitespace-nowrap"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-light bg-dark-accent/20 hover:bg-dark-accent/30 text-dark-accent border border-dark-accent/50 rounded-lg transition-all duration-300 whitespace-nowrap"
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        {/* Hero Section - Landing Page Profissional */}
        <section className="relative overflow-hidden border-b border-dark-border/20 bg-dark-bg min-h-screen flex items-center">
          {/* Background com Efeitos do Site */}
          <div className="absolute inset-0 bg-dark-bg"></div>
          
          {/* Grid Pattern Sutil */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
          
          {/* Gradientes Minimalistas */}
          <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-bg-secondary/50 to-dark-bg"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_100%_at_50%_0%,rgba(0,212,255,0.08),transparent_70%)]"></div>
          
          {/* Partículas Animadas / Glow Minimalista */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-dark-accent/8 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-dark-info/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-dark-accent/5 via-dark-info/5 to-dark-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          {/* Linhas de Dados Abstratas */}
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 2000 1200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="heroGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,255,136,0.3)" stopOpacity="0"/>
                <stop offset="50%" stopColor="rgba(0,255,136,0.5)" stopOpacity="1"/>
                <stop offset="100%" stopColor="rgba(0,255,136,0.3)" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="heroGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,170,255,0.3)" stopOpacity="0"/>
                <stop offset="50%" stopColor="rgba(0,170,255,0.5)" stopOpacity="1"/>
                <stop offset="100%" stopColor="rgba(0,170,255,0.3)" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M 0,400 Q 500,200 1000,300 T 2000,250" fill="none" stroke="url(#heroGradient1)" strokeWidth="2" strokeDasharray="20,30" className="animate-pulse"/>
            <path d="M 0,800 Q 600,600 1200,700 T 2000,650" fill="none" stroke="url(#heroGradient2)" strokeWidth="2" strokeDasharray="15,25" className="animate-pulse" style={{ animationDelay: '1s' }}/>
          </svg>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 lg:py-40 w-full">
            <div className="text-center max-w-6xl mx-auto">
              {/* Título Principal */}
              <h1 
                className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 tracking-tight leading-tight animate-fade-in"
                style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}
              >
                <span className="bg-gradient-to-r from-dark-text-primary via-dark-accent to-dark-info bg-clip-text text-transparent">
                  A Plataforma Definitiva
                </span>
                <br />
                <span className="bg-gradient-to-r from-dark-info via-dark-accent to-dark-text-primary bg-clip-text text-transparent">
                  para Inteligência de Mercado
                </span>
              </h1>
              
              {/* Subtítulo */}
              <p 
                className="text-2xl md:text-3xl lg:text-4xl font-light text-dark-text-primary mb-8 animate-fade-in"
                style={{ animationDelay: '0.1s', fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
              >
                Transforme Dados em Decisões Imediatas
              </p>
              
              {/* Texto Descritivo Premium */}
              <p 
                className="text-lg md:text-xl text-dark-text-muted font-light leading-relaxed max-w-3xl mx-auto mb-12 animate-fade-in"
                style={{ animationDelay: '0.2s', fontFamily: "'Inter', sans-serif" }}
              >
                Acesso a dados financeiros em tempo real, análises técnicas avançadas, gráficos profissionais e inteligência de mercado consolidada. Tudo que você precisa para tomar decisões informadas e estratégicas no mercado financeiro global.
              </p>
              
              {/* Botões CTA */}
              <div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in"
                style={{ animationDelay: '0.3s' }}
              >
                <Link
                  href="/cadastro"
                  className="group relative px-8 py-4 bg-dark-accent/10 hover:bg-dark-accent/15 text-dark-accent border border-dark-accent/40 hover:border-dark-accent/60 rounded-lg font-light transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10">Criar Conta</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-dark-accent/0 via-dark-accent/5 to-dark-accent/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </Link>
                
                <Link
                  href="/login"
                  className="px-8 py-4 bg-dark-card/30 hover:bg-dark-card/50 backdrop-blur-sm border border-dark-border/40 hover:border-dark-border/60 text-dark-text-muted hover:text-dark-text-primary font-light rounded-lg transition-all duration-300"
                >
                  Já tenho uma conta
                </Link>
              </div>
              
              {/* Seção de Métricas */}
              <div 
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20 animate-slide-up"
                style={{ animationDelay: '0.4s' }}
              >
                <div className="group bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-2xl p-6 hover:border-dark-accent/50 transition-all duration-300 hover:scale-105">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-dark-accent to-dark-info bg-clip-text text-transparent mb-2">+850</div>
                  <div className="text-sm text-dark-text-muted font-light">usuários ativos</div>
                </div>
                <div className="group bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-2xl p-6 hover:border-dark-accent/50 transition-all duration-300 hover:scale-105">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-dark-info to-dark-accent bg-clip-text text-transparent mb-2">+12.500</div>
                  <div className="text-sm text-dark-text-muted font-light">análises realizadas</div>
                </div>
                <div className="group bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-2xl p-6 hover:border-dark-accent/50 transition-all duration-300 hover:scale-105">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-dark-success to-dark-info bg-clip-text text-transparent mb-2">99.8%</div>
                  <div className="text-sm text-dark-text-muted font-light">de uptime</div>
                </div>
                <div className="group bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-2xl p-6 hover:border-dark-accent/50 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-3 h-3 bg-dark-success rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-sm text-dark-text-muted font-light">Dados atualizados em tempo real</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Conceito - Melhor Enquadrado */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          {/* O que oferecemos */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extralight text-dark-text-primary mb-4 tracking-tight">
                O que você vai encontrar
              </h2>
              <p className="text-lg text-dark-text-muted font-light">
                Uma plataforma completa para análise de mercado e investimentos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Gráficos Profissionais */}
              <div className="group bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8 text-center hover:border-dark-accent/50 hover:shadow-2xl hover:shadow-dark-accent/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-dark-accent/0 via-dark-accent/5 to-dark-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-dark-border/50 group-hover:border-dark-accent/50 group-hover:scale-110 transition-all duration-500">
                    <svg className="w-8 h-8 text-dark-accent group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-extralight text-dark-text-primary mb-4 group-hover:text-dark-accent transition-colors duration-300">Gráficos Profissionais</h3>
                  <p className="text-dark-text-muted font-light group-hover:text-dark-text-secondary transition-colors duration-300 mb-4">
                    Análise técnica completa com gráficos interativos estilo TradingView para ações, índices e criptomoedas
                  </p>
                  <div className="text-xs text-dark-text-muted/70 font-light space-y-1">
                    <p>• Múltiplos intervalos de tempo</p>
                    <p>• Indicadores técnicos avançados</p>
                    <p>• Visualização em tempo real</p>
                  </div>
                </div>
              </div>

              {/* Notícias em Tempo Real */}
              <div className="group bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8 text-center hover:border-dark-info/50 hover:shadow-2xl hover:shadow-dark-info/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-dark-info/0 via-dark-info/5 to-dark-info/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-dark-border/50 group-hover:border-dark-info/50 group-hover:scale-110 transition-all duration-500">
                    <svg className="w-8 h-8 text-dark-info group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-extralight text-dark-text-primary mb-4 group-hover:text-dark-info transition-colors duration-300">Notícias em Tempo Real</h3>
                  <p className="text-dark-text-muted font-light group-hover:text-dark-text-secondary transition-colors duration-300 mb-4">
                    Feed de notícias financeiras atualizado automaticamente das principais fontes do mercado
                  </p>
                  <div className="text-xs text-dark-text-muted/70 font-light space-y-1">
                    <p>• Fontes confiáveis e verificadas</p>
                    <p>• Atualização automática contínua</p>
                    <p>• Filtros personalizáveis</p>
                  </div>
                </div>
              </div>

              {/* Portfolio Management */}
              <div className="group bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8 text-center hover:border-dark-purple/50 hover:shadow-2xl hover:shadow-dark-purple/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-dark-purple/0 via-dark-purple/5 to-dark-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-dark-border/50 group-hover:border-dark-purple/50 group-hover:scale-110 transition-all duration-500">
                    <svg className="w-8 h-8 text-dark-purple group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-extralight text-dark-text-primary mb-4 group-hover:text-dark-purple transition-colors duration-300">Gestão de Portfolio</h3>
                  <p className="text-dark-text-muted font-light group-hover:text-dark-text-secondary transition-colors duration-300 mb-4">
                    Acompanhe seus investimentos, visualize ganhos e perdas, e monitore performance em tempo real
                  </p>
                  <div className="text-xs text-dark-text-muted/70 font-light space-y-1">
                    <p>• Análise de performance detalhada</p>
                    <p>• Histórico completo de transações</p>
                    <p>• Alertas e notificações inteligentes</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção Didática - Como Funciona */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-dark-card/40 to-dark-card-hover/20 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8 md:p-12 mb-16">
              <div className="text-center mb-10">
                <div className="inline-flex items-center space-x-2 mb-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-dark-info to-transparent"></div>
                  <h2 className="text-3xl font-extralight text-dark-text-primary tracking-tight">
                    Como Funciona
                  </h2>
                </div>
                <p className="text-lg text-dark-text-muted font-light max-w-2xl mx-auto">
                  Uma plataforma intuitiva que combina análise de mercado com gestão financeira completa
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-dark-border/30">
                    <span className="text-2xl font-extralight text-dark-accent">1</span>
                  </div>
                  <h3 className="text-xl font-light text-dark-text-primary mb-3">Cadastre-se Gratuitamente</h3>
                  <p className="text-sm text-dark-text-muted font-light">
                    Crie sua conta em segundos e tenha acesso imediato à plataforma. Sem necessidade de cartão de crédito para começar.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-dark-info/20 to-dark-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-dark-border/30">
                    <span className="text-2xl font-extralight text-dark-info">2</span>
                  </div>
                  <h3 className="text-xl font-light text-dark-text-primary mb-3">Explore o Mercado</h3>
                  <p className="text-sm text-dark-text-muted font-light">
                    Acompanhe cotações em tempo real, analise gráficos profissionais e receba notícias relevantes do mercado financeiro.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-dark-success/20 to-dark-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-dark-border/30">
                    <span className="text-2xl font-extralight text-dark-success">3</span>
                  </div>
                  <h3 className="text-xl font-light text-dark-text-primary mb-3">Gerencie suas Finanças</h3>
                  <p className="text-sm text-dark-text-muted font-light">
                    Utilize ferramentas avançadas de gestão financeira, planejamento orçamentário e acompanhamento de investimentos.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Demonstração de Gráficos Simples */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extralight text-dark-text-primary mb-4 tracking-tight">
                Visualize o Mercado
              </h2>
              <p className="text-lg text-dark-text-muted font-light">
                Gráficos interativos para análise técnica profissional
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Gráfico Bitcoin - Demonstração */}
              <div className="group bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 animate-fade-in hover:border-dark-accent/50 hover:shadow-2xl hover:shadow-dark-accent/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-dark-accent/0 via-dark-accent/3 to-dark-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 mb-6 pb-6 border-b border-dark-border/30">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-dark-card/60 backdrop-blur-sm border border-dark-border/30 flex items-center justify-center rounded-xl group-hover:border-dark-accent/50 group-hover:scale-110 transition-all duration-300">
                      <span className="text-sm font-extralight text-dark-accent tracking-tight">BTC</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-extralight text-dark-text-primary mb-1 tracking-tight group-hover:text-dark-accent transition-colors duration-300">
                        Bitcoin
                      </h3>
                      <p className="text-xs text-dark-text-muted font-light uppercase tracking-wider">BTC/USD</p>
                    </div>
                  </div>
                </div>
                <div className="relative z-10">
                  <FinancialChart
                  symbol="BINANCE:BTCUSDT"
                  height={350}
                  interval="15"
                  hideTopToolbar={true}
                  hideSideToolbar={true}
                />
                </div>
              </div>

              {/* Gráfico Apple - Demonstração */}
              <div className="group bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 animate-fade-in hover:border-dark-info/50 hover:shadow-2xl hover:shadow-dark-info/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-dark-info/0 via-dark-info/3 to-dark-info/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 mb-6 pb-6 border-b border-dark-border/30">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-dark-card/60 backdrop-blur-sm border border-dark-border/30 flex items-center justify-center rounded-xl group-hover:border-dark-info/50 group-hover:scale-110 transition-all duration-300">
                      <span className="text-sm font-extralight text-dark-info tracking-tight">AAPL</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-extralight text-dark-text-primary mb-1 tracking-tight group-hover:text-dark-info transition-colors duration-300">
                        Apple Inc.
                      </h3>
                      <p className="text-xs text-dark-text-muted font-light uppercase tracking-wider">AAPL</p>
                    </div>
                  </div>
                </div>
                <div className="relative z-10">
                  <FinancialChart
                    symbol="NASDAQ:AAPL"
                    height={350}
                    interval="15"
                    hideTopToolbar={true}
                    hideSideToolbar={true}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Seção Soluções FinTech - Integrada */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-dark-accent to-transparent"></div>
                <h2 className="text-4xl font-extralight text-dark-text-primary tracking-tight">
                  Soluções FinTech Completas
                </h2>
              </div>
              <p className="text-lg text-dark-text-muted font-light max-w-3xl mx-auto">
                Além de análise de mercado, oferecemos uma plataforma completa de gestão financeira para empresas e indivíduos
              </p>
            </div>

            <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8 md:p-12 mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Análises e Relatórios */}
                <div className="group bg-dark-bg-secondary/30 border border-dark-border/30 rounded-2xl p-6 hover:border-dark-accent/50 hover:bg-dark-card-hover/30 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-xl flex items-center justify-center mb-4 border border-dark-border/30 group-hover:border-dark-accent/50 transition-colors">
                    <svg className="w-6 h-6 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-light text-dark-text-primary mb-2 group-hover:text-dark-accent transition-colors">Análises em Tempo Real</h3>
                  <p className="text-sm text-dark-text-muted font-light">Relatórios automatizados e análises avançadas do seu desempenho financeiro</p>
                </div>

                {/* Múltiplas Moedas */}
                <div className="group bg-dark-bg-secondary/30 border border-dark-border/30 rounded-2xl p-6 hover:border-dark-info/50 hover:bg-dark-card-hover/30 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-dark-info/20 to-dark-accent/20 rounded-xl flex items-center justify-center mb-4 border border-dark-border/30 group-hover:border-dark-info/50 transition-colors">
                    <svg className="w-6 h-6 text-dark-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-light text-dark-text-primary mb-2 group-hover:text-dark-info transition-colors">Múltiplas Moedas</h3>
                  <p className="text-sm text-dark-text-muted font-light">Suporte completo para operações em diferentes moedas e câmbio automático</p>
                </div>

                {/* Planejamento Orçamentário */}
                <div className="group bg-dark-bg-secondary/30 border border-dark-border/30 rounded-2xl p-6 hover:border-dark-success/50 hover:bg-dark-card-hover/30 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-dark-success/20 to-dark-accent/20 rounded-xl flex items-center justify-center mb-4 border border-dark-border/30 group-hover:border-dark-success/50 transition-colors">
                    <svg className="w-6 h-6 text-dark-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-light text-dark-text-primary mb-2 group-hover:text-dark-success transition-colors">Planejamento Automatizado</h3>
                  <p className="text-sm text-dark-text-muted font-light">Ferramentas inteligentes de orçamento e planejamento financeiro personalizado</p>
                </div>

                {/* Gestão Tributária */}
                <div className="group bg-dark-bg-secondary/30 border border-dark-border/30 rounded-2xl p-6 hover:border-dark-warning/50 hover:bg-dark-card-hover/30 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-dark-warning/20 to-dark-accent/20 rounded-xl flex items-center justify-center mb-4 border border-dark-border/30 group-hover:border-dark-warning/50 transition-colors">
                    <svg className="w-6 h-6 text-dark-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-light text-dark-text-primary mb-2 group-hover:text-dark-warning transition-colors">Gestão Tributária</h3>
                  <p className="text-sm text-dark-text-muted font-light">Ferramentas especializadas para gestão e planejamento tributário eficiente</p>
                </div>
              </div>

              {/* Recursos Adicionais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="flex items-start space-x-4 p-4 bg-dark-bg-secondary/20 rounded-2xl border border-dark-border/20">
                  <div className="w-8 h-8 bg-dark-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base font-light text-dark-text-primary mb-1">Acompanhamento de Investimentos</h4>
                    <p className="text-sm text-dark-text-muted font-light">Monitore e analise todos os seus investimentos em um único painel</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-dark-bg-secondary/20 rounded-2xl border border-dark-border/20">
                  <div className="w-8 h-8 bg-dark-info/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-dark-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base font-light text-dark-text-primary mb-1">Integração de Pagamento Segura</h4>
                    <p className="text-sm text-dark-text-muted font-light">Processamento seguro de pagamentos com criptografia de ponta a ponta</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-dark-bg-secondary/20 rounded-2xl border border-dark-border/20">
                  <div className="w-8 h-8 bg-dark-success/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-dark-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base font-light text-dark-text-primary mb-1">Acesso Móvel e Web</h4>
                    <p className="text-sm text-dark-text-muted font-light">Acesse sua plataforma de qualquer dispositivo, a qualquer momento</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-dark-bg-secondary/20 rounded-2xl border border-dark-border/20">
                  <div className="w-8 h-8 bg-dark-purple/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-dark-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base font-light text-dark-text-primary mb-1">Gestão Empresarial e Pessoal</h4>
                    <p className="text-sm text-dark-text-muted font-light">Soluções completas para empresas e gestão financeira pessoal</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Depoimentos e Social Proof - Com Feedbacks Reais */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-dark-card/30 to-dark-card-hover/20 backdrop-blur-xl border border-dark-border/40 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-extralight text-dark-text-primary mb-3">O que nossos usuários dizem</h3>
                <p className="text-sm text-dark-text-muted font-light">Feedback de profissionais que utilizam nossa plataforma</p>
              </div>
              
              {feedbacks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {feedbacks.map((feedback, index) => {
                    const initials = feedback.userName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .substring(0, 2);
                    const colors = [
                      "from-dark-accent/20 to-dark-info/20",
                      "from-dark-info/20 to-dark-accent/20",
                      "from-dark-success/20 to-dark-accent/20",
                    ];
                    const textColors = ["text-dark-accent", "text-dark-info", "text-dark-success"];

                    return (
                      <div key={feedback.id || index} className="bg-dark-bg-secondary/30 border border-dark-border/30 rounded-2xl p-6 animate-fade-in">
                        <div className="flex items-center space-x-1 mb-4">
                          {[...Array(feedback.rating || 5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-dark-warning" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm text-dark-text-muted font-light mb-4 italic">
                          {feedback.comment || "Excelente plataforma para análise de mercado e gestão financeira."}
                        </p>
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 bg-gradient-to-br ${colors[index % colors.length]} rounded-full flex items-center justify-center border border-dark-border/30`}>
                            <span className={`text-xs font-light ${textColors[index % textColors.length]}`}>{initials}</span>
                          </div>
                          <div>
                            <p className="text-xs font-light text-dark-text-primary">{feedback.userName}</p>
                            {feedback.userRole && (
                              <p className="text-xs text-dark-text-muted font-light">{feedback.userRole}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-dark-text-muted font-light mb-4">Ainda não há feedbacks públicos disponíveis.</p>
                  <p className="text-xs text-dark-text-muted/70 font-light">Seja o primeiro a compartilhar sua experiência!</p>
                </div>
              )}
            </div>
          </section>

          {/* Benefícios */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extralight text-dark-text-primary mb-4 tracking-tight">
                Por que escolher o QuantEdge Pro?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-dark-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-light text-dark-text-primary mb-2">Dados em Tempo Real</h4>
                  <p className="text-dark-text-muted font-light text-sm">Informações atualizadas instantaneamente do mercado global</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-dark-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-light text-dark-text-primary mb-2">Interface Profissional</h4>
                  <p className="text-dark-text-muted font-light text-sm">Design elegante e intuitivo para análise eficiente</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-dark-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-light text-dark-text-primary mb-2">Análise Técnica Completa</h4>
                  <p className="text-dark-text-muted font-light text-sm">Ferramentas profissionais para análise de tendências e padrões</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-dark-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-light text-dark-text-primary mb-2">Notícias Relevantes</h4>
                  <p className="text-dark-text-muted font-light text-sm">Feed de notícias das principais fontes financeiras</p>
                </div>
              </div>
            </div>
          </section>

          {/* Seção de Confiança e Credibilidade */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-dark-card/30 to-dark-card-hover/20 backdrop-blur-xl border border-dark-border/40 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-extralight text-dark-text-primary mb-3">Confiança e Transparência</h3>
                <p className="text-sm text-dark-text-muted font-light max-w-2xl mx-auto">
                  Uma plataforma em crescimento, construída com foco em qualidade e confiabilidade
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-extralight text-dark-accent mb-2">850+</div>
                  <p className="text-xs text-dark-text-muted font-light">Usuários Ativos</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extralight text-dark-info mb-2">12.5k+</div>
                  <p className="text-xs text-dark-text-muted font-light">Análises Realizadas</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extralight text-dark-success mb-2">4.8/5</div>
                  <p className="text-xs text-dark-text-muted font-light">Avaliação Média</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extralight text-dark-warning mb-2">24/7</div>
                  <p className="text-xs text-dark-text-muted font-light">Suporte Disponível</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-dark-border/30">
                <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-dark-text-muted/70 font-light">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-dark-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>SSL Certificado</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-dark-info" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Dados Protegidos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-dark-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Conformidade LGPD</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção de Planos - Profissional e Sutil */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-dark-info to-transparent"></div>
                <h2 className="text-4xl font-extralight text-dark-text-primary tracking-tight">
                  Soluções FinTech Complementares
                </h2>
              </div>
              <p className="text-lg text-dark-text-muted font-light max-w-2xl mx-auto mb-4">
                Além da análise de mercado, oferecemos soluções completas de gestão financeira
              </p>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-dark-card/30 border border-dark-border/30 rounded-lg">
                <svg className="w-4 h-4 text-dark-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-light text-dark-text-muted">Serviços oferecidos por nossa empresa parceira de FinTech</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Plano Pessoal */}
              <div className="group bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8 hover:border-dark-accent/50 hover:shadow-2xl hover:shadow-dark-accent/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-dark-accent/0 via-dark-accent/3 to-dark-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-light text-dark-text-primary mb-2">Plano Pessoal</h3>
                      <p className="text-sm text-dark-text-muted font-light">Ideal para gestão financeira individual</p>
                      <p className="text-xs text-dark-text-muted/60 font-light mt-1 italic">Serviço oferecido por empresa parceira</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-2xl flex items-center justify-center border border-dark-border/50">
                      <svg className="w-8 h-8 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="mb-6 pb-6 border-b border-dark-border/30">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-4xl font-extralight text-dark-text-primary">R$</span>
                      <span className="text-5xl font-extralight text-dark-accent">99</span>
                      <span className="text-lg text-dark-text-muted font-light">/mês</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-dark-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-dark-text-muted font-light">Gestão financeira pessoal completa</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-dark-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-dark-text-muted font-light">Análises e relatórios automatizados</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-dark-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-dark-text-muted font-light">Planejamento orçamentário inteligente</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-dark-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-dark-text-muted font-light">Acompanhamento de investimentos</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-dark-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-dark-text-muted font-light">Acesso móvel e web</span>
                    </li>
                  </ul>

                  <Link
                    href="/sobre"
                    className="w-full px-6 py-3 bg-dark-accent/10 hover:bg-dark-accent/20 text-dark-accent border border-dark-accent/50 rounded-xl font-light transition-all flex items-center justify-center"
                  >
                    Saiba Mais
                  </Link>
                </div>
              </div>

              {/* Plano Empresarial */}
              <div className="group bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border-2 border-dark-accent/30 rounded-3xl p-8 hover:border-dark-accent/50 hover:shadow-2xl hover:shadow-dark-accent/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-r from-dark-accent/20 to-dark-info/20 text-dark-accent text-xs font-light rounded-bl-xl border-b border-l border-dark-accent/30">
                  Mais Popular
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-dark-accent/0 via-dark-accent/5 to-dark-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-light text-dark-text-primary mb-2">Plano Empresarial</h3>
                      <p className="text-sm text-dark-text-muted font-light">Solução completa para empresas</p>
                      <p className="text-xs text-dark-text-muted/60 font-light mt-1 italic">Serviço oferecido por empresa parceira</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-dark-accent/30 to-dark-info/30 rounded-2xl flex items-center justify-center border border-dark-accent/50">
                      <svg className="w-8 h-8 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="mb-6 pb-6 border-b border-dark-border/30">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-4xl font-extralight text-dark-text-primary">R$</span>
                      <span className="text-5xl font-extralight text-dark-accent">399</span>
                      <span className="text-lg text-dark-text-muted font-light">/mês</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-dark-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-dark-text-muted font-light">Tudo do plano pessoal, mais:</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-dark-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-dark-text-muted font-light">Gestão financeira empresarial completa</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-dark-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-dark-text-muted font-light">Ferramentas de gestão tributária</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-dark-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-dark-text-muted font-light">Suporte a múltiplas moedas avançado</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-dark-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-dark-text-muted font-light">Integração de pagamento segura</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-dark-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-dark-text-muted font-light">Relatórios executivos personalizados</span>
                    </li>
                  </ul>

                  <div className="flex flex-col gap-3">
                    <Link
                      href="/sobre"
                      className="w-full px-6 py-3 bg-dark-accent/10 hover:bg-dark-accent/20 text-dark-accent border border-dark-accent/50 rounded-xl font-light transition-all flex items-center justify-center"
                    >
                      Saiba Mais
                    </Link>
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-dark-accent/20 to-dark-info/20 hover:from-dark-accent/30 hover:to-dark-info/30 text-dark-accent border border-dark-accent/50 rounded-xl font-light transition-all">
                      Contatar Vendas
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-dark-text-muted font-light mb-4">
                Todos os planos incluem acesso completo à plataforma QuantEdge Pro
              </p>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-dark-bg-secondary/30 border border-dark-border/30 rounded-xl">
                <svg className="w-4 h-4 text-dark-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-dark-text-muted font-light">
                  Planos de gestão financeira incluem período de teste gratuito de 14 dias
                </p>
              </div>
            </div>
          </section>

          {/* CTA Final com Mais Credibilidade */}
          <section className="text-center py-20">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extralight text-dark-text-primary mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-dark-text-primary via-dark-accent to-dark-text-primary bg-clip-text text-transparent">
                  Pronto para começar?
                </span>
              </h2>
              <p className="text-xl text-dark-text-muted font-light mb-6">
                Cadastre-se gratuitamente e tenha acesso completo a todas as funcionalidades da plataforma
              </p>
              
              {/* Badges de Confiança */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                <div className="flex items-center space-x-2 px-4 py-2 bg-dark-card/30 border border-dark-border/30 rounded-lg">
                  <svg className="w-4 h-4 text-dark-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-light text-dark-text-muted">Sem compromisso</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-dark-card/30 border border-dark-border/30 rounded-lg">
                  <svg className="w-4 h-4 text-dark-info" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-light text-dark-text-muted">Dados protegidos</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-dark-card/30 border border-dark-border/30 rounded-lg">
                  <svg className="w-4 h-4 text-dark-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-light text-dark-text-muted">Configuração rápida</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/cadastro"
                  className="px-10 py-5 bg-gradient-to-r from-dark-accent/20 via-dark-info/20 to-dark-accent/20 hover:from-dark-accent/30 hover:via-dark-info/30 hover:to-dark-accent/30 text-dark-accent border-2 border-dark-accent/50 rounded-lg font-light transition-all duration-300 hover:border-dark-accent hover:shadow-lg hover:shadow-dark-accent/20 relative overflow-hidden group text-lg"
                >
                  <span className="relative z-10">Criar Conta Gratuita</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-dark-accent/0 via-dark-accent/10 to-dark-accent/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </Link>
                <Link
                  href="/login"
                  className="px-10 py-5 text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-card border border-dark-border rounded-lg font-light transition-all duration-300 text-lg"
                >
                  Fazer Login
                </Link>
              </div>

              {/* Nota Final Sutil */}
              <p className="mt-8 text-xs text-dark-text-muted/60 font-light">
                Junte-se a mais de 850 usuários que já confiam na nossa plataforma
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* ChatBot */}
      <ChatBot />
    </main>
  );
}
