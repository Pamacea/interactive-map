# Realm Forge - Interactive Map Platform

## Project Overview

Realm Forge is a web-based platform for creating and sharing interactive fantasy world maps. Users can build rich maps with custom pins, lore entries, image galleries, and collaborative layers. Built for writers, DMs, and worldbuilders to bring their fictional realms to life.

**Tech Stack**: Next.js 16 (App Router), TypeScript 5.9, Tailwind CSS 4, Prisma ORM, NextAuth.js, MapLibre GL, Zustand, TanStack Query.

**Current Status**: ~45% complete. Core authentication, world CRUD, and map editor with layers are functional. Pins, lore, and gallery schemas exist but lack UI.

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
│   └── world/                    # World editor feature
│       ├── ui/                   # Editor UI (map, sidebar, controls)
│       ├── logic/                # Editor state, hooks
│       └── methods/              # Map actions, layer operations
│
├── actions/                      # Server Actions (database writes)
│   ├── auth.ts                   # Auth operations
│   └── worlds.ts                 # World CRUD operations
│
├── lib/                          # Core utilities
│   ├── auth.ts                   # NextAuth config
│   ├── db.ts                     # Prisma client
│   ├── utils.ts                  # Helper functions
│   └── valid-data.ts             # Data validation utilities
│
├── store/                        # Zustand stores
│   └── use-sidebar.ts            # Sidebar state
│
└── types/                        # TypeScript types (if Prisma not enough)

prisma/
└── schema.prisma                 # Database schema (User, World, Pin, Lore, etc.)
```

### Database Schema

**Models**: User, Account, Session (NextAuth), World, Pin, LoreEntry, ImageGallery, Layer.

**Key Relations**: User → World (1:N), World → Pin/Lore/Layer (1:N).

**Ready for UI**: Pin, LoreEntry, ImageGallery (schema exists, no components yet).

---

## Features

### Implemented

- **Authentication**: Login, register, session management (NextAuth.js)
- **World Management**: Create, list, view, edit, delete worlds
- **World Editor**: Interactive map with MapLibre GL
- **Layers System**: Add, remove, toggle layers (stored in DB)
- **Responsive UI**: Mobile-friendly design with Tailwind CSS

### Partial (Schema Ready, UI Missing)

- **Pins**: Mark locations on map with titles, descriptions
- **Lore Entries**: Rich text content linked to map locations
- **Image Gallery**: Upload and organize images per world

### Future

- **Collaboration**: Multi-user editing, permissions
- **Search**: Full-text search across worlds
- **Templates**: Starter world templates
- **Export**: Export maps as images, PDF, or JSON

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
```

### Styling Conventions

- **Tailwind v4**: Use `@import "tailwindcss"` in globals.css
- **Theme**: Custom colors in `:root` (bg-background-base, text-text-primary, etc.)
- **Responsive**: Mobile-first, use `md:`, `lg:` breakpoints
- **Dark Mode**: Use `dark:` prefix (currently configured)

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
