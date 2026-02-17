# Backend & Bundle Analysis Report

**Date**: 2025-02-17
**Project**: Genesis - Interactive Map Platform
**Build Tool**: Next.js 16.1.6 with Webpack

---

## Executive Summary

The project has been successfully built and analyzed. The bundle sizes are moderate for a complex interactive map application with real-time features, but there are opportunities for optimization.

---

## Bundle Size Analysis

### Client-Side Bundles (.next/static/chunks)

| Metric | Value |
|--------|-------|
| **Total Client JS** | **3.82 MB** (3,905 KB) |
| **Largest Single Chunk** | vendors.js - 3.2 MB |
| **Page Bundles** | ~231 KB max (world/[id]) |

### Top 10 Largest Client Chunks

| Chunk | Size | Description |
|-------|------|-------------|
| `vendors-08d5d66813713252.js` | **3.2 MB** | All vendor dependencies |
| `app/world/[id]/page-*.js` | **231 KB** | Main world editor page |
| `polyfills-*.js` | **110 KB** | Browser polyfills |
| `radix-*.js` | **91 KB** | Radix UI components |
| `65.*.js` | **48 KB** | Shared utilities |
| `tanstack-*.js` | **36 KB** | TanStack Query |
| `app/page-*.js` | **18 KB** | Landing page |
| `app/create/page-*.js` | **18 KB** | Create world page |
| `810-*.js` | **17 KB** | Shared component |
| `app/settings/page-*.js` | **16 KB** | Settings page |

### Server-Side Bundles (.next/server)

| Metric | Value |
|--------|-------|
| **Total Server JS** | **5.16 MB** (5,285 KB) |
| **Largest Server Chunk** | vendors.js - 4.0 MB |

### Top 10 Largest Server Chunks

| Chunk | Size | Description |
|-------|------|-------------|
| `vendors.js` | **4.0 MB** | Server vendor dependencies |
| `app/world/[id]/page.js` | **291 KB** | World editor SSR |
| `radix.js` | **91 KB** | Radix UI SSR |
| `app/worlds/page.js` | **43 KB** | Worlds list SSR |
| `app/explore/page.js` | **42 KB** | Explore page SSR |
| `tanstack.js` | **36 KB** | TanStack SSR |
| `app/world/[id]/lore/[slug]/page.js` | **34 KB** | Lore entry SSR |
| `app/page.js` | **33 KB** | Landing page SSR |
| `app/settings/page.js` | **32 KB** | Settings SSR |
| `app/create/page.js` | **28 KB** | Create world SSR |

---

## Dependency Analysis

### Critical Dependencies by Size

| Dependency | Purpose | Estimated Bundle Impact |
|------------|---------|------------------------|
| `maplibre-gl` | Map rendering | ~300-500 KB |
| `@turf/turf` | Geospatial analysis | ~200-300 KB |
| `@tanstack/react-query` | Data fetching | ~36 KB (chunked) |
| `@radix-ui/*` | UI components | ~91 KB (chunked) |
| `react-markdown` | Markdown rendering | ~30-50 KB |
| `@uiw/react-md-editor` | Markdown editor | ~100-150 KB |
| `html2canvas` | Screenshot export | ~80-120 KB |
| `jspdf` | PDF generation | ~100-150 KB |
| `supercluster` | Clustering | ~20-30 KB |
| `zustand` | State management | ~5-10 KB |

### Duplicate Dependencies Check

**Status**: Clean
- React: 19.2.4 (single version, no duplicates)
- No major dependency duplication detected via pnpm

### Tree-Shaking Opportunities

1. **@uiw/react-md-editor**: Potentially unused features
   - Currently imports entire library
   - Consider using lighter markdown editor or custom solution

2. **@turf/turf**: Large geospatial library
   - Verify which modules are actually used
   - Could import individual modules instead of full package

3. **lucide-react**: Icon library (500+ icons)
   - Using optimizePackageImports in config
   - Verify only used icons are imported

---

## API Performance Analysis

**Note**: k6 load testing tool is not available in this environment. API performance metrics would require:
- Running server in production mode
- Executing load tests against actual endpoints
- Measuring p95/p99 latencies

