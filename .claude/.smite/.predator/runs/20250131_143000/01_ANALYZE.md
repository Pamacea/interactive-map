# 01_ANALYZE - Context Gathering

## Global Design Theme (Idea Global)

### Color System - Crown of Ashes Theme
- **Void**: `#0a0908` - Base background (darkest)
- **Obsidian**: `#121210` - Elevated surfaces
- **Stone**: `#1a1915` - Card backgrounds
- **Iron**: `#2a2820` - Borders
- **Bone**: `#d4c5a9` - Primary text
- **Bone Dark**: `#9a8b6f` - Secondary text
- **Blood**: `#6b1010` - Accent/Error color
- **Gold Accent**: `#d4af37` - Primary interactive element

### Typography
- **Display**: `Cinzel` (serif) - Headings
- **Display Ornate**: `Cinzel Decorative` - Decorative titles
- **Body**: `Inter` - Body text
- **Fell**: `IM Fell English` - Fantasy-themed text

### Animations
- `animate-rune-glow` - Pulsing glow effect for runes
- `animate-crown-float` - Floating animation
- `animate-seal-pulse` - Pulsing seal

### Background Elements
- **Grain Overlay**: `bg-grain` with opacity 0.04
- **Grid Background**: Golden grid with 0.03 opacity
- **Floating Particles**: Canvas-based particle system

---

## Pages Status

### Fully Styled (Home Pattern)
- ✅ page.tsx - Complete with nav, animations, particles
- ✅ create/page.tsx - Grid + particles background
- ✅ explore/page.tsx - Grid + particles background

### Partially Styled (Need Updates)
- ⚠️ worlds/page.tsx - Has theme, missing background effects
- ⚠️ settings/page.tsx - Basic theme, no background
- ⚠️ auth/signin/page.tsx - Has grain, missing other effects
- ⚠️ about/page.tsx - Basic theme, no background effects

---

## Component Patterns to Refactor

### 1. Page Background Wrapper
Should include:
- Fixed grain overlay
- Grid background component
- Floating particles component

### 2. Page Headers
Standard pattern needed:
- Rune decorative prefix
- Small label (tracking-[0.3em])
- Large ornate title (text-accent-gold)
- Description (font-fell)

### 3. Fantasy Cards
Enhanced hover effects with:
- Gold border transition
- Subtle lift effect
- Icon glow

---

## Files to Modify

| File | Changes Needed |
|------|----------------|
| src/app/worlds/page.tsx | Add grid + particles background |
| src/app/settings/page.tsx | Add background, enhance cards |
| src/app/auth/signin/page.tsx | Add grid + particles |
| src/app/about/page.tsx | Add background effects |

---

## Reusable Components to Create

1. **PageBackground** - Combines grain, grid, particles
2. **PageHeader** - Standardized page header with runes
3. **FantasyCard** - Themed card with hover effects
4. **EmptyState** - Styled empty state with call-to-action
