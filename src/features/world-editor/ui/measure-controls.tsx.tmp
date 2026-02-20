/**
 * Measure Tool Controls
 *
 * On-screen controls for the measurement tool:
 * - Finish button (Enter key)
 * - Undo Last button (Backspace key)
 * - Cancel button (Esc key)
 * - Total distance display
 */

"use client";

import { cn } from "@/shared/utils";
import {
  useIsMeasuring,
  useMeasurePoints,
  useMeasureTotalDistance,
  useFinishMeasure,
  useRemoveLastMeasurePoint,
  useClearMeasure,
} from "@/features/world-editor/store/tools";

export function MeasureControls() {
  const isMeasuring = useIsMeasuring();
  const measurePoints = useMeasurePoints();
  const { world: totalDistance } = useMeasureTotalDistance();
  const finishMeasure = useFinishMeasure();
  const removeLastPoint = useRemoveLastMeasurePoint();
  const clearMeasure = useClearMeasure();

  // Only show when measure tool is active
  if (!isMeasuring) return null;

  const canUndo = measurePoints.length > 0;
  const canFinish = measurePoints.length >= 2;

  return (
    <div
      className={cn(
        "fixed bottom-24 left-1/2 -translate-x-1/2",
        "bg-obsidian/95 border border-accent-gold/30",
        "px-4 py-3 rounded-sm shadow-lg",
        "text-bone-dark text-sm font-display",
        "flex items-center gap-4 z-50"
      )}
    >
      {/* Total distance display */}
      <div className="flex flex-col items-center min-w-[100px]">
        <span className="text-xs text-bone-dark/60 uppercase tracking-wide">Distance</span>
        <span className="text-lg font-mono text-accent-gold">
          {totalDistance.toFixed(1)} <span className="text-xs text-bone-dark/60">units</span>
        </span>
        <span className="text-xs text-bone-dark/60">{measurePoints.length} points</span>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-accent-gold/20" />

      {/* Control buttons */}
      <div className="flex items-center gap-2">
        {/* Undo button */}
        <button
          onClick={removeLastPoint}
          disabled={!canUndo}
          className={cn(
            "px-3 py-1.5 rounded-sm border transition-colors",
            "font-display text-sm",
            canUndo
              ? "bg-obsidian border-accent-gold/30 text-bone-dark hover:bg-accent-gold/10 hover:border-accent-gold/50"
              : "bg-obsidian/50 border-border-subtle text-bone-dark/30 cursor-not-allowed"
          )}
          title="Undo last point (Backspace)"
        >
          Undo
        </button>

        {/* Finish button */}
        <button
          onClick={finishMeasure}
          disabled={!canFinish}
          className={cn(
            "px-3 py-1.5 rounded-sm border transition-colors",
            "font-display text-sm",
            canFinish
              ? "bg-accent-gold/20 border-accent-gold text-accent-gold hover:bg-accent-gold/30"
              : "bg-obsidian/50 border-border-subtle text-bone-dark/30 cursor-not-allowed"
          )}
          title="Finish measurement (Enter)"
        >
          Finish
        </button>

        {/* Cancel button */}
        <button
          onClick={clearMeasure}
          className={cn(
            "px-3 py-1.5 rounded-sm border transition-colors",
            "bg-obsidian border-border-subtle text-bone-dark/60",
            "hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive",
            "font-display text-sm"
          )}
          title="Cancel measurement (Esc)"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
