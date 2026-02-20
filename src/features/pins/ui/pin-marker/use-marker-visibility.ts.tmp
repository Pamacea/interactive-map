import type { Pin } from "@prisma/client";

interface UseMarkerVisibilityParams {
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
  isHovered: boolean;
  isPinSelected: boolean;
}

/**
 * useMarkerVisibility - Calculates visibility conditions for pin markers
 *
 * Handles multiple visibility constraints:
 * - Explicit visibility flag (pin.isVisible)
 * - Zoom-based visibility (min/max zoom range)
 * - Size-based visibility (hide when too small)
 * - Interaction state (always show when dragging, hovered, or selected)
 *
 * @returns Whether the marker should be rendered
 */
export function useMarkerVisibility({
  pin,
  transform,
  isDragging,
  isHovered,
  isPinSelected,
}: UseMarkerVisibilityParams): boolean {
  // Single source of truth for visibility - already filtered at map-canvas level
  const isVisible = pin.isVisible;

  // ZOOM-BASED VISIBILITY: Hide pins that are too small to be useful
  const MIN_VISIBLE_SIZE = 6; // Minimum 6px to be visible/clickable
  const currentSize = pin.size * transform.scale;

  // ZOOM RANGE VISIBILITY: Check if current zoom is within pin's min/max zoom range
  const zoomPercentage = transform.scale * 100;
  const withinZoomRange =
    zoomPercentage >= (pin.minZoom ?? 0) && zoomPercentage <= (pin.maxZoom ?? 200);

  // INTERACTION STATE: Always show when interacting
  const isInteracting = isDragging || isHovered || isPinSelected;

  // Combine all visibility conditions
  return isVisible && (isInteracting || (withinZoomRange && currentSize >= MIN_VISIBLE_SIZE));
}
