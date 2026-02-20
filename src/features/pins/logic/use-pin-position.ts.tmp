import { useMemo } from "react";
import type { Pin } from "@prisma/client";
import { usePinScreenCoordinates } from "./use-pin-screen-coordinates";

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
  // Get base position from shared hook
  const basePosition = usePinScreenCoordinates({
    pin,
    imageDimensions,
    layers,
  });

  // Memoized position calculation to avoid recalculating on every render
  const position = useMemo(() => {
    // Use drag position if dragging, otherwise use pin's stored position
    let x = basePosition.x;
    let y = basePosition.y;
    let latitude = basePosition.latitude;
    let longitude = basePosition.longitude;

    if (dragPosition) {
      // During drag, use the drag position and add layer offset
      // dragPosition is the base position from mouse events (without layer offset)
      // We need to add the layer offset to get the final screen position
      x = dragPosition.x + basePosition.layerOffsetX;
      y = dragPosition.y + basePosition.layerOffsetY;
      // Recalculate lat/lng from drag position (without layer offset)
      latitude = dragPosition.y / basePosition.actualHeight;
      longitude = dragPosition.x / basePosition.actualWidth;
    }

    return {
      x,
      y,
      actualWidth: basePosition.actualWidth,
      actualHeight: basePosition.actualHeight,
      layer: basePosition.layer,
      layerOffsetX: basePosition.layerOffsetX,
      layerOffsetY: basePosition.layerOffsetY,
      latitude,
      longitude,
    };
  }, [basePosition, dragPosition]);

  return position;
}

/**
 * Type exports for TypeScript consumers
 */
export type PinPosition = ReturnType<typeof usePinPosition>;
export type PinPositionCoordinates = Pick<PinPosition, "x" | "y">;
export type PinPositionDimensions = Pick<PinPosition, "actualWidth" | "actualHeight">;
