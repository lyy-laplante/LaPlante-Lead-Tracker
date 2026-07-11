import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F3F1EC",
        surface: "#FFFFFF",
        ink: "#1B2430",
        muted: "#6B7280",
        primary: {
          DEFAULT: "#2C4A5E",
          dark: "#1E3444",
          light: "#3E6480",
        },
        accent: {
          DEFAULT: "#B8863E",
          light: "#D8B372",
        },
        overdue: "#A23B2E",
        due: "#B8863E",
        waiting: "#6B7280",
        scheduled: "#2F7A4F",
        lost: "#9CA3AF",
      },
      fontFamily: {
        display: ["Source Serif 4", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
