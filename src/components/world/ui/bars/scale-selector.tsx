/**
 * ScaleSelector - Enhanced dropdown to select map scale
 *
 * Options: 1:1, 1:10, 1:100, 1:1000, 1:10000
 * - Displays current scale with value badge
 * - Changes zoom level when scale changes
 * - Consistent with PropertyComponents styling
 */

import { ChevronDown, Map } from "lucide-react";
import { cn } from "@/lib/utils";

export type ScaleOption = "1:1" | "1:10" | "1:100" | "1:1000" | "1:10000";

export const SCALE_OPTIONS: ScaleOption[] = ["1:1", "1:10", "1:100", "1:1000", "1:10000"];

export const SCALE_TO_ZOOM: Record<ScaleOption, number> = {
  "1:1": 4.0,
  "1:10": 2.0,
  "1:100": 1.0,
  "1:1000": 0.5,
  "1:10000": 0.25,
};

export const ZOOM_TO_SCALE: Record<number, ScaleOption> = {
  4.0: "1:1",
  2.0: "1:10",
  1.0: "1:100",
  0.5: "1:1000",
  0.25: "1:10000",
};

const SCALE_LABELS: Record<ScaleOption, string> = {
  "1:1": "Detail",
  "1:10": "Close",
  "1:100": "Normal",
  "1:1000": "Far",
  "1:10000": "Overview",
};

export interface ScaleSelectorProps {
  value: ScaleOption;
  onChange: (value: ScaleOption) => void;
  className?: string;
  showLabel?: boolean;
}

export function ScaleSelector({
  value,
  onChange,
  className,
  showLabel = false,
}: ScaleSelectorProps) {
  const handleScaleChange = (scale: ScaleOption) => {
    onChange(scale);
  };

  return (
    <div
      className={cn(
        "bg-background-elevated/90 backdrop-blur-md rounded-sm border border-border-subtle px-3 py-2",
        className
      )}
    >
      {/* Label row */}
      {showLabel && (
        <div className="flex items-center gap-1.5 mb-2">
          <Map className="w-3 h-3 text-text-muted" aria-hidden="true" />
          <span className="text-xs font-display text-text-muted uppercase tracking-wide">
            Scale
          </span>
        </div>
      )}

      {/* Select wrapper */}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => handleScaleChange(e.target.value as ScaleOption)}
          className={cn(
            "w-full appearance-none bg-background-input border border-border-subtle rounded-sm",
            "px-3 py-2 pr-10 text-sm",
            "text-accent-gold font-display font-medium",
            "hover:border-border-hover transition-colors",
            "focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/30",
            "cursor-pointer"
          )}
          title="Change map scale"
          aria-label="Select map scale"
        >
          {SCALE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option} {SCALE_LABELS[option]}
            </option>
          ))}
        </select>

        {/* Value badge overlay */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
          <span className="text-xs font-display font-semibold text-accent-gold px-1.5 py-0.5 bg-accent-gold/10 rounded-sm">
            {value}
          </span>
        </div>

        {/* Custom dropdown arrow */}
        <ChevronDown
          className="w-4 h-4 text-text-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transition-transform"
          strokeWidth={2}
          aria-hidden="true"
        />
      </div>

      {/* Description */}
      {showLabel && (
        <p className="text-xs text-text-muted mt-1.5">
          Current scale:{" "}
          <span className="font-semibold text-accent-gold">{value}</span>
        </p>
      )}
    </div>
  );
}

/**
 * CompactScaleSelector - Minimal version for toolbar use
 */
export interface CompactScaleSelectorProps {
  value: ScaleOption;
  onChange: (value: ScaleOption) => void;
  className?: string;
}

export function CompactScaleSelector({
  value,
  onChange,
  className,
}: CompactScaleSelectorProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ScaleOption)}
        className={cn(
          "appearance-none bg-background-elevated/90 backdrop-blur-md",
          "border border-border-subtle rounded-sm",
          "px-2.5 py-1.5 pr-16",
          "text-xs font-display font-medium text-accent-gold",
          "hover:border-accent-gold/50 transition-colors",
          "focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/30",
          "cursor-pointer"
        )}
        title="Change map scale"
        aria-label="Select map scale"
      >
        {SCALE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option} - {SCALE_LABELS[option]}
          </option>
        ))}
      </select>

      {/* Current value badge */}
      <span className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-xs font-display font-semibold text-accent-gold bg-accent-gold/10 px-1.5 py-0.5 rounded-sm">
        {value}
      </span>

      {/* Custom dropdown arrow */}
      <ChevronDown
        className="w-3 h-3 text-accent-gold pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
        strokeWidth={2}
        aria-hidden="true"
      />
    </div>
  );
}
