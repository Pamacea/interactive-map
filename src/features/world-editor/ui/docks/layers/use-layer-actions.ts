import { useMemo, useCallback } from "react";
import { useMapStore } from "@/features/world-editor/store/map-store";
import type { LayerContentCounts } from "@/types/world.type";

interface UseLayerActionsProps {
  layers: Array<{ id: string; zIndex: number; minZoom?: number | null; maxZoom?: number | null }>;
  showDeleteConfirm: string | null;
  selectedLayerId: string | null;
  setSelectedLayerId: (id: string | null) => void;
  setActiveLayerId: (id: string | null) => void;
  confirmDelete: (layerId: string) => void;
  contentCountsCache: Record<string, LayerContentCounts>;
  setContentCountsCache: (cache: Record<string, LayerContentCounts>) => void;
  worldId?: string;
}

/**
 * Layer Actions Hook
 * Creates and manages layer action handlers
 */
export function useLayerActions({
  layers,
  showDeleteConfirm,
  selectedLayerId,
  setSelectedLayerId,
  setActiveLayerId,
  confirmDelete,
  _contentCountsCache,
  _setContentCountsCache,
  _worldId,
}: UseLayerActionsProps) {
  // Store selectors
  const toggleLayerVisibility = useMapStore((state) => state.toggleLayerVisibility);
  const toggleLayerLock = useMapStore((state) => state.toggleLayerLock);
  const updateLayerOpacity = useMapStore((state) => state.updateLayerOpacity);
  const moveLayerUp = useMapStore((state) => state.moveLayerUp);
  const moveLayerDown = useMapStore((state) => state.moveLayerDown);

  // Zoom range handlers
  const handleMinZoomChange = useCallback(async (layerId: string, minZoom: number) => {
    const layer = layers.find((l): l is Exclude<typeof layers[number], undefined> => l.id === layerId);
    if (!layer) return;

    const validatedMinZoom = Math.min(minZoom, layer.maxZoom ?? 200);
    useMapStore.getState().updateLayerMinZoom(layerId, validatedMinZoom);

    try {
      const { updateLayer } = await import("@/features/world-editor/actions/layers");
      await updateLayer(layerId, { minZoom: validatedMinZoom });
    } catch (error) {
      console.error("Failed to update layer min zoom:", error);
    }
  }, [layers]);

  const handleMaxZoomChange = useCallback(async (layerId: string, maxZoom: number) => {
    const layer = layers.find((l): l is Exclude<typeof layers[number], undefined> => l.id === layerId);
    if (!layer) return;

    const validatedMaxZoom = Math.max(maxZoom, layer.minZoom ?? 0);
    useMapStore.getState().updateLayerMaxZoom(layerId, validatedMaxZoom);

    try {
      const { updateLayer } = await import("@/features/world-editor/actions/layers");
      await updateLayer(layerId, { maxZoom: validatedMaxZoom });
    } catch (error) {
      console.error("Failed to update layer max zoom:", error);
    }
  }, [layers]);

  const handleResetZoom = useCallback(async (layerId: string) => {
    useMapStore.getState().updateLayerMinZoom(layerId, 0);
    useMapStore.getState().updateLayerMaxZoom(layerId, 200);

    try {
      const { updateLayer } = await import("@/features/world-editor/actions/layers");
      await updateLayer(layerId, { minZoom: 0, maxZoom: 200 });
    } catch (error) {
      console.error("Failed to reset layer zoom:", error);
    }
  }, []);

  // Delete handler
  const handleDelete = useCallback((layerId: string) => {
    if (showDeleteConfirm === layerId) {
      // Actual delete will be handled by parent
      confirmDelete(layerId);
    } else {
      confirmDelete(layerId);
    }
  }, [showDeleteConfirm, confirmDelete]);

  // Select handler
  const handleSelect = useCallback((layerId: string) => {
    const newSelectedId = selectedLayerId === layerId ? null : layerId;
    setSelectedLayerId(newSelectedId);
    setActiveLayerId(newSelectedId);
  }, [selectedLayerId, setSelectedLayerId, setActiveLayerId]);

  // Drop handler for reordering
  const handleDrop = useCallback(async (draggedLayerId: string, targetLayerId: string) => {
    const draggedLayer = layers.find((l): l is Exclude<typeof layers[number], undefined> => l.id === draggedLayerId);
    const targetLayer = layers.find((l): l is Exclude<typeof layers[number], undefined> => l.id === targetLayerId);

    if (draggedLayer && targetLayer && draggedLayer.id !== targetLayer.id) {
      const draggedZIndex = draggedLayer.zIndex;
      const targetZIndex = targetLayer.zIndex;

      useMapStore.getState().updateLayerZIndex(draggedLayer.id, targetZIndex);
      useMapStore.getState().updateLayerZIndex(targetLayer.id, draggedZIndex);

      try {
        const { updateLayerZIndex: updateServerZIndex } = await import("@/features/world-editor/actions/layers");
        await Promise.all([
          updateServerZIndex(draggedLayer.id, targetZIndex),
          updateServerZIndex(targetLayer.id, draggedZIndex),
        ]);
      } catch (error) {
        console.error("Failed to reorder layers:", error);
        useMapStore.getState().updateLayerZIndex(draggedLayer.id, draggedZIndex);
        useMapStore.getState().updateLayerZIndex(targetLayer.id, targetZIndex);
      }
    }
  }, [layers]);

  // Create layer actions object
  return useMemo(
    () => ({
      onToggleVisibility: toggleLayerVisibility,
      onToggleLock: toggleLayerLock,
      onOpacityChange: updateLayerOpacity,
      onMinZoomChange: handleMinZoomChange,
      onMaxZoomChange: handleMaxZoomChange,
      onResetZoom: handleResetZoom,
      onMoveUp: moveLayerUp,
      onMoveDown: moveLayerDown,
      onDelete: handleDelete,
      onSelect: handleSelect,
      onDrop: handleDrop,
    }),
    [
      toggleLayerVisibility,
      toggleLayerLock,
      updateLayerOpacity,
      moveLayerUp,
      moveLayerDown,
      handleMinZoomChange,
      handleMaxZoomChange,
      handleResetZoom,
      handleDelete,
      handleSelect,
      handleDrop,
    ]
  );
}
