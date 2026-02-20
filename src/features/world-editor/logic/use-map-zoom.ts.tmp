import { useCallback } from "react";
import type { Transform } from "./use-map-pan";

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5.0;
const ZOOM_BUTTON_FACTOR = 1.2;
const ZOOM_WHEEL_FACTOR_IN = 1.1;
const ZOOM_WHEEL_FACTOR_OUT = 0.9;

export interface UseMapZoomOptions {
  onZoomChange?: (scale: number) => void;
}

export function useMapZoom(
  transform: Transform,
  setTransform: (updater: (prev: Transform) => Transform) => void,
  options: UseMapZoomOptions = {}
) {
  const handleWheel = useCallback((e: React.WheelEvent) => {
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

    options.onZoomChange?.(newScale);
  }, [transform.scale, setTransform, options]);

  const handleZoomIn = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(prev.scale * ZOOM_BUTTON_FACTOR, MAX_ZOOM),
    }));
  }, [setTransform]);

  const handleZoomOut = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(prev.scale / ZOOM_BUTTON_FACTOR, MIN_ZOOM),
    }));
  }, [setTransform]);

  return {
    handleWheel,
    handleZoomIn,
    handleZoomOut,
  };
}
