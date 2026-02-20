/**
 * Touch Gestures Hook
 *
 * Provides comprehensive touch gesture support for the world map:
 * - Pinch-to-zoom (2 fingers)
 * - Two-finger pan
 * - Long press (500ms) for context menu
 * - Swipe horizontal for panel toggle
 * - Double tap for zoom in
 *
 * Coordinates with MapLibre and the existing input manager.
 * Touch targets minimum 44x44px per accessibility guidelines.
 */

import { useEffect, useRef, useCallback, useState } from "react";
import { inputManager, INPUT_PRIORITY } from "@/lib/input-manager";

// ============== Types ==============

export interface TouchGestureState {
  /** Active gesture type */
  activeGesture: "none" | "pinch" | "pan" | "long-press" | "swipe" | "double-tap";
  /** Current pinch distance between two fingers */
  pinchDistance: number;
  /** Current pinch center point */
  pinchCenter: { x: number; y: number };
  /** Two-finger pan delta */
  panDelta: { x: number; y: number };
  /** Swipe direction detected */
  swipeDirection: "left" | "right" | "up" | "down" | null;
  /** Long press in progress */
  isLongPressing: boolean;
  /** Double tap detected */
  isDoubleTap: boolean;
}

export interface TouchGestureHandlers {
  /** Called when pinch zoom starts */
  onPinchStart?: (center: { x: number; y: number }) => void;
  /** Called during pinch zoom - returns new scale factor */
  onPinchMove?: (scale: number, center: { x: number; y: number }) => void;
  /** Called when pinch zoom ends */
  onPinchEnd?: () => void;
  /** Called when two-finger pan starts */
  onTwoFingerPanStart?: () => void;
  /** Called during two-finger pan */
  onTwoFingerPanMove?: (delta: { x: number; y: number }) => void;
  /** Called when two-finger pan ends */
  onTwoFingerPanEnd?: () => void;
  /** Called when long press completes */
  onLongPress?: (position: { x: number; y: number }) => void;
  /** Called when swipe is detected */
  onSwipe?: (direction: "left" | "right" | "up" | "down") => void;
  /** Called on double tap */
  onDoubleTap?: (position: { x: number; y: number }) => void;
}

export interface UseTouchGesturesOptions {
  /** Element ref to attach gesture listeners to */
  elementRef: React.RefObject<HTMLElement | null>;
  /** Gesture callback handlers */
  handlers?: TouchGestureHandlers;
  /** Minimum distance for swipe detection (pixels) */
  swipeThreshold?: number;
  /** Duration for long press (ms) */
  longPressDuration?: number;
  /** Interval for double tap detection (ms) */
  doubleTapInterval?: number;
  /** Minimum pinch distance to start zoom */
  pinchThreshold?: number;
  /** Enable/disable all touch gestures */
  enabled?: boolean;
}

// ============== Touch Point Utilities ==============

/**
 * Calculate distance between two touch points
 */
function getTouchDistance(touch1: Touch, touch2: Touch): number {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate center point between two touches
 */
function getTouchCenter(touch1: Touch, touch2: Touch): { x: number; y: number } {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  };
}

/**
 * Get element-relative coordinates from a touch event
 */
function getRelativeCoordinates(
  touch: Touch,
  element: HTMLElement
): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
}

/**
 * Check if target is a touch-manipulable element
 */
function isTouchInteractive(target: EventTarget): boolean {
  if (!isHTMLElement(target)) return false;

  const element = target;
  const tagName = element.tagName.toLowerCase();

  // Touch target should be at least 44x44px per accessibility guidelines
  // These elements are typically interactive
  const interactiveTags = ["button", "a", "input", "textarea", "select"];
  if (interactiveTags.includes(tagName)) return true;

  // Check for interactive roles
  const role = element.getAttribute("role");
  if (role === "button" || role === "slider" || role === "switch") return true;

  return false;
}

function isHTMLElement(target: EventTarget | null): target is HTMLElement {
  return target !== null && "tagName" in target;
}

// ============== Main Hook ==============

