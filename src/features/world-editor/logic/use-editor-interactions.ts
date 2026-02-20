/**
 * useEditorInteractions - Combined hook for keyboard shortcuts and toast feedback
 *
 * This hook combines keyboard shortcuts with toast notifications to provide
 * a complete interaction system for the world editor.
 *
 * Features:
 * - Keyboard shortcuts (Esc, Delete, Ctrl+Z)
 * - Automatic toast feedback for actions
 * - Pin deletion with confirmation toast
 * - Selection cleared notification
 *
 * Usage:
 * ```tsx
 * import { useEditorInteractions } from "@/features/world-editor/logic/use-editor-interactions";
 *
 * function WorldEditor() {
 *   const { shortcuts } = useEditorInteractions({
 *     onPinDeleted: (id) => {
 *       // Handle pin deletion
 *     },
 *     onUndo: () => {
 *       // Handle undo
 *     },
 *   });
 *
 *   return <div>...</div>;
 * }
 * ```
 */

import { useCallback } from "react";
import { useKeyboardShortcuts as useWorldKeyboardShortcuts } from "./use-world-keyboard";
import { useToasts } from "../ui/feedback";

export interface EditorInteractionsConfig {
  /** Enable/disable interactions */
  enabled?: boolean;
  /** Custom callback when pin is deleted (after toast) */
  onPinDeleted?: (pinId: string) => void;
  /** Custom callback when selection is cleared (after toast) */
  onSelectionCleared?: () => void;
  /** Custom callback for undo */
  onUndo?: () => void;
  /** Custom callback for redo */
  onRedo?: () => void;
  /** Show toast notifications for actions */
  showToasts?: boolean;
}

export function useEditorInteractions(config: EditorInteractionsConfig = {}) {
  const {
    enabled = true,
    onPinDeleted: onPinDeletedProp,
    onSelectionCleared: onSelectionClearedProp,
    onUndo,
    onRedo,
    showToasts = true,
  } = config;

  const { showSuccess, showError, showInfo } = useToasts();

  // Wrap callbacks with toast feedback
  const handlePinDeleted = useCallback((pinId: string) => {
    if (showToasts) {
      showSuccess("Pin deleted successfully");
    }
    onPinDeletedProp?.(pinId);
  }, [showToasts, showSuccess, onPinDeletedProp]);

  const handleSelectionCleared = useCallback(() => {
    if (showToasts) {
      showInfo("Selection cleared");
    }
    onSelectionClearedProp?.();
  }, [showToasts, showInfo, onSelectionClearedProp]);

  const handleUndo = useCallback(() => {
    if (showToasts) {
      showInfo("Undo");
    }
    onUndo?.();
  }, [showToasts, showInfo, onUndo]);

  const handleRedo = useCallback(() => {
    if (showToasts) {
      showInfo("Redo");
    }
    onRedo?.();
  }, [showToasts, showInfo, onRedo]);

  // Connect to keyboard shortcuts
  const shortcuts = useWorldKeyboardShortcuts({
    enabled,
    onPinDeleted: handlePinDeleted,
    onSelectionCleared: handleSelectionCleared,
    onUndo: handleUndo,
    onRedo: handleRedo,
  });

  // Manual action triggers with toast feedback
  const actions = {
    /** Manually trigger pin deletion with toast */
    deletePin: useCallback(async () => {
      if (shortcuts.selectedPinId) {
        await shortcuts.shortcuts.delete();
      }
    }, [shortcuts.selectedPinId, shortcuts.shortcuts.delete]),

    /** Manually clear selection with toast */
    clearSelection: useCallback(() => {
      shortcuts.shortcuts.escape();
    }, [shortcuts.shortcuts.escape]),

    /** Manually trigger undo with toast */
    undo: useCallback(() => {
      shortcuts.shortcuts.undo();
    }, [shortcuts.shortcuts.undo]),

    /** Manually trigger redo with toast */
    redo: useCallback(() => {
      shortcuts.shortcuts.redo();
    }, [shortcuts.shortcuts.redo]),
  };

  return {
    ...shortcuts,
    actions,
    // Expose toast functions for custom feedback
    toasts: {
      showSuccess,
      showError,
      showInfo,
    },
  };
}
