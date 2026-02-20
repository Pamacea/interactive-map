/**
 * MeasureOverlay - Visual overlay for measurement tool
 *
 * Displays:
 * - Measurement points as markers
 * - Lines connecting points
 * - Distance labels for each segment
 * - Total distance
 */

import { memo } from "react";
import { useMeasurePoints, useMeasureSegments, useMeasureTotalDistance } from "@/features/tools";
import { cn } from "@/shared/utils";

interface MeasureOverlayProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const MeasureOverlay = memo(function MeasureOverlay({ containerRef }: MeasureOverlayProps) {
  const points = useMeasurePoints();
  const segments = useMeasureSegments();
  const { pixels: totalPixels, world: totalWorld } = useMeasureTotalDistance();

  if (points.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-50"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {/* Render segments */}
      {segments.map((segment, index) => (
        <g key={`segment-${index}`}>
          {/* Line */}
          <line
            x1={segment.start.x}
            y1={segment.start.y}
            x2={segment.end.x}
            y2={segment.end.y}
            stroke="#f4d03f"
            strokeWidth={2}
            strokeDasharray="5,5"
            opacity={0.8}
          />

          {/* Distance label */}
          <text
            x={(segment.start.x + segment.end.x) / 2}
            y={(segment.start.y + segment.end.y) / 2 - 10}
            fill="#f4d03f"
            fontSize={12}
            fontWeight="bold"
            textAnchor="middle"
            className="font-display"
            style={{
              textShadow: "0 1px 2px rgba(0,0,0,0.8)",
            }}
          >
            {segment.worldDistance.toFixed(1)} units
          </text>
        </g>
      ))}

      {/* Render points */}
      {points.map((point, index) => (
        <g key={`point-${index}`}>
          {/* Point marker */}
          <circle
            cx={point.x}
            cy={point.y}
            r={6}
            fill={index === 0 ? "#27ae60" : "#f4d03f"}
            stroke="#1a1a2e"
            strokeWidth={2}
          />

          {/* Point label */}
          <text
            x={point.x}
            y={point.y - 15}
            fill="#f4d03f"
            fontSize={11}
            textAnchor="middle"
            className="font-mono"
            style={{
              textShadow: "0 1px 2px rgba(0,0,0,0.8)",
            }}
          >
            {index === 0 ? "Start" : `P${index}`}
          </text>
        </g>
      ))}

      {/* Total distance */}
      {points.length >= 2 && (
        <g>
          <rect
            x={points[points.length - 1].x + 15}
            y={points[points.length - 1].y - 25}
            width={100}
            height={40}
            rx={4}
            fill="rgba(26, 26, 46, 0.9)"
            stroke="#f4d03f"
            strokeWidth={1}
          />
          <text
            x={points[points.length - 1].x + 65}
            y={points[points.length - 1].y - 8}
            fill="#f4d03f"
            fontSize={11}
            textAnchor="middle"
            className="font-display"
          >
            Total Distance
          </text>
          <text
            x={points[points.length - 1].x + 65}
            y={points[points.length - 1].y + 6}
            fill="#f4d03f"
            fontSize={14}
            fontWeight="bold"
            textAnchor="middle"
            className="font-mono"
          >
            {totalWorld.toFixed(2)} units
          </text>
        </g>
      )}

      {/* Instructions */}
      {points.length < 2 && (
        <text
          x={points[points.length - 1].x + 20}
          y={points[points.length - 1].y}
          fill="#b0b0b0"
          fontSize={12}
          className="font-display"
          style={{
            textShadow: "0 1px 2px rgba(0,0,0,0.8)",
          }}
        >
          Click to add points • Esc to cancel
        </text>
      )}
    </svg>
  );
});

MeasureOverlay.displayName = "MeasureOverlay";
