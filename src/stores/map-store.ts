import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MapLayer } from "@/types/world.type";

const SCALE_OPTIONS = ["1:1000", "1:500", "1:100"] as const;
type ScaleOption = (typeof SCALE_OPTIONS)[number];

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  zIndex: number;
  locked: boolean;
  isBaseMap?: boolean; // Special flag for base map layer
  scale: number; // Visual scale of layer content (0.5 - 2.0)
  offsetX: number; // Pixel offset from top-left (X axis)
  offsetY: number; // Pixel offset from top-left (Y axis)
}

interface MapState {
  grid: boolean;
  snap: boolean;
  scale: ScaleOption;
  layers: Layer[];
  selectedLayerId: string | null;

  // Computed values (memoized to prevent infinite loops)
  visibleLayerIds: string[];
  activeLayerIds: string[];
  baseMapVisible: boolean;

  // Layer actions
  setGrid: (value: boolean) => void;
  setSnap: (value: boolean) => void;
  setScale: (value: ScaleOption) => void;
  setLayers: (layers: Layer[]) => void;
  setSelectedLayerId: (layerId: string | null) => void;

  // Layer CRUD
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  updateLayerOpacity: (layerId: string, opacity: number) => void;
  updateLayerZIndex: (layerId: string, zIndex: number) => void;
  updateLayerScale: (layerId: string, scale: number) => void;
  updateLayerPosition: (layerId: string, offsetX: number, offsetY: number) => void;
  addLayer: (layer: Omit<Layer, "id">) => void;
  removeLayer: (layerId: string) => void;
  moveLayerUp: (layerId: string) => void;
  moveLayerDown: (layerId: string) => void;

  // Base map layer actions
  toggleBaseMapVisibility: () => void;

  reset: () => void;
}

const initialState = {
  grid: false,
  snap: false,
  scale: "1:1000" as ScaleOption,
  layers: [
    {
      id: "base-map",
      name: "Base Map",
      visible: true,
      opacity: 1,
      zIndex: 0,
      locked: true,
      isBaseMap: true,
      scale: 1.0,
      offsetX: 0,
      offsetY: 0,
    },
  ] as Layer[],
  selectedLayerId: null as string | null,
  visibleLayerIds: ["base-map"],
  activeLayerIds: [] as string[],
  baseMapVisible: true,
};

