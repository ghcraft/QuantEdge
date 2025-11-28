"use client";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon - Gráfico Sofisticado com Múltiplos Elementos */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Glow Effects Múltiplos */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-accent/30 to-dark-info/30 blur-xl opacity-60 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-dark-accent/20 via-transparent to-dark-info/20 blur-lg opacity-40"></div>
        
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-[0_0_20px_rgba(0,255,136,0.3)]"
        >
          {/* Background Hexagon (Geometric Trading Symbol) */}
          <path
            d="M 24 4 L 40 12 L 40 28 L 24 36 L 8 28 L 8 12 Z"
            stroke="url(#logoGradient1)"
            strokeWidth="0.8"
            fill="url(#logoGradientBg)"
            opacity="0.15"
          />
          
          {/* Grid Pattern (Trading Chart Reference) */}
          <defs>
            <pattern id="gridPattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 L 0 8" fill="none" stroke="url(#logoGradientGrid)" strokeWidth="0.3" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="48" height="48" fill="url(#gridPattern)" opacity="0.3"/>
          
          {/* Main Chart Line - Tendência Ascendente Forte */}
          <path
            d="M 8 36 Q 14 30 20 24 T 32 16 T 40 10"
            stroke="url(#logoGradient2)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#glow)"
          />
          
          {/* Área Preenchida sob o Gráfico */}
          <path
            d="M 8 36 Q 14 30 20 24 T 32 16 T 40 10 L 40 36 Z"
            fill="url(#logoGradientArea)"
            opacity="0.25"
          />
          
          {/* Pontos de Dados no Gráfico */}
          <circle cx="14" cy="30" r="2" fill="url(#logoGradient3)" opacity="0.8"/>
          <circle cx="20" cy="24" r="2" fill="url(#logoGradient3)" opacity="0.8"/>
          <circle cx="26" cy="20" r="2.5" fill="url(#logoGradient3)" opacity="0.9"/>
          <circle cx="32" cy="16" r="2" fill="url(#logoGradient3)" opacity="0.8"/>
          
          {/* Edge Point - Destaque Principal com Anel */}
          <circle
            cx="40"
            cy="10"
            r="4.5"
            fill="url(#logoGradient3)"
            filter="url(#glow)"
            className="animate-pulse"
          />
          <circle
            cx="40"
            cy="10"
            r="3"
            fill="url(#logoGradient4)"
          />
          <circle
            cx="40"
            cy="10"
            r="6"
            stroke="url(#logoGradient3)"
            strokeWidth="1"
            fill="none"
            opacity="0.4"
            className="animate-ping"
          />
          
          {/* Linha de Suporte Horizontal */}
          <path
            d="M 8 36 L 40 36"
            stroke="url(#logoGradient5)"
            strokeWidth="1"
            strokeDasharray="3 2"
            opacity="0.5"
          />
          
          {/* Linha de Resistência (Diagonal Superior) */}
          <path
            d="M 8 10 L 40 4"
            stroke="url(#logoGradient6)"
            strokeWidth="0.8"
            strokeDasharray="2 2"
            opacity="0.3"
          />
          
          {/* Indicador de Volume (Barras) */}
          <rect x="10" y="32" width="2" height="4" fill="url(#logoGradient7)" opacity="0.6" rx="0.5"/>
          <rect x="14" y="28" width="2" height="8" fill="url(#logoGradient7)" opacity="0.7" rx="0.5"/>
          <rect x="18" y="26" width="2" height="10" fill="url(#logoGradient7)" opacity="0.8" rx="0.5"/>
          <rect x="22" y="22" width="2" height="14" fill="url(#logoGradient7)" opacity="0.9" rx="0.5"/>
          <rect x="26" y="18" width="2" height="18" fill="url(#logoGradient7)" opacity="1" rx="0.5"/>
          
          {/* Gradients e Filtros */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <linearGradient id="logoGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#00aaff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00ff88" stopOpacity="0.4" />
            </linearGradient>
            
            <linearGradient id="logoGradientBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#00aaff" stopOpacity="0.1" />
            </linearGradient>
            
            <linearGradient id="logoGradientGrid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00aaff" stopOpacity="0.2" />
            </linearGradient>
            
            <linearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.7" />
              <stop offset="30%" stopColor="#00ff88" stopOpacity="1" />
              <stop offset="70%" stopColor="#00aaff" stopOpacity="1" />
              <stop offset="100%" stopColor="#00aaff" stopOpacity="0.9" />
            </linearGradient>
            
            <linearGradient id="logoGradientArea" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#00aaff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00ff88" stopOpacity="0.1" />
            </linearGradient>
            
            <linearGradient id="logoGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" />
              <stop offset="50%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#00aaff" />
            </linearGradient>
            
            <linearGradient id="logoGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00ff88" stopOpacity="0.8" />
            </linearGradient>
            
            <linearGradient id="logoGradient5" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00aaff" stopOpacity="0.5" />
            </linearGradient>
            
            <linearGradient id="logoGradient6" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00aaff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00ff88" stopOpacity="0.4" />
            </linearGradient>
            
            <linearGradient id="logoGradient7" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00aaff" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Texto do Logo com Efeitos Melhorados */}
      {showText && (
        <div className="relative flex items-center space-x-2">
          <div className="absolute inset-0 bg-gradient-to-r from-dark-accent/15 via-dark-info/15 to-dark-accent/15 blur-xl opacity-60"></div>
          <div className={`relative font-black bg-gradient-to-r from-dark-accent via-dark-info to-dark-accent bg-clip-text text-transparent ${textSizes[size]} tracking-tight drop-shadow-[0_0_20px_rgba(0,255,136,0.2)]`}>
            QUANT<span className="text-dark-accent">EDGE</span>
          </div>
          <span className={`relative inline-flex items-center px-2 py-0.5 rounded-md bg-gradient-to-r from-dark-accent/25 via-dark-info/25 to-dark-accent/25 border border-dark-accent/60 ${size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-sm'} font-bold text-dark-accent tracking-wider uppercase shadow-[0_0_12px_rgba(0,255,136,0.4)] backdrop-blur-sm`}>
            <span className="absolute inset-0 bg-gradient-to-r from-dark-accent/10 via-transparent to-dark-info/10 rounded-md animate-pulse"></span>
            <span className="relative">PRO</span>
          </span>
        </div>
      )}
    </div>
  );
}

