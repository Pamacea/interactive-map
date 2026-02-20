/**
 * Layer Row - Unified layer item component
 * @module layers/row
 *
 * UX Improvements:
 * - Clear visual separation between layers
 * - Active layer has distinct background, border, and glow
 * - Controls are easily clickable with proper touch targets
 * - Drag handle visible but not intrusive
 * - Subtle hover/active animations
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { cn } from "@/shared/utils";
import type { Layer, LayerActions, LayerDisplayMode, UILayer } from "./layer-types";
import { LayerHeader } from "./layer-header";
import { LayerControls, OpacitySlider } from "./layer-controls";
import { LayerProperties } from "./layer-properties";

interface LayerRowProps {
  layer: UILayer;
  index: number;
  totalLayers: number;
  displayMode: LayerDisplayMode;
  layerColor?: string;
  isConfirmingDelete?: boolean;
  isDragging?: boolean;
  isDraggedOver?: boolean;
  actions: LayerActions;
  thumbnailUrl?: string | null;
  showThumbnail?: boolean;
  showProperties?: boolean;
  children?: React.ReactNode;
  activeLayerId?: string | null;
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

export function LayerRow({
  layer,
  index,
  totalLayers,
  displayMode,
  layerColor,
  isConfirmingDelete = false,
  isDragging = false,
  isDraggedOver = false,
  actions,
  thumbnailUrl,
  showThumbnail = false,
  showProperties = false,
  children,
  activeLayerId,
}: LayerRowProps) {
  // Local expanded state
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate display name with fallback
  const displayName = useMemo(() => getLayerDisplayName(layer), [layer]);

  const handleToggleExpand = useCallback(() => {
    if (displayMode.variant !== "compact") {
      setIsExpanded((prev) => !prev);
    }
  }, [displayMode.variant]);

  const { showLabels, variant } = displayMode;
  // Both "docked" and "expanded" variants are docked (in sidebar, not floating)
  const isDocked = variant === "docked" || variant === "expanded";

  // Determine if this is the active layer
  const isActive = activeLayerId === layer.id;

  // Handle select for docked variant
  const handleSelect = useCallback(() => {
    if (isDocked && actions.onSelect) {
      actions.onSelect(layer.id);
    }
  }, [isDocked, actions.onSelect, layer.id]);

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent) => {
    if (layer.isBaseMap || layer.type === "BASE_MAP") {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("application/json", JSON.stringify({ layerId: layer.id, index }));
    e.dataTransfer.effectAllowed = "move";
    actions.onDragStart?.(layer.id, index);
  }, [layer, actions]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    actions.onDragOver?.(layer.id, index);
  }, [actions, layer.id, index]);

  const handleDragEnd = useCallback(() => {
    actions.onDragEnd?.();
  }, [actions]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;
    const { layerId: draggedLayerId } = JSON.parse(data);
    if (draggedLayerId !== layer.id) {
      actions.onDrop?.(draggedLayerId, layer.id);
    }
  }, [actions, layer.id]);

  // Create a modified layer with display name
  const layerWithDisplayName = useMemo(
    () => ({ ...layer, name: displayName }),
    [layer, displayName]
  );

  return (
    <div
      className={cn(
        "group relative rounded-md transition-all duration-200",
        // Base styles
        isDocked
          ? "bg-stone/40"
          : "bg-obsidian/70",
        // Border styles - stronger for active layer
        isDocked && (
          isActive
            ? "border-2 border-accent-gold/80 shadow-[0_0_12px_rgba(250,204,21,0.4)] bg-accent-gold/15"
            : "border border-iron/40"
        ),
        !isDocked && (
          layer.isSelected
            ? "border border-accent-gold/50"
            : "border border-iron/50"
        ),
        // Hover effects - only for docked variant
        isDocked && !isActive && "hover:border-iron/60 hover:bg-stone/60",
        // Drag states
        isDragging && "opacity-40 scale-[0.98]",
        isDraggedOver && "border-accent-gold border-2 bg-accent-gold/10"
      )}
      onClick={handleSelect}
      draggable={!layer.isBaseMap && layer.type !== "BASE_MAP" && !layer.locked}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
    >
      {/* Active layer indicator - subtle left accent */}
      {isActive && isDocked && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 bottom-2 w-1 bg-accent-gold rounded-r-full shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
      )}

      {/* Header Section */}
      <div className={cn("relative", isActive && isDocked && "pl-3")}>
        <LayerHeader
          layer={layerWithDisplayName}
          layerColor={layerColor}
          displayMode={displayMode}
          isExpanded={isExpanded}
          onToggleExpand={handleToggleExpand}
          thumbnailUrl={thumbnailUrl}
          showThumbnail={showThumbnail}
          isActive={isActive}
        />

        {/* Action Controls - Positioned absolutely on the right, advanced controls on hover only */}
        <div className="absolute right-0 top-0 h-full flex items-center pr-2.5">
          <LayerControls
            layer={layerWithDisplayName}
            index={index}
            totalLayers={totalLayers}
            displayMode={displayMode}
            actions={actions}
            showDelete={true}
            showMove={showLabels}
            showDragHandle={showLabels && !layer.isBaseMap && layer.type !== "BASE_MAP"}
            isConfirmingDelete={isConfirmingDelete}
            onDeleteCancel={() => {
              // Handle cancel delete
            }}
            onDeleteConfirm={() => {
              actions.onDelete?.(layer.id);
            }}
          />
        </div>
      </div>

      {/* Quick Opacity Slider - when visible and not expanded */}
      {showLabels && layer.visible && !isExpanded && !isConfirmingDelete && (
        <OpacitySlider
          layer={layer}
          onChange={actions.onOpacityChange}
        />
      )}

      {/* Properties Panel - when expanded */}
      {isExpanded && !layer.isBaseMap && showProperties && (
        <LayerProperties
          layer={layer}
          actions={actions}
          showPositionControls={true}
          showScaleControl={true}
          showZoomControls={true}
        />
      )}

      {/* Custom children slot */}
      {children}
    </div>
  );
}

