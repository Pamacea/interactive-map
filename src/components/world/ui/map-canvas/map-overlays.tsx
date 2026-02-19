/**
 * Map Overlays - Visual feedback for tools
 *
 * Components for rendering tool-specific overlays:
 * - Measurement lines and labels
 * - Selection rectangle
 * - Tool status indicators
 */

"use client";

import { useMeasurePoints, useMeasureSegments, useSelectionRect, useIsMeasuring, useIsSelecting } from "@/stores/tools";
import { cn } from "@/lib/utils";

// ============== Measure Overlay ==============

interface MeasureOverlayProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  transform: { scale: number; translateX: number; translateY: number };
  imageDimensions: { width: number; height: number } | null;
}

export function MeasureOverlay({ transform, imageDimensions }: MeasureOverlayProps) {
  const measurePoints = useMeasurePoints();
  const segments = useMeasureSegments();
  const isMeasuring = useIsMeasuring();

  if (measurePoints.length < 1 || !imageDimensions) return null;

  // Calculate total distance
  const totalWorld = segments.reduce((sum, seg) => sum + seg.worldDistance, 0);

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-50"
      style={{ overflow: "visible" }}
    >
      {/* Render line segments */}
      {segments.map((seg, i) => {
        // Convert normalized coordinates (lat/lng) to screen position
        // lat = y position (0-1 from top to bottom), lng = x position (0-1 from left to right)
        const x1 = seg.start.lng * imageDimensions.width * transform.scale + transform.translateX;
        const y1 = seg.start.lat * imageDimensions.height * transform.scale + transform.translateY;
        const x2 = seg.end.lng * imageDimensions.width * transform.scale + transform.translateX;
        const y2 = seg.end.lat * imageDimensions.height * transform.scale + transform.translateY;

        return (
          <g key={i}>
            {/* Line */}
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgb(250 204 21)" // accent-gold
              strokeWidth={2}
              strokeDasharray="5,5"
            />
            {/* Distance label at midpoint */}
            <text
              x={(x1 + x2) / 2}
              y={(y1 + y2) / 2 - 8}
              fill="rgb(250 204 21)"
              fontSize={12}
              textAnchor="middle"
              className="font-mono"
            >
              {seg.worldDistance.toFixed(1)} units
            </text>
          </g>
        );
      })}

      {/* Render points */}
      {measurePoints.map((point, i) => {
        // Convert normalized coordinates (lat/lng) to screen position
        const x = point.lng * imageDimensions.width * transform.scale + transform.translateX;
        const y = point.lat * imageDimensions.height * transform.scale + transform.translateY;

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={5}
            fill={i === measurePoints.length - 1 && isMeasuring ? "rgb(250 204 21)" : "rgb(250 204 21 / 0.7)"}
            stroke="rgb(26 26 26)"
            strokeWidth={2}
          />
        );
      })}

      {/* Total distance label */}
      {segments.length > 0 && (
        <text
          x={measurePoints[0].lng * imageDimensions.width * transform.scale + transform.translateX}
          y={measurePoints[0].lat * imageDimensions.height * transform.scale + transform.translateY - 20}
          fill="rgb(250 204 21)"
          fontSize={14}
          fontWeight="bold"
          textAnchor="middle"
          className="font-mono"
        >
          Total: {totalWorld.toFixed(1)} units
        </text>
      )}
    </svg>
  );
}

// ============== Selection Rectangle Overlay ==============

interface SelectionRectangleProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  transform: { scale: number; translateX: number; translateY: number };
  imageDimensions: { width: number; height: number } | null;
}

export function SelectionRectangle({ transform, imageDimensions }: SelectionRectangleProps) {
  const selectionRect = useSelectionRect();

  if (!selectionRect) return null;

  // Calculate rectangle in screen coordinates using pixel coordinates (startX, startY)
  const x = Math.min(selectionRect.startX, selectionRect.endX) * transform.scale + transform.translateX;
  const y = Math.min(selectionRect.startY, selectionRect.endY) * transform.scale + transform.translateY;
  const width = Math.abs(selectionRect.endX - selectionRect.startX) * transform.scale;
  const height = Math.abs(selectionRect.endY - selectionRect.startY) * transform.scale;

  return (
    <div
      className="absolute pointer-events-none z-50 border-2 border-accent-gold bg-accent-gold/10"
      style={{
        left: x,
        top: y,
        width,
        height,
      }}
    />
  );
}

// ============== Tool Status Indicator ==============

interface ToolStatusProps {
  className?: string;
}

export function ToolStatus({ className }: ToolStatusProps) {
  const isMeasuring = useIsMeasuring();
  const measurePoints = useMeasurePoints();
  const selectionRect = useSelectionRect();

  const showStatus = isMeasuring || selectionRect;

  if (!showStatus) return null;

  let message = "";
  let shortcut = "";

  if (isMeasuring) {
    message = measurePoints.length < 2
      ? "Click to add points"
      : `Click to add more, Enter to finish (${measurePoints.length} points)`;
    shortcut = "Esc to cancel | Backspace to undo";
  } else if (selectionRect) {
    message = "Drag to select area";
    shortcut = "Esc to cancel";
  }

  return (
    <div
      className={cn(
        "absolute bottom-20 left-1/2 -translate-x-1/2",
        "bg-obsidian/90 border border-accent-gold/30",
        "px-4 py-2 rounded-sm",
        "text-bone-dark text-sm font-display",
        "flex flex-col items-center gap-1",
        "pointer-events-none z-50",
        className
      )}
    >
      <span>{message}</span>
      <span className="text-xs text-bone-dark/60">{shortcut}</span>
    </div>
  );
}

// ============== Combined Overlays Component ==============

interface MapOverlaysProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  transform: { scale: number; translateX: number; translateY: number };
  imageDimensions: { width: number; height: number } | null;
}

export function MapOverlays({ containerRef, transform, imageDimensions }: MapOverlaysProps) {
  return (
    <>
      <MeasureOverlay containerRef={containerRef} transform={transform} imageDimensions={imageDimensions} />
      <SelectionRectangle containerRef={containerRef} transform={transform} imageDimensions={imageDimensions} />
      <ToolStatus />
    </>
  );
}
