"use client";

import { memo } from "react";
import { PinContextMenuPortal } from "@/features/pins/ui/pin-context-menu-portal";
import { useMapInitialization } from "../logic/use-map-initialization";
import { useMapEvents } from "../logic/use-map-events";
import { useBackgroundColor } from "@/features/world-editor/store/map-store";
import { PlacementIndicator } from "./placement-indicator";
import { MapContainer } from "./map-canvas/map-container";
import { MapTransformLayer } from "./map-canvas/map-transform-layer";
import { MapContent } from "./map-canvas/map-content";
import { MapOverlays } from "./map-canvas/map-overlays";
import { MapLayers } from "./map-layers";
import { MapCenterProvider } from "../context/map-context";
import { useRegionsInMap } from "../logic/use-regions-in-map";
import { useHoverRegionId, useIsDraggingRegion, useSelectedRegionId } from "@/features/world-editor/store/regions";

export interface MapCanvasProps {
  mapImage?: string | null;
  worldId?: string;
}

export const MapCanvas = memo(function MapCanvas({ mapImage, worldId }: MapCanvasProps) {
  const backgroundColor = useBackgroundColor();

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
    handleMouseMove,
    handleMouseUp,
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
    toolCursor,
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

  // Regions management - pass transform for zoom-based filtering
  const regionsManager = useRegionsInMap({
    worldId,
    layers,
    transform,
  });

  // Get regions UI state
  const selectedRegionId = useSelectedRegionId();
  const hoverRegionId = useHoverRegionId();
  const isDraggingRegion = useIsDraggingRegion();

  // Filter and sort visible layers with full layer data for opacity and zoom range
  const visibleLayers = layers
    .filter((layer) => layer.visible)
    .sort((a, b) => a.zIndex - b.zIndex)
    .map((layer) => ({
      id: layer.id,
      visible: layer.visible,
      zIndex: layer.zIndex,
      isBaseMap: layer.isBaseMap,
      scale: layer.scale,
      offsetX: layer.offsetX,
      offsetY: layer.offsetY,
      opacity: layer.opacity,
      minZoom: layer.minZoom,
      maxZoom: layer.maxZoom,
    }));

  return (
    <MapCenterProvider centerOnPin={centerOnPin}>
      <MapContainer
        ref={containerRef}
        isCreatingPin={isCreatingPin}
        isDragging={isDragging}
        showContextMenu={!!contextMenu}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        backgroundColor={backgroundColor}
        cursor={toolCursor}
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
                // Regions props
                regions={regionsManager.regions}
                selectedRegionId={selectedRegionId}
                hoverRegionId={hoverRegionId}
                isDraggingRegion={isDraggingRegion}
                onRegionClick={regionsManager.handleRegionClick}
                onRegionMouseDown={regionsManager.handleRegionMouseDown}
                onRegionHover={regionsManager.handleRegionHover}
              />
            )}
          </MapContent>
        </MapTransformLayer>

        {/* Tool overlays */}
        <MapOverlays containerRef={containerRef} transform={transform} imageDimensions={imageDimensions} />

        <PlacementIndicator show={isCreatingPin && !contextMenu} />
      </MapContainer>

      {contextMenu && worldId && (
        <PinContextMenuPortal
          position={contextMenu.position}
          coordinates={contextMenu.coordinates}
          onClose={closeContextMenu}
          onSelectPinType={handleSelectPinType}
        />
      )}
    </MapCenterProvider>
  );
});
