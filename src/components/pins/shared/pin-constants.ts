/**
 * Pin Shared Constants
 *
 * Centralized constants for the pin system to avoid duplication
 * across components and ensure consistency.
 */

import type { IconShape } from "@prisma/client";
import type { PinType } from "@/types/pin.type";

// ============================================================================
// SHAPE DEFINITIONS
// ============================================================================

/**
 * Shape definitions with CSS clip-path
 * Used by marker-container and pin-icon-picker
 */
export const ICON_SHAPES: Record<IconShape, { name: string; path: string; preview: string }> = {
  CIRCLE: { name: "Circle", path: "circle(50%)", preview: "rounded-full" },
  SQUARE: { name: "Square", path: "inset(0%)", preview: "rounded-none" },
  TRIANGLE: {
    name: "Triangle",
    path: "polygon(50% 0%, 0% 100%, 100% 100%)",
    preview: "",
  },
  STAR: {
    name: "Star",
    path: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
    preview: "",
  },
  HEXAGON: {
    name: "Hexagon",
    path: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
    preview: "",
  },
  DIAMOND: {
    name: "Diamond",
    path: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    preview: "",
  },
  CUSTOM: { name: "Custom Upload", path: "none", preview: "" },
};

/**
 * Get clip path for a shape (for direct use in styles)
 */
export function getShapeClipPath(shape: IconShape): string {
  return ICON_SHAPES[shape]?.path ?? ICON_SHAPES.CIRCLE.path;
}

// ============================================================================
// COLOR PRESETS
// ============================================================================

/**
 * Standard preset colors for UI color pickers
 */
export const STANDARD_PRESET_COLORS = [
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#10b981", // Green
  "#f59e0b", // Amber
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#64748b", // Slate
  "#000000", // Black
  "#ffffff", // White
] as const;

/**
 * Fantasy-themed preset colors for world-building
 */
export const FANTASY_PRESET_COLORS = [
  { name: "Gold", value: "#c9a227" },
  { name: "Ruby", value: "#e74c3c" },
  { name: "Sapphire", value: "#3498db" },
  { name: "Emerald", value: "#27ae60" },
  { name: "Amethyst", value: "#9b59b6" },
  { name: "Silver", value: "#95a5a6" },
  { name: "Obsidian", value: "#2c3e50" },
  { name: "Bone", value: "#d4c5a9" },
  { name: "Blood", value: "#8b0000" },
  { name: "Forest", value: "#228b22" },
  { name: "Sky", value: "#87ceeb" },
  { name: "Shadow", value: "#4a4a4a" },
] as const;

/**
 * Combined preset colors (flat array for simple pickers)
 */
export const PRESET_COLORS = FANTASY_PRESET_COLORS.map((c) => c.value);

/**
 * Get color by name from fantasy presets
 */
export function getFantasyColor(name: string): string | undefined {
  return FANTASY_PRESET_COLORS.find((c) => c.name.toLowerCase() === name.toLowerCase())?.value;
}

// ============================================================================
// PIN TYPE OPTIONS
// ============================================================================

/**
 * Lucide icon imports for pin types
 * Import these at the top of files that use PIN_TYPE_OPTIONS
 */
export const PIN_TYPE_ICONS = {
  Building2: () => require("lucide-react").Building2,
  Home: () => require("lucide-react").Home,
  MapPin: () => require("lucide-react").MapPin,
  User: () => require("lucide-react").User,
  Mountain: () => require("lucide-react").Mountain,
  ShoppingBag: () => require("lucide-react").ShoppingBag,
  Scroll: () => require("lucide-react").Scroll,
  Gem: () => require("lucide-react").Gem,
  Circle: () => require("lucide-react").Circle,
} as const;

/**
 * Pin type options for selectors
 */
export const PIN_TYPE_OPTIONS: Array<{
  value: PinType;
  label: string;
  icon: keyof typeof PIN_TYPE_ICONS;
}> = [
  { value: "CITY", label: "City", icon: "Building2" },
  { value: "VILLAGE", label: "Village", icon: "Home" },
  { value: "POI", label: "Point of Interest", icon: "MapPin" },
  { value: "CHARACTER", label: "Character", icon: "User" },
  { value: "DUNGEON", label: "Dungeon", icon: "Mountain" },
  { value: "SHOP", label: "Shop", icon: "ShoppingBag" },
  { value: "QUEST", label: "Quest", icon: "Scroll" },
  { value: "TREASURE", label: "Treasure", icon: "Gem" },
  { value: "CUSTOM", label: "Custom", icon: "Circle" },
] as const;

