/**
 * Plugin Tailwind para suportar prefixo light:
 * Permite usar light:bg-light-* assim como dark:bg-dark-*
 */
module.exports = function({ addVariant }) {
  // Adiciona variante light: que funciona quando .light está no HTML
  addVariant('light', '.light &');
};

