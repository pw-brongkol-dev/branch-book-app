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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    animation: {
      ripple: 'ripple 0.5s linear',
    },
    keyframes: {
      ripple: {
        '0%': { transform: 'scale(0)', opacity: '0.5' },
        '100%': { transform: 'scale(4)', opacity: '0' },
      },
    },
  },
  plugins: [],
};
export default config;
