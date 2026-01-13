# Console Log Cleanup Report

**Generated:** 2026-01-13
**Total Files with Console Statements:** 16
**Severity:** LOW (Development acceptable, production should use proper logging)

---

## Files Requiring Cleanup

### 1. src/components/world/ui/map-canvas.tsx

**Lines:** 43-49, 218, 232-233, 248-256, 262-269, 272-279, 283-289, 300-334, 450-488

**Console Statements:**
```typescript
// Debug logging for props
console.log("[DEBUG MapCanvas] Props received:", { ... });

// Debug logging for pin type selection
console.log("📌 [handleSelectPinType] Called with:", { ... });
console.log("📌 [handleSelectPinType] State updates completed");

// Debug logging for image loading
console.log("[DEBUG MapCanvas] Image loaded successfully!");
console.log("[DEBUG MapCanvas] Image dimensions:", dimensions);
console.log("[DEBUG MapCanvas] Image failed to load!", { ... });
console.log("[DEBUG MapCanvas] mapImage changed, resetting load state", { ... });
console.log("[DEBUG MapCanvas] Render state:", { ... });

// Debug logging for pin filtering
console.log(`📌 [map-canvas] Pin "${pin.title}" filtered out: isVisible=false`);
console.log(`📌 [map-canvas] Pin "${pin.title}" filtered out: layer ${pin.layerId} not visible`, { ... });
console.log("📌 [map-canvas] Pin filtering:", { ... });
console.log("📌 [map-canvas] About to render PinMarkers:", { ... });
console.log(`📌 [map-canvas] Rendering PinMarker for "${pin.title}"`, { ... });
```

**Recommendation:**
- Keep error logs (line 262)
- Remove all debug logs before production
- Consider replacing with proper logging library for production

---

### 2. src/components/pins/ui/pin-marker.tsx

**Lines:** 56-73, 100-112, 194-201

**Console Statements:**
```typescript
// Debug logging for pin rendering
console.log(`📌 [pin-marker] Rendering pin "${pin.title}"`, { ... });
console.log(`📌 [pin-marker] Skipping pin "${pin.title}" - not visible`, { ... });
console.log(`📌 [pin-marker] Pin "${pin.title}" coordinates:`, { ... });

// Success/error logging for position save
console.log("📌 [pin-marker] Pin position saved:", { ... });
console.error("📌 [pin-marker] Failed to save pin position:", error);
```

**Recommendation:**
- Keep error logs (line 200)
- Remove debug logs before production

---

### 3. src/hooks/use-autosave.ts

**Lines:** 36, 63, 70, 74, 81, 88, 105, 115, 122, 129

**Console Statements:**
```typescript
// Error logging
console.error("[useAutosave] Auth check failed:", error);

// Info logging for save operations
console.log("[useAutosave] Save skipped - not enabled or not authenticated");
console.log("[useAutosave] No changes detected, skipping save");
console.log("[useAutosave] Manual save triggered for:", key);
console.log("[useAutosave] Save successful for:", key);
console.error("[useAutosave] Save failed for:", key, error);
console.log("[useAutosave] Data changed for:", key, "- scheduling save");
console.log("[useAutosave] Autosave triggered for:", key);
console.log("[useAutosave] Autosave successful for:", key);
console.error("[useAutosave] Autosave failed for:", key, error);
```

**Recommendation:**
- **KEEP ALL LOGS** - These are critical for debugging autosave behavior
- Consider replacing with proper logging library (e.g., `pino`) for production
- Add log level filtering (only warn/error in production)

---

### 4. src/components/pins/ui/pin-action-dropdown.tsx

**Lines:** 64, 70

**Console Statements:**
```typescript
// TODO placeholders
console.log("Import from CSV - Coming soon");
console.log("Duplicate Existing - Coming soon");
```

**Recommendation:**
- Remove these placeholder logs when features are implemented
- They serve as useful reminders during development

---

### 5. src/components/world/ui/properties-panel.tsx

**Lines:** 62

**Console Statements:**
```typescript
// Error logging
console.error("Failed to update pin:", error);
```

