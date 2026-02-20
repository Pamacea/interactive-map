/**
 * Layer Header - Unified header component for layer items
 * @module layers/header
 *
 * UX Improvements:
 * - Active layer state styling
 * - Better spacing for touch targets
 * - Clearer visual hierarchy
 */

"use client";

import { Map, ChevronRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Layer, LayerDisplayMode } from "./layer-types";

interface LayerHeaderProps {
  layer: Layer;
  layerColor?: string;
  displayMode: LayerDisplayMode;
  isExpanded: boolean;
  onToggleExpand: () => void;
  thumbnailUrl?: string | null;
  showThumbnail?: boolean;
  isActive?: boolean;
}

/**
 * Get a fallback name for empty layer names based on type
 */
function getLayerDisplayName(layer: Layer): string {
  if (layer.name && layer.name.trim()) return layer.name;

  const typeNames: Record<string, string> = {
    "BASE_MAP": "Base Map",
    "MARKERS": "Markers Layer",
    "IMAGES": "Images Layer",
    "REGIONS": "Regions Layer",
    "GROUP": "Group Layer",
    "CUSTOM": "Untitled Layer",
  };

  return typeNames[layer.type || "CUSTOM"] || "Untitled Layer";
}

export function LayerHeader({
  layer,
  layerColor,
  displayMode,
  isExpanded,
  onToggleExpand,
  thumbnailUrl,
  showThumbnail = false,
  isActive = false,
}: LayerHeaderProps) {
  const { showLabels, variant } = displayMode;
  // Both "docked" and "expanded" variants are docked (in sidebar, not floating)
  const isDocked = variant === "docked" || variant === "expanded";

  // Get display name with fallback
  const displayName = getLayerDisplayName(layer);

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 transition-colors",
        showLabels
          ? "px-3 py-2.5 cursor-pointer"
          : "px-2 py-2 justify-center",
        isDocked && !isActive && "group-hover:bg-obsidian/20"
      )}
      onClick={onToggleExpand}
    >
      {/* Expand/Collapse Button - only when expanded mode */}
      {showLabels && !layer.isBaseMap && (
        <button
          className="p-1 hover:bg-void/50 rounded-sm transition-all hover:text-accent-gold"
          aria-label={isExpanded ? "Collapse" : "Expand"}
          type="button"
        >
          <ChevronRight
            className={cn(
              "w-3.5 h-3.5 text-bone-dark/60 transition-transform duration-200",
              isExpanded && "rotate-90 text-accent-gold"
            )}
          />
        </button>
      )}

      {/* Layer Icon/Color Indicator */}
      {layer.isBaseMap ? (
        <Map className={cn(
          "w-4 h-4 flex-shrink-0 transition-all",
          isActive ? "text-accent-gold drop-shadow-[0_0_4px_rgba(250,204,21,0.5)]" : "text-accent-gold/80"
        )} />
      ) : (
        <div
          className={cn(
            "w-3.5 h-3.5 rounded-sm flex-shrink-0 transition-all",
            layer.visible
              ? (isActive
                ? `${layerColor || "bg-accent-gold"} shadow-[0_0_6px_rgba(250,204,21,0.6)]`
                : (layerColor || "bg-accent-gold/80"))
              : "bg-bone-dark/30"
          )}
        />
      )}

      {/* Thumbnail - for base map */}
      {showThumbnail && layer.isBaseMap && (
        <div className="w-12 h-12 rounded-sm bg-background-base border border-border-tertiary overflow-hidden flex-shrink-0">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt="Base map preview"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-text-muted" />
            </div>
          )}
        </div>
      )}

      {/* Layer Name - only when showing labels */}
      {showLabels && (
        <span
          className={cn(
            "flex-1 text-sm truncate font-fell transition-colors",
            layer.visible
              ? (isActive ? "text-bone-dark font-medium" : "text-bone-dark")
              : "text-bone-dark/50"
          )}
          title={displayName}
        >
          {displayName}
        </span>
      )}

      {/* Indicators - positioned on right */}
      {showLabels && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Position Indicator */}
          {(layer.offsetX !== 0 || layer.offsetY !== 0) && !layer.isBaseMap && (
            <span className="text-xs text-accent-gold/90 font-medium font-display">
              ({layer.offsetX}, {layer.offsetY})
            </span>
          )}

          {/* Scale Indicator */}
          {layer.scale !== 1.0 && !layer.isBaseMap && (
            <span className="text-xs text-accent-gold/90 font-medium font-display">
              {Math.round(layer.scale * 100)}%
            </span>
          )}

          {/* Zoom Range Indicator - small badge showing zoom range */}
          {!layer.isBaseMap && (layer.minZoom > 0 || layer.maxZoom < 200) && (
            <span
              className="text-xs text-accent-gold/70 font-medium font-display px-1.5 py-0.5 bg-accent-gold/10 rounded-sm border border-accent-gold/20"
              title={`Visible at ${layer.minZoom}% - ${layer.maxZoom}% zoom`}
            >
              {layer.minZoom}-{layer.maxZoom}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}
