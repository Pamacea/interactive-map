/**
 * Pin icon definitions organized by category
 *
 * Provides 20+ predefined icons from lucide-react
 * Each icon has a name, label, and category for filtering
 */

import type { LucideIcon } from "lucide-react";

export type PinIconCategory =
  | "location"
  | "building"
  | "item"
  | "character"
  | "nature"
  | "dungeon"
  | "quest"
  | "other";

/**
 * Pin icon configuration interface
 */
export interface PinIconOption {
  /** Unique identifier for the icon */
  name: string;
  /** Human-readable label */
  label: string;
  /** Lucide icon component name (e.g., "MapPin", "Castle") */
  icon: keyof typeof import("lucide-react");
  /** Category for filtering/grouping */
  category: PinIconCategory;
}

/**
 * Complete pin icon library
 * 45+ icons organized by category
 */
export const PIN_ICONS: PinIconOption[] = [
  // LOCATION icons
  {
    name: "map-pin",
    label: "Map Pin",
    icon: "MapPin",
    category: "location",
  },
  {
    name: "navigation",
    label: "Navigation",
    icon: "Navigation",
    category: "location",
  },
  {
    name: "compass",
    label: "Compass",
    icon: "Compass",
    category: "location",
  },
  {
    name: "crosshair",
    label: "Crosshair",
    icon: "Crosshair",
    category: "location",
  },
  {
    name: "locate",
    label: "Locate",
    icon: "Locate",
    category: "location",
  },
  {
    name: "locate-fixed",
    label: "Locate Fixed",
    icon: "LocateFixed",
    category: "location",
  },

  // BUILDING icons
  {
    name: "castle",
    label: "Castle",
    icon: "Castle",
    category: "building",
  },
  {
    name: "home",
    label: "Home",
    icon: "Home",
    category: "building",
  },
  {
    name: "building-2",
    label: "Building",
    icon: "Building2",
    category: "building",
  },
  {
    name: "store",
    label: "Store",
    icon: "Store",
    category: "building",
  },
  {
    name: "warehouse",
    label: "Warehouse",
    icon: "Warehouse",
    category: "building",
  },
  {
    name: "tent",
    label: "Tent",
    icon: "Tent",
    category: "building",
  },
  {
    name: "church",
    label: "Temple",
    icon: "Church",
    category: "building",
  },

  // ITEM icons
  {
    name: "sword",
    label: "Sword",
    icon: "Sword",
    category: "item",
  },
  {
    name: "gem",
    label: "Gem",
    icon: "Gem",
    category: "item",
  },
  {
    name: "scroll",
    label: "Scroll",
    icon: "Scroll",
    category: "item",
  },
  {
    name: "book",
    label: "Book",
    icon: "Book",
    category: "item",
  },
  {
    name: "package",
    label: "Package",
    icon: "Package",
    category: "item",
  },
  {
    name: "shopping-bag",
    label: "Shopping Bag",
    icon: "ShoppingBag",
    category: "item",
  },
  {
    name: "key",
    label: "Key",
    icon: "Key",
    category: "item",
  },

  // CHARACTER icons
  {
    name: "user",
    label: "User",
    icon: "User",
    category: "character",
  },
  {
    name: "users",
    label: "Users",
    icon: "Users",
    category: "character",
  },
  {
    name: "crown",
    label: "Crown",
    icon: "Crown",
    category: "character",
  },
  {
    name: "shield",
    label: "Shield",
    icon: "Shield",
    category: "character",
  },
  {
    name: "user-circle",
    label: "User Circle",
    icon: "UserCircle",
    category: "character",
  },
  {
    name: "ghost",
    label: "Ghost",
    icon: "Ghost",
    category: "character",
  },

  // NATURE icons
  {
    name: "tree",
    label: "Tree",
    icon: "TreePine",
    category: "nature",
  },
  {
    name: "mountain",
    label: "Mountain",
    icon: "Mountain",
    category: "nature",
  },
  {
    name: "waves",
    label: "Waves",
    icon: "Waves",
    category: "nature",
  },
  {
    name: "sun",
    label: "Sun",
    icon: "Sun",
    category: "nature",
  },
  {
    name: "moon",
    label: "Moon",
    icon: "Moon",
    category: "nature",
  },
  {
    name: "flame",
    label: "Flame",
    icon: "Flame",
    category: "nature",
  },
  {
    name: "cloud",
    label: "Cloud",
    icon: "Cloud",
    category: "nature",
  },
  {
    name: "leaf",
    label: "Leaf",
    icon: "Leaf",
    category: "nature",
  },

  // DUNGEON/COMBAT icons
  {
    name: "skull",
    label: "Skull",
    icon: "Skull",
    category: "dungeon",
  },
  {
    name: "cross",
    label: "Grave",
    icon: "Cross",
    category: "dungeon",
  },
  {
    name: "zap",
    label: "Lightning",
    icon: "Zap",
    category: "dungeon",
  },
  {
    name: "target",
    label: "Target",
    icon: "Target",
    category: "dungeon",
  },
  {
    name: "swords",
    label: "Swords",
    icon: "Swords",
    category: "dungeon",
  },

  // QUEST icons
  {
    name: "scroll-text",
    label: "Quest Scroll",
    icon: "ScrollText",
    category: "quest",
  },
  {
    name: "file-text",
    label: "Document",
    icon: "FileText",
    category: "quest",
  },
  {
    name: "check-circle",
    label: "Task Complete",
    icon: "CheckCircle",
    category: "quest",
  },

  // OTHER icons
  {
    name: "star",
    label: "Star",
    icon: "Star",
    category: "other",
  },
  {
    name: "heart",
    label: "Heart",
    icon: "Heart",
    category: "other",
  },
  {
    name: "flag",
    label: "Flag",
    icon: "Flag",
    category: "other",
  },
  {
    name: "circle",
    label: "Circle",
    icon: "Circle",
    category: "other",
  },
  {
    name: "circle-dot",
    label: "Dot",
    icon: "CircleDot",
    category: "other",
  },
  {
    name: "sparkles",
    label: "Sparkles",
    icon: "Sparkles",
    category: "other",
  },
  {
    name: "bookmark",
    label: "Bookmark",
    icon: "Bookmark",
    category: "other",
  },
];

/**
 * Get icon by name
 * Returns MapPin as default if not found
 */
export function getIconByName(
  name: string
): keyof typeof import("lucide-react") {
  return (
    (PIN_ICONS.find((i) => i.name === name)?.icon as keyof typeof import("lucide-react")) ||
    "MapPin"
  );
}

/**
 * Get icons filtered by category
 */
export function getIconsByCategory(
  category: PinIconCategory
): PinIconOption[] {
  return PIN_ICONS.filter((icon) => icon.category === category);
}

/**
 * Get all categories
 */
export function getIconCategories(): PinIconCategory[] {
  return [
    "location",
    "building",
    "item",
    "character",
    "nature",
    "dungeon",
    "quest",
    "other",
  ];
}

/**
 * Get all unique categories from the icon list
 */
export function getUniqueCategories(): PinIconCategory[] {
  const categories = new Set<PinIconCategory>();
  PIN_ICONS.forEach((icon) => categories.add(icon.category));
  return Array.from(categories);
}
