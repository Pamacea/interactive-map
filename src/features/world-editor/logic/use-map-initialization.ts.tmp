import { useRef, useEffect } from "react";
import { useMapStore } from "@/features/world-editor/store/map-store";
import { useMapExport } from "@/features/export/utils/use-map-export-context";

export interface UseMapInitializationOptions {
  mapImage?: string | null;
  worldId?: string;
}

export interface MapInitializationResult {
  containerRef: React.RefObject<HTMLDivElement | null>;
  grid: boolean;
  scale: string;
  layers: Array<{
    id: string;
    visible: boolean;
    zIndex: number;
    isBaseMap?: boolean;
    scale?: number;
    offsetX?: number;
    offsetY?: number;
  }>;
  selectedLayerId: string | null;
  baseMapVisible: boolean;
}

/**
 * Hook to initialize map and handle container reference
 * Manages map element reference for export functionality
 */
export function useMapInitialization(
  options: UseMapInitializationOptions
): MapInitializationResult {
  const { mapImage, worldId } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const { setMapElement } = useMapExport();

  // Store selectors
  const grid = useMapStore((state) => state.grid);
  const scale = useMapStore((state) => state.scale);
  const layers = useMapStore((state) => state.layers);
  const selectedLayerId = useMapStore((state) => state.selectedLayerId);
  const baseMapVisible = useMapStore((state) => state.baseMapVisible);

  // Update map element reference for export
  useEffect(() => {
    if (containerRef.current) {
      setMapElement(containerRef.current);
    }

    return () => {
      setMapElement(null);
    };
  }, [setMapElement]);

  return {
    containerRef,
    grid,
    scale,
    layers,
    selectedLayerId,
    baseMapVisible,
  };
}
