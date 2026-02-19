/**
 * Regions Store - Main Export
 *
 * This file provides a clean interface for the regions store.
 * Re-exports everything from sub-stores.
 *
 * Usage:
 *   import {
 *     useSelectedRegionId,
 *     useRegions,
 *     useCreateRegion,
 *   } from "@/stores/regions";
 */

// Re-export from UI Store
export {
  useRegionsUIStore,
  useSelectedRegionId,
  useIsCreatingRegion,
  useIsEditingRegion,
  useIsDraggingRegion,
  useHoverRegionId,
  useRegionDragStart,
  useSelectRegion,
  useClearRegionSelection,
  useStartCreatingRegion,
  useStopCreatingRegion,
  useStartEditingRegion,
  useStopEditingRegion,
  useSetHoverRegion,
  useStartRegionDrag,
  useUpdateRegionDrag,
  useEndRegionDrag,
  useResetRegionsUI,
} from "./use-regions-ui-store";

// Re-export from Data Store
export {
  useRegionsDataStore,
  useRegions,
  useRegionById,
  useRegionsLoading,
  useRegionsError,
  useSetRegions,
  useCreateRegion,
  useUpdateRegion,
  useUpdateRegionPosition,
  useDeleteRegion,
  useToggleRegionVisibility,
  useFetchRegionsByWorld,
  useResetRegionsData,
} from "./use-regions-data-store";

// Export types
export type {
  RegionUIState,
} from "./use-regions-ui-store";

export type {
  Region,
  RegionType,
  RegionCoordinates,
} from "./use-regions-data-store";

// Re-export RegionWithLayer type for use in components
export interface RegionWithLayer extends Region {
  layerVisible: boolean;
  layerOpacity: number;
  layerScale: number;
  layerOffsetX: number;
  layerOffsetY: number;
}