/**
 * Hook for managing touch gestures on map elements
 *
 * Integrates with the existing input manager to avoid conflicts
 * with mouse/keyboard input handlers.
 */
export function useTouchGestures(options: UseTouchGesturesOptions) {
  const {
    elementRef,
    handlers = {},
    swipeThreshold = 50,
    longPressDuration = 500,
    doubleTapInterval = 300,
    pinchThreshold = 10,
    enabled = true,
  } = options;

  // Track active gesture state
  const [gestureState, setGestureState] = useState<TouchGestureState>({
    activeGesture: "none",
    pinchDistance: 0,
    pinchCenter: { x: 0, y: 0 },
    panDelta: { x: 0, y: 0 },
    swipeDirection: null,
    isLongPressing: false,
    isDoubleTap: false,
  });

  // Refs for tracking touch state
  const initialPinchDistance = useRef<number | null>(null);
  const initialPinchCenter = useRef<{ x: number; y: number } | null>(null);
  const initialPanPosition = useRef<{ x: number; y: number } | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapTimeRef = useRef<number>(0);
  const lastTapPositionRef = useRef<{ x: number; y: number } | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  /**
   * Handle touch start - detect gesture type
   */
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !elementRef.current) return;

      const touches = e.touches;
      const touchCount = touches.length;

      // Don't interfere with interactive elements
      if (touchCount === 1 && isTouchInteractive(e.target)) {
        return;
      }

      // Prevent default to stop scrolling/zooming
      if (touchCount >= 2) {
        e.preventDefault();
      }

      if (touchCount === 2) {
        // Two-finger gestures
        const distance = getTouchDistance(touches[0], touches[1]);
        const center = getTouchCenter(touches[0], touches[1]);

        initialPinchDistance.current = distance;
        initialPinchCenter.current = center;

        // Will determine if pinch or pan based on movement
        setGestureState((prev) => ({
          ...prev,
          activeGesture: "none",
          pinchDistance: distance,
          pinchCenter: center,
        }));

        // Start tracking for two-finger pan
        initialPanPosition.current = { x: touches[0].clientX, y: touches[0].clientY };
      } else if (touchCount === 1) {
        // Single touch - check for double tap or start long press timer
        const now = Date.now();
        const touch = touches[0];
        const position = { x: touch.clientX, y: touch.clientY };

        // Check for double tap
        const timeSinceLastTap = now - lastTapTimeRef.current;
        const isSamePosition =
          lastTapPositionRef.current &&
          Math.abs(position.x - lastTapPositionRef.current.x) < 30 &&
          Math.abs(position.y - lastTapPositionRef.current.y) < 30;

        if (timeSinceLastTap < doubleTapInterval && isSamePosition) {
          // Double tap detected
          setGestureState((prev) => ({ ...prev, isDoubleTap: true }));
          handlers.onDoubleTap?.(position);
          lastTapTimeRef.current = 0; // Reset to prevent triple tap
          return;
        }

        lastTapTimeRef.current = now;
        lastTapPositionRef.current = position;
        touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: now };

        // Start long press timer
        longPressTimerRef.current = setTimeout(() => {
          if (touchStartRef.current && elementRef.current) {
            const relativePos = getRelativeCoordinates(touch, elementRef.current);
            setGestureState((prev) => ({ ...prev, isLongPressing: true }));
            handlers.onLongPress?.(relativePos);
          }
        }, longPressDuration);

        setGestureState((prev) => ({
          ...prev,
          activeGesture: "none",
          swipeDirection: null,
        }));
      }
    },
    [enabled, elementRef, handlers, longPressDuration, doubleTapInterval]
  );

  /**
   * Handle touch move - update gesture state
   */
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;

      const touches = e.touches;
      const touchCount = touches.length;

      // Cancel long press if finger moves significantly
      if (touchCount === 1 && longPressTimerRef.current) {
        const touch = touches[0];
        const start = touchStartRef.current;
        if (start) {
          const dx = touch.clientX - start.x;
          const dy = touch.clientY - start.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 10) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
        }
      }

      if (touchCount === 2 && initialPinchDistance.current && initialPinchCenter.current) {
        e.preventDefault();

        const distance = getTouchDistance(touches[0], touches[1]);
        const center = getTouchCenter(touches[0], touches[1]);
        const distanceDelta = Math.abs(distance - initialPinchDistance.current);

        // Determine if pinch or pan based on movement
        if (gestureState.activeGesture === "none") {
          if (distanceDelta > pinchThreshold) {
            // Detected pinch gesture
            setGestureState((prev) => ({ ...prev, activeGesture: "pinch" }));
            handlers.onPinchStart?.(center);
          } else {
            // Check for two-finger pan
            const touch1Pos = { x: touches[0].clientX, y: touches[0].clientY };
            const touch2Pos = { x: touches[1].clientX, y: touches[1].clientY };
            const currentCenter = {
              x: (touch1Pos.x + touch2Pos.x) / 2,
              y: (touch1Pos.y + touch2Pos.y) / 2,
            };
            const initialCenter = initialPinchCenter.current;

            const panDistance = Math.sqrt(
              Math.pow(currentCenter.x - initialCenter.x, 2) +
                Math.pow(currentCenter.y - initialCenter.y, 2)
            );

            if (panDistance > pinchThreshold) {
              setGestureState((prev) => ({ ...prev, activeGesture: "pan" }));
              handlers.onTwoFingerPanStart?.();
            }
          }
        }

        // Update active gesture
        if (gestureState.activeGesture === "pinch") {
          const scale = distance / initialPinchDistance.current;
          handlers.onPinchMove?.(scale, center);
          setGestureState((prev) => ({
            ...prev,
            pinchDistance: distance,
            pinchCenter: center,
          }));
        } else if (gestureState.activeGesture === "pan") {
          if (initialPanPosition.current && initialPinchCenter.current) {
            const currentCenter = getTouchCenter(touches[0], touches[1]);
            const delta = {
              x: currentCenter.x - initialPinchCenter.current.x,
              y: currentCenter.y - initialPinchCenter.current.y,
            };
            handlers.onTwoFingerPanMove?.(delta);
            setGestureState((prev) => ({
              ...prev,
              panDelta: delta,
            }));
          }
        }
      } else if (touchCount === 1) {
        // Single finger move - track for swipe detection
        const touch = touches[0];
        const start = touchStartRef.current;

        if (start) {
          const dx = touch.clientX - start.x;
          const dy = touch.clientY - start.y;
          const absDx = Math.abs(dx);
          const absDy = Math.abs(dy);

          // Determine swipe direction if past threshold
          if (Math.max(absDx, absDy) > swipeThreshold) {
            let direction: "left" | "right" | "up" | "down" | null = null;

            if (absDx > absDy) {
              direction = dx > 0 ? "right" : "left";
            } else {
              direction = dy > 0 ? "down" : "up";
            }

            if (gestureState.swipeDirection !== direction) {
              setGestureState((prev) => ({ ...prev, swipeDirection: direction }));
            }
          }
        }
      }
    },
    [enabled, gestureState, handlers, pinchThreshold, swipeThreshold]
  );

  /**
   * Handle touch end - finalize gesture
   */
  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;

      const touches = e.touches;
      const touchCount = touches.length;

      // Clear long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      if (touchCount === 0) {
        // All fingers lifted - end gesture
        if (gestureState.activeGesture === "pinch") {
          handlers.onPinchEnd?.();
        } else if (gestureState.activeGesture === "pan") {
          handlers.onTwoFingerPanEnd?.();
        } else if (gestureState.swipeDirection) {
          handlers.onSwipe?.(gestureState.swipeDirection);
        }

        // Reset state
        setGestureState({
          activeGesture: "none",
          pinchDistance: 0,
          pinchCenter: { x: 0, y: 0 },
          panDelta: { x: 0, y: 0 },
          swipeDirection: null,
          isLongPressing: false,
          isDoubleTap: false,
        });

        initialPinchDistance.current = null;
        initialPinchCenter.current = null;
        initialPanPosition.current = null;
        touchStartRef.current = null;
      } else if (touchCount === 1 && gestureState.activeGesture !== "none") {
        // One finger lifted - end two-finger gesture
        if (gestureState.activeGesture === "pinch") {
          handlers.onPinchEnd?.();
        } else if (gestureState.activeGesture === "pan") {
          handlers.onTwoFingerPanEnd?.();
        }

        setGestureState((prev) => ({
          ...prev,
          activeGesture: "none",
        }));

        initialPinchDistance.current = null;
        initialPinchCenter.current = null;
      }
    },
    [enabled, gestureState, handlers]
  );

  /**
   * Handle touch cancel - cleanup interrupted gestures
   */
  const handleTouchCancel = useCallback(() => {
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Reset all state
    setGestureState({
      activeGesture: "none",
      pinchDistance: 0,
      pinchCenter: { x: 0, y: 0 },
      panDelta: { x: 0, y: 0 },
      swipeDirection: null,
      isLongPressing: false,
      isDoubleTap: false,
    });

    initialPinchDistance.current = null;
    initialPinchCenter.current = null;
    initialPanPosition.current = null;
    touchStartRef.current = null;
  }, []);

  // ============== Event Registration ==============

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;

    // Register with input manager for coordination
    const cleanup = inputManager.register({
      element: "map-canvas",
      priority: INPUT_PRIORITY.MAP_CANVAS,
      handlers: {
        mouse: {}, // No mouse handlers from this hook
      },
      enabled: () => enabled,
    });

    // Add touch event listeners
    element.addEventListener("touchstart", handleTouchStart, { passive: false });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: false });
    element.addEventListener("touchcancel", handleTouchCancel, { passive: false });

    return () => {
      cleanup();
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
      element.removeEventListener("touchcancel", handleTouchCancel);

      // Clear any pending timers
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [
    enabled,
    elementRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
  ]);

  return {
    /** Current gesture state */
    gestureState,
    /** Programmatically reset gesture state */
    resetGestures: () => {
      setGestureState({
        activeGesture: "none",
        pinchDistance: 0,
        pinchCenter: { x: 0, y: 0 },
        panDelta: { x: 0, y: 0 },
        swipeDirection: null,
        isLongPressing: false,
        isDoubleTap: false,
      });
    },
  };
}

