import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "@/constants/pin-types";

/**
 * Type-safe Lucide icon component map
 * This provides proper TypeScript types for accessing Lucide icons dynamically
 */
type LucideIconName = keyof typeof LucideIcons;

/**
 * Type guard to check if a string is a valid Lucide icon name
 */
export function isLucideIconName(iconName: string): iconName is LucideIconName {
  return iconName in LucideIcons;
}

/**
 * Get a Lucide icon component by name with type safety
 * Returns MapPin as fallback if icon not found
 *
 * @param iconName - The name of the Lucide icon
 * @returns The Lucide icon component or MapPin as fallback
 */
export function getLucideIcon(iconName: string): LucideIcon {
  if (isLucideIconName(iconName)) {
    const IconComponent = LucideIcons[iconName];

    // Verify it's a React component
    if (typeof IconComponent === "function") {
      return IconComponent as LucideIcon;
    }
  }

  // Fallback to MapPin
  // @ts-ignore - MapPin exists in lucide-react
  return LucideIcons.MapPin as LucideIcon;
}

/**
 * Get all Lucide icon component names
 * Filters out non-component exports
 */
export function getLucideIconNames(): string[] {
  return Object.keys(LucideIcons).filter((key) => {
    const item = LucideIcons[key as LucideIconName];
    return (
      key !== "createLucideIcon" &&
      key !== "default" &&
      key !== "icons" &&
      typeof item === "function"
    );
  });
}
