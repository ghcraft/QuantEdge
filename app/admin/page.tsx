"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/lib/admin";
import { feedbackService } from "@/lib/feedback";
import { AuthService } from "@/lib/auth";
import Logo from "@/components/Logo";
import FinancialChart from "@/components/FinancialChart";

interface Stats {
  totalUsers: number;
  totalFeedbacks: number;
  positiveFeedbacks: number;
  negativeFeedbacks: number;
  averageRating: string;
  recentFeedbacks: any[];
  totalSessions: number;
  activeUsersToday: number;
  feedbacksThisWeek: number;
  feedbacksThisMonth: number;
}

interface FeedbackTrend {
  date: string;
  positive: number;
  negative: number;
  total: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "feedbacks" | "analytics" | "users" | "settings">("overview");
  const [selectedTimeframe, setSelectedTimeframe] = useState<"7d" | "30d" | "90d" | "all">("30d");

  useEffect(() => {
    if (adminService.isAdmin()) {
      setIsAuthenticated(true);
      loadStats();
      // Atualiza estatísticas a cada 30 segundos
      const interval = setInterval(loadStats, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  const loadStats = () => {
    const feedbackStats = feedbackService.getStats();
    const negativeFeedbacks = feedbackService.getNegative();
    const publicFeedbacks = feedbackService.getPublic();
    const pendingFeedbacks = feedbackService.getPending();
    const allFeedbacks = feedbackService.getAll();

    // Busca usuários reais do sistema
    const allUsers = AuthService.getAllUsers();
    const totalUsers = allUsers.length;

    // Calcula usuários ativos hoje (fizeram login nas últimas 24 horas)
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const activeUsersToday = allUsers.filter((user) => {
      if (!user.lastLogin) return false;
      return new Date(user.lastLogin) >= yesterday;
    }).length;

    // Calcula total de sessões (usuários que já fizeram login pelo menos uma vez)
    const totalSessions = allUsers.filter((user) => user.lastLogin).length;

    // Calcula feedbacks por período
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const feedbacksThisWeek = allFeedbacks.filter(
      (fb) => new Date(fb.createdAt) >= weekAgo
    ).length;

    const feedbacksThisMonth = allFeedbacks.filter(
      (fb) => new Date(fb.createdAt) >= monthAgo
    ).length;

    setStats({
      totalUsers,
      totalFeedbacks: feedbackStats.total,
      positiveFeedbacks: feedbackStats.public,
      negativeFeedbacks: feedbackStats.negative,
      averageRating: feedbackStats.averageRating,
      recentFeedbacks: [...pendingFeedbacks.slice(0, 5), ...negativeFeedbacks.slice(0, 3), ...publicFeedbacks.slice(0, 2)],
      totalSessions,
      activeUsersToday,
      feedbacksThisWeek,
      feedbacksThisMonth,
    });
  };

  const handleApproveFeedback = (feedbackId: string) => {
    feedbackService.approve(feedbackId);
    loadStats();
  };

  const handleRejectFeedback = (feedbackId: string) => {
    feedbackService.reject(feedbackId);
    loadStats();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const cleanEmail = email.trim();
      const cleanPassword = password;

      const result = adminService.login(cleanEmail, cleanPassword);

      if (result.success) {
        setIsAuthenticated(true);
        loadStats();
        setEmail("");
        setPassword("");
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setError("Erro ao processar login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminService.logout();
    setIsAuthenticated(false);
    router.push("/");
  };

  // Gera dados de tendência de feedbacks
  const feedbackTrendData = useMemo(() => {
    if (!stats) return [];
    const allFeedbacks = feedbackService.getAll();
    const days = selectedTimeframe === "7d" ? 7 : selectedTimeframe === "30d" ? 30 : selectedTimeframe === "90d" ? 90 : 365;
    const data: FeedbackTrend[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayFeedbacks = allFeedbacks.filter((fb) => {
        const fbDate = new Date(fb.createdAt).toISOString().split("T")[0];
        return fbDate === dateStr;
      });

      data.push({
        date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
        positive: dayFeedbacks.filter((fb) => fb.rating >= 4).length,
        negative: dayFeedbacks.filter((fb) => fb.rating < 4).length,
        total: dayFeedbacks.length,
      });
    }

    return data;
  }, [stats, selectedTimeframe]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo size="lg" showText={true} className="justify-center mb-4" />
            <h1 className="text-2xl font-extralight text-dark-text-primary mb-2 tracking-tight">
              Painel Administrativo
            </h1>
            <p className="text-sm text-dark-text-muted font-light">
              Acesso exclusivo para administração
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8 shadow-2xl"
          >
            {error && (
              <div className="mb-6 p-4 bg-dark-danger/10 border border-dark-danger/30 rounded-xl">
                <p className="text-sm text-dark-danger font-light">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-light text-dark-text-muted mb-2 uppercase tracking-wider"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-dark-bg-secondary/50 border border-dark-border/30 rounded-xl text-dark-text-primary placeholder-dark-text-muted/50 focus:outline-none focus:border-dark-accent/50 focus:ring-1 focus:ring-dark-accent/20 transition-all"
                  placeholder="admin@quantedge.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-light text-dark-text-muted mb-2 uppercase tracking-wider"
                >
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-dark-bg-secondary/50 border border-dark-border/30 rounded-xl text-dark-text-primary placeholder-dark-text-muted/50 focus:outline-none focus:border-dark-accent/50 focus:ring-1 focus:ring-dark-accent/20 transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-dark-accent/20 to-dark-info/20 hover:from-dark-accent/30 hover:to-dark-info/30 text-dark-accent border border-dark-accent/50 rounded-xl font-light transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-dark-accent/10"
              >
                {loading ? "Autenticando..." : "Acessar Painel"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="border-b border-dark-border/50 bg-dark-bg-secondary/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <Logo size="md" showText={true} />
              <div className="hidden md:flex items-center space-x-1 border-l border-dark-border/30 pl-6">
                <div className="w-2 h-2 bg-dark-accent rounded-full animate-pulse"></div>
                <span className="text-xs text-dark-text-muted font-light ml-2">Sistema Administrativo</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-light text-dark-text-primary">CEO</p>
                <p className="text-xs text-dark-text-muted font-light">Administrador</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-light text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-card/50 border border-dark-border/30 rounded-xl transition-all"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-extralight text-dark-text-primary mb-2 tracking-tight">
            Painel Administrativo
          </h1>
          <p className="text-sm text-dark-text-muted font-light">
            Visão geral completa e gerenciamento do QuantEdge Pro
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex space-x-1 bg-dark-card/30 backdrop-blur-sm border border-dark-border/30 rounded-2xl p-1">
          {[
            { id: "overview", label: "Visão Geral", icon: "📊" },
            { id: "users", label: "Usuários", icon: "👥" },
            { id: "feedbacks", label: "Feedbacks", icon: "💬" },
            { id: "analytics", label: "Analytics", icon: "📈" },
            { id: "settings", label: "Configurações", icon: "⚙️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 rounded-xl font-light text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-dark-accent/20 text-dark-accent border border-dark-accent/30"
                  : "text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-card/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <div className="space-y-8">
            {/* Estatísticas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 hover:border-dark-accent/30 hover:shadow-xl hover:shadow-dark-accent/5 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-2xl flex items-center justify-center border border-dark-border/30">
                    <svg className="w-7 h-7 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="px-3 py-1 bg-dark-accent/10 border border-dark-accent/20 rounded-lg">
                    <span className="text-xs font-light text-dark-accent">Total</span>
                  </div>
                </div>
                <p className="text-4xl font-extralight text-dark-text-primary mb-1">{stats.totalUsers.toLocaleString("pt-BR")}</p>
                <p className="text-xs text-dark-text-muted font-light">Usuários Registrados</p>
                <div className="mt-3 pt-3 border-t border-dark-border/20">
                  <p className="text-xs text-dark-text-muted font-light">
                    <span className="text-dark-accent">{stats.activeUsersToday}</span> ativos hoje
                  </p>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 hover:border-dark-info/30 hover:shadow-xl hover:shadow-dark-info/5 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-dark-info/20 to-dark-accent/20 rounded-2xl flex items-center justify-center border border-dark-border/30">
                    <svg className="w-7 h-7 text-dark-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className="px-3 py-1 bg-dark-info/10 border border-dark-info/20 rounded-lg">
                    <span className="text-xs font-light text-dark-info">Total</span>
                  </div>
                </div>
                <p className="text-4xl font-extralight text-dark-text-primary mb-1">{stats.totalFeedbacks}</p>
                <p className="text-xs text-dark-text-muted font-light">Feedbacks Recebidos</p>
                <div className="mt-3 pt-3 border-t border-dark-border/20">
                  <p className="text-xs text-dark-text-muted font-light">
                    Média: <span className="text-dark-info">{stats.averageRating}</span> estrelas
                  </p>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 hover:border-dark-success/30 hover:shadow-xl hover:shadow-dark-success/5 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-dark-success/20 to-dark-accent/20 rounded-2xl flex items-center justify-center border border-dark-border/30">
                    <svg className="w-7 h-7 text-dark-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="px-3 py-1 bg-dark-success/10 border border-dark-success/20 rounded-lg">
                    <span className="text-xs font-light text-dark-success">Positivos</span>
                  </div>
                </div>
                <p className="text-4xl font-extralight text-dark-text-primary mb-1">{stats.positiveFeedbacks}</p>
                <p className="text-xs text-dark-text-muted font-light">Feedbacks Positivos</p>
                <div className="mt-3 pt-3 border-t border-dark-border/20">
                  <p className="text-xs text-dark-text-muted font-light">
                    {stats.totalFeedbacks > 0
                      ? `${Math.round((stats.positiveFeedbacks / stats.totalFeedbacks) * 100)}%`
                      : "0%"} do total
                  </p>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 hover:border-dark-warning/30 hover:shadow-xl hover:shadow-dark-warning/5 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-dark-warning/20 to-dark-danger/20 rounded-2xl flex items-center justify-center border border-dark-border/30">
                    <svg className="w-7 h-7 text-dark-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="px-3 py-1 bg-dark-warning/10 border border-dark-warning/20 rounded-lg">
                    <span className="text-xs font-light text-dark-warning">Atenção</span>
                  </div>
                </div>
                <p className="text-4xl font-extralight text-dark-text-primary mb-1">{stats.negativeFeedbacks}</p>
                <p className="text-xs text-dark-text-muted font-light">Feedbacks Negativos</p>
                <div className="mt-3 pt-3 border-t border-dark-border/20">
                  <p className="text-xs text-dark-text-muted font-light">
                    {stats.negativeFeedbacks > 0 ? "Requer ação" : "Nenhum pendente"}
                  </p>
                </div>
              </div>
            </div>

            {/* Estatísticas Secundárias */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-dark-info/20 to-dark-accent/20 rounded-xl flex items-center justify-center border border-dark-border/30">
                    <svg className="w-5 h-5 text-dark-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-extralight text-dark-text-primary">{stats.totalSessions.toLocaleString("pt-BR")}</p>
                    <p className="text-xs text-dark-text-muted font-light">Total de Sessões</p>
                  </div>
                </div>
              </div>

              <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-xl flex items-center justify-center border border-dark-border/30">
                    <svg className="w-5 h-5 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-extralight text-dark-text-primary">{stats.feedbacksThisWeek}</p>
                    <p className="text-xs text-dark-text-muted font-light">Feedbacks Esta Semana</p>
                  </div>
                </div>
              </div>

              <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-dark-success/20 to-dark-accent/20 rounded-xl flex items-center justify-center border border-dark-border/30">
                    <svg className="w-5 h-5 text-dark-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-extralight text-dark-text-primary">{stats.feedbacksThisMonth}</p>
                    <p className="text-xs text-dark-text-muted font-light">Feedbacks Este Mês</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedbacks Tab */}
        {activeTab === "feedbacks" && stats && (
          <div className="space-y-8">
            {/* Feedbacks Negativos - Prioridade */}
            {stats.negativeFeedbacks > 0 && (
              <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-warning/30 rounded-3xl p-8 shadow-xl shadow-dark-warning/5">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-light text-dark-text-primary mb-2">Feedbacks Negativos</h2>
                    <p className="text-sm text-dark-text-muted font-light">
                      Análise de insatisfação dos usuários - Requer atenção imediata
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-dark-warning/20 border border-dark-warning/40 rounded-xl">
                    <p className="text-sm font-light text-dark-warning">{stats.negativeFeedbacks} pendentes</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {feedbackService.getNegative().slice(0, 10).map((feedback) => (
                    <div
                      key={feedback.id}
                      className="bg-dark-bg-secondary/40 border border-dark-border/40 rounded-2xl p-5 hover:border-dark-warning/50 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <p className="text-sm font-light text-dark-text-primary">{feedback.userName || "Usuário Anônimo"}</p>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < feedback.rating ? "text-dark-warning" : "text-dark-text-muted/20"}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-dark-text-muted font-light">
                              {new Date(feedback.createdAt).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      {feedback.comment && (
                        <div className="mt-4 bg-dark-bg/60 rounded-xl p-4 border border-dark-border/30">
                          <p className="text-sm text-dark-text-muted font-light leading-relaxed">
                            "{feedback.comment}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedbacks Aprovados */}
            <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-light text-dark-text-primary mb-2">Feedbacks Aprovados</h2>
                <p className="text-sm text-dark-text-muted font-light">Feedbacks aprovados e exibidos publicamente</p>
              </div>

              <div className="space-y-4">
                {feedbackService.getPublic().slice(0, 10).map((feedback) => (
                  <div
                    key={feedback.id}
                    className="bg-dark-bg-secondary/30 border border-dark-success/20 rounded-2xl p-5 hover:border-dark-success/40 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <p className="text-sm font-light text-dark-text-primary">{feedback.userName || "Usuário Anônimo"}</p>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < feedback.rating ? "text-dark-warning" : "text-dark-text-muted/20"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs px-2 py-1 bg-dark-success/10 border border-dark-success/20 rounded-lg text-dark-success font-light">
                            Aprovado
                          </span>
                          <span className="text-xs text-dark-text-muted font-light">
                            {feedback.approvedAt
                              ? new Date(feedback.approvedAt).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : new Date(feedback.createdAt).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                          </span>
                        </div>
                      </div>
                    </div>
                    {feedback.comment && (
                      <p className="text-sm text-dark-text-muted font-light mt-3 leading-relaxed">
                        "{feedback.comment}"
                      </p>
                    )}
                  </div>
                ))}
                {feedbackService.getPublic().length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-dark-text-muted font-light">Nenhum feedback aprovado ainda.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Todos os Feedbacks */}
            <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-light text-dark-text-primary mb-2">Histórico Completo</h2>
                <p className="text-sm text-dark-text-muted font-light">Todos os feedbacks recebidos (aprovados, rejeitados e pendentes)</p>
              </div>

              <div className="space-y-4">
                {feedbackService.getAll().slice(0, 20).map((feedback) => {
                  const status = feedback.approved
                    ? "approved"
                    : feedback.rejected
                    ? "rejected"
                    : "pending";

                  return (
                    <div
                      key={feedback.id}
                      className={`bg-dark-bg-secondary/30 border rounded-2xl p-5 hover:border-dark-accent/30 transition-all ${
                        status === "approved"
                          ? "border-dark-success/30"
                          : status === "rejected"
                          ? "border-dark-danger/30"
                          : "border-dark-warning/30"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2 flex-wrap">
                            <p className="text-sm font-light text-dark-text-primary">{feedback.userName || "Usuário Anônimo"}</p>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < feedback.rating ? "text-dark-warning" : "text-dark-text-muted/20"}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded-lg font-light ${
                                status === "approved"
                                  ? "text-dark-success bg-dark-success/10 border border-dark-success/20"
                                  : status === "rejected"
                                  ? "text-dark-danger bg-dark-danger/10 border border-dark-danger/20"
                                  : "text-dark-warning bg-dark-warning/10 border border-dark-warning/20"
                              }`}
                            >
                              {status === "approved"
                                ? "Aprovado"
                                : status === "rejected"
                                ? "Rejeitado"
                                : "Pendente"}
                            </span>
                            <span className="text-xs text-dark-text-muted font-light">
                              {new Date(feedback.createdAt).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                        {status === "pending" && (
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleApproveFeedback(feedback.id)}
                              className="px-3 py-1 bg-dark-success/20 hover:bg-dark-success/30 text-dark-success border border-dark-success/40 rounded-lg text-xs font-light transition-all"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => handleRejectFeedback(feedback.id)}
                              className="px-3 py-1 bg-dark-danger/20 hover:bg-dark-danger/30 text-dark-danger border border-dark-danger/40 rounded-lg text-xs font-light transition-all"
                            >
                              Rejeitar
                            </button>
                          </div>
                        )}
                      </div>
                      {feedback.comment && (
                        <p className="text-sm text-dark-text-muted font-light mt-3 leading-relaxed">
                          "{feedback.comment}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && stats && (
          <div className="space-y-8">
            {/* Gráfico de Tendência de Feedbacks */}
            <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-light text-dark-text-primary mb-2">Tendência de Feedbacks</h2>
                  <p className="text-sm text-dark-text-muted font-light">
                    Análise temporal dos feedbacks recebidos
                  </p>
                </div>
                <div className="flex space-x-2 bg-dark-bg-secondary/50 rounded-xl p-1 border border-dark-border/30">
                  {(["7d", "30d", "90d", "all"] as const).map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={`px-4 py-2 rounded-lg text-xs font-light transition-all ${
                        selectedTimeframe === timeframe
                          ? "bg-dark-accent/20 text-dark-accent border border-dark-accent/30"
                          : "text-dark-text-muted hover:text-dark-text-primary"
                      }`}
                    >
                      {timeframe === "7d" ? "7 dias" : timeframe === "30d" ? "30 dias" : timeframe === "90d" ? "90 dias" : "Todo período"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-80">
                <FinancialChart
                  symbol="FEEDBACKS"
                  height={320}
                  interval="1D"
                  hideTopToolbar={true}
                  hideSideToolbar={true}
                />
              </div>
            </div>

            {/* Métricas de Engajamento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8">
                <h3 className="text-xl font-light text-dark-text-primary mb-4">Distribuição de Avaliações</h3>
                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = feedbackService
                      .getAll()
                      .filter((fb) => fb.rating === rating).length;
                    const total = stats.totalFeedbacks;
                    const percentage = total > 0 ? (count / total) * 100 : 0;

                    return (
                      <div key={rating} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-light text-dark-text-muted">{rating} estrelas</span>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-3 h-3 ${i < rating ? "text-dark-warning" : "text-dark-text-muted/20"}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <span className="text-sm font-light text-dark-text-primary">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-dark-bg-secondary/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              rating >= 4
                                ? "bg-gradient-to-r from-dark-success to-dark-accent"
                                : rating === 3
                                ? "bg-gradient-to-r from-dark-warning to-dark-warning"
                                : "bg-gradient-to-r from-dark-danger to-dark-warning"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8">
                <h3 className="text-xl font-light text-dark-text-primary mb-4">Resumo de Métricas</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-light text-dark-text-muted">Taxa de Satisfação</span>
                      <span className="text-lg font-light text-dark-success">
                        {stats.totalFeedbacks > 0
                          ? `${Math.round((stats.positiveFeedbacks / stats.totalFeedbacks) * 100)}%`
                          : "0%"}
                      </span>
                    </div>
                    <div className="h-2 bg-dark-bg-secondary/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-dark-success to-dark-accent rounded-full"
                        style={{
                          width: `${
                            stats.totalFeedbacks > 0
                              ? Math.round((stats.positiveFeedbacks / stats.totalFeedbacks) * 100)
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-light text-dark-text-muted">Taxa de Resposta</span>
                      <span className="text-lg font-light text-dark-info">
                        {stats.totalUsers > 0
                          ? `${Math.round((stats.totalFeedbacks / stats.totalUsers) * 100)}%`
                          : "0%"}
                      </span>
                    </div>
                    <div className="h-2 bg-dark-bg-secondary/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-dark-info to-dark-accent rounded-full"
                        style={{
                          width: `${
                            stats.totalUsers > 0
                              ? Math.min(Math.round((stats.totalFeedbacks / stats.totalUsers) * 100), 100)
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-light text-dark-text-muted">Média de Avaliação</span>
                      <span className="text-lg font-light text-dark-accent">{stats.averageRating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(parseFloat(stats.averageRating))
                              ? "text-dark-warning"
                              : "text-dark-text-muted/20"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-8">
            {/* Estatísticas de Usuários */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-xl flex items-center justify-center border border-dark-border/30">
                    <svg className="w-6 h-6 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-extralight text-dark-text-primary">{stats?.totalUsers || 0}</p>
                    <p className="text-xs text-dark-text-muted font-light">Total de Usuários</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-dark-success/20 to-dark-accent/20 rounded-xl flex items-center justify-center border border-dark-border/30">
                    <svg className="w-6 h-6 text-dark-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-extralight text-dark-text-primary">{stats?.activeUsersToday || 0}</p>
                    <p className="text-xs text-dark-text-muted font-light">Ativos Hoje</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-dark-info/20 to-dark-accent/20 rounded-xl flex items-center justify-center border border-dark-border/30">
                    <svg className="w-6 h-6 text-dark-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-extralight text-dark-text-primary">{stats?.totalSessions || 0}</p>
                    <p className="text-xs text-dark-text-muted font-light">Sessões Ativas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Usuários */}
            <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-light text-dark-text-primary mb-2">Usuários Cadastrados</h2>
                <p className="text-sm text-dark-text-muted font-light">
                  Lista completa de todos os usuários registrados no sistema
                </p>
              </div>

              {AuthService.getAllUsers().length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-dark-border/30">
                    <svg className="w-10 h-10 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-light text-dark-text-primary mb-2">Nenhum usuário cadastrado</h3>
                  <p className="text-sm text-dark-text-muted font-light">
                    Os usuários aparecerão aqui quando se cadastrarem no site
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {AuthService.getAllUsers()
                    .sort((a, b) => {
                      // Ordena por último login (mais recente primeiro), depois por data de cadastro
                      const aLastLogin = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
                      const bLastLogin = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
                      if (aLastLogin !== bLastLogin) return bLastLogin - aLastLogin;
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    })
                    .map((user) => {
                      const isActiveToday = user.lastLogin
                        ? new Date(user.lastLogin) >= new Date(Date.now() - 24 * 60 * 60 * 1000)
                        : false;

                      return (
                        <div
                          key={user.id}
                          className="bg-dark-bg-secondary/40 border border-dark-border/40 rounded-2xl p-5 hover:border-dark-accent/30 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                              <div className="w-12 h-12 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-xl flex items-center justify-center border border-dark-border/30">
                                <span className="text-lg font-light text-dark-accent">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <p className="text-sm font-light text-dark-text-primary truncate">{user.name}</p>
                                  {isActiveToday && (
                                    <div className="flex items-center space-x-1 px-2 py-0.5 bg-dark-success/10 border border-dark-success/20 rounded-lg">
                                      <div className="w-1.5 h-1.5 bg-dark-success rounded-full animate-pulse"></div>
                                      <span className="text-xs font-light text-dark-success">Ativo</span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-dark-text-muted font-light font-mono truncate">{user.email}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <span className="text-xs text-dark-text-muted font-light">
                                    Cadastrado: {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                  {user.lastLogin && (
                                    <span className="text-xs text-dark-text-muted font-light">
                                      Último acesso: {new Date(user.lastLogin).toLocaleDateString("pt-BR", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  )}
                                  {!user.lastLogin && (
                                    <span className="text-xs text-dark-text-muted/60 font-light italic">
                                      Nunca acessou
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="px-3 py-1 bg-dark-card/50 border border-dark-border/30 rounded-lg">
                                <span className="text-xs font-light text-dark-text-muted">
                                  ID: {user.id.substring(0, 8)}...
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8">
              <h2 className="text-2xl font-light text-dark-text-primary mb-6">Configurações do Sistema</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-dark-bg-secondary/30 rounded-xl border border-dark-border/30">
                  <div>
                    <p className="text-sm font-light text-dark-text-primary mb-1">Versão do Sistema</p>
                    <p className="text-xs text-dark-text-muted font-light">QuantEdge Pro v1.0.0</p>
                  </div>
                  <div className="px-3 py-1 bg-dark-success/10 border border-dark-success/20 rounded-lg">
                    <span className="text-xs font-light text-dark-success">Atualizado</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-bg-secondary/30 rounded-xl border border-dark-border/30">
                  <div>
                    <p className="text-sm font-light text-dark-text-primary mb-1">Status do Servidor</p>
                    <p className="text-xs text-dark-text-muted font-light">Todos os sistemas operacionais</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-dark-success rounded-full animate-pulse"></div>
                    <span className="text-xs font-light text-dark-success">Online</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-bg-secondary/30 rounded-xl border border-dark-border/30">
                  <div>
                    <p className="text-sm font-light text-dark-text-primary mb-1">Última Atualização</p>
                    <p className="text-xs text-dark-text-muted font-light">
                      {new Date().toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8">
              <h2 className="text-2xl font-light text-dark-text-primary mb-6">Informações da Conta</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-dark-bg-secondary/30 rounded-xl border border-dark-border/30">
                  <p className="text-xs font-light text-dark-text-muted mb-1 uppercase tracking-wider">Email Administrativo</p>
                  <p className="text-sm font-light text-dark-text-primary">admin@quantedge.com</p>
                </div>

                <div className="p-4 bg-dark-bg-secondary/30 rounded-xl border border-dark-border/30">
                  <p className="text-xs font-light text-dark-text-muted mb-1 uppercase tracking-wider">Nível de Acesso</p>
                  <p className="text-sm font-light text-dark-text-primary">CEO / Administrador Principal</p>
                </div>

                <div className="p-4 bg-dark-bg-secondary/30 rounded-xl border border-dark-border/30">
                  <p className="text-xs font-light text-dark-text-muted mb-1 uppercase tracking-wider">Sessão Ativa Desde</p>
                  <p className="text-sm font-light text-dark-text-primary">
                    {new Date().toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
