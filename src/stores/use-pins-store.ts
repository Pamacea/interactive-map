import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Pin, PinType } from "@prisma/client";
import { createPin as createPinAction, deletePin as deletePinAction, updatePin as updatePinAction } from "@/actions/pins";
import { PinTypeEnum } from "@/types/pin.type";

// UI State for pin interactions
export interface PinUIState {
  selectedPinId: string | null;
  isCreating: boolean;
  isEditing: boolean;
  hoverPinId: string | null;
}

// Filter state for pins - using Record<PinTypeEnum, boolean> approach
export interface PinFilters {
  searchTerm: string;
  pinTypeFilters: Record<PinTypeEnum, boolean>;
  layerIds: string[];
  showVisibleOnly: boolean;
}

// Pin data stored in client state (synced with server)
interface PinDataState {
  pins: Pin[];
  filteredPins: Pin[];
  isLoading: boolean;
  error: string | null;
}

interface PinsStore extends PinUIState, PinFilters, PinDataState {
  // Selection state
  selectPin: (pinId: string | null) => void;
  clearSelection: () => void;

  // Creation/editing state
  startCreating: () => void;
  stopCreating: () => void;
  startEditing: () => void;
  stopEditing: () => void;

  // Hover state
  setHoverPin: (pinId: string | null) => void;

  // Pin CRUD operations (local state)
  setPins: (pins: Pin[]) => void;
  addPin: (pin: Pin) => void;
  updatePin: (pinId: string, updates: Partial<Pin>) => void;
  deletePin: (pinId: string) => void;

  // Pin CRUD operations (server sync with optimistic updates)
  createPin: (data: Parameters<typeof createPinAction>[0]) => Promise<void>;
  deletePinServer: (pinId: string) => Promise<void>;
  updatePinServer: (data: Parameters<typeof updatePinAction>[0]) => Promise<void>;

  // Filter actions
  setSearchTerm: (term: string) => void;
  setPinTypeFilter: (pinType: PinTypeEnum, value: boolean) => void;
  togglePinTypeFilter: (pinType: PinTypeEnum) => void;
  showAllPinTypes: () => void;
  hideAllPinTypes: () => void;
  setLayerIds: (layerIds: string[]) => void;
  toggleLayerId: (layerId: string) => void;
  toggleShowVisibleOnly: () => void;
  resetFilters: () => void;
  applyFilters: () => void;
  getVisiblePinTypes: () => PinTypeEnum[];

  // Loading and error state
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Reset all
  reset: () => void;
}

// Helper function to create default pin type filters
const createDefaultPinTypeFilters = (): Record<PinTypeEnum, boolean> => ({
  [PinTypeEnum.CITY]: true,
  [PinTypeEnum.VILLAGE]: true,
  [PinTypeEnum.POI]: true,
  [PinTypeEnum.CHARACTER]: true,
  [PinTypeEnum.DUNGEON]: true,
  [PinTypeEnum.SHOP]: true,
  [PinTypeEnum.QUEST]: true,
  [PinTypeEnum.TREASURE]: true,
  [PinTypeEnum.CUSTOM]: true,
});

const initialState: PinUIState & PinFilters & PinDataState = {
  // UI State
  selectedPinId: null,
  isCreating: false,
  isEditing: false,
  hoverPinId: null,

  // Filters
  searchTerm: "",
  pinTypeFilters: createDefaultPinTypeFilters(),
  layerIds: [],
  showVisibleOnly: false,

  // Pin data
  pins: [],
  filteredPins: [],
  isLoading: false,
  error: null,
};

