# Review Findings

## Critical Issues (Must Fix)

### 1. Unbounded Pagination Parameters
**Agent:** Security Reviewer
**File:** `src/actions/worlds.ts`
**Issue:** The `limit` and `offset` parameters are not validated
- A user could pass `limit: 9999999` causing memory exhaustion
- Negative values could cause database errors
**Recommendation:** Add validation:
```typescript
const limit = Math.min(Math.max(options?.limit ?? 24, 1), 100);
const offset = Math.max(options?.offset ?? 0, 0);
```

## High Priority (Should Fix)

### 2. Cache Key Pollution Risk
**Agent:** Security Reviewer
**File:** `src/actions/worlds.ts`
**Issue:** The cache key includes user-provided values without sanitization
**Recommendation:** This is low-risk since values are numbers, but could use clamping

### 3. Memory Usage with Pin/Lore Fetching
**Agent:** Code Quality Reviewer
**File:** `src/actions/worlds.ts`
**Issue:** Fetching all pins/lore entries IDs for counting could use significant memory as worlds grow
**Recommendation:** For production with thousands of entries, consider using raw SQL COUNT

## Medium Priority (Consider Fixing)

### 4. React.memo Comparison May Be Too Strict
**Agent:** Logic Reviewer
**File:** `src/components/ui/world-card.tsx`
**Issue:** The memo comparison only checks id, title, and counts but not description or map
**Recommendation:** Current approach is fine for the use case; description rarely changes

### 5. Particle Frame Throttling May Look Choppy
**Agent:** Code Quality Reviewer
**File:** `src/components/ui/particles.tsx`
**Issue:** 2:1 frame throttling at 60fps = 30fps updates, may be visible
**Recommendation:** Consider using CSS transitions instead or increase particle count slightly

## Low Priority (Nice to Have)

### 1. Magic Number for Limit
**Agent:** Architecture Reviewer
**File:** `src/app/explore/page.tsx`
**Issue:** Hardcoded `limit: 24`
**Recommendation:** Extract to constant for consistency

## False Positives (Can Ignore)

### 1. SQL Injection Risk
**Agent:** Security Reviewer
**Issue:** Dynamic `orderBy` property
**Reason:** Prisma protects against SQL injection with enum-like validation

### 2. Cache Poisoning
**Agent:** Security Reviewer
**Issue:** User-controlled cache keys
**Reason:** Cache keys use number strings only, no injection possible

### 3. Connection Pool Too Small
**Agent:** Architecture Reviewer
**Issue:** max: 10 connections
**Reason:** Appropriate for serverless Neon PostgreSQL with connection pooling

## Issue Resolution Plan

### Must Fix Before Completion
1. **Add pagination validation** - Clamp limit to 1-100, offset to >= 0

### Should Fix if Time Permits
1. Add SQL COUNT for worlds with many pins/lore entries
2. Extract magic numbers to constants

### Can Defer
1. Particle smoothness (visual preference, minor UX impact)
2. Memo refinement (works correctly as-is)
