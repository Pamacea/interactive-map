import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PinTypeEnum } from "@/types/pin.type";

/**
 * Pin filter state
 * Tracks which pin types are currently visible on the map
 */
interface PinFiltersState {
  /**
   * Map of pin type to visibility state
   * true = visible, false = hidden
   */
  filters: Record<PinTypeEnum, boolean>;

  /**
   * Whether all pin types are currently shown
   * Computed state derived from filters
   */
  showAll: boolean;

  /**
   * Toggle a single pin type filter
   */
  toggleFilter: (pinType: PinTypeEnum) => void;

  /**
   * Set a specific pin type filter value
   */
  setFilter: (pinType: PinTypeEnum, value: boolean) => void;

  /**
   * Show all pin types
   * Sets all filters to true
   */
  showAllTypes: () => void;

  /**
   * Hide all pin types
   * Sets all filters to false
   */
  hideAllTypes: () => void;

  /**
   * Reset filters to default state (all types visible)
   */
  resetFilters: () => void;

  /**
   * Get array of visible pin types
   * Helper for filtering pins array
   */
  getVisibleTypes: () => PinTypeEnum[];

  /**
   * Check if a specific pin type is visible
   */
  isTypeVisible: (pinType: PinTypeEnum) => boolean;
}

/**
 * Default filter state - all pin types visible
 */
const createDefaultFilters = (): Record<PinTypeEnum, boolean> => ({
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

/**
 * Check if all filters are true
 */
const allFiltersEnabled = (filters: Record<PinTypeEnum, boolean>): boolean => {
  return Object.values(filters).every((value) => value === true);
};

/**
 * Zustand store for pin type filters
 * Persists to localStorage automatically
 */
export const usePinFiltersStore = create<PinFiltersState>()(
  persist(
    (set, get) => ({
      filters: createDefaultFilters(),
      showAll: true,

      toggleFilter: (pinType) =>
        set((state) => {
          const newFilters = {
            ...state.filters,
            [pinType]: !state.filters[pinType],
          };
          return {
            filters: newFilters,
            showAll: allFiltersEnabled(newFilters),
          };
        }),

      setFilter: (pinType, value) =>
        set((state) => {
          const newFilters = {
            ...state.filters,
            [pinType]: value,
          };
          return {
            filters: newFilters,
            showAll: allFiltersEnabled(newFilters),
          };
        }),

      showAllTypes: () =>
        set({
          filters: createDefaultFilters(),
          showAll: true,
        }),

      hideAllTypes: () =>
        set({
          filters: Object.fromEntries(
            Object.entries(createDefaultFilters()).map(([key]) => [key, false])
          ) as Record<PinTypeEnum, boolean>,
          showAll: false,
        }),

      resetFilters: () =>
        set({
          filters: createDefaultFilters(),
          showAll: true,
        }),

      getVisibleTypes: () => {
        const state = get();
        return Object.entries(state.filters)
          .filter(([, visible]) => visible)
          .map(([type]) => type as PinTypeEnum);
      },

      isTypeVisible: (pinType) => {
        return get().filters[pinType] ?? true;
      },
    }),
    {
      name: "pin-filters-storage",
      version: 1,
    }
  )
);

/**
 * Selector hooks for optimized re-renders
 * Use these in components to prevent unnecessary re-renders
 */
export const usePinFilters = () =>
  usePinFiltersStore((state) => state.filters);

export const useShowAllPinTypes = () =>
  usePinFiltersStore((state) => state.showAll);

export const useVisiblePinTypes = () =>
  usePinFiltersStore((state) => {
    // Compute visible types directly in selector for stable reference
    return Object.entries(state.filters)
      .filter(([, visible]) => visible)
      .map(([type]) => type as PinTypeEnum);
  });

/**
 * Individual selector hooks for optimal performance
 * Each hook subscribes to specific actions, preventing unnecessary re-renders
 */
export const useToggleFilter = () =>
  usePinFiltersStore((state) => state.toggleFilter);

export const useSetFilter = () =>
  usePinFiltersStore((state) => state.setFilter);

export const useShowAllTypes = () =>
  usePinFiltersStore((state) => state.showAllTypes);

export const useHideAllTypes = () =>
  usePinFiltersStore((state) => state.hideAllTypes);

export const useResetFilters = () =>
  usePinFiltersStore((state) => state.resetFilters);

export const useIsTypeVisible = () =>
  usePinFiltersStore((state) => state.isTypeVisible);

/**
 * Convenience hook to get all actions at once
 * WARNING: This creates a new object on each call - use individual hooks above for optimal performance
 */
export const usePinFilterActions = () => ({
  toggleFilter: usePinFiltersStore((state) => state.toggleFilter),
  setFilter: usePinFiltersStore((state) => state.setFilter),
  showAllTypes: usePinFiltersStore((state) => state.showAllTypes),
  hideAllTypes: usePinFiltersStore((state) => state.hideAllTypes),
  resetFilters: usePinFiltersStore((state) => state.resetFilters),
  isTypeVisible: usePinFiltersStore((state) => state.isTypeVisible),
});
