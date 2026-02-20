/**
 * Pins Store - Barrel Export
 */

// Main store
export { usePinsStore } from "./use-pins-store";

// Sub-stores (from pins/ directory)
export { usePinsDataStore } from "./pins/use-pins-data-store";
export { usePinsFilterStore } from "./pins/use-pins-filter-store";
export { usePinsUIStore } from "./pins/use-pins-ui-store";

// Individual hooks for convenience
export { usePins } from "./pins/use-pins-data-store";
export { useSetPins } from "./pins/use-pins-data-store";
export { useUpdatePin } from "./pins/use-pins-data-store";
export { useDeletePin } from "./pins/use-pins-data-store";
export { useSelectedPinId } from "./pins/use-pins-ui-store";
export { useSelectPin } from "./pins/use-pins-ui-store";
export { useClearSelection } from "./pins/use-pins-ui-store";
export { usePinById } from "./pins/use-pins-data-store";
export { useSetHoverPin } from "./pins/use-pins-ui-store";

// Server action hooks
export { useCreatePin } from "./use-pins-store";
export { useUpdatePinServer } from "./use-pins-store";
export { useDeletePinServer } from "./use-pins-store";

// Selection hooks
export { useTogglePinSelection } from "./use-pins-store";
export { useSetMultiplePinSelection } from "./use-pins-store";
export { useSelectedPin } from "./use-pins-store";
export { useIsCreatingPin } from "./use-pins-store";
export { useStopCreating } from "./use-pins-store";
export { useStartCreating } from "./use-pins-store";

// Filter store exports
export {
  usePinTypeFilters,
  useSearchTerm,
  useLayerIds,
  useShowVisibleOnly,
  useVisiblePinTypes,
  useTogglePinTypeFilter,
  useShowAllPinTypes,
  useHideAllPinTypes,
  useShowAllPinTypesValue,
} from "./pins/use-pins-filter-store";
