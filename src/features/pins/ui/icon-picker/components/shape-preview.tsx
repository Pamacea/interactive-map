"use client";

import { ICON_SHAPES } from "../icon-data";
import type { IconShape } from "@prisma/client";

interface ShapePreviewProps {
  shape: IconShape;
  color: string;
}

/**
 * Shape Preview Component
 * Small preview of a shape in the shape selector
 */
export function ShapePreview({ shape, color }: ShapePreviewProps) {
  const size = 32;

  return (
    <div
      className="mx-auto"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        clipPath:
          ICON_SHAPES[shape].path === "none"
            ? undefined
            : ICON_SHAPES[shape].path,
      }}
    />
  );
}
