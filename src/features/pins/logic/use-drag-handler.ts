import { useRef, useCallback, useEffect } from "react";
import { eventManager } from "@/shared/lib/event-manager";

export interface DragHandlerOptions {
  /** Minimum pixels to move before starting drag (to distinguish click from drag) */
  threshold?: number;
  /** Called when drag starts (after threshold is exceeded) */
  onDragStart?: (e: MouseEvent) => void;
  /** Called during drag with current delta */
  onDragMove?: (e: MouseEvent, deltaX: number, deltaY: number) => void;
  /** Called when drag ends (even if threshold wasn't exceeded) */
  onDragEnd?: (e: MouseEvent, didMove: boolean) => void;
  /** If true, handler is disabled */
  disabled?: boolean;
}

export interface DragHandlerResult {
  /** Call this when mousedown occurs on the draggable element */
  handleMouseDown: (e: React.MouseEvent) => void;
  /** Whether a drag is currently in progress */
  isDragging: boolean;
}

const DRAG_THRESHOLD = 5;

/**
 * Robust drag handler that avoids stale closure issues
 *
 * Key features:
 * - Uses refs for all callbacks to avoid stale closures
 * - Proper event listener cleanup guaranteed
 * - Coordinates with eventManager for conflict prevention
 * - Window-level listeners for drag continuation outside element
 */
export function useDragHandler(options: DragHandlerOptions = {}): DragHandlerResult {
  const {
    threshold = DRAG_THRESHOLD,
    onDragStart,
    onDragMove,
    onDragEnd,
    disabled = false,
  } = options;

  // Refs to avoid stale closures - these never change identity
  const isDraggingRef = useRef(false);
  const didMoveRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });

  // Store callbacks in refs so event listeners always access latest version
  const callbacksRef = useRef({ onDragStart, onDragMove, onDragEnd });
  callbacksRef.current = { onDragStart, onDragMove, onDragEnd };

  // Cleanup function stored in ref for access in both useEffect and manual cleanup
  const cleanupRef = useRef<(() => void) | null>(null);

  // Single cleanup function that guarantees removal of all listeners
  const cleanup = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    // Always reset state
    isDraggingRef.current = false;
    didMoveRef.current = false;
  }, []);

  // Mouse move handler - stored as ref to maintain stable reference
  const handleMouseMoveRef = useRef<(e: MouseEvent) => void>((e: MouseEvent) => {
    if (!isDraggingRef.current || disabled) return;

    const deltaX = e.clientX - currentPosRef.current.x;
    const deltaY = e.clientY - currentPosRef.current.y;

    // Update current position for next delta calculation
    currentPosRef.current = { x: e.clientX, y: e.clientY };

    // Check threshold on first move
    if (!didMoveRef.current) {
      const totalDeltaX = e.clientX - startPosRef.current.x;
      const totalDeltaY = e.clientY - startPosRef.current.y;
      const distance = Math.sqrt(totalDeltaX ** 2 + totalDeltaY ** 2);

      if (distance <= threshold) {
        return; // Below threshold, ignore
      }

      // Threshold exceeded - drag starts now
      didMoveRef.current = true;
      callbacksRef.current.onDragStart?.(e);
      eventManager.setMode("dragging-pin");
    }

    // Only call move callback after threshold exceeded
    if (didMoveRef.current) {
      callbacksRef.current.onDragMove?.(e, deltaX, deltaY);
    }
  });

  // Mouse up handler - stored as ref to maintain stable reference
  const handleMouseUpRef = useRef<(e: MouseEvent) => void>((e: MouseEvent) => {
    const didMove = didMoveRef.current;

    // Cleanup first (removes listeners, resets state)
    cleanup();

    // Then notify
    callbacksRef.current.onDragEnd?.(e, didMove);

    // Reset event manager mode if we were dragging
    if (didMove) {
      eventManager.setMode("idle");
    }
  });

  // Mouse down handler - starts the drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    if (e.button !== 0) return; // Left click only

    e.stopPropagation();
    e.preventDefault();

    // Store initial position
    startPosRef.current = { x: e.clientX, y: e.clientY };
    currentPosRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = true;
    didMoveRef.current = false;

    // Capture event to prevent map panning
    const release = eventManager.capture("pin-marker");

    // Store cleanup function that releases capture and removes listeners
    cleanupRef.current = () => {
      release();
      window.removeEventListener("mousemove", handleMouseMoveRef.current);
      window.removeEventListener("mouseup", handleMouseUpRef.current);
    };

    // Attach window listeners for drag continuation
    window.addEventListener("mousemove", handleMouseMoveRef.current, { passive: false });
    window.addEventListener("mouseup", handleMouseUpRef.current, { passive: false });
  }, [disabled]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    handleMouseDown,
    isDragging: isDraggingRef.current,
  };
}