// Helper function to apply filters
const filterPins = (
  pins: Pin[],
  searchTerm: string,
  pinTypeFilters: Record<PinTypeEnum, boolean>,
  layerIds: string[],
  showVisibleOnly: boolean
): Pin[] => {
  return pins.filter((pin) => {
    // Search term filter
    if (searchTerm && !pin.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Pin type filter - check if type is explicitly set to false
    if (pinTypeFilters[pin.pinType as PinTypeEnum] === false) {
      return false;
    }

    // Layer filter
    if (layerIds.length > 0 && pin.layerId && !layerIds.includes(pin.layerId)) {
      return false;
    }

    // Visibility filter
    if (showVisibleOnly && !pin.isVisible) {
      return false;
    }

    return true;
  });
};

export const usePinsStore = create<PinsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Selection actions
        selectPin: (pinId) => set({ selectedPinId: pinId }),

        clearSelection: () => set({ selectedPinId: null }),

        // Creation/editing actions
        startCreating: () => set({ isCreating: true, selectedPinId: null }),

        stopCreating: () => set({ isCreating: false }),

        startEditing: () => set({ isEditing: true }),

        stopEditing: () => set({ isEditing: false }),

        // Hover action
        setHoverPin: (pinId) => set({ hoverPinId: pinId }),

        // Pin CRUD operations
        setPins: (pins) => {
          const state = get();
          const filtered = filterPins(
            pins,
            state.searchTerm,
            state.pinTypeFilters,
            state.layerIds,
            state.showVisibleOnly
          );
          set({ pins, filteredPins: filtered });
        },

        addPin: (pin) => {
          set((state) => {
            const newPins = [...state.pins, pin];
            const filtered = filterPins(
              newPins,
              state.searchTerm,
              state.pinTypeFilters,
              state.layerIds,
              state.showVisibleOnly
            );
            return { pins: newPins, filteredPins: filtered };
          });
        },

        updatePin: (pinId, updates) => {
          set((state) => {
            const newPins = state.pins.map((pin) =>
              pin.id === pinId ? { ...pin, ...updates } : pin
            );
            const filtered = filterPins(
              newPins,
              state.searchTerm,
              state.pinTypeFilters,
              state.layerIds,
              state.showVisibleOnly
            );
            return { pins: newPins, filteredPins: filtered };
          });
        },

        deletePin: (pinId) => {
          set((state) => {
            const newPins = state.pins.filter((pin) => pin.id !== pinId);
            const filtered = filterPins(
              newPins,
              state.searchTerm,
              state.pinTypeFilters,
              state.layerIds,
              state.showVisibleOnly
            );
            // Clear selection if deleted pin was selected
            const newSelectedPinId =
              state.selectedPinId === pinId ? null : state.selectedPinId;
            return {
              pins: newPins,
              filteredPins: filtered,
              selectedPinId: newSelectedPinId,
            };
          });
        },

        // Filter actions
        setSearchTerm: (term) =>
          set((state) => {
            const filtered = filterPins(
              state.pins,
              term,
              state.pinTypeFilters,
              state.layerIds,
              state.showVisibleOnly
            );
            return { searchTerm: term, filteredPins: filtered };
          }),

        setPinTypeFilter: (pinType, value) =>
          set((state) => {
            const newFilters = {
              ...state.pinTypeFilters,
              [pinType]: value,
            };
            const filtered = filterPins(
              state.pins,
              state.searchTerm,
              newFilters,
              state.layerIds,
              state.showVisibleOnly
            );
            return { pinTypeFilters: newFilters, filteredPins: filtered };
          }),

        togglePinTypeFilter: (pinType) =>
          set((state) => {
            const newFilters = {
              ...state.pinTypeFilters,
              [pinType]: !state.pinTypeFilters[pinType],
            };
            const filtered = filterPins(
              state.pins,
              state.searchTerm,
              newFilters,
              state.layerIds,
              state.showVisibleOnly
            );
            return { pinTypeFilters: newFilters, filteredPins: filtered };
          }),

        showAllPinTypes: () =>
          set((state) => {
            const newFilters = createDefaultPinTypeFilters();
            const filtered = filterPins(
              state.pins,
              state.searchTerm,
              newFilters,
              state.layerIds,
              state.showVisibleOnly
            );
            return { pinTypeFilters: newFilters, filteredPins: filtered };
          }),

        hideAllPinTypes: () =>
          set((state) => {
            const newFilters = Object.fromEntries(
              Object.entries(createDefaultPinTypeFilters()).map(([key]) => [key, false])
            ) as Record<PinTypeEnum, boolean>;
            const filtered = filterPins(
              state.pins,
              state.searchTerm,
              newFilters,
              state.layerIds,
              state.showVisibleOnly
            );
            return { pinTypeFilters: newFilters, filteredPins: filtered };
          }),

        setLayerIds: (layerIds) =>
          set((state) => {
            const filtered = filterPins(
              state.pins,
              state.searchTerm,
              state.pinTypeFilters,
              layerIds,
              state.showVisibleOnly
            );
            return { layerIds, filteredPins: filtered };
          }),

        toggleLayerId: (layerId) =>
          set((state) => {
            const newLayerIds = state.layerIds.includes(layerId)
              ? state.layerIds.filter((id) => id !== layerId)
              : [...state.layerIds, layerId];
            const filtered = filterPins(
              state.pins,
              state.searchTerm,
              state.pinTypeFilters,
              newLayerIds,
              state.showVisibleOnly
            );
            return { layerIds: newLayerIds, filteredPins: filtered };
          }),

        toggleShowVisibleOnly: () =>
          set((state) => {
            const newShowVisibleOnly = !state.showVisibleOnly;
            const filtered = filterPins(
              state.pins,
              state.searchTerm,
              state.pinTypeFilters,
              state.layerIds,
              newShowVisibleOnly
            );
            return { showVisibleOnly: newShowVisibleOnly, filteredPins: filtered };
          }),

        resetFilters: () =>
          set((state) => {
            const newFilters = createDefaultPinTypeFilters();
            const filtered = filterPins(state.pins, "", newFilters, [], false);
            return {
              searchTerm: "",
              pinTypeFilters: newFilters,
              layerIds: [],
              showVisibleOnly: false,
              filteredPins: filtered,
            };
          }),

        applyFilters: () =>
          set((state) => {
            const filtered = filterPins(
              state.pins,
              state.searchTerm,
              state.pinTypeFilters,
              state.layerIds,
              state.showVisibleOnly
            );
            return { filteredPins: filtered };
          }),

        getVisiblePinTypes: () => {
          const state = get();
          return Object.entries(state.pinTypeFilters)
            .filter(([, visible]) => visible)
            .map(([type]) => type as PinTypeEnum);
        },

        // Loading and error actions
        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error }),

        // Reset all
        reset: () => set(initialState),

        // Server sync methods with optimistic updates
        createPin: async (data) => {
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

            get().addPin(optimisticPin);

            // Server call
            const result = await createPinAction(data);

            // Replace optimistic pin with real one
            set((state) => ({
              pins: state.pins.map((p) =>
                p.id === tempId ? { ...result.pin, gameWorldId: data.gameWorldId } : p
              ),
              filteredPins: state.filteredPins.map((p) =>
                p.id === tempId ? { ...result.pin, gameWorldId: data.gameWorldId } : p
              ),
            }));
          } catch (error) {
            console.error("[PinsStore] Failed to create pin:", error);
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
            console.error("[PinsStore] Failed to delete pin:", error);
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
            console.error("[PinsStore] Failed to update pin:", error);
            get().setError(error instanceof Error ? error.message : "Failed to update pin");
            throw error;
          }
        },
      }),
      {
        name: "pins-storage",
        // Only persist UI state and filters, not the actual pins (those come from server)
        partialize: (state) => ({
          selectedPinId: state.selectedPinId,
          isCreating: state.isCreating,
          isEditing: state.isEditing,
          searchTerm: state.searchTerm,
          pinTypeFilters: state.pinTypeFilters,
          layerIds: state.layerIds,
          showVisibleOnly: state.showVisibleOnly,
        }),
      }
    ),
    {
      name: "pins-store",
    }
  )
);

