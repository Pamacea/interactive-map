/**
 * Pin type definitions and color mappings
 *
 * Matches Prisma schema PinType enum
 * Colors align with existing schema defaults
 * Icons use Lucide React component names
 */

import type { LucideIcon } from "lucide-react";

// Pin type enum matching Prisma schema exactly
export enum PinType {
  CITY = "CITY",
  VILLAGE = "VILLAGE",
  POI = "POI",
  CHARACTER = "CHARACTER",
  DUNGEON = "DUNGEON",
  SHOP = "SHOP",
  QUEST = "QUEST",
  TREASURE = "TREASURE",
  CUSTOM = "CUSTOM",
}

/**
 * Pin type configuration interface
 */
export interface PinTypeConfig {
  /** Lucide icon component name (e.g., "Building", "Users") */
  icon: string;
  /** Hex color string (e.g., "#c9a227") */
  color: string;
  /** Display label for UI */
  label: string;
  /** Optional description */
  description?: string;
}

/**
 * Complete pin type configuration
 * Colors match Prisma schema defaults
 * Icons are Lucide React component names
 */
export const pinTypeConfig: Record<PinType, PinTypeConfig> = {
  [PinType.CITY]: {
    icon: "Building2",
    color: "#c9a227",
    label: "City",
    description: "Major settlements and capitals",
  },
  [PinType.VILLAGE]: {
    icon: "Home",
    color: "#8b7355",
    label: "Village",
    description: "Small towns and hamlets",
  },
  [PinType.POI]: {
    icon: "MapPin",
    color: "#4a9eff",
    label: "Point of Interest",
    description: "Notable locations and landmarks",
  },
  [PinType.CHARACTER]: {
    icon: "User",
    color: "#9b59b6",
    label: "Character",
    description: "NPCs and story characters",
  },
  [PinType.DUNGEON]: {
    icon: "Sword",
    color: "#e74c3c",
    label: "Dungeon",
    description: "Dangerous areas and instances",
  },
  [PinType.SHOP]: {
    icon: "ShoppingCart",
    color: "#2ecc71",
    label: "Shop",
    description: "Merchants and services",
  },
  [PinType.QUEST]: {
    icon: "ScrollText",
    color: "#f39c12",
    label: "Quest",
    description: "Quest givers and objectives",
  },
  [PinType.TREASURE]: {
    icon: "Gem",
    color: "#1abc9c",
    label: "Treasure",
    description: "Loot and hidden items",
  },
  [PinType.CUSTOM]: {
    icon: "Star",
    color: "#3b82f6",
    label: "Custom",
    description: "Custom pin type",
  },
};

/**
 * Get full configuration for a pin type
 * @param type - Pin type enum value
 * @returns Pin type configuration object
 */
export function getPinTypeConfig(type: PinType): PinTypeConfig {
  return pinTypeConfig[type];
}

/**
 * Get color for a pin type
 * @param type - Pin type enum value
 * @returns Hex color string
 */
export function getPinTypeColor(type: PinType): string {
  return pinTypeConfig[type].color;
}

/**
 * Get icon name for a pin type
 * @param type - Pin type enum value
 * @returns Lucide icon component name
 */
export function getPinTypeIcon(type: PinType): string {
  return pinTypeConfig[type].icon;
}

/**
 * Get all pin types as an array
 * Useful for select dropdowns and filters
 */
export function getPinTypes(): PinType[] {
  return Object.values(PinType);
}

/**
 * Get pin type options for UI selects
 * Returns array of { value, label, color, icon }
 */
export function getPinTypeOptions() {
  return Object.entries(pinTypeConfig).map(([type, config]) => ({
    value: type,
    label: config.label,
    color: config.color,
    icon: config.icon,
  }));
}
