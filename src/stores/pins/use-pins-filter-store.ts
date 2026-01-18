import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Pin } from "@prisma/client";
import { PinType } from "@/types/pin.type";

/**
 * Filter Store - Manages pin filtering state and logic
 *
 * This store handles:
 * - Search term filtering
 * - Pin type visibility toggles
 * - Layer filtering
 * - Visibility filtering
 * - Filtered pins computation
 *
 * Filter state is persisted to localStorage
 */

export interface PinFilters {
  searchTerm: string;
  pinTypeFilters: Record<(typeof PinType)[keyof typeof PinType], boolean>;
  layerIds: string[];
  showVisibleOnly: boolean;
}

interface PinFilterActions {
  setSearchTerm: (term: string) => void;
  setPinTypeFilter: (pinType: (typeof PinType)[keyof typeof PinType], value: boolean) => void;
  togglePinTypeFilter: (pinType: (typeof PinType)[keyof typeof PinType]) => void;
  showAllPinTypes: () => void;
  hideAllPinTypes: () => void;
  setLayerIds: (layerIds: string[]) => void;
  toggleLayerId: (layerId: string) => void;
  toggleShowVisibleOnly: () => void;
  resetFilters: () => void;
  applyFilters: (pins: Pin[]) => Pin[];
  getVisiblePinTypes: () => (typeof PinType)[keyof typeof PinType][];
  reset: () => void;
}

type PinFilterStore = PinFilters & {
  filteredPins: Pin[];
} & PinFilterActions;

// Helper function to create default pin type filters
const createDefaultPinTypeFilters = (): Record<(typeof PinType)[keyof typeof PinType], boolean> => ({
  [PinType.CITY]: true,
  [PinType.VILLAGE]: true,
  [PinType.POI]: true,
  [PinType.CHARACTER]: true,
  [PinType.DUNGEON]: true,
  [PinType.SHOP]: true,
  [PinType.QUEST]: true,
  [PinType.TREASURE]: true,
  [PinType.CUSTOM]: true,
});

const initialState: PinFilters = {
  searchTerm: "",
  pinTypeFilters: createDefaultPinTypeFilters(),
  layerIds: [],
  showVisibleOnly: false,
};

// Helper function to apply filters
const filterPins = (
  pins: Pin[],
  searchTerm: string,
  pinTypeFilters: Record<(typeof PinType)[keyof typeof PinType], boolean>,
  layerIds: string[],
  showVisibleOnly: boolean
): Pin[] => {
  console.log("[filterPins] === FILTER PINS ===");
  console.log("[filterPins] Input pins:", pins.length);
  console.log("[filterPins] Filters:", {
    searchTerm,
    pinTypeFilters: Object.keys(pinTypeFilters).filter(k => pinTypeFilters[k as keyof typeof pinTypeFilters]),
    layerIds,
    showVisibleOnly,
  });

  const filtered = pins.filter((pin) => {
    // Search term filter
    if (searchTerm && !pin.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      console.log(`[filterPins] ❌ "${pin.title}" filtered out by search term`);
      return false;
    }

    // Pin type filter - check if type is explicitly set to false
    if (pinTypeFilters[pin.pinType as (typeof PinType)[keyof typeof PinType]] === false) {
      console.log(`[filterPins] ❌ "${pin.title}" (${pin.pinType}) filtered out by type filter`);
      return false;
    }

    // Layer filter
    if (layerIds.length > 0 && pin.layerId && !layerIds.includes(pin.layerId)) {
      console.log(`[filterPins] ❌ "${pin.title}" filtered out by layer filter (layer: ${pin.layerId})`);
      return false;
    }

    // Visibility filter
    if (showVisibleOnly && !pin.isVisible) {
      console.log(`[filterPins] ❌ "${pin.title}" filtered out by visibility (isVisible: ${pin.isVisible})`);
      return false;
    }

    console.log(`[filterPins] ✅ "${pin.title}" (${pin.pinType}) passed all filters`);
    return true;
  });

  console.log("[filterPins] Output pins:", filtered.length);
  console.log("[filterPins] Filtered IDs:", filtered.map(p => p.id));
  return filtered;
};

