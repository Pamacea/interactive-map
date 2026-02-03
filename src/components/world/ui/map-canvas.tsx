"use client";

import { memo } from "react";
import { PinContextMenu } from "@/components/pins/ui/pin-context-menu";
import { useMapInitialization } from "../logic/use-map-initialization";
import { useMapEvents } from "../logic/use-map-events";
import { PlacementIndicator } from "./placement-indicator";
import { MapContainer } from "./map-canvas/map-container";
import { MapTransformLayer } from "./map-canvas/map-transform-layer";
import { MapContent } from "./map-canvas/map-content";
import { MapLayers } from "./map-layers";
import { MapCenterProvider } from "../context/map-context";

export interface MapCanvasProps {
  mapImage?: string | null;
  worldId?: string;
}

export const MapCanvas = memo(function MapCanvas({ mapImage, worldId }: MapCanvasProps) {
  // Initialize map and get container ref
  const { containerRef, grid, scale, layers, selectedLayerId, baseMapVisible } =
    useMapInitialization({ mapImage, worldId });

  // Get all map events and state
  const {
    transform,
    isDragging,
    imageRef,
    imageError,
    imageDimensions,
    visiblePins,
    selectedPin,
    isCreatingPin,
    handleMouseDown,
    handleZoomIn,
    handleZoomOut,
    resetTransform,
    handleClick,
    handleContextMenu,
    handlePinClick,
    handlePopupClose,
    handleImageLoad,
    handleImageError,
    contextMenu,
    closeContextMenu,
    handleSelectPinType,
    getGridSize,
    layerScale,
    centerOnPin,
  } = useMapEvents({
    mapImage,
    worldId,
    containerRef,
    layers,
    selectedLayerId,
    baseMapVisible,
    grid,
    scale,
  });

  // Filter and sort visible layers
  const visibleLayers = layers
    .filter((layer) => layer.visible)
    .sort((a, b) => a.zIndex - b.zIndex);

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
              <MapLayers
                baseMapVisible={baseMapVisible}
                visiblePins={visiblePins}
                selectedPin={selectedPin}
                imageDimensions={imageDimensions}
                layerScale={layerScale}
                mapImage={mapImage!}
                transform={transform}
                imageRef={imageRef}
                onPinClick={handlePinClick}
                onPopupClose={handlePopupClose}
                onImageLoad={handleImageLoad}
                onImageError={handleImageError}
                onContextMenu={handleContextMenu}
                showGrid={grid}
                gridSize={getGridSize()}
                visibleLayers={visibleLayers}
              />
            )}
          </MapContent>
        </MapTransformLayer>

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
    </MapCenterProvider>
  );
});
