/**
 * Layers Panel - Unified layers panel using shared components
 * @module layers-panel
 */

"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus } from "lucide-react";
import { useMapStore } from "@/features/map-store";
import {
  LayersList,
  LayersEmptyState,
  createLayerActions,
  type UILayer,
} from "@/features/world-editor/ui/layers";
import { AddLayerDialog } from "./add-layer-dialog";
import { UploadMapDialog } from "./upload-map-dialog";
import type { OptimizedWorldLayer } from "@/types/world.type";

interface LayersPanelProps {
  worldId?: string;
  worldLayers?: OptimizedWorldLayer[];
  mapImage?: string | null;
}

export function LayersPanel({ worldId, worldLayers: _worldLayers = [], mapImage }: LayersPanelProps) {
  // Store selectors
  const _layers = useMapStore((state) => state.layers);
  const selectedLayerId = useMapStore((state) => state.selectedLayerId);
  const toggleLayerVisibility = useMapStore((state) => state.toggleLayerVisibility);
  const toggleLayerLock = useMapStore((state) => state.toggleLayerLock);
  const updateLayerOpacity = useMapStore((state) => state.updateLayerOpacity);
  const _updateLayerScale = useMapStore((state) => state.updateLayerScale);
  const _updateLayerPosition = useMapStore((state) => state.updateLayerPosition);
  const updateLayerMinZoom = useMapStore((state) => state.updateLayerMinZoom);
  const updateLayerMaxZoom = useMapStore((state) => state.updateLayerMaxZoom);
  const moveLayerUp = useMapStore((state) => state.moveLayerUp);
  const moveLayerDown = useMapStore((state) => state.moveLayerDown);
  const removeLayer = useMapStore((state) => state.removeLayer);

  // Local state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newLayerName, setNewLayerName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Convert store layers to UILayer format
  /* eslint-disable react-hooks/exhaustive-deps */
  const uiLayers: UILayer[] = useMemo(() => {
    return layers.map((layer) => ({
      ...layer,
      isSelected: selectedLayerId === layer.id,
    }));
  }, [layers, selectedLayerId]);

  // Create layer actions
  /* eslint-disable react-hooks/exhaustive-deps */
  const layerActions = useMemo(() =>
    createLayerActions({
      onToggleVisibility: toggleLayerVisibility,
      onToggleLock: toggleLayerLock,
      onOpacityChange: updateLayerOpacity,
      onMinZoomChange: updateLayerMinZoom,
      onMaxZoomChange: updateLayerMaxZoom,
      onResetZoom: (layerId) => {
        useMapStore.getState().resetLayerZoom(layerId);
      },
      onMoveUp: moveLayerUp,
      onMoveDown: moveLayerDown,
      onDelete: (layerId) => {
        if (showDeleteConfirm === layerId) {
          handleDeleteLayer(layerId);
        } else {
          setShowDeleteConfirm(layerId);
        }
      },
    }),
    [
      toggleLayerVisibility,
      toggleLayerLock,
      updateLayerOpacity,
      updateLayerMinZoom,
      updateLayerMaxZoom,
      moveLayerUp,
      moveLayerDown,
      showDeleteConfirm,
      handleDeleteLayer,
    ]
  );

  // Handlers
  /* eslint-disable react-hooks/exhaustive-deps */
  const handleAddLayer = useCallback(() => {
    if (newLayerName.trim()) {
      const maxZIndex = layers.length > 0 ? Math.max(...layers.map((l) => l.zIndex)) : 0;
      useMapStore.getState().addLayer({
        name: newLayerName.trim(),
        visible: true,
        locked: false,
        opacity: 1,
        zIndex: maxZIndex + 1,
        scale: 1.0,
        offsetX: 0,
        offsetY: 0,
      });
      setNewLayerName("");
      setShowAddDialog(false);
    }
  }, [newLayerName, layers]);

  /* eslint-disable react-hooks/exhaustive-deps */
  const _handleDeleteLayer = useCallback((layerId: string) => {
    const layer = layers.find((l) => l.id === layerId);
    if (layer?.isBaseMap) return;
    removeLayer(layerId);
    setShowDeleteConfirm(null);
  }, [layers, removeLayer]);

  const _handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(null);
  }, []);

  const _handleOpenUploadDialog = useCallback(() => {
    setShowUploadDialog(true);
  }, []);

  const handleCloseUploadDialog = useCallback(() => {
    setShowUploadDialog(false);
  }, []);

  const handleMapUploadSuccess = useCallback(() => {
    setShowUploadDialog(false);
    // Refresh would be handled by parent
  }, []);

  return (
    <div className="space-y-3">
      {/* Add button */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-1.5 text-xs text-accent-gold hover:text-accent-gold/80 transition-colors font-display tracking-wide"
        >
          <Plus className="w-3 h-3" />
          Add Layer
        </button>
      </div>

      {/* Add Layer Dialog */}
      {showAddDialog && (
        <AddLayerDialog
          newLayerName={newLayerName}
          onNameChange={setNewLayerName}
          onAdd={handleAddLayer}
          onCancel={() => {
            setShowAddDialog(false);
            setNewLayerName("");
          }}
        />
      )}

      {/* Upload Map Dialog */}
      {showUploadDialog && worldId && (
        <UploadMapDialog
          worldId={worldId}
          isOpen={showUploadDialog}
          onClose={handleCloseUploadDialog}
          onSuccess={handleMapUploadSuccess}
        />
      )}

      {/* Layers List */}
      <LayersList
        layers={uiLayers}
        selectedLayerId={selectedLayerId}
        variant="expanded"
        mapImage={mapImage}
        actions={layerActions}
        renderEmptyState={() => <LayersEmptyState onAddLayer={() => setShowAddDialog(true)} />}
      />
    </div>
  );
}
