/**
 * Pins Store Module
 *
 * Exports all pins-related stores for organized state management.
 *
 * Architecture:
 * - usePinsUIStore: UI state (selection, hover, modes)
 * - usePinsFilterStore: Filtering logic and state
 * - usePinsDataStore: Pin data and server sync
 *
 * Each store is focused and can be imported independently.
 */

// UI Store exports
export {
  usePinsUIStore,
  useSelectedPinId,
  useIsCreatingPin,
  useIsEditingPin,
  useHoverPinId,
  useSelectPin,
  useClearSelection,
  useStartCreating,
  useStopCreating,
  useStartEditing,
  useStopEditing,
  useSetHoverPin,
} from "./use-pins-ui-store";

// Filter Store exports
export {
  usePinsFilterStore,
  usePinFilters,
  usePinTypeFilters,
  useSearchTerm,
  useLayerIds,
  useShowVisibleOnly,
  useFilteredPins,
  useVisiblePinTypes,
  useSetSearchTerm,
  useSetPinTypeFilter,
  useTogglePinTypeFilter,
  useShowAllPinTypes,
  useHideAllPinTypes,
  useSetLayerIds,
  useToggleLayerId,
  useToggleShowVisibleOnly,
  useResetFilters,
  useApplyFilters,
  useGetVisiblePinTypes,
  useIsPinTypeVisible,
  useShowAllPinTypesValue,
} from "./use-pins-filter-store";

// Data Store exports
export {
  usePinsDataStore,
  usePins,
  usePinById,
  usePinsLoading,
  usePinsError,
  useSetPins,
  useAddPin,
  useUpdatePin,
  useDeletePin,
  useCreatePin,
  useDeletePinServer,
  useUpdatePinServer,
} from "./use-pins-data-store";
