"use client";

import { useEffect, type RefObject } from "react";

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5.0;
const ZOOM_WHEEL_FACTOR_IN = 1.1;
const ZOOM_WHEEL_FACTOR_OUT = 0.9;

interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
}

interface UseMapWheelProps {
  containerRef: RefObject<HTMLDivElement | null>;
  transform: Transform;
  setTransform: (update: (prev: Transform) => Transform) => void;
}

export function useMapWheel({
  containerRef,
  transform,
  setTransform,
}: UseMapWheelProps) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelNonPassive = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? ZOOM_WHEEL_FACTOR_OUT : ZOOM_WHEEL_FACTOR_IN;
      const newScale = Math.min(
        Math.max(transform.scale * delta, MIN_ZOOM),
        MAX_ZOOM
      );

      setTransform((prev) => ({
        ...prev,
        scale: newScale,
      }));
    };

    container.addEventListener("wheel", handleWheelNonPassive, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheelNonPassive);
    };
  }, [transform.scale, setTransform]);
}
