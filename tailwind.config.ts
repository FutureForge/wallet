import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
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
        primaryBg: "#010105",
        card: "#0b0b0b",
        border: "#2A2A2A",
        divider: "#111111",
        accent: "#7E6CFF",
        primaryText: "#fff",
        secondaryText: "#6C6C6C",
        volatile: "#D14086",
        // new-colors for the new design please not remove
        "new-background": "#000",
        "new-secondary": "#08080A",
        "new-terciary": "#101010",
        "new-border": "#181818",
        "new-elements": "#181818",
        "new-elements-border": "#212121",
        "new-elements-hover": "#212121",
        "new-accent": "#644AEE",
        "new-accent-dark": "#131124",
        "new-accent-light": "#6B59E5",
        "new-success": "#23BA97",
        "new-error": "#FB3748",
        "new-error-btn": "#F62B54",
        "new-warning": "#E3A006",
        "new-foreground": "#fff",
        "new-muted-foreground": "#6C6C6C",
        "new-placeholder": "#6C6C6C",
      },
      keyframes: {
        overlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        overlayHide: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        dialogShow: {
          from: { opacity: "0", transform: "translateY(8px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        dialogHide: {
          from: { opacity: "1", transform: "translateY(0) scale(1)" },
          to: { opacity: "0", transform: "translateY(8px) scale(0.97)" },
        },
        caretBlink: {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        slideDownAndFade: {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(4px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: "0", transform: "translateX(-4px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "overlay-show": "overlayShow 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        "overlay-hide": "overlayHide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "dialog-show": "dialogShow 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        "dialog-hide": "dialogHide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "caret-blink": "caretBlink 1.2s ease-out infinite",
        slideDownAndFade:
          "slideDownAndFade 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 500ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
