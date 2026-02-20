import { useMemo, useEffect } from "react";
import { usePins, useCreatePin, useSelectedPin, useSelectPin } from "@/features/pins/store";
import { useIsCreatingPin, useClearSelection, useStopCreating, useStartCreating } from "@/features/pins/store";
import { useMapStore } from "@/features/world-editor/store/map-store";
import { useMapPan } from "./use-map-pan";
import { useMapZoom } from "./use-map-zoom";
import { useMapImage } from "./use-map-image";
import { useMapInteractions } from "./use-map-interactions";
import { useMapHandlers } from "./use-map-handlers";
import { useMapWheel } from "./use-map-wheel";
import { usePinsFiltering } from "./use-pins-filtering";
import { useToolsManager } from "./tools/use-tools-manager";
import { useRegionsInMap } from "./use-regions-in-map";
import type { Transform } from "./use-map-pan";

const GRID_SIZE = 40;

export interface UseMapEventsOptions {
  mapImage?: string | null;
  worldId?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  layers: Array<{
    id: string;
    visible: boolean;
    zIndex: number;
    isBaseMap?: boolean;
    scale?: number;
    offsetX?: number;
    offsetY?: number;
  }>;
  selectedLayerId: string | null;
  baseMapVisible: boolean;
  grid: boolean;
  scale: string;
}

export interface MapEventsResult {
  // Transform state
  transform: Transform;
  isDragging: boolean;
  // Image state
  imageRef: React.RefObject<HTMLImageElement | HTMLDivElement | null>;
  imageError: boolean;
  imageLoaded: boolean;
  imageDimensions: { width: number; height: number } | null;
  shouldShowGrid: boolean;
  // Pin state
  visiblePins: Array<any>;
  selectedPin: any;
  isCreatingPin: boolean;
  // Event handlers
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: (e: React.MouseEvent) => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  resetTransform: () => void;
  centerToPin: (
    pinX: number,
    pinY: number,
    imageWidth: number,
    imageHeight: number,
    containerRef: React.RefObject<HTMLDivElement | null>
  ) => void;
  handleClick: (e: React.MouseEvent) => void;
  handleContextMenu: (e: React.MouseEvent) => void;
  handlePinClick: (pin: any) => void;
  handlePopupClose: () => void;
  handleImageLoad: () => void;
  handleImageError: () => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleKeyUp: (e: KeyboardEvent) => void;
  // Context menu
  contextMenu: { position: { x: number; y: number }; coordinates: { lat: number; lng: number } } | null;
  closeContextMenu: () => void;
  handleSelectPinType: (pinType: string, lat: number, lng: number) => void;
  // Computed values
  getGridSize: () => number;
  layerScale: number;
  centerOnPin: (pinId: string) => void;
  // Tool cursor
  toolCursor: string;
}

/**
 * Hook to manage all map events and state
 * Consolidates map pan, zoom, interactions, and pin logic
 */
