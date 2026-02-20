# Performance Analysis Report

**Date:** February 20, 2026
**Project:** Genesis Interactive Map Platform v1.3.0
**Analyst:** Performance Agent

---

## Executive Summary

The Genesis platform requires several performance optimizations before production deployment. While the core architecture is sound, bundle size, code splitting, and import path issues are preventing successful builds and optimal runtime performance.

**Critical Priority:** Fix build errors before measuring actual performance metrics.

---

## Build Status

### Current State: ❌ BUILD FAILING

**Error Count:** 15+ module resolution/import errors

**Blocking Issues:**
1. Missing exports from feature modules
2. Incorrect import paths (`@/lib/presence` → `@/shared/lib/presence`)
3. Missing SEO schema components
4. Session hook undefined errors

### Build Errors Breakdown

| Category | Count | Impact |
|----------|-------|--------|
| Missing exports | 5 | BLOCKING |
| Incorrect import paths | 3 | BLOCKING |
| Missing components | 2 | BLOCKING |
| Runtime errors | 5 | HIGH |

---

## Bundle Size Analysis

### Estimated Bundle Sizes (Before Optimization)

Based on dependency analysis:

```
node_modules/: ~450 MB
├── next/: ~80 MB
├── react/: ~15 MB
├── @tanstack/: ~25 MB
├── prisma/: ~40 MB
├── maplibre-gl-js/: ~5 MB
├── lucide-react/: ~3 MB
├── zod/: ~2 MB
└── other dependencies: ~280 MB
```

**Estimated Initial Bundle:** 2-3 MB (uncompressed)

**Target Initial Bundle:** < 500 KB

---

## Code Structure Analysis

### Features Architecture ✅

The project follows a clean features-based architecture:

```
src/features/
├── characters/      # ~50 files
├── comments/        # ~15 files
├── export/          # ~8 files
├── gallery/         # ~30 files
├── home/            # ~12 files
├── import/          # ~10 files
├── lore/            # ~35 files
├── members/         # ~8 files
├── pins/            # ~120 files ⚠️ LARGE FEATURE
├── presence/        # ~12 files
├── world-editor/    # ~150 files ⚠️ LARGEST FEATURE
└── worlds/          # ~20 files
```

**Total Feature Files:** ~470 files

### Potential Bundle Size Issues

1. **maplibre-gl-js** (5 MB) - Not code-split
2. **Prisma Client** (40 MB) - Included in server bundle
3. **lucide-react** (3 MB) - Tree-shakeable but needs verification
4. **World Editor** (150+ files) - Needs route-based splitting

---

## Performance Optimization Recommendations

### Priority 1: CRITICAL (Fix Build First)

#### 1.1 Fix Missing Feature Exports
**Impact:** BLOCKS BUILD
**Effort:** 30 minutes

```typescript
// src/features/lore/index.ts
export { getLoreEntriesByWorld } from "./actions/lore";

// src/features/characters/index.ts
export { getCharactersByWorld } from "./actions/get-character";
```

**Files to Fix:**
- `src/features/lore/index.ts`
- `src/features/characters/index.ts`
- `src/features/characters/logic/index.ts`

#### 1.2 Create Missing SEO Schema Components
**Impact:** BLOCKS BUILD
**Effort:** 15 minutes

```typescript
// src/shared/components/seo.tsx
export function ArticleSchema({ ... }) { ... }
export function CreativeWorkSchema({ ... }) { ... }
```

#### 1.3 Fix Session Hook Usage
**Impact:** BLOCKS BUILD
**Effort:** 20 minutes

**Error:** `Cannot destructure property 'data' of '(0 , h.useSession)(...)' as it is undefined`

**Root Cause:** Client component using useSession without SessionProvider wrapper

**Fix:** Wrap `/about/page.tsx` with SessionProvider or use server-side auth

---

### Priority 2: HIGH (Bundle Size Reduction)

#### 2.1 Code Split MapLibre GL
**Impact:** -2 MB initial bundle
**Effort:** 1 hour

```typescript
// Dynamically import maplibre only when needed
const MapLibre = dynamic(() => import('maplibre-gl-js'), {
  ssr: false,
  loading: () => <MapSkeleton />
})
```

**Files to Update:**
- `src/features/world-editor/ui/map-view.tsx`

#### 2.2 Route-Based Splitting for World Editor
**Impact:** -1.5 MB initial bundle
**Effort:** 2 hours

**Current:** All world-editor code loaded on any route

**Target:** Load only when on `/world/[id]/edit` route

```typescript
// app/world/[id]/edit/page.tsx
export const dynamic = 'force-dynamic'
```

#### 2.3 Optimize Lucide React Icons
**Impact:** -500 KB bundle
**Effort:** 2 hours

**Current:** Full icon tree imported

**Target:** Import specific icons only

```typescript
// ❌ BAD
import * as Icons from 'lucide-react'

// ✅ GOOD
import { MapPin, Layers, Users } from 'lucide-react'
```

