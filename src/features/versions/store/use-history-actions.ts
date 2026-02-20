/**
 * History Actions - Integration hooks for tracking undo/redo history
 *
 * Provides hooks that wrap store actions with automatic history tracking.
 * Each hook creates a history entry when an action is performed.
 *
 * Usage:
 *   const createPinWithHistory = useCreatePinWithHistory();
 *   await createPinWithHistory(data); // Automatically tracks history
 */

import { useCallback } from "react";
import { useHistoryStore } from "./history-store";
import type { Pin } from "@prisma/client";
import type { Region } from "./regions/use-regions-data-store";
import type { MapLayer } from "@prisma/client";

// ============== Pin History Hooks ==============

/**
 * Hook that wraps pin creation with history tracking
 *
 * @param createPinFn - The actual create pin function (e.g., from useCreatePin)
 * @param deletePinFn - The delete function to use for undo
 * @returns A function that creates a pin and tracks history
 */
export function useCreatePinWithHistory(
  createPinFn: (data: unknown) => Promise<Pin | null>,
  deletePinFn?: (pinId: string) => Promise<void>
) {
  const addHistory = useHistoryStore((state) => state.addHistory);

  return useCallback(
    async (data: unknown & { gameWorldId?: string }) => {
      const result = await createPinFn(data);

      if (result) {
        addHistory({
          type: "pin",
          description: `Created pin: ${result.title || "Untitled"}`,
          undo: async () => {
            if (deletePinFn) {
              await deletePinFn(result.id);
            }
          },
          redo: async () => {
            // Re-create the pin with original data
            await createPinFn(data);
          },
          metadata: {
            worldId: data.gameWorldId,
            affectedIds: [result.id],
          },
        });
      }

      return result;
    },
    [createPinFn, deletePinFn, addHistory]
  );
}

/**
 * Hook that wraps pin deletion with history tracking
 *
 * @param deletePinFn - The actual delete pin function
 * @param createPinFn - The create function to use for redo (optional)
 * @returns A function that deletes a pin and tracks history
 */
export function useDeletePinWithHistory(
  deletePinFn: (pinId: string) => Promise<void>,
  createPinFn?: (data: unknown) => Promise<Pin | null>
) {
  const addHistory = useHistoryStore((state) => state.addHistory);
  const pins = useHistoryStore((state) => state.past); // We'll need to get pins from pins store

  return useCallback(
    async (pinId: string, pinData?: Pin) => {
      // Capture pin data before deletion for undo
      const pinToDelete = pinData;

      await deletePinFn(pinId);

      if (pinToDelete) {
        addHistory({
          type: "pin",
          description: `Deleted pin: ${pinToDelete.title || "Untitled"}`,
          undo: async () => {
            if (createPinFn && pinToDelete) {
              // Recreate the pin with original data
              await createPinFn(pinToDelete);
            }
          },
          redo: async () => {
            // Delete the pin again
            await deletePinFn(pinId);
          },
          metadata: {
            worldId: pinToDelete.gameWorldId,
            affectedIds: [pinId],
          },
        });
      }
    },
    [deletePinFn, createPinFn, addHistory]
  );
}

/**
 * Hook that wraps pin position updates with history tracking
 *
 * @param updatePinFn - The actual update pin function
 * @returns A function that updates pin position and tracks history
 */
export function useUpdatePinPositionWithHistory(
  updatePinFn: (pinId: string, latitude: number, longitude: number) => Promise<void>
) {
  const addHistory = useHistoryStore((state) => state.addHistory);

  return useCallback(
    async (pinId: string, latitude: number, longitude: number, fromPosition?: { latitude: number; longitude: number }) => {
      const from = fromPosition || { latitude: 0, longitude: 0 };
      const to = { latitude, longitude };

      // Perform the update
      await updatePinFn(pinId, latitude, longitude);

      // Add history entry
      addHistory({
        type: "pin",
        description: `Moved pin`,
        undo: async () => {
          await updatePinFn(pinId, from.latitude, from.longitude);
        },
        redo: async () => {
          await updatePinFn(pinId, to.latitude, to.longitude);
        },
        metadata: {
          affectedIds: [pinId],
        },
      });
    },
    [updatePinFn, addHistory]
  );
}

