/**
 * Tools Store - State management for all map tools
 *
 * This store manages:
 * - Active tool mode (select, pan, measure, area)
 * - Tool-specific states (measurements, selections, etc.)
 * - Cursor states for each tool
 * - Tool transitions and cleanup
 *
 * Architecture follows ui/logic/methods pattern:
 * - ui/ stores: UI state only
 * - logic/: Hooks and business logic
 * - methods/: Server actions
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { usePinsUIStore } from "@/features/pins/store";

// ============== Types ==============

export type ToolMode = "select" | "pan" | "measure" | "area";

export interface MeasurePoint {
  x: number;
  y: number;
  lat: number;
  lng: number;
}

export interface MeasureSegment {
  start: MeasurePoint;
  end: MeasurePoint;
  pixelDistance: number;
  worldDistance: number;
}

export interface SelectionRectangle {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

// ============== State ==============

interface ToolsState {
  // Active tool
  mode: ToolMode;

  // Measure tool state
  measurePoints: MeasurePoint[];
  isMeasuring: boolean;

  // Area/Selection tool state
  selectionRect: SelectionRectangle | null;
  isSelecting: boolean;
  selectedPinIds: string[];

  // Previous mode (for temporary mode switches like space+drag)
  previousMode: ToolMode | null;
}

interface ToolsActions {
  // Mode management
  setMode: (mode: ToolMode) => void;
  reset: () => void;

  // Measure tool actions
  startMeasure: () => void;
  addMeasurePoint: (point: MeasurePoint) => void;
  removeLastMeasurePoint: () => void;
  clearMeasure: () => void;
  finishMeasure: () => void;

  // Area/Selection tool actions
  startSelection: (x: number, y: number) => void;
  updateSelection: (x: number, y: number) => void;
  endSelection: () => void;
  clearSelection: () => void;
  togglePinSelection: (pinId: string) => void;
  setMultiplePinSelection: (pinIds: string[]) => void;

  // Temporary mode (for space+drag)
  setTemporaryMode: (mode: ToolMode) => void;
  restorePreviousMode: () => void;
}

type ToolsStore = ToolsState & ToolsActions;

// ============== Cursors ==============

export const TOOL_CURSORS: Record<ToolMode, string> = {
  select: "default",
  pan: "grab",
  measure: "crosshair",
  area: "crosshair",
};

export const TOOL_ACTIVE_CURSORS: Record<ToolMode, string> = {
  select: "default",
  pan: "grabbing",
  measure: "crosshair",
  area: "crosshair",
};

// ============== Initial State ==============

const initialState: ToolsState = {
  mode: "select",
  measurePoints: [],
  isMeasuring: false,
  selectionRect: null,
  isSelecting: false,
  selectedPinIds: [],
  previousMode: null,
};

// ============== Store ==============

export const useToolsStore = create<ToolsStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Mode management
      setMode: (mode) => {
        const currentMode = get().mode;

        // Build the state updates, including cleanup
        const stateUpdates: Partial<ToolsState> = { mode, previousMode: null };

        // Clean up previous tool state (in the same set call for consistency)
        if (currentMode === "measure" && mode !== "measure") {
          stateUpdates.measurePoints = [];
          stateUpdates.isMeasuring = false;
        }
        if (currentMode === "area" && mode !== "area") {
          stateUpdates.selectionRect = null;
          stateUpdates.isSelecting = false;
        }
        if ((currentMode === "select" || currentMode === "area") && mode !== "select" && mode !== "area") {
          stateUpdates.selectionRect = null;
          stateUpdates.isSelecting = false;
          stateUpdates.selectedPinIds = [];

          // Also clear the UI store's single pin selection
          // Use getState() to access the store's clearSelection action
          usePinsUIStore.getState().clearSelection();
        }

        // Initialize new tool state
        if (mode === "measure" && currentMode !== "measure") {
          stateUpdates.isMeasuring = true;
          stateUpdates.measurePoints = [];
        }

        set(stateUpdates);
      },

      reset: () => set(initialState),

      // Measure tool actions
      startMeasure: () => set({ isMeasuring: true, measurePoints: [] }),

      addMeasurePoint: (point) =>
        set((state) => ({
          measurePoints: [...state.measurePoints, point],
          isMeasuring: true,
        })),

      removeLastMeasurePoint: () =>
        set((state) => ({
          measurePoints: state.measurePoints.slice(0, -1),
          isMeasuring: state.measurePoints.length > 1,
        })),

      clearMeasure: () => set({ measurePoints: [], isMeasuring: false }),

      finishMeasure: () => set({ isMeasuring: false }),

      // Area/Selection tool actions
      startSelection: (x, y) =>
        set({
          selectionRect: { startX: x, startY: y, endX: x, endY: y, startLat: x, startLng: y, endLat: x, endLng: y },
          isSelecting: true,
        }),

      updateSelection: (x, y) =>
        set((state) => {
          if (!state.selectionRect) return state;
          return {
            selectionRect: { ...state.selectionRect, endX: x, endY: y, endLat: x, endLng: y },
          };
        }),

      endSelection: () =>
        set({
          isSelecting: false,
          // Keep selectionRect for one render cycle to show final selection
        }),

      clearSelection: () =>
        set({
          selectionRect: null,
          isSelecting: false,
          selectedPinIds: [],
        }),

      togglePinSelection: (pinId) =>
        set((state) => {
          const isSelected = state.selectedPinIds.includes(pinId);
          return {
            selectedPinIds: isSelected
              ? state.selectedPinIds.filter((id) => id !== pinId)
              : [...state.selectedPinIds, pinId],
          };
        }),

      setMultiplePinSelection: (pinIds) => set({ selectedPinIds: pinIds }),

      // Temporary mode (for space+drag)
      setTemporaryMode: (mode) =>
        set((state) => ({
          previousMode: state.mode,
          mode,
        })),

      restorePreviousMode: () =>
        set((state) => ({
          mode: state.previousMode || "select",
          previousMode: null,
        })),
    }),
    {
      name: "tools-store",
    }
  )
);

// ============== Selector Hooks ==============

export const useToolMode = () => useToolsStore((state) => state.mode);
export const useIsMeasuring = () => useToolsStore((state) => state.isMeasuring);
export const useMeasurePoints = () => useToolsStore((state) => state.measurePoints);
export const useIsSelecting = () => useToolsStore((state) => state.isSelecting);
export const useSelectionRect = () => useToolsStore((state) => state.selectionRect);
export const useSelectedPinIds = () => useToolsStore((state) => state.selectedPinIds);

// ============== Action Hooks ==============

export const useSetToolMode = () => useToolsStore((state) => state.setMode);
export const useStartMeasure = () => useToolsStore((state) => state.startMeasure);
export const useAddMeasurePoint = () => useToolsStore((state) => state.addMeasurePoint);
export const useRemoveLastMeasurePoint = () => useToolsStore((state) => state.removeLastMeasurePoint);
export const useClearMeasure = () => useToolsStore((state) => state.clearMeasure);
export const useFinishMeasure = () => useToolsStore((state) => state.finishMeasure);
export const useStartSelection = () => useToolsStore((state) => state.startSelection);
export const useUpdateSelection = () => useToolsStore((state) => state.updateSelection);
export const useEndSelection = () => useToolsStore((state) => state.endSelection);
export const useClearToolSelection = () => useToolsStore((state) => state.clearSelection);
export const useTogglePinSelection = () => useToolsStore((state) => state.togglePinSelection);
export const useSetMultiplePinSelection = () => useToolsStore((state) => state.setMultiplePinSelection);
export const useSetTemporaryMode = () => useToolsStore((state) => state.setTemporaryMode);
export const useRestorePreviousMode = () => useToolsStore((state) => state.restorePreviousMode);

// ============== Utility Hooks ==============

/**
 * Get the appropriate cursor for the current tool and state
 */
