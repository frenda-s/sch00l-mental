import type { Config } from "tailwindcss";

/**
 * Color Scheme:
 * --black: #080705
 * --charcoal-blue: #40434e
 * --wine-plum: #702632
 * --burnt-rose: #912f40
 * --porcelain: #fffffa
 */
export default {
  content: ["./index.html", "./src/client/**/*.{vue,ts}"],
  theme: {
    extend: {
      colors: {
        black: "#080705",
        "charcoal-blue": "#40434e",
        "wine-plum": "#702632",
        "burnt-rose": "#912f40",
        porcelain: "#fffffa",

        // Tương thích các token trước
        "inkwell-navy": "#080705",
        "coral-emphasis": "#912f40",
        "mint-pulse": "#702632",
        "butter-yellow": "#40434e",
        graphite: "#40434e",
        slate: "#40434e",
        "ash-canvas": "#fffffa",
        "paper-white": "#ffffff",
        "warm-stone": "#e8e5dc",

        primary: {
          DEFAULT: "#702632",
          50: "#fffffa",
          100: "#f5e8ea",
          500: "#702632",
          600: "#581d27",
          700: "#41141c",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "'Baloo 2'",
          "'Inter'",
          "sans-serif",
        ],
      },
      boxShadow: {
        subtle: "rgba(8, 7, 5, 0.08) 0px 1px 3px 0px, rgba(8, 7, 5, 0.04) 0px 1px 2px 0px",
        sm: "rgba(8, 7, 5, 0.08) 0px 4px 6px -1px, rgba(8, 7, 5, 0.04) 0px 2px 4px -1px",
        "warm-stone": "rgba(64, 67, 78, 0.12) 0px 1px 4px 0px",
      },
      borderRadius: {
        card: "16px",
        feature: "24px",
      },
      letterSpacing: {
        tightest: "-0.01em",
        display: "-0.01em",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
