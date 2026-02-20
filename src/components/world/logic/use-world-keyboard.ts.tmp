/**
 * useKeyboardShortcuts - Hook for managing keyboard shortcuts in the world editor
 *
 * Provides keyboard shortcuts for:
 * - Escape: Deselect pin / close panels
 * - Delete/Backspace: Delete selected pin
 * - Ctrl+Z: Undo
 * - Ctrl+Y / Ctrl+Shift+Z: Redo
 *
 * Connects to Zustand stores for pin selection, panel management, and history.
 */

import { useEffect, useCallback } from "react";
import {
  useSelectedPinId,
  useClearSelection,
  useDeletePinServer,
  usePins,
} from "@/stores/use-pins-store";
import {
  useHidePanel,
  useFloatingPanelsStore,
} from "@/store/use-floating-panels-store";
import type { FloatingPanelId } from "@/store/use-floating-panels-store";
import { shouldIgnoreKeyboardEvent } from "@/lib/utils";
import {
  useIsMeasuring,
  useMeasurePoints,
  useClearMeasure,
  useIsSelecting,
  useSelectionRect,
  useClearToolSelection,
  useSelectedPinIds,
} from "@/stores/tools";
import { useUndo, useRedo, useCanUndo, useCanRedo } from "@/stores/history-store";

export interface KeyboardShortcutConfig {
  /** Enable/disable shortcuts */
  enabled?: boolean;
  /** Optional callback when pin is deleted */
  onPinDeleted?: (pinId: string) => void;
  /** Optional callback when selection is cleared */
  onSelectionCleared?: () => void;
  /** Optional callback when undo is performed (in addition to history store) */
  onUndoPerformed?: () => void;
  /** Optional callback when redo is performed (in addition to history store) */
  onRedoPerformed?: () => void;
}

export function useKeyboardShortcuts(config: KeyboardShortcutConfig = {}) {
  const {
    enabled = true,
    onPinDeleted,
    onSelectionCleared,
    onUndoPerformed,
    onRedoPerformed,
  } = config;

  // Store access
  const selectedPinId = useSelectedPinId();
  const clearSelection = useClearSelection();
  const deletePinServer = useDeletePinServer();
  const hidePanel = useHidePanel();
  const pins = usePins();

  // Tools store access for measurement and selection states
  const isMeasuring = useIsMeasuring();
  const measurePoints = useMeasurePoints();
  const clearMeasure = useClearMeasure();
  const isSelecting = useIsSelecting();
  const selectionRect = useSelectionRect();
  const clearToolSelection = useClearToolSelection();
  const selectedPinIds = useSelectedPinIds();

  // History store access
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  // Get all visible floating panels
  const panels = useFloatingPanelsStore((state) => state.panels);

  // Get selected pin data
  const selectedPin = selectedPinId
    ? pins.find((pin) => pin.id === selectedPinId)
    : null;

  // Handle Escape key - deselect pins, close panels, clear measurements, clear selections
  const handleEscape = useCallback(() => {
    let handled = false;

    // 1. Close all visible floating panels
    const visiblePanelIds = Object.entries(panels)
      .filter(([_, panel]) => panel.isVisible)
      .map(([id]) => id as FloatingPanelId);

    if (visiblePanelIds.length > 0) {
      visiblePanelIds.forEach((panelId) => hidePanel(panelId));
      handled = true;
    }

    // 2. Clear selected pin (single selection from use-pins-store)
    if (selectedPinId) {
      clearSelection();
      onSelectionCleared?.();
      handled = true;
    }

    // 3. Clear active measurements
    if (isMeasuring || measurePoints.length > 0) {
      clearMeasure();
      handled = true;
    }

    // 4. Clear active selections (area tool)
    if (isSelecting || selectionRect || selectedPinIds.length > 0) {
      clearToolSelection();
      handled = true;
    }

    return handled;
  }, [panels, hidePanel, selectedPinId, clearSelection, onSelectionCleared, isMeasuring, measurePoints, clearMeasure, isSelecting, selectionRect, selectedPinIds, clearToolSelection]);

  // Handle Delete/Backspace - delete selected pin
  const handleDelete = useCallback(async () => {
    if (selectedPinId && selectedPin) {
      try {
        await deletePinServer(selectedPinId);
        clearSelection();
        onPinDeleted?.(selectedPinId);
      } catch (error) {
        console.error("Failed to delete pin:", error);
      }
    }
  }, [selectedPinId, selectedPin, deletePinServer, clearSelection, onPinDeleted]);

  // Handle Ctrl+Z - undo
  const handleUndo = useCallback(async () => {
    if (!canUndo()) return;
    await undo();
    onUndoPerformed?.();
  }, [undo, canUndo, onUndoPerformed]);

  // Handle Ctrl+Y / Ctrl+Shift+Z - redo
  const handleRedo = useCallback(async () => {
    if (!canRedo()) return;
    await redo();
    onRedoPerformed?.();
  }, [redo, canRedo, onRedoPerformed]);

  // Main keyboard event handler
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or has data-no-shortcut attribute
      if (shouldIgnoreKeyboardEvent(e)) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          handleEscape();
          break;

        case "Delete":
        case "Backspace":
          if (selectedPinId) {
            e.preventDefault();
            handleDelete();
          }
          break;

        default:
          // Handle modifier combinations
          if (e.ctrlKey || e.metaKey) {
            if (e.key === "z" && !e.shiftKey) {
              e.preventDefault();
              handleUndo();
            } else if ((e.key === "y" || (e.key === "z" && e.shiftKey))) {
              e.preventDefault();
              handleRedo();
            }
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, selectedPinId, handleEscape, handleDelete, handleUndo, handleRedo, canUndo, canRedo]);

  return {
    selectedPinId,
    selectedPin,
    clearSelection,
    // Allow manual trigger of shortcuts
    shortcuts: {
      escape: handleEscape,
      delete: handleDelete,
      undo: handleUndo,
      redo: handleRedo,
    },
  };
}
