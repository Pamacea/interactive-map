import { useState, useCallback } from "react";

export interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
}

export interface UseMapPanOptions {
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function useMapPan(options: UseMapPanOptions = {}) {
  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - transform.translateX,
        y: e.clientY - transform.translateY,
      });
      options.onDragStart?.();
    }
  }, [transform.translateX, transform.translateY, options]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setTransform((prev) => ({
        ...prev,
        translateX: e.clientX - dragStart.x,
        translateY: e.clientY - dragStart.y,
      }));
    }
  }, [isDragging, dragStart.x, dragStart.y]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      options.onDragEnd?.();
    }
  }, [isDragging, options]);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const reset = useCallback(() => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
  }, []);

  return {
    transform,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    reset,
    setTransform,
  };
}
