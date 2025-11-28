"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary para capturar erros de renderização
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary capturou um erro:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-dark-bg flex items-center justify-center relative" style={{ position: 'relative', zIndex: 1 }}>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-dark-text-primary mb-4">
                Algo deu errado
              </h1>
              <p className="text-dark-text-muted mb-4">
                {this.state.error?.message || "Ocorreu um erro inesperado"}
              </p>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                  window.location.reload();
                }}
                className="px-4 py-2 bg-dark-accent text-dark-bg rounded-lg hover:bg-dark-accent-hover transition-colors"
              >
                Recarregar página
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

