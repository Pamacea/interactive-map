/**
 * ZoomControl - Compact centered zoom controls for bottom bar
 *
 * Design: [━━━━[-] 100% [+]━━━━]
 * - Clean, minimal appearance
 * - Centered percentage display
 * - Zoom in/out buttons
 * - Consistent with Genesis design system
 */

import { useCallback } from "react";
import { Plus, Minus, Maximize2 } from "lucide-react";
import { cn } from "@/shared/utils";

const MIN_ZOOM = 0.1; // 10%
const MAX_ZOOM = 4.0; // 400%
const ZOOM_STEP = 0.1; // 10% steps

export interface ZoomControlProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
  showLabel?: boolean;
  compact?: boolean;
}

export function ZoomControl({
  value,
  onChange,
  className,
  onZoomIn,
  onZoomOut,
  onReset,
  showLabel = false,
  compact = true,
}: ZoomControlProps) {
  const handleZoomIn = useCallback(() => {
    const newValue = Math.min(value + ZOOM_STEP, MAX_ZOOM);
    onChange(newValue);
    onZoomIn?.();
  }, [value, onChange, onZoomIn]);

  const handleZoomOut = useCallback(() => {
    const newValue = Math.max(value - ZOOM_STEP, MIN_ZOOM);
    onChange(newValue);
    onZoomOut?.();
  }, [value, onChange, onZoomOut]);

  const handleReset = useCallback(() => {
    onChange(1); // Reset to 100%
    onReset?.();
  }, [onChange, onReset]);

  const zoomPercentage = Math.round(value * 100);

  if (compact) {
    // Compact centered design for bottom bar: [-] 100% [+]
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {/* Zoom out button */}
        <button
          onClick={handleZoomOut}
          disabled={value <= MIN_ZOOM}
          className={cn(
            "h-7 w-7 flex items-center justify-center rounded-sm transition-all",
            "text-text-secondary hover:text-accent-gold hover:bg-accent-gold/10",
            "focus:outline-none focus:ring-1 focus:ring-accent-gold/30",
            "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-text-secondary disabled:hover:bg-transparent"
          )}
          title="Zoom out (-)"
          aria-label="Zoom out"
          type="button"
        >
          <Minus className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
        </button>

        {/* Percentage display */}
        <span
          className="min-w-[4rem] text-center text-sm font-display font-semibold text-accent-gold tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          {zoomPercentage}%
        </span>

        {/* Zoom in button */}
        <button
          onClick={handleZoomIn}
          disabled={value >= MAX_ZOOM}
          className={cn(
            "h-7 w-7 flex items-center justify-center rounded-sm transition-all",
            "text-text-secondary hover:text-accent-gold hover:bg-accent-gold/10",
            "focus:outline-none focus:ring-1 focus:ring-accent-gold/30",
            "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-text-secondary disabled:hover:bg-transparent"
          )}
          title="Zoom in (+)"
          aria-label="Zoom in"
          type="button"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
        </button>

        {/* Fit to screen button */}
        <button
          onClick={handleReset}
          className={cn(
            "h-7 w-7 flex items-center justify-center rounded-sm transition-all ml-1",
            "text-text-secondary hover:text-accent-gold hover:bg-accent-gold/10",
            "focus:outline-none focus:ring-1 focus:ring-accent-gold/30"
          )}
          title="Fit to screen"
          aria-label="Fit to screen"
          type="button"
        >
          <Maximize2 className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    );
  }

  // Full design with slider (for future use if needed)
  return (
    <div
      className={cn(
        "bg-background-elevated/90 backdrop-blur-md rounded-sm border border-border-subtle px-3 py-2",
        className
      )}
    >
      {/* Label row */}
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-display text-text-muted uppercase tracking-wide">
            Zoom
          </span>
          <span
            className="text-xs font-display font-semibold text-accent-gold px-2 py-0.5 bg-accent-gold/10 rounded-sm tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {zoomPercentage}%
          </span>
        </div>
      )}

      {/* Controls row */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleZoomOut}
          disabled={value <= MIN_ZOOM}
          className={cn(
            "h-7 w-7 flex items-center justify-center rounded-sm transition-all",
            "text-text-secondary hover:text-accent-gold hover:bg-accent-gold/10",
            "focus:outline-none focus:ring-2 focus:ring-accent-gold/30",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}
          title="Zoom out (or press -)"
          aria-label="Zoom out"
          type="button"
        >
          <Minus className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
        </button>

        <button
          onClick={handleZoomIn}
          disabled={value >= MAX_ZOOM}
          className={cn(
            "h-7 w-7 flex items-center justify-center rounded-sm transition-all",
            "text-text-secondary hover:text-accent-gold hover:bg-accent-gold/10",
            "focus:outline-none focus:ring-2 focus:ring-accent-gold/30",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}
          title="Zoom in (or press +)"
          aria-label="Zoom in"
          type="button"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
        </button>

        <button
          onClick={handleReset}
          className={cn(
            "h-7 w-7 flex items-center justify-center rounded-sm transition-all",
            "text-text-secondary hover:text-accent-gold hover:bg-accent-gold/10",
            "focus:outline-none focus:ring-2 focus:ring-accent-gold/30"
          )}
          title="Reset view"
          aria-label="Reset zoom to default"
          type="button"
        >
          <Maximize2 className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