export const usePinsFilterStore = create<PinFilterStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        filteredPins: [],

        setSearchTerm: (term) => {
          const pins = get().filteredPins.length > 0 ? get().filteredPins : [];
          const filtered = filterPins(
            pins,
            term,
            get().pinTypeFilters,
            get().layerIds,
            get().showVisibleOnly
          );
          set({ searchTerm: term, filteredPins: filtered });
        },

        setPinTypeFilter: (pinType, value) => {
          const newFilters = {
            ...get().pinTypeFilters,
            [pinType]: value,
          };
          const pins = get().filteredPins.length > 0 ? get().filteredPins : [];
          const filtered = filterPins(
            pins,
            get().searchTerm,
            newFilters,
            get().layerIds,
            get().showVisibleOnly
          );
          set({ pinTypeFilters: newFilters, filteredPins: filtered });
        },

        togglePinTypeFilter: (pinType) => {
          const newFilters = {
            ...get().pinTypeFilters,
            [pinType]: !get().pinTypeFilters[pinType],
          };
          const pins = get().filteredPins.length > 0 ? get().filteredPins : [];
          const filtered = filterPins(
            pins,
            get().searchTerm,
            newFilters,
            get().layerIds,
            get().showVisibleOnly
          );
          set({ pinTypeFilters: newFilters, filteredPins: filtered });
        },

        showAllPinTypes: () => {
          const newFilters = createDefaultPinTypeFilters();
          const pins = get().filteredPins.length > 0 ? get().filteredPins : [];
          const filtered = filterPins(
            pins,
            get().searchTerm,
            newFilters,
            get().layerIds,
            get().showVisibleOnly
          );
          set({ pinTypeFilters: newFilters, filteredPins: filtered });
        },

        hideAllPinTypes: () => {
          const newFilters = Object.fromEntries(
            Object.entries(createDefaultPinTypeFilters()).map(([key]) => [key, false])
          ) as Record<(typeof PinType)[keyof typeof PinType], boolean>;
          const pins = get().filteredPins.length > 0 ? get().filteredPins : [];
          const filtered = filterPins(
            pins,
            get().searchTerm,
            newFilters,
            get().layerIds,
            get().showVisibleOnly
          );
          set({ pinTypeFilters: newFilters, filteredPins: filtered });
        },

        setLayerIds: (layerIds) => {
          const pins = get().filteredPins.length > 0 ? get().filteredPins : [];
          const filtered = filterPins(
            pins,
            get().searchTerm,
            get().pinTypeFilters,
            layerIds,
            get().showVisibleOnly
          );
          set({ layerIds, filteredPins: filtered });
        },

        toggleLayerId: (layerId) => {
          const newLayerIds = get().layerIds.includes(layerId)
            ? get().layerIds.filter((id) => id !== layerId)
            : [...get().layerIds, layerId];
          const pins = get().filteredPins.length > 0 ? get().filteredPins : [];
          const filtered = filterPins(
            pins,
            get().searchTerm,
            get().pinTypeFilters,
            newLayerIds,
            get().showVisibleOnly
          );
          set({ layerIds: newLayerIds, filteredPins: filtered });
        },

        toggleShowVisibleOnly: () => {
          const newShowVisibleOnly = !get().showVisibleOnly;
          const pins = get().filteredPins.length > 0 ? get().filteredPins : [];
          const filtered = filterPins(
            pins,
            get().searchTerm,
            get().pinTypeFilters,
            get().layerIds,
            newShowVisibleOnly
          );
          set({ showVisibleOnly: newShowVisibleOnly, filteredPins: filtered });
        },

        resetFilters: () => {
          const newFilters = createDefaultPinTypeFilters();
          set({
            searchTerm: "",
            pinTypeFilters: newFilters,
            layerIds: [],
            showVisibleOnly: false,
            filteredPins: [],
          });
        },

        applyFilters: (pins) => {
          const filtered = filterPins(
            pins,
            get().searchTerm,
            get().pinTypeFilters,
            get().layerIds,
            get().showVisibleOnly
          );
          set({ filteredPins: filtered });
          return filtered;
        },

        getVisiblePinTypes: () => {
          return Object.entries(get().pinTypeFilters)
            .filter(([, visible]) => visible)
            .map(([type]) => type as (typeof PinType)[keyof typeof PinType]);
        },

        reset: () => set({ ...initialState, filteredPins: [] }),
      }),
      {
        name: "pins-filter-storage",
        partialize: (state) => ({
          searchTerm: state.searchTerm,
          pinTypeFilters: state.pinTypeFilters,
          layerIds: state.layerIds,
          showVisibleOnly: state.showVisibleOnly,
        }),
      }
    ),
    {
      name: "pins-filter-store",
    }
  )
);

// Selector hooks for optimized re-renders
export const usePinFilters = () =>
  usePinsFilterStore((state) => ({
    searchTerm: state.searchTerm,
    pinTypeFilters: state.pinTypeFilters,
    layerIds: state.layerIds,
    showVisibleOnly: state.showVisibleOnly,
  }));

export const usePinTypeFilters = () => usePinsFilterStore((state) => state.pinTypeFilters);
export const useSearchTerm = () => usePinsFilterStore((state) => state.searchTerm);
export const useLayerIds = () => usePinsFilterStore((state) => state.layerIds);
export const useShowVisibleOnly = () => usePinsFilterStore((state) => state.showVisibleOnly);
export const useFilteredPins = () => usePinsFilterStore((state) => state.filteredPins);

export const useVisiblePinTypes = () =>
  usePinsFilterStore((state) => {
    return Object.entries(state.pinTypeFilters)
      .filter(([, visible]) => visible)
      .map(([type]) => type as (typeof PinType)[keyof typeof PinType]);
  });

// Action hooks
export const useSetSearchTerm = () => usePinsFilterStore((state) => state.setSearchTerm);
export const useSetPinTypeFilter = () => usePinsFilterStore((state) => state.setPinTypeFilter);
export const useTogglePinTypeFilter = () => usePinsFilterStore((state) => state.togglePinTypeFilter);
export const useShowAllPinTypes = () => usePinsFilterStore((state) => state.showAllPinTypes);
export const useHideAllPinTypes = () => usePinsFilterStore((state) => state.hideAllPinTypes);
export const useSetLayerIds = () => usePinsFilterStore((state) => state.setLayerIds);
export const useToggleLayerId = () => usePinsFilterStore((state) => state.toggleLayerId);
export const useToggleShowVisibleOnly = () => usePinsFilterStore((state) => state.toggleShowVisibleOnly);
export const useResetFilters = () => usePinsFilterStore((state) => state.resetFilters);
export const useApplyFilters = () => usePinsFilterStore((state) => state.applyFilters);
export const useGetVisiblePinTypes = () => usePinsFilterStore((state) => state.getVisiblePinTypes);

// Convenience hooks
export const useIsPinTypeVisible = (pinType: (typeof PinType)[keyof typeof PinType]): boolean => {
  const pinTypeFilters = usePinTypeFilters();
  return pinTypeFilters[pinType] ?? true;
};

export const useShowAllPinTypesValue = (): boolean => {
  const pinTypeFilters = usePinTypeFilters();
  return Object.values(pinTypeFilters).every((value) => value === true);
};
