import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          950: "#090D11",
          900: "#0E1318",
          850: "#141A20",
          800: "#1A232B",
          750: "#222D37",
          700: "#2B3945",
          600: "#3D4F5E",
          500: "#546A7D",
          400: "#758DA0",
          300: "#A2B6C5",
          200: "#CFDCE5",
          100: "#E9F0F4",
          50: "#F4F7F9",
        },
        darkbg: {
          DEFAULT: "#0D1117",
          card: "#151B23",
          cardHover: "#1C242E",
          border: "#26303B",
          subtle: "#303E4D",
        },
        // Calm, dignified earth tone (Warm Terracotta / Clay) - no more bright loud orange!
        accent: {
          500: "#B85D3B",
          600: "#9E4E30",
          700: "#823E24",
          400: "#C97353",
          300: "#DC9478",
          100: "#F6DDD3",
          50: "#FAF2EE",
        },
        sage: {
          600: "#365950",
          500: "#446E63",
          400: "#56877B",
          100: "#E6ECE9",
          50: "#F2F6F4",
        },
      },
      fontFamily: {
        sans: ["var(--font-tajawal)", "Tajawal", "Cairo", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
