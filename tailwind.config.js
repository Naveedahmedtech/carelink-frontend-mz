/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand + core
        primary: "var(--color-primary)",
        hover: "var(--color-hover)",

        // Backgrounds
        background: "var(--color-background)",
        backgroundShade1: "var(--color-background-shade-1)",
        backgroundShade2: "var(--color-background-shade-2)",

        // Text
        text: "var(--color-text)",
        textDark: "var(--color-text-dark)",
        textHover: "var(--color-text-hover)",
        textSecondary: "var(--color-text-secondary)",
        textMuted: "var(--color-text-muted)",

        // Border + shadow
        border: "var(--color-border)",
        shadow: "var(--color-shadow)",

        // Status / semantic
        pending: "var(--color-pending)",
        success: "var(--color-success)",
        todo: "var(--color-todo)",
        error: "var(--color-error)",

        // Skeletons
        skeleton: "var(--color-animated-post-skeleton)",
      },
      keyframes: {
        progress: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        "progress-running": "progress 5s linear forwards",
      },
    },
  },
  plugins: [typography],
};

export default config;
