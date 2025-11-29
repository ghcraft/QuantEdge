/**
 * Utility functions for theme-aware styling
 * Suporta modo claro estilo Google e modo escuro
 */

export function themeClass(lightClass: string, darkClass: string): string {
  // Retorna classes que funcionam com ambos os temas
  // O Tailwind vai aplicar baseado na classe do HTML (dark ou light)
  return `${darkClass} ${lightClass}`;
}

/**
 * Classes comuns para componentes que precisam suportar ambos os temas
 * Estilo Google para modo claro
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
  textSecondary: "text-dark-text-secondary light:text-light-text-secondary",
  accent: "text-dark-accent light:text-light-accent",
  bgAccent: "bg-dark-accent light:bg-light-accent",
  success: "text-dark-success light:text-light-success",
  bgSuccess: "bg-dark-success light:bg-light-success",
  danger: "text-dark-danger light:text-light-danger",
  bgDanger: "bg-dark-danger light:bg-light-danger",
  info: "text-dark-info light:text-light-info",
  bgInfo: "bg-dark-info light:bg-light-info",
};

/**
 * Helper para criar classes de tema condicionais
 * Retorna classes baseadas no tema atual
 */
export function getThemeClasses(theme: "dark" | "light") {
  const prefix = theme === "dark" ? "dark" : "light";
  return {
    bg: `${prefix}-bg`,
    bgSecondary: `${prefix}-bg-secondary`,
    card: `${prefix}-card`,
    cardHover: `${prefix}-card-hover`,
    border: `${prefix}-border`,
    text: `${prefix}-text`,
    textPrimary: `${prefix}-text-primary`,
    textMuted: `${prefix}-text-muted`,
    accent: `${prefix}-accent`,
    success: `${prefix}-success`,
    danger: `${prefix}-danger`,
    info: `${prefix}-info`,
  };
}