// ============== Utility Hooks ==============

/**
 * Hook specifically for pinch-to-zoom on the map
 * Handles scale calculation and bounds checking
 */
export interface UsePinchZoomOptions {
  elementRef: React.RefObject<HTMLElement | null>;
  minScale?: number;
  maxScale?: number;
  onZoom?: (scale: number, center: { x: number; y: number }) => void;
  enabled?: boolean;
}

export function usePinchZoom(options: UsePinchZoomOptions) {
  const { elementRef, minScale = 0.5, maxScale = 5, onZoom, enabled = true } = options;

  const currentScaleRef = useRef(1);

  const handlePinchMove = useCallback(
    (scale: number, center: { x: number; y: number }) => {
      const newScale = Math.max(minScale, Math.min(maxScale, scale * currentScaleRef.current));
      currentScaleRef.current = newScale;
      onZoom?.(newScale, center);
    },
    [minScale, maxScale, onZoom]
  );

  useTouchGestures({
    elementRef,
    handlers: {
      onPinchMove: handlePinchMove,
    },
    enabled,
  });

  return {
    resetScale: () => {
      currentScaleRef.current = 1;
    },
    getCurrentScale: () => currentScaleRef.current,
  };
}

/**
 * Hook for swipe gesture detection
 * Useful for panel toggles and navigation
 */
export interface UseSwipeOptions {
  elementRef: React.RefObject<HTMLElement | null>;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  enabled?: boolean;
}

export function useSwipe(options: UseSwipeOptions) {
  const {
    elementRef,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    enabled = true,
  } = options;

  useTouchGestures({
    elementRef,
    handlers: {
      onSwipe: (direction) => {
        switch (direction) {
          case "left":
            onSwipeLeft?.();
            break;
          case "right":
            onSwipeRight?.();
            break;
          case "up":
            onSwipeUp?.();
            break;
          case "down":
            onSwipeDown?.();
            break;
        }
      },
    },
    swipeThreshold: threshold,
    enabled,
  });
}
