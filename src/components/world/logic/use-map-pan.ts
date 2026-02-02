import { useState, useCallback, useEffect, useRef } from "react";
import { useMapStore } from "@/stores/map-store";

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
  const isDraggingRef = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  // Ref to track pending scale update to avoid calling setState during render
  const pendingScaleRef = useRef<number | null>(null);

  // Sync store zoom changes to transform.scale
  useEffect(() => {
    // Defer setState to avoid calling setState synchronously within effect
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
        pendingScaleRef.current = newTransform.scale;
        // Defer the Zustand store update to avoid updating during render
        Promise.resolve().then(() => {
          if (pendingScaleRef.current === newTransform.scale) {
            setStoreZoom(newTransform.scale);
            pendingScaleRef.current = null;
          }
        });
      }
      return newTransform;
    });
  }, [setStoreZoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only allow dragging with left mouse button, not when creating a pin
    if (e.button === 0 && !isCreatingPin && !isDraggingRef.current) {
      isDraggingRef.current = true;
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX - transform.translateX,
        y: e.clientY - transform.translateY,
      };
      onDragStart?.();
    }
  }, [transform.translateX, transform.translateY, isCreatingPin, onDragStart]);

  // Attach window listeners once, check ref for drag state
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        e.preventDefault();
        setTransform((prev) => ({
          ...prev,
          translateX: e.clientX - dragStart.current.x,
          translateY: e.clientY - dragStart.current.y,
        }));
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        e.preventDefault();
        isDraggingRef.current = false;
        setIsDragging(false);
        onDragEnd?.();
      }
    };

    // Attach listeners to window for drag continuity
    window.addEventListener('mousemove', handleMouseMove, { passive: false });
    window.addEventListener('mouseup', handleMouseUp, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onDragEnd]);

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
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
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
