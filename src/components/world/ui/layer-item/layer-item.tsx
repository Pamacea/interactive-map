"use client";

import { useState } from "react";
import { Layer } from "../../types/layer-types";
import { LayerHeader } from "./layer-header";
import { LayerControls } from "./layer-controls";
import { LayerPropertiesPanel } from "./layer-properties-panel";
import { LayerDeleteConfirmation } from "./layer-delete-confirmation";

interface LayerItemProps {
  layer: Layer;
  index: number;
  isConfirmingDelete: boolean;
  layerColor: string;
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
  onScaleChange?: (layerId: string, scale: number) => void;
  onPositionChange?: (layerId: string, offsetX: number, offsetY: number) => void;
  onMoveUp: (layerId: string) => void;
  onMoveDown: (layerId: string) => void;
  onDeleteConfirm: (layerId: string) => void;
  onDeleteCancel: () => void;
  onStartDelete: (layerId: string) => void;
  totalLayers: number;
  onUploadMap?: () => void;
}

export function LayerItem({
  layer,
  index,
  isConfirmingDelete,
  layerColor,
  onToggleVisibility,
  onToggleLock,
  onOpacityChange,
  onScaleChange,
  onPositionChange,
  onMoveUp,
  onMoveDown,
  onDeleteConfirm,
  onDeleteCancel,
  onStartDelete,
  totalLayers,
  onUploadMap,
}: LayerItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group relative rounded-sm bg-obsidian/70 border border-iron/50 overflow-hidden hover:border-accent-gold/30 transition-colors">
      {/* Header Section */}
      <div className="relative">
        <LayerHeader
          layer={layer}
          layerColor={layerColor}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
        />

        {/* Action Controls - Positioned absolutely on the right */}
        <div className="absolute right-0 top-0 h-full flex items-center pr-3">
          {isConfirmingDelete ? (
            <LayerDeleteConfirmation
              onConfirm={() => onDeleteConfirm(layer.id)}
              onCancel={onDeleteCancel}
            />
          ) : (
            <LayerControls
              layer={layer}
              index={index}
              totalLayers={totalLayers}
              onToggleVisibility={onToggleVisibility}
              onToggleLock={onToggleLock}
              onOpacityChange={onOpacityChange}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onDeleteStart={onStartDelete}
              onUploadMap={onUploadMap}
            />
          )}
        </div>
      </div>

      {/* Properties Panel - Expandable */}
      {isExpanded && !layer.isBaseMap && (
        <LayerPropertiesPanel
          layer={layer}
          onOpacityChange={onOpacityChange}
          onScaleChange={onScaleChange}
          onPositionChange={onPositionChange}
        />
      )}
    </div>
  );
}
