"use client";

import { useRef, useMemo, useEffect } from "react";
import { useGrid, useScale, useLayers, useSelectedLayerId, useBaseMapVisible, useMapStore } from "@/stores/map-store";
import { usePins } from "@/stores/pins/use-pins-data-store";
import { useCreatePin } from "@/stores/pins/use-pins-data-store";
import { useSelectedPin } from "@/stores/use-pins-store";
import { useIsCreatingPin } from "@/stores/pins/use-pins-ui-store";
import { useSelectPin } from "@/stores/pins/use-pins-ui-store";
import { useClearSelection } from "@/stores/pins/use-pins-ui-store";
import { useStopCreating } from "@/stores/pins/use-pins-ui-store";
import { useStartCreating } from "@/stores/pins/use-pins-ui-store";
import { PinContextMenu } from "@/components/pins/ui/pin-context-menu";
import { useMapPan } from "../logic/use-map-pan";
import { useMapZoom } from "../logic/use-map-zoom";
import { useMapImage } from "../logic/use-map-image";
import { useMapInteractions } from "../logic/use-map-interactions";
import { usePinsFiltering } from "../logic/use-pins-filtering";
import { useMapWheel } from "../logic/use-map-wheel";
import { useMapHandlers } from "../logic/use-map-handlers";
import { ZoomControls } from "./zoom-controls";
import { MapLayersIndicator } from "./map-layers-indicator";
import { PlacementIndicator } from "./placement-indicator";
import { MapContainer } from "./map-canvas/map-container";
import { MapTransformLayer } from "./map-canvas/map-transform-layer";
import { MapContent } from "./map-canvas/map-content";
import { MapPinsWrapper } from "./map-canvas/map-pins-wrapper";
import { usePinPosition } from "@/components/pins/logic/use-pin-position";
import { MapCenterProvider } from "../context/map-context";
import { useMapExport } from "@/components/export/utils/use-map-export-context";

const GRID_SIZE = 40;

export interface MapCanvasProps {
  mapImage?: string | null;
  worldId?: string;
}

export function MapCanvas({ mapImage, worldId }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setMapElement } = useMapExport();
  const grid = useGrid();
  const scale = useScale();
  const layers = useLayers();
  const selectedLayerId = useSelectedLayerId();
  const baseMapVisible = useBaseMapVisible();
  const baseMapLayer = useMapStore((state) => state.layers.find((l) => l.isBaseMap));

  // Use new modular stores
  const pins = usePins();
  const createPin = useCreatePin();
  const selectedPin = useSelectedPin();
  const isCreatingPin = useIsCreatingPin();
  const selectPin = useSelectPin();
  const clearSelection = useClearSelection();
  const stopCreating = useStopCreating();
  const startCreating = useStartCreating();

  const {
    transform,
    isDragging,
    handleMouseDown,
    reset: resetTransform,
    setTransform,
    centerToPin,
  } = useMapPan({ isCreatingPin });

  const { handleZoomIn, handleZoomOut } = useMapZoom(transform, setTransform);

  useMapWheel({ containerRef, transform, setTransform });

  const {
    imageRef,
    imageError,
    imageLoaded,
    imageDimensions,
    shouldShowGrid,
    handleImageLoad,
    handleImageError,
  } = useMapImage(mapImage);

  const { visiblePins } = usePinsFiltering({ pins, layers });

  const {
    contextMenu,
    closeContextMenu,
    handleClick,
    handleContextMenu,
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
        layerId: selectedLayerId || undefined,
      });
    },
    onCloseContextMenu: () => {},
    onStopCreating: stopCreating,
    onSelectPin: selectPin,
    onClearSelection: clearSelection,
  });

  const { handlePinClick, handlePopupClose } = useMapHandlers({
    isCreatingPin,
    selectPin,
    clearSelection,
    stopCreating,
    startCreating,
  });

  const getGridSize = (): number => {
    const scaleRatio = parseInt(scale.split(":")[1]);
    return GRID_SIZE * (1000 / scaleRatio);
  };

  const visibleLayers = layers
    .filter((layer) => layer.visible)
    .sort((a, b) => a.zIndex - b.zIndex);

  const layerScale = baseMapLayer?.scale ?? 1;

  /**
   * Center the map on a specific pin by ID
   * This function is exposed via context to the pin list
   */
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
  }, [pins, imageDimensions, layers, centerToPin]);

  // Update map element reference for export
  useEffect(() => {
    if (containerRef.current) {
      setMapElement(containerRef.current);
    }

    return () => {
      setMapElement(null);
    };
  }, [setMapElement]);

  return (
    <MapCenterProvider centerOnPin={centerOnPin}>
      <MapContainer
        ref={containerRef}
        isCreatingPin={isCreatingPin}
        isDragging={isDragging}
        showContextMenu={!!contextMenu}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
      <MapTransformLayer
        translateX={transform.translateX}
        translateY={transform.translateY}
        scale={transform.scale}
        isDragging={isDragging}
      >
        <MapContent mapImage={mapImage} imageError={imageError}>
          {() => (
            <>
              <MapPinsWrapper
                baseMapVisible={baseMapVisible}
                visiblePins={visiblePins}
                selectedPin={selectedPin ?? null}
                imageDimensions={imageDimensions}
                layerScale={layerScale}
                mapImage={mapImage!}
                transform={transform}
                imageRef={imageRef}
                onPinClick={handlePinClick}
                onPopupClose={handlePopupClose}
                onImageLoad={handleImageLoad}
                onImageError={handleImageError}
                showGrid={grid && imageLoaded}
                gridSize={getGridSize()}
              />

              <MapLayersIndicator layers={visibleLayers} />
            </>
          )}
        </MapContent>
      </MapTransformLayer>

      <ZoomControls
        scale={transform.scale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={resetTransform}
      />

      <PlacementIndicator show={isCreatingPin && !contextMenu} />

      {contextMenu && worldId && (
        <>
          {console.log("[MapCanvas] Rendering PinContextMenu:", {
            worldId,
            position: contextMenu.position,
            coordinates: contextMenu.coordinates,
          })}
          <PinContextMenu
            position={contextMenu.position}
            coordinates={contextMenu.coordinates}
            onClose={closeContextMenu}
            onSelectPinType={handleSelectPinType}
          />
        </>
      )}
    </MapContainer>
    </MapCenterProvider>
  );
}
