import { useMapStore } from "@/stores/map-store";

/**
 * Prepares world state for autosave by combining store state with pin count
 * Returns a stable object reference for autosave comparison
 */
export function useAutosavePreparation(pinCount: number) {
  const layers = useMapStore((state) => state.layers);
  const grid = useMapStore((state) => state.grid);
  const snap = useMapStore((state) => state.snap);
  const scale = useMapStore((state) => state.scale);

  return {
    layers,
    grid,
    snap,
    scale,
    pinCount,
  };
}
