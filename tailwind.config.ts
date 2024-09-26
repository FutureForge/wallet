import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)", ...fontFamily.sans],
      },
      colors: {
        primary: "#3C3C434A",
        background: "#000000",
        "sec-bg": "#252525",
        "sec-btn": "#5856D6",
        "muted-foreground": "#999999",
        foreground: "#F5F5F5",
        special: "#5856D6",
        "special-bg": "#1B1F26B8",
        "dialog-border": "#2C2C2C",
      },
    },
  },
  plugins: [],
};
export default config;
