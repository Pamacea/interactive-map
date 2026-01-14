"use client";

import { Plus } from "lucide-react";
import { useLayersPanel } from "../logic/use-layers-panel";
import { AddLayerDialog } from "./add-layer-dialog";
import { LayerItem } from "./layer-item";
import type { MapLayer } from "@/types/world.type";

interface LayersPanelProps {
  worldLayers?: MapLayer[];
}

export function LayersPanel({ worldLayers = [] }: LayersPanelProps) {
  const {
    layers,
    showAddDialog,
    newLayerName,
    showDeleteConfirm,
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
    getLayerColor,
  } = useLayersPanel({ worldLayers });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <button
          onClick={handleOpenAddDialog}
          className="flex items-center gap-1.5 text-xs text-accent-gold hover:text-accent-gold/80 transition-colors"
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

      <div className="space-y-1.5">
        {layers.length === 0 ? (
          <div className="px-3 py-6 text-center text-text-muted text-sm">
            No layers yet. Create one to get started.
          </div>
        ) : (
          layers.map((layer, index) => (
            <LayerItem
              key={layer.id}
              layer={layer}
              index={index}
              isConfirmingDelete={showDeleteConfirm === layer.id}
              layerColor={getLayerColor(index)}
              onToggleVisibility={handleToggleVisibility}
              onToggleLock={handleToggleLock}
              onOpacityChange={handleOpacityChange}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onDeleteConfirm={handleDeleteLayer}
              onDeleteCancel={handleCancelDelete}
              onStartDelete={handleStartDeleteConfirm}
              totalLayers={layers.length}
            />
          ))
        )}
      </div>
    </div>
  );
}
