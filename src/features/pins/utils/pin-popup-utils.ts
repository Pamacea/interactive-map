/**
 * Pin popup utility functions
 * Pure functions for formatting and display logic
 */

import type { PinType } from "@/constants/pin-types";

/**
 * Get emoji representation for pin type
 * Fallback icons that work without Lucide React
 */
export function getPinEmoji(type: PinType): string {
  const emojiMap: Record<PinType, string> = {
    CITY: "🏰",
    VILLAGE: "🏠",
    POI: "📍",
    CHARACTER: "👤",
    DUNGEON: "⚔️",
    SHOP: "🛒",
    QUEST: "📜",
    TREASURE: "💎",
    CUSTOM: "⭐",
  };
  return emojiMap[type] || "📍";
}

/**
 * Format property value for display
 * Handles primitives, arrays, and objects
 */
export function formatPropertyValue(value: unknown): string {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return JSON.stringify(value);
}

/**
 * Format coordinates for display
 */
export function formatCoordinate(value: number, decimals: number = 4): string {
  return value.toFixed(decimals);
}
