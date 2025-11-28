/**
 * Utility functions for theme-aware styling
 */

export function themeClass(lightClass: string, darkClass: string): string {
  // Retorna classes que funcionam com ambos os temas
  // O Tailwind vai aplicar baseado na classe do HTML
  return `${darkClass} light:${lightClass}`;
}

/**
 * Classes comuns para componentes que precisam suportar ambos os temas
 */
export const themeColors = {
  bg: "bg-dark-bg light:bg-light-bg",
  bgSecondary: "bg-dark-bg-secondary light:bg-light-bg-secondary",
  card: "bg-dark-card light:bg-light-card",
  cardHover: "bg-dark-card-hover light:bg-light-card-hover",
  border: "border-dark-border light:border-light-border",
  text: "text-dark-text light:text-light-text",
  textPrimary: "text-dark-text-primary light:text-light-text-primary",
  textMuted: "text-dark-text-muted light:text-light-text-muted",
  accent: "text-dark-accent light:text-light-accent",
  bgAccent: "bg-dark-accent light:bg-light-accent",
};

