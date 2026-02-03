import type { PinWithLayer } from "@/components/world/logic/use-pins-filtering";
import type { Transform } from "@/components/world/logic/use-map-pan";
import type { MapLayer } from "@/types/world.type";

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

/**
 * Calculate whether a layer should be visible based on zoom range.
 *
 * Layers can have minZoom and maxZoom properties to control visibility
 * at different zoom levels. This function checks if the current zoom
 * is within the layer's defined range.
 *
 * @param layer - The layer to evaluate
 * @param transform - Current map transform (scale)
 *returns boolean - True if the layer should be visible, false otherwise
 *
 * @example
 * ```ts
 * const isVisible = calculateLayerVisibility(layer, transform);
 *
 * // Layer visible only between 50% and 150% zoom:
 * const isVisible = calculateLayerVisibility(
 *   { minZoom: 50, maxZoom: 150 },
 *   { scale: 1.0 } // 100% zoom
 * ); // false (100% is within range, but need to check current zoom)
 * ```
 */
export function calculateLayerVisibility(
  layer: MapLayer,
  transform: Transform
): boolean {
  // 1. Check layer visibility flag (database toggle)
  if (!layer.isVisible) {
    return false;
  }

  // 2. Check zoom range
  // Convert scale to percentage (1.0 = 100%)
  const zoomPercentage = transform.scale * 100;

  // Handle null/undefined zoom values with sensible defaults
  // minZoom: null = 0% (always show when zoomed out)
  // maxZoom: null = 200% (show until very zoomed in)
  const minZoom = layer.minZoom ?? 0;
  const maxZoom = layer.maxZoom ?? 200;

  // Layer is visible if current zoom is within range
  return zoomPercentage >= minZoom && zoomPercentage <= maxZoom;
}

/**
 * Filter an array of layers based on zoom level.
 * This returns only layers that should be visible at the current zoom level.
 *
 * @param layers - Array of layers to filter
 * @param transform - Current map transform
 * @returns Array of layers that should be visible
 *
 * @example
 * ```ts
 * const visibleLayers = useMemo(() => {
 *   return filterLayersByZoom(allLayers, transform);
 * }, [allLayers, transform]);
 * ```
 */
export function filterLayersByZoom(
  layers: MapLayer[],
  transform: Transform
): MapLayer[] {
  return layers.filter((layer) => calculateLayerVisibility(layer, transform));
}
