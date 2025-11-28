"use client";

import Link from "next/link";

/**
 * Componente QuickAccess
 * Acesso rápido a funcionalidades principais
 */
export default function QuickAccess() {
  const quickLinks = [
    {
      title: "Cotações",
      description: "Acompanhe cotações em tempo real",
      href: "/cotacoes",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      gradient: "from-blue-500/20 to-cyan-500/10",
      borderColor: "border-blue-500/30",
      hoverColor: "hover:border-blue-500/50",
    },
    {
      title: "Análises",
      description: "Análises técnicas e fundamentais",
      href: "/analises",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: "from-green-500/20 to-emerald-500/10",
      borderColor: "border-green-500/30",
      hoverColor: "hover:border-green-500/50",
    },
    {
      title: "Portfolio",
      description: "Gerencie seus investimentos",
      href: "/portfolio",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-purple-500/20 to-pink-500/10",
      borderColor: "border-purple-500/30",
      hoverColor: "hover:border-purple-500/50",
    },
    {
      title: "Notícias",
      description: "Últimas notícias do mercado",
      href: "/noticias",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      gradient: "from-orange-500/20 to-yellow-500/10",
      borderColor: "border-orange-500/30",
      hoverColor: "hover:border-orange-500/50",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {quickLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={`
              group relative bg-gradient-to-br from-dark-card/50 to-dark-card-hover/30 backdrop-blur-xl border border-dark-border/50 p-6 rounded-3xl
              ${link.hoverColor}
              hover:bg-dark-card/60 transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl
            `}
          >
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${link.gradient} rounded-xl flex items-center justify-center border ${link.borderColor} transition-colors ${link.hoverColor}`}>
                  <div className="text-dark-text-primary group-hover:scale-110 transition-transform">
                    {link.icon}
                  </div>
                </div>
                <svg className="w-5 h-5 text-dark-text-muted group-hover:text-dark-accent group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-xl font-extralight text-dark-text-primary mb-2 tracking-tight group-hover:text-dark-accent transition-colors">
                {link.title}
              </h3>
              <p className="text-sm text-dark-text-muted font-light leading-relaxed">
                {link.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
