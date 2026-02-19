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
        background: {
          base: "var(--color-background-base)",
          elevated: "var(--color-background-elevated)",
          card: "var(--color-background-card)",
          "card-hover": "var(--color-background-card-hover)",
          overlay: "var(--color-background-overlay)",
        },
        border: {
          subtle: "var(--color-border-subtle)",
          default: "var(--color-border-default)",
          ornate: "var(--color-border-ornate)",
          glow: "var(--color-border-glow)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
        },
        accent: {
          gold: "var(--color-accent-gold)",
          "gold-light": "var(--color-accent-gold-light)",
          "gold-dark": "var(--color-accent-gold-dark)",
        },
        pin: {
          city: "var(--color-pin-city)",
          village: "var(--color-pin-village)",
          poi: "var(--color-pin-poi)",
          character: "var(--color-pin-character)",
          dungeon: "var(--color-pin-dungeon)",
          shop: "var(--color-pin-shop)",
          quest: "var(--color-pin-quest)",
          treasure: "var(--color-pin-treasure)",
        },
        faction: {
          light: "var(--color-faction-light)",
          dark: "var(--color-faction-dark)",
          nature: "var(--color-faction-nature)",
          fire: "var(--color-faction-fire)",
          ice: "var(--color-faction-ice)",
        },
        rarity: {
          common: "var(--color-rarity-common)",
          uncommon: "var(--color-rarity-uncommon)",
          rare: "var(--color-rarity-rare)",
          epic: "var(--color-rarity-epic)",
          legendary: "var(--color-rarity-legendary)",
        },
        status: {
          success: "var(--color-status-success)",
          warning: "var(--color-status-warning)",
          error: "var(--color-status-error)",
          info: "var(--color-status-info)",
        },
        // Crown of Ashes colors (from CSS vars)
        void: "var(--color-void)",
        obsidian: "var(--color-obsidian)",
        stone: "var(--color-stone)",
        iron: "var(--color-iron)",
        bone: {
          DEFAULT: "var(--color-bone)",
          dark: "var(--color-bone-dark)",
        },
        blood: {
          DEFAULT: "var(--color-blood)",
          bright: "var(--color-blood-bright)",
        },
        parchment: "var(--color-parchment)",
      },
      fontFamily: {
        display: "var(--font-display)",
        "display-ornate": "var(--font-display-ornate)",
        body: "var(--font-body)",
        fell: "var(--font-fell)",
        mono: "var(--font-mono)",
      },
      animation: {
        "rune-glow": "rune-glow 4s ease-in-out infinite",
        "crown-float": "crown-float 6s ease-in-out infinite",
        "seal-pulse": "seal-pulse 3s ease-in-out infinite",
        "drip": "drip 3s ease-in infinite",
        "blood-pulse": "blood-pulse 2s ease-in-out infinite",
        "void-fade": "void-fade 0.5s forwards",
        "oath-reveal": "oath-reveal 1s forwards",
        // Polish Phase 3 animations
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "slide-left": "slide-left 0.3s ease-out",
        "slide-right": "slide-right 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "scale-out": "scale-out 0.15s ease-in",
        "shimmer": "shimmer 1.5s infinite",
        "bounce-in": "bounce-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "slide-and-fade": "slide-and-fade 0.3s ease-out",
      },
      keyframes: {
        "rune-glow": {
          "0%, 100%": { opacity: "0.3", textShadow: "none" },
          "50%": { opacity: "0.8", textShadow: "0 0 10px #c9a227" },
        },
        "crown-float": {
          "0%, 100%": { transform: "translateY(0) rotate(0)" },
          "50%": { transform: "translateY(-10px) rotate(2deg)" },
        },
        "seal-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201, 162, 39, 0.3)" },
          "50%": { boxShadow: "0 0 0 20px rgba(201, 162, 39, 0)" },
        },
        drip: {
          "0%": { height: "0", opacity: "0" },
          "50%": { height: "80px", opacity: "1" },
          "100%": { height: "80px", opacity: "0", transform: "translateY(50px)" },
        },
        "blood-pulse": {
          "0%, 100%": { opacity: "1", transform: "translateY(0)" },
          "50%": { opacity: "0.7", transform: "translateY(-5px)" },
        },
        "void-fade": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "oath-reveal": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        // Polish Phase 3 keyframes
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-left": {
          "0%": { transform: "translateX(10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-right": {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "scale-out": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-and-fade": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      spacing: {
        xxs: "var(--spacing-xxs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        "2xl": "var(--spacing-2xl)",
        "3xl": "var(--spacing-3xl)",
        "4xl": "var(--spacing-4xl)",
        "5xl": "var(--spacing-5xl)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      zIndex: {
        "35": "35",
        "60": "60",
      },
    },
  },
};

export default config;
