/**
 * ToolsOverlays - Container for all tool-specific visual overlays
 *
 * This component renders:
 * - MeasureOverlay: Measurement lines, points, and distance labels
 * - SelectionRectangle: Selection rectangle for area tool
 * - Future: other tool overlays (draw, annotate, etc.)
 *
 * Usage:
 * ```tsx
 * <ToolsOverlays />
 * ```
 */

import { memo } from "react";
import { MeasureOverlay } from "./measure-overlay";
import { SelectionRectangle } from "./selection-rectangle";

export const ToolsOverlays = memo(function ToolsOverlays() {
  return (
    <>
      <MeasureOverlay containerRef={null} />
      <SelectionRectangle />
    </>
  );
});

ToolsOverlays.displayName = "ToolsOverlays";
