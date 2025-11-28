"use client";

import Link from "next/link";
import Logo from "./Logo";

/**
 * Componente Footer
 * Footer elegante, didático e profissional para toda a aplicação
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/cotacoes", label: "Cotações" },
    { href: "/analises", label: "Análises" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/favoritos", label: "Favoritos" },
    { href: "/noticias", label: "Notícias" },
  ];

  const features = [
    { label: "Gráficos em Tempo Real", description: "Visualização profissional de ativos" },
    { label: "Análise Técnica", description: "Indicadores e ferramentas avançadas" },
    { label: "Notícias Financeiras", description: "Atualizações do mercado global" },
    { label: "Gestão de Portfolio", description: "Acompanhe seus investimentos" },
  ];

  const resources = [
    { label: "Documentação", href: "#" },
    { label: "Suporte", href: "#" },
    { label: "Termos de Uso", href: "#" },
    { label: "Política de Privacidade", href: "#" },
  ];

  return (
    <footer className="border-t border-dark-border bg-gradient-to-b from-dark-bg-secondary/80 to-dark-bg/95 backdrop-blur-md mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 mb-4">
                <Logo size="sm" showText={true} />
                <span className="px-2.5 py-1 text-[10px] font-bold bg-gradient-to-r from-dark-accent/20 to-dark-info/20 text-dark-accent rounded-full border border-dark-accent/30">
                  PRO
                </span>
              </div>
            </div>
            <p className="text-sm text-dark-text-muted font-light leading-relaxed mb-6">
              Plataforma profissional de análise técnica e inteligência de mercado em tempo real. 
              Domine seus investimentos com dados precisos e ferramentas avançadas.
            </p>
            <div className="flex items-center space-x-2 text-xs text-dark-text-secondary font-light">
              <div className="relative">
                <div className="absolute inset-0 bg-dark-accent blur-md opacity-40 animate-pulse"></div>
                <div className="relative w-2 h-2 bg-dark-accent rounded-full"></div>
              </div>
              <span>Sistema Online</span>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="text-sm font-semibold text-dark-text-primary mb-6 uppercase tracking-[0.15em] flex items-center">
              <span className="w-1 h-4 bg-gradient-to-b from-dark-accent to-dark-info mr-3 rounded-full"></span>
              Navegação
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-dark-text-muted hover:text-dark-accent transition-all duration-300 font-light"
                  >
                    <span className="w-0 group-hover:w-1.5 h-0.5 bg-dark-accent mr-0 group-hover:mr-2 transition-all duration-300 rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="text-sm font-semibold text-dark-text-primary mb-6 uppercase tracking-[0.15em] flex items-center">
              <span className="w-1 h-4 bg-gradient-to-b from-dark-accent to-dark-info mr-3 rounded-full"></span>
              Recursos
            </h3>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="group">
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 bg-dark-accent/50 rounded-full mt-2 group-hover:bg-dark-accent transition-colors flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-dark-text-primary font-light mb-1 group-hover:text-dark-accent transition-colors">
                        {feature.label}
                      </p>
                      <p className="text-xs text-dark-text-secondary font-light leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Informações */}
          <div>
            <h3 className="text-sm font-semibold text-dark-text-primary mb-6 uppercase tracking-[0.15em] flex items-center">
              <span className="w-1 h-4 bg-gradient-to-b from-dark-accent to-dark-info mr-3 rounded-full"></span>
              Informações
            </h3>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <li key={index}>
                  <Link
                    href={resource.href}
                    className="group flex items-center text-sm text-dark-text-muted hover:text-dark-accent transition-all duration-300 font-light"
                  >
                    <span className="w-0 group-hover:w-1.5 h-0.5 bg-dark-accent mr-0 group-hover:mr-2 transition-all duration-300 rounded-full"></span>
                    {resource.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-dark-border/50">
              <div className="space-y-2">
                <p className="text-xs text-dark-text-secondary font-light">
                  <span className="text-dark-text-muted">Versão:</span> 1.0.0
                </p>
                <p className="text-xs text-dark-text-secondary font-light">
                  <span className="text-dark-text-muted">Última atualização:</span> {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dark-border/50 my-12"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-xs text-dark-text-secondary font-light">
            <p>
              © {currentYear} <span className="text-dark-accent font-semibold">QuantEdge</span> <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gradient-to-r from-dark-accent/20 via-dark-info/20 to-dark-accent/20 border border-dark-accent/40 text-[10px] font-bold text-dark-accent tracking-wider uppercase shadow-[0_0_8px_rgba(0,255,136,0.2)]">PRO</span>. Todos os direitos reservados.
            </p>
            <span className="hidden md:inline text-dark-border">•</span>
            <p className="text-dark-text-muted">
              Desenvolvido com tecnologia de ponta para análise financeira
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-dark-card/40 backdrop-blur-sm border border-dark-border/50 rounded-2xl">
              <div className="relative">
                <div className="absolute inset-0 bg-dark-accent blur-md opacity-30 animate-pulse"></div>
                <div className="relative w-2 h-2 bg-dark-accent rounded-full"></div>
              </div>
              <span className="text-xs text-dark-text-muted font-light">Sistema Ativo</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

