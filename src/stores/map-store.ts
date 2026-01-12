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
}

interface MapState {
  grid: boolean;
  snap: boolean;
  scale: ScaleOption;
  layers: Layer[];
  setGrid: (value: boolean) => void;
  setSnap: (value: boolean) => void;
  setScale: (value: ScaleOption) => void;
  setLayers: (layers: Layer[]) => void;
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  updateLayerOpacity: (layerId: string, opacity: number) => void;
  updateLayerZIndex: (layerId: string, zIndex: number) => void;
  addLayer: (layer: Omit<Layer, "id">) => void;
  removeLayer: (layerId: string) => void;
  moveLayerUp: (layerId: string) => void;
  moveLayerDown: (layerId: string) => void;
  reset: () => void;
}

const initialState = {
  grid: false,
  snap: false,
  scale: "1:1000" as ScaleOption,
  layers: [] as Layer[],
};

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      ...initialState,

      setGrid: (value) => set({ grid: value }),

      setSnap: (value) => set({ snap: value }),

      setScale: (value) => set({ scale: value }),

      setLayers: (layers) => set({ layers }),

      toggleLayerVisibility: (layerId) =>
        set((state) => ({
          layers: state.layers.map((layer) =>
            layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
          ),
        })),

      toggleLayerLock: (layerId) =>
        set((state) => ({
          layers: state.layers.map((layer) =>
            layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
          ),
        })),

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

      addLayer: (layer) =>
        set((state) => ({
          layers: [
            ...state.layers,
            { ...layer, id: crypto.randomUUID() },
          ],
        })),

      removeLayer: (layerId) =>
        set((state) => ({
          layers: state.layers.filter((layer) => layer.id !== layerId),
        })),

      moveLayerUp: (layerId) =>
        set((state) => {
          const index = state.layers.findIndex((l) => l.id === layerId);
          if (index === 0) return state;
          const newLayers = [...state.layers];
          [newLayers[index - 1], newLayers[index]] = [newLayers[index], newLayers[index - 1]];
          return { layers: newLayers };
        }),

      moveLayerDown: (layerId) =>
        set((state) => {
          const index = state.layers.findIndex((l) => l.id === layerId);
          if (index === state.layers.length - 1) return state;
          const newLayers = [...state.layers];
          [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
          return { layers: newLayers };
        }),

      reset: () => set(initialState),
    }),
    {
      name: "map-storage",
    }
  )
);

export const useGrid = () => useMapStore((state) => state.grid);
export const useSnap = () => useMapStore((state) => state.snap);
export const useScale = () => useMapStore((state) => state.scale);
export const useLayers = () => useMapStore((state) => state.layers);
