import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Z_INDEX } from "@/constants/z-index";

export type FloatingPanelId = "layers" | "lore" | "characters" | "filters" | "properties" | "members";

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
    size: { width: 320, height: 450 },
    isCollapsed: false,
  },
  lore: {
    id: "lore",
    isVisible: false,
    position: { x: 352, y: 16 },
    size: { width: 400, height: 550 },
    isCollapsed: false,
  },
  characters: {
    id: "characters",
    isVisible: false,
    position: { x: 16, y: 482 },
    size: { width: 350, height: 500 },
    isCollapsed: false,
  },
  filters: {
    id: "filters",
    isVisible: false,
    position: { x: 376, y: 482 },
    size: { width: 280, height: 300 },
    isCollapsed: false,
  },
  properties: {
    id: "properties",
    isVisible: false,
    position: { x: 680, y: 482 },
    size: { width: 320, height: 400 },
    isCollapsed: false,
  },
  members: {
    id: "members",
    isVisible: false,
    position: { x: 680, y: 16 },
    size: { width: 280, height: 350 },
    isCollapsed: false,
  },
};

// Helper function to safely get or initialize a panel
const getOrInitPanel = (
  panels: Record<FloatingPanelId, FloatingPanelState>,
  id: FloatingPanelId
): FloatingPanelState => {
  if (panels[id]) {
    return panels[id];
  }
  const defaultPanel = DEFAULT_PANELS[id];
  if (!defaultPanel) {
    throw new Error(`Unknown panel id: ${id}`);
  }
  return { ...defaultPanel, zIndex: Z_INDEX.activeFloatingPanel };
};

// Create initial panels with z-index (above header)
const createInitialPanels = (): Record<FloatingPanelId, FloatingPanelState> => ({
  layers: { ...DEFAULT_PANELS.layers, zIndex: Z_INDEX.activeFloatingPanel },
  lore: { ...DEFAULT_PANELS.lore, zIndex: Z_INDEX.activeFloatingPanel },
  characters: { ...DEFAULT_PANELS.characters, zIndex: Z_INDEX.activeFloatingPanel },
  filters: { ...DEFAULT_PANELS.filters, zIndex: Z_INDEX.activeFloatingPanel },
  properties: { ...DEFAULT_PANELS.properties, zIndex: Z_INDEX.activeFloatingPanel },
  members: { ...DEFAULT_PANELS.members, zIndex: Z_INDEX.activeFloatingPanel },
});

export const useFloatingPanelsStore = create<FloatingPanelsStore>()(
  persist(
    (set, get) => ({
      panels: createInitialPanels(),
      maxZIndex: Z_INDEX.activeFloatingPanel,

      togglePanel: (id) =>
        set((state) => {
          const panel = getOrInitPanel(state.panels, id);
          return {
            panels: {
              ...state.panels,
              [id]: {
                ...panel,
                isVisible: !panel.isVisible,
                zIndex: panel.isVisible ? panel.zIndex : state.maxZIndex + 1,
              },
            },
            maxZIndex: panel.isVisible ? state.maxZIndex : state.maxZIndex + 1,
          };
        }),

      showPanel: (id) =>
        set((state) => {
          const panel = getOrInitPanel(state.panels, id);
          if (panel.isVisible) return state;
          return {
            panels: {
              ...state.panels,
              [id]: { ...panel, isVisible: true, zIndex: state.maxZIndex + 1 },
            },
            maxZIndex: state.maxZIndex + 1,
          };
        }),

      hidePanel: (id) =>
        set((state) => {
          const panel = getOrInitPanel(state.panels, id);
          return {
            panels: {
              ...state.panels,
              [id]: { ...panel, isVisible: false },
            },
          };
        }),

      updatePosition: (id, position) =>
        set((state) => {
          const panel = getOrInitPanel(state.panels, id);
          return {
            panels: {
              ...state.panels,
              [id]: { ...panel, position },
            },
          };
        }),

      updateSize: (id, size) =>
        set((state) => {
          const panel = getOrInitPanel(state.panels, id);
          return {
            panels: {
              ...state.panels,
              [id]: { ...panel, size },
            },
          };
        }),

      toggleCollapse: (id) =>
        set((state) => {
          const panel = getOrInitPanel(state.panels, id);
          return {
            panels: {
              ...state.panels,
              [id]: { ...panel, isCollapsed: !panel.isCollapsed },
            },
          };
        }),

      bringToFront: (id) =>
        set((state) => {
          const panel = getOrInitPanel(state.panels, id);
          const currentZ = panel.zIndex;
          if (currentZ >= state.maxZIndex) return state;
          const newZ = state.maxZIndex + 1;
          return {
            panels: {
              ...state.panels,
              [id]: { ...panel, zIndex: newZ },
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
              zIndex: Z_INDEX.activeFloatingPanel,
            },
          },
        })),

      resetAll: () =>
        set({
          panels: createInitialPanels(),
          maxZIndex: Z_INDEX.activeFloatingPanel,
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

// Create memoized default panel states to avoid infinite loop warnings
const DEFAULT_PANELS_WITH_ZINDEX: Record<FloatingPanelId, FloatingPanelState> = {
  layers: { ...DEFAULT_PANELS.layers, zIndex: Z_INDEX.activeFloatingPanel },
  lore: { ...DEFAULT_PANELS.lore, zIndex: Z_INDEX.activeFloatingPanel },
  characters: { ...DEFAULT_PANELS.characters, zIndex: Z_INDEX.activeFloatingPanel },
  filters: { ...DEFAULT_PANELS.filters, zIndex: Z_INDEX.activeFloatingPanel },
  properties: { ...DEFAULT_PANELS.properties, zIndex: Z_INDEX.activeFloatingPanel },
  members: { ...DEFAULT_PANELS.members, zIndex: Z_INDEX.activeFloatingPanel },
};

// Selector hooks for specific panels
// Note: Use memoized defaultPanel with zIndex as fallback in case store is not hydrated yet
export const usePanelState = (id: FloatingPanelId) =>
  useFloatingPanelsStore((state) => {
    const panel = state.panels[id];
    if (!panel) {
      return DEFAULT_PANELS_WITH_ZINDEX[id];
    }
    return panel;
  });

export const useTogglePanel = () =>
  useFloatingPanelsStore((state) => state.togglePanel);

export const useShowPanel = () =>
  useFloatingPanelsStore((state) => state.showPanel);

export const useHidePanel = () =>
  useFloatingPanelsStore((state) => state.hidePanel);

export const useBringToFront = () =>
  useFloatingPanelsStore((state) => state.bringToFront);
