import { useMemo } from "react";
import type { Pin } from "@prisma/client";

/**
 * Position calculation hook for pin markers
 *
 * Handles coordinate conversion from latitude/longitude to pixel positions,
 * applies layer offsets, and manages drag positioning.
 *
 * @param pin - Pin data with layer information
 * @param dragPosition - Current drag position (if dragging)
 * @param imageDimensions - Original image dimensions from MapImage
 * @param transform - Map transform state (not used in calculation but needed for consistency)
 * @param layers - Available layers for offset lookup
 *
 * @returns Calculated position, dimensions, and layer info
 */
export function usePinPosition(
  pin: Pin & {
    layer?: {
      id: string;
      isVisible: boolean;
      zIndex: number;
    } | null;
  },
  dragPosition: { x: number; y: number } | null,
  imageDimensions: { width: number; height: number } | undefined,
  transform: {
    scale: number;
    translateX: number;
    translateY: number;
  },
  layers: Array<{
    id: string;
    offsetX?: number;
    offsetY?: number;
    locked?: boolean;
  }>
) {
  // Memoized position calculation to avoid recalculating on every render
  const position = useMemo(() => {
    // Find the layer this pin belongs to (if any)
    const layer = pin.layerId
      ? layers.find((layer) => layer.id === pin.layerId)
      : null;

    // Extract layer offset for position calculation
    const layerOffsetX = layer?.offsetX ?? 0;
    const layerOffsetY = layer?.offsetY ?? 0;

    // Use original image dimensions if provided (from MapImage), otherwise use fallback
    // Note: mapWidth/mapHeight are passed via imageDimensions for consistency
    const actualWidth = imageDimensions?.width ?? 0;
    const actualHeight = imageDimensions?.height ?? 0;

    // Convert lat/lng to pixel coordinates (percentage of ORIGINAL image dimensions)
    // Using drag position if dragging, otherwise use pin's stored position
    const latitude = dragPosition
      ? dragPosition.y / actualHeight
      : pin.latitude;
    const longitude = dragPosition
      ? dragPosition.x / actualWidth
      : pin.longitude;

    // Position is fixed relative to map image (percentage-based)
    // No transform applied here - the parent map container handles pan/zoom
    // Apply layer offset to the final position
    const x = longitude * actualWidth + layerOffsetX;
    const y = latitude * actualHeight + layerOffsetY;

    return {
      x,
      y,
      actualWidth,
      actualHeight,
      layer,
      layerOffsetX,
      layerOffsetY,
      latitude,
      longitude,
    };
  }, [pin, dragPosition, imageDimensions, layers]);

  return position;
}

/**
 * Type exports for TypeScript consumers
 */
export type PinPosition = ReturnType<typeof usePinPosition>;
export type PinPositionCoordinates = Pick<PinPosition, "x" | "y">;
export type PinPositionDimensions = Pick<PinPosition, "actualWidth" | "actualHeight">;
