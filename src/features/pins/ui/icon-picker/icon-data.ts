import type { IconShape } from "@prisma/client";

/**
 * Icon Shapes Configuration
 * CSS clip-path definitions for pin shapes
 */
export const ICON_SHAPES: Record<
  IconShape,
  { name: string; path: string; preview: string }
> = {
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
 * Preset Colors
 * Fantasy-themed color palette for pin icons
 */
export const PRESET_COLORS = [
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
];

/**
 * Emoji Icons Library
 * Categorized emoji collections for pin markers
 */
export const EMOJI_ICONS = {
  locations: [
    "📍", "🏰", "🏠", "🏯", "🏟️", "⛪", "🕌", "🏛️", "🏔️", "🗻",
    "🌋", "⛺", "🏕️", "🏝️", "🏜️", "🌳", "🌲", "🌴", "🏙️", "🏘️",
    "🏚️", "🏭", "⚓", "🚢", "✈️",
  ],
  combat: ["⚔️", "🛡️", "🏹", "🪓", "🗡️", "🔱", "🔥", "💣", "🎯", "⚔️"],
  items: ["💎", "📜", "🛒", "👤", "👑", "💍", "🗝️", "📦", "🎁", "💰", "💀", "🧪"],
  nature: ["🌊", "🔥", "💧", "⚡", "❄️", "🌈", "☀️", "🌙", "⭐", "🌍"],
  creatures: [
    "🐉", "🦅", "🦁", "🐺", "🦌", "🐲", "🦇", "🐙", "🦑", "🦂", "🐍", "🦎",
  ],
  misc: [
    "❤️", "⚠️", "❓", "❗", "✨", "🎭", "🎪", "🔔", "📌", "🏴", "🚩", "⚜️",
  ],
} as const;

/**
 * Lucide Icon Components
 * Import and export all available Lucide icons for pin markers
 */
import {
  MapPin,
  Home,
  Sword,
  Gem,
  ScrollText,
  ShoppingBag,
  User,
  Mountain,
  TreePine,
  MountainSnow,
  Castle,
  Church,
  Landmark,
  Flame,
  Droplets,
  Zap,
  Skull,
  Shield,
  Trophy,
  Key,
  Package,
  Tent,
  Anchor,
  Binoculars,
  Compass,
  Flag,
  Ghost,
  Sparkles,
  CircleDollarSign,
  FlaskConical,
} from "lucide-react";

// Re-export for convenience
export {
  MapPin,
  Home,
  Sword,
  Gem,
  ScrollText,
  ShoppingBag,
  User,
  Mountain,
  TreePine,
  MountainSnow,
  Castle,
  Church,
  Landmark,
  Flame,
  Droplets,
  Zap,
  Skull,
  Shield,
  Trophy,
  Key,
  Package,
  Tent,
  Anchor,
  Binoculars,
  Compass,
  Flag,
  Ghost,
  Sparkles,
  CircleDollarSign,
  FlaskConical,
} from "lucide-react";

/**
 * Lucide Icons Mapping
 * Maps icon names to their components for programmatic access
 */
export const LUCIDE_ICONS = {
  MapPin,
  Home,
  Sword,
  Gem,
  ScrollText,
  ShoppingBag,
  User,
  Mountain,
  TreePine,
  MountainSnow,
  Castle,
  Church,
  Landmark,
  Flame,
  Droplets,
  Zap,
  Skull,
  Shield,
  Trophy,
  Key,
  Package,
  Campfire: Flame, // Use Flame as Campfire alternative
  Tent,
  Anchor,
  Binoculars,
  Compass,
  Flag,
  Ghost,
  Sparkles,
  CircleDollarSign,
  FlaskConical,
} as const;
