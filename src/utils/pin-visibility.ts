import type { PinWithLayer } from "@/components/world/logic/use-pins-filtering";
import type { Transform } from "@/components/world/logic/use-map-pan";

/**
 * Interaction state for a pin (optional advanced visibility checks)
 */
export interface PinInteractionState {
  isDragging: boolean;
  isHovered: boolean;
  isSelected: boolean;
}

/**
 * Calculate whether a pin should be visible based on multiple criteria.
 *
 * This is a pure function that checks:
 * 1. Pin's isVisible flag (database toggle)
 * 2. Layer visibility (if assigned to a layer)
 * 3. Zoom range (minZoom, maxZoom)
 * 4. Interaction state (optional - dragging, hovering, selection)
 *
 * @param pin - The pin to evaluate with optional layer data
 * @param transform - Current map transform (scale, translation)
 * @param interactionState - Optional interaction state for advanced visibility logic
 * @returns boolean - True if the pin should be rendered, false otherwise
 *
 * @example
 * ```ts
 * const isVisible = calculatePinVisibility(pin, transform);
 * // Or with interaction state:
 * const isVisible = calculatePinVisibility(pin, transform, { isDragging: true, isHovered: false, isSelected: false });
 * ```
 */
export function calculatePinVisibility(
  pin: PinWithLayer,
  transform: Transform,
  interactionState?: PinInteractionState
): boolean {
  // 1. Check pin visibility flag (database toggle)
  if (!pin.isVisible) {
    return false;
  }

  // 2. Check layer visibility (if pin is assigned to a layer)
  if (pin.layerId && pin.layer) {
    if (!pin.layer.isVisible) {
      return false;
    }
  }

  // 3. Check zoom range
  // Convert scale to percentage (1.0 = 100%)
  const zoomPercentage = transform.scale * 100;

  // Handle null/undefined zoom values with sensible defaults
  // minZoom: null = 0% (always show when zoomed out)
  // maxZoom: null = 200% (show until very zoomed in)
  const minZoom = pin.minZoom ?? 0;
  const maxZoom = pin.maxZoom ?? 200;

  // Boundary conditions: pin is visible if current zoom is within range
  const withinZoomRange = zoomPercentage >= minZoom && zoomPercentage <= maxZoom;

  if (!withinZoomRange) {
    return false;
  }

  // 4. Advanced interaction-based visibility (optional)
  // If interaction state is provided, check interaction-specific rules
  if (interactionState) {
    // Always show dragging/hovered/selected pins regardless of other filters
    // This ensures the user can see what they're interacting with
    if (interactionState.isDragging || interactionState.isHovered || interactionState.isSelected) {
      return true;
    }
  }

  // All checks passed - pin should be visible
  return true;
}

/**
 * Pre-filter a list of pins for rendering based on zoom level.
 * This is useful for optimizing rendering by filtering pins BEFORE they reach React.
 *
 * @param pins - Array of pins to filter
 * @param transform - Current map transform
 * @returns Array of pins that should be rendered
 *
 * @example
 * ```ts
 * const visiblePins = useMemo(() => {
 *   return filterPinsByZoom(allPins, transform);
 * }, [allPins, transform]);
 * ```
 */
export function filterPinsByZoom(
  pins: PinWithLayer[],
  transform: Transform
): PinWithLayer[] {
  return pins.filter((pin) => calculatePinVisibility(pin, transform));
}
