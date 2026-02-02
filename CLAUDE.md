# Genesis - Interactive Map Platform

## Project Overview

Genesis is a web-based platform for creating and sharing interactive fantasy world maps. Users can build rich maps with custom pins, lore entries, image galleries, and collaborative layers. Built for writers, DMs, and worldbuilders to bring their fictional realms to life.

**Tech Stack**: Next.js 16 (App Router), TypeScript 5.9, Tailwind CSS 4, Prisma ORM, NextAuth.js, MapLibre GL, Zustand, TanStack Query.

**Current Status**: ~65% complete. See `PROGRESS.md` for detailed feature status.

---

## Architecture Principles

### Component Separation (MANDATORY)

All features follow the **ui/logic/methods** pattern:

```
components/[feature]/
├── ui/          # Pure presentational components
├── logic/       # Custom hooks, state management
└── methods/     # API calls, data transformations
```

- **UI**: Props in, JSX out. No logic beyond basic event handlers
- **Logic**: Custom hooks (`use*`), Zustand stores, utilities
- **Methods**: Server Actions, API clients, data mappers

### Server vs Client Components

- **Server Components**: Default. Use for static data, SEO, initial render
- **Client Components**: Interactive features (`"use client"` directive). State, forms, maps
- **Pattern**: Keep server components at edge, move to client only when needed

### State Management

- **Server State**: TanStack Query (cache, sync with DB)
- **Client State**: Zustand (ephemeral UI state, filters, modals)
- **Form State**: React Hook Form + Zod validation

### Type Safety

- **I/O Validation**: All external data validated with Zod schemas
- **Database Types**: Generated from Prisma schema
- **No Any**: Strict TypeScript, explicit types everywhere

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group (login, register)
│   ├── (dashboard)/              # Protected routes
│   │   ├── worlds/               # World list, create, edit
│   │   ├── world/[id]/           # World map editor
│   │   └── settings/             # User settings
│   ├── api/                      # API routes (webhooks, etc.)
│   ├── layout.tsx                # Root layout with providers
│   └── globals.css               # Tailwind v4 + custom theme
│
├── components/
│   ├── ui/                       # Shadcn components (button, card, etc.)
│   ├── auth/                     # Auth feature components
│   ├── worlds/                   # Worlds feature components
│   ├── pins/                     # Pins feature (FULLY IMPLEMENTED)
│   │   ├── ui/                   # Pin UI components
│   │   │   ├── pin-marker.tsx    # Main pin marker (176 lines, 48% reduced)
│   │   │   ├── pin-icon.tsx      # Icon renderer (Lucide/custom)
│   │   │   ├── pin-selection-ring.tsx  # Selection indicator
│   │   │   ├── pin-popup.tsx     # Pin popup/card
│   │   │   ├── pin-form.tsx      # Create/edit form
│   │   │   └── ...               # Other pin UI components
│   │   ├── logic/                # Pin business logic
│   │   │   ├── use-pin-drag.ts   # Drag-and-drop hook
│   │   │   ├── use-pin-position.ts  # Position calculation
│   │   │   ├── use-pin-events.ts # Event handling
│   │   │   ├── use-pin-form.ts   # Form state management
│   │   │   └── __tests__/        # Unit tests (64 tests, 98.92% coverage)
│   │   ├── utils/                # Pin utilities
│   │   │   ├── pin-icons.ts      # Icon constants
│   │   │   └── pin-popup-utils.ts # Popup helpers
│   │   └── logic/                # Shared pin logic
│   └── world/                    # World editor feature
│       ├── ui/                   # Editor UI (map, sidebar, controls)
│       ├── logic/                # Editor state, hooks
│       │   ├── use-pins-filtering.ts  # Pin filtering logic
│       │   └── use-pin-filters.ts     # Filter state management
│       └── methods/              # Map actions, layer operations
│
├── actions/                      # Server Actions (database writes)
│   ├── auth.ts                   # Auth operations
│   ├── worlds.ts                 # World CRUD operations
│   └── pins.ts                   # Pin CRUD operations
│
├── hooks/                        # Global custom hooks
│   ├── use-debounce.ts           # Debounce utility
│   ├── use-toast.tsx             # Toast notifications
│   └── use-autosave.ts           # Autosave functionality
│
├── lib/                          # Core utilities
│   ├── auth.ts                   # NextAuth config
│   ├── db.ts                     # Prisma client
│   ├── utils.ts                  # Helper functions
│   ├── valid-data.ts             # Data validation utilities
│   └── event-manager.ts          # Event capture/propagation control
│
├── store/                        # Zustand stores
│   ├── use-sidebar.ts            # Sidebar state
│   └── use-pins-store.ts         # Pins state + filters (569 lines)
│
├── constants/                    # App constants
│   ├── pin-types.ts              # Pin type definitions
│   └── pin-icons.ts              # Pin icon mappings
│
└── types/                        # TypeScript types (if Prisma not enough)

