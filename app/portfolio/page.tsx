"use client";

import PortfolioManager from "@/components/PortfolioManager";
import Providers from "../providers";

/**
 * Página de Portfolio
 * Gerencie seus investimentos com funcionalidades completas
 */
export default function PortfolioPage() {
  return (
    <Providers>
      <main className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg-secondary to-dark-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-dark-border">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-transparent"></div>
              <h1 className="text-4xl md:text-6xl font-extralight tracking-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Meu Portfolio
                </span>
              </h1>
            </div>
            <p className="text-lg text-dark-text-muted/80 font-light max-w-2xl mx-auto">
              Gerencie e acompanhe seus investimentos em tempo real com métricas detalhadas e análises de performance
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PortfolioManager />
      </div>
    </main>
    </Providers>
  );
}