// Selector hooks for optimized re-renders

// UI State selectors
export const useSelectedPinId = () => usePinsStore((state) => state.selectedPinId);
export const useIsCreatingPin = () => usePinsStore((state) => state.isCreating);
export const useIsEditingPin = () => usePinsStore((state) => state.isEditing);
export const useHoverPinId = () => usePinsStore((state) => state.hoverPinId);

// Pin data selectors
export const usePins = () => usePinsStore((state) => state.pins);
export const useFilteredPins = () => usePinsStore((state) => state.filteredPins);
export const usePinById = (pinId: string) =>
  usePinsStore((state) => state.pins.find((pin) => pin.id === pinId));
export const useSelectedPin = () =>
  usePinsStore((state) =>
    state.selectedPinId
      ? state.pins.find((pin) => pin.id === state.selectedPinId)
      : null
  );

// Filter selectors
export const usePinFilters = () =>
  usePinsStore((state) => ({
    searchTerm: state.searchTerm,
    pinTypeFilters: state.pinTypeFilters,
    layerIds: state.layerIds,
    showVisibleOnly: state.showVisibleOnly,
  }));

export const usePinTypeFilters = () =>
  usePinsStore((state) => state.pinTypeFilters);

export const useVisiblePinTypes = () =>
  usePinsStore((state) => {
    return Object.entries(state.pinTypeFilters)
      .filter(([, visible]) => visible)
      .map(([type]) => type as PinTypeEnum);
  });

