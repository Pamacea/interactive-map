/**
 * Gesture Layer Component
 *
 * Wraps the map canvas and handles touch gestures while coordinating
 * with MapLibre's built-in touch handling. Distinguishes between map
 * gestures (pan, zoom) and UI gestures (swipe, long press).
 *
 * Uses a capture phase approach to intercept touch events before they
 * reach MapLibre, then conditionally allows propagation.
 */

import { useRef, ReactNode } from "react";
import { cn } from "@/shared/utils";
import { useTouchGestures, type TouchGestureHandlers } from "../logic/use-touch-gestures";

// ============== Types ==============

export interface GestureLayerProps {
  /** Child elements (typically the map canvas) */
  children: ReactNode;
  /** Reference to the map container element */
  mapRef: React.RefObject<HTMLElement | null>;
  /** Enable/disable touch gestures */
  enabled?: boolean;
  /** Gesture callback handlers */
  onPinchZoom?: (scale: number, center: { x: number; y: number }) => void;
  onTwoFingerPan?: (delta: { x: number; y: number }) => void;
  onLongPress?: (position: { x: number; y: number }) => void;
  onSwipe?: (direction: "left" | "right" | "up" | "down") => void;
  onDoubleTap?: (position: { x: number; y: number }) => void;
  /** Allow MapLibre to handle single-finger pan */
  allowMapPan?: boolean;
  /** Allow MapLibre to handle pinch zoom */
  allowMapZoom?: boolean;
  /** CSS class name */
  className?: string;
}

// ============== Component ==============

/**
 * GestureLayer wraps the map and provides touch gesture support
 *
 * The layer sits on top of the map but uses pointer-events: none
 * to allow clicks to pass through, then selectively enables
 * pointer-events for touch handling.
 */
export function GestureLayer({
  children,
  mapRef: _mapRef, // Unused but kept for API consistency
  enabled = true,
  onPinchZoom,
  onTwoFingerPan,
  onLongPress,
  onSwipe,
  onDoubleTap,
  allowMapPan = true,
  allowMapZoom = true,
  className,
}: GestureLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const isTouchingRef = useRef(false);
  const gestureStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Build gesture handlers
  const gestureHandlers: TouchGestureHandlers = {
    onPinchStart: (_center) => {
      // Let MapLibre handle if allowed
      if (allowMapZoom) {
        // Allow event to propagate to MapLibre
        allowMapLibreTouch();
      }
    },
    onPinchMove: (scale, center) => {
      if (allowMapZoom) {
        // Let MapLibre handle zoom - just report the scale
        onPinchZoom?.(scale, center);
      } else {
        // Custom zoom handling
        onPinchZoom?.(scale, center);
        // Block MapLibre from handling
        blockMapLibreTouch();
      }
    },
    onPinchEnd: () => {
      // Restore normal touch handling
      allowMapLibreTouch();
    },
    onTwoFingerPanStart: () => {
      // Two-finger pan is typically for map manipulation
      if (!allowMapPan) {
        blockMapLibreTouch();
      }
    },
    onTwoFingerPanMove: (delta) => {
      if (allowMapPan) {
        onTwoFingerPan?.(delta);
        allowMapLibreTouch();
      } else {
        onTwoFingerPan?.(delta);
        blockMapLibreTouch();
      }
    },
    onTwoFingerPanEnd: () => {
      allowMapLibreTouch();
    },
    onLongPress: (position) => {
      // Block MapLibre during long press
      blockMapLibreTouch();
      onLongPress?.(position);
      // Restore after a delay
      setTimeout(() => allowMapLibreTouch(), 100);
    },
    onSwipe: (direction) => {
      // Swipe is a UI gesture, not map manipulation
      onSwipe?.(direction);
    },
    onDoubleTap: (position) => {
      // Double tap is for zoom-in (map gesture)
      if (allowMapZoom) {
        allowMapLibreTouch();
      }
      onDoubleTap?.(position);
    },
  };

  // Use touch gestures hook
  const { gestureState } = useTouchGestures({
    elementRef: layerRef,
    handlers: gestureHandlers,
    enabled,
  });

  // Allow MapLibre to handle touch events
  function allowMapLibreTouch() {
    if (layerRef.current) {
      layerRef.current.style.pointerEvents = "none";
    }
  }

  // Block MapLibre from handling touch events
  function blockMapLibreTouch() {
    if (layerRef.current) {
      layerRef.current.style.pointerEvents = "auto";
    }
  }

  // Handle touch start to track interaction
  const handleTouchStart = (e: React.TouchEvent) => {
    isTouchingRef.current = true;
    const touch = e.touches[0];
    gestureStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    // Enable pointer events to capture this touch sequence
    if (layerRef.current) {
      layerRef.current.style.pointerEvents = "auto";
    }
  };

  // Handle touch end to reset state
  const handleTouchEnd = () => {
    isTouchingRef.current = false;
    gestureStartRef.current = null;

    // Restore pass-through after a short delay
    setTimeout(() => {
      if (!isTouchingRef.current) {
        allowMapLibreTouch();
      }
    }, 100);
  };

  // Handle touch move to distinguish gestures
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gestureStartRef.current || !allowMapPan) return;

    const touch = e.touches[0];
    const dx = touch.clientX - gestureStartRef.current.x;
    const dy = touch.clientY - gestureStartRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If moved more than threshold, it's a drag/pan
    if (distance > 10) {
      if (allowMapPan && gestureState.activeGesture === "none") {
        // Single finger pan - let MapLibre handle it
        allowMapLibreTouch();
      }
    }
  };

  return (
    <div
      ref={layerRef}
      className={cn(
        "absolute inset-0 touch-none",
        // Start with pointer-events: none to allow clicks to pass through
        "pointer-events-none",
        // Enable touch handling
        enabled && "[&_*]:touch-auto",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: "none", // Disable browser's default touch actions
      }}
    >
      {children}
    </div>
  );
}