export const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setGrid: (value) => set({ grid: value }),

      setSnap: (value) => set({ snap: value }),

      setScale: (value) => set({ scale: value }),

      setLayers: (layers) =>
        set(() => {
          const newVisibleLayerIds = layers
            .filter((l) => l.visible)
            .map((l) => l.id);
          const newActiveLayerIds = layers
            .filter((l) => !l.locked)
            .map((l) => l.id);
          const baseMapLayer = layers.find((l) => l.isBaseMap);
          const newBaseMapVisible = baseMapLayer?.visible ?? true;

          return {
            layers,
            visibleLayerIds: newVisibleLayerIds,
            activeLayerIds: newActiveLayerIds,
            baseMapVisible: newBaseMapVisible,
          };
        }),

      setSelectedLayerId: (layerId) => set({ selectedLayerId: layerId }),

      toggleLayerVisibility: (layerId) =>
        set((state) => {
          const newLayers = state.layers.map((layer) =>
            layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
          );
          const newVisibleLayerIds = newLayers
            .filter((layer) => layer.visible)
            .map((layer) => layer.id);
          const baseMapLayer = newLayers.find((l) => l.isBaseMap);
          const newBaseMapVisible = baseMapLayer?.visible ?? true;
          return {
            layers: newLayers,
            visibleLayerIds: newVisibleLayerIds,
            baseMapVisible: newBaseMapVisible,
          };
        }),

      toggleLayerLock: (layerId) =>
        set((state) => {
          const newLayers = state.layers.map((layer) =>
            layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
          );
          const newActiveLayerIds = newLayers
            .filter((layer) => !layer.locked)
            .map((layer) => layer.id);
          return {
            layers: newLayers,
            activeLayerIds: newActiveLayerIds,
          };
        }),

      updateLayerOpacity: (layerId, opacity) =>
        set((state) => ({
          layers: state.layers.map((layer) =>
            layer.id === layerId ? { ...layer, opacity } : layer
          ),
        })),

      updateLayerZIndex: (layerId, zIndex) =>
        set((state) => ({
          layers: state.layers.map((layer) =>
            layer.id === layerId ? { ...layer, zIndex } : layer
          ),
        })),

      updateLayerScale: (layerId, scale) =>
        set((state) => ({
          layers: state.layers.map((layer) =>
            layer.id === layerId ? { ...layer, scale } : layer
          ),
        })),

      updateLayerPosition: (layerId, offsetX, offsetY) =>
        set((state) => {
          // Prevent moving base map layer
          const layer = state.layers.find((l) => l.id === layerId);
          if (layer?.isBaseMap) {
            console.warn("Cannot move base map layer");
            return state;
          }

          return {
            layers: state.layers.map((l) =>
              l.id === layerId ? { ...l, offsetX, offsetY } : l
            ),
          };
        }),

      addLayer: (layer) =>
        set((state) => {
          const newLayer = { ...layer, id: crypto.randomUUID(), offsetX: 0, offsetY: 0 };
          const newLayers = [...state.layers, newLayer];
          const newVisibleLayerIds = newLayers
            .filter((l) => l.visible)
            .map((l) => l.id);
          const newActiveLayerIds = newLayers
            .filter((l) => !l.locked)
            .map((l) => l.id);
          return {
            layers: newLayers,
            visibleLayerIds: newVisibleLayerIds,
            activeLayerIds: newActiveLayerIds,
          };
        }),

      removeLayer: (layerId) =>
        set((state) => {
          const newLayers = state.layers.filter((layer) => layer.id !== layerId);
          const newVisibleLayerIds = newLayers
            .filter((l) => l.visible)
            .map((l) => l.id);
          const newActiveLayerIds = newLayers
            .filter((l) => l.locked === false)
            .map((l) => l.id);
          return {
            layers: newLayers,
            visibleLayerIds: newVisibleLayerIds,
            activeLayerIds: newActiveLayerIds,
            // Clear selection if removed layer was selected
            selectedLayerId:
              state.selectedLayerId === layerId ? null : state.selectedLayerId,
          };
        }),

      moveLayerUp: (layerId) =>
        set((state) => {
          const index = state.layers.findIndex((l) => l.id === layerId);
          if (index === 0) return state;
          const newLayers = [...state.layers];
          [newLayers[index - 1], newLayers[index]] = [
            newLayers[index],
            newLayers[index - 1],
          ];
          const newVisibleLayerIds = newLayers
            .filter((l) => l.visible)
            .map((l) => l.id);
          const newActiveLayerIds = newLayers
            .filter((l) => !l.locked)
            .map((l) => l.id);
          return {
            layers: newLayers,
            visibleLayerIds: newVisibleLayerIds,
            activeLayerIds: newActiveLayerIds,
          };
        }),

      moveLayerDown: (layerId) =>
        set((state) => {
          const index = state.layers.findIndex((l) => l.id === layerId);
          if (index === state.layers.length - 1) return state;
          const newLayers = [...state.layers];
          [newLayers[index], newLayers[index + 1]] = [
            newLayers[index + 1],
            newLayers[index],
          ];
          const newVisibleLayerIds = newLayers
            .filter((l) => l.visible)
            .map((l) => l.id);
          const newActiveLayerIds = newLayers
            .filter((l) => !l.locked)
            .map((l) => l.id);
          return {
            layers: newLayers,
            visibleLayerIds: newVisibleLayerIds,
            activeLayerIds: newActiveLayerIds,
          };
        }),

      toggleBaseMapVisibility: () =>
        set((state) => {
          const baseMapLayer = state.layers.find((l) => l.isBaseMap);
          if (!baseMapLayer) return state;

          const newLayers = state.layers.map((layer) =>
            layer.isBaseMap ? { ...layer, visible: !layer.visible } : layer
          );
          const newVisibleLayerIds = newLayers
            .filter((l) => l.visible)
            .map((l) => l.id);
          const newBaseMapVisible = !baseMapLayer.visible;

          return {
            layers: newLayers,
            visibleLayerIds: newVisibleLayerIds,
            baseMapVisible: newBaseMapVisible,
          };
        }),

      reset: () => set(initialState),
    }),
    {
      name: "map-storage",
    }
  )
);

// Selector hooks for optimized re-renders
export const useGrid = () => useMapStore((state) => state.grid);
export const useSnap = () => useMapStore((state) => state.snap);
export const useScale = () => useMapStore((state) => state.scale);
export const useLayers = () => useMapStore((state) => state.layers);
export const useSelectedLayerId = () =>
  useMapStore((state) => state.selectedLayerId);
export const useVisibleLayerIds = () =>
  useMapStore((state) => state.visibleLayerIds);
export const useActiveLayerIds = () =>
  useMapStore((state) => state.activeLayerIds);
export const useBaseMapVisible = () =>
  useMapStore((state) => state.baseMapVisible);
export const useLayerPosition = (layerId: string) =>
  useMapStore((state) => {
    const layer = state.layers.find((l) => l.id === layerId);
    return { offsetX: layer?.offsetX ?? 0, offsetY: layer?.offsetY ?? 0 };
  });
