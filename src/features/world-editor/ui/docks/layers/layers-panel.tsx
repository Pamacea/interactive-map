/**
 * Layers Panel (Dock) - Dock panel in left sidebar using unified layers components
 * @module docks/layers-panel
 *
 * UX Improvements:
 * - Better spacing and visual hierarchy
 * - Cleaner add layer button
 * - Improved loading states
 */

"use client";

import { Plus, Loader2 } from "lucide-react";
import { cn } from "@/shared/utils";
import { useMapStore } from "@/features/world-editor/store/map-store";
import { useLeftDock } from "@/features/world-editor/logic/use-left-dock";
import {
  LayersList,
  LayersEmptyState,
  type UILayer,
  type LayerContentCounts,
} from "@/features/world-editor/ui/layers";
import { AddLayerDialog } from "@/features/world-editor/ui/add-layer-dialog";
import { UploadMapDialog } from "@/features/world-editor/ui/upload-map-dialog";
import { moveItemToLayer } from "@/features/world-editor/actions";
import type { OptimizedWorldLayer } from "@/types/world.type";
import { useLayersManagement } from "./use-layers-management";
import { useLayerDialogs } from "./use-layer-dialogs";
import { useLayerActions } from "./use-layer-actions";

interface LayersDockPanelProps {
  className?: string;
  worldId?: string;
  worldLayers?: OptimizedWorldLayer[];
  mapImage?: string | null;
  layerContentCounts?: Record<string, LayerContentCounts>;
}

export function LayersDockPanel({
  className,
  worldId,
  worldLayers: _worldLayers = [],
  mapImage,
  layerContentCounts = {},
}: LayersDockPanelProps) {
  const { isExpanded } = useLeftDock();

  // Store selectors for layer operations
  const selectedLayerId = useMapStore((state) => state.selectedLayerId);
  const activeLayerId = useMapStore((state) => state.activeLayerId);
  const setSelectedLayerId = useMapStore((state) => state.setSelectedLayerId);
  const setActiveLayerId = useMapStore((state) => state.setActiveLayerId);

  // Custom hooks
  const {
    layers,
    contentCountsCache,
    setContentCountsCache,
    isCreatingLayer,
    isDeletingLayer,
    createNewLayer,
    deleteLayer,
  } = useLayersManagement({ worldId });

  const {
    showAddDialog,
    showDeleteConfirm,
    showUploadDialog,
    newLayerName,
    selectedLayerType,
    expandedLayers,
    setNewLayerName,
    setSelectedLayerType,
    resetAddDialog,
    toggleLayerExpansion,
    confirmDelete,
    cancelDelete,
    closeUploadDialog,
  } = useLayerDialogs();

  const layerActions = useLayerActions({
    layers,
    showDeleteConfirm,
    selectedLayerId,
    setSelectedLayerId,
    setActiveLayerId,
    confirmDelete,
    contentCountsCache,
    setContentCountsCache,
    worldId,
  });

  // Handlers
  const handleAddLayer = async () => {
    await createNewLayer(selectedLayerType, newLayerName, resetAddDialog);
  };

  const _handleDeleteLayer = async (layerId: string) => {
    const success = await deleteLayer(layerId);
    if (success) {
      cancelDelete();
    }
  };

  const handleMapUploadSuccess = () => {
    closeUploadDialog();
  };

  // Determine variant based on dock state
  const variant = isExpanded ? "expanded" : "compact";

  // Prevent map interactions when interacting with the panel
  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  // Convert store layers to UILayer format with content counts
  const uiLayers: UILayer[] = layers.map((layer) => ({
    ...layer,
    type: layer.type || "CUSTOM",
    isSelected: selectedLayerId === layer.id,
    contentCounts: layer.contentCounts || contentCountsCache[layer.id] || layerContentCounts[layer.id] || {
      pins: 0,
      images: 0,
      regions: 0,
      total: 0,
    },
  }));

  return (
    <div
      className={cn("space-y-2", className)}
      onMouseDown={handleInteraction}
      onMouseUp={handleInteraction}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      onTouchEnd={handleInteraction}
      onTouchMove={handleInteraction}
    >
      {/* Add button - only when expanded */}
      {isExpanded && (
        <div className="flex items-center justify-end px-3 pb-1">
          <button
            onClick={() => {
              if (worldId) {
                // Reset to default values
                setNewLayerName("");
                setSelectedLayerType("CUSTOM");
              }
            }}
            disabled={!worldId}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-sm transition-all",
              "text-accent-gold border border-accent-gold/30 hover:border-accent-gold/60 hover:bg-accent-gold/10",
              "font-display tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Layer
          </button>
        </div>
      )}

      {/* Add Layer Dialog */}
      {showAddDialog && (
        <div className="px-3 pb-2">
          <AddLayerDialog
            newLayerName={newLayerName}
            onNameChange={setNewLayerName}
            onAdd={handleAddLayer}
            onCancel={resetAddDialog}
          />
          {isCreatingLayer && (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="w-4 h-4 animate-spin text-accent-gold" />
              <span className="ml-2 text-xs text-bone-dark">Creating layer...</span>
            </div>
          )}
        </div>
      )}

      {/* Upload Map Dialog */}
      {showUploadDialog && worldId && (
        <UploadMapDialog
          worldId={worldId}
          isOpen={showUploadDialog}
          onClose={closeUploadDialog}
          onSuccess={handleMapUploadSuccess}
        />
      )}

      {/* Layers List */}
      <LayersList
        layers={uiLayers}
        selectedLayerId={selectedLayerId}
        activeLayerId={activeLayerId}
        variant={variant}
        isCollapsed={!isExpanded}
        mapImage={mapImage}
        actions={layerActions}
        expandedLayers={expandedLayers}
        onToggleExpansion={toggleLayerExpansion}
        onMoveItemToLayer={async (itemId, itemType, targetLayerId) => {
          if (!worldId) return;
          try {
            await moveItemToLayer(itemId, itemType, targetLayerId);
            const counts = { ...contentCountsCache };
            delete counts[targetLayerId];
            setContentCountsCache(counts);
          } catch (error) {
            console.error("Failed to move item to layer:", error);
          }
        }}
        showProperties={true}
        renderEmptyState={() => (
          <LayersEmptyState
            onAddLayer={isExpanded && worldId ? () => {
              setNewLayerName("");
              setSelectedLayerType("CUSTOM");
            } : undefined}
          />
        )}
      />

      {/* Deleting indicator */}
      {isDeletingLayer && (
        <div className="px-3 py-2 bg-obsidian/50 border border-iron/30 rounded-sm">
          <div className="flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-accent-gold" />
            <span className="ml-2 text-xs text-bone-dark">Deleting layer...</span>
          </div>
        </div>
      )}
    </div>
  );
}
