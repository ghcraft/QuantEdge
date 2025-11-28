"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/HeroScene"), { ssr: false });

/**
 * Landing Page Impactante
 * Página de entrada profissional estilo TradingView
 */
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setShowContent(true), 300);
  }, []);

  return (
    <div className="relative min-h-screen bg-dark-bg overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-bg-secondary to-dark-bg"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,170,0.08),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      
      {/* Three.js Scene */}
      {mounted && <HeroScene />}

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          {/* Main Title */}
          <div className="mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-dark-accent via-dark-info to-dark-accent blur-3xl opacity-50 animate-pulse"></div>
              <h1 className="relative text-7xl md:text-9xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-dark-accent via-dark-info to-dark-accent bg-clip-text text-transparent animate-gradient">
                  QUANT
                </span>
                <span className="text-dark-text-primary">EDGE</span>
              </h1>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl font-light text-dark-text-primary mb-4 max-w-3xl mx-auto leading-relaxed">
            Plataforma Avançada de Análise e Informações Financeiras
          </p>
          <p className="text-base md:text-lg text-dark-text-muted mb-12 max-w-2xl mx-auto">
            Gráficos em tempo real • Análises técnicas profissionais • Cotações ao vivo • 
            Gestão de portfolio • Notícias financeiras atualizadas
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Link
              href="/"
              className="group relative px-8 py-4 bg-gradient-to-r from-dark-accent to-dark-info 
                       text-dark-bg font-bold text-lg rounded-lg
                       hover:shadow-2xl hover:shadow-dark-accent/50
                       transition-all duration-300 hover:scale-105
                       overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-dark-info to-dark-accent opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative">ACESSAR PLATAFORMA</span>
            </Link>
            <Link
              href="/cotacoes"
              className="px-8 py-4 bg-dark-card border-2 border-dark-border 
                       text-dark-text-primary font-bold text-lg rounded-lg
                       hover:border-dark-accent hover:bg-dark-card-hover
                       transition-all duration-300"
            >
              VER COTAÇÕES
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-dark-card/50 border border-dark-border rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-dark-text-primary mb-2">Gráficos Avançados</h3>
              <p className="text-sm text-dark-text-muted">TradingView integrado com ferramentas profissionais de análise técnica</p>
            </div>

            <div className="p-6 bg-dark-card/50 border border-dark-border rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-dark-text-primary mb-2">Tempo Real</h3>
              <p className="text-sm text-dark-text-muted">Cotações e dados atualizados instantaneamente do mercado financeiro</p>
            </div>

            <div className="p-6 bg-dark-card/50 border border-dark-border rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-dark-text-primary mb-2">Análises Profissionais</h3>
              <p className="text-sm text-dark-text-muted">Insights e análises técnicas de especialistas do mercado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