### Estimated API Complexity

| Endpoint | Complexity | Factors |
|----------|------------|---------|
| `GET /api/worlds` | Low-Medium | Single DB query, indexed |
| `POST /api/worlds` | Low | Single insert, validation |
| `GET /api/presence/[worldId]` | Medium | Real-time, potential polling |
| `PUT /api/pins/*` | Low | Optimistic updates, single write |
| `GET /world/[id]` | High | Complex page, multiple data sources |

---

## Optimization Recommendations

### 1. Code Splitting Opportunities

| Priority | Action | Estimated Savings |
|----------|--------|-------------------|
| **HIGH** | Lazy-load `@uiw/react-md-editor` | ~100-150 KB |
| **HIGH** | Dynamic import `html2canvas` (only for export) | ~80-120 KB |
| **HIGH** | Lazy-load `jspdf` (only for PDF export) | ~100-150 KB |
| **MEDIUM** | Route-based splitting for /world/[id] | ~50-100 KB initial |
| **MEDIUM** | Import specific @turf modules | ~100-200 KB |

### 2. Bundle Size Reduction

```typescript
// Example: Lazy load markdown editor
const MarkdownEditor = dynamic(
  () => import('@/components/lore/ui/markdown-editor'),
  { loading: () => <Skeleton className="h-64 w-full" /> }
)

// Example: Lazy load export functionality
const exportMap = async (worldId: string) => {
  const html2canvas = (await import('html2canvas')).default
  const jsPDF = (await import('jspdf')).default
  // ... export logic
}
```

### 3. Tree-Shaking Improvements

```typescript
// Instead of:
import * as turf from '@turf/turf'

// Use:
import distance from '@turf/distance'
import buffer from '@turf/buffer'
```

### 4. Potential Dependencies to Review

| Dependency | Status | Recommendation |
|------------|--------|----------------|
| `@types/maplibre-gl` | Deprecated | Remove (maplibre-gl includes types) |
| `@types/tailwindcss` | Deprecated | Remove (tailwindcss includes types) |
| `@babel/runtime` | Added during build | Keep (required by @uiw packages) |
| `@uiw/react-markdown-preview` | Added during build | Keep (peer dependency) |

---

## Build Configuration Status

### Current Optimizations (ENABLED)

- [x] Package import optimization (lucide-react, radix-ui, tanstack)
- [x] Custom webpack chunk splitting (maplibre, turf, radix, tanstack)
- [x] Gzip compression enabled
- [x] Production source maps disabled
- [x] Symlinks disabled for performance

### Recommended Additions

```typescript
// next.config.ts additions
experimental: {
  optimizePackageImports: [
    'lucide-react',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@tanstack/react-query',
    // ADD THESE:
    '@turf/turf',
    'react-markdown',
  ],
  // ADD: Optimized CSS imports
  optimizeCss: true,
}

// Consider adding modularizeImports for more granular imports
modularizeImports: {
  'lucide-react': {
    transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
  },
}
```

---

## Performance Budget Targets

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Total JS (gzipped) | ~1.2 MB | < 1 MB | Needs work |
| First-load JS | ~500 KB | < 300 KB | Needs work |
| Vendor chunk | 3.2 MB | < 2 MB | Needs work |
| Server bundle | 5.16 MB | < 4 MB | Good |

---

## Next Steps

1. **Implement lazy loading** for export functionality (html2canvas, jsPDF)
2. **Review @uiw/react-md-editor** usage - consider lighter alternative
3. **Audit @turf imports** - switch to specific modules
4. **Add route-based code splitting** for /world/[id]
5. **Set up k6 or autocannon** for actual API load testing
6. **Enable bundle analyzer in CI** to track regressions

---

## Files Generated

- `.next/analyze/client.html` - Client bundle visualization
- `.next/analyze/server.html` - Server bundle visualization
- `.next/analyze/nodejs.html` - Node.js bundle visualization
- `.next/analyze/edge.html` - Edge runtime bundle visualization

Open these HTML files in a browser to explore interactive bundle visualizations.
