"use client";

import { useCallback, useRef } from "react";
import type { Pin } from "@prisma/client";
import { PinTypeEnum, type Pin as CustomPin } from "@/types/pin.type";
import { ZoomControls } from "./zoom-controls";
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
import { usePinsFiltering, type PinWithLayer } from "../logic/use-pins-filtering";
import { MapImage } from "./map-image";
import { MapPlaceholder } from "./map-placeholder";
import { PinsRenderer } from "./pins-renderer";
import { MapLayersIndicator } from "./map-layers-indicator";
import { PlacementIndicator } from "./placement-indicator";
import { SelectedPinPopup } from "./selected-pin-popup";

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
  const baseMapLayer = useMapStore((state) => state.layers.find(l => l.isBaseMap));

  // Pin integration - use Zustand store as single source of truth
  const pins = usePins();
  const createPin = useCreatePin();
  const selectedPin = useSelectedPin();
  const isCreatingPin = useIsCreatingPin();
  const selectPin = usePinsStore((state) => state.selectPin);
  const clearSelection = usePinsStore((state) => state.clearSelection);
  const stopCreating = usePinsStore((state) => state.stopCreating);
  const startCreating = usePinsStore((state) => state.startCreating);

  // Map pan (drag & drop)
  const {
    transform,
    isDragging,
    handleMouseDown,
    reset: resetTransform,
    setTransform,
  } = useMapPan({ isCreatingPin });

  // Map zoom
  const { handleWheel, handleZoomIn, handleZoomOut } = useMapZoom(
    transform,
    setTransform
  );

  // Map image handling
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
  const { visiblePins } = usePinsFiltering({ pins, layers });

  // Map interactions (click, context menu, escape)
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
    onCloseContextMenu: () => {
      // Additional cleanup if needed
    },
    onStopCreating: stopCreating,
    onSelectPin: selectPin,
    onClearSelection: clearSelection,
  });

  // Pin handlers
  const handlePinClick = useCallback(
    (pin: PinWithLayer) => {
      selectPin(pin.id);
    },
    [selectPin]
  );

  const handlePopupClose = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  const handleToggleCreatePin = useCallback(() => {
    if (isCreatingPin) {
      stopCreating();
    } else {
      selectPin(null); // Clear selection when starting to create
      startCreating();
    }
  }, [isCreatingPin, stopCreating, selectPin, startCreating]);

  // Grid size calculation
  const getGridSize = (): number => {
    const scaleRatio = parseInt(scale.split(":")[1]);
    return GRID_SIZE * (1000 / scaleRatio);
  };

  // Visible layers sorted by zIndex
  const visibleLayers = layers
    .filter((layer) => layer.visible)
    .sort((a, b) => a.zIndex - b.zIndex);

  // Calculate layer scale
  const layerScale = baseMapLayer?.scale ?? 1;

  // Cursor style
  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden ${
        isCreatingPin && !contextMenu
          ? "cursor-crosshair ring-2 ring-accent-gold/50 ring-inset"
          : isDragging
            ? "cursor-grabbing"
            : "cursor-grab"
      }`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <div
        className="absolute top-0 left-0 flex items-center justify-center"
        style={{
          width: "100%",
          height: "100%",
          transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.1s ease-out",
        }}
      >
        {mapImage && !imageError ? (
          <>
            {baseMapVisible && (
              <MapImage
                imageRef={imageRef}
                mapImage={mapImage}
                imageDimensions={imageDimensions}
                showGrid={grid && imageLoaded}
                gridSize={getGridSize()}
                layerScale={layerScale}
                onLoad={handleImageLoad}
                onError={handleImageError}
              >
                {/* Render Pins */}
                <PinsRenderer
                  pins={visiblePins}
                  imageDimensions={imageDimensions}
                  transform={transform}
                  onPinClick={handlePinClick}
                />

                {/* Selected Pin Popup */}
                {selectedPin && (
                  <SelectedPinPopup
                    selectedPin={selectedPin}
                    imageDimensions={imageDimensions}
                    transform={transform}
                    onClose={handlePopupClose}
                  />
                )}
              </MapImage>
            )}

            {/* When base map is hidden, render pins on a transparent container */}
            {!baseMapVisible && imageDimensions && (
              <div
                ref={imageRef}
                style={{
                  width: imageDimensions.width * layerScale,
                  height: imageDimensions.height * layerScale,
                  position: 'relative',
                }}
              >
                {/* Render Pins */}
                <PinsRenderer
                  pins={visiblePins}
                  imageDimensions={imageDimensions}
                  transform={transform}
                  onPinClick={handlePinClick}
                />

                {/* Selected Pin Popup */}
                {selectedPin && (
                  <SelectedPinPopup
                    selectedPin={selectedPin}
                    imageDimensions={imageDimensions}
                    transform={transform}
                    onClose={handlePopupClose}
                  />
                )}
              </div>
            )}

            {/* Layers Indicator */}
            <MapLayersIndicator layers={visibleLayers} />
          </>
        ) : (
          <MapPlaceholder showGrid={grid} />
        )}
      </div>

      {/* Zoom Controls */}
      <ZoomControls
        scale={transform.scale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={resetTransform}
      />

      {/* Placement Mode Indicator */}
      <PlacementIndicator show={isCreatingPin && !contextMenu} />

      {/* Context Menu */}
      {contextMenu && worldId && (
        <PinContextMenu
          position={contextMenu.position}
          coordinates={contextMenu.coordinates}
          onClose={closeContextMenu}
          onSelectPinType={handleSelectPinType}
        />
      )}
    </div>
  );
}
