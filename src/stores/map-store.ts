import { create } from "zustand";
import { devtools } from "zustand/middleware";

const _SCALE_OPTIONS = ["1:1000", "1:500", "1:100"] as const;
type ScaleOption = (typeof SCALE_OPTIONS)[number];

export type LayerType = "BASE_MAP" | "MARKERS" | "IMAGES" | "REGIONS" | "GROUP" | "CUSTOM";

export interface LayerContentCounts {
  pins: number;
  images: number;
  regions: number;
  total: number;
}

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  opacity: number;
  zIndex: number;
  locked: boolean;
  isBaseMap?: boolean; // Special flag for base map layer (derived from type === BASE_MAP)
  scale: number; // Visual scale of layer content (0.5 - 2.0)
  offsetX: number; // Pixel offset from top-left (X axis)
  offsetY: number; // Pixel offset from top-left (Y axis)
  minZoom: number; // Minimum zoom % for layer visibility (0-200)
  maxZoom: number; // Maximum zoom % for layer visibility (0-200)
  // Content counts (cached from server)
  contentCounts?: LayerContentCounts;
}

interface MapState {
  grid: boolean;
  snap: boolean;
  scale: ScaleOption;
  zoom: number;
  layers: Layer[];
  selectedLayerId: string | null;
  activeLayerId: string | null; // Currently active layer for adding new items
  backgroundColor: string;

  // Computed values (memoized to prevent infinite loops)
  visibleLayerIds: string[];
  activeLayerIds: string[];
  baseMapVisible: boolean;

  // Server sync state
  worldId: string | null;

  // Layer actions
  setGrid: (value: boolean) => void;
  setSnap: (value: boolean) => void;
  setScale: (value: ScaleOption) => void;
  setZoom: (value: number) => void;
  setBackgroundColor: (color: string) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setLayers: (layers: Layer[]) => void;
  setSelectedLayerId: (layerId: string | null) => void;
  setActiveLayerId: (layerId: string | null) => void;

  // Layer CRUD
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  updateLayerOpacity: (layerId: string, opacity: number) => void;
  updateLayerZIndex: (layerId: string, zIndex: number) => void;
  updateLayerScale: (layerId: string, scale: number) => void;
  updateLayerPosition: (layerId: string, offsetX: number, offsetY: number) => void;
  updateLayerMinZoom: (layerId: string, minZoom: number) => void;
  updateLayerMaxZoom: (layerId: string, maxZoom: number) => void;
  resetLayerZoom: (layerId: string) => void;
  updateLayerType: (layerId: string, type: LayerType) => void;
  updateLayerContentCounts: (layerId: string, counts: LayerContentCounts) => void;
  addLayer: (layer: Omit<Layer, "id">) => Layer | null;
  addLayerFromServer: (layer: Layer) => void;
  removeLayer: (layerId: string) => void;
  moveLayerUp: (layerId: string) => void;
  moveLayerDown: (layerId: string) => void;

  // Base map layer actions
  toggleBaseMapVisibility: () => void;

  // World management
  setWorldId: (worldId: string | null) => void;
  initializeLayers: (layers: Layer[]) => void;

  reset: () => void;
}

const initialState = {
  grid: false,
  snap: false,
  scale: "1:1000" as ScaleOption,
  zoom: 1.0,
  backgroundColor: "#1a1a1a",
  layers: [] as Layer[], // Start empty - layers will be loaded from server
  selectedLayerId: null as string | null,
  activeLayerId: null as string | null,
  visibleLayerIds: [] as string[],
  activeLayerIds: [] as string[],
  baseMapVisible: true,
  worldId: null as string | null,
};

