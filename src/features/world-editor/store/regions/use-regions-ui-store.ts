/**
 * Regions UI Store - UI State Management
 *
 * Manages UI-only state for regions:
 * - Selected region
 * - Creating/Editing modes
 * - Dragging state
 * - Hover state
 *
 * Architecture follows ui/logic/methods pattern:
 * - ui/ stores: UI state only (this file)
 * - logic/: Hooks and business logic
 * - methods/: Server actions
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ============== Types ==============

export interface RegionUIState {
  selectedRegionId: string | null;
  isCreating: boolean;
  isEditing: boolean;
  isDragging: boolean;
  hoverRegionId: string | null;
  dragStart: { x: number; y: number } | null;
}

interface RegionUIActions {
  selectRegion: (regionId: string | null) => void;
  clearSelection: () => void;
  startCreating: () => void;
  stopCreating: () => void;
  startEditing: () => void;
  stopEditing: () => void;
  setHoverRegion: (regionId: string | null) => void;
  startDrag: (x: number, y: number) => void;
  updateDrag: (x: number, y: number) => void;
  endDrag: () => void;
  reset: () => void;
}

type RegionUIStore = RegionUIState & RegionUIActions;

// ============== Initial State ==============

const initialState: RegionUIState = {
  selectedRegionId: null,
  isCreating: false,
  isEditing: false,
  isDragging: false,
  hoverRegionId: null,
  dragStart: null,
};

// ============== Store ==============

export const useRegionsUIStore = create<RegionUIStore>()(
  devtools(
    (set) => ({
      ...initialState,

      selectRegion: (regionId) =>
        set({ selectedRegionId: regionId, isEditing: false }),

      clearSelection: () =>
        set({ selectedRegionId: null, isEditing: false }),

      startCreating: () =>
        set({ isCreating: true, selectedRegionId: null, isEditing: false }),

      stopCreating: () =>
        set({ isCreating: false }),

      startEditing: () =>
        set({ isEditing: true }),

      stopEditing: () =>
        set({ isEditing: false }),

      setHoverRegion: (regionId) =>
        set({ hoverRegionId: regionId }),

      startDrag: (x, y) =>
        set({ isDragging: true, dragStart: { x, y } }),

      updateDrag: (x, y) =>
        set({ dragStart: { x, y } }),

      endDrag: () =>
        set({ isDragging: false, dragStart: null }),

      reset: () => set(initialState),
    }),
    {
      name: "regions-ui-store",
    }
  )
);

// ============== Selector Hooks ==============

export const useSelectedRegionId = () =>
  useRegionsUIStore((state) => state.selectedRegionId);

export const useIsCreatingRegion = () =>
  useRegionsUIStore((state) => state.isCreating);

export const useIsEditingRegion = () =>
  useRegionsUIStore((state) => state.isEditing);

export const useIsDraggingRegion = () =>
  useRegionsUIStore((state) => state.isDragging);

export const useHoverRegionId = () =>
  useRegionsUIStore((state) => state.hoverRegionId);

export const useRegionDragStart = () =>
  useRegionsUIStore((state) => state.dragStart);

// ============== Action Hooks ==============

export const useSelectRegion = () =>
  useRegionsUIStore((state) => state.selectRegion);

export const useClearRegionSelection = () =>
  useRegionsUIStore((state) => state.clearSelection);

export const useStartCreatingRegion = () =>
  useRegionsUIStore((state) => state.startCreating);

export const useStopCreatingRegion = () =>
  useRegionsUIStore((state) => state.stopCreating);

export const useStartEditingRegion = () =>
  useRegionsUIStore((state) => state.startEditing);

export const useStopEditingRegion = () =>
  useRegionsUIStore((state) => state.stopEditing);

export const useSetHoverRegion = () =>
  useRegionsUIStore((state) => state.setHoverRegion);

export const useStartRegionDrag = () =>
  useRegionsUIStore((state) => state.startDrag);

export const useUpdateRegionDrag = () =>
  useRegionsUIStore((state) => state.updateDrag);

export const useEndRegionDrag = () =>
  useRegionsUIStore((state) => state.endDrag);

export const useResetRegionsUI = () =>
  useRegionsUIStore((state) => state.reset);