// ============================================================================
// SIZE LIMITS
// ============================================================================

/**
 * Size constraints for pins
 */
export const PIN_SIZE_LIMITS = {
  MIN: 16,
  MAX: 128,
  DEFAULT: 32,
  ICON_MIN: 12,
  ICON_MAX: 64,
} as const;

// ============================================================================
// COORDINATE LIMITS
// ============================================================================

/**
 * Valid ranges for coordinates (0-1 for normalized, -90/90 -180/180 for geographic)
 */
export const COORDINATE_LIMITS = {
  NORMALIZED: { MIN: 0, MAX: 1 },
  LATITUDE: { MIN: -90, MAX: 90 },
  LONGITUDE: { MIN: -180, MAX: 180 },
} as const;

/**
 * Validate if coordinates are in valid normalized range (0-1)
 */
export function isValidNormalizedCoordinate(lat: number, lng: number): boolean {
  return (
    lat >= COORDINATE_LIMITS.NORMALIZED.MIN &&
    lat <= COORDINATE_LIMITS.NORMALIZED.MAX &&
    lng >= COORDINATE_LIMITS.NORMALIZED.MIN &&
    lng <= COORDINATE_LIMITS.NORMALIZED.MAX
  );
}

/**
 * Validate if coordinates are in valid geographic range
 */
export function isValidGeographicCoordinate(lat: number, lng: number): boolean {
  return (
    lat >= COORDINATE_LIMITS.LATITUDE.MIN &&
    lat <= COORDINATE_LIMITS.LATITUDE.MAX &&
    lng >= COORDINATE_LIMITS.LONGITUDE.MIN &&
    lng <= COORDINATE_LIMITS.LONGITUDE.MAX
  );
}

// ============================================================================
// ZOOM LIMITS
// ============================================================================

/**
 * Zoom level constraints
 */
export const ZOOM_LIMITS = {
  MIN: 0,
  MAX: 200,
  DEFAULT_MIN: 0,
  DEFAULT_MAX: 200,
} as const;

// ============================================================================
// HEX COLOR VALIDATION
// ============================================================================

/**
 * Regex for hex color validation
 */
export const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

/**
 * Validate a hex color string
 */
export function isValidHexColor(color: string): boolean {
  return HEX_COLOR_REGEX.test(color);
}

/**
 * Format a color to hex if valid, otherwise return default
 */
export function normalizeHexColor(color: string, defaultColor: string = "#3b82f6"): string {
  if (isValidHexColor(color)) return color;
  return defaultColor;
}

// ============================================================================
// EMOJI ICONS BY CATEGORY
// ============================================================================

/**
 * Emoji icons organized by category for icon picker
 */
export const EMOJI_ICONS = {
  locations: [
    "📍",
    "🏰",
    "🏠",
    "🏯",
    "🏟️",
    "⛪",
    "🕌",
    "🏛️",
    "🏔️",
    "🗻",
    "🌋",
    "⛺",
    "🏕️",
    "🏝️",
    "🏜️",
    "🌳",
    "🌲",
    "🌴",
    "🏙️",
    "🏘️",
    "🏚️",
    "🏭",
    "⚓",
    "🚢",
    "✈️",
  ],
  combat: ["⚔️", "🛡️", "🏹", "🪓", "🗡️", "🔱", "🔥", "💣", "🎯", "⚔️"],
  items: ["💎", "📜", "🛒", "👤", "👑", "💍", "🗝️", "📦", "🎁", "💰", "💀", "🧪"],
  nature: ["🌊", "🔥", "💧", "⚡", "❄️", "🌈", "☀️", "🌙", "⭐", "🌍"],
  creatures: [
    "🐉",
    "🦅",
    "🦁",
    "🐺",
    "🦌",
    "🐲",
    "🦇",
    "🐙",
    "🦑",
    "🦂",
    "🐍",
    "🦎",
  ],
  misc: [
    "❤️",
    "⚠️",
    "❓",
    "❗",
    "✨",
    "🎭",
    "🎪",
    "🔔",
    "📌",
    "🏴",
    "🚩",
    "⚜️",
  ],
} as const;

export type EmojiIconCategory = keyof typeof EMOJI_ICONS;
