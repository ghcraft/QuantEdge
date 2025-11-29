import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // Usa classe para dark mode
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark elegante com cores vivas
        dark: {
          bg: "#000000",
          "bg-secondary": "#050505",
          card: "#0a0a0a",
          "card-hover": "#111111",
          border: "#1a1a1a",
          "border-light": "#252525",
          text: "#ffffff",
          "text-primary": "#ffffff",
          "text-muted": "#888888",
          "text-secondary": "#555555",
          accent: "#00ff88",
          "accent-hover": "#00cc6f",
          success: "#00ff88",
          "success-light": "#33ffaa",
          danger: "#ff3366",
          "danger-light": "#ff5588",
          warning: "#ffaa00",
          "warning-light": "#ffbb33",
          info: "#00aaff",
          "info-light": "#33bbff",
          purple: "#aa00ff",
          "purple-light": "#bb33ff",
          pink: "#ff0088",
          "pink-light": "#ff33aa",
          cyan: "#00ffff",
          "cyan-light": "#33ffff",
          neon: "#00ff88",
          "neon-blue": "#00aaff",
          "neon-purple": "#aa00ff",
        },
        // Light theme - Estilo Google profissional
        light: {
          bg: "#ffffff",
          "bg-secondary": "#f8f9fa",
          card: "#ffffff",
          "card-hover": "#f1f3f4",
          border: "#dadce0",
          "border-light": "#e8eaed",
          text: "#202124",
          "text-primary": "#202124",
          "text-muted": "#5f6368",
          "text-secondary": "#80868b",
          accent: "#1a73e8",
          "accent-hover": "#1557b0",
          success: "#34a853",
          "success-light": "#4caf50",
          danger: "#ea4335",
          "danger-light": "#f44336",
          warning: "#fbbc04",
          "warning-light": "#ff9800",
          info: "#1a73e8",
          "info-light": "#4285f4",
        },
      },
      animation: {
        // Animações suaves para entrada de notícias
        "slide-in": "slideIn 0.5s ease-out",
        "fade-in": "fadeIn 0.6s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient": "gradient 3s ease infinite",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
    },
  },
  plugins: [
    require('./tailwind-plugin-light-mode'),
  ],
};
export default config;

