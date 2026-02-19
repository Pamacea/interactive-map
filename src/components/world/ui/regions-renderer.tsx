/**
 * Regions Renderer - Renders regions on the map
 *
 * Displays regions (rectangles, circles, polygons) on the map canvas.
 * Supports:
 * - Visibility toggling
 * - Opacity and color
 * - Selection highlighting
 * - Drag to move
 *
 * Architecture follows ui/logic/methods pattern:
 * - ui/ (this file): Pure rendering
 * - logic/: Business logic
 * - methods/: Server actions
 */

"use client";

import { memo, type CSSProperties } from "react";
import type { Region, RegionWithLayer } from "@/stores/regions";
import { cn } from "@/lib/utils";

interface RegionMarkerProps {
  region: RegionWithLayer;
  transform: { scale: number; translateX: number; translateY: number };
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;
  onClick: (region: Region) => void;
  onMouseDown?: (region: Region, e: React.MouseEvent) => void;
  onMouseEnter?: (region: Region) => void;
  onMouseLeave?: () => void;
}

// ============== Helpers ==============

function getRegionStyle(
  region: RegionWithLayer,
  transform: { scale: number; translateX: number; translateY: number }
): CSSProperties {
  // Null safety checks for region and its properties
  if (!region) {
    return {};
  }

  const { coordinates, color, opacity, borderWidth } = region;
  const { scale, translateX, translateY } = transform;

  // Null safety for coordinates
  const coords = coordinates ?? {};

  // Apply layer transforms
  const layerScale = region.layerScale ?? 1;
  const layerOffsetX = region.layerOffsetX ?? 0;
  const layerOffsetY = region.layerOffsetY ?? 0;
  const layerOpacity = region.layerOpacity ?? 1;

  // Null safety for region properties
  const regionColor = color ?? "#3b82f6";
  const regionOpacity = opacity ?? 0.5;
  const regionBorderWidth = borderWidth ?? 2;

  // Combined transform
  const combinedScale = scale * layerScale;
  const combinedX = translateX + layerOffsetX * scale;
  const combinedY = translateY + layerOffsetY * scale;

  const baseStyle: CSSProperties = {
    position: "absolute",
    pointerEvents: "auto",
    cursor: region.locked ? "not-allowed" : "move",
    transition: "fill 0.15s, stroke 0.15s, opacity 0.15s",
  };

  // Null safety for region type - default to RECTANGLE
  const regionType = region?.type ?? "RECTANGLE";

  switch (regionType) {
    case "RECTANGLE": {
      const x = (coords.x ?? 0) * combinedScale + combinedX;
      const y = (coords.y ?? 0) * combinedScale + combinedY;
      const width = (coords.width ?? 0) * combinedScale;
      const height = (coords.height ?? 0) * combinedScale;

      return {
        ...baseStyle,
        left: x,
        top: y,
        width: Math.max(0, width),
        height: Math.max(0, height),
        backgroundColor: regionColor,
        opacity: regionOpacity * layerOpacity,
        border: `${regionBorderWidth}px solid ${regionColor}`,
        borderRadius: 2,
      };
    }

    case "CIRCLE": {
      const centerX = (coords.centerX ?? 0) * combinedScale + combinedX;
      const centerY = (coords.centerY ?? 0) * combinedScale + combinedY;
      const radius = (coords.radius ?? 0) * combinedScale;

      return {
        ...baseStyle,
        left: centerX - radius,
        top: centerY - radius,
        width: radius * 2,
        height: radius * 2,
        backgroundColor: regionColor,
        opacity: regionOpacity * layerOpacity,
        border: `${regionBorderWidth}px solid ${regionColor}`,
        borderRadius: "50%",
      };
    }

    case "POLYGON": {
      // For polygons, we use SVG
      return {};
    }

    default:
      return {};
  }
}

function getPolygonPoints(
  region: RegionWithLayer,
  transform: { scale: number; translateX: number; translateY: number }
): string {
  // Null safety checks for region and its properties
  if (!region) {
    return "";
  }

  const { coordinates } = region;
  const { scale, translateX, translateY } = transform;

  // Null safety for coordinates
  const coords = coordinates ?? {};
  const points = coords.points ?? [];

  // Apply layer transforms with null safety
  const layerScale = region.layerScale ?? 1;
  const layerOffsetX = region.layerOffsetX ?? 0;
  const layerOffsetY = region.layerOffsetY ?? 0;

  const combinedScale = scale * layerScale;
  const combinedX = translateX + layerOffsetX * scale;
  const combinedY = translateY + layerOffsetY * scale;

  return points
    .map((p) => {
      // Null safety for point coordinates
      const x = p?.x ?? 0;
      const y = p?.y ?? 0;
      return `${x * combinedScale + combinedX},${y * combinedScale + combinedY}`;
    })
    .join(" ");
}

// ============== Components ==============

const RectangleRegion = memo(function RectangleRegion({
  region,
  style,
  isSelected,
  isHovered,
  onClick,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
}: RegionMarkerProps & { style: CSSProperties }) {
  // Null safety for region
  if (!region) return null;

  return (
    <div
      className={cn(
        "region-rectangle",
        isSelected && "ring-2 ring-accent-gold ring-offset-1 ring-offset-background-base",
        isHovered && "brightness-110",
        !region.locked && "hover:brightness-110"
      )}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onClick(region);
      }}
      onMouseDown={(e) => {
        if (!region.locked && onMouseDown) {
          e.stopPropagation();
          onMouseDown(region, e);
        }
      }}
      onMouseEnter={() => onMouseEnter?.(region)}
      onMouseLeave={onMouseLeave}
      data-region-id={region.id}
      data-region-type="rectangle"
    />
  );
});

