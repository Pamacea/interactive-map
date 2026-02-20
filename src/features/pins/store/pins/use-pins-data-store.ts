import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Pin } from "@prisma/client";
import { createPin as createPinAction, deletePin as deletePinAction, updatePin as updatePinAction } from "@/features/pins/actions";
import { usePinsFilterStore } from "./use-pins-filter-store";
import { useHistoryStore } from "@/features/world-editor/store/history-store";

/**
 * Data Store - Manages pin data and server synchronization
 *
 * This store handles:
 * - Pin data storage
 * - CRUD operations (local state)
 * - Server sync with optimistic updates
 * - Loading and error states
 * - Layer-based filtering
 *
 * Data is NOT persisted (comes from server)
 */

interface PinDataState {
  pins: Pin[];
  isLoading: boolean;
  error: string | null;
  activeLayerId: string | null; // Currently active layer for filtering
}

interface PinDataActions {
  setPins: (pins: Pin[]) => void;
  addPin: (pin: Pin) => void;
  updatePin: (pinId: string, updates: Partial<Pin>) => void;
  deletePin: (pinId: string) => void;
  setActiveLayerId: (layerId: string | null) => void;
  getPinsByLayer: (layerId: string) => Pin[];
  createPin: (data: Parameters<typeof createPinAction>[0]) => Promise<void>;
  deletePinServer: (pinId: string) => Promise<void>;
  updatePinServer: (data: Parameters<typeof updatePinAction>[0]) => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type PinDataStore = PinDataState & PinDataActions;

const initialState: PinDataState = {
  pins: [],
  isLoading: false,
  error: null,
  activeLayerId: null,
};

export const usePinsDataStore = create<PinDataStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setPins: (pins) => {
        // Update data store
        set({ pins });

        // Re-apply filters in filter store
        const applyFilters = usePinsFilterStore.getState().applyFilters;
        applyFilters(pins);
      },

      setActiveLayerId: (layerId) => set({ activeLayerId: layerId }),

      getPinsByLayer: (layerId) => {
        const { pins } = get();
        return pins.filter((pin) => pin.layerId === layerId);
      },

      addPin: (pin) => {
        set((state) => {
          const newPins = [...state.pins, pin];

          // Re-apply filters
          const applyFilters = usePinsFilterStore.getState().applyFilters;
          applyFilters(newPins);

          return { pins: newPins };
        });
      },

      updatePin: (pinId, updates) => {
        set((state) => {
          const newPins = state.pins.map((pin) =>
            pin.id === pinId ? { ...pin, ...updates } : pin
          );

          // Re-apply filters
          const applyFilters = usePinsFilterStore.getState().applyFilters;
          applyFilters(newPins);

          return { pins: newPins };
        });
      },

