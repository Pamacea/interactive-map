# Genesis - Interactive Map Platform

> **Version:** 1.0.0 | **Status:** Production-ready

## Project Identity

Plateforme web de création de cartes interactives pour mondes fantasy (RPG, romans, worldbuilding). Users ajoutent marqueurs, lore, personnages et collaborent.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind 4, Prisma, NextAuth, MapLibre, Zustand, TanStack Query.

---

## Architecture: ui/logic/methods (MANDATORY)

Toute feature suit cette séparation stricte :

```
components/[feature]/
├── ui/          # Présentation pur (props in, JSX out)
├── logic/       # Hooks custom, stores, utilities
└── methods/     # Server Actions, data mappers
```

**Règles :**
- UI = Aucune logique métier, max 50-70 lignes
- Logic = `use*` hooks, Zustand stores, calculs
- Methods = Server Actions avec auth + validation Zod

---

## State Management

| Type | Solution | Usage |
|------|----------|-------|
| **Server Data** | TanStack Query | Cache, sync DB, invalidation |
| **Client State** | Zustand | UI ephemeral (modals, filters) |
| **Form State** | React Hook Form + Zod | Validation, submission |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Login, register
│   ├── (dashboard)/       # Routes protégées
│   │   ├── worlds/        # Liste, création, édition
│   │   └── world/[id]/    # Éditeur de carte
│   └── api/               # API routes (webhooks)
│
├── components/
│   ├── ui/                # Shadcn components (réutilisables)
│   ├── pins/              # Marqueurs (FULLY IMPLEMENTED)
│   ├── lore/              # Wiki lore
│   ├── characters/        # Personnages RPG
│   ├── gallery/           # Images upload
│   └── world/             # Map editor
│
├── actions/               # Server Actions (DB writes)
│   ├── auth.ts
│   ├── worlds.ts
│   ├── pins.ts
│   └── ...
│
├── store/                 # Zustand stores
│   ├── use-pins-store.ts
│   ├── use-lore-store.ts
│   └── ...
│
├── hooks/                 # Global hooks
│   └── use-*.ts
│
└── lib/
    ├── auth.ts            # NextAuth config
    ├── db.ts              # Prisma client
    └── utils.ts           # Helpers
```

---

## Database Schema

**Models:** User, GameWorld, WorldMember, Pin, LoreEntry, Character, GalleryItem, MapLayer, MapComment, MapVersion, ImportJob.

**Relations:** User → GameWorld (1:N), GameWorld → Pin/Lore/Character/Layer (1:N).

---

## Feature Status (100% Complete)

| Feature | Status | Tests |
|---------|--------|-------|
| Auth | ✅ | NextAuth |
| Worlds | ✅ | Manual |
| Pins | ✅ | 64 tests, 98.92% |
| Layers | ✅ | Manual |
| Lore | ✅ | 0% |
| Characters | ✅ | 0% |
| Gallery | ✅ | 0% |
| Search | ✅ | 0% |
| Export | ✅ | 0% |
| Collaboration | ✅ | 0% |
| Comments | ✅ | 0% |
| Versions | ✅ | 0% |
| Import | ✅ | 0% |

---

## Development Patterns

### Server Action Pattern

```typescript
// actions/worlds.ts
"use server"

export async function createWorld(data: WorldInput) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  const validated = WorldSchema.parse(data)
  const world = await db.world.create({
    data: { ...validated, userId: session.user.id }
  })

  revalidatePath("/worlds")
  return world
}
```

### TanStack Query Pattern

```typescript
const { data: worlds } = useQuery({
  queryKey: ["worlds"],
  queryFn: () => getWorldsByUser(),
  staleTime: 1000 * 60 * 5
})
```

---

## File Naming

- **Components:** `kebab-case.tsx` → `world-card.tsx`
- **Hooks:** `use-[feature].ts` → `use-world-data.ts`
- **Actions:** `[resource].ts` → `worlds.ts`
- **Tests:** `[name].test.ts` → `use-pin-drag.test.ts`

---

## Design Tokens

**Shadows:** `shadow-lg` (floating), `shadow-xl` (modals), `shadow-2xl` (critical)

**Borders:** `border-2 border-accent-gold` (active), `border border-border-subtle` (default)

**Radius:** `rounded-sm` (default), jamais `rounded-3xl` non justifié

**Colors:** Variables CSS `:root` → `bg-background-base`, `text-text-primary`

---

## Quick Commands

```bash
npm run dev           # Dev server
npm run build         # Production build
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm run test          # Vitest
npm run db:push       # Prisma schema sync
npm run db:studio     # Prisma Studio
```

---

## References

- [PROGRESS.md](PROGRESS.md) - Feature details
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Diagrams
