/**
 * History Store - Manages undo/redo state for map actions
 *
 * Tracks user actions for undo/redo functionality using a command pattern.
 * Each history item contains undo/redo functions for optimal performance.
 *
 * Architecture:
 * - past: Stack of actions that can be undone (newest first)
 * - future: Stack of undone actions that can be redone (newest first)
 * - maxSize: Maximum history entries to keep
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ============== Types ==============

export type HistoryItemType = "pin" | "layer" | "region" | "transform" | "property" | "batch";

export interface HistoryItem {
  id: string;
  timestamp: number;
  type: HistoryItemType;
  description: string;
  // Functional undo/redo - most flexible approach
  undo: () => void | Promise<void>;
  redo: () => void | Promise<void>;
  // Optional metadata for UI
  metadata?: {
    worldId?: string;
    affectedIds?: string[];
    batch?: boolean;
  };
}

interface HistoryState {
  past: HistoryItem[];
  future: HistoryItem[];
  maxSize: number;
  isExecuting: boolean; // Prevents recursion during undo/redo

  // Actions
  canUndo: () => boolean;
  canRedo: () => boolean;
  addHistory: (item: Omit<HistoryItem, "id" | "timestamp">) => void;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  clear: () => void;
  getPastDescription: () => string | null;
  getFutureDescription: () => string | null;
}

// ============== Store ==============

export const useHistoryStore = create<HistoryState>()(
  devtools(
    (set, get) => ({
      past: [],
      future: [],
      maxSize: 50,
      isExecuting: false,

      canUndo: () => get().past.length > 0 && !get().isExecuting,
      canRedo: () => get().future.length > 0 && !get().isExecuting,

      addHistory: (item) =>
        set((state) => {
          // Don't add history while executing undo/redo
          if (state.isExecuting) return state;

          const newItem: HistoryItem = {
            ...item,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
          };

          // Add to past, trim if exceeds max size
          const newPast = [newItem, ...state.past].slice(0, state.maxSize);

          // Clear future when adding new entry
          return {
            past: newPast,
            future: [],
          };
        }),

      undo: async () => {
        const _state = get();
        if (state.past.length === 0 || state.isExecuting) return;

        const entry = state.past[0];
        const newPast = state.past.slice(1);
        const newFuture = [entry, ...state.future];

        // Set executing flag to prevent new history items during undo
        set({ isExecuting: true, past: newPast, future: newFuture });

        try {
          await entry.undo();
        } catch (error) {
          console.error("[HistoryStore] Undo failed:", error);
          // Rollback the history state on failure
          set({ past: state.past, future: state.future });
        } finally {
          set({ isExecuting: false });
        }
      },

      redo: async () => {
        const _state = get();
        if (state.future.length === 0 || state.isExecuting) return;

        const entry = state.future[0];
        const newFuture = state.future.slice(1);
        const newPast = [entry, ...state.past];

        // Set executing flag to prevent new history items during redo
        set({ isExecuting: true, past: newPast, future: newFuture });

        try {
          await entry.redo();
        } catch (error) {
          console.error("[HistoryStore] Redo failed:", error);
          // Rollback the history state on failure
          set({ past: state.past, future: state.future });
        } finally {
          set({ isExecuting: false });
        }
      },

      clear: () =>
        set({
          past: [],
          future: [],
        }),

      getPastDescription: () => {
        const _state = get();
        return state.past.length > 0 ? state.past[0].description : null;
      },

      getFutureDescription: () => {
        const _state = get();
        return state.future.length > 0 ? state.future[0].description : null;
      },
    }),
    {
      name: "history-store",
    }
  )
);

// ============== Selector Hooks ==============

export const useCanUndo = () => useHistoryStore((state) => state.canUndo());
export const useCanRedo = () => useHistoryStore((state) => state.canRedo());
export const useHistoryPast = () => useHistoryStore((state) => state.past);
export const useHistoryFuture = () => useHistoryStore((state) => state.future);
export const useIsExecutingHistory = () => useHistoryStore((state) => state.isExecuting);
export const useUndoDescription = () => useHistoryStore((state) => state.getPastDescription());
export const useRedoDescription = () => useHistoryStore((state) => state.getFutureDescription());

// ============== Action Hooks ==============

export const useAddHistory = () => useHistoryStore((state) => state.addHistory);
export const useUndo = () => useHistoryStore((state) => state.undo);
export const useRedo = () => useHistoryStore((state) => state.redo);
export const useClearHistory = () => useHistoryStore((state) => state.clear);

// ============== Helper Functions ==============

/**
 * Create a history item for pin creation
 */