      deletePin: (pinId) => {
        set((state) => {
          const newPins = state.pins.filter((pin) => pin.id !== pinId);

          // Re-apply filters
          const applyFilters = usePinsFilterStore.getState().applyFilters;
          applyFilters(newPins);

          return { pins: newPins };
        });
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      reset: () => set({ ...initialState, activeLayerId: null }),

      // Server sync methods with optimistic updates
      createPin: async (data, options?: { trackHistory?: boolean }) => {
        const { trackHistory = true } = options || {};

        // Optimistic update - add pin with temporary ID
        const tempId = `temp-${Date.now()}`;
        const optimisticPin: Pin = {
          ...data,
          id: tempId,
          createdAt: new Date(),
          updatedAt: new Date(),
          isVisible: data.isVisible ?? true,
          opacity: data.opacity ?? 1,
          size: data.size ?? 32,
          minZoom: 0,
          maxZoom: 200,
        } as Pin;

        get().addPin(optimisticPin);

        // Server call
        const _result = await createPinAction(data);

        // Roll back on failure
        if (!result.success) {
          get().deletePin(tempId);
          get().setError(result.error.message);
          throw new Error(result.error.message);
        }

        const createdPin = { ...result.data.pin, gameWorldId: data.gameWorldId } as Pin;

        // Replace optimistic pin with real one
        set((state) => {
          const updatedPins = state.pins.map((p) =>
            p.id === tempId ? createdPin : p
          );
          return { pins: updatedPins };
        });

        // Re-apply filters after replacement
        const applyFilters = usePinsFilterStore.getState().applyFilters;
        applyFilters(get().pins);

        // Add history entry for undo
        if (trackHistory && !useHistoryStore.getState().isExecuting) {
          const addHistory = useHistoryStore.getState().addHistory;
          const pinId = createdPin.id;
          const _pinData = { ...createdPin };
          const _worldId = data.gameWorldId;

          addHistory({
            type: "pin",
            description: `Created pin: ${createdPin.title || "Untitled"}`,
            undo: async () => {
              // Delete the pin to undo
              await deletePinAction(pinId);
              // Update local store
              get().deletePin(pinId);
            },
            redo: async () => {
              // Recreate the pin
              const redoResult = await createPinAction(data);
              if (redoResult.success) {
                get().addPin({ ...redoResult.data.pin, gameWorldId: worldId } as Pin);
              }
            },
            metadata: {
              worldId,
              affectedIds: [pinId],
            },
          });
        }

        return createdPin;
      },

      deletePinServer: async (pinId, options?: { trackHistory?: boolean }) => {
        const { trackHistory = true } = options || {};

        // Optimistic update - remove from store
        const pinToDelete = get().pins.find((p) => p.id === pinId);
        if (!pinToDelete) {
          throw new Error("Pin not found");
        }

        // Capture pin data for history before deleting
        const _pinData = { ...pinToDelete };

        get().deletePin(pinId);

        // Server call
        const _result = await deletePinAction(pinId);

        // Roll back on failure
        if (!result.success) {
          get().addPin(pinToDelete);
          get().setError(result.error.message);
          throw new Error(result.error.message);
        }

        // Add history entry for undo
        if (trackHistory && !useHistoryStore.getState().isExecuting) {
          const addHistory = useHistoryStore.getState().addHistory;
          const _worldId = pinData.gameWorldId;

          addHistory({
            type: "pin",
            description: `Deleted pin: ${pinData.title || "Untitled"}`,
            undo: async () => {
              // Recreate the pin to undo
              const createData = {
                gameWorldId: worldId,
                title: pinData.title,
                description: pinData.description,
                pinType: pinData.pinType,
                latitude: pinData.latitude,
                longitude: pinData.longitude,
                icon: pinData.icon,
                color: pinData.color,
                size: pinData.size,
                opacity: pinData.opacity,
                isVisible: pinData.isVisible,
                layerId: pinData.layerId,
              };
              const redoResult = await createPinAction(createData);
              if (redoResult.success) {
                get().addPin({ ...redoResult.data.pin, gameWorldId: worldId } as Pin);
              }
            },
            redo: async () => {
              // Delete the pin again
              await deletePinAction(pinId);
              get().deletePin(pinId);
            },
            metadata: {
              worldId,
              affectedIds: [pinId],
            },
          });
        }
      },

      updatePinServer: async (data, options?: { trackHistory?: boolean }) => {
        const { trackHistory = true } = options || {};

        // Optimistic update - update in store
        const pinBeforeUpdate = get().pins.find((p) => p.id === data.id);
        if (!pinBeforeUpdate) {
          throw new Error("Pin not found");
        }

        // Capture previous state for history
        const previousState = { ...pinBeforeUpdate };

        get().updatePin(data.id, data as Partial<Pin>);

        // Server call
        const _result = await updatePinAction(data);

        // Roll back on failure
        if (!result.success) {
          get().updatePin(data.id, pinBeforeUpdate);
          get().setError(result.error.message);
          throw new Error(result.error.message);
        }

        // Add history entry for undo (only if there are actual changes)
        if (trackHistory && !useHistoryStore.getState().isExecuting) {
          const hasChanges = Object.keys(data).some(
            (key) => key !== "id" && data[key as keyof typeof data] !== previousState[key as keyof Pin]
          );

          if (hasChanges) {
            const addHistory = useHistoryStore.getState().addHistory;
            const pinId = data.id;
            const updateData = { ...data };

            addHistory({
              type: "pin",
              description: `Updated pin: ${previousState.title || "Untitled"}`,
              undo: async () => {
                // Restore previous state
                await updatePinAction({ id: pinId, ...previousState } as Parameters<typeof updatePinAction>[0]);
                get().updatePin(pinId, previousState);
              },
              redo: async () => {
                // Re-apply the update
                await updatePinAction(updateData as Parameters<typeof updatePinAction>[0]);
                get().updatePin(pinId, updateData as Partial<Pin>);
              },
              metadata: {
                worldId: previousState.gameWorldId,
                affectedIds: [pinId],
              },
            });
          }
        }
      },
    }),
    {
      name: "pins-data-store",
    }
  )
);

// Selector hooks for optimized re-renders
export const usePins = () => usePinsDataStore((state) => state.pins);
export const usePinById = (pinId: string) =>
  usePinsDataStore((state) => state.pins.find((pin) => pin.id === pinId));
export const usePinsLoading = () => usePinsDataStore((state) => state.isLoading);
export const usePinsError = () => usePinsDataStore((state) => state.error);
export const useActiveLayerId = () => usePinsDataStore((state) => state.activeLayerId);
export const usePinsByActiveLayer = () =>
  usePinsDataStore((state) => {
    if (!state.activeLayerId) return state.pins;
    return state.pins.filter((pin) => pin.layerId === state.activeLayerId);
  });

// Action hooks
export const useSetPins = () => usePinsDataStore((state) => state.setPins);
export const useAddPin = () => usePinsDataStore((state) => state.addPin);
export const useUpdatePin = () => usePinsDataStore((state) => state.updatePin);
export const useDeletePin = () => usePinsDataStore((state) => state.deletePin);
export const useSetActiveLayerId = () => usePinsDataStore((state) => state.setActiveLayerId);
export const useGetPinsByLayer = () => usePinsDataStore((state) => state.getPinsByLayer);

// Server sync hooks
export const useCreatePin = () => usePinsDataStore((state) => state.createPin);
export const useDeletePinServer = () => usePinsDataStore((state) => state.deletePinServer);
export const useUpdatePinServer = () => usePinsDataStore((state) => state.updatePinServer);
