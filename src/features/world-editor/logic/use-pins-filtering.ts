import { useMemo } from "react";
import type { Pin } from "@prisma/client";
import { usePinTypeFilters } from "@/features/pins/store";
import { calculateLayerVisibility } from "@/utils/pin-visibility";
import type { Transform } from "./use-map-pan";
import type { MapLayer } from "@/types/world.type";

// Extended type for pins with layer relations (using Prisma types)
export interface PinWithLayer extends Pin {
  layer?: MapLayer | null;
}

export interface UsePinsFilteringOptions {
  pins: PinWithLayer[];
  layers: MapLayer[];
  transform: Transform;
}

export function usePinsFiltering({ pins, layers, transform }: UsePinsFilteringOptions) {
  // Get active filters from store (Record<PinTypeEnum, boolean>)
  const pinFilters = usePinTypeFilters();

  // Get visible layer IDs (considering zoom-based visibility)
  const visibleLayerIds = useMemo(() => {
    return layers
      .filter((layer) => calculateLayerVisibility(layer, transform))
      .map((layer) => layer.id);
  }, [layers, transform]);

  const visiblePins = useMemo(() => {
    return pins
      .filter((pin) => {
        // Check pin visibility from DB
        if (!pin.isVisible) {
          return false;
        }

        // Check layer visibility from DB (if layer assigned)
        if (pin.layerId && pin.layer) {
          // Check layer is visible (toggle) AND within zoom range
          if (!visibleLayerIds.includes(pin.layerId)) {
            return false;
          }
        }

        // Apply user-defined type filters
        // If the pin type is explicitly set to false in filters, hide it
        if (pinFilters[pin.pinType] === false) {
          return false;
        }

        // Pin is visible
        return true;
      })
      .sort((a, b) => {
        // Sort by layer zIndex
        const aLayer = layers.find((l) => l.id === a.layerId);
        const bLayer = layers.find((l) => l.id === b.layerId);
        const aZIndex = aLayer?.zIndex ?? 0;
        const bZIndex = bLayer?.zIndex ?? 0;
        return aZIndex - bZIndex;
      });
  }, [pins, layers, visibleLayerIds, pinFilters]);

  return {
    visiblePins,
    visibleLayerIds,
  };
}