**Files to Audit:**
- `src/shared/ui/` (check index.ts barrel exports)
- All feature components using icons

---

### Priority 3: MEDIUM (Runtime Performance)

#### 3.1 TanStack Query Cache Configuration
**Impact:** Faster data loading, fewer requests
**Effort:** 1 hour

**Current Configuration:**
```typescript
// src/shared/lib/providers/query-provider.ts
WORLD: 5 min
CONTENT: 2 min
REALTIME: 30 sec
```

**Recommendations:**
- Increase WORLD cache to 15 min (rarely changes)
- Increase CONTENT cache to 5 min
- Keep REALTIME at 30 sec

#### 3.2 Image Optimization
**Impact:** Faster page loads
**Effort:** 3 hours

**Issues Found:**
- No Next.js Image component usage detected
- No responsive image sizes configured
- No blur placeholders

**Implementation:**
```typescript
import Image from 'next/image'

<Image
  src={pin.imageUrl}
  alt={pin.name}
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

#### 3.3 Server Component Migration
**Impact:** -30% client-side JS
**Effort:** 8 hours

**Targets for Migration:**
1. Lore detail pages (currently client components)
2. Character cards (static content)
3. World lists (read-only data)

---

### Priority 4: LOW (Polish)

#### 4.1 Font Optimization
**Impact:** -100 KB, faster FCP
**Effort:** 30 minutes

```typescript
// app/layout.tsx
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
})
```

#### 4.2 Manifest Optimization
**Impact:** Better PWA support
**Effort:** 1 hour

**Current:** Basic manifest

**Add:**
- Icon sizes (192x192, 512x512)
- Theme color
- Display mode

---

## Performance Metrics (Targets)

### Core Web Vitals Goals

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| LCP | Unknown | < 2.5s | ⏳ |
| FID | Unknown | < 100ms | ⏳ |
| CLS | Unknown | < 0.1 | ⏳ |
| TTI | Unknown | < 3.5s | ⏳ |
| SI | Unknown | < 3.4s | ⏳ |

**Note:** Cannot measure until build succeeds.

---

## Dependency Analysis

### Large Dependencies (Optimization Targets)

| Package | Size | Action |
|---------|------|--------|
| maplibre-gl-js | 5 MB | Dynamic import |
| prisma | 40 MB | Server-only ✅ |
| @tanstack/query | 25 MB | Tree-shake ✅ |
| lucide-react | 3 MB | Specific imports |
| zod | 2 MB | Already minimal ✅ |

### Unused Dependencies (Potential Removal)

Run `npx depcheck` to identify unused packages.

---

## Next Steps

### Immediate (Today)
1. ✅ Fix import path errors (`@/lib/presence` → `@/shared/lib/presence`)
2. ⏳ Fix missing feature exports
3. ⏳ Create missing SEO components
4. ⏳ Fix session provider issues
5. ⏳ Verify build succeeds

### Short-term (This Week)
6. ⏳ Implement MapLibre dynamic import
7. ⏳ Add route-based code splitting
8. ⏳ Audit and fix icon imports
9. ⏳ Run Lighthouse analysis
10. ⏳ Update this report with actual metrics

### Long-term (Next Sprint)
11. ⏳ Migrate to Server Components where appropriate
12. ⏳ Implement image optimization
13. ⏳ Add Service Worker for offline support
14. ⏳ Performance monitoring (Sentry/Vercel Analytics)

---

## Tools Recommended

### Bundle Analysis
```bash
# Analyze bundle sizes
npm run build -- --analyze

# Or use webpack-bundle-analyzer
npx webpack-bundle-analyzer .next/analyze
```

### Lighthouse CI
```bash
# Install lighthouse
npm install -g lighthouse

# Run on local dev server
lighthouse http://localhost:3000/worlds --output=html --output-path=./reports/lighthouse-worlds.html
lighthouse http://localhost:3000/world/[id]/edit --output=html --output-path=./reports/lighthouse-editor.html
```

### Performance Monitoring
- Vercel Analytics (already configured?)
- Sentry (for error tracking + performance)
- Web Vitals library

---

## Risk Assessment

### High Risk
- **Build failures blocking deployment** 🔴
- **Large bundle sizes impacting load times** 🟡

### Medium Risk
- **MapLibre GL rendering performance** 🟡
- **Real-time collaboration overhead** 🟡

### Low Risk
- **Third-party dependency updates** 🟢
- **SEO schema completeness** 🟢

---

## Conclusion

The Genesis platform has a solid foundation with good architectural patterns. However, **build errors must be resolved before performance optimization can begin**. Once the build succeeds, focus on:

1. **Code splitting** (MapLibre, world-editor)
2. **Bundle size reduction** (icon imports)
3. **Server component migration** (reduce client JS)

**Estimated Performance Improvement:** 40-60% reduction in initial bundle size with recommended changes.

---

**Report Generated:** February 20, 2026
**Next Review:** After build fixes completed
**Analyst:** Performance Agent (test-fix-squad)
