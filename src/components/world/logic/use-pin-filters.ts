import { useCallback } from "react";
import { usePinFiltersStore, usePinFilterActions, useVisiblePinTypes } from "@/stores/pin-filters-store";
import type { PinTypeEnum } from "@/types/pin.type";

/**
 * Hook for accessing pin filters state and actions
 * Provides a convenient interface for filtering pins by type
 *
 * @example
 * ```tsx
 * const { filters, showAll, toggleFilter, isTypeVisible } = usePinFilters();
 *
 * // Check if city pins are visible
 * if (isTypeVisible(PinTypeEnum.CITY)) {
 *   // Show city pins
 * }
 *
 * // Toggle a filter
 * toggleFilter(PinTypeEnum.DUNGEON);
 * ```
 */
export function usePinFilters() {
  const filters = usePinFiltersStore((state) => state.filters);
  const showAll = usePinFiltersStore((state) => state.showAll);
  const actions = usePinFilterActions();
  const visibleTypes = useVisiblePinTypes();

  return {
    ...actions,
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
 * const isCityVisible = useIsPinTypeVisible(PinTypeEnum.CITY);
 * ```
 */
export function useIsPinTypeVisible(pinType: PinTypeEnum): boolean {
  const isTypeVisible = usePinFiltersStore((state) => state.isTypeVisible);
  return isTypeVisible(pinType);
}

/**
 * Hook to filter an array of pins based on current filters
 *
 * @example
 * ```tsx
 * const filteredPins = useFilteredPins(allPins);
 * ```
 */
export function useFilteredPins<T extends { pinType: PinTypeEnum }>(pins: T[]): T[] {
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
  const showAll = usePinFiltersStore((state) => state.showAll);
  return !showAll;
}
