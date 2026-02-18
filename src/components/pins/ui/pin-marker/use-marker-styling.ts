import type { Pin } from "@prisma/client";

interface UseMarkerStylingParams {
  pin: Pin & {
    layer?: {
      id: string;
      isVisible: boolean;
      zIndex: number;
    } | null;
  };
  transform: {
    scale: number;
    translateX: number;
    translateY: number;
  };
  isDragging: boolean;
  isPinSelected: boolean;
  isHovered: boolean;
}

/**
 * useMarkerStyling - Calculates style properties for pin markers
 *
 * Handles:
 * - Size constraints (min/max size based on zoom)
 * - Z-index calculation (layer-based + interaction boosts)
 * - Icon scaling (proportional to zoom with constraints)
 *
 * @returns Style properties and computed values
 */
export function useMarkerStyling({
  pin,
  transform,
  isDragging,
  isPinSelected,
  isHovered,
}: UseMarkerStylingParams) {
  // Ensure pins always render above the map image (z-index: 0)
  // Base z-index of 10 ensures pins are above the image but below UI overlays (z-index: 50+)
  const baseZIndex = 10;
  const layerZIndex = pin.layer?.zIndex ?? 0;
  const finalZIndex = isDragging || isPinSelected ? 9999 : baseZIndex + layerZIndex;

  // SIZE CONSTRAINTS: Apply min/max size to prevent microscopic or oversized pins
  const MIN_PIN_SIZE = 8;
  const MAX_PIN_SIZE = 128;
  const scaledSize = pin.size * transform.scale;
  const finalSize = Math.max(MIN_PIN_SIZE, Math.min(MAX_PIN_SIZE, scaledSize));

  // Icon size scales proportionally but with constraints
  const iconScale = Math.max(0.5, Math.min(3, transform.scale));
  const iconSize = 16 * iconScale;

  // Shadow calculation based on interaction state
  const getBoxShadow = () => {
    if (isDragging) {
      return "0 8px 20px rgba(0, 0, 0, 0.6)";
    }
    if (isPinSelected) {
      return "0 4px 12px rgba(0, 0, 0, 0.5)";
    }
    if (isHovered) {
      return "0 4px 12px rgba(0, 0, 0, 0.5)";
    }
    return "0 2px 8px rgba(0, 0, 0, 0.3)";
  };

  // Transform scale based on interaction state
  const getTransformScale = () => {
    if (isDragging) return "scale(1.2)";
    if (isPinSelected) return "scale(1.05)";
    if (isHovered) return "scale(1.1)";
    return "scale(1)";
  };

  return {
    finalZIndex,
    finalSize,
    iconSize,
    boxShadow: getBoxShadow(),
    transformScale: getTransformScale(),
  };
}