/**
 * Hook that wraps general pin updates with history tracking
 *
 * @param updatePinFn - The actual update pin function
 * @returns A function that updates a pin and tracks history
 */
export function useUpdatePinWithHistory(
  updatePinFn: (data: unknown) => Promise<Pin | null>
) {
  const addHistory = useHistoryStore((state) => state.addHistory);

  return useCallback(
    async (data: unknown & { id: string } & Partial<Pin>, previousData?: Partial<Pin>) => {
      const pinId = data.id;
      const changes = { ...data };

      const result = await updatePinFn(data);

      if (result && previousData) {
        addHistory({
          type: "pin",
          description: `Updated pin: ${result.title || "Untitled"}`,
          undo: async () => {
            await updatePinFn({ id: pinId, ...previousData });
          },
          redo: async () => {
            await updatePinFn(changes);
          },
          metadata: {
            worldId: result.gameWorldId,
            affectedIds: [pinId],
          },
        });
      }

      return result;
    },
    [updatePinFn, addHistory]
  );
}

// ============== Layer History Hooks ==============

/**
 * Hook that wraps layer creation with history tracking
 */
export function useCreateLayerWithHistory(
  createLayerFn: (worldId: string, data: unknown) => Promise<MapLayer | null>,
  deleteLayerFn?: (layerId: string) => Promise<void>
) {
  const addHistory = useHistoryStore((state) => state.addHistory);

  return useCallback(
    async (worldId: string, data: unknown) => {
      const result = await createLayerFn(worldId, data);

      if (result) {
        addHistory({
          type: "layer",
          description: `Created layer: ${result.name}`,
          undo: async () => {
            if (deleteLayerFn) {
              await deleteLayerFn(result.id);
            }
          },
          redo: async () => {
            await createLayerFn(worldId, data);
          },
          metadata: {
            worldId,
            affectedIds: [result.id],
          },
        });
      }

      return result;
    },
    [createLayerFn, deleteLayerFn, addHistory]
  );
}

/**
 * Hook that wraps layer deletion with history tracking
 */
export function useDeleteLayerWithHistory(
  deleteLayerFn: (layerId: string) => Promise<MapLayer | null>,
  createLayerFn?: (worldId: string, data: unknown) => Promise<MapLayer | null>
) {
  const addHistory = useHistoryStore((state) => state.addHistory);

  return useCallback(
    async (layerId: string, layerData?: MapLayer) => {
      const deletedLayer = await deleteLayerFn(layerId);

      const layerToDelete = layerData || deletedLayer;

      if (layerToDelete) {
        addHistory({
          type: "layer",
          description: `Deleted layer: ${layerToDelete.name}`,
          undo: async () => {
            if (createLayerFn && layerToDelete) {
              await createLayerFn(layerToDelete.gameWorldId, layerToDelete);
            }
          },
          redo: async () => {
            await deleteLayerFn(layerId);
          },
          metadata: {
            worldId: layerToDelete.gameWorldId,
            affectedIds: [layerId],
          },
        });
      }

      return deletedLayer;
    },
    [deleteLayerFn, createLayerFn, addHistory]
  );
}

/**
 * Hook that wraps layer reordering with history tracking
 */
export function useReorderLayersWithHistory(
  reorderFn: (updates: Array<{ id: string; zIndex: number }>) => Promise<void>
) {
  const addHistory = useHistoryStore((state) => state.addHistory);

  return useCallback(
    async (updates: Array<{ id: string; zIndex: number }>, previousOrder?: Array<{ id: string; zIndex: number }>) => {
      await reorderFn(updates);

      if (previousOrder) {
        addHistory({
          type: "layer",
          description: `Reordered layers`,
          undo: async () => {
            await reorderFn(previousOrder);
          },
          redo: async () => {
            await reorderFn(updates);
          },
          metadata: {
            affectedIds: updates.map((u) => u.id),
          },
        });
      }
    },
    [reorderFn, addHistory]
  );
}

