# Prisma Build Error - Quick Fix Guide

**Issue:** Production build fails with "Module not found" errors for Node.js modules (`dns`, `fs`, `net`, `tls`)

**Root Cause:** Prisma client with PostgreSQL adapter is being bundled into client components that import types from `@prisma/client`.

**Build Error:**
```
Module not found: Can't resolve 'dns'
Module not found: Can't resolve 'fs'
Module not found: Can't resolve 'net'
Module not found: Can't resolve 'tls'

Import trace:
  → node_modules/pg/lib/connection-parameters.js
  → node_modules/pg/lib/client.js
  → node_modules/pg/lib/index.js
  → src/lib/prisma.ts
  → Client Component Browser
```

---

## Solution: Replace Prisma Type Imports

The issue is that client components are importing types from `@prisma/client`, which pulls in the entire Prisma client including PostgreSQL dependencies.

### Step 1: Create Type Definitions

Create `src/types/pin-types.ts` (or use existing `src/types/pin.type.ts`):

```typescript
/**
 * Pin types - mirror of Prisma schema
 * These types are used in client components to avoid importing Prisma
 */

export enum PinTypeEnum {
  CITY = "CITY",
  VILLAGE = "VILLAGE",
  POI = "POI",
  CHARACTER = "CHARACTER",
  DUNGEON = "DUNGEON",
  SHOP = "SHOP",
  QUEST = "QUEST",
  TREASURE = "TREASURE",
  CUSTOM = "CUSTOM",
}

export interface Pin {
  id: string;
  worldId: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
  pinType: PinTypeEnum;
  size: number;
  color: string;
  isVisible: boolean;
  layerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  layer?: {
    id: string;
    isVisible: boolean;
    zIndex: number;
  } | null;
}

// If you need PinType from Prisma
export type PinType = PinTypeEnum;
```

### Step 2: Update Client Components

Replace all `import type { Pin } from "@prisma/client"` in client components:

**Files to update:**

1. **src/components/pins/ui/pin-marker.tsx**
   ```typescript
   // Before
   import type { Pin } from "@prisma/client";

   // After
   import type { Pin } from "@/types/pin-types";
   ```

2. **src/components/pins/ui/pin-list.tsx**
   ```typescript
   // Before
   import type { Pin } from "@prisma/client";

   // After
   import type { Pin } from "@/types/pin-types";
   ```

3. **src/components/pins/ui/pin-popup.tsx**
   ```typescript
   // Before
   import type { Pin } from "@prisma/client";

   // After
   import type { Pin } from "@/types/pin-types";
   ```

4. **src/components/world/ui/map-canvas.tsx**
   ```typescript
   // Before
   import type { Pin } from "@prisma/client";

   // After
   import type { Pin } from "@/types/pin-types";
   ```

5. **src/stores/use-pins-store.ts**
   ```typescript
   // Before
   import type { Pin, PinType } from "@prisma/client";

   // After
   import type { Pin, PinType } from "@/types/pin-types";
   ```

### Step 3: Keep Server Imports Unchanged

Do NOT change these files (they are Server Components or Server Actions):

- ✅ `src/lib/prisma.ts` - Keep importing from `@prisma/client`
- ✅ `src/actions/pins.ts` - Keep importing from `@prisma/client`
- ✅ `src/actions/worlds.ts` - Keep importing from `@prisma/client`
- ✅ `src/app/api/auth/[...nextauth]/route.ts` - Keep importing from `@prisma/client`
- ✅ `src/app/api/worlds/route.ts` - Keep importing from `@prisma/client`

These files run on the server, so they can safely import Prisma.

### Step 4: Verify Build

```bash
# Run typecheck to ensure no type errors
npm run typecheck

# Run production build
npm run build
```

**Expected result:** Build succeeds without module resolution errors.

---

## Why This Works

### Before (Problematic)
```
Client Component
  ↓
import type { Pin } from "@prisma/client"
  ↓
Bundler follows import to @prisma/client
  ↓
@prisma/client imports @prisma/adapter-pg
  ↓
@prisma/adapter-pg imports pg (PostgreSQL client)
  ↓
pg imports Node.js modules (dns, fs, net, tls)
  ↓
ERROR: Browser doesn't have these modules!
```

### After (Fixed)
```
Client Component
  ↓
import type { Pin } from "@/types/pin-types"
  ↓
Bundler follows import to pin-types.ts
  ↓
pin-types.ts exports TypeScript interfaces only
  ↓
NO runtime dependencies
  ↓
SUCCESS: Pure types, no Node.js modules!
```

---

## Alternative Solution: Server Component Boundary

If you prefer not to duplicate type definitions, you can move all data fetching to Server Components and pass only serialized data to Client Components.

**Example:**

```typescript
// Server Component (can import Prisma)
async function WorldPage({ params }) {
  const pins = await prisma.pin.findMany({ ... });

  return (
    <WorldClient pins={pins} />
  );
}

// Client Component (receives plain data)
"use client";
function WorldClient({ pins }) {
  // pins is plain JSON, no Prisma types needed
}
```

**Trade-off:** More complex component architecture, but no type duplication.

---

## Verification Checklist

- [ ] Created `src/types/pin-types.ts` with all necessary interfaces
- [ ] Updated all 5 client components to import from `@/types/pin-types`
- [ ] Verified server components still import from `@prisma/client`
- [ ] Run `npm run typecheck` - must pass
- [ ] Run `npm run build` - must succeed
- [ ] Test application locally to ensure pins still work
- [ ] Deploy to staging environment

---

## Estimated Time

- **Type definition creation:** 10 minutes
- **Component updates:** 10 minutes
- **Testing:** 10 minutes
- **Total:** ~30 minutes

---

## Common Pitfalls

### 1. Forgetting to Update One File

**Problem:** Build still fails because one client component still imports Prisma.

**Solution:** Use grep to find all imports:
```bash
grep -r "from \"@prisma/client\"" src/components
```

### 2. Type Mismatches

**Problem:** New types don't match Prisma schema exactly.

**Solution:** Copy types directly from Prisma generated types:
```bash
npx prisma generate
# Check node_modules/.prisma/client/index.d.ts for exact types
```

### 3. Missing Layer Relation

**Problem:** Pin interface doesn't include layer relation.

**Solution:** Add nested types to interface:
```typescript
export interface Pin {
  // ... other fields
  layer?: {
    id: string;
    isVisible: boolean;
    zIndex: number;
  } | null;
}
```

---

## Need Help?

If the build still fails after following this guide:

1. Check the error message for the specific file causing the issue
2. Verify it's a client component (has "use client" directive)
3. Ensure it's importing from `@/types/pin-types`, not `@prisma/client`
4. Run `npm run build --debug` for more detailed error information

---

**Guide Created By:** SMITE Finalize Agent
**Created:** 2026-01-13
**Difficulty:** Beginner
**Estimated Time:** 30 minutes
**Impact:** CRITICAL - Unblock production deployment