export function useMapEvents(options: UseMapEventsOptions): MapEventsResult {
  const {
    mapImage,
    worldId,
    containerRef,
    layers,
    selectedLayerId,
    baseMapVisible: _baseMapVisible,
    grid: _grid,
    scale,
  } = options;

  const baseMapLayer = layers.find((l) => l.isBaseMap);

  // Pin state
  const pins = usePins();
  const createPin = useCreatePin();
  const selectedPin = useSelectedPin();
  const isCreatingPin = useIsCreatingPin();
  const selectPin = useSelectPin();
  const clearSelection = useClearSelection();
  const stopCreating = useStopCreating();
  const startCreating = useStartCreating();
  const activeLayerId = useMapStore((state) => state.activeLayerId);

  // Pan and zoom
  const {
    transform,
    isDragging,
    reset: resetTransform,
    setTransform,
    centerToPin,
  } = useMapPan({ isCreatingPin });

  const { handleZoomIn, handleZoomOut } = useMapZoom(transform, setTransform);

  useMapWheel({ containerRef, transform, setTransform });

  // Image loading
  const {
    imageRef,
    imageError,
    imageLoaded,
    imageDimensions,
    shouldShowGrid,
    handleImageLoad,
    handleImageError,
  } = useMapImage(mapImage);

  // Pin filtering
  const { visiblePins } = usePinsFiltering({ pins, layers, transform });

  // Map interactions (for context menu)
  const {
    contextMenu,
    closeContextMenu,
    handleSelectPinType,
  } = useMapInteractions({
    worldId,
    selectedPin,
    isCreatingPin,
    transform,
    imageDimensions,
    containerRef,
    onCreatePin: (data) => {
      createPin({
        ...data,
        layerId: activeLayerId || undefined,
      });
    },
    onCloseContextMenu: () => {},
    onStopCreating: stopCreating,
    onSelectPin: selectPin,
    onClearSelection: clearSelection,
  });

  // Map handlers
  const { handlePinClick, handlePopupClose } = useMapHandlers({
    isCreatingPin,
    selectPin,
    clearSelection,
    stopCreating,
    startCreating,
  });

  // Regions management for region creation via Area tool
  const regionsManager = useRegionsInMap({
    worldId,
    layers,
  });

  // Tools manager - handles all tool interactions
  const toolsManager = useToolsManager({
    worldId,
    containerRef,
    imageDimensions,
    transform,
    visiblePins,
    visibleRegions: regionsManager.regions,
    selectedLayerId,
    onCreatePin: (data) => {
      createPin({
        ...data,
        layerId: activeLayerId || undefined,
      });
    },
    onCreateRegion: (coords) => {
      // Pass the active layer ID to createRegionFromArea
      regionsManager.createRegionFromArea(activeLayerId || "", coords);
    },
    onPinClick: selectPin,
    onRegionClick: regionsManager.selectRegion,
    onClearSelection: clearSelection,
  });

  // Register keyboard handlers from tools manager
  useEffect(() => {
    window.addEventListener("keydown", toolsManager.handleKeyDown);
    window.addEventListener("keyup", toolsManager.handleKeyUp);
    return () => {
      window.removeEventListener("keydown", toolsManager.handleKeyDown);
      window.removeEventListener("keyup", toolsManager.handleKeyUp);
    };
  }, [toolsManager.handleKeyDown, toolsManager.handleKeyUp]);

  // Grid size calculation
  const getGridSize = (): number => {
    const scaleRatio = parseInt(scale.split(":")[1]);
    return GRID_SIZE * (1000 / scaleRatio);
  };

  // Layer scale
  const layerScale = baseMapLayer?.scale ?? 1;

  // Center on pin function (exposed via context)
  const centerOnPin = useMemo(() => {
    return (pinId: string) => {
      const pin = pins.find((p) => p.id === pinId);
      if (!pin || !imageDimensions || !containerRef.current) return;

      // Calculate pin position using the same logic as the marker
      const layer = layers.find((l) => l.id === pin.layerId);
      const layerOffsetX = layer?.offsetX ?? 0;
      const layerOffsetY = layer?.offsetY ?? 0;

      // Convert lat/lng to pixel coordinates
      const pinX = pin.longitude * imageDimensions.width + layerOffsetX;
      const pinY = pin.latitude * imageDimensions.height + layerOffsetY;

      // Call the centering function from useMapPan
      centerToPin(
        pinX,
        pinY,
        imageDimensions.width,
        imageDimensions.height,
        containerRef
      );
    };
  }, [pins, imageDimensions, layers, centerToPin, containerRef]);

  return {
    transform,
    isDragging,
    imageRef,
    imageError,
    imageLoaded,
    imageDimensions,
    shouldShowGrid,
    visiblePins,
    selectedPin,
    isCreatingPin,
    handleMouseDown: toolsManager.handleMapMouseDown,
    handleMouseMove: toolsManager.handleMapMouseMove,
    handleMouseUp: toolsManager.handleMapMouseUp,
    handleZoomIn,
    handleZoomOut,
    resetTransform,
    centerToPin,
    handleClick: toolsManager.handleMapClick,
    handleContextMenu: toolsManager.handleMapContextMenu,
    handlePinClick,
    handlePopupClose,
    handleImageLoad,
    handleImageError,
    handleKeyDown: toolsManager.handleKeyDown,
    handleKeyUp: toolsManager.handleKeyUp,
    contextMenu,
    closeContextMenu,
    handleSelectPinType,
    getGridSize,
    layerScale,
    centerOnPin,
    toolCursor: toolsManager.cursor,
  };
}
