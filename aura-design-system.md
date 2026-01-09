# Aura Design System - Realm Forge

**Version:** 1.0.0
**Status:** Production Ready
**Last Updated:** 2026-01-09

---

## Design Philosophy

### Core Principles

**1. Hierarchy as Parent-Child Relationship**
- Parent elements establish context through density and spacing
- Child elements inherit visual weight from their containers
- Each level reduces in visual prominence (H1 → H2 → body)

**2. Density as Narrative**
- **Low Density** = Premium, prestigious, important (hero, pricing)
- **Medium Density** = Functional, interactive (features, content)
- **High Density** = Data-heavy, utilitarian (tables, dashboards)

**3. Depth Through Layering**
- No visible box-shadows (cheap/tacky appearance)
- Use layered blur glows for depth (3+ layers)
- Radial gradients create focal points
- Opacity variations suggest elevation

**4. Metallic Sophistication**
- Gold base: #D4AF37 (historically accurate metallic gold)
- Gradient shifts: gold → yellow → gold
- Shimmer effects on hover (1000ms sweep)
- Subtle highlights, not overpowering

**5. Motion Budget**
- Total budget: 150-250ms per interaction
- Exceptions: Hero ambient animations (6-8s cycles)
- Hover states: 200ms (fast, responsive)
- Page transitions: 300ms (smooth, not sluggish)

---

## Color Palette

### Surface Colors (Semantic)

```css
--color-background-base      #0a0e13  /* Deep space black */
--color-background-elevated  #141a1f  /* Cards, raised surfaces */
--color-background-card      #1a2228  /* Interactive elements */
--color-background-overlay   rgba(10, 14, 19, 0.95)  /* Modals */
```

### Border Colors

```css
--color-border-subtle   rgba(255, 255, 255, 0.08)   /* Minimal */
--color-border-default  rgba(255, 255, 255, 0.12)   /* Standard */
--color-border-ornate   rgba(212, 175, 55, 0.3)     /* Gold accent */
--color-border-glow     rgba(212, 175, 55, 0.15)    /* Soft glow */
```

### Text Colors (Semantic)

```css
--color-text-primary   #e8e6e3  /* Headlines, important */
--color-text-secondary #a8a49e  /* Body, descriptions */
--color-text-muted     #6b6862  /* Meta, timestamps */
--color-text-inverse   #0a0e13  /* On dark backgrounds */
```

### Accent Colors (Metallic Gold)

```css
--color-accent-gold       #d4af37  /* Base metallic */
--color-accent-gold-light #f4d47c  /* Highlight */
--color-accent-gold-dark  #b8931f  /* Shadow */
```

### Pin Types (Map Markers)

```css
--color-pin-city       #c9a227  /* Urban centers */
--color-pin-village    #8b7355  /* Small settlements */
--color-pin-poi        #4a9eff  /* Points of interest */
--color-pin-character  #9b59b6  /* NPCs */
--color-pin-dungeon    #e74c3c  /* Instances */
--color-pin-shop       #2ecc71  /* Merchants */
--color-pin-quest      #f39c12  /* Quest givers */
--color-pin-treasure   #1abc9c  /* Loot */
```

---

## Typography Scale

### Font Families

```css
--font-display  'Cinzel', serif    /* H1-H3, headings */
--font-body     'Inter', sans-serif/* Body, UI */
--font-mono     'JetBrains Mono'   /* Code, data */
```

### Type Scale (Strict Hierarchy)

| Element   | Size    | Weight  | Line-Height | Usage                      |
|-----------|---------|---------|-------------|----------------------------|
| **H1**    | 4.5rem  | 600     | 1.1         | Hero, main titles          |
| **H2**    | 3rem    | 600     | 1.2         | Section headers            |
| **H3**    | 2rem    | 600     | 1.3         | Subsection headers         |
| **Body**  | 1rem    | 400     | 1.6         | Primary content            |
| **Meta**  | 0.875rem| 400     | 1.5         | Secondary, timestamps      |

