"use client";

/**
 * Hero Scene com efeitos de partículas CSS (sem Three.js)
 * Versão simplificada e compatível com React 18
 */
export default function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none overflow-hidden">
      {/* Partículas animadas com CSS */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-dark-accent rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>
      
      {/* Gradiente animado de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-accent/10 via-transparent to-dark-info/10 animate-gradient-x" />
    </div>
  );
}

