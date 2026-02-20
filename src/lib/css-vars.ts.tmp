/**
 * Helper functions for Tailwind CSS v4 CSS variables
 * Makes it easier to use CSS variables in JSX/TSX
 */

export const cssVars = {
  // Background colors
  backgroundBase: 'var(--color-background-base)',
  backgroundElevated: 'var(--color-background-elevated)',
  backgroundCard: 'var(--color-background-card)',
  backgroundCardHover: 'var(--color-background-card-hover)',

  // Border colors
  borderSubtle: 'var(--color-border-subtle)',
  borderDefault: 'var(--color-border-default)',
  borderOrnate: 'var(--color-border-ornate)',

  // Text colors
  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  textMuted: 'var(--color-text-muted)',

  // Accent colors
  accentGold: 'var(--color-accent-gold)',
  accentGoldLight: 'var(--color-accent-gold-light)',
  accentGoldDark: 'var(--color-accent-gold-dark)',

  // Pin colors
  pinCity: 'var(--color-pin-city)',
  pinVillage: 'var(--color-pin-village)',
  pinPoi: 'var(--color-pin-poi)',
  pinCharacter: 'var(--color-pin-character)',
  pinDungeon: 'var(--color-pin-dungeon)',
  pinShop: 'var(--color-pin-shop)',
  pinQuest: 'var(--color-pin-quest)',
  pinTreasure: 'var(--color-pin-treasure)',

  // Faction colors
  factionLight: 'var(--color-faction-light)',
  factionDark: 'var(--color-faction-dark)',
  factionNature: 'var(--color-faction-nature)',
  factionFire: 'var(--color-faction-fire)',
  factionIce: 'var(--color-faction-ice)',
} as const;

/**
 * Generate Tailwind arbitrary value for CSS variable
 */
export function cssVar(name: keyof typeof cssVars) {
  return cssVars[name];
}
