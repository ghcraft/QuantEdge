/**
 * Componente de Skeleton Loading
 * Exibe placeholders animados enquanto as notícias carregam
 * Cria uma experiência visual agradável durante o carregamento
 */
export default function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Renderiza 3 skeletons */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-dark-card border border-dark-border rounded-lg p-6 animate-pulse-slow"
        >
          {/* Skeleton do header (fonte e data) */}
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 w-24 bg-dark-border rounded"></div>
            <div className="h-3 w-32 bg-dark-border rounded"></div>
          </div>

          {/* Skeleton do título */}
          <div className="space-y-2 mb-3">
            <div className="h-5 w-full bg-dark-border rounded"></div>
            <div className="h-5 w-3/4 bg-dark-border rounded"></div>
          </div>

          {/* Skeleton da descrição */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-dark-border rounded"></div>
            <div className="h-3 w-5/6 bg-dark-border rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