**Rules:**
- Max 3 text sizes per screen (maintain visual harmony)
- H1 always uses `font-display`
- Body always uses `font-body`
- Letter spacing: 0.025em on headings

---

## Radius Harmony System

### 4-Level Hierarchy

```css
--radius-3xl  1.5rem  /* Hero cards, main CTAs */
--radius-2xl  1rem    /* Feature cards, sections */
--radius-lg   0.75rem /* Interactive elements */
--radius-md   0.5rem  /* Small components, tags */
```

**Usage Rules:**
- Parent containers: `3xl` (prestige, importance)
- Child cards: `2xl` (containment)
- Buttons, inputs: `lg` (interaction)
- Tags, badges: `md` (subtle)

**Strict Enforcement:**
- Never mix more than 2 radius sizes per screen
- Maintain hierarchy (parent > child > grandchild)
- Default to `lg` if uncertain

---

## Spacing System

### 4px Base Scale

```css
--spacing-xxs  0.25rem  /* 4px   */
--spacing-sm   0.5rem   /* 8px   */
--spacing-md   1rem     /* 16px  */
--spacing-lg   1.5rem   /* 24px  */
--spacing-xl   2rem     /* 32px  */
--spacing-2xl  3rem     /* 48px  */
--spacing-3xl  4rem     /* 64px  */
--spacing-4xl  6rem     /* 96px  */
--spacing-5xl  8rem     /* 128px */
```

**Usage Patterns:**

```css
/* Vertical Rhythm */
.section        { padding-y: spacing-4xl }  /* Screen separation */
.container      { gap: spacing-2xl }        /* Major sections */
.group          { gap: spacing-xl }         /* Element groups */
.related        { gap: spacing-md }         /* Tightly related */
```

**Gap Over Margin:**
- Use `gap` in flex/grid layouts (consistent rhythm)
- Avoid `margin-*` on direct children (breaks rhythm)
- Exception: `margin-bottom` on single elements

---

## Motion Principles

### Duration Budget

| Interaction | Duration | Easing      | Use Case                |
|-------------|----------|-------------|-------------------------|
| **Hover**   | 200ms    | ease-out    | Buttons, cards          |
| **Focus**   | 150ms    | ease-out    | Inputs, focus states    |
| **Modal**   | 300ms    | ease-in-out | Overlays, dialogs       |
| **Page**    | 400ms    | ease-in-out | Route transitions       |
| **Ambient** | 6000ms   | ease-in-out | Hero ambient animation  |

### Keyframe Animations

```css
/* Float - Gentle vertical movement */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Gradient Shift - Gold shimmer */
@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Shimmer - Sweep across element */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Fade In - Entrance animation */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Animation Usage:**
- Hero ambient: 6s ease-in-out infinite (float)
- Gradient text: 8s linear infinite (gradient)
- Hover shimmer: 1000ms ease-out (shimmer)
- Entrance: 0.6s ease-out (fade-in)

---

## Layout Patterns

### Hero Section (60/40 Asymmetric)

```css
.hero-grid {
  display: grid;
  grid-template-columns: 60% 40%;  /* Content | Visual */
  gap: spacing-2xl;                /* 3rem */
  align-items: center;
}
```

**Vertical Rhythm:**
```css
.hero-content {
  display: flex;
  flex-direction: column;
  gap: spacing-2xl;  /* 3rem between sections */
}
```

**Component Spacing:**
```css
.badge → h1 → body → ctas → stats
gap-8  gap-8 gap-8  gap-8  pt-8
```

### Grid Systems

**2-Column (Features):**
```css
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: spacing-xl;
}
```

**3-Column (Cards):**
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: spacing-2xl;
}
```

**Responsive:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

---

## Component Specifications

### Hero Card (Right Column)

