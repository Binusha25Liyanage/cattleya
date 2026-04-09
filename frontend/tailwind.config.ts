import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./store/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E2C97E",
          dark: "#9B7A2F",
        },
        cattleya: {
          black: "#0A0A0A",
          offwhite: "#F5F0E8",
          purple: "#7B2FBE",
          teal: "#00C9A7",
          pink: "#FF6B9D",
          muted: "#6B6B6B",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(201,168,76,0.22), 0 12px 40px rgba(10,10,10,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
