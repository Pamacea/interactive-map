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
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-mono)",
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
    },
  },
};

export default config;