export const useMapStore = create<MapState>()(
  devtools(
    (set, _get) => ({
      ...initialState,

      setGrid: (value) => set({ grid: value }),

      setSnap: (value) => set({ snap: value }),

      setScale: (value) => set({ scale: value }),

      setBackgroundColor: (color) => set({ backgroundColor: color }),

      setLayers: (layers) =>
        set((state) => {
          // Always ensure there's a base map layer at the bottom
          const hasBaseMap = layers.some((l) => l.isBaseMap || l.type === "BASE_MAP");
          let finalLayers = [...layers];
          if (!hasBaseMap && state.worldId) {
            // Add base map layer if it doesn't exist
            finalLayers = [{
              id: "base-map",
              name: "Base Map",
              type: "BASE_MAP" as LayerType,
              visible: true,
              opacity: 1,
              zIndex: 0,
              locked: true,
              isBaseMap: true,
              scale: 1.0,
              offsetX: 0,
              offsetY: 0,
              minZoom: 0,
              maxZoom: 200,
              contentCounts: { pins: 0, images: 0, regions: 0, total: 0 },
            }, ...layers];
          }

          // Remove any duplicate layer entries by keeping unique IDs
          const uniqueLayers = finalLayers.filter((layer, index, self) =>
            index === self.findIndex((l) => l.id === layer.id)
          );

          // Sort by zIndex
          uniqueLayers.sort((a, b) => a.zIndex - b.zIndex);

          const newVisibleLayerIds = uniqueLayers
            .filter((l) => l.visible)
            .map((l) => l.id);
          const newActiveLayerIds = uniqueLayers
            .filter((l) => !l.locked)
            .map((l) => l.id);
          const baseMapLayer = uniqueLayers.find((l) => l.isBaseMap || l.type === "BASE_MAP");
          const newBaseMapVisible = baseMapLayer?.visible ?? true;

          // Auto-select first non-base layer as active if none selected
          const firstActiveLayer = uniqueLayers.find((l) => !l.locked && !l.isBaseMap);
          const newActiveLayerId = state.activeLayerId ?? firstActiveLayer?.id ?? null;

          return {
            layers: uniqueLayers,
            visibleLayerIds: newVisibleLayerIds,
            activeLayerIds: newActiveLayerIds,
            baseMapVisible: newBaseMapVisible,
            activeLayerId: newActiveLayerId,
          };
        }),

      setSelectedLayerId: (layerId) => set({ selectedLayerId: layerId }),

      setActiveLayerId: (layerId) => set({ activeLayerId: layerId }),

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
          if (layer?.isBaseMap || layer?.type === "BASE_MAP") {
            console.warn("Cannot move base map layer");
            return state;
          }

          return {
            layers: state.layers.map((l) =>
              l.id === layerId ? { ...l, offsetX, offsetY } : l
            ),
          };
        }),

      updateLayerMinZoom: (layerId, minZoom) =>
        set((state) => ({
          layers: state.layers.map((layer) =>
            layer.id === layerId ? { ...layer, minZoom } : layer
          ),
        })),

      updateLayerMaxZoom: (layerId, maxZoom) =>
        set((state) => ({
          layers: state.layers.map((layer) =>
            layer.id === layerId ? { ...layer, maxZoom } : layer
          ),
        })),

      resetLayerZoom: (layerId) =>
        set((state) => ({
          layers: state.layers.map((layer) =>
            layer.id === layerId ? { ...layer, minZoom: 0, maxZoom: 200 } : layer
          ),
        })),

      updateLayerType: (layerId, type) =>
        set((state) => ({
          layers: state.layers.map((layer) =>
            layer.id === layerId
              ? { ...layer, type, isBaseMap: type === "BASE_MAP" }
              : layer
          ),
        })),

      updateLayerContentCounts: (layerId, contentCounts) =>
        set((state) => ({
          layers: state.layers.map((layer) =>
            layer.id === layerId ? { ...layer, contentCounts } : layer
          ),
        })),

      addLayer: (layer) =>
        set((state) => {
          const newLayer = {
            ...layer,
            id: crypto.randomUUID(),
            offsetX: layer.offsetX ?? 0,
            offsetY: layer.offsetY ?? 0,
            minZoom: layer.minZoom ?? 0,
            maxZoom: layer.maxZoom ?? 200,
          };
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
            // Auto-select the new layer as active
            activeLayerId: newLayer.id,
          };
        }),

      addLayerFromServer: (layer) =>
        set((state) => {
          // Only add if not already present
          if (state.layers.find((l) => l.id === layer.id)) {
            // Update existing layer
            return {
              layers: state.layers.map((l) =>
                l.id === layer.id ? { ...l, ...layer } : l
              ),
            };
          }
          const newLayers = [...state.layers, layer].sort((a, b) => a.zIndex - b.zIndex);
          const newVisibleLayerIds = newLayers
            .filter((l) => l.visible)
            .map((l) => l.id);
          const newActiveLayerIds = newLayers
            .filter((l) => !l.locked)
            .map((l) => l.id);
          // Auto-select first active layer if none selected
          const firstActiveLayer = newLayers.find((l) => !l.locked && !l.isBaseMap);
          return {
            layers: newLayers,
            visibleLayerIds: newVisibleLayerIds,
            activeLayerIds: newActiveLayerIds,
            activeLayerId: state.activeLayerId ?? firstActiveLayer?.id ?? null,
          };
        }),

      removeLayer: (layerId) =>
        set((state) => {
          const layerToRemove = state.layers.find((l) => l.id === layerId);
          // Don't allow removing base map layer
          if (layerToRemove?.isBaseMap || layerToRemove?.type === "BASE_MAP") {
            return state;
          }
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
            // Clear active layer if it was the removed one
            activeLayerId:
              state.activeLayerId === layerId ? null : state.activeLayerId,
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

      setZoom: (value: number) => set({ zoom: Math.max(0.1, Math.min(5, value)) }),
      zoomIn: () => set((state) => ({ zoom: Math.min(state.zoom * 1.2, 5) })),
      zoomOut: () => set((state) => ({ zoom: Math.max(state.zoom / 1.2, 0.1) })),
      resetZoom: () => set((_state) => ({ zoom: 1.0 })),

      setWorldId: (worldId) => set({ worldId }),

      initializeLayers: (layers) =>
        set((state) => {
          // Idempotency check: if layers are already initialized with same data, skip
          if (state.layers.length === layers.length &&
              state.layers.every((l, i) => l.id === layers[i]?.id)) {
            return state;
          }

          // Ensure there's always a base map layer
          const hasBaseMap = layers.some((l) => l.isBaseMap || l.type === "BASE_MAP");
          let finalLayers = [...layers];
          if (!hasBaseMap) {
            finalLayers = [{
              id: "base-map",
              name: "Base Map",
              type: "BASE_MAP" as LayerType,
              visible: true,
              opacity: 1,
              zIndex: 0,
              locked: true,
              isBaseMap: true,
              scale: 1.0,
              offsetX: 0,
              offsetY: 0,
              minZoom: 0,
              maxZoom: 200,
              contentCounts: { pins: 0, images: 0, regions: 0, total: 0 },
            }, ...layers];
          }

          // Remove any duplicate base-map entries by keeping unique IDs
          // Additionally, prevent multiple base-map layers with different IDs
          const baseMapLayers = finalLayers.filter((l) => l.isBaseMap || l.type === "BASE_MAP");
          const uniqueLayers = finalLayers.filter((layer, index, self) => {
            // For base-map layers, only keep the first one (prefer "base-map" id)
            if ((layer.isBaseMap || layer.type === "BASE_MAP") && layer.id !== "base-map") {
              return baseMapLayers.findIndex((l) => l.id === "base-map") >= 0 ? false :
                     index === self.findIndex((l) => l.id === layer.id);
            }
            return index === self.findIndex((l) => l.id === layer.id);
          });

          // Sort by zIndex
          uniqueLayers.sort((a, b) => a.zIndex - b.zIndex);

          const newVisibleLayerIds = uniqueLayers
            .filter((l) => l.visible)
            .map((l) => l.id);
          const newActiveLayerIds = uniqueLayers
            .filter((l) => !l.locked)
            .map((l) => l.id);
          const baseMapLayer = uniqueLayers.find((l) => l.isBaseMap || l.type === "BASE_MAP");
          const newBaseMapVisible = baseMapLayer?.visible ?? true;

          // Auto-select first non-base layer as active if none selected
          const firstActiveLayer = uniqueLayers.find((l) => !l.locked && !l.isBaseMap);
          const newActiveLayerId = state.activeLayerId ?? firstActiveLayer?.id ?? null;

          return {
            layers: uniqueLayers,
            visibleLayerIds: newVisibleLayerIds,
            activeLayerIds: newActiveLayerIds,
            baseMapVisible: newBaseMapVisible,
            activeLayerId: newActiveLayerId,
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
export const useZoom = () => useMapStore((state) => state.zoom);
export const useBackgroundColor = () => useMapStore((state) => state.backgroundColor);
export const useLayers = () => useMapStore((state) => state.layers);
export const useSelectedLayerId = () =>
  useMapStore((state) => state.selectedLayerId);
export const useActiveLayerId = () =>
  useMapStore((state) => state.activeLayerId);
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

// Layer-specific hooks
export const useLayerById = (layerId: string) =>
  useMapStore((state) => state.layers.find((l) => l.id === layerId));

export const useBaseMapLayer = () =>
  useMapStore((state) =>
    state.layers.find((l) => l.isBaseMap || l.type === "BASE_MAP")
  );
