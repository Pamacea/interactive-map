# Genesis - Interactive Map Platform

> **Version:** 1.3.0 | **Status:** Production-ready | **Tests:** 685/685 passing (100%)

## Project Identity

Plateforme web de création de cartes interactives pour mondes fantasy (RPG, romans, worldbuilding). Users ajoutent marqueurs, lore, personnages et collaborent.

**Tech Stack:** Next.js 16.1.6, React 19.2, TypeScript 5, Tailwind 4, Prisma, NextAuth, MapLibre, Zustand, TanStack Query, Vitest.

---

## 🏗️ Architecture: Features-Based (MANDATORY)

### Structure Obligatoire

Toute feature suit cette séparation stricte **ui/logic/methods** :

```
src/features/[feature]/
├── ui/                # Présentation pure (props in, JSX out)
│   ├── components/    # Sous-composants UI
│   └── index.ts       # Barrel exports
├── logic/             # Hooks custom, stores, utilities
│   ├── __tests__/     # Tests des hooks
│   └── index.ts
├── methods/           # Server Actions, data mappers
│   ├── __tests__/     # Tests des actions
│   └── index.ts
├── actions/           # Server Actions (alias de methods)
│   ├── __tests__/
│   └── index.ts
└── index.ts           # Barrel export principal
```

**Règles strictes :**
- **UI** = Aucune logique métier, max 50-70 lignes, props in/JSX out
- **Logic** = `use*` hooks, Zustand stores, calculs purs
- **Methods/Actions** = Server Actions avec auth + validation Zod

### Exemple Concret

```typescript
// src/features/pins/ui/pin-marker.tsx
export function PinMarker({ pin, onSelect }: Props) {
  return <div onClick={() => onSelect(pin.id)}>{pin.name}</div>
}

// src/features/pins/logic/use-pins-query.ts
export function usePinsQuery(worldId: string) {
  return useQuery({
    queryKey: ['pins', worldId],
    queryFn: () => getPinsByWorld(worldId)
  })
}

// src/features/pins/actions/create.ts
'use server'
export async function createPin(data: PinInput) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  const validated = PinSchema.parse(data)
  const pin = await db.pin.create({ data: validated })

  revalidatePath(`/world/${pin.worldId}`)
  return pin
}
```

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Login, register (public)
│   ├── (dashboard)/             # Routes protégées
│   │   ├── worlds/              # Liste, création, édition
│   │   ├── world/[id]/          # Éditeur de carte
│   │   └── not-found.tsx        # 404 dashboard
│   ├── api/                     # API routes (webhooks)
│   ├── layout.tsx               # Root Layout
│   ├── not-found.tsx            # Root 404
│   └── globals.css
│
├── features/                     # Business logic (NEW!)
│   ├── auth/                    # Authentication
│   ├── worlds/                  # World management
│   ├── pins/                    # Map markers (FULLY IMPLEMENTED)
│   ├── layers/                  # Map layers
│   ├── lore/                    # Wiki lore
│   ├── characters/              # RPG characters
│   ├── gallery/                 # Images upload
│   ├── comments/                # Comments system
│   ├── search/                  # Search functionality
│   ├── export/                  # Export tools
│   ├── import/                  # Import system
│   ├── versions/                # Version history
│   ├── presence/                # Real-time collaboration
│   └── migrations/              # DB migrations
│
├── shared/                       # Shared code across features
│   ├── ui/                      # Generic UI components
│   │   ├── atoms/               # Button, Input, etc.
│   │   ├── molecules/           # Card, Badge, etc.
│   │   ├── organisms/           # Header, Footer, etc.
│   │   └── index.ts             # Barrel export
│   ├── components/              # Shared components
│   ├── lib/                     # Library code
│   │   ├── utils/               # Pure functions
│   │   ├── validation/          # Zod schemas
│   │   └── db.ts                # Prisma client
│   └── hooks/                   # Global hooks
│
├── config/                       # App configuration
│   └── site.ts                  # Site config
│
└── tests/                        # Test infrastructure
    └── setup.ts                 # Vitest setup (Next.js mocks)
```

---

## 🎯 State Management

| Type | Solution | Usage |
|------|----------|-------|
| **Server Data** | TanStack Query | Cache, sync DB, invalidation |
| **Client State** | Zustand | UI ephemeral (modals, filters) |
| **Form State** | React Hook Form + Zod | Validation, submission |

### TanStack Query Pattern

```typescript
// Query hook
export function useWorldsQuery() {
  return useQuery({
    queryKey: ['worlds'],
    queryFn: getWorldsByUser,
    staleTime: 1000 * 60 * 5 // 5 min
  })
}

