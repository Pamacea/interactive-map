# Review Findings - 05_EXAMINE

## Critical Issues (Must Fix)

### 1. Missing `useScale` Import - CRITICAL
**File**: `src/components/world/ui/floating/floating-header.tsx`
**Line**: 28

**Issue**: `useScale()` is called but not imported.

**Fix**: Add to imports on line 4:
```typescript
import { useScale, useMapStore } from "@/stores/map-store";
```

---

## High Priority Issues (Should Fix)

### 2. Pointer Capture Not Released - HIGH
**File**: `src/components/world/logic/use-floating-panel.ts`
**Lines**: 73-74, 96-97

**Issue**: `setPointerCapture()` is called but `releasePointerCapture()` is never called.

**Fix**: Add release in `handlePointerUp`:
```typescript
const handlePointerUp = (e: PointerEvent) => {
  const target = e.target as HTMLElement;
  if (target.hasPointerCapture(e.pointerId)) {
    target.releasePointerCapture(e.pointerId);
  }
  // ... rest of cleanup
};
```

### 3. Race Condition in Drag/Resize - HIGH
**File**: `src/components/world/logic/use-floating-panel.ts`
**Line**: 192-204

**Issue**: useEffect has `panelState.size` in dependencies, causing listener re-attachment during resize.

**Fix**: Use refs for values that change during drag:
```typescript
const constraintsRef = useRef({ minWidth, maxWidth, minHeight, maxHeight });
constraintsRef.current = { minWidth, maxWidth, minHeight, maxHeight };
```

### 4. Z-Index Conflict with Existing UI - HIGH
**File**: Multiple

**Issue**: Floating panels (z-20 to z-25) are below pin popups (z-50). Active panels should be above popups.

**Fix**: Either:
- Increase floating panel base z-index to 40
- Or decrease pin popup z-index to 25

---

## Medium Priority Issues

### 5. Boundary Constraint Edge Case
**File**: `src/components/world/logic/use-floating-panel.ts`

**Issue**: Panel can be dragged mostly off-screen (only 50px visible). `panelHeight` calculated but not used.

**Fix**: Use `panelHeight` in boundary calculation for Y-axis.

### 6. Z-Index Overflow Risk
**File**: `src/store/use-floating-panels-store.ts`

**Issue**: `maxZIndex` grows unbounded. Could hit integer limits.

**Fix**: Add z-index ceiling (e.g., 1000) and normalization logic.

### 7. Missing Window Resize Handler
**File**: `src/components/world/logic/use-floating-panel.ts`

**Issue**: Panels don't reposition when window resizes.

**Fix**: Add window resize listener to clamp panel positions.

### 8. Unused Variable
**File**: `src/components/world/ui/floating/floating-header.tsx`

**Issue**: `scale` destructured on line 88 but never used.

**Fix**: Remove unused destructuring.

### 9. Hardcoded Offset in Content Height
**File**: `src/components/world/ui/floating/floating-panel.tsx`

**Issue**: `40px` offset hardcoded in content area calculation.

**Fix**: Use CSS flexbox or measure header height dynamically.

---

## Low Priority Issues

### 10. Duplicate Store Access Pattern
**File**: `src/components/world/logic/use-floating-panel.ts`

**Issue**: Multiple separate selector calls to same store.

**Fix**: Use shallow comparison or single selector.

### 11. No ARIA Expanded on Collapse Button
**File**: `src/components/world/ui/floating/floating-panel.tsx`

**Issue**: Collapse button missing `aria-expanded` attribute.

**Fix**: Add `aria-expanded={isCollapsed}` to collapse button.

### 12. Persisted State Versioning
**File**: `src/store/use-floating-panels-store.ts`

**Issue**: No schema versioning for localStorage migrations.

**Fix**: Add `version: 1` and `migrate` function to persist config.

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High | 3 |
| Medium | 5 |
| Low | 3 |

**Total Issues Found**: 12

**Priority Fix Order**:
1. Fix missing `useScale` import (Critical - breaks app)
2. Fix pointer capture release (High - affects UX)
3. Fix race condition (High - affects drag/resize)
4. Reconsider z-index hierarchy (High - overlay conflicts)
5. Address medium priority items
