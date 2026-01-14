import { useMemo } from "react";
import type { Pin } from "@prisma/client";
import { usePinFilters } from "@/stores/pin-filters-store";

// Extended type for pins with layer relations (using Prisma types)
export interface PinWithLayer extends Pin {
  layer?: {
    id: string;
    name: string;
    isVisible: boolean;
    zIndex: number;
  } | null;
}

export interface UsePinsFilteringOptions {
  pins: PinWithLayer[];
  layers: Array<{ id: string; visible: boolean; zIndex: number }>;
}

export function usePinsFiltering({ pins, layers }: UsePinsFilteringOptions) {
  // Get active filters from store (Record<PinTypeEnum, boolean>)
  const pinFilters = usePinFilters();

  const visiblePins = useMemo(() => {
    return pins
      .filter((pin) => {
        // Check pin visibility from DB
        if (!pin.isVisible) {
          return false;
        }

        // Check layer visibility from DB (if layer assigned)
        if (pin.layerId && pin.layer) {
          if (!pin.layer.isVisible) {
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
  }, [pins, layers, pinFilters]);

  return {
    visiblePins,
  };
}