/**
 * Compact Layer Row - for collapsed/minimal view
 */
interface CompactLayerRowProps {
  layer: UILayer;
  displayMode: LayerDisplayMode;
  actions: LayerActions;
  layerColor?: string;
  activeLayerId?: string | null;
}

export function CompactLayerRow({
  layer,
  displayMode,
  actions,
  layerColor,
  activeLayerId,
}: CompactLayerRowProps) {
  // Get display name with fallback
  const displayName = getLayerDisplayName(layer);

  // Determine if this is the active layer
  const isActive = activeLayerId === layer.id;

  return (
    <div
      className={cn(
        "group relative rounded-md border transition-all duration-200",
        // Active layer styling
        isActive
          ? "border-accent-gold/80 bg-accent-gold/15 shadow-[0_0_8px_rgba(250,204,21,0.3)]"
          : "border-iron/30 hover:border-iron/60",
        // Visibility-based opacity
        layer.visible ? "bg-stone/50" : "bg-stone/30 opacity-70"
      )}
      title={displayName}
    >
      {/* Active layer indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 bottom-1.5 w-0.5 bg-accent-gold rounded-r-full" />
      )}

      <div
        className={cn(
          "flex items-center gap-2 transition-all",
          displayMode.showLabels ? "px-3 py-2.5" : "px-2 py-2 justify-center",
          isActive && "pl-3.5"
        )}
      >
        {/* Layer Icon */}
        {layer.isBaseMap ? (
          <svg
            className="w-4 h-4 text-accent-gold flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        ) : (
          <div
            className={cn(
              "w-3.5 h-3.5 rounded-sm flex-shrink-0 transition-all",
              layer.visible
                ? (isActive ? "bg-accent-gold shadow-[0_0_4px_rgba(250,204,21,0.5)]" : (layerColor || "bg-accent-gold/80"))
                : "bg-bone-dark/30"
            )}
          />
        )}

        {/* Layer Name - only when showing labels */}
        {displayMode.showLabels && (
          <span
            className={cn(
              "flex-1 text-sm truncate font-fell transition-colors",
              layer.visible ? "text-bone-dark" : "text-bone-dark/50",
              isActive && "text-accent-gold font-medium"
            )}
            title={displayName}
          >
            {displayName}
          </span>
        )}

        {/* Controls */}
        <LayerControls
          layer={layer}
          index={0}
          totalLayers={1}
          displayMode={displayMode}
          actions={actions}
          showDelete={false}
          showMove={false}
        />
      </div>
    </div>
  );
}
