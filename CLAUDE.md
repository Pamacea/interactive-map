# Realm Forge - Project Architecture

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4
- **State**: Zustand, TanStack Query
- **Auth**: NextAuth.js
- **Database**: Prisma ORM
- **Map**: MapLibre GL

## Core Principles

### 1. Component Architecture

**MANDATORY: Component Separation**

Every page must be split into multiple components following this structure:

```
components/
├── ui/           # Pure UI components (buttons, cards, inputs)
├── features/     # Feature-specific components
└── [page-name]/  # Page-specific components
    ├── ui/       # UI-only components for this page
    ├── logic/    # Business logic, hooks, utilities
    └── methods/  # Data fetching, API calls, transformations
```

**Component Rules:**
- **UI Components**: Pure presentational, no logic, accept props
- **Logic Components**: Custom hooks, state management, utilities
- **Method Components**: API calls, data transformations, business logic
- **Pages**: Only compose components, no direct logic

**Example Structure:**
```
components/home/
├── ui/hero-section.tsx
├── ui/features-grid.tsx
├── logic/use-home-data.ts
└── methods/get-featured-worlds.ts
```

### 2. Code Standards

- **Type Safety**: All components must be fully typed
- **No Comments**: Prefer clear variable/method names over comments
- **Minimal Files**: Don't create files unless absolutely necessary
- **Existing Patterns**: Always match existing codebase conventions
- **No Refactoring**: Stay strictly in scope, only change what's needed

### 3. Design System

**Fantasy RPG Theme**:
- Colors: Gold accent, dark backgrounds, high contrast
- Typography: Display fonts for headings, readable body text
- Components: Cards with hover effects, subtle gradients
- Animations: Smooth transitions, glow effects on hover

**Tailwind Classes**:
- Backgrounds: `bg-background-base`, `bg-background-card`, `bg-background-elevated`
- Text: `text-text-primary`, `text-text-secondary`, `text-text-muted`
- Borders: `border-border-subtle`
- Accent: `text-accent-gold`, `bg-accent-gold`

## File Organization

### Page Structure
```
src/app/[page-name]/
├── page.tsx           # Only composes components
└── layout.tsx         # Page-specific layout (if needed)
```

### Component Structure
```
src/components/
├── ui/                    # Reusable UI components
│   ├── button.tsx
│   ├── card.tsx
│   └── input.tsx
├── features/              # Feature-specific components
│   └── [feature-name]/
└── [page-name]/           # Page-specific components
    ├── ui/
    ├── logic/
    └── methods/
```

## Data Fetching

**Server Components**: Use for static data, SEO
**Client Components**: Use for interactivity, forms
**TanStack Query**: Cache server state, handle loading/error states
**Zustand**: Client-side state, ephemeral data

## Quality Gates

Before committing code:
1. **Linting**: `npm run lint` must pass
2. **Type Check**: No TypeScript errors
3. **Build**: `npm run build` must succeed
4. **Format**: Auto-format with Prettier

## Git Workflow

1. Create feature branch from `main`
2. Implement changes following component architecture
3. Run quality gates
4. Commit with clear message
5. Push and create PR (if required)

## Priority

**Speed > Completeness**: Ship fast, iterate later
**Clarity > Cleverness**: Write obvious code
**Simple > Complex**: Avoid over-engineering