const CircleRegion = memo(function CircleRegion({
  region,
  style,
  isSelected,
  isHovered,
  onClick,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
}: RegionMarkerProps & { style: CSSProperties }) {
  // Null safety for region
  if (!region) return null;

  return (
    <div
      className={cn(
        "region-circle",
        isSelected && "ring-2 ring-accent-gold ring-offset-1 ring-offset-background-base",
        isHovered && "brightness-110",
        !region.locked && "hover:brightness-110"
      )}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onClick(region);
      }}
      onMouseDown={(e) => {
        if (!region.locked && onMouseDown) {
          e.stopPropagation();
          onMouseDown(region, e);
        }
      }}
      onMouseEnter={() => onMouseEnter?.(region)}
      onMouseLeave={onMouseLeave}
      data-region-id={region.id}
      data-region-type="circle"
    />
  );
});

const PolygonRegion = memo(function PolygonRegion({
  region,
  transform,
  isSelected,
  isHovered,
  onClick,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
}: RegionMarkerProps) {
  const points = getPolygonPoints(region, transform);

  // Null safety checks for region properties
  const regionColor = region?.color ?? "#3b82f6";
  const regionOpacity = region?.opacity ?? 0.5;
  const regionBorderWidth = region?.borderWidth ?? 2;
  const regionLocked = region?.locked ?? false;
  const layerOpacity = region?.layerOpacity ?? 1;

  return (
    <svg
      className={cn(
        "absolute inset-0 pointer-events-none",
        isSelected && "brightness-125"
      )}
      style={{ overflow: "visible" }}
    >
      <g
        className="pointer-events-auto"
        style={{
          cursor: regionLocked ? "not-allowed" : "move",
          opacity: regionOpacity * layerOpacity,
        }}
        onClick={(e) => {
          if (!regionLocked && region) {
            e.stopPropagation();
            onClick(region);
          }
        }}
        onMouseDown={(e) => {
          if (!regionLocked && onMouseDown && region) {
            e.stopPropagation();
            onMouseDown(region, e);
          }
        }}
        onMouseEnter={() => region && onMouseEnter?.(region)}
        onMouseLeave={onMouseLeave}
        data-region-id={region?.id ?? ""}
        data-region-type="polygon"
      >
        <polygon
          points={points}
          fill={regionColor}
          stroke={isSelected ? "#facc15" : regionColor}
          strokeWidth={isSelected ? regionBorderWidth + 2 : regionBorderWidth}
          strokeOpacity={isSelected ? 1 : 0.8}
          className={cn(
            isHovered && "brightness-110",
            !regionLocked && "hover:brightness-110"
          )}
        />
      </g>
    </svg>
  );
});

// ============== Region Marker ==============

export const RegionMarker = memo(function RegionMarker(props: RegionMarkerProps) {
  const { region, transform } = props;

  // Null safety check for region
  if (!region) return null;

  const style = getRegionStyle(region, transform);

  // Check if region is visible with null safety
  const regionVisible = region.visible ?? true;
  const layerVisible = region.layerVisible ?? true;
  const regionType = region.type ?? "RECTANGLE";

  if (!regionVisible || !layerVisible) {
    return null;
  }

  // Render based on region type
  switch (regionType) {
    case "RECTANGLE":
      return <RectangleRegion {...props} style={style} />;

    case "CIRCLE":
      return <CircleRegion {...props} style={style} />;

    case "POLYGON":
      return <PolygonRegion {...props} />;

    default:
      return null;
  }
});

RegionMarker.displayName = "RegionMarker";

// ============== Regions Renderer ==============

interface RegionsRendererProps {
  regions: RegionWithLayer[];
  transform: { scale: number; translateX: number; translateY: number };
  selectedRegionId: string | null;
  hoverRegionId: string | null;
  isDraggingRegion: boolean;
  onRegionClick: (region: Region) => void;
  onRegionMouseDown?: (region: Region, e: React.MouseEvent) => void;
  onRegionHover?: (region: Region | null) => void;
}

export const RegionsRenderer = memo(function RegionsRenderer({
  regions,
  transform,
  selectedRegionId,
  hoverRegionId,
  isDraggingRegion,
  onRegionClick,
  onRegionMouseDown,
  onRegionHover,
}: RegionsRendererProps) {
  if (regions.length === 0) {
    return null;
  }

  return (
    <>
      {regions.map((region) => (
        <RegionMarker
          key={region.id}
          region={region}
          transform={transform}
          isSelected={selectedRegionId === region.id}
          isHovered={hoverRegionId === region.id}
          isDragging={isDraggingRegion}
          onClick={onRegionClick}
          onMouseDown={onRegionMouseDown}
          onMouseEnter={onRegionHover}
          onMouseLeave={() => onRegionHover?.(null)}
        />
      ))}
    </>
  );
});

RegionsRenderer.displayName = "RegionsRenderer";
