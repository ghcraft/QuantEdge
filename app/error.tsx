"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Força renderização dinâmica
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-dark-text-primary mb-4">500</h1>
        <p className="text-dark-text-muted mb-4">Algo deu errado</p>
        <p className="text-dark-text-muted/60 mb-8 text-sm">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-dark-accent text-dark-bg rounded-lg hover:bg-dark-accent-hover transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

