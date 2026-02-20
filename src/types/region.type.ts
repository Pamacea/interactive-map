/**
 * Region types for the map editor
 * Defines coordinate structures for different region shapes
 */

export type RegionType = "RECTANGLE" | "CIRCLE" | "POLYGON";

/**
 * Coordinates for different region types
 * - Rectangle: { x, y, width, height }
 * - Circle: { centerX, centerY, radius }
 * - Polygon: { points: [{x, y}, ...] }
 */
export interface RegionCoordinates {
  // Rectangle coordinates
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  // Circle coordinates
  centerX?: number;
  centerY?: number;
  radius?: number;
  // Polygon coordinates
  points?: Array<{ x: number; y: number }>;
}

export interface Region {
  id: string;
  name: string;
  type: RegionType;
  coordinates: RegionCoordinates;
  description: string | null;
  visible: boolean;
  locked: boolean;
  color: string;
  opacity: number;
  borderWidth: number;
  layerId: string;
  gameWorldId: string;
  createdAt: Date;
  updatedAt: Date;
  layer?: {
    id: string;
    name: string;
    isVisible: boolean;
  };
}

/**
 * Prisma Region type (from database)
 */
export type PrismaRegion = {
  id: string;
  name: string;
  type: RegionType;
  coordinates: unknown; // Json value from Prisma
  description: string | null;
  visible: boolean;
  locked: boolean;
  color: string;
  opacity: number;
  borderWidth: number;
  layerId: string;
  gameWorldId: string;
  createdAt: Date;
  updatedAt: Date;
  layer?: {
    id: string;
    name: string;
    isVisible: boolean;
  } | null;
};

/**
 * Type guard to validate RegionCoordinates
 */
export function isValidRegionCoordinates(
  coords: unknown
): coords is RegionCoordinates {
  if (typeof coords !== "object" || coords === null) {
    return false;
  }

  // Check for rectangle coordinates
  if (
    "x" in coords &&
    "y" in coords &&
    "width" in coords &&
    "height" in coords
  ) {
    return (
      typeof coords.x === "number" &&
      typeof coords.y === "number" &&
      typeof coords.width === "number" &&
      typeof coords.height === "number"
    );
  }

  // Check for circle coordinates
  if (
    "centerX" in coords &&
    "centerY" in coords &&
    "radius" in coords
  ) {
    return (
      typeof coords.centerX === "number" &&
      typeof coords.centerY === "number" &&
      typeof coords.radius === "number"
    );
  }

  // Check for polygon coordinates
  if ("points" in coords && Array.isArray(coords.points)) {
    return coords.points.every(
      (point) =>
        typeof point === "object" &&
        point !== null &&
        "x" in point &&
        "y" in point &&
        typeof point.x === "number" &&
        typeof point.y === "number"
    );
  }

  return false;
}
