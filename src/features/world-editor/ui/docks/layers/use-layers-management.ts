import { useCallback, useEffect, useState } from "react";
import { useMapStore } from "@/features/world-editor/store/map-store";
import { createLayer, deleteLayer as deleteLayerAction } from "@/features/world-editor/actions";
import { getLayerContentCounts } from "@/features/world-editor/actions";
import type { LayerType, LayerContentCounts } from "@/types/world.type";

interface UseLayersManagementProps {
  worldId?: string;
}

/**
 * Layers Management Hook
 * Handles layer CRUD operations and content count fetching
 */
export function useLayersManagement({ worldId }: UseLayersManagementProps) {
  // Store selectors
  const layers = useMapStore((state) => state.layers);
  const selectedLayerId = useMapStore((state) => state.selectedLayerId);
  const activeLayerId = useMapStore((state) => state.activeLayerId);
  const addLayerFromServer = useMapStore((state) => state.addLayerFromServer);
  const removeLayer = useMapStore((state) => state.removeLayer);

  // Local state
  const [isCreatingLayer, setIsCreatingLayer] = useState(false);
  const [isDeletingLayer, setIsDeletingLayer] = useState<string | null>(null);
  const [contentCountsCache, setContentCountsCache] = useState<Record<string, LayerContentCounts>>({});

  // Fetch content counts for all layers
  useEffect(() => {
    if (!worldId || layers.length === 0) return;

    const fetchCounts = async () => {
      const counts: Record<string, LayerContentCounts> = {};
      await Promise.all(
        layers.map(async (layer) => {
          if (layer.isBaseMap || layer.type === "BASE_MAP") return;
          try {
            const layerCounts = await getLayerContentCounts(layer.id);
            counts[layer.id] = layerCounts;
          } catch (error) {
            console.error(`Failed to fetch counts for layer ${layer.id}:`, error);
          }
        })
      );
      setContentCountsCache(counts);
    };

    fetchCounts();
  }, [worldId, layers]);

  // Create layer
  const createNewLayer = useCallback(async (
    name: string,
    type: LayerType,
    onSuccess: () => void
  ) => {
    if (!worldId || !name.trim()) return false;

    setIsCreatingLayer(true);
    try {
      const result = await createLayer(worldId, {
        name: name.trim(),
        type,
        isVisible: true,
        locked: false,
        opacity: 1,
      });

      if (result.success && result.data) {
        addLayerFromServer({
          id: result.data.id,
          name: result.data.name,
          type: result.data.type as LayerType,
          visible: result.data.isVisible,
          locked: result.data.locked,
          opacity: result.data.opacity,
          zIndex: result.data.zIndex,
          scale: result.data.scale,
          offsetX: result.data.offsetX,
          offsetY: result.data.offsetY,
          minZoom: result.data.minZoom,
          maxZoom: result.data.maxZoom,
          isBaseMap: result.data.type === "BASE_MAP",
          contentCounts: { pins: 0, images: 0, regions: 0, total: 0 },
        });

        onSuccess();
        return true;
      } else {
        console.error("Failed to create layer:", result.error);
        return false;
      }
    } catch (error) {
      console.error("Failed to create layer:", error);
      return false;
    } finally {
      setIsCreatingLayer(false);
    }
  }, [worldId, addLayerFromServer]);

  // Delete layer
  const deleteLayer = useCallback(async (layerId: string) => {
    const layer = layers.find((l) => l.id === layerId);
    if (layer?.isBaseMap || layer?.type === "BASE_MAP") return false;

    setIsDeletingLayer(layerId);
    try {
      const result = await deleteLayerAction(layerId);
      if (result.success) {
        removeLayer(layerId);
        return true;
      } else {
        console.error("Failed to delete layer:", result.error);
        return false;
      }
    } catch (error) {
      console.error("Failed to delete layer:", error);
      return false;
    } finally {
      setIsDeletingLayer(null);
    }
  }, [layers, removeLayer]);

  return {
    layers,
    selectedLayerId,
    activeLayerId,
    contentCountsCache,
    setContentCountsCache,
    isCreatingLayer,
    isDeletingLayer,
    createNewLayer,
    deleteLayer,
  };
}
