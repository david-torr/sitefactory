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
        primary: "#000000",
        accent: "#000000",
        background: "#FFFFFF",
        "text-color": "#171717",
        brand: { DEFAULT: "#000000" },
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
        feedback: {
          success: "#16A34A",
          warning: "#D97706",
          error: "#DC2626",
          info: "#2563EB",
        },
      },
      fontFamily: {
        display: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        body: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
      },
      fontSize: {
        display: ["60px", { fontWeight: "700", lineHeight: "1" }],
        h1: ["60px", { fontWeight: "700", lineHeight: "1" }],
        h2: ["40px", { fontWeight: "700", lineHeight: "1" }],
        h3: ["20px", { fontWeight: "700", lineHeight: "1" }],
        "body-lg": ["18px", { fontWeight: "400", lineHeight: "1.5" }],
        body: ["16px", { fontWeight: "400", lineHeight: "1.5" }],
        "body-sm": ["14px", { fontWeight: "400", lineHeight: "1.5" }],
        label: ["14px", { fontWeight: "600", lineHeight: "1" }],
        caption: ["11px", { fontWeight: "600", lineHeight: "1" }],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        base: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        full: "9999px",
        button: "6px",
        card: "8px",
      },
      spacing: {
        "space-1": "4px",
        "space-2": "8px",
        "space-3": "12px",
        "space-4": "16px",
        "space-5": "20px",
        "space-6": "24px",
        "space-8": "32px",
        "space-10": "40px",
        "space-12": "48px",
        "space-16": "64px",
        "space-20": "80px",
      },
    },
  },
  plugins: [],
};

export default config;