**Structure:**
```html
<div class="relative aspect-square max-w-sm">
  <!-- Layer 1: Outer glow (blur-2xl) -->
  <div class="absolute inset-0 bg-gradient-to-br from-accent-gold/20 to-purple-500/10 rounded-3xl blur-2xl" />

  <!-- Layer 2: Main card -->
  <div class="relative w-full h-full rounded-3xl border border-accent-gold/30 overflow-hidden">
    <!-- Layer 3: Inner glow (radial) -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,175,55,0.15),transparent_60%)]" />

    <!-- Layer 4: Animated gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-accent-gold/5 via-purple-500/5 to-accent-gold/5 animate-gradient" />

    <!-- Layer 5: Central icon with float -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="relative animate-float" style="animation-duration: 6s">
        <Map className="w-32 h-32 text-accent-gold" />
      </div>
    </div>
  </div>

  <!-- Layer 6: Corner accents -->
  <div class="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-accent-gold/40 rounded-tl-lg" />
  <!-- ... other corners ... -->
</div>
```

**Depth Layers:**
1. Outer glow (ambient light)
2. Main card (structural base)
3. Inner glow (focal point)
4. Gradient overlay (movement)
5. Icon (primary content)
6. Corner accents (frame)

### Badge Component

```html
<div class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-background-card to-background-elevated border border-accent-gold/20 overflow-hidden group">
  <!-- Shimmer effect -->
  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-accent-gold/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

  <!-- Content -->
  <Sparkles className="w-4 h-4 text-accent-gold animate-pulse" />
  <span class="text-sm font-display font-semibold bg-gradient-to-r from-accent-gold via-yellow-300 to-accent-gold bg-clip-text text-transparent">
    World Building Evolved
  </span>
</div>
```

**Requirements:**
- `rounded-xl` (radius-lg)
- Metallic border (accent-gold/20)
- Shimmer on hover (1000ms)
- Gradient text (gold → yellow → gold)

---

## Responsive Design

### Breakpoints (Tailwind Defaults)

```css
sm  640px   /* Mobile landscape */
md  768px   /* Tablet */
lg  1024px  /* Desktop */
xl  1280px  /* Wide desktop */
2xl 1536px  /* Ultra-wide */
```

### Mobile-First Approach

```css
/* Base: Mobile styles */
.hero { padding: spacing-xl }

/* Tablet and up */
@media (min-width: 768px) {
  .hero { padding: spacing-3xl }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .hero {
    display: grid;
    grid-template-columns: 60% 40%;
    gap: spacing-2xl;
  }
}
```

---

## Accessibility (WCAG AA)

### Color Contrast

- **Text Primary** on Background Base: 12.5:1 (AAA)
- **Text Secondary** on Background Base: 7.2:1 (AA)
- **Accent Gold** on Background Base: 4.8:1 (AA)

### Keyboard Navigation

```css
:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--color-accent-gold),
    0 0 0 4px var(--color-background-base);
}
```

### Screen Readers

- Use semantic HTML (`section`, `main`, `header`)
- ARIA labels for interactive elements
- `aria-label` on icon-only buttons
- `role="img"` on decorative icons

---

## Implementation Notes

### Tailwind CSS 4

```css
@theme {
  /* Define tokens in globals.css */
  --color-accent-gold: #d4af37;
  --radius-3xl: 1.5rem;
  /* ... */
}
```

### Component Rules

1. **Max 70 lines JSX** (split if larger)
2. **No arbitrary values** (use spacing scale)
3. **Semantic HTML** (section > div)
4. **Gap over margins** (consistent rhythm)
5. **No comments** (clear naming)
6. **Client component** for interactive elements

### Build Verification

```bash
npm run build  # Must pass without errors
npm run lint   # Must pass ESLint
```

---

## Changelog

**v1.0.0** (2026-01-09)
- Initial design system release
- Hero section L8-L9 redesign
- Complete token system
- Motion principles documented
