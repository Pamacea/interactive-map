import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMapStore } from "@/stores/map-store";
import type { MapLayer } from "@/types/world.type";

interface UseLayersPanelProps {
  worldId?: string;
  worldLayers?: MapLayer[];
}

interface AddLayerData {
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  zIndex: number;
  scale: number;
  offsetX: number;
  offsetY: number;
}

export function useLayersPanel({ worldId, worldLayers = [] }: UseLayersPanelProps) {
  const router = useRouter();

  // Store selectors
  const layers = useMapStore((state) => state.layers);
  const toggleLayerVisibility = useMapStore((state) => state.toggleLayerVisibility);
  const toggleLayerLock = useMapStore((state) => state.toggleLayerLock);
  const updateLayerOpacity = useMapStore((state) => state.updateLayerOpacity);
  const moveLayerUp = useMapStore((state) => state.moveLayerUp);
  const moveLayerDown = useMapStore((state) => state.moveLayerDown);
  const addLayer = useMapStore((state) => state.addLayer);
  const removeLayer = useMapStore((state) => state.removeLayer);

  // Local state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newLayerName, setNewLayerName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Computed
  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  // Handlers
  const handleToggleVisibility = useCallback((layerId: string) => {
    toggleLayerVisibility(layerId);
  }, [toggleLayerVisibility]);

  const handleToggleLock = useCallback((layerId: string) => {
    toggleLayerLock(layerId);
  }, [toggleLayerLock]);

  const handleOpacityChange = useCallback((layerId: string, opacity: number) => {
    updateLayerOpacity(layerId, opacity);
  }, [updateLayerOpacity]);

  const handleMoveUp = useCallback((layerId: string) => {
    // Prevent moving the base map layer
    const layer = layers.find((l) => l.id === layerId);
    if (layer?.isBaseMap) return;
    moveLayerUp(layerId);
  }, [moveLayerUp, layers]);

  const handleMoveDown = useCallback((layerId: string) => {
    // Prevent moving the base map layer
    const layer = layers.find((l) => l.id === layerId);
    if (layer?.isBaseMap) return;
    moveLayerDown(layerId);
  }, [moveLayerDown, layers]);

  const handleAddLayer = useCallback(() => {
    if (newLayerName.trim()) {
      const maxZIndex = layers.length > 0 ? Math.max(...layers.map((l) => l.zIndex)) : 0;
      const layerData: AddLayerData = {
        name: newLayerName.trim(),
        visible: true,
        locked: false,
        opacity: 1,
        zIndex: maxZIndex + 1,
        scale: 1.0,
        offsetX: 0,
        offsetY: 0,
      };
      addLayer(layerData);
      setNewLayerName("");
      setShowAddDialog(false);
    }
  }, [newLayerName, layers, addLayer]);

  const handleDeleteLayer = useCallback((layerId: string) => {
    // Prevent deleting the base map layer
    const layer = layers.find((l) => l.id === layerId);
    if (layer?.isBaseMap) return;
    removeLayer(layerId);
    setShowDeleteConfirm(null);
  }, [removeLayer, layers]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(null);
  }, []);

  const handleOpenAddDialog = useCallback(() => {
    setShowAddDialog(true);
  }, []);

  const handleCloseAddDialog = useCallback(() => {
    setShowAddDialog(false);
    setNewLayerName("");
  }, []);

  const handleStartDeleteConfirm = useCallback((layerId: string) => {
    setShowDeleteConfirm(layerId);
  }, []);

  const handleOpenUploadDialog = useCallback(() => {
    setShowUploadDialog(true);
  }, []);

  const handleCloseUploadDialog = useCallback(() => {
    setShowUploadDialog(false);
  }, []);

  const handleMapUploadSuccess = useCallback(
    (mapUrl: string) => {
      setShowUploadDialog(false);

      // Refresh the page to show the new map
      if (worldId) {
        router.refresh();
      }
    },
    [worldId, router]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showDeleteConfirm) {
        handleCancelDelete();
      }
    };

    if (showDeleteConfirm) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [showDeleteConfirm, handleCancelDelete]);

  // Layer color utility
  const getLayerColor = useCallback((index: number) => {
    const colors = ["bg-accent-gold", "bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-rose-500"];
    return colors[index % colors.length];
  }, []);

  return {
    // State
    layers: sortedLayers,
    showAddDialog,
    newLayerName,
    showDeleteConfirm,
    showUploadDialog,

    // Actions
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

    // Utilities
    getLayerColor,
  };
}
