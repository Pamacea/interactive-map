import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Z_INDEX } from "@/constants/z-index";

export type FloatingPanelId = "layers" | "lore" | "filters" | "properties";

export interface FloatingPanelState {
  id: FloatingPanelId;
  isVisible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isCollapsed: boolean;
  zIndex: number;
}

interface FloatingPanelsStore {
  panels: Record<FloatingPanelId, FloatingPanelState>;
  maxZIndex: number;

  // Actions
  togglePanel: (id: FloatingPanelId) => void;
  showPanel: (id: FloatingPanelId) => void;
  hidePanel: (id: FloatingPanelId) => void;
  updatePosition: (id: FloatingPanelId, position: { x: number; y: number }) => void;
  updateSize: (id: FloatingPanelId, size: { width: number; height: number }) => void;
  toggleCollapse: (id: FloatingPanelId) => void;
  bringToFront: (id: FloatingPanelId) => void;
  resetPanel: (id: FloatingPanelId) => void;
  resetAll: () => void;
}

// Default panel configurations
const DEFAULT_PANELS: Record<FloatingPanelId, Omit<FloatingPanelState, "zIndex">> = {
  layers: {
    id: "layers",
    isVisible: false,
    position: { x: 16, y: 16 },
    size: { width: 280, height: 400 },
    isCollapsed: false,
  },
  lore: {
    id: "lore",
    isVisible: false,
    position: { x: 312, y: 16 },
    size: { width: 280, height: 400 },
    isCollapsed: false,
  },
  filters: {
    id: "filters",
    isVisible: false,
    position: { x: 16, y: 432 },
    size: { width: 280, height: 300 },
    isCollapsed: false,
  },
  properties: {
    id: "properties",
    isVisible: false,
    position: { x: 312, y: 432 },
    size: { width: 280, height: 300 },
    isCollapsed: false,
  },
};

// Create initial panels with z-index
const createInitialPanels = (): Record<FloatingPanelId, FloatingPanelState> => ({
  layers: { ...DEFAULT_PANELS.layers, zIndex: Z_INDEX.floatingPanel },
  lore: { ...DEFAULT_PANELS.lore, zIndex: Z_INDEX.floatingPanel },
  filters: { ...DEFAULT_PANELS.filters, zIndex: Z_INDEX.floatingPanel },
  properties: { ...DEFAULT_PANELS.properties, zIndex: Z_INDEX.floatingPanel },
});

export const useFloatingPanelsStore = create<FloatingPanelsStore>()(
  persist(
    (set, get) => ({
      panels: createInitialPanels(),
      maxZIndex: Z_INDEX.floatingPanel,

      togglePanel: (id) =>
        set((state) => ({
          panels: {
            ...state.panels,
            [id]: {
              ...state.panels[id],
              isVisible: !state.panels[id].isVisible,
              zIndex: state.panels[id].isVisible ? state.panels[id].zIndex : state.maxZIndex + 1,
            },
          },
          maxZIndex: state.panels[id].isVisible ? state.maxZIndex : state.maxZIndex + 1,
        })),

      showPanel: (id) =>
        set((state) => {
          if (state.panels[id].isVisible) return state;
          return {
            panels: {
              ...state.panels,
              [id]: { ...state.panels[id], isVisible: true, zIndex: state.maxZIndex + 1 },
            },
            maxZIndex: state.maxZIndex + 1,
          };
        }),

      hidePanel: (id) =>
        set((state) => ({
          panels: {
            ...state.panels,
            [id]: { ...state.panels[id], isVisible: false },
          },
        })),

      updatePosition: (id, position) =>
        set((state) => ({
          panels: {
            ...state.panels,
            [id]: { ...state.panels[id], position },
          },
        })),

      updateSize: (id, size) =>
        set((state) => ({
          panels: {
            ...state.panels,
            [id]: { ...state.panels[id], size },
          },
        })),

      toggleCollapse: (id) =>
        set((state) => ({
          panels: {
            ...state.panels,
            [id]: { ...state.panels[id], isCollapsed: !state.panels[id].isCollapsed },
          },
        })),

      bringToFront: (id) =>
        set((state) => {
          const currentZ = state.panels[id].zIndex;
          if (currentZ >= state.maxZIndex) return state;
          const newZ = state.maxZIndex + 1;
          return {
            panels: {
              ...state.panels,
              [id]: { ...state.panels[id], zIndex: newZ },
            },
            maxZIndex: newZ,
          };
        }),

      resetPanel: (id) =>
        set((state) => ({
          panels: {
            ...state.panels,
            [id]: {
              ...DEFAULT_PANELS[id],
              zIndex: Z_INDEX.floatingPanel,
            },
          },
        })),

      resetAll: () =>
        set({
          panels: createInitialPanels(),
          maxZIndex: Z_INDEX.floatingPanel,
        }),
    }),
    {
      name: "genesis-floating-panels-storage",
      partialize: (state) => ({
        panels: state.panels,
        maxZIndex: state.maxZIndex,
      }),
    }
  )
);

// Selector hooks for specific panels
export const usePanelState = (id: FloatingPanelId) =>
  useFloatingPanelsStore((state) => state.panels[id]);

export const useTogglePanel = () =>
  useFloatingPanelsStore((state) => state.togglePanel);

export const useShowPanel = () =>
  useFloatingPanelsStore((state) => state.showPanel);

export const useHidePanel = () =>
  useFloatingPanelsStore((state) => state.hidePanel);

export const useBringToFront = () =>
  useFloatingPanelsStore((state) => state.bringToFront);
