import { useMemo } from "react";
import type { Pin } from "@prisma/client";

/**
 * Shared coordinate calculation for pins and popups
 *
 * This hook provides consistent coordinate calculation that:
 * 1. Converts lat/lng (0-1) to pixel positions
 * 2. Applies layer offsets
 * 3. Handles map transforms for screen coordinates
 *
 * Used by both PinMarker and SelectedPinPopup to ensure consistent positioning.
 */

export interface CoordinateInput {
  pin: Pin & {
    layer?: {
      id: string;
      isVisible: boolean;
      zIndex: number;
      offsetX?: number;
      offsetY?: number;
    } | null;
  };
  imageDimensions: { width: number; height: number } | null | undefined;
  layers: Array<{
    id: string;
    offsetX?: number;
    offsetY?: number;
    locked?: boolean;
  }>;
}

export interface CoordinateResult {
  /** Pixel X position relative to map image (with layer offset) */
  x: number;
  /** Pixel Y position relative to map image (with layer offset) */
  y: number;
  /** Latitude (0-1) */
  latitude: number;
  /** Longitude (0-1) */
  longitude: number;
  /** Original image width */
  actualWidth: number;
  /** Original image height */
  actualHeight: number;
  /** Layer X offset applied to position */
  layerOffsetX: number;
  /** Layer Y offset applied to position */
  layerOffsetY: number;
  /** The layer this pin belongs to (if any) */
  layer: ReturnType<typeof layers.find> | null;
}

/**
 * Calculate pin position in pixels with layer offsets applied
 *
 * @param input - Pin data, image dimensions, and available layers
 * @returns Coordinate result with pixel positions and metadata
 */
export function usePinScreenCoordinates(input: CoordinateInput): CoordinateResult {
  const { pin, imageDimensions, layers } = input;

  const result = useMemo(() => {
    // Find the layer this pin belongs to (if any)
    const layer = pin.layerId
      ? layers.find((l) => l.id === pin.layerId) ?? null
      : null;

    // Extract layer offset (null-safe)
    const layerOffsetX = layer?.offsetX ?? 0;
    const layerOffsetY = layer?.offsetY ?? 0;

    // Get image dimensions
    const actualWidth = imageDimensions?.width ?? 0;
    const actualHeight = imageDimensions?.height ?? 0;

    // Store coordinates
    const latitude = pin.latitude;
    const longitude = pin.longitude;

    // Convert lat/lng to pixel coordinates and apply layer offset
    // Position is relative to the map image (0,0 is top-left of image)
    const x = longitude * actualWidth + layerOffsetX;
    const y = latitude * actualHeight + layerOffsetY;

    return {
      x,
      y,
      latitude,
      longitude,
      actualWidth,
      actualHeight,
      layerOffsetX,
      layerOffsetY,
      layer,
    };
  }, [pin, imageDimensions, layers]);

  return result;
}

/**
 * Convert mouse event to map coordinates (0-1 range)
 * Accounts for map transform (translateX, translateY, scale)
 *
 * @param clientX - Mouse clientX from event
 * @param clientY - Mouse clientY from event
 * @param rect - Container bounding rect
 * @param transform - Current map transform
 * @param imageDimensions - Image dimensions for normalization
 * @returns Object with lat/lng in 0-1 range
 */
export function mouseToMapCoordinates(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  transform: { scale: number; translateX: number; translateY: number },
  imageDimensions: { width: number; height: number }
): { lat: number; lng: number } | null {
  // Guard against invalid values
  if (transform.scale <= 0 || imageDimensions.width <= 0 || imageDimensions.height <= 0) {
    return null;
  }

  // Get mouse position relative to container
  const containerX = clientX - rect.left;
  const containerY = clientY - rect.top;

  // Reverse the transform to get position in map-content space
  // The transform is: translate(translateX, translateY) scale(scale)
  // To reverse: subtract translate, then divide by scale
  const mapX = (containerX - transform.translateX) / transform.scale;
  const mapY = (containerY - transform.translateY) / transform.scale;

  // Convert to 0-1 range (latitude/longitude stored in DB)
  const lng = mapX / imageDimensions.width;
  const lat = mapY / imageDimensions.height;

  // Clamp to valid range
  return {
    lat: Math.max(0, Math.min(1, lat)),
    lng: Math.max(0, Math.min(1, lng)),
  };
}
