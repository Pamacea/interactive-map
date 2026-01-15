/**
 * Pin type definitions and mappings
 * Centralized type system for Pin feature
 */

/**
 * Pin type enum - categorizes map markers by their purpose
 * Matches Prisma PinType enum exactly
 */
export enum PinTypeEnum {
  CITY = "CITY",
  VILLAGE = "VILLAGE",
  POI = "POI", // Point of Interest
  CHARACTER = "CHARACTER",
  DUNGEON = "DUNGEON",
  SHOP = "SHOP",
  QUEST = "QUEST",
  TREASURE = "TREASURE",
  CUSTOM = "CUSTOM",
}

/**
 * Color mapping for each pin type
 * Colors are semantic and provide visual hierarchy
 */
export const PIN_TYPE_COLORS: Record<PinTypeEnum, string> = {
  [PinTypeEnum.CITY]: "#c9a227", // Gold - major settlements
  [PinTypeEnum.VILLAGE]: "#8b7355", // Brown - smaller settlements
  [PinTypeEnum.POI]: "#3b82f6", // Blue - points of interest
  [PinTypeEnum.CHARACTER]: "#10b981", // Emerald - NPCs
  [PinTypeEnum.DUNGEON]: "#ef4444", // Red - danger areas
  [PinTypeEnum.SHOP]: "#f59e0b", // Amber - commerce
  [PinTypeEnum.QUEST]: "#8b5cf6", // Purple - quest markers
  [PinTypeEnum.TREASURE]: "#eab308", // Yellow - loot
  [PinTypeEnum.CUSTOM]: "#64748b", // Slate - user-defined
};

/**
 * Default size for each pin type (in pixels)
 */
export const PIN_TYPE_SIZES: Record<PinTypeEnum, number> = {
  [PinTypeEnum.CITY]: 48, // Largest - major locations
  [PinTypeEnum.VILLAGE]: 40, // Medium-large
  [PinTypeEnum.POI]: 32, // Standard
  [PinTypeEnum.CHARACTER]: 36, // Medium
  [PinTypeEnum.DUNGEON]: 44, // Large - important
  [PinTypeEnum.SHOP]: 32, // Standard
  [PinTypeEnum.QUEST]: 32, // Standard
  [PinTypeEnum.TREASURE]: 28, // Small-medium
  [PinTypeEnum.CUSTOM]: 32, // Standard
};

/**
 * Icon suggestions for each pin type
 * Maps to common icon libraries (Lucide, Heroicons, etc.)
 */
export const PIN_TYPE_ICONS: Record<PinTypeEnum, string[]> = {
  [PinTypeEnum.CITY]: ["building", "castle", "city"],
  [PinTypeEnum.VILLAGE]: ["house", "home", "village"],
  [PinTypeEnum.POI]: ["map-pin", "star", "bookmark"],
  [PinTypeEnum.CHARACTER]: ["user", "users", "person-standing"],
  [PinTypeEnum.DUNGEON]: ["skull", "mountain", "cave"],
  [PinTypeEnum.SHOP]: ["shopping-bag", "store", "cart"],
  [PinTypeEnum.QUEST]: ["scroll", "flag", "target"],
  [PinTypeEnum.TREASURE]: ["gem", "coins", "chest"],
  [PinTypeEnum.CUSTOM]: ["circle", "dot", "map-pin"],
};

/**
 * Pin interface - matches Prisma Pin model
 * Core data structure for pins
 */
export interface Pin {
  id: string;
  title: string;
  description: string | null;
  pinType: PinTypeEnum;
  latitude: number;
  longitude: number;
  icon: string | null;
  color: string;
  size: number;
  opacity: number;
  isVisible: boolean;
  minZoom: number;
  maxZoom: number;
  properties: unknown | null; // Custom RPG data (level, faction, etc.)
  userId: string;
  gameWorldId: string;
  layerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Pin creation input
 * Required fields for creating a new pin
 */
export interface PinCreateInput {
  title: string;
  description?: string;
  pinType?: PinTypeEnum;
  latitude: number;
  longitude: number;
  icon?: string;
  color?: string;
  size?: number;
  opacity?: number;
  isVisible?: boolean;
  properties?: unknown;
  gameWorldId: string;
  layerId?: string;
}

/**
 * Pin update input
 * All fields optional for partial updates
 */
export interface PinUpdateInput {
  id: string;
  title?: string;
  description?: string;
  pinType?: PinTypeEnum;
  latitude?: number;
  longitude?: number;
  icon?: string;
  color?: string;
  size?: number;
  opacity?: number;
  isVisible?: boolean;
  properties?: unknown;
  layerId?: string | null;
}

/**
 * Pin coordinates for map operations
 */
export interface PinCoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Pin query filters
 * For searching and filtering pins
 */
export interface PinFilters {
  gameWorldId: string;
  pinTypes?: PinTypeEnum[];
  layerIds?: string[];
  searchTerm?: string;
  showVisibleOnly?: boolean;
}

/**
 * Quick pin creation
 * Minimal input for fast pin placement
 */
export interface QuickPinInput {
  title: string;
  latitude: number;
  longitude: number;
  gameWorldId: string;
  pinType?: PinTypeEnum;
}

/**
 * Pin display metadata
 * Computed properties for UI rendering
 */
export interface PinDisplayMetadata {
  color: string;
  size: number;
  icon: string;
  zIndex: number;
}

/**
 * Get color for pin type
 * Helper function for consistent color mapping
 */
export function getPinTypeColor(pinType: PinTypeEnum): string {
  return PIN_TYPE_COLORS[pinType] || PIN_TYPE_COLORS[PinTypeEnum.CUSTOM];
}

/**
 * Get size for pin type
 * Helper function for consistent size mapping
 */
export function getPinTypeSize(pinType: PinTypeEnum): number {
  return PIN_TYPE_SIZES[pinType] || PIN_TYPE_SIZES[PinTypeEnum.CUSTOM];
}

/**
 * Get default icon for pin type
 * Returns first icon in the suggestions array
 */
export function getPinTypeIcon(pinType: PinTypeEnum): string {
  const icons = PIN_TYPE_ICONS[pinType] || PIN_TYPE_ICONS[PinTypeEnum.CUSTOM];
  return icons[0];
}

/**
 * Validate coordinates
 * Ensures lat/lng are within valid ranges
 */
export function isValidCoordinates(
  latitude: number,
  longitude: number
): boolean {
  return (
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/**
 * Pin type with display metadata
 * Rich type for UI components
 */
export interface PinWithType extends Pin {
  displayColor: string;
  displaySize: number;
  displayIcon: string;
}

/**
 * Convert Pin to PinWithType
 * Adds display metadata to pin
 */
export function enrichPinWithType(pin: Pin): PinWithType {
  return {
    ...pin,
    displayColor: pin.color || getPinTypeColor(pin.pinType),
    displaySize: pin.size || getPinTypeSize(pin.pinType),
    displayIcon: pin.icon || getPinTypeIcon(pin.pinType),
  };
}
