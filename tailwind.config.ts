import type { Config } from "tailwindcss";

const config: Config = {
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
  plugins: [],
};
export default config;

