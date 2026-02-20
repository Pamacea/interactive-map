/**
 * Pins Store - Main Composition Layer
 *
 * This file provides backward compatibility by composing the three focused stores:
 * - usePinsUIStore (ui/ directory): UI state management
 * - usePinsFilterStore (filters/ directory): Filtering logic
 * - usePinsDataStore (data/ directory): Data and server sync
 *
 * MIGRATION GUIDE:
 * For new code, import directly from the sub-stores:
 *   import { useSelectedPinId, usePins, useFilteredPins } from "@/features/pins";
 *
 * For existing code, continue importing from here:
 *   import { useSelectedPinId } from "@/features/use-pins-store";
 *
 * Both patterns work and provide the same functionality.
 */

// Re-export everything from sub-stores for backward compatibility
export {
  // UI Store
  usePinsUIStore,
  useSelectedPinId,
  useSelectedPinIds,
  useIsCreatingPin,
  useIsEditingPin,
  useHoverPinId,
  useSelectPin,
  useTogglePinSelection,
  useSetMultiplePinSelection,
  useClearSelection,
  useStartCreating,
  useStopCreating,
  useStartEditing,
  useStopEditing,
  useSetHoverPin,

  // Filter Store
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

  // Data Store
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
} from "./pins";

// Export types for backward compatibility
export type { PinUIState } from "./pins/use-pins-ui-store";
export type { PinFilters } from "./pins/use-pins-filter-store";

// Legacy: Export a composed hook that combines all stores
// This maintains backward compatibility with code using usePinsStore()
import { usePinsUIStore, useSelectedPinId as useSelectedPinIdFromUI } from "./pins/use-pins-ui-store";
import { usePinsFilterStore } from "./pins/use-pins-filter-store";
import { usePinsDataStore, usePins } from "./pins/use-pins-data-store";
import type { Pin } from "@prisma/client";
import { PinType } from "@/types/pin.type";

// Type alias for the filter record
type PinTypeEnum = (typeof PinType)[keyof typeof PinType];

/**
 * Composed store interface for backward compatibility
 *
 * @deprecated Use individual hooks from @/stores/pins instead
 */
export interface LegacyPinsStore {
  // UI State
  selectedPinId: string | null;
  selectedPinIds: string[];
  isCreating: boolean;
  isEditing: boolean;
  hoverPinId: string | null;

  // Filter State
  searchTerm: string;
  pinTypeFilters: Record<PinTypeEnum, boolean>;
  layerIds: string[];
  showVisibleOnly: boolean;

  // Data State
  pins: Pin[];
  filteredPins: Pin[];
  isLoading: boolean;
  error: string | null;

  // Actions
  selectPin: (pinId: string | null) => void;
  togglePinSelection: (pinId: string) => void;
  setMultiplePinSelection: (pinIds: string[]) => void;
  clearSelection: () => void;
  startCreating: () => void;
  stopCreating: () => void;
  startEditing: () => void;
  stopEditing: () => void;
  setHoverPin: (pinId: string | null) => void;
  setPins: (pins: Pin[]) => void;
  addPin: (pin: Pin) => void;
  updatePin: (pinId: string, updates: Partial<Pin>) => void;
  deletePin: (pinId: string) => void;
  createPin: (data: any) => Promise<void>;
  deletePinServer: (pinId: string) => Promise<void>;
  updatePinServer: (data: any) => Promise<void>;
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
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

/**
 * Legacy composed hook for backward compatibility
 *
 * @deprecated Use individual hooks from @/stores/pins instead:
 *   const selectedPinId = useSelectedPinId();
 *   const pins = usePins();
 *   const filteredPins = useFilteredPins();
 */
export const usePinsStore = (): LegacyPinsStore => {
  // Get state from all three stores
  const uiState = usePinsUIStore();
  const filterState = usePinsFilterStore();
  const dataState = usePinsDataStore();

  // Get actions from all three stores
  const uiActions = usePinsUIStore;
  const filterActions = usePinsFilterStore;
  const dataActions = usePinsDataStore;

  // Compose into a single interface
  return {
    // UI State
    selectedPinId: uiState.selectedPinId,
    selectedPinIds: uiState.selectedPinIds,
    isCreating: uiState.isCreating,
    isEditing: uiState.isEditing,
    hoverPinId: uiState.hoverPinId,

    // Filter State
    searchTerm: filterState.searchTerm,
    pinTypeFilters: filterState.pinTypeFilters,
    layerIds: filterState.layerIds,
    showVisibleOnly: filterState.showVisibleOnly,

    // Data State
    pins: dataState.pins,
    filteredPins: filterState.filteredPins,
    isLoading: dataState.isLoading,
    error: dataState.error,

    // UI Actions
    selectPin: uiActions().selectPin,
    togglePinSelection: uiActions().togglePinSelection,
    setMultiplePinSelection: uiActions().setMultiplePinSelection,
    clearSelection: uiActions().clearSelection,
    startCreating: uiActions().startCreating,
    stopCreating: uiActions().stopCreating,
    startEditing: uiActions().startEditing,
    stopEditing: uiActions().stopEditing,
    setHoverPin: uiActions().setHoverPin,

    // Data Actions
    setPins: dataActions().setPins,
    addPin: dataActions().addPin,
    updatePin: dataActions().updatePin,
    deletePin: dataActions().deletePin,
    createPin: dataActions().createPin,
    deletePinServer: dataActions().deletePinServer,
    updatePinServer: dataActions().updatePinServer,
    setLoading: dataActions().setLoading,
    setError: dataActions().setError,

    // Filter Actions
    setSearchTerm: filterActions().setSearchTerm,
    setPinTypeFilter: filterActions().setPinTypeFilter,
    togglePinTypeFilter: filterActions().togglePinTypeFilter,
    showAllPinTypes: filterActions().showAllPinTypes,
    hideAllPinTypes: filterActions().hideAllPinTypes,
    setLayerIds: filterActions().setLayerIds,
    toggleLayerId: filterActions().toggleLayerId,
    toggleShowVisibleOnly: filterActions().toggleShowVisibleOnly,
    resetFilters: filterActions().resetFilters,
    applyFilters: () => filterActions().applyFilters(dataState.pins),
    getVisiblePinTypes: filterActions().getVisiblePinTypes,

    // Reset all stores
    reset: () => {
      uiActions().reset();
      filterActions().reset();
      dataActions().reset();
    },
  };
};

// Export a convenience hook for getting the selected pin
export const useSelectedPin = () => {
  const selectedPinId = useSelectedPinIdFromUI();
  const pins = usePins();

  return selectedPinId
    ? pins.find((pin) => pin.id === selectedPinId)
    : null;
};