prisma/
└── schema.prisma                 # Database schema (User, World, Pin, Lore, etc.)
```

### Database Schema

**Models**: User, Account, Session (NextAuth), World, Pin, LoreEntry, ImageGallery, Layer.

**Key Relations**: User → World (1:N), World → Pin/Lore/Layer (1:N).

### Pin Feature Architecture (FULLY IMPLEMENTED)

The pin feature demonstrates the **ui/logic/methods** pattern in action:

**UI Components** (`components/pins/ui/`):
- `pin-marker.tsx`: Main marker component with drag, click, hover (176 lines)
- `pin-icon.tsx`: Reusable icon renderer (Lucide or custom images)
- `pin-selection-ring.tsx`: Animated selection indicator
- `pin-popup.tsx`: Popup card showing pin details
- `pin-form.tsx`: Create/edit form with validation

**Logic Hooks** (`components/pins/logic/`):
- `use-pin-drag.ts`: Drag-and-drop with optimistic updates (235 lines)
- `use-pin-position.ts`: Coordinate conversion and layer offsets (93 lines)
- `use-pin-events.ts`: Hover state and event capture (81 lines)
- `use-pin-form.ts`: Form state and validation

**State Management** (`store/use-pins-store.ts`):
- UI state (selection, hover, creating/editing modes)
- Pin data (list, filtered list)
- Filter state (type, search, layers)
- CRUD operations with optimistic updates
- Server sync via Server Actions

**Performance Optimizations**:
- `MemoizedPinMarker`: Custom memoization prevents unnecessary re-renders
- Only re-renders on critical prop changes (position, visibility, size)
- Zoom-based visibility culling (hides pins when < 6px)
- Layer-aware z-index sorting
- Optimistic updates with Zustand → async DB sync

**Test Coverage**: 64 unit tests, 98.92% coverage
- `use-pin-drag.test.ts`: 18 tests
- `use-pin-events.test.ts`: 16 tests
- `use-pin-position.test.ts`: 30 tests

---

## Features

See `PROGRESS.md` for detailed feature status and implementation progress.

**Quick Overview**:
- **Fully Implemented**: Authentication, World Management, Pins, Layers, Explore
- **Partially Implemented**: Lore Entries, Image Gallery (UI exists, needs integration)
- **Not Started**: Collaboration UI, Search UI, Export UI, Templates

---

## Development Guidelines

### Component Creation Rules

1. **Separate Concerns**: Always split into ui/logic/methods
2. **Keep Components Small**: Max 50-70 lines. Extract sub-components
3. **Props Interface**: Define explicit TypeScript interfaces
4. **No Logic in UI**: Move business logic to hooks or methods
5. **Server Actions First**: Use Server Actions for DB writes, avoid API routes

### State Management Patterns

- **Server Data**: Use TanStack Query (`useQuery`, `useMutation`)
- **UI State**: Use Zustand stores (e.g., `use-sidebar.ts`)
- **Form State**: Use React Hook Form with Zod validation

### File Naming Conventions

- **Components**: `kebab-case.tsx` (e.g., `world-card.tsx`)
- **Hooks**: `use-[feature].ts` (e.g., `use-world-data.ts`)
- **Actions**: `[resource].ts` (e.g., `worlds.ts`)
- **Types**: `[resource]-types.ts` (if needed)

### Code Quality Standards

- **TypeScript Strict**: No `any`, explicit types
- **No Console Logs**: Use proper logging
- **Error Handling**: Try-catch in Server Actions, show user-friendly errors
- **Performance**: Lazy load routes, prefetch critical pages

### Testing

- **When**: Test complex logic, critical paths (auth, payments)
- **Tools**: Jest, React Testing Library
- **Coverage**: Aim for 80%+ on business logic
- **Skip Tests**: Simple UI components, straightforward CRUD

---

## Common Patterns

### Server Actions Usage

```typescript
// actions/worlds.ts
"use server"

