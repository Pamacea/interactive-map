/**
 * SelectionRectangle - Visual overlay for area/selection tool
 *
 * Displays:
 * - Selection rectangle while dragging
 * - Selected pins count
 * - Area dimensions and total area
 * - Snap hints
 */

import { memo } from "react";
import { useSelectionRect, useSelectedPinIds } from "@/features/world-editor/store/tools";

/**
 * Calculate the area of a rectangle
 */
function calculateArea(width: number, height: number): number {
  return Math.abs(width * height);
}

/**
 * Format area number with thousand separators
 */
function formatArea(area: number): string {
  return area.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export const SelectionRectangle = memo(function SelectionRectangle() {
  const selectionRect = useSelectionRect();
  const selectedPinIds = useSelectedPinIds();

  if (!selectionRect) return null;

  const x = Math.min(selectionRect.startX, selectionRect.endX);
  const y = Math.min(selectionRect.startY, selectionRect.endY);
  const width = Math.abs(selectionRect.endX - selectionRect.startX);
  const height = Math.abs(selectionRect.endY - selectionRect.startY);
  const area = calculateArea(width, height);

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-50"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {/* Selection rectangle */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="rgba(244, 208, 63, 0.1)"
        stroke="#f4d03f"
        strokeWidth={2}
        strokeDasharray="4,4"
        rx={2}
      />

      {/* Selection info */}
      {width > 50 || height > 50 ? (
        <g>
          <rect
            x={x + width / 2 - 60}
            y={y - 35}
            width={120}
            height={28}
            rx={4}
            fill="rgba(26, 26, 46, 0.9)"
            stroke="#f4d03f"
            strokeWidth={1}
          />
          <text
            x={x + width / 2}
            y={y - 17}
            fill="#f4d03f"
            fontSize={12}
            textAnchor="middle"
            className="font-mono"
          >
            {selectedPinIds.length} pin{selectedPinIds.length !== 1 ? "s" : ""} selected
          </text>
        </g>
      ) : null}

      {/* Dimensions */}
      {(width > 30 || height > 30) && (
        <g>
          {/* Width × Height */}
          <text
            x={x + width / 2}
            y={y + height + 20}
            fill="#b0b0b0"
            fontSize={11}
            textAnchor="middle"
            className="font-mono"
            style={{
              textShadow: "0 1px 2px rgba(0,0,0,0.8)",
            }}
          >
            {Math.round(width)} × {Math.round(height)} px
          </text>

          {/* Area display */}
          {width > 80 && height > 50 && (
            <g>
              {/* Background box for area */}
              <rect
                x={x + width / 2 - 70}
                y={y + height + 30}
                width={140}
                height={24}
                rx={4}
                fill="rgba(244, 208, 63, 0.15)"
                stroke="#f4d03f"
                strokeWidth={1}
                strokeDasharray="2,2"
              />
              {/* Area text */}
              <text
                x={x + width / 2}
                y={y + height + 46}
                fill="#f4d03f"
                fontSize={12}
                fontWeight="600"
                textAnchor="middle"
                className="font-mono"
                style={{
                  textShadow: "0 1px 3px rgba(0,0,0,0.9)",
                }}
              >
                Area: {formatArea(area)} px²
              </text>
            </g>
          )}
        </g>
      )}
    </svg>
  );
});

SelectionRectangle.displayName = "SelectionRectangle";
