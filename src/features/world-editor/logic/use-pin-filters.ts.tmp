import { useCallback } from "react";
import {
  usePinTypeFilters,
  useTogglePinTypeFilter,
  useShowAllPinTypes,
  useHideAllPinTypes,
  useVisiblePinTypes,
  useShowAllPinTypesValue,
} from "@/features/pins/store";
import { PinType } from "@/types/pin.type";

/**
 * Hook for accessing pin filters state and actions
 * Provides a convenient interface for filtering pins by type
 *
 * @example
 * ```tsx
 * const { filters, showAll, toggleFilter, isTypeVisible } = usePinFilters();
 *
 * // Check if city pins are visible
 * if (isTypeVisible((typeof PinType)[keyof typeof PinType].CITY)) {
 *   // Show city pins
 * }
 *
 * // Toggle a filter
 * toggleFilter((typeof PinType)[keyof typeof PinType].DUNGEON);
 * ```
 */
export function usePinFilters() {
  const filters = usePinTypeFilters();
  const showAll = useShowAllPinTypesValue();
  const toggleFilter = useTogglePinTypeFilter();
  const showAllTypes = useShowAllPinTypes();
  const hideAllTypes = useHideAllPinTypes();
  const visibleTypes = useVisiblePinTypes();

  const isTypeVisible = (pinType: (typeof PinType)[keyof typeof PinType]): boolean => {
    return filters[pinType] ?? true;
  };

  return {
    toggleFilter,
    setFilter: (pinType: (typeof PinType)[keyof typeof PinType], value: boolean) => {
      // This is handled by toggle, but we could add setPinTypeFilter if needed
      if (value !== filters[pinType]) {
        toggleFilter(pinType);
      }
    },
    showAllTypes,
    hideAllTypes,
    resetFilters: showAllTypes, // Reset = show all
    isTypeVisible,
    filters,
    showAll,
    visibleTypes,
  };
}

/**
 * Hook to check if a specific pin type is currently visible
 *
 * @example
 * ```tsx
 * const isCityVisible = useIsPinTypeVisible((typeof PinType)[keyof typeof PinType].CITY);
 * ```
 */
export function useIsPinTypeVisible(pinType: (typeof PinType)[keyof typeof PinType]): boolean {
  const filters = usePinTypeFilters();
  return filters[pinType] ?? true;
}

/**
 * Hook to filter an array of pins based on current filters
 *
 * @example
 * ```tsx
 * const filteredPins = useFilteredPins(allPins);
 * ```
 */
export function useFilteredPins<T extends { pinType: (typeof PinType)[keyof typeof PinType] }>(pins: T[]): T[] {
  const visibleTypes = useVisiblePinTypes();

  return useCallback(() => {
    return pins.filter((pin) => visibleTypes.includes(pin.pinType));
  }, [pins, visibleTypes])();
}

/**
 * Hook to get the count of visible pin types
 * Useful for displaying "5 of 9 types visible"
 *
 * @example
 * ```tsx
 * const visibleCount = useVisiblePinTypesCount(); // 5
 * ```
 */
export function useVisiblePinTypesCount(): number {
  const visibleTypes = useVisiblePinTypes();
  return visibleTypes.length;
}

/**
 * Hook to check if any filters are active (some types hidden)
 *
 * @example
 * ```tsx
 * const hasActiveFilters = useHasActiveFilters(); // true if some types are hidden
 * ```
 */
export function useHasActiveFilters(): boolean {
  const showAll = useShowAllPinTypesValue();
  return !showAll;
}
