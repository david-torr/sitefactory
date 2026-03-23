import type { Config } from "tailwindcss";
import tokens from "./tokens/tokens.json";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: tokens.colors.primary,
        accent: tokens.colors.accent,
        background: tokens.colors.background,
        "text-color": tokens.colors.text,
        neutral: tokens.colors.neutral,
      },
      fontFamily: {
        display: ["var(--font-dm-sans)", tokens.typography.fontFamily.display, "sans-serif"],
        body: ["var(--font-dm-sans)", tokens.typography.fontFamily.body, "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
