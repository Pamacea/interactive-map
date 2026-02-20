/**
 * PropertyColorPicker - Reusable color picker for property panels
 *
 * Features:
 * - Preset colors palette
 * - Custom color input (native picker)
 * - Hex input with validation
 * - Consistent styling
 */

import * as React from "react";
import { cn } from "@/shared/utils";

// Fantasy-themed preset colors
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
] as const;

export interface PropertyColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
  showPresets?: boolean;
  showHexInput?: boolean;
  presets?: readonly { name: string; value: string }[];
  containerClassName?: string;
}

export function PropertyColorPicker({
  label = "Color",
  value,
  onChange,
  disabled,
  showPresets = true,
  showHexInput = true,
  presets = PRESET_COLORS,
  containerClassName,
}: PropertyColorPickerProps) {
  const [customHex, setCustomHex] = React.useState(value);
  const [isValidHex, setIsValidHex] = React.useState(true);

  React.useEffect(() => {
    setCustomHex(value);
    setIsValidHex(/^#[0-9A-Fa-f]{6}$/.test(value));
  }, [value]);

  const handlePresetClick = (color: string) => {
    onChange(color);
  };

  const handleColorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/i.test(color)) {
      onChange(color);
    }
    setCustomHex(color);
    setIsValidHex(/^#[0-9A-Fa-f]{6}$/i.test(color));
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setCustomHex(hex);

    if (/^#[0-9A-Fa-f]{6}$/i.test(hex)) {
      onChange(hex);
      setIsValidHex(true);
    } else {
      setIsValidHex(/^#[0-9A-Fa-f]{0,6}$/i.test(hex));
    }
  };

  return (
    <div className={cn("space-y-2", containerClassName)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-display text-text-muted uppercase tracking-wide">
          {label}
        </span>
        <div className="flex items-center gap-2">
          {showHexInput && (
            <span
              className={cn(
                "text-xs font-mono px-2 py-0.5 rounded bg-background-input border border-border-subtle",
                isValidHex ? "text-accent-gold" : "text-red-400"
              )}
            >
              {customHex}
            </span>
          )}
        </div>
      </div>

      {/* Color input with preview */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={handleColorInput}
            disabled={disabled}
            className={cn(
              "w-10 h-10 rounded-sm cursor-pointer border-2 border-border-subtle",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "hover:border-accent-gold/50 transition-colors"
            )}
          />
          <div
            className="absolute inset-0 rounded-sm pointer-events-none ring-1 ring-inset ring-white/10"
            style={{ backgroundColor: value }}
          />
        </div>

        {showHexInput && (
          <div className="flex-1">
            <input
              type="text"
              value={customHex}
              onChange={handleHexInput}
              disabled={disabled}
              placeholder="#000000"
              maxLength={7}
              className={cn(
                "w-full bg-background-input border border-border-subtle rounded-sm px-3 py-2 text-sm font-mono",
                "focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/30",
                "transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                !isValidHex && "border-red-500/50 focus:border-red-500"
              )}
            />
          </div>
        )}
      </div>

      {/* Preset colors */}
      {showPresets && presets.length > 0 && (
        <div className="grid grid-cols-6 gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handlePresetClick(preset.value)}
              disabled={disabled}
              className={cn(
                "w-full aspect-square rounded-sm border-2 transition-all",
                "hover:scale-110 active:scale-95",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                value === preset.value
                  ? "border-white ring-2 ring-accent-gold/50"
                  : "border-transparent"
              )}
              style={{ backgroundColor: preset.value }}
              title={preset.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
