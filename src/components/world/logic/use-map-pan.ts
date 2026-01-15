import { useState, useCallback, useEffect, useRef } from "react";

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
  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

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
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
  }, []);

  return {
    transform,
    isDragging,
    handleMouseDown,
    reset,
    setTransform,
  };
}
