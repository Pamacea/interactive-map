"use client";

import { memo } from "react";
import * as LucideIcons from "lucide-react";
import { isLucideIconName } from "@/lib/icon-utils";

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

interface LucideIconWrapperProps {
  iconName: string;
  width: number;
  height: number;
  style: React.CSSProperties;
}

/**
 * Wrapper component to render Lucide icons
 * Declared outside render to satisfy react-hooks/static-components rule
 */
function LucideIconWrapper({ iconName, width, height, style }: LucideIconWrapperProps) {
  if (!isLucideIconName(iconName)) {
    return <LucideIcons.MapPin width={width} height={height} style={style} />;
  }

  const IconComponent = LucideIcons[iconName] as React.ComponentType<{
    width?: number;
    height?: number;
    style?: React.CSSProperties;
  }>;

  return <IconComponent width={width} height={height} style={style} />;
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

  // Render custom image
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

  // Render Lucide icon using wrapper component
  return <LucideIconWrapper iconName={iconName} width={clampedSize} height={clampedSize} style={{ color, opacity }} />;
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
