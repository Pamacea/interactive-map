# Fix for Drag Race Condition with Database Sync

## Problem Summary

When users dragged pins rapidly, the position could revert to an old location. This occurred due to a race condition between:
1. Optimistic updates to the Zustand store (immediate UI feedback)
2. Asynchronous database sync requests (background persistence)

### Root Cause

**The Race Condition:**
1. User drags pin to position A
2. Zustand updates optimistically to position A
3. DB sync request for position A starts (async, takes ~200ms)
4. User drags pin to position B (before request A completes)
5. Zustand updates optimistically to position B
6. **Problem:** DB sync request A completes AFTER step 5, overwriting position B with position A
7. Result: Pin visually reverts from B to A, causing poor UX

**Why This Happened:**
- No tracking of pending DB requests per pin
- No mechanism to cancel stale requests
- Multiple concurrent DB sync requests could complete out of order
- Last request to complete would "win", regardless of actual user intent

## Solution Overview

Implemented a **request queue system** with automatic cancellation of stale requests:

### Key Features

1. **Per-Pin Request Tracking**
   - Each pin has at most ONE active DB sync request
   - New drag operation automatically cancels pending requests for that pin
   - Uses `AbortController` for clean cancellation

2. **Automatic Rollback on Errors**
   - If DB sync fails, pin reverts to last known good position
   - User sees visual feedback (toast notification)
   - Prevents "ghost" positions that never saved to DB

3. **User Notifications**
   - Toast notifications for sync failures
   - Clear messaging: "Failed to save pin position. Please check your connection."
   - Silent success (no spam)

4. **Cleanup on Unmount**
   - Automatically cancels pending requests when component unmounts
   - Prevents memory leaks and orphaned requests

## Implementation Details

### File: `src/components/pins/logic/pin-sync-queue.ts`

**Purpose:** Singleton queue manager for tracking and cancelling DB sync requests.

**Key Methods:**
- `registerRequest(pinId, rollbackPosition)` - Register new sync request, returns AbortController
- `cancelPendingRequest(pinId)` - Cancel any pending request for a pin, returns rollback position
- `markCompleted(pinId)` - Mark request as successful/completed
- `hasPendingRequest(pinId)` - Check if request is pending
- `clearAll()` - Cancel all pending requests (cleanup)

**Data Structure:**
```typescript
interface PendingRequest {
  pinId: string;
  abortController: AbortController;
  timestamp: number;
  rollbackPosition: { latitude: number; longitude: number } | null;
}
```

### File: `src/components/pins/logic/use-pin-drag.ts`

**Changes Made:**

1. **Added Imports:**
   ```typescript
   import { pinSyncQueue } from "./pin-sync-queue";
   import { useToast } from "@/hooks/use-toast";
   ```

2. **Added State Ref:**
   ```typescript
   const lastKnownPositionRef = useRef<{ latitude: number; longitude: number } | null>(null);
   ```

3. **Updated `handleMouseUp` (lines 145-237):**
   - Stores rollback position before optimistic update
   - Cancels any pending sync request for this pin
   - Performs optimistic update to Zustand
   - Registers new sync request with queue
   - Handles success/failure with proper cleanup
   - Shows error toast on failure
   - Rollback on DB sync error

4. **Added Cleanup Effect (lines 288-293):**
   ```typescript
   useEffect(() => {
     return () => {
       pinSyncQueue.cancelPendingRequest(pinId);
     };
   }, [pinId]);
   ```

## How It Works: Step-by-Step

### Scenario 1: Normal Drag (No Race Condition)
```
1. User drags pin to position A
2. handleMouseUp fires:
   a. Cancel any pending request (none exist)
   b. Optimistic update: Zustand → position A
   c. Register sync request for position A
   d. Start DB sync (async)
3. DB sync completes successfully
   a. markCompleted("pin-1")
   b. UI remains at position A (already there)
```

