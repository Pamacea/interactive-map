/**
 * SelectionRectangle - Visual overlay for area/selection tool
 *
 * Displays:
 * - Selection rectangle while dragging
 * - Selected pins count
 * - Snap hints
 */

import { memo } from "react";
import { useSelectionRect, useSelectedPinIds } from "@/features/tools";

export const SelectionRectangle = memo(function SelectionRectangle() {
  const selectionRect = useSelectionRect();
  const selectedPinIds = useSelectedPinIds();

  if (!selectionRect) return null;

  const x = Math.min(selectionRect.startX, selectionRect.endX);
  const y = Math.min(selectionRect.startY, selectionRect.endY);
  const width = Math.abs(selectionRect.endX - selectionRect.startX);
  const height = Math.abs(selectionRect.endY - selectionRect.startY);

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
      )}
    </svg>
  );
});

SelectionRectangle.displayName = "SelectionRectangle";
