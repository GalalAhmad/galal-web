import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: "#081A24",
          800: "#0F2D3C",
          700: "#18455A",
          600: "#225D78",
          100: "#E6EFF4",
          50: "#F4F8FA",
        },
        accent: {
          500: "#FF5B22",
          600: "#E04812",
          50: "#FFF5F2",
        },
        sage: {
          600: "#3D635A",
          500: "#4E7B70",
          100: "#E8F0EE",
          50: "#F4F7F6",
        },
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "Cairo", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
