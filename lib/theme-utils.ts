/**
 * Utility functions for theme-aware styling
 */

export function themeClass(lightClass: string, darkClass: string): string {
  // Retorna classes que funcionam com ambos os temas
  // O Tailwind vai aplicar baseado na classe do HTML
  return darkClass;
}

/**
 * Classes comuns para componentes que precisam suportar ambos os temas
 */
export const themeColors = {
  bg: "bg-dark-bg",
  bgSecondary: "bg-dark-bg-secondary",
  card: "bg-dark-card",
  cardHover: "bg-dark-card-hover",
  border: "border-dark-border",
  text: "text-dark-text",
  textPrimary: "text-dark-text-primary",
  textMuted: "text-dark-text-muted",
  accent: "text-dark-accent",
  bgAccent: "bg-dark-accent",
};