// Mutation hook
export function useCreateWorld() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createWorld,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worlds'] })
    }
  })
}
```

---

## 💾 Database Schema

**Models:** User, GameWorld, WorldMember, Pin, LoreEntry, Character, GalleryItem, MapLayer, MapComment, MapVersion, ImportJob.

**Relations:** User → GameWorld (1:N), GameWorld → Pin/Lore/Character/Layer (1:N).

---

## ✅ Feature Status (v1.3.0)

| Feature | Status | Test Coverage | Quality |
|---------|--------|---------------|---------|
| Auth | ✅ Complete | Manual | Production-ready |
| Worlds | ✅ Complete | Manual | Production-ready |
| Pins | ✅ Complete | **64 tests** (98.92%) | Production-ready |
| Layers | ✅ Complete | Manual | Production-ready |
| Lore | ✅ Complete | Store tests | Production-ready |
| Characters | ✅ Complete | Store tests | Production-ready |
| Gallery | ✅ Complete | Store tests | Production-ready |
| Search | ✅ Complete | Store tests | Production-ready |
| Export | ✅ Complete | Manual | Production-ready |
| Import | ✅ Complete | Manual | Production-ready |
| Collaboration | ✅ Complete | Manual | Production-ready |
| Comments | ✅ Complete | Schema tests | Production-ready |
| Versions | ✅ Complete | Manual | Production-ready |

**Test Suite:** 685/685 tests passing (100%) ✅

---

## 🔧 Development Patterns

### Server Action Pattern

```typescript
// src/features/worlds/actions/create.ts
'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { WorldSchema } from '@/features/worlds/logic/world-schemas'
import { revalidatePath } from 'next/cache'

export async function createWorld(data: WorldInput) {
  const session = await auth()
  if (!session) {
    throw new Error('Unauthorized')
  }

  const validated = WorldSchema.parse(data)
  const world = await db.world.create({
    data: {
      ...validated,
      userId: session.user.id
    }
  })

  revalidatePath('/worlds')
  return world
}
```

### Zustand Store Pattern

```typescript
// src/features/pins/store/use-pins-store.ts
import { create } from 'zustand'

type PinsStore = {
  pins: Pin[]
  selectedPinId: string | null
  setSelectedPin: (id: string | null) => void
}

export const usePinsStore = create<PinsStore>((set) => ({
  pins: [],
  selectedPinId: null,
  setSelectedPin: (id) => set({ selectedPinId: id })
}))
```

---

## 📝 File Naming Conventions

- **Components:** `kebab-case.tsx` → `pin-marker.tsx`, `world-card.tsx`
- **Hooks:** `use-[feature].ts` → `use-pins-query.ts`, `use-world-data.ts`
- **Actions:** `[action].ts` → `create.ts`, `update.ts`, `delete.ts`
- **Tests:** `[name].test.ts` → `use-pin-drag.test.ts`
- **Barrel exports:** `index.ts` in every directory

---

## 🎨 Design Tokens

**Shadows:**
- `shadow-lg` - Floating elements (dropdowns, tooltips)
- `shadow-xl` - Modals, dialogs
- `shadow-2xl` - Critical elements (warnings, errors)

**Borders:**
- `border-2 border-accent-gold` - Active/selected state
- `border border-border-subtle` - Default state

**Radius:**
- `rounded-sm` - Default (NEVER use rounded-3xl without justification)
- `rounded` - Cards, buttons
- `rounded-full` - Badges, avatars

**Colors (CSS Variables):**
- `bg-background-base` - Primary background
- `text-text-primary` - Primary text
- `text-text-secondary` - Secondary text
- `border-border-subtle` - Borders

---

## 🚀 Quick Commands

```bash
# Development
npm run dev           # Start dev server

# Build
npm run build         # Production build
npm run start         # Start production server

# Quality
npm run lint          # ESLint
npm run typecheck     # TypeScript check
npm run test          # Vitest (all tests)
npm run test:ui       # Vitest UI

# Database
npm run db:push       # Push schema to DB
npm run db:studio     # Open Prisma Studio
npm run db:seed       # Seed database

# Deployment
npm run vercel        # Deploy to Vercel
```

---

## 📚 Documentation

- **[CHANGELOG.md](CHANGELOG.md)** - Release notes and version history
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Architecture diagrams
- **[docs/API.md](docs/API.md)** - Complete API documentation
- **[docs/PERFORMANCE.md](docs/PERFORMANCE.md)** - Performance analysis

---

## 🎯 Git Flow Convention

### Commit Format

```
TYPE: PROJECT_NAME - vX.Y.Z

- Change 1
- Change 2

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### Types

| Type | SemVer | Usage |
|------|--------|-------|
| **RELEASE** | MAJOR | Breaking changes |
| **UPDATE** | MINOR | New features |
| **PATCH** | PATCH | Bug fixes |
| **WIP** | - | Work in progress (local only) |

### Pre-commit Checklist

```bash
☐ npm run lint         # Linting OK
☐ npm run typecheck    # TypeScript OK
☐ npm run test         # Tests OK (685/685)
☐ No .env with secrets # Use $VARIABLE format
☐ Commit message format # TYPE: Project - vX.Y.Z
```

---

## 🔐 Security Rules

**CRITICAL:** Never commit actual secrets in `.env`

```bash
# ✅ CORRECT - Use variable placeholders
DATABASE_URL=$DATABASE_URL
NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# ❌ WRONG - Actual secrets
DATABASE_URL=postgresql://user:pass@host/db
NEXTAUTH_SECRET=actual_secret_value_here
```

**Always check:**
- `.env` uses `$VARIABLE` placeholders
- `.gitignore` excludes `.env.local`
- No secrets in commit history

---

**Last Updated:** v1.3.0 (2026-02-20)
**Test Coverage:** 685/685 tests passing (100%) ✅
