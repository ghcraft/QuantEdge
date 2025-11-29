"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CompactSearchBar from "./CompactSearchBar";
import AuthMenu from "./AuthMenu";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

/**
 * Componente de Navegação Principal
 * Navegação elegante com abas e efeitos visuais
 */
export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

      const navItems = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/cotacoes", label: "Cotações" },
        { href: "/analises", label: "Análises" },
        { href: "/portfolio", label: "Portfolio" },
        { href: "/favoritos", label: "Favoritos" },
        { href: "/noticias", label: "Notícias" },
      ];

  return (
    <nav className="border-b border-dark-border light:border-light-border bg-dark-bg-secondary/80 light:bg-light-bg-secondary/80 backdrop-blur-md sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo e Nome */}
          <Link href="/dashboard" className="group">
            <Logo size="md" showText={true} className="group-hover:opacity-90 transition-opacity" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            <CompactSearchBar />
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative px-5 py-2.5 text-sm font-semibold rounded-lg
                    transition-all duration-300
                    ${
                      isActive
                        ? "text-dark-accent light:text-light-accent bg-dark-accent/10 light:bg-light-accent/10"
                        : "text-dark-text-muted light:text-light-text-muted hover:text-dark-text-primary light:hover:text-light-text-primary hover:bg-dark-card light:hover:bg-light-card"
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-gradient-to-r from-dark-accent/20 light:from-light-accent/20 to-transparent rounded-lg blur-sm"></span>
                  )}
                  <span className="relative">{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-dark-accent light:from-light-accent to-dark-info light:to-light-info"></span>
                  )}
                </Link>
              );
            })}

            {/* Theme Toggle e Auth Menu */}
            <div className="ml-3 pl-3 border-l border-dark-border light:border-light-border flex items-center gap-3">
              <ThemeToggle />
              <AuthMenu />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-dark-text light:text-light-text p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden py-4 space-y-2 animate-fade-in">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`
                        block px-4 py-3 rounded-lg text-sm font-semibold
                        transition-all duration-300
                        ${
                          isActive
                            ? "text-dark-accent light:text-light-accent bg-dark-accent/10 light:bg-light-accent/10"
                            : "text-dark-text-muted light:text-light-text-muted hover:text-dark-text light:hover:text-light-text hover:bg-dark-card light:hover:bg-light-card"
                        }
                      `}
                    >
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                
                {/* Mobile Theme Toggle e Auth */}
                <div className="pt-4 border-t border-dark-border light:border-light-border mt-4">
                  <div className="px-4 flex items-center justify-between">
                    <ThemeToggle />
                    <AuthMenu />
                  </div>
                </div>
              </div>
            )}
      </div>
    </nav>
  );
}