export function useToolCursor(isDragging = false): string {
  const mode = useToolMode();
  const isSelecting = useIsSelecting();
  const isMeasuring = useIsMeasuring();

  if (isSelecting || isMeasuring) {
    return TOOL_ACTIVE_CURSORS[mode];
  }

  return isDragging ? TOOL_ACTIVE_CURSORS[mode] : TOOL_CURSORS[mode];
}

/**
 * Calculate total distance of all measurement segments
 * Uses normalized coordinates (lat/lng) for consistent distance measurement
 * regardless of pan/zoom state.
 */
export function useMeasureTotalDistance(): { pixels: number; world: number } {
  const points = useMeasurePoints();

  if (points.length < 2) {
    return { pixels: 0, world: 0 };
  }

  let totalNormalizedDistance = 0;

  for (let i = 1; i < points.length; i++) {
    // Use normalized coordinates (lat/lng) for consistent measurement
    const dx = points[i].lng - points[i - 1].lng;
    const dy = points[i].lat - points[i - 1].lat;
    totalNormalizedDistance += Math.sqrt(dx * dx + dy * dy);
  }

  // Convert normalized distance to world units
  // Assuming a reference image size of 1000px for scaling
  const referencePixelSize = 1000;
  const pixelDistance = totalNormalizedDistance * referencePixelSize;
  const worldDistance = pixelDistance / 100; // 100px = 1 world unit

  return { pixels: pixelDistance, world: worldDistance };
}

/**
 * Get all measurement segments
 * Uses normalized coordinates (lat/lng) for consistent distance measurement
 */
export function useMeasureSegments() {
  const points = useMeasurePoints();
  const segments: MeasureSegment[] = [];

  for (let i = 1; i < points.length; i++) {
    const start = points[i - 1];
    const end = points[i];
    // Use normalized coordinates (lat/lng) for consistent measurement
    const dx = end.lng - start.lng;
    const dy = end.lat - start.lat;
    const normalizedDistance = Math.sqrt(dx * dx + dy * dy);

    // Convert to actual pixel distance using reference size
    const referencePixelSize = 1000;
    const pixelDistance = normalizedDistance * referencePixelSize;
    const worldDistance = pixelDistance / 100; // 100px = 1 world unit

    segments.push({ start, end, pixelDistance, worldDistance });
  }

  return segments;
}