export async function createWorld(data: WorldInput) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  const world = await db.world.create({
    data: { ...data, userId: session.user.id }
  })

  revalidatePath("/worlds")
  return world
}
```

**Rules**:
- Always check auth
- Validate input with Zod
- Revalidate paths after mutations
- Return typed data

### Data Fetching Patterns

```typescript
// Server Component
const worlds = await getWorldsByUser(session.user.id)

// Client Component with TanStack Query
const { data: worlds } = useQuery({
  queryKey: ["worlds"],
  queryFn: () => fetch("/api/worlds").then(r => r.json())
})
```

### Form Handling

```typescript
// Server Action
export async function updateWorld(id: string, data: WorldSchema) {
  const validated = WorldSchema.parse(data)
  await db.world.update({ where: { id }, data: validated })
}

// Client Component
const form = useForm<z.infer<typeof WorldSchema>>({
  resolver: zodResolver(WorldSchema)
})
```

### Error Handling

```typescript
// Server Actions
try {
  await operation()
} catch (error) {
  return { error: "Operation failed" }
}

// Components
const { data, error } = useQuery(...)
if (error) return <Error message={error.message} />

// Error Boundaries (for catching component errors)
import { ErrorBoundary } from "@/components/ui/error-boundary"

<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error("Error:", error);
    // Send to error reporting service
  }}
>
  <YourComponent />
</ErrorBoundary>
```

**Error Boundary Strategy**:
- Global: `app/global-error.tsx` - Root level errors
- Route: `app/world/[id]/error.tsx` - Route-specific errors
- Component: `<ErrorBoundary>` - Wrapping critical UI sections

### Styling Conventions

- **Tailwind v4**: Use `@import "tailwindcss"` in globals.css
- **Theme**: Custom colors in `:root` (bg-background-base, text-text-primary, etc.)
- **Responsive**: Mobile-first, use `md:`, `lg:` breakpoints
- **Dark Mode**: Use `dark:` prefix (currently configured)

### Design Token Standards

**MANDATORY**: Use standard Tailwind utilities for shadows, borders, and border radius. No arbitrary values unless justified.

#### Shadow Levels

Use standard Tailwind shadow utilities based on element hierarchy:

- **Floating elements** (popups, tooltips, dropdowns): `shadow-lg`
- **Dialogs, modals**: `shadow-xl`
- **Critical overlays** (alerts, important modals): `shadow-2xl`
- **Interactive controls** (drag handles, active states): `shadow-lg`

**Prohibited**: Custom shadows like `shadow-[0_0_8px_rgba(255,215,0,0.5)]`

**Examples**:
```tsx
// ✅ Correct
<div className="shadow-xl">Modal dialog</div>
<div className="shadow-lg">Dropdown menu</div>