// ============== Region History Hooks ==============

/**
 * Hook that wraps region creation with history tracking
 */
export function useCreateRegionWithHistory(
  createRegionFn: (layerId: string, data: unknown) => Promise<Region | null>,
  deleteRegionFn?: (regionId: string) => Promise<boolean>
) {
  const addHistory = useHistoryStore((state) => state.addHistory);

  return useCallback(
    async (layerId: string, data: unknown) => {
      const result = await createRegionFn(layerId, data);

      if (result) {
        addHistory({
          type: "region",
          description: `Created region: ${result.name}`,
          undo: async () => {
            if (deleteRegionFn) {
              await deleteRegionFn(result.id);
            }
          },
          redo: async () => {
            await createRegionFn(layerId, data);
          },
          metadata: {
            worldId: result.gameWorldId,
            affectedIds: [result.id],
          },
        });
      }

      return result;
    },
    [createRegionFn, deleteRegionFn, addHistory]
  );
}

/**
 * Hook that wraps region deletion with history tracking
 */
export function useDeleteRegionWithHistory(
  deleteRegionFn: (regionId: string) => Promise<boolean>,
  createRegionFn?: (layerId: string, data: unknown) => Promise<Region | null>
) {
  const addHistory = useHistoryStore((state) => state.addHistory);

  return useCallback(
    async (regionId: string, regionData?: Region, layerId?: string) => {
      const success = await deleteRegionFn(regionId);

      if (success && regionData) {
        addHistory({
          type: "region",
          description: `Deleted region: ${regionData.name}`,
          undo: async () => {
            if (createRegionFn && layerId && regionData) {
              await createRegionFn(layerId, regionData);
            }
          },
          redo: async () => {
            await deleteRegionFn(regionId);
          },
          metadata: {
            worldId: regionData.gameWorldId,
            affectedIds: [regionId],
          },
        });
      }

      return success;
    },
    [deleteRegionFn, createRegionFn, addHistory]
  );
}

/**
 * Hook that wraps region position updates with history tracking
 */
export function useUpdateRegionPositionWithHistory(
  updatePositionFn: (regionId: string, coordinates: unknown) => Promise<void>
) {
  const addHistory = useHistoryStore((state) => state.addHistory);

  return useCallback(
    async (
      regionId: string,
      coordinates: unknown,
      previousCoordinates?: unknown,
      regionName?: string
    ) => {
      const from = previousCoordinates || coordinates;
      const to = coordinates;

      await updatePositionFn(regionId, coordinates);

      if (previousCoordinates) {
        addHistory({
          type: "region",
          description: `Moved region: ${regionName || "Unknown"}`,
          undo: async () => {
            await updatePositionFn(regionId, from);
          },
          redo: async () => {
            await updatePositionFn(regionId, to);
          },
          metadata: {
            affectedIds: [regionId],
          },
        });
      }
    },
    [updatePositionFn, addHistory]
  );
}

// ============== Batch Operations ==============

/**
 * Hook that wraps batch pin operations with history tracking
 */
export function useBatchPinsWithHistory(
  batchFn: (updates: unknown[]) => Promise<void>
) {
  const addHistory = useHistoryStore((state) => state.addHistory);

  return useCallback(
    async (updates: unknown[], previousData?: unknown[]) => {
      await batchFn(updates);

      if (previousData) {
        addHistory({
          type: "batch",
          description: `Batch updated ${updates.length} pins`,
          undo: async () => {
            // Restore previous state
          },
          redo: async () => {
            await batchFn(updates);
          },
          metadata: {
            batch: true,
          },
        });
      }
    },
    [batchFn, addHistory]
  );
}
