import { useState, useCallback, useEffect, useRef } from "react";
import { useMapStore } from "@/features/world-editor/store/map-store";
import { inputManager, INPUT_PRIORITY } from "@/shared/lib/input-manager";

// Validation helper
function isHTMLElement(target: EventTarget | null): target is HTMLElement {
  return target !== null && "tagName" in target;
}

export interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
}

export interface UseMapPanOptions {
  isCreatingPin?: boolean; // Disable drag when creating a pin
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function useMapPan(options: UseMapPanOptions = {}) {
  const { isCreatingPin = false, onDragStart, onDragEnd } = options;

  // Read zoom from store
  const storeZoom = useMapStore((state) => state.zoom);
  const setStoreZoom = useMapStore((state) => state.setZoom);

  const [transform, setTransform] = useState<Transform>({
    scale: storeZoom,
    translateX: 0,
    translateY: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  // Sync store zoom changes to transform.scale
  useEffect(() => {
    const syncTimer = setTimeout(() => {
      setTransform((prev) => ({
        ...prev,
        scale: storeZoom,
      }));
    }, 0);
    return () => clearTimeout(syncTimer);
  }, [storeZoom]);

  const updateTransform = useCallback((updater: (prev: Transform) => Transform) => {
    setTransform((prev) => {
      const newTransform = updater(prev);
      // Schedule store update if scale changed (defer to avoid setState during render)
      if (newTransform.scale !== prev.scale) {
        // Defer the Zustand store update to avoid updating during render
        Promise.resolve().then(() => {
          setStoreZoom(newTransform.scale);
        });
      }
      return newTransform;
    });
  }, [setStoreZoom]);

  // Track drag start position
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Track animation frame for cancellation
  const animationFrameRef = useRef<number | null>(null);

  // Register with input manager for unified drag handling
  useEffect(() => {
    if (isCreatingPin) return;

    const cleanup = inputManager.register({
      element: "map-canvas",
      priority: INPUT_PRIORITY.MAP_CANVAS,
      handlers: {
        mouse: {
          down: (e: MouseEvent) => {
            // Only left click
            if (e.button !== 0) return false;

            // Check if input is captured by higher priority element
            if (inputManager.isCaptured()) return false;

            // Don't start drag if clicking on interactive elements
            if (!isHTMLElement(e.target)) return false;

            const target = e.target;
            if (
              target.closest("button") ||
              target.closest("a") ||
              target.closest('[role="button"]') ||
              target.closest("input") ||
              target.closest("textarea")
            ) {
              return false;
            }

            dragStartRef.current = {
              x: e.clientX - transform.translateX,
              y: e.clientY - transform.translateY,
            };

            return true; // Capture event
          },
          move: (e: MouseEvent) => {
            // Only handle move if we captured the down event
            if (!dragStartRef.current) return false;

            // Check if we're actually dragging (past threshold)
            if (!inputManager.isDraggingElement("map-canvas")) return false;

            e.preventDefault();
            // Capture the ref value locally to avoid null reference race condition
            const dragStart = dragStartRef.current;
            if (!dragStart) return false;

            setTransform((prev) => ({
              ...prev,
              translateX: e.clientX - dragStart.x,
              translateY: e.clientY - dragStart.y,
            }));

            return true; // Capture event
          },
          up: (_e: MouseEvent) => {
            if (dragStartRef.current) {
              dragStartRef.current = null;
              setIsDragging(false);
              onDragEnd?.();
            }
            return false; // Let event continue
          },
        },
        keyboard: {}, // Empty keyboard handlers - this hook only handles mouse
      },
      enabled: () => !isCreatingPin,
    });

    // Listen to drag start/end events from input manager
    const unsubscribeDragStart = inputManager.on("drag-start", () => {
      if (inputManager.isDraggingElement("map-canvas")) {
        setIsDragging(true);
        onDragStart?.();
      }
    });

    const unsubscribeDragEnd = inputManager.on("drag-end", () => {
      setIsDragging(false);
      onDragEnd?.();
    });

    return () => {
      cleanup();
      unsubscribeDragStart();
      unsubscribeDragEnd();
      // Cancel any pending animation frame
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [transform.translateX, transform.translateY, isCreatingPin, onDragStart, onDragEnd]);

  // Legacy handler for backward compatibility (now delegates to input manager)
  const handleMouseDown = useCallback((_e: React.MouseEvent) => {
    // The actual handling is done by input manager
    // This is kept for backward compatibility with existing code
  }, []);

  const reset = useCallback(() => {
    const newTransform = { scale: 1, translateX: 0, translateY: 0 };
    setTransform(newTransform);
    setStoreZoom(1);
  }, [setStoreZoom]);

  /**
   * Center the map on a specific pin position with smooth animation
   * @param pinX - Pin's X position in pixels (from usePinPosition)
   * @param pinY - Pin's Y position in pixels (from usePinPosition)
   * @param imageWidth - Map image width in pixels
   * @param imageHeight - Map image height in pixels
   * @param containerRef - Reference to the map container element
   */
  const centerToPin = useCallback((
    pinX: number,
    pinY: number,
    imageWidth: number,
    imageHeight: number,
    containerRef: React.RefObject<HTMLDivElement | null>
  ) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    // Calculate the current visible area
    const visibleWidth = containerRect.width;
    const visibleHeight = containerRect.height;

    // Calculate the center position we want
    // We want the pin to be at the center of the viewport
    const targetCenterX = visibleWidth / 2;
    const targetCenterY = visibleHeight / 2;

    // Calculate the transform needed to center the pin
    // The pin's position is: (pinX * scale) + translateX
    // We want: (pinX * scale) + translateX = targetCenterX
    // So: translateX = targetCenterX - (pinX * scale)
    const newTranslateX = targetCenterX - (pinX * transform.scale);
    const newTranslateY = targetCenterY - (pinY * transform.scale);

    // Animate the transform with smooth easing
    const startX = transform.translateX;
    const startY = transform.translateY;
    const startTime = performance.now();
    const duration = 500; // 500ms animation

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setTransform({
        scale: transform.scale,
        translateX: startX + (newTranslateX - startX) * easedProgress,
        translateY: startY + (newTranslateY - startY) * easedProgress,
      });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
      }
    };

    // Cancel any existing animation
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [transform.scale, transform.translateX, transform.translateY]);

  return {
    transform,
    isDragging,
    handleMouseDown,
    reset,
    setTransform: updateTransform, // External callers use sync version
    centerToPin,
  };
}