// ❌ Incorrect
<div className="shadow-[0_25px_50px_rgba(0,0,0,0.5)]">Custom shadow</div>
```

#### Border Patterns

Use consistent border patterns based on element state:

- **Primary/Active elements** (selected, focused, primary actions): `border-2 border-accent-gold`
- **Secondary elements** (default, containers): `border border-border-subtle`
- **Dividers**: `border-t` or `border-b`
- **Special borders** (ornate, decorative): Use CSS variables `border-[var(--color-border-ornate)]`

**Prohibited**: Arbitrary border colors like `border-[#D4AF37]`

**Examples**:
```tsx
// ✅ Correct
<div className="border-2 border-accent-gold">Selected state</div>
<div className="border border-border-subtle">Default container</div>
<div className="border-t" />

// ❌ Incorrect
<div className="border-2 border-[#D4AF37]">Arbitrary color</div>
```

#### Border Radius

Follow the design system hierarchy:

- **Containers, panels, small elements**: `rounded-sm`
- **Cards, buttons, medium elements**: `rounded-sm`
- **Large cards, sections**: `rounded-sm`
- **Special cases** (hero sections, featured elements): `rounded-sm`
- **Circular elements** (avatars, badges, spinners): `rounded-sm`

**Prohibited**: `rounded-3xl` unless explicitly justified for specific visual effects

**Examples**:
```tsx
// ✅ Correct
<div className="rounded-sm">Panel container</div>
<div className="rounded-sm">Card</div>
<div className="rounded-sm">Avatar</div>

// ❌ Incorrect
<div className="rounded-3xl">Excessive rounding</div>
```

**Justified Exceptions**:
- Decorative background elements with specific visual requirements
- Hero section blur effects (e.g., `blur-[150px]` for ambient glow)
- Custom sizing with inline styles for dynamic calculations

#### Token Reference

**Shadow Scale** (Tailwind v4 default):
- `shadow-lg`: Large shadow for elevated elements
- `shadow-xl`: Extra large shadow for dialogs
- `shadow-2xl`: Extra extra large shadow for critical overlays

**Border Scale**:
- `border`: 1px border (default)
- `border-2`: 2px border (emphasized)

**Radius Scale**:
- `rounded-sm`: 2px radius (subtle)
- `rounded-sm`: 6px radius (medium)
- `rounded-sm`: 8px radius (large)
- `rounded-sm`: 12px radius (extra large)
- `rounded-sm`: 9999px radius (circular)

---

## Troubleshooting

### Tailwind v4 Issues

**Problem**: Classes not working.
**Fix**: Ensure `globals.css` has `@import "tailwindcss"` at top (before custom CSS).

**Problem**: Build fails with Tailwind error.
**Fix**: Check for arbitrary values, use standard spacing scale.

### Build Issues

**Problem**: Type errors in Prisma client.
**Fix**: Run `npx prisma generate` to regenerate types.

**Problem**: Next.js build fails.
**Fix**: Check for missing `"use client"` in interactive components.

### Common Errors

**"session is null"**: Auth session missing. Wrap in `if (!session)` check.

**"revalidatePath not working"**: Ensure path matches actual route (starts with `/`).

**"Zustand store undefined"**: Initialize store with default state.

**MapLibre not rendering**: Check container has explicit height, MapLibre CSS imported.

---

## Quick Reference

### Create New World Feature

1. Create schema in `prisma/schema.prisma`
2. Run migrations: `npx prisma migrate dev`
3. Create Server Actions in `actions/`
4. Create components in `components/[feature]/`
5. Add routes in `app/[feature]/page.tsx`

### Update Existing Feature

1. Find component in `components/[feature]/`
2. Update UI in `ui/`, logic in `logic/`
3. Update Server Actions if needed
4. Test on `/[feature]` route

### Database Changes

1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description`
3. Run `npx prisma generate` for new types
4. Update Server Actions to use new fields
