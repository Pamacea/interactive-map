/**
 * PinShapeSelector - Shape selection for pins
 *
 * Allows users to choose the shape of their pin markers from predefined options.
 */

import { memo, useCallback } from "react";
import { cn } from "@/shared/utils";
import { ICON_SHAPES } from "./pin-constants";
import type { IconShape } from "@prisma/client";

export interface PinShapeSelectorProps {
  /** Currently selected shape */
  value: IconShape;
  /** Called when shape changes */
  onChange: (shape: IconShape) => void;
  /** Color for the preview */
  color?: string;
  /** Size of preview shapes */
  previewSize?: number;
  /** Disable the selector */
  disabled?: boolean;
  /** Label for the selector */
  label?: string;
  /** Number of columns in the grid */
  gridCols?: number;
  /** Show labels under shapes */
  showLabels?: boolean;
}

/**
 * ShapePreview - Small preview of a shape
 */
interface ShapePreviewProps {
  shape: IconShape;
  color: string;
  size: number;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
}

const ShapePreview = memo(function ShapePreview({
  shape,
  color,
  size,
  isSelected,
  onClick,
  disabled,
  label,
}: ShapePreviewProps) {
  const config = ICON_SHAPES[shape];
  const clipPath = config.path === "none" ? undefined : config.path;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center gap-2 p-2 rounded-sm border-2 transition-all",
        "hover:bg-accent-gold/5",
        isSelected
          ? "border-accent-gold bg-accent-gold/20"
          : "border-border-subtle",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      title={config.name}
    >
      <div
        className="transition-transform hover:scale-105"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          clipPath,
        }}
      />
      {label && (
        <span className="text-xs text-text-secondary">{label}</span>
      )}
    </button>
  );
});

ShapePreview.displayName = "ShapePreview";

/**
 * PinShapeSelector Component
 */
export const PinShapeSelector = memo(function PinShapeSelector({
  value,
  onChange,
  color = "#3b82f6",
  previewSize = 32,
  disabled = false,
  label,
  gridCols = 4,
  showLabels = true,
}: PinShapeSelectorProps) {
  const handleShapeSelect = useCallback(
    (shape: IconShape) => {
      onChange(shape);
    },
    [onChange]
  );

  const gridColsClass = `grid-cols-${Math.min(gridCols, 7)}`;

  return (
    <div className="grid gap-3">
      {label && (
        <label className="text-sm font-medium leading-none">
          {label}
        </label>
      )}

      <div className={cn("grid gap-2", gridColsClass)}>
        {(Object.keys(ICON_SHAPES) as IconShape[]).map((shape) => (
          <ShapePreview
            key={shape}
            shape={shape}
            color={color}
            size={previewSize}
            isSelected={value === shape}
            onClick={() => handleShapeSelect(shape)}
            disabled={disabled}
            label={showLabels ? ICON_SHAPES[shape].name : undefined}
          />
        ))}
      </div>
    </div>
  );
});

PinShapeSelector.displayName = "PinShapeSelector";

/**
 * CompactShapeSelector - Smaller version for tight spaces
 */
export interface CompactShapeSelectorProps {
  value: IconShape;
  onChange: (shape: IconShape) => void;
  color?: string;
  disabled?: boolean;
}

export const CompactShapeSelector = memo(function CompactShapeSelector({
  value,
  onChange,
  color = "#3b82f6",
  disabled = false,
}: CompactShapeSelectorProps) {
  const handleShapeSelect = useCallback(
    (shape: IconShape) => {
      onChange(shape);
    },
    [onChange]
  );

  return (
    <div className="flex items-center gap-1">
      {(Object.keys(ICON_SHAPES) as IconShape[]).map((shape) => {
        const config = ICON_SHAPES[shape];
        const clipPath = config.path === "none" ? undefined : config.path;

        return (
          <button
            key={shape}
            type="button"
            onClick={() => handleShapeSelect(shape)}
            disabled={disabled}
            className={cn(
              "w-8 h-8 rounded-sm transition-all hover:scale-110",
              value === shape
                ? "ring-2 ring-accent-gold ring-offset-1 ring-offset-background-base"
                : "",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            style={{
              backgroundColor: color,
              clipPath,
            }}
            title={config.name}
            aria-label={config.name}
            aria-pressed={value === shape}
          />
        );
      })}
    </div>
  );
});

CompactShapeSelector.displayName = "CompactShapeSelector";