export function createPinCreatedHistory(
  pin: { id: string; gameWorldId: string },
  undoAction: () => void | Promise<void>
): Omit<HistoryItem, "id" | "timestamp"> {
  return {
    type: "pin",
    description: `Created pin: ${pin.id}`,
    undo: undoAction,
    redo: async () => {
      // For redo, we need to recreate the pin
      // This is handled by the caller since they have the original data
      console.warn("[History] Redo for pin creation requires original data");
    },
    metadata: {
      worldId: pin.gameWorldId,
      affectedIds: [pin.id],
    },
  };
}

/**
 * Create a history item for pin deletion
 */
export function createPinDeletedHistory(
  pin: { id: string; gameWorldId: string; title: string; [key: string]: unknown },
  undoAction: () => void | Promise<void>
): Omit<HistoryItem, "id" | "timestamp"> {
  return {
    type: "pin",
    description: `Deleted pin: ${pin.title}`,
    undo: undoAction,
    redo: async () => {
      // For redo, delete the pin again
      console.warn("[History] Redo for pin deletion requires delete action");
    },
    metadata: {
      worldId: pin.gameWorldId,
      affectedIds: [pin.id],
    },
  };
}

/**
 * Create a history item for pin position change
 */
export function createPinMovedHistory(
  pinId: string,
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
  undoAction: () => void | Promise<void>,
  redoAction: () => void | Promise<void>
): Omit<HistoryItem, "id" | "timestamp"> {
  return {
    type: "pin",
    description: `Moved pin`,
    undo: undoAction,
    redo: redoAction,
    metadata: {
      affectedIds: [pinId],
    },
  };
}

/**
 * Create a history item for layer operations
 */
export function createLayerHistory(
  action: "created" | "deleted" | "reordered",
  layerId: string,
  layerName: string,
  undoAction: () => void | Promise<void>,
  redoAction: () => void | Promise<void>
): Omit<HistoryItem, "id" | "timestamp"> {
  return {
    type: "layer",
    description: `${action.charAt(0).toUpperCase() + action.slice(1)} layer: ${layerName}`,
    undo: undoAction,
    redo: redoAction,
    metadata: {
      affectedIds: [layerId],
    },
  };
}

/**
 * Create a history item for region operations
 */
export function createRegionHistory(
  action: "created" | "deleted" | "moved",
  regionId: string,
  regionName: string,
  undoAction: () => void | Promise<void>,
  redoAction: () => void | Promise<void>
): Omit<HistoryItem, "id" | "timestamp"> {
  return {
    type: "region",
    description: `${action.charAt(0).toUpperCase() + action.slice(1)} region: ${regionName}`,
    undo: undoAction,
    redo: redoAction,
    metadata: {
      affectedIds: [regionId],
    },
  };
}

/**
 * Create a batch history item for multiple operations
 */
export function createBatchHistory(
  description: string,
  items: Omit<HistoryItem, "id" | "timestamp">[],
  undoAction: () => void | Promise<void>,
  redoAction: () => void | Promise<void>
): Omit<HistoryItem, "id" | "timestamp"> {
  // Collect all affected IDs
  const affectedIds = items.flatMap((item) => item.metadata?.affectedIds ?? []);

  return {
    type: "batch",
    description,
    undo: undoAction,
    redo: redoAction,
    metadata: {
      batch: true,
      affectedIds,
    },
  };
}