### Scenario 2: Rapid Drag (Race Condition Prevented)
```
1. User drags pin to position A
2. handleMouseUp fires:
   a. Cancel pending (none)
   b. Optimistic update: Zustand → position A
   c. Register sync request #1 for position A
   d. Start DB sync #1 (slow, ~500ms)

3. User drags pin to position B (BEFORE #1 completes)
4. handleMouseUp fires:
   a. Cancel pending request #1 (ABORTED!)
   b. Optimistic update: Zustand → position B
   c. Register sync request #2 for position B
   d. Start DB sync #2 (fast, ~200ms)

5. DB sync #2 completes successfully
   a. markCompleted("pin-1")
   b. UI remains at position B

6. DB sync #1 finally completes (ABORTED)
   a. Checks abort signal (already aborted)
   b. Silently ignores (no rollback, no toast)
   c. UI stays at position B ✓
```

### Scenario 3: DB Sync Failure (Rollback)
```
1. User drags pin to position A
2. handleMouseUp fires:
   a. Cancel pending (none)
   b. Store rollback position: original position
   c. Optimistic update: Zustand → position A
   d. Register sync request for position A
   e. Start DB sync

3. DB sync FAILS (network error, server error, etc.)
   a. Catches error
   b. Checks abort signal (not aborted, real error)
   c. Rollback: Zustand → original position
   d. Show error toast: "Failed to save pin position..."
   e. markCompleted("pin-1")

4. User sees:
   a. Pin moves to position A briefly
   b. Pin reverts to original position
   c. Error toast appears
   d. Can try dragging again
```

## Testing

### Unit Tests

File: `src/components/pins/logic/pin-sync-queue.test.ts`

**Test Coverage:**
- Request registration and cancellation
- Automatic cancellation of stale requests
- Rollback position tracking
- Multiple pins with independent requests
- Rapid successive requests (race condition simulation)

### Manual Testing Steps

1. **Test Normal Drag:**
   - Drag a pin slowly
   - Verify position saves correctly
   - Refresh page → position should persist

2. **Test Rapid Drag:**
   - Drag a pin rapidly to multiple positions
   - Verify final position is saved (no reversion)
   - Check console for "Sync request cancelled" logs

3. **Test Network Failure:**
   - Open DevTools → Network tab
   - Set throttling to "Offline"
   - Drag a pin
   - Verify error toast appears
   - Verify pin reverts to original position
   - Go online → drag again → should work

4. **Test Component Unmount:**
   - Drag a pin and immediately navigate away
   - Verify no console errors
   - Verify no memory leaks (check Performance monitor)

## Acceptance Criteria Status

- ✅ **Rapid dragging doesn't cause position reversion**
  - Queue system cancels stale requests automatically

- ✅ **Database sync errors trigger proper rollback**
  - Rollback to `lastKnownPositionRef.current`
  - Error handling in catch block

- ✅ **User is notified of sync failures**
  - Toast notifications via `useToast` hook
  - Clear error message

- ✅ **Queue system prevents conflicting updates**
  - Only one active request per pin
  - AbortController ensures clean cancellation

## Performance Impact

**Memory:** Minimal (one Map<string, PendingRequest> singleton)
**CPU:** Negligible (O(1) operations for queue management)
**Network:** Reduced (cancels stale requests, saves DB calls)

## Future Improvements

1. **Batch Updates:** If user drags multiple pins, batch DB updates
2. **Debouncing:** Add small delay (~100ms) to catch very rapid drags
3. **Retry Logic:** Automatically retry failed sync requests (with backoff)
4. **Offline Queue:** Persist updates locally, sync when connection restored

## Related Files

- `src/components/pins/logic/pin-sync-queue.ts` - Queue manager (new)
- `src/components/pins/logic/pin-sync-queue.test.ts` - Unit tests (new)
- `src/components/pins/logic/use-pin-drag.ts` - Drag hook (modified)
- `src/actions/pins.ts` - Server actions (no changes needed)
- `src/stores/use-pins-store.ts` - Zustand store (no changes needed)

## Migration Notes

**No migration needed** - This is a pure client-side fix. Existing data and server code remain unchanged.

**Breaking Changes:** None. API remains the same.

**Deployment:** Canary release recommended (test with small percentage of users first).
