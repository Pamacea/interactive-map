import { useEffect } from "react";
import { useMapStore } from "@/stores/map-store";
import type { MapLayer } from "@/types/world.type";

/**
 * Initializes map layers from world data into Zustand store
 * Transforms MapLayer (DB schema) to UILayer (store schema)
 */
export function useWorldInitialization(worldLayers: MapLayer[] | null) {
  const setLayers = useMapStore((state) => state.setLayers);

  useEffect(() => {
    if (worldLayers && worldLayers.length > 0) {
      const uiLayers = worldLayers.map((layer) => ({
        id: layer.id,
        name: layer.name,
        visible: layer.isVisible,
        locked: false,
        opacity: layer.opacity,
        zIndex: layer.zIndex,
      }));
      setLayers(uiLayers);
    }
  }, [worldLayers, setLayers]);
}
