import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Pin } from "@prisma/client";
import { createPin as createPinAction, deletePin as deletePinAction, updatePin as updatePinAction } from "@/actions/pins";
import { usePinsFilterStore } from "./use-pins-filter-store";

/**
 * Data Store - Manages pin data and server synchronization
 *
 * This store handles:
 * - Pin data storage
 * - CRUD operations (local state)
 * - Server sync with optimistic updates
 * - Loading and error states
 *
 * Data is NOT persisted (comes from server)
 */

interface PinDataState {
  pins: Pin[];
  isLoading: boolean;
  error: string | null;
}

interface PinDataActions {
  setPins: (pins: Pin[]) => void;
  addPin: (pin: Pin) => void;
  updatePin: (pinId: string, updates: Partial<Pin>) => void;
  deletePin: (pinId: string) => void;
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

      reset: () => set(initialState),

      // Server sync methods with optimistic updates
      createPin: async (data) => {
        console.log("[PinsDataStore.createPin] === CREATE PIN START ===");
        console.log("[PinsDataStore.createPin] Input data:", data);
        console.log("[PinsDataStore.createPin] Current pins count:", get().pins.length);

        try {
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

          console.log("[PinsDataStore.createPin] Creating optimistic pin:", optimisticPin);
          get().addPin(optimisticPin);
          console.log("[PinsDataStore.createPin] Optimistic pin added. Pins count:", get().pins.length);

          // Server call
          console.log("[PinsDataStore.createPin] Calling server action...");
          const result = await createPinAction(data);
          console.log("[PinsDataStore.createPin] Server response:", result);

          if (!result.success) {
            throw new Error(result.error.message);
          }

          // Replace optimistic pin with real one
          set((state) => {
            const updatedPins = state.pins.map((p) =>
              p.id === tempId ? { ...result.data.pin, gameWorldId: data.gameWorldId } as Pin : p
            );
            console.log("[PinsDataStore.createPin] Replaced temp pin with real pin. Pins count:", updatedPins.length);
            return { pins: updatedPins };
          });

          // Re-apply filters after replacement
          const applyFilters = usePinsFilterStore.getState().applyFilters;
          console.log("[PinsDataStore.createPin] Re-applying filters...");
          applyFilters(get().pins);
          console.log("[PinsDataStore.createPin] ✅ CREATE PIN COMPLETE");
        } catch (error) {
          console.error("[PinsDataStore.createPin] ❌ Failed to create pin:", error);
          get().setError(error instanceof Error ? error.message : "Failed to create pin");
          throw error;
        }
      },

      deletePinServer: async (pinId) => {
        try {
          // Optimistic update - remove from store
          const pinToDelete = get().pins.find((p) => p.id === pinId);
          if (!pinToDelete) {
            throw new Error("Pin not found");
          }

          get().deletePin(pinId);

          // Server call
          await deletePinAction(pinId);
        } catch (error) {
          console.error("[PinsDataStore] Failed to delete pin:", error);
          get().setError(error instanceof Error ? error.message : "Failed to delete pin");
          throw error;
        }
      },

      updatePinServer: async (data) => {
        try {
          // Optimistic update - update in store
          get().updatePin(data.id, data as Partial<Pin>);

          // Server call
          await updatePinAction(data);
        } catch (error) {
          console.error("[PinsDataStore] Failed to update pin:", error);
          get().setError(error instanceof Error ? error.message : "Failed to update pin");
          throw error;
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

// Action hooks
export const useSetPins = () => usePinsDataStore((state) => state.setPins);
export const useAddPin = () => usePinsDataStore((state) => state.addPin);
export const useUpdatePin = () => usePinsDataStore((state) => state.updatePin);
export const useDeletePin = () => usePinsDataStore((state) => state.deletePin);

// Server sync hooks
export const useCreatePin = () => usePinsDataStore((state) => state.createPin);
export const useDeletePinServer = () => usePinsDataStore((state) => state.deletePinServer);
export const useUpdatePinServer = () => usePinsDataStore((state) => state.updatePinServer);
