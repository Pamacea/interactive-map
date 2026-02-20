import { useState, useCallback } from "react";
import type { LayerType } from "@/types/world.type";

/**
 * Layer Dialogs Hook
 * Manages dialog state for layer operations
 */
export function useLayerDialogs() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [newLayerName, setNewLayerName] = useState("");
  const [selectedLayerType, setSelectedLayerType] = useState<LayerType>("CUSTOM");
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());

  const resetAddDialog = useCallback(() => {
    setShowAddDialog(false);
    setNewLayerName("");
    setSelectedLayerType("CUSTOM");
  }, []);

  const openAddDialog = useCallback(() => {
    setShowAddDialog(true);
  }, []);

  const toggleLayerExpansion = useCallback((layerId: string) => {
    setExpandedLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layerId)) {
        next.delete(layerId);
      } else {
        next.add(layerId);
      }
      return next;
    });
  }, []);

  const confirmDelete = useCallback((layerId: string) => {
    setShowDeleteConfirm(layerId);
  }, []);

  const cancelDelete = useCallback(() => {
    setShowDeleteConfirm(null);
  }, []);

  const _openUploadDialog = useCallback(() => {
    setShowUploadDialog(true);
  }, []);

  const closeUploadDialog = useCallback(() => {
    setShowUploadDialog(false);
  }, []);

  return {
    showAddDialog,
    showDeleteConfirm,
    showUploadDialog,
    newLayerName,
    selectedLayerType,
    expandedLayers,
    setNewLayerName,
    setSelectedLayerType,
    setShowAddDialog,
    resetAddDialog,
    openAddDialog,
    toggleLayerExpansion,
    confirmDelete,
    cancelDelete,
    openUploadDialog,
    closeUploadDialog,
  };
}
