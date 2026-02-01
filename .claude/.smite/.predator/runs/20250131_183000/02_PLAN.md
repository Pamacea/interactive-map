# Implementation Plan: Explore Page Performance Optimization

## Objective
Reduce `/explore` page response time to under 50ms compile + 50ms render by optimizing database queries, implementing caching, and reducing component render overhead.

## Files to Create

### 1. `src/lib/cache.ts`
- **Purpose:** Implement data caching wrapper using Next.js unstable_cache
- **Dependencies:** `next/cache`
- **Size:** Small (~50 lines)

### 2. `src/lib/db-utils.ts`
- **Purpose:** Database query utilities with optimized selects
- **Dependencies:** `@prisma/client`
- **Size:** Small (~80 lines)

## Files to Modify

### 1. `src/actions/worlds.ts`
- **Changes:**
  - Replace `getAllWorlds()` with optimized version
  - Add pagination support (limit/offset)
  - Add caching layer with revalidation
  - Use explicit `select` instead of `include` for better performance
- **Risk:** Medium - Core data fetching logic
- **Dependencies Affected:** `src/app/explore/page.tsx`

### 2. `src/app/explore/page.tsx`
- **Changes:**
  - Add ISR revalidation (60 seconds)
  - Pass pagination params if needed
  - Add error boundary
- **Risk:** Low - Simple wrapper changes
- **Dependencies Affected:** None

### 3. `prisma/schema.prisma`
- **Changes:**
  - Add composite index on `GameWorld(isPublic, createdAt)`
  - Add index on `GameWorld(isPublic, updatedAt)` for sorting flexibility
- **Risk:** Low - Index additions are safe
- **Dependencies Affected:** Requires migration

### 4. `src/components/ui/world-card.tsx`
- **Changes:**
  - Wrap in React.memo with proper comparison
  - Add Next.js Image priority/placeholder props
- **Risk:** Low - Performance optimization only
- **Dependencies Affected:** None

### 5. `src/components/ui/particles.tsx`
- **Changes:**
  - Reduce particle count from 500 to 100
  - Add CSS-based alternative for low-end devices
  - Lazy load using dynamic import
- **Risk:** Low - Visual change, minor UX impact
- **Dependencies Affected:** `src/app/explore/page.tsx`

### 6. `src/lib/prisma.ts`
- **Changes:**
  - Configure connection pool settings
  - Add connection timeout settings
- **Risk:** Low - Configuration change
- **Dependencies Affected:** All Prisma usage

## Acceptance Criteria

### Functional Requirements
- [ ] Page renders in under 100ms total (compile + render) cached
- [ ] Page renders in under 300ms total on first visit (uncached)
- [ ] Pagination limits initial load to 12 worlds
- [ ] ISR cache revalidates every 60 seconds
- [ ] Database indexes added for queried fields

### Non-Functional Requirements
- [ ] Code passes linting
- [ ] Code passes typecheck
- [ ] Build succeeds
- [ ] No console errors in browser
- [ ] Existing functionality preserved

### Quality Standards
- [ ] Follows existing patterns
- [ ] No console.log statements
- [ ] Proper error handling
- [ ] Clear variable names

## Implementation Order

### Phase 1: Database Layer (Foundation)
1. [ ] Add database indexes to `schema.prisma`
2. [ ] Run migration to apply indexes
3. [ ] Optimize Prisma connection pool settings
4. [ ] Create optimized `getAllWorlds()` with pagination and caching

### Phase 2: Page Layer (Integration)
5. [ ] Update `page.tsx` with ISR revalidation
6. [ ] Add error boundary for robustness
7. [ ] Test page load performance

### Phase 3: Component Layer (Polish)
8. [ ] Memoize WorldCard component
9. [ ] Optimize Image components
10. [ ] Reduce particle count and lazy load
11. [ ] Final performance testing

## Risk Assessment

### High Risk Items
- None identified

### Medium Risk Items
- Database migration for indexes - Mitigation: Run in dev first, test
- Caching layer may serve stale data - Mitigation: 60s revalidation is reasonable

### Low Risk Items
- Component memoization - purely additive, no behavior change
- Particle reduction - minor visual change
- Connection pool tuning - conservative defaults

## Performance Targets

| Metric | Current | Target |
|--------|---------|--------|
| Compile (cached) | 5-40ms | <10ms |
| Render (cached) | 300-1600ms | <50ms |
| Compile (uncached) | 5-250ms | <50ms |
| Render (uncached) | 300-1600ms | <200ms |
| Total (cached) | 300-1650ms | <100ms |
| Total (uncached) | 300-1650ms | <300ms |

## Technical Implementation Details

### Database Query Optimization
```typescript
// Before: N+1 queries with _count
include: { _count: { select: { pins: true, loreEntries: true } } }

// After: Single optimized query with explicit select
select: {
  id: true, title: true, description: true, map: true,
  createdAt: true, updatedAt: true,
  user: { select: { name: true, image: true } },
  pins: { select: { id: true }, take: 1 }, // For count
  // Or use raw SQL with COUNT for better performance
}
```

### Caching Strategy
```typescript
// ISR at page level
export const revalidate = 60;

// Data-level caching (backup)
import { unstable_cache } from "next/cache";
const getCachedWorlds = unstable_cache(
  async () => prisma.gameWorld.findMany(...),
  ["worlds", "public"],
  { revalidate: 60 }
);
```

### Component Memoization
```typescript
export const WorldCard = memo(function WorldCard(props) {
  // ...
}, (prev, next) => {
  return prev.id === next.id &&
         prev.title === next.title &&
         prev._count === next._count;
});
```

## Migration Plan

### Database Migration
```bash
npx prisma migrate dev --name add_explore_page_indexes
```

### Testing Steps
1. Start dev server: `pnpm dev`
2. Navigate to `/explore`
3. Check browser DevTools Network tab
4. Verify response times in terminal
5. Test pagination if implemented
6. Verify ISR works (reload should be faster)
