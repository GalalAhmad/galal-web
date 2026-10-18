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
        accent: {
          500: "#FF5B22",
          600: "#E04812",
          50: "#FFF5F2",
        },
        sage: {
          600: "#3D635A",
          500: "#4E7B70",
          400: "#63978B",
          100: "#E8F0EE",
          50: "#F4F7F6",
        },
      },
      fontFamily: {
        sans: ["var(--font-tajawal)", "Tajawal", "Cairo", "system-ui", "sans-serif"],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
