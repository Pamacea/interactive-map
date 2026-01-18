/**
 * Pin Sync Queue Manager
 *
 * Manages concurrent database sync requests for pin position updates.
 * Prevents race conditions by tracking and cancelling stale requests.
 *
 * Features:
 * - Per-pin request tracking with AbortController
 * - Automatic cancellation of pending requests when new update starts
 * - Request deduplication (only one active request per pin)
 * - Error isolation (failed requests don't block new ones)
 */

interface PendingRequest {
  pinId: string;
  abortController: AbortController;
  timestamp: number;
  rollbackPosition: { latitude: number; longitude: number } | null;
}

class PinSyncQueue {
  private pendingRequests = new Map<string, PendingRequest>();

  /**
   * Cancel any pending sync request for a specific pin
   * @param pinId - The pin ID to cancel requests for
   * @returns The rollback position if there was a pending request, null otherwise
   */
  cancelPendingRequest(pinId: string): { latitude: number; longitude: number } | null {
    const pending = this.pendingRequests.get(pinId);

    if (pending) {
      // Abort the pending request
      pending.abortController.abort();
      this.pendingRequests.delete(pinId);

      // Return the rollback position
      return pending.rollbackPosition;
    }

    return null;
  }

  /**
   * Register a new sync request for a pin
   * Automatically cancels any existing pending request for the same pin
   *
   * @param pinId - The pin ID being updated
   * @param rollbackPosition - Position to rollback to if this request fails
   * @returns AbortController for the new request
   */
  registerRequest(
    pinId: string,
    rollbackPosition: { latitude: number; longitude: number }
  ): AbortController {
    // Cancel any existing pending request first
    this.cancelPendingRequest(pinId);

    // Create new abort controller for this request
    const abortController = new AbortController();

    // Register the new request
    this.pendingRequests.set(pinId, {
      pinId,
      abortController,
      timestamp: Date.now(),
      rollbackPosition,
    });

    return abortController;
  }

  /**
   * Mark a request as completed (remove from pending map)
   * @param pinId - The pin ID whose request completed
   */
  markCompleted(pinId: string): void {
    this.pendingRequests.delete(pinId);
  }

  /**
   * Check if there's a pending request for a pin
   * @param pinId - The pin ID to check
   * @returns true if there's a pending request
   */
  hasPendingRequest(pinId: string): boolean {
    return this.pendingRequests.has(pinId);
  }

  /**
   * Get all pending pin IDs (useful for debugging)
   * @returns Array of pin IDs with pending requests
   */
  getPendingPins(): string[] {
    return Array.from(this.pendingRequests.keys());
  }

  /**
   * Clear all pending requests (useful for cleanup on unmount)
   */
  clearAll(): void {
    this.pendingRequests.forEach((request) => {
      request.abortController.abort();
    });
    this.pendingRequests.clear();
  }
}

// Singleton instance
export const pinSyncQueue = new PinSyncQueue();
