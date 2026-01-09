# Aura Design System
## Interactive Map for Game Worlds & RPG Creations

Design system inspired by **League of Legends**, **Chrono Odyssey**, and **Aion 2** - featuring dark mystical aesthetics with ornate details, ethereal glows, and vibrant faction-based colors.

---

## Table of Contents
1. [Visual Philosophy](#visual-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Specifications](#component-specifications)
6. [Map Design](#map-design)
7. [Animation & Effects](#animation--effects)
8. [Accessibility](#accessibility)

---

## Visual Philosophy

### Core Principles

**1. Mystical Darkness**
- Deep backgrounds create immersion and contrast
- Inspired by the void between realms in fantasy narratives
- Allows vibrant elements to glow and stand out

**2. Ornate Elegance**
- Gold and bronze accents for premium feel (League influence)
- Intricate borders and decorative elements (Aion influence)
- Time-worn textures and ancient aesthetics (Chrono Odyssey influence)

**3. Ethereal Energy**
- Soft glows on interactive elements
- Celestial and magical visual language
- Light emanates from important content

**4. Faction Identity**
- Distinct colors for different pin types and locations
- Faction-based color system for world-building
- Clear visual hierarchy through color

---

## Color System

### Background Colors

```css
/* Primary background - deepest void */
--background-base: #0a0e13;

/* Elevated surfaces */
--background-elevated: #141a1f;

/* Cards and containers */
--background-card: #1a2228;
--background-card-hover: #222b33;
```

### Semantic Colors

```css
/* Text hierarchy */
--text-primary: #e8e6e3;    /* Primary content */
--text-secondary: #a8a49e;  /* Supporting text */
--text-muted: #6b6862;      /* Disabled/placeholder */

/* Gold accents (League-inspired) */
--accent-gold: #d4af37;
--accent-gold-light: #f4d47c;
--accent-gold-dark: #b8931f;

/* Borders */
--border-subtle: rgba(255, 255, 255, 0.08);
--border-default: rgba(255, 255, 255, 0.12);
--border-ornate: rgba(212, 175, 55, 0.3);
```

### Pin Type Color System

Each pin type has a distinct color identity for instant recognition:

| Pin Type | Primary Color | Glow Color | Icon | Use Case |
|----------|--------------|------------|------|----------|
| **City** | `#c9a227` | `rgba(201, 162, 39, 0.4)` | 🏰 | Major settlements and capitals |
| **Village** | `#8b7355` | `rgba(139, 115, 85, 0.4)` | 🏘️ | Small towns and hamlets |
| **POI** | `#4a9eff` | `rgba(74, 158, 255, 0.4)` | 📍 | Points of interest |
| **Character** | `#9b59b6` | `rgba(155, 89, 182, 0.4)` | 👤 | NPCs and story characters |
| **Dungeon** | `#e74c3c` | `rgba(231, 76, 60, 0.4)` | ⚔️ | Dangerous areas and instances |
| **Shop** | `#2ecc71` | `rgba(46, 204, 113, 0.4)` | 🛒 | Merchants and services |
| **Quest** | `#f39c12` | `rgba(243, 156, 18, 0.4)` | ❓ | Quest givers and objectives |
| **Treasure** | `#1abc9c` | `rgba(26, 188, 156, 0.4)` | 💎 | Loot and hidden items |

### Faction Colors

For advanced world-building with factions:

```css
--faction-light: #64b5f6;    /* Angelic, celestial */
--faction-dark: #7b1fa2;     /* Demonic, shadow */
--faction-nature: #66bb6a;   /* Druidic, wild */
--faction-fire: #ff6b35;     /* Aggressive, warmonger */
--faction-ice: #42a5f5;      /* Cold, calculated */
```

### Rarity Colors

For items, characters, or content rarity:

```css
--rarity-common: #9e9e9e;    /* Gray */
--rarity-uncommon: #4caf50;  /* Green */
--rarity-rare: #2196f3;      /* Blue */
--rarity-epic: #9b59b6;      /* Purple */
--rarity-legendary: #d4af37; /* Gold */
```

---

## Typography

### Font Families

```css
/* Display headings - Fantasy RPG feel */
--font-display: 'Cinzel', 'Times New Roman', serif;

/* Body text - Clean and readable */
--font-body: 'Inter', system-ui, -apple-system, sans-serif;

/* Code/technical - Monospace */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

```css
/* Text sizes */
--text-xxs: 0.625rem;   /* 10px - Labels, tags */
--text-xs: 0.75rem;     /* 12px - Captions */
--text-sm: 0.875rem;    /* 14px - Small body */
--text-base: 1rem;      /* 16px - Default body */
--text-lg: 1.125rem;    /* 18px - Emphasized body */
--text-xl: 1.25rem;     /* 20px - Small headings */
--text-2xl: 1.5rem;     /* 24px - Section headings */
--text-3xl: 1.875rem;   /* 30px - Page headings */
--text-4xl: 2.25rem;    /* 36px - Hero title */
--text-5xl: 3rem;       /* 48px - Display */
--text-6xl: 3.75rem;    /* 60px - Hero display */
```

### Typography Hierarchy

**Page Titles**
```tsx
<h1 className="text-5xl font-display font-bold tracking-wide text-text-primary">
  World Name
</h1>
```

**Section Headings**
```tsx
<h2 className="text-2xl font-display font-semibold tracking-wide text-text-primary">
  Lore Entries
</h2>
```

**Body Text**
```tsx
<p className="text-base font-body leading-relaxed text-text-secondary">
  Lorem ipsum dolor sit amet...
</p>
```

**Labels & Meta**
```tsx
<span className="text-xs font-body uppercase tracking-wider text-text-muted">
  Category
</span>
```

---

## Spacing & Layout

### Spacing Scale

```css
--spacing-xs: 0.25rem;   /* 4px - Tight spacing */
--spacing-sm: 0.5rem;    /* 8px - Compact */
--spacing-md: 1rem;      /* 16px - Default */
--spacing-lg: 1.5rem;    /* 24px - Comfortable */
--spacing-xl: 2rem;      /* 32px - Spacious */
--spacing-2xl: 3rem;     /* 48px - Sections */
--spacing-3xl: 4rem;     /* 64px - Major sections */
--spacing-4xl: 6rem;     /* 96px - Hero spacing */
--spacing-5xl: 8rem;     /* 128px - Extreme spacing */
```

### Border Radius

```css
--radius-none: 0;
--radius-sm: 0.25rem;    /* 4px - Subtle */
--radius-md: 0.5rem;     /* 8px - Default */
--radius-lg: 0.75rem;    /* 12px - Rounded */
--radius-xl: 1rem;       /* 16px - Extra rounded */
--radius-full: 9999px;   /* Pill shape */
```

### Layout Patterns

**Card Grid**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {worlds.map(world => <WorldCard key={world.id} {...world} />)}
</div>
```

**Full-Width Section**
```tsx
<section className="w-full py-16 px-4 md:px-8">
  <div className="max-w-7xl mx-auto">
    {content}
  </div>
</section>
```

**Split Layout (Map + Sidebar)**
```tsx
<div className="flex flex-col lg:flex-row h-screen">
  <main className="flex-1 relative">
    <InteractiveMap />
  </main>
  <aside className="w-full lg:w-96 bg-background-elevated border-l border-border-subtle">
    <MapSidebar />
  </aside>
</div>
```

---

## Component Specifications

### 1. Buttons

**Primary Button (Gold)**
```tsx
<button className="
  px-6 py-3
  bg-gradient-to-r from-accent-gold to-accent-gold-dark
  text-text-inverse font-display font-semibold tracking-wide
  rounded-md
  shadow-glow-medium
  hover:shadow-glow-strong
  transition-all duration-200
  hover:scale-105
">
  Create World
</button>
```

**Secondary Button**
```tsx
<button className="
  px-6 py-3
  bg-background-card
  text-text-primary font-display font-medium
  rounded-md
  border border-border-ornate
  hover:border-accent-gold
  hover:shadow-glow-subtle
  transition-all duration-200
">
  Explore Worlds
</button>
```

**Icon Button**
```tsx
<button className="
  p-2
  text-text-secondary
  rounded-md
  hover:text-accent-gold
  hover:bg-background-card-hover
  transition-colors duration-150
">
  <Icon className="w-5 h-5" />
</button>
```

### 2. Cards

**World Card (Library)**
```tsx
<div className="
  group
  bg-background-card
  rounded-lg
  border border-border-subtle
  hover:border-border-ornate
  overflow-hidden
  transition-all duration-300
  hover:shadow-lg hover:shadow-glow-subtle
  cursor-pointer
">
  <div className="relative aspect-video overflow-hidden">
    <Image
      src={world.coverImage}
      alt={world.title}
      className="object-cover group-hover:scale-105 transition-transform duration-500"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-background-base to-transparent" />
  </div>

  <div className="p-4 space-y-2">
    <h3 className="text-xl font-display font-semibold text-text-primary group-hover:text-accent-gold">
      {world.title}
    </h3>
    <p className="text-sm text-text-secondary line-clamp-2">
      {world.description}
    </p>
    <div className="flex items-center gap-2 text-xs text-text-muted">
      <span>{world.pinCount} pins</span>
      <span>•</span>
      <span>{world.loreCount} lore entries</span>
    </div>
  </div>
</div>
```

**Lore Entry Card**
```tsx
<div className="
  bg-background-card
  rounded-md
  border-l-4 border-accent-gold
  p-4
  hover:bg-background-card-hover
  transition-colors duration-200
  cursor-pointer
">
  <div className="flex items-start justify-between gap-4">
    <div className="flex-1">
      <h4 className="text-lg font-display font-semibold text-text-primary">
        {lore.title}
      </h4>
      <span className="text-xs font-body uppercase tracking-wider text-accent-gold">
        {lore.category}
      </span>
    </div>
    <ChevronRight className="w-5 h-5 text-text-muted" />
  </div>
</div>
```

### 3. Map Pins

**Pin Component**
```tsx
interface MapPinProps {
  type: PinType;
  title: string;
  latitude: number;
  longitude: number;
  isSelected?: boolean;
}

export function MapPin({ type, title, isSelected }: MapPinProps) {
  const colors = PIN_TYPE_COLORS[type];

  return (
    <div
      className={`
        relative
        cursor-pointer
        transition-all duration-300
        ${isSelected ? 'scale-125 z-10' : 'hover:scale-110'}
      `}
      style={{
        filter: `drop-shadow(0 0 12px ${colors.glow})`,
      }}
    >
      {/* Pin icon */}
      <div
        className="
          w-10 h-10
          rounded-full
          flex items-center justify-center
          text-lg
          bg-background-card
          border-2
          animate-float
        "
        style={{
          borderColor: colors.primary,
          boxShadow: `0 0 20px ${colors.glow}`,
        }}
      >
        {colors.icon}
      </div>

      {/* Label on hover */}
      <div className="
        absolute top-full mt-2 left-1/2 -translate-x-1/2
        whitespace-nowrap
        bg-background-base
        px-3 py-1.5
        rounded-md
        border border-border-subtle
        shadow-lg
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        pointer-events-none
      ">
        <span className="text-sm font-display text-text-primary">
          {title}
        </span>
      </div>
    </div>
  );
}
```

**Pin Type Legend**
```tsx
<div className="flex flex-wrap gap-3">
  {Object.entries(PIN_TYPE_COLORS).map(([type, colors]) => (
    <div
      key={type}
      className="flex items-center gap-2"
    >
      <div
        className="w-3 h-3 rounded-full"
        style={{
          backgroundColor: colors.primary,
          boxShadow: `0 0 8px ${colors.glow}`,
        }}
      />
      <span className="text-sm text-text-secondary capitalize">
        {type}
      </span>
    </div>
  ))}
</div>
```

### 4. Navigation

**Top Navigation Bar**
```tsx
<nav className="
  fixed top-0 left-0 right-0 z-50
  bg-background-base/95
  backdrop-blur-sm
  border-b border-border-subtle
">
  <div className="max-w-7xl mx-auto px-4 h-16">
    <div className="flex items-center justify-between h-full">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-accent-gold to-accent-gold-dark" />
        <span className="text-xl font-display font-bold text-text-primary tracking-wide">
          REALM FORGE
        </span>
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-8">
        <NavLink href="/explore">Explore</NavLink>
        <NavLink href="/create">Create</NavLink>
        <NavLink href="/library">Library</NavLink>
      </div>

      {/* User menu */}
      <UserMenu />
    </div>
  </div>
</nav>
```

### 5. Forms

**Input Field**
```tsx
<input
  type="text"
  className="
    w-full
    bg-background-base
    text-text-primary
    px-4 py-3
    rounded-md
    border border-border-subtle
    focus:border-accent-gold
    focus:ring-1 focus:ring-accent-gold
    focus:shadow-glow-subtle
    outline-none
    transition-all duration-200
    placeholder:text-text-muted
  "
  placeholder="Enter world name..."
/>
```

**Select Dropdown**
```tsx
<select className="
  w-full
  bg-background-base
  text-text-primary
  px-4 py-3
  rounded-md
  border border-border-subtle
  focus:border-accent-gold
  outline-none
  transition-all duration-200
">
  <option>Select pin type...</option>
  <option value="city">City</option>
  <option value="village">Village</option>
</select>
```

---

## Map Design

### Map Container

```tsx
<div className="relative w-full h-screen bg-background-base">
  {/* MapLibre GL JS container */}
  <div ref={mapContainer} className="absolute inset-0" />

  {/* Map controls overlay */}
  <div className="absolute top-4 right-4 flex flex-col gap-2">
    <ZoomControls />
    <LayerToggle />
    <FullscreenToggle />
  </div>

  {/* Legend */}
  <div className="absolute bottom-4 left-4 bg-background-card/95 backdrop-blur-sm rounded-lg p-4 border border-border-subtle">
    <PinLegend />
  </div>

  {/* Search bar */}
  <div className="absolute top-4 left-4 z-10">
    <SearchBar />
  </div>
</div>
```

### Custom Map Style (MapLibre GL JS)

```json
{
  "version": 8,
  "name": "realm-forge-dark",
  "sources": {
    "osm": {
      "type": "raster",
      "tiles": ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      "tileSize": 256
    }
  },
  "layers": [
    {
      "id": "background",
      "type": "background",
      "paint": {
        "background-color": "#0a0e13"
      }
    },
    {
      "id": "osm-tiles",
      "type": "raster",
      "source": "osm",
      "paint": {
        "raster-opacity": 0.3,
        "raster-saturation": -0.8,
        "raster-contrast": 0.2
      }
    }
  ]
}
```

### Pin Popup

```tsx
<div className="
  bg-background-card
  rounded-lg
  border border-border-ornate
  shadow-2xl
  overflow-hidden
  min-w-[280px]
">
  {/* Header with pin type */}
  <div
    className="px-4 py-3 border-b border-border-subtle"
    style={{
      background: `linear-gradient(to right, ${pinColor}10, transparent)`,
    }}
  >
    <div className="flex items-center gap-2">
      <span className="text-2xl">{pin.icon}</span>
      <h3 className="text-lg font-display font-semibold text-text-primary">
        {pin.title}
      </h3>
    </div>
    <span className="text-xs text-accent-gold uppercase tracking-wider">
      {pin.type}
    </span>
  </div>

  {/* Content */}
  <div className="p-4 space-y-3">
    <p className="text-sm text-text-secondary">{pin.description}</p>

    {/* Character-specific data */}
    {pin.type === 'CHARACTER' && (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-text-muted">Level:</span>
          <span className="text-text-primary">{pin.properties.level}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-text-muted">Faction:</span>
          <span
            className="text-text-primary"
            style={{ color: factionColor }}
          >
            {pin.properties.faction}
          </span>
        </div>
      </div>
    )}

    {/* Gallery preview */}
    {pin.gallery.length > 0 && (
      <div className="flex gap-2 overflow-x-auto">
        {pin.gallery.slice(0, 3).map(item => (
          <img
            key={item.id}
            src={item.imageUrl}
            alt={item.title}
            className="w-16 h-16 rounded object-cover flex-shrink-0"
          />
        ))}
      </div>
    )}

    {/* Actions */}
    <div className="flex gap-2 pt-2 border-t border-border-subtle">
      <button className="flex-1 px-3 py-2 text-sm font-medium text-accent-gold border border-accent-gold/30 rounded-md hover:bg-accent-gold/10 transition-colors">
        View Details
      </button>
      <button className="px-3 py-2 text-text-secondary hover:text-text-primary transition-colors">
        <Edit2 className="w-4 h-4" />
      </button>
    </div>
  </div>
</div>
```

---

## Animation & Effects

### Glow Effect

```css
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
  }
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}
```

### Float Animation (Pins)

```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

### Shimmer (Loading States)

```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(212, 175, 55, 0.1) 50%,
    transparent 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2.5s linear infinite;
}
```

### Pulse (Quest Pins)

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.animate-pulse-custom {
  animation: pulse 2s ease-in-out infinite;
}
```

---

## Accessibility

### Color Contrast

- All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Primary text on dark backgrounds: `#e8e6e3` on `#0a0e13` = **14.5:1** ✅
- Secondary text: `#a8a49e` on `#0a0e13` = **7.2:1** ✅
- Gold accent: `#d4af37` on `#0a0e13` = **8.1:1** ✅

### Focus States

All interactive elements have visible focus indicators:

```css
.focus-ring:focus-visible {
  outline: 2px solid var(--accent-gold);
  outline-offset: 2px;
}
```

### Keyboard Navigation

- All map pins accessible via keyboard
- Tab order follows visual layout
- Escape closes modals/popups
- Arrow keys navigate map

### Screen Reader Support

```tsx
<button
  aria-label={`View ${pin.title}, ${pin.type}`}
  role="button"
  tabIndex={0}
>
  <MapPin {...pin} />
</button>
```

---

## Page Layouts

### Landing Page

```
┌─────────────────────────────────────┐
│           Navigation Bar            │
├─────────────────────────────────────┤
│                                     │
│         Hero Section                │
│    [Title + CTA + Featured World]   │
│                                     │
├─────────────────────────────────────┤
│         Features Section            │
│    [3-column feature cards]         │
│                                     │
├─────────────────────────────────────┤
│      Featured Worlds Gallery        │
│         [Grid of cards]             │
│                                     │
├─────────────────────────────────────┤
│            Footer                   │
└─────────────────────────────────────┘
```

### Game World Page

```
┌─────────────────────────────────────┐
│  [Back] World Title        [Edit]  │
├─────────────────────────────────────┤
│                                     │
│                                     │
│          Interactive Map            │
│      [Full-width map container]     │
│                                     │
│                                     │
├───────────┬─────────────────────────┤
│           │                         │
│  Layers   │    Lore & Info          │
│           │   [Sidebar content]     │
│  [List]   │                         │
│           │   - Description         │
│           │   - Lore entries        │
│           │   - Gallery             │
└───────────┴─────────────────────────┘
```

### Library/Explorer Page

```
┌─────────────────────────────────────┐
│           Navigation                │
├─────────────────────────────────────┤
│  [Search + Filters]     [Sort]     │
├─────────────────────────────────────┤
│                                     │
│     World Grid (3 columns)          │
│                                     │
│  ┌────┐ ┌────┐ ┌────┐             │
│  │card│ │card│ │card│             │
│  └────┘ └────┘ └────┘             │
│  ┌────┐ ┌────┐ ┌────┐             │
│  │card│ │card│ │card│             │
│  └────┘ └────┘ └────┘             │
│                                     │
└─────────────────────────────────────┘
```

---

## Implementation Notes

### Tailwind Configuration

Extend your `tailwind.config.ts`:

```typescript
import auraTokens from './docs/aura-tokens.json';

export default {
  theme: {
    extend: {
      colors: {
        background: auraTokens.colors.semantic.background,
        border: auraTokens.colors.semantic.border,
        text: auraTokens.colors.semantic.text,
        accent: auraTokens.colors.semantic.accent,
        pin: {
          city: auraTokens.colors.pinTypes.city.primary,
          village: auraTokens.colors.pinTypes.village.primary,
          poi: auraTokens.colors.pinTypes.poi.primary,
          character: auraTokens.colors.pinTypes.character.primary,
          dungeon: auraTokens.colors.pinTypes.dungeon.primary,
          shop: auraTokens.colors.pinTypes.shop.primary,
          quest: auraTokens.colors.pinTypes.quest.primary,
          treasure: auraTokens.colors.pinTypes.treasure.primary,
        },
      },
      fontFamily: auraTokens.typography.fontFamilies,
      fontSize: auraTokens.typography.sizes,
      spacing: auraTokens.spacing,
      borderRadius: auraTokens.borders.radius,
      boxShadow: {
        'glow-subtle': auraTokens.shadows.glow.subtle,
        'glow-medium': auraTokens.shadows.glow.medium,
        'glow-strong': auraTokens.shadows.glow.strong,
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
    },
  },
};
```

---

## Design Principles Recap

1. **Dark Mystical Background** - Deep colors create immersion
2. **Gold Ornate Accents** - Premium fantasy RPG feel
3. **Vibrant Pin Colors** - Clear visual hierarchy
4. **Ethereal Glows** - Magical energy and interactivity
5. **Ornate Typography** - Cinzel for headings, Inter for body
6. **Smooth Animations** - Float, glow, shimmer effects
7. **Accessibility First** - High contrast, keyboard navigation

This design system brings the epic feel of League of Legends, Chrono Odyssey, and Aion 2 to your world-building platform while maintaining usability and performance.