**Recommendation:**
- **KEEP** - Critical error logging
- Consider adding error tracking (Sentry, LogRocket)

---

### 6-16. Remaining Files

**Files:**
- `src/components/world/ui/world-client.tsx`
- `src/actions/worlds.ts`
- `src/components/pins/ui/pin-create-form.tsx`
- `src/components/pins/logic/use-pins.ts`
- `src/actions/pins.ts`
- `src/components/pins/ui/pin-context-menu.tsx`
- `src/components/create/ui/create-world-form.tsx`
- `src/components/create/methods/create-world.ts`
- `src/stores/map-store.ts`
- `src/app/world/[id]/page.tsx`
- `src/components/pins/ui/pin-edit-form.tsx`

**Console Statements:**
- Mix of debug logs, error logs, and info logs
- Pattern: `[DEBUG ComponentName]`, `📌 [feature-name]`, `console.error`

**Recommendation:**
- Keep all error logs
- Remove all debug logs before production
- Review info logs on case-by-case basis

---

## Cleanup Priority

### P0 - Must Remove Before Production

1. **All `console.log` debug statements** (marked with `[DEBUG]` or `📌`)
   - These expose internal state and can leak sensitive information
   - Impact: Security + Performance

2. **TODO placeholder logs** (pin-action-dropdown.tsx)
   - Not useful in production
   - Impact: Code cleanliness

### P1 - Should Replace

3. **Info logs for critical operations** (use-autosave.ts)
   - Useful for debugging but should use proper logging
   - Replace with: `pino`, `winston`, or `console` with log level filtering
   - Impact: Observability

### P2 - Keep

4. **Error logs** (all files)
   - Critical for error tracking
   - Consider integrating with error tracking service (Sentry)
   - Impact: Debugging + Monitoring

---

## Recommended Solution

### Option 1: Simple Cleanup (Quick Fix)

```bash
# Remove all debug logs before production
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '/console\.log.*\[DEBUG/d'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '/console\.log.*📌/d'
```

**Time:** 5 minutes
**Risk:** Low (only removes debug logs)

---

### Option 2: Logging Library (Production-Ready)

```bash
npm install pino pino-pretty
```

Create `src/lib/logger.ts`:
```typescript
import pino from 'pino';

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty' }
    : undefined,
});
```

Replace console statements:
```typescript
// Before
console.log("[DEBUG] Feature:", data);
console.error("Error:", error);

// After
logger.debug({ data }, "Feature");
logger.error({ error }, "Error");
```

**Time:** 1-2 hours
**Risk:** Low (standard pattern)
**Benefits:** Log levels, structured logging, production-ready

---

### Option 3: Environment-Based Wrapper (Middle Ground)

Create `src/lib/logger.ts`:
```typescript
const isDev = process.env.NODE_ENV !== 'production';

export const logger = {
  debug: (...args: any[]) => {
    if (isDev) console.log('[DEBUG]', ...args);
  },
  info: (...args: any[]) => {
    if (isDev) console.info('[INFO]', ...args);
  },
  warn: (...args: any[]) => console.warn('[WARN]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
};
```

**Time:** 30 minutes
**Risk:** Low
**Benefits:** Simple, no dependencies, auto-filters debug logs in production

---

## Recommended Action Plan

1. **Immediate (Pre-Production):**
   - Use Option 1 to remove all debug logs
   - Keep all error logs
   - Time: 5 minutes

2. **Short Term (Next Sprint):**
   - Implement Option 3 (environment-based wrapper)
   - Replace remaining console statements with logger
   - Time: 30 minutes

3. **Long Term (Future):**
   - Consider Option 2 (pino) if advanced logging needs emerge
   - Add error tracking (Sentry, LogRocket)
   - Time: 1-2 hours

---

## Estimated Effort

- **Quick cleanup:** 5 minutes (remove debug logs)
- **Wrapper implementation:** 30 minutes
- **Full logging library:** 1-2 hours

**Recommendation:** Start with quick cleanup, implement wrapper in next sprint.

---

**Report Generated By:** SMITE Finalize Agent
**Report Date:** 2026-01-13
**Next Review:** After cleanup implementation
