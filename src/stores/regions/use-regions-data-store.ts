/**
 * Regions Data Store - Data and Server Sync
 *
 * Manages region data and server synchronization:
 * - Region list state
 * - Loading and error states
 * - Server actions (create, update, delete)
 *
 * Architecture follows ui/logic/methods pattern:
 * - ui/ stores: UI state only
 * - logic/: Hooks and business logic
 * - methods/: Server actions
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  createRegion,
  updateRegion,
  updateRegionPosition,
  deleteRegion as deleteRegionServer,
  toggleRegionVisibility,
  getRegionsByWorld,
} from "@/features/world-editor/actions";
import { useHistoryStore } from "@/stores/history-store";

// ============== Types ==============

export type RegionType = "RECTANGLE" | "CIRCLE" | "POLYGON";

export interface RegionCoordinates {
  // Rectangle: { x, y, width, height }
  // Circle: { centerX, centerY, radius }
  // Polygon: { points: [{x, y}, ...] }
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  centerX?: number;
  centerY?: number;
  radius?: number;
  points?: Array<{ x: number; y: number }>;
}

export interface Region {
  id: string;
  name: string;
  type: RegionType;
  coordinates: RegionCoordinates;
  description: string | null;
  visible: boolean;
  locked: boolean;
  color: string;
  opacity: number;
  borderWidth: number;
  layerId: string;
  gameWorldId: string;
  createdAt: Date;
  updatedAt: Date;
  layer?: {
    id: string;
    name: string;
    isVisible: boolean;
  };
}

interface RegionDataState {
  regions: Region[];
  isLoading: boolean;
  error: string | null;
}

interface RegionDataActions {
  setRegions: (regions: Region[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  create: (layerId: string, data: {
    name: string;
    type: RegionType;
    coordinates: RegionCoordinates;
    description?: string;
    color?: string;
    opacity?: number;
    borderWidth?: number;
  }) => Promise<Region | null>;
  update: (regionId: string, data: {
    name?: string;
    coordinates?: RegionCoordinates;
    description?: string;
    visible?: boolean;
    locked?: boolean;
    color?: string;
    opacity?: number;
    borderWidth?: number;
  }) => Promise<Region | null>;
  updatePosition: (regionId: string, coordinates: RegionCoordinates) => Promise<void>;
  delete: (regionId: string) => Promise<boolean>;
  toggleVisibility: (regionId: string) => Promise<Region | null>;
  fetchByWorld: (worldId: string) => Promise<void>;
  reset: () => void;
}

type RegionDataStore = RegionDataState & RegionDataActions;

// ============== Initial State ==============

const initialState: RegionDataState = {
  regions: [],
  isLoading: false,
  error: null,
};

// ============== Store ==============

export const useRegionsDataStore = create<RegionDataStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setRegions: (regions) => set({ regions, error: null }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      create: async (layerId, data, options?: { trackHistory?: boolean }) => {
        const { trackHistory = true } = options || {};
        set({ isLoading: true, error: null });
        try {
          const _result = await createRegion(layerId, data);
          if (result.success && result.data) {
            const newRegion = result.data;
            set((state) => ({
              regions: [...state.regions, newRegion],
              isLoading: false,
            }));

            // Add history entry for undo
            if (trackHistory && !useHistoryStore.getState().isExecuting) {
              const addHistory = useHistoryStore.getState().addHistory;
              const regionId = newRegion.id;
              const _regionData = { ...newRegion };
              const _worldId = newRegion.gameWorldId;

              addHistory({
                type: "region",
                description: `Created region: ${newRegion.name}`,
                undo: async () => {
                  // Delete the region to undo
                  await deleteRegionServer(regionId);
                  // Update local store
                  set((state) => ({
                    regions: state.regions.filter((r) => r.id !== regionId),
                  }));
                },
                redo: async () => {
                  // Recreate the region
                  const redoResult = await createRegion(layerId, data);
                  if (redoResult.success && redoResult.data) {
                    set((state) => ({
                      regions: [...state.regions, redoResult.data],
                    }));
                  }
                },
                metadata: {
                  worldId,
                  affectedIds: [regionId],
                },
              });
            }

            return newRegion;
          }
          set({ isLoading: false, error: result.error || "Failed to create region" });
          return null;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
          return null;
        }
      },

      update: async (regionId, data) => {
        set({ isLoading: true, error: null });
        try {
          const _result = await updateRegion(regionId, data);
          if (result.success && result.data) {
            set((state) => ({
              regions: state.regions.map((r) =>
                r.id === regionId ? result.data : r
              ),
              isLoading: false,
            }));
            return result.data;
          }
          set({ isLoading: false, error: result.error || "Failed to update region" });
          return null;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
          return null;
        }
      },

      updatePosition: async (regionId, coordinates, options?: { trackHistory?: boolean }) => {
        const { trackHistory = true } = options || {};

        // Capture previous coordinates for history
        const region = get().regions.find((r) => r.id === regionId);
        const previousCoordinates = region?.coordinates ? { ...region.coordinates } : undefined;

        try {
          const _result = await updateRegionPosition(regionId, coordinates);
          if (result.success && result.data) {
            set((state) => ({
              regions: state.regions.map((r) =>
                r.id === regionId ? { ...r, coordinates: result.data.coordinates } : r
              ),
            }));

            // Add history entry for undo
            if (trackHistory && previousCoordinates && !useHistoryStore.getState().isExecuting) {
              const addHistory = useHistoryStore.getState().addHistory;
              const newCoordinates = { ...coordinates };

              addHistory({
                type: "region",
                description: `Moved region: ${region?.name || "Unknown"}`,
                undo: async () => {
                  await updateRegionPosition(regionId, previousCoordinates);
                  set((state) => ({
                    regions: state.regions.map((r) =>
                      r.id === regionId ? { ...r, coordinates: previousCoordinates } : r
                    ),
                  }));
                },
                redo: async () => {
                  await updateRegionPosition(regionId, newCoordinates);
                  set((state) => ({
                    regions: state.regions.map((r) =>
                      r.id === regionId ? { ...r, coordinates: newCoordinates } : r
                    ),
                  }));
                },
                metadata: {
                  affectedIds: [regionId],
                },
              });
            }
          }
        } catch (error) {
          console.error("[RegionsDataStore] Failed to update position:", error);
        }
      },

      delete: async (regionId, options?: { trackHistory?: boolean }) => {
        const { trackHistory = true } = options || {};
        set({ isLoading: true, error: null });

        // Capture region data for history before deleting
        const regionToDelete = get().regions.find((r) => r.id === regionId);
        const _regionData = regionToDelete ? { ...regionToDelete } : null;
        const layerId = regionData?.layerId;

        try {
          const _result = await deleteRegionServer(regionId);
          if (result.success) {
            set((state) => ({
              regions: state.regions.filter((r) => r.id !== regionId),
              isLoading: false,
            }));

            // Add history entry for undo
            if (trackHistory && regionData && !useHistoryStore.getState().isExecuting) {
              const addHistory = useHistoryStore.getState().addHistory;
              const _worldId = regionData.gameWorldId;

              addHistory({
                type: "region",
                description: `Deleted region: ${regionData.name}`,
                undo: async () => {
                  // Recreate the region to undo
                  const createData = {
                    name: regionData.name,
                    type: regionData.type,
                    coordinates: regionData.coordinates,
                    description: regionData.description ?? undefined,
                    color: regionData.color,
                    opacity: regionData.opacity,
                    borderWidth: regionData.borderWidth,
                  };
                  if (layerId) {
                    const redoResult = await createRegion(layerId, createData);
                    if (redoResult.success && redoResult.data) {
                      set((state) => ({
                        regions: [...state.regions, redoResult.data],
                      }));
                    }
                  }
                },
                redo: async () => {
                  // Delete the region again
                  await deleteRegionServer(regionId);
                  set((state) => ({
                    regions: state.regions.filter((r) => r.id !== regionId),
                  }));
                },
                metadata: {
                  worldId,
                  affectedIds: [regionId],
                },
              });
            }

            return true;
          }
          set({ isLoading: false, error: result.error || "Failed to delete region" });
          return false;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
          return false;
        }
      },

      toggleVisibility: async (regionId) => {
        try {
          const _result = await toggleRegionVisibility(regionId);
          if (result.success && result.data) {
            set((state) => ({
              regions: state.regions.map((r) =>
                r.id === regionId ? result.data : r
              ),
            }));
            return result.data;
          }
          return null;
        } catch (error) {
          console.error("[RegionsDataStore] Failed to toggle visibility:", error);
          return null;
        }
      },

      fetchByWorld: async (worldId) => {
        set({ isLoading: true, error: null });
        try {
          const regions = await getRegionsByWorld(worldId);
          set({ regions, isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Failed to fetch regions",
          });
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: "regions-data-store",
    }
  )
);

// ============== Selector Hooks ==============

export const useRegions = () =>
  useRegionsDataStore((state) => state.regions);

export const useRegionById = (regionId: string) =>
  useRegionsDataStore((state) =>
    state.regions.find((r) => r.id === regionId)
  );

export const useRegionsLoading = () =>
  useRegionsDataStore((state) => state.isLoading);

export const useRegionsError = () =>
  useRegionsDataStore((state) => state.error);

// ============== Action Hooks ==============

export const useSetRegions = () =>
  useRegionsDataStore((state) => state.setRegions);

export const useCreateRegion = () =>
  useRegionsDataStore((state) => state.create);

export const useUpdateRegion = () =>
  useRegionsDataStore((state) => state.update);

export const useUpdateRegionPosition = () =>
  useRegionsDataStore((state) => state.updatePosition);

export const useDeleteRegion = () =>
  useRegionsDataStore((state) => state.delete);

export const useToggleRegionVisibility = () =>
  useRegionsDataStore((state) => state.toggleVisibility);

export const useFetchRegionsByWorld = () =>
  useRegionsDataStore((state) => state.fetchByWorld);

export const useResetRegionsData = () =>
  useRegionsDataStore((state) => state.reset);
