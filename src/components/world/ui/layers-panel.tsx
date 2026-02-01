"use client";

import { Plus } from "lucide-react";
import { useLayersPanel } from "../logic/use-layers-panel";
import { useMapStore } from "@/stores/map-store";
import { AddLayerDialog } from "./add-layer-dialog";
import { LayerItem } from "./layer-item";
import { BaseMapLayerItem } from "./base-map-layer-item";
import { UploadMapDialog } from "./upload-map-dialog";
import type { OptimizedWorldLayer } from "@/types/world.type";

interface LayersPanelProps {
  worldId?: string;
  worldLayers?: OptimizedWorldLayer[];
  mapImage?: string | null;
}

export function LayersPanel({ worldId, worldLayers = [], mapImage }: LayersPanelProps) {
  const updateLayerScale = useMapStore((state) => state.updateLayerScale);
  const updateLayerPosition = useMapStore((state) => state.updateLayerPosition);

  const {
    layers,
    showAddDialog,
    newLayerName,
    showDeleteConfirm,
    showUploadDialog,
    setNewLayerName,
    handleToggleVisibility,
    handleToggleLock,
    handleOpacityChange,
    handleMoveUp,
    handleMoveDown,
    handleAddLayer,
    handleDeleteLayer,
    handleCancelDelete,
    handleOpenAddDialog,
    handleCloseAddDialog,
    handleStartDeleteConfirm,
    handleOpenUploadDialog,
    handleCloseUploadDialog,
    handleMapUploadSuccess,
    getLayerColor,
  } = useLayersPanel({ worldId, worldLayers });

  const handleScaleChange = (layerId: string, scale: number) => {
    updateLayerScale(layerId, scale);
  };

  const handlePositionChange = (layerId: string, offsetX: number, offsetY: number) => {
    updateLayerPosition(layerId, offsetX, offsetY);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <button
          onClick={handleOpenAddDialog}
          className="flex items-center gap-1.5 text-xs text-accent-gold hover:text-accent-gold/80 transition-colors font-display tracking-wide"
        >
          <Plus className="w-3 h-3" />
          Add Layer
        </button>
      </div>

      {showAddDialog && (
        <AddLayerDialog
          newLayerName={newLayerName}
          onNameChange={setNewLayerName}
          onAdd={handleAddLayer}
          onCancel={handleCloseAddDialog}
        />
      )}

      {showUploadDialog && worldId && (
        <UploadMapDialog
          worldId={worldId}
          isOpen={showUploadDialog}
          onClose={handleCloseUploadDialog}
          onSuccess={handleMapUploadSuccess}
        />
      )}

      <div className="space-y-1.5">
        {layers.length === 0 ? (
          <div className="px-3 py-6 text-center text-bone-dark text-sm font-fell">
            No layers yet. Create one to get started.
          </div>
        ) : (
          layers.map((layer, index) =>
            layer.isBaseMap ? (
              <BaseMapLayerItem
                key={layer.id}
                mapImage={mapImage ?? null}
                isVisible={layer.visible}
                isLocked={layer.locked}
                opacity={layer.opacity}
                scale={layer.scale}
                onToggleVisibility={() => handleToggleVisibility(layer.id)}
                onOpacityChange={(opacity) => handleOpacityChange(layer.id, opacity)}
                onScaleChange={(scale) => handleScaleChange(layer.id, scale)}
                onUploadMap={handleOpenUploadDialog}
              />
            ) : (
              <LayerItem
                key={layer.id}
                layer={layer}
                index={index}
                isConfirmingDelete={showDeleteConfirm === layer.id}
                layerColor={getLayerColor(index)}
                onToggleVisibility={handleToggleVisibility}
                onToggleLock={handleToggleLock}
                onOpacityChange={handleOpacityChange}
                onScaleChange={handleScaleChange}
                onPositionChange={handlePositionChange}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onDeleteConfirm={handleDeleteLayer}
                onDeleteCancel={handleCancelDelete}
                onStartDelete={handleStartDeleteConfirm}
                totalLayers={layers.length}
                onUploadMap={undefined}
              />
            )
          )
        )}
      </div>
    </div>
  );
}
