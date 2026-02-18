/**
 * Pin type definitions and mappings
 * Centralized type system for Pin feature
 */

import { PinType as PrismaPinType } from "@prisma/client";

/**
 * Pin type enum - categorizes map markers by their purpose
 * Re-exports Prisma PinType enum for use throughout the app
 */
export const PinType = PrismaPinType;

/**
 * Color mapping for each pin type
 * Colors are semantic and provide visual hierarchy
 */
export const PIN_TYPE_COLORS: Record<keyof typeof PrismaPinType, string> = {
  CITY: "#c9a227", // Gold - major settlements
  VILLAGE: "#8b7355", // Brown - smaller settlements
  POI: "#3b82f6", // Blue - points of interest
  CHARACTER: "#10b981", // Emerald - NPCs
  DUNGEON: "#ef4444", // Red - danger areas
  SHOP: "#f59e0b", // Amber - commerce
  QUEST: "#8b5cf6", // Purple - quest markers
  TREASURE: "#eab308", // Yellow - loot
  CUSTOM: "#64748b", // Slate - user-defined
};

/**
 * Default size for each pin type (in pixels)
 */
export const PIN_TYPE_SIZES: Record<keyof typeof PrismaPinType, number> = {
  CITY: 48, // Largest - major locations
  VILLAGE: 40, // Medium-large
  POI: 32, // Standard
  CHARACTER: 36, // Medium
  DUNGEON: 44, // Large - important
  SHOP: 32, // Standard
  QUEST: 32, // Standard
  TREASURE: 28, // Small-medium
  CUSTOM: 32, // Standard
};

/**
 * Icon suggestions for each pin type
 * Maps to common icon libraries (Lucide, Heroicons, etc.)
 */
export const PIN_TYPE_ICONS: Record<keyof typeof PrismaPinType, string[]> = {
  CITY: ["building", "castle", "city"],
  VILLAGE: ["house", "home", "village"],
  POI: ["map-pin", "star", "bookmark"],
  CHARACTER: ["user", "users", "person-standing"],
  DUNGEON: ["skull", "mountain", "cave"],
  SHOP: ["shopping-bag", "store", "cart"],
  QUEST: ["scroll", "flag", "target"],
  TREASURE: ["gem", "coins", "chest"],
  CUSTOM: ["circle", "dot", "map-pin"],
};

/**
 * Pin interface - matches Prisma Pin model
 * Core data structure for pins
 */
export interface Pin {
  id: string;
  title: string;
  description: string | null;
  pinType: (typeof PrismaPinType)[keyof typeof PrismaPinType];
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
  // Enhanced icon customization
  customIcon: string | null; // URL to custom uploaded icon (PNG, WebP, SVG)
  iconShape: import("@prisma/client").IconShape | null; // Shape of the pin marker
  iconSize: number | null; // Custom icon size override (12-64px)
  iconBackground: string | null; // URL to custom background image for icon
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
  pinType?: (typeof PrismaPinType)[keyof typeof PrismaPinType];
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
  pinType?: (typeof PrismaPinType)[keyof typeof PrismaPinType];
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
  pinTypes?: (typeof PrismaPinType)[keyof typeof PrismaPinType][];
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
  pinType?: (typeof PrismaPinType)[keyof typeof PrismaPinType];
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
export function getPinTypeColor(pinType: (typeof PrismaPinType)[keyof typeof PrismaPinType]): string {
  return PIN_TYPE_COLORS[pinType] || PIN_TYPE_COLORS.CUSTOM;
}

/**
 * Get size for pin type
 * Helper function for consistent size mapping
 */
export function getPinTypeSize(pinType: (typeof PrismaPinType)[keyof typeof PrismaPinType]): number {
  return PIN_TYPE_SIZES[pinType] || PIN_TYPE_SIZES.CUSTOM;
}

/**
 * Get default icon for pin type
 * Returns first icon in the suggestions array
 */
export function getPinTypeIcon(pinType: (typeof PrismaPinType)[keyof typeof PrismaPinType]): string {
  const icons = PIN_TYPE_ICONS[pinType] || PIN_TYPE_ICONS.CUSTOM;
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
