/**
 * PinColorPicker - Unified color picker for pin customization
 *
 * Features:
 * - Preset colors (standard or fantasy-themed)
 * - Custom color input (color picker + text input)
 * - Hex validation
 * - Accessible keyboard navigation
 */

import { memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  FANTASY_PRESET_COLORS,
  STANDARD_PRESET_COLORS,
  isValidHexColor,
} from "./pin-constants";

export interface PinColorPickerProps {
  /** Current color value (hex format) */
  value: string;
  /** Called when color changes */
  onChange: (value: string) => void;
  /** Error message to display */
  error?: string;
  /** Disable the picker */
  disabled?: boolean;
  /** Label for the input */
  label?: string;
  /** ID for the input (defaults to label-derived) */
  id?: string;
  /** Name for form submission */
  name?: string;
  /** Which preset colors to show */
  presetType?: "standard" | "fantasy" | "none";
  /** Show both color picker and text input */
  showCustomPicker?: boolean;
  /** Number of columns for preset grid */
  gridCols?: number;
}

/**
 * Preset color button component
 */
interface PresetColorButtonProps {
  color: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  name?: string;
}

const PresetColorButton = memo(function PresetColorButton({
  color,
  isSelected,
  onClick,
  disabled,
  name,
}: PresetColorButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-8 rounded border-2 transition-all focus:outline-none focus:ring-2 focus:ring-accent-gold/50",
        isSelected
          ? "border-accent-gold scale-110 shadow-lg"
          : "border-border-subtle hover:scale-105 hover:border-hover",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      style={{ backgroundColor: color }}
      title={color}
      aria-label={`Select color ${color}`}
      aria-pressed={isSelected}
      data-color={color}
      data-name={name}
    />
  );
});

/**
 * PinColorPicker Component
 */
export const PinColorPicker = memo(function PinColorPicker({
  value,
  onChange,
  error,
  disabled = false,
  label = "Color",
  id,
  name,
  presetType = "fantasy",
  showCustomPicker = true,
  gridCols = 6,
}: PinColorPickerProps) {
  // Generate id from label if not provided
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  const colorInputId = `${inputId}-color`;
  const textInputId = `${inputId}-text`;
  const inputName = name || label.toLowerCase().replace(/\s+/g, "-");

  // Handle color change with validation
  const handleColorChange = useCallback(
    (newValue: string) => {
      // If it's a valid hex color, use it directly
      if (isValidHexColor(newValue)) {
        onChange(newValue);
        return;
      }
      // Otherwise still update (for user typing), but will show error
      onChange(newValue);
    },
    [onChange]
  );

  // Handle preset color click
  const handlePresetClick = useCallback(
    (color: string) => {
      onChange(color);
    },
    [onChange]
  );

  // Determine which presets to show
  const presets = presetType === "standard" ? STANDARD_PRESET_COLORS : FANTASY_PRESET_COLORS;
  const presetColors = presetType === "fantasy" ? presets.map((p) => p.value) : presets;

  return (
    <div className="grid gap-2">
      {label && (
        <label className="text-sm font-medium leading-none" htmlFor={textInputId}>
          {label}
        </label>
      )}

      {/* Custom picker row (color input + text input) */}
      {showCustomPicker && (
        <div className="flex items-center gap-3">
          <input
            id={colorInputId}
            name={inputName}
            type="color"
            value={isValidHexColor(value) ? value : "#3b82f6"}
            onChange={(e) => handleColorChange(e.target.value)}
            disabled={disabled}
            className="w-16 h-10 rounded cursor-pointer disabled:opacity-50 border border-border-subtle"
            aria-label="Color picker"
          />
          <input
            id={textInputId}
            name={inputName}
            type="text"
            value={value}
            onChange={(e) => handleColorChange(e.target.value)}
            disabled={disabled}
            placeholder="#3b82f6"
            className={cn(
              "flex-1 h-10 rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/50 disabled:opacity-50 bg-background-input",
              error ? "border-status-error" : "border-input"
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
          />
        </div>
      )}

      {/* Preset colors grid */}
      {presetType !== "none" && (
        <div
          className={cn(
            "flex gap-2 flex-wrap",
            gridCols && gridCols > 0 && `grid grid-cols-${gridCols} gap-2`
          )}
        >
          {presetColors.map((color) => (
            <PresetColorButton
              key={color}
              color={typeof color === "string" ? color : color.value}
              isSelected={value.toLowerCase() === (typeof color === "string" ? color : color.value).toLowerCase()}
              onClick={() => handlePresetClick(typeof color === "string" ? color : color.value)}
              disabled={disabled}
              name={inputName}
            />
          ))}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-status-error">
          {error}
        </p>
      )}
    </div>
  );
});

PinColorPicker.displayName = "PinColorPicker";

/**
 * Simple color swatch for display-only purposes
 */
export interface ColorSwatchProps {
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export const ColorSwatch = memo(function ColorSwatch({
  color,
  size = "md",
  className,
  onClick,
}: ColorSwatchProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={cn(
        "rounded border border-border-subtle",
        sizeClasses[size],
        onClick && "cursor-pointer hover:scale-110 transition-transform",
        className
      )}
      style={{ backgroundColor: color }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      aria-label={`Color: ${color}`}
    />
  );
});

ColorSwatch.displayName = "ColorSwatch";
