"use client";

import * as React from "react";
import { ICON_SHAPES, LUCIDE_ICONS } from "../icon-data";
import type { IconShape } from "@prisma/client";

interface PinPreviewProps {
  icon: string;
  color: string;
  shape: IconShape;
  size: number;
  customIcon?: string;
  iconBackground?: string | null;
}

/**
 * Pin Preview Component
 * Shows how the pin will look on the map
 */
export function PinPreview({
  icon,
  color,
  shape,
  size,
  customIcon,
  iconBackground,
}: PinPreviewProps) {
  const scale = Math.min(size / 32, 2);

  // Check if icon is a Lucide icon reference
  const isLucideIcon = icon.startsWith("lucide:");
  const lucideIconName = isLucideIcon ? icon.replace("lucide:", "") : null;
  const LucideComponent =
    lucideIconName && LUCIDE_ICONS[lucideIconName as keyof typeof LUCIDE_ICONS];

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: `${size * scale}px`,
        height: `${size * scale}px`,
      }}
    >
      {customIcon ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={customIcon}
          alt="Custom icon"
          className="w-full h-full object-contain"
          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
        />
      ) : (
        <div
          className="flex items-center justify-center font-medium relative"
          style={{
            backgroundColor: iconBackground ? "transparent" : color,
            clipPath:
              ICON_SHAPES[shape].path === "none"
                ? undefined
                : ICON_SHAPES[shape].path,
            fontSize: `${size * 0.5 * scale}px`,
            width: "100%",
            height: "100%",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          }}
        >
          {/* Background image if provided - fully covers the color background */}
          {iconBackground && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={iconBackground}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                clipPath:
                  ICON_SHAPES[shape].path === "none"
                    ? undefined
                    : ICON_SHAPES[shape].path,
                zIndex: 0,
              }}
            />
          )}

          {/* Icon content */}
          {isLucideIcon && LucideComponent ? (
            <LucideComponent className="h-4/5 w-4/5 text-white relative z-10" />
          ) : (
            <span className="relative z-10">{icon}</span>
          )}
        </div>
      )}
    </div>
  );
}
