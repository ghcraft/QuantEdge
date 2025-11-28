"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

// Força renderização dinâmica (usa hooks do cliente)
export const dynamic = 'force-dynamic';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function SobrePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dados de demonstração para gráficos
  const growthData = [
    { mes: "M1", crescimento: 12 },
    { mes: "M2", crescimento: 25 },
    { mes: "M3", crescimento: 30 },
    { mes: "M4", crescimento: 35 },
    { mes: "M5", crescimento: 40 },
    { mes: "M6", crescimento: 45 },
  ];

  const performanceData = [
    { mes: "M1", performance: 20 },
    { mes: "M2", performance: 25 },
    { mes: "M3", performance: 30 },
    { mes: "M4", performance: 35 },
    { mes: "M5", performance: 40 },
    { mes: "M6", performance: 45 },
  ];

  const metricsData = [
    { metric: "Usuários ativos", valor: 150, variacao: "+45%", cor: "#00FF88" },
    { metric: "Economia média", valor: "US$ 12 mil", variacao: "+28%", cor: "#00AAFF" },
    { metric: "Satisfação", valor: "96%", variacao: "+5%", cor: "#7C3AED" },
    { metric: "Tempo de atividade", valor: "99,9%", variacao: "0%", cor: "#F59E0B" },
  ];

  const benefitsData = [
    { beneficio: "Economia de tempo", valor: 80, cor: "#00FF88" },
    { beneficio: "Redução de custos", valor: 35, cor: "#00AAFF" },
    { beneficio: "Precisão", valor: 99.9, cor: "#7C3AED" },
    { beneficio: "Segurança", valor: 100, cor: "#F59E0B" },
  ];

  const comparisonData = [
    { item: "Tempo de implementação", fintech: 7, concorrentes: 30 },
    { item: "Custo total", fintech: 399, concorrentes: 1500 },
  ];

  return (
    <main className="min-h-screen bg-dark-bg relative overflow-x-hidden">
      {/* Background Financeiro Global */}
      <div className="fixed inset-0 bg-dark-bg pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_100%_at_50%_0%,rgba(0,212,255,0.08),transparent_70%)]"></div>
      </div>

      {/* Navegação */}
      <nav className="relative z-50 border-b border-dark-border bg-dark-bg-secondary/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/demo">
              <Logo size="md" showText={true} />
            </Link>
            <Link
              href="/demo"
              className="px-4 py-2 text-sm font-light text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-card rounded-lg transition-all duration-300"
            >
              Voltar
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-dark-border/20 bg-dark-bg py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-dark-card/30 border border-dark-border/30 rounded-lg mb-6">
                <svg className="w-4 h-4 text-dark-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-light text-dark-text-muted">Soluções FinTech Complementares</span>
              </div>
              <h1 
                className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight transition-all duration-1000 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}
              >
                <span className="bg-gradient-to-r from-dark-text-primary via-dark-accent to-dark-info bg-clip-text text-transparent">
                  Plataforma de Gestão Financeira
                </span>
              </h1>
              <p 
                className={`text-xl md:text-2xl text-dark-text-muted font-light leading-relaxed mb-8 transition-all duration-1000 delay-200 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                A FinTech Solutions é uma plataforma completa de gestão financeira que transforma a maneira como empresas e indivíduos gerenciam suas finanças. Com tecnologia de ponta e uma interface intuitiva, oferecemos análises avançadas, automação e ferramentas de planejamento financeiro projetadas para ajudá-lo a tomar decisões financeiras mais inteligentes.
              </p>
              <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 transition-all duration-1000 delay-400 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}>
                <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-2xl p-6">
                  <p className="text-sm text-dark-text-muted font-light mb-2">Plano Empresarial</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-extralight text-dark-text-primary">R$</span>
                    <span className="text-4xl font-extralight text-dark-accent">399</span>
                    <span className="text-lg text-dark-text-muted font-light">/mês</span>
                  </div>
                </div>
                <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-2xl p-6">
                  <p className="text-sm text-dark-text-muted font-light mb-2">Plano Pessoal</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-extralight text-dark-text-primary">R$</span>
                    <span className="text-4xl font-extralight text-dark-info">99</span>
                    <span className="text-lg text-dark-text-muted font-light">/mês</span>
                  </div>
                </div>
                <Link
                  href="/cadastro"
                  className="px-8 py-4 bg-dark-accent/10 hover:bg-dark-accent/15 text-dark-accent border border-dark-accent/40 hover:border-dark-accent/60 rounded-lg font-light transition-all duration-300"
                >
                  Assine agora
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Gráficos de Crescimento */}
        <section className="py-20 border-b border-dark-border/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Crescimento Mensal */}
              <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8">
                <h3 className="text-xl font-light text-dark-text-primary mb-6">Crescimento mensal</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00FF88" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                    <XAxis dataKey="mes" stroke="#6b7280" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} domain={[0, 50]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a2e",
                        border: "1px solid #00FF88",
                        borderRadius: "8px",
                        color: "#e5e7eb",
                      }}
                      formatter={(value: number) => [`${value}%`, "Crescimento"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="crescimento"
                      stroke="#00FF88"
                      fillOpacity={1}
                      fill="url(#colorGrowth)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Métricas de Desempenho */}
              <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8">
                <h3 className="text-xl font-light text-dark-text-primary mb-6">Métricas de desempenho</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                    <XAxis dataKey="mes" stroke="#6b7280" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} domain={[0, 50]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a2e",
                        border: "1px solid #00FF88",
                        borderRadius: "8px",
                        color: "#e5e7eb",
                      }}
                      formatter={(value: number) => [`${value}%`, "Performance"]}
                    />
                    <Bar dataKey="performance" fill="#00AAFF" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Métricas Principais */}
        <section className="py-20 border-b border-dark-border/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metricsData.map((metric, index) => (
                <div
                  key={index}
                  className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 hover:border-dark-accent/50 transition-all"
                >
                  <p className="text-sm text-dark-text-muted font-light mb-2">{metric.metric}</p>
                  <p className="text-3xl font-extralight text-dark-text-primary mb-2">{metric.valor}</p>
                  <p className="text-sm text-dark-success font-light">{metric.variacao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefícios Comprovados */}
        <section className="py-20 border-b border-dark-border/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extralight text-dark-text-primary mb-6 tracking-tight">
                Benefícios comprovados
              </h2>
              <p className="text-lg text-dark-text-muted font-light max-w-3xl mx-auto">
                Resultados reais que transformam o seu negócio
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefitsData.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8 text-center hover:border-dark-accent/50 transition-all"
                >
                  <div className="text-5xl font-extralight mb-4" style={{ color: benefit.cor }}>
                    {benefit.valor}%
                  </div>
                  <h3 className="text-lg font-light text-dark-text-primary mb-2">{benefit.beneficio}</h3>
                  <p className="text-sm text-dark-text-muted font-light">
                    {index === 0 && "Automatize os processos financeiros"}
                    {index === 1 && "Otimize suas despesas"}
                    {index === 2 && "Relatórios em tempo real"}
                    {index === 3 && "Dados protegidos"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Funcionalidades Completas */}
        <section className="py-20 border-b border-dark-border/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extralight text-dark-text-primary mb-6 tracking-tight">
                Funcionalidades completas
              </h2>
              <p className="text-lg text-dark-text-muted font-light max-w-3xl mx-auto">
                Tudo o que você precisa em uma única plataforma
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Gestão de Finanças Empresariais e Pessoais",
                "Análises e relatórios em tempo real",
                "Suporte a múltiplas moedas",
                "Planejamento orçamentário automatizado",
                "Acompanhamento de investimentos",
                "Ferramentas de Gestão Tributária",
                "Integração de pagamento segura",
                "Acesso móvel e via web",
                "Análises financeiras baseadas em inteligência artificial",
                "Painéis personalizáveis",
                "Integração de conta bancária",
                "Gestão de Faturas",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-dark-card/30 backdrop-blur-sm border border-dark-border/40 rounded-2xl p-6 hover:border-dark-accent/50 transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-dark-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-dark-text-muted font-light">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Por que escolher */}
        <section className="py-20 border-b border-dark-border/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extralight text-dark-text-primary mb-6 tracking-tight">
                Por que escolher Soluções FinTech?
              </h2>
              <p className="text-lg text-dark-text-muted font-light max-w-3xl mx-auto">
                Comparação com soluções tradicionais
              </p>
            </div>

            <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8">
              <div className="space-y-6">
                {comparisonData.map((item, index) => (
                  <div key={index} className="bg-dark-bg-secondary/30 rounded-2xl p-6 border border-dark-border/30">
                    <h3 className="text-lg font-light text-dark-text-primary mb-4">{item.item}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-dark-card/30 rounded-xl p-4 border border-dark-accent/30">
                        <p className="text-xs text-dark-text-muted mb-2">Soluções FinTech</p>
                        <p className="text-2xl font-light text-dark-accent">
                          {index === 0 ? `${item.fintech} dias` : `US$ ${item.fintech}/mês`}
                        </p>
                      </div>
                      <div className="bg-dark-card/30 rounded-xl p-4 border border-dark-border/30">
                        <p className="text-xs text-dark-text-muted mb-2">Concorrentes</p>
                        <p className="text-2xl font-light text-dark-text-muted">
                          {index === 0 ? `Mais de ${item.concorrentes} dias` : `US$ ${item.concorrentes}+/mês`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-dark-bg-secondary/30 rounded-2xl p-6 border border-dark-border/30">
                  <h3 className="text-lg font-light text-dark-text-primary mb-4">Suporte</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-dark-card/30 rounded-xl p-4 border border-dark-accent/30">
                      <p className="text-xs text-dark-text-muted mb-2">Soluções FinTech</p>
                      <p className="text-lg font-light text-dark-accent">24 horas por dia, 7 dias por semana</p>
                    </div>
                    <div className="bg-dark-card/30 rounded-xl p-4 border border-dark-border/30">
                      <p className="text-xs text-dark-text-muted mb-2">Concorrentes</p>
                      <p className="text-lg font-light text-dark-text-muted">Horário comercial</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Planos */}
        <section className="py-20 border-b border-dark-border/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extralight text-dark-text-primary mb-6 tracking-tight">
                Escolha o plano ideal
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Plano Pessoal */}
              <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-8 hover:border-dark-accent/50 transition-all">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-light text-dark-text-primary mb-2">Plano Pessoal</h3>
                  <p className="text-sm text-dark-text-muted font-light">Ideal para gestão financeira individual</p>
                </div>
                <div className="text-center mb-8 pb-8 border-b border-dark-border/30">
                  <div className="flex items-baseline justify-center space-x-2">
                    <span className="text-3xl font-extralight text-dark-text-primary">R$</span>
                    <span className="text-5xl font-extralight text-dark-info">99</span>
                    <span className="text-lg text-dark-text-muted font-light">/mês</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Gestão financeira pessoal completa",
                    "Análises e relatórios automatizados",
                    "Planejamento orçamentário inteligente",
                    "Acompanhamento de investimentos",
                    "Acesso móvel e web",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-dark-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-dark-text-muted font-light">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/cadastro"
                  className="block w-full text-center px-6 py-3 bg-dark-info/10 hover:bg-dark-info/15 text-dark-info border border-dark-info/40 hover:border-dark-info/60 rounded-lg font-light transition-all duration-300"
                >
                  Assine agora
                </Link>
              </div>

              {/* Plano Empresarial */}
              <div className="bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border-2 border-dark-accent/50 rounded-3xl p-8 hover:border-dark-accent transition-all relative">
                <div className="absolute top-4 right-4 px-3 py-1 bg-dark-accent/20 text-dark-accent text-xs font-light rounded-full border border-dark-accent/30">
                  Mais Popular
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-light text-dark-text-primary mb-2">Plano Empresarial</h3>
                  <p className="text-sm text-dark-text-muted font-light">Solução completa para empresas</p>
                </div>
                <div className="text-center mb-8 pb-8 border-b border-dark-border/30">
                  <div className="flex items-baseline justify-center space-x-2">
                    <span className="text-3xl font-extralight text-dark-text-primary">R$</span>
                    <span className="text-5xl font-extralight text-dark-accent">399</span>
                    <span className="text-lg text-dark-text-muted font-light">/mês</span>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-dark-text-muted font-light mb-3">Tudo do plano pessoal, mais:</p>
                  <ul className="space-y-3">
                    {[
                      "Gestão financeira empresarial completa",
                      "Ferramentas de gestão tributária",
                      "Suporte a múltiplas moedas avançado",
                      "Integração de pagamento segura",
                      "Relatórios executivos personalizados",
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-dark-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-dark-text-muted font-light">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/cadastro"
                  className="block w-full text-center px-6 py-3 bg-dark-accent/10 hover:bg-dark-accent/15 text-dark-accent border border-dark-accent/40 hover:border-dark-accent/60 rounded-lg font-light transition-all duration-300"
                >
                  Assine agora
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-extralight text-dark-text-primary mb-6 tracking-tight">
              Pronto para transformar sua gestão financeira?
            </h2>
            <p className="text-xl text-dark-text-muted font-light mb-8">
              Junte-se a centenas de empresas e indivíduos que já confiam em nossas soluções
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/cadastro"
                className="px-8 py-4 bg-dark-accent/10 hover:bg-dark-accent/15 text-dark-accent border border-dark-accent/40 hover:border-dark-accent/60 rounded-lg font-light transition-all duration-300"
              >
                Começar Agora
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 bg-dark-card/30 hover:bg-dark-card/50 border border-dark-border/40 hover:border-dark-border/60 text-dark-text-muted hover:text-dark-text-primary rounded-lg font-light transition-all duration-300"
              >
                Voltar para Demo
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
