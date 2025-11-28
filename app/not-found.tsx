"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    // Força renderização dinâmica
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-dark-text-primary mb-4">404</h1>
        <p className="text-dark-text-muted mb-8">Página não encontrada</p>
        <Link
          href="/"
          className="px-6 py-3 bg-dark-accent text-dark-bg rounded-lg hover:bg-dark-accent-hover transition-colors"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}