// ============== Context Menu Gesture ==============

/**
 * Specialized layer for handling long press context menu
 * Coordinates with the existing context menu system
 */
export interface ContextMenuGestureLayerProps {
  children: ReactNode;
  mapRef: React.RefObject<HTMLElement | null>;
  onContextMenu: (position: { x: number; y: number }) => void;
  enabled?: boolean;
  longPressDuration?: number;
  className?: string;
}

export function ContextMenuGestureLayer({
  children,
  mapRef,
  onContextMenu,
  enabled = true,
  longPressDuration = 500,
  className,
}: ContextMenuGestureLayerProps) {
  useTouchGestures({
    elementRef: mapRef, // mapRef is used for touch gesture detection
    handlers: {
      onLongPress: (position) => {
        onContextMenu(position);
      },
    },
    longPressDuration,
    enabled,
  });

  return <div className={cn("relative", className)}>{children}</div>;
}

// ============== Swipe Gesture Layer ==============

/**
 * Specialized layer for handling swipe gestures
 * Useful for panel toggles and navigation
 */
export interface SwipeGestureLayerProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  enabled?: boolean;
  className?: string;
}

export function SwipeGestureLayer({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  enabled = true,
  className,
}: SwipeGestureLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useTouchGestures({
    elementRef: layerRef,
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

  return (
    <div
      ref={layerRef}
      className={cn("relative", className)}
      style={{ touchAction: "pan-y pinch-zoom" }}
    >
      {children}
    </div>
  );
}

// ============== Double Tap Gesture Layer ==============

/**
 * Specialized layer for handling double-tap to zoom
 * Complements MapLibre's built-in double-tap zoom
 */
export interface DoubleTapGestureLayerProps {
  children: ReactNode;
  onDoubleTap: (position: { x: number; y: number }) => void;
  enabled?: boolean;
  interval?: number;
  className?: string;
}

export function DoubleTapGestureLayer({
  children,
  onDoubleTap,
  enabled = true,
  interval = 300,
  className,
}: DoubleTapGestureLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useTouchGestures({
    elementRef: layerRef,
    handlers: {
      onDoubleTap,
    },
    doubleTapInterval: interval,
    enabled,
  });

  return <div ref={layerRef} className={cn("relative", className)}>{children}</div>;
}
