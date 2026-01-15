"use client";

import { useRef } from "react";
import { useGrid, useScale, useLayers, useSelectedLayerId, useBaseMapVisible, useMapStore } from "@/stores/map-store";
import {
  usePins,
  useCreatePin,
  useSelectedPin,
  useIsCreatingPin,
  usePinsStore,
} from "@/stores/use-pins-store";
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

const GRID_SIZE = 40;

export interface MapCanvasProps {
  mapImage?: string | null;
  worldId?: string;
}

export function MapCanvas({ mapImage, worldId }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const grid = useGrid();
  const scale = useScale();
  const layers = useLayers();
  const selectedLayerId = useSelectedLayerId();
  const baseMapVisible = useBaseMapVisible();
  const baseMapLayer = useMapStore((state) => state.layers.find((l) => l.isBaseMap));

  const pins = usePins();
  const createPin = useCreatePin();
  const selectedPin = useSelectedPin();
  const isCreatingPin = useIsCreatingPin();
  const selectPin = usePinsStore((state) => state.selectPin);
  const clearSelection = usePinsStore((state) => state.clearSelection);
  const stopCreating = usePinsStore((state) => state.stopCreating);
  const startCreating = usePinsStore((state) => state.startCreating);

  const {
    transform,
    isDragging,
    handleMouseDown,
    reset: resetTransform,
    setTransform,
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

  return (
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

              {!baseMapVisible && selectedPin && imageDimensions && (
                <MapPinsWrapper
                  baseMapVisible={false}
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
                  showGrid={false}
                  gridSize={getGridSize()}
                />
              )}

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
        <PinContextMenu
          position={contextMenu.position}
          coordinates={contextMenu.coordinates}
          onClose={closeContextMenu}
          onSelectPinType={handleSelectPinType}
        />
      )}
    </MapContainer>
  );
}
