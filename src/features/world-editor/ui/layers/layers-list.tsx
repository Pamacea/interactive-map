/**
 * Layers List - Unified list container for layers
 * @module layers/list
 *
 * UX Improvements:
 * - Better spacing between layers
 * - Active layer state propagation
 * - Smooth animations
 */

"use client";

import { useMemo, useState, useCallback } from "react";
import { cn } from "@/shared/utils";
import type { UILayer, LayerDisplayMode, LayerActions } from "./layer-types";
import { LayerRow, CompactLayerRow } from "./layer-row";

interface LayersListProps {
  layers: UILayer[];
  selectedLayerId: string | null;
  activeLayerId?: string | null;
  variant: "compact" | "expanded" | "docked";
  isCollapsed?: boolean;
  layerColor?: string;
  mapImage?: string | null;
  actions: LayerActions;
  renderAddButton?: () => React.ReactNode;
  renderEmptyState?: () => React.ReactNode;
  showProperties?: boolean;
  className?: string;
}

export function LayersList({
  layers,
  selectedLayerId,
  activeLayerId,
  variant,
  isCollapsed = false,
  _layerColor,
  mapImage,
  actions,
  renderAddButton,
  renderEmptyState,
  showProperties = false,
  className,
}: LayersListProps) {
  // Drag state
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
  const [draggedOverLayerId, setDraggedOverLayerId] = useState<string | null>(null);

  // Compute display mode
  const displayMode: LayerDisplayMode = useMemo(() => ({
    variant,
    showLabels: variant !== "compact" && !isCollapsed,
    showProperties: variant === "expanded",
    isCollapsed,
  }), [variant, isCollapsed]);

  // Sort layers by zIndex (descending - top layer first)
  const sortedLayers = useMemo(() => {
    return [...layers].sort((a, b) => b.zIndex - a.zIndex);
  }, [layers]);

  // Add selection state to layers
  const uiLayers: UILayer[] = useMemo(() => {
    return sortedLayers.map((layer) => ({
      ...layer,
      isSelected: selectedLayerId === layer.id,
    }));
  }, [sortedLayers, selectedLayerId]);

  // Handle drag start
  const handleDragStart = useCallback((layerId: string) => {
    setDraggingLayerId(layerId);
  }, []);

  // Handle drag over
  const handleDragOver = useCallback((layerId: string) => {
    if (draggingLayerId && draggingLayerId !== layerId) {
      setDraggedOverLayerId(layerId);
    }
  }, [draggingLayerId]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggingLayerId(null);
    setDraggedOverLayerId(null);
  }, []);

  // Handle drop - reorder layers
  const handleDrop = useCallback((draggedLayerId: string, targetLayerId: string) => {
    const draggedLayer = layers.find(l => l.id === draggedLayerId);
    const targetLayer = layers.find(l => l.id === targetLayerId);

    if (draggedLayer && targetLayer && actions.onDrop) {
      actions.onDrop(draggedLayerId, targetLayerId);
    }

    setDraggingLayerId(null);
    setDraggedOverLayerId(null);
  }, [layers, actions]);

  // Enhanced actions with drag handlers
  const enhancedActions: LayerActions = useMemo(() => ({
    ...actions,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
    onDrop: handleDrop,
  }), [actions, handleDragStart, handleDragOver, handleDragEnd, handleDrop]);

  // Generate layer colors
  const getLayerColor = useMemo(() => {
    const colors = [
      "bg-accent-gold",
      "bg-blue-500",
      "bg-purple-500",
      "bg-emerald-500",
      "bg-rose-500",
      "bg-cyan-500",
      "bg-amber-500",
    ];
    return (index: number) => colors[index % colors.length];
  }, []);

  if (uiLayers.length === 0 && renderEmptyState) {
    return renderEmptyState();
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Section header - only for expanded variant */}
      {variant === "expanded" && displayMode.showLabels && (
        <div className="px-3 pb-2 border-b border-iron/30">
          <h3 className="text-xs font-display tracking-wider text-bone-dark/70 uppercase">
            Layers
          </h3>
        </div>
      )}

      {/* Add button - if provided */}
      {renderAddButton && renderAddButton()}

      {/* Layer list */}
      {variant === "compact" ? (
        <div className="space-y-1">
          {uiLayers.map((layer) => (
            <CompactLayerRow
              key={layer.id}
              layer={layer}
              displayMode={displayMode}
              actions={actions}
              layerColor={getLayerColor(uiLayers.indexOf(layer))}
              activeLayerId={activeLayerId}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {uiLayers.map((layer, index) => (
            <LayerRow
              key={layer.id}
              layer={layer}
              index={index}
              totalLayers={uiLayers.length}
              displayMode={displayMode}
              layerColor={getLayerColor(index)}
              actions={enhancedActions}
              isDragging={draggingLayerId === layer.id}
              isDraggedOver={draggedOverLayerId === layer.id}
              thumbnailUrl={layer.isBaseMap ? mapImage : undefined}
              showThumbnail={layer.isBaseMap && variant === "expanded"}
              showProperties={showProperties || variant === "expanded"}
              activeLayerId={activeLayerId}
            />
          ))}
        </div>
      )}

      {/* Layer count - only for compact/collapsed */}
      {(variant === "compact" || isCollapsed) && (
        <div className="text-center pt-2">
          <span className="text-xs text-bone-dark/50 font-mono">
            {uiLayers.length}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Empty state component
 */
export function LayersEmptyState({
  onAddLayer,
}: {
  onAddLayer?: () => void;
}) {
  return (
    <div className="px-3 py-8 text-center">
      <p className="text-sm text-bone-dark font-fell mb-3">
        No layers yet. Create one to get started.
      </p>
      {onAddLayer && (
        <button
          onClick={onAddLayer}
          className="px-3 py-1.5 text-xs bg-accent-gold text-void rounded-sm hover:bg-accent-gold/90 transition-colors font-display"
        >
          Add Layer
        </button>
      )}
    </div>
  );
}

/**
 * Default layer actions adapter
 */
export function createLayerActions({
  onToggleVisibility,
  onToggleLock,
  onOpacityChange,
  onMinZoomChange,
  onMaxZoomChange,
  onResetZoom,
  onMoveUp,
  onMoveDown,
  onDelete,
  onSelect,
  onDrop,
}: {
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
  onMinZoomChange?: (layerId: string, minZoom: number) => void;
  onMaxZoomChange?: (layerId: string, maxZoom: number) => void;
  onResetZoom?: (layerId: string) => void;
  onMoveUp?: (layerId: string) => void;
  onMoveDown?: (layerId: string) => void;
  onDelete?: (layerId: string) => void;
  onSelect?: (layerId: string) => void;
  onDrop?: (draggedLayerId: string, targetLayerId: string) => void | Promise<void>;
}): LayerActions {
  return {
    onToggleVisibility,
    onToggleLock,
    onOpacityChange,
    onMinZoomChange,
    onMaxZoomChange,
    onResetZoom,
    onMoveUp,
    onMoveDown,
    onDelete,
    onSelect,
    onDrop,
  };
}
