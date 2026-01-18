"use client";

import { memo } from "react";
import { getLucideIcon } from "@/lib/icon-utils";

export interface PinIconProps {
  /** Icon name (Lucide icon name or custom image path starting with "/") */
  iconName: string;
  /** Icon color (hex code or CSS color) - only for Lucide icons */
  color?: string;
  /** Icon size in pixels (will be clamped to min 12px, max 32px) */
  size: number;
  /** Opacity (0-1) */
  opacity?: number;
  /** Alt text for custom images */
  alt?: string;
}

/**
 * PinIcon - Renders either a Lucide icon or custom image for pins
 *
 * Features:
 * - Auto-detects custom images (paths starting with "/")
 * - Falls back to MapPin icon if Lucide icon not found
 * - Applies drop-shadow filter for visibility
 * - Memoized for performance
 * - Size constraints: min 12px, max 32px
 */
export function PinIcon({
  iconName,
  color = "white",
  size,
  opacity = 0.9,
  alt = "Pin icon",
}: PinIconProps) {
  // Check if icon is a custom uploaded image (starts with /)
  const isCustomImage = iconName?.startsWith("/");

  // Clamp size to constraints (60% of pin size, min 12px, max 32px)
  const clampedSize = Math.max(12, Math.min(32, size));

  // Check if icon is a custom uploaded image (starts with /)
  if (isCustomImage) {
    return (
      <img
        src={iconName}
        alt={alt}
        className="w-full h-full object-contain"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
      />
    );
  }

  // Get Lucide icon component for non-custom icons (type-safe)
  const IconComponent = getLucideIcon(iconName);

  return (
    <IconComponent
      width={clampedSize}
      height={clampedSize}
      style={{ color, opacity }}
    />
  );
}

// Memoize to prevent unnecessary re-renders
export const MemoizedPinIcon = memo(PinIcon, (prevProps, nextProps) => {
  return (
    prevProps.iconName === nextProps.iconName &&
    prevProps.color === nextProps.color &&
    prevProps.size === nextProps.size &&
    prevProps.opacity === nextProps.opacity
  );
});

MemoizedPinIcon.displayName = "MemoizedPinIcon";