export const useSearchTerm = () => usePinsStore((state) => state.searchTerm);
export const useLayerIds = () => usePinsStore((state) => state.layerIds);
export const useShowVisibleOnly = () => usePinsStore((state) => state.showVisibleOnly);

// Loading state selectors
export const usePinsLoading = () => usePinsStore((state) => state.isLoading);
export const usePinsError = () => usePinsStore((state) => state.error);

// Action selectors - these return stable function references (never change)
// We can use the pattern: usePinsStore((state) => state.actionName)

// For best performance, components should destructure these individually
// Example: const selectPin = useSelectPin();

export const useSetPins = () => usePinsStore((state) => state.setPins);
export const useAddPin = () => usePinsStore((state) => state.addPin);
export const useUpdatePin = () => usePinsStore((state) => state.updatePin);
export const useDeletePin = () => usePinsStore((state) => state.deletePin);

// Server sync hooks
export const useCreatePin = () => usePinsStore((state) => state.createPin);
export const useDeletePinServer = () => usePinsStore((state) => state.deletePinServer);
export const useUpdatePinServer = () => usePinsStore((state) => state.updatePinServer);

export const useSelectPin = () => usePinsStore((state) => state.selectPin);
export const useClearSelection = () => usePinsStore((state) => state.clearSelection);
export const useStartCreating = () => usePinsStore((state) => state.startCreating);
export const useStopCreating = () => usePinsStore((state) => state.stopCreating);
export const useStartEditing = () => usePinsStore((state) => state.startEditing);
export const useStopEditing = () => usePinsStore((state) => state.stopEditing);
export const useSetHoverPin = () => usePinsStore((state) => state.setHoverPin);

// Filter action hooks
export const useSetSearchTerm = () => usePinsStore((state) => state.setSearchTerm);
export const useSetPinTypeFilter = () => usePinsStore((state) => state.setPinTypeFilter);
export const useTogglePinTypeFilter = () => usePinsStore((state) => state.togglePinTypeFilter);
export const useShowAllPinTypes = () => usePinsStore((state) => state.showAllPinTypes);
export const useHideAllPinTypes = () => usePinsStore((state) => state.hideAllPinTypes);
export const useSetLayerIds = () => usePinsStore((state) => state.setLayerIds);
export const useToggleLayerId = () => usePinsStore((state) => state.toggleLayerId);
export const useToggleShowVisibleOnly = () => usePinsStore((state) => state.toggleShowVisibleOnly);
export const useResetFilters = () => usePinsStore((state) => state.resetFilters);
export const useApplyFilters = () => usePinsStore((state) => state.applyFilters);
export const useGetVisiblePinTypes = () => usePinsStore((state) => state.getVisiblePinTypes);

// Convenience hook to check if a specific pin type is visible
export const useIsPinTypeVisible = (pinType: PinTypeEnum): boolean => {
  const pinTypeFilters = usePinTypeFilters();
  return pinTypeFilters[pinType] ?? true;
};

// Convenience hook to check if all pin types are visible
export const useShowAllPinTypesValue = (): boolean => {
  const pinTypeFilters = usePinTypeFilters();
  return Object.values(pinTypeFilters).every((value) => value === true);
};
