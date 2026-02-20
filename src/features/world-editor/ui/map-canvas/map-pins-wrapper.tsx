"use client";

import { memo } from "react";
import type { PinWithLayer } from "../../logic/use-pins-filtering";
import { MapImage } from "../map-image";
import { PinsRenderer } from "../pins-renderer";
import { useMapStore } from "@/features/world-editor/store/map-store";
import { useSelectedPinId } from "@/features/pins/store";

interface MapPinsWrapperProps {
  baseMapVisible: boolean;
  baseMapOpacity?: number;
  visiblePins: PinWithLayer[];
  selectedPin: PinWithLayer | null;
  imageDimensions: { width: number; height: number } | null;
  layerScale: number;
  mapImage: string;
  transform: { translateX: number; translateY: number; scale: number };
  imageRef: React.RefObject<HTMLImageElement | HTMLDivElement | null>;
  onPinClick: (pin: PinWithLayer) => void;
  onPopupClose: () => void;
  onImageLoad: () => void;
  onImageError: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  showGrid: boolean;
  gridSize: number;
}

export const MapPinsWrapper = memo(function MapPinsWrapper({
  baseMapVisible,
  baseMapOpacity = 1,
  visiblePins,
  _selectedPin,
  imageDimensions,
  layerScale,
  mapImage,
  transform,
  imageRef,
  onPinClick,
  _onPopupClose,
  onImageLoad,
  onImageError,
  onContextMenu,
  showGrid,
  gridSize,
}: MapPinsWrapperProps) {
  // Get layers for popup positioning
  const _layers = useMapStore((state) => state.layers);
  // Get selected pin ID from store (real-time updates)
  const _selectedPinId = useSelectedPinId();

  if (!imageDimensions) return null;

  const pinsRenderer = (
    <PinsRenderer
      pins={visiblePins}
      imageDimensions={imageDimensions}
      transform={transform}
      onPinClick={onPinClick}
    />
  );

  if (baseMapVisible) {
    return (
      <MapImage
        imageRef={imageRef}
        mapImage={mapImage}
        imageDimensions={imageDimensions}
        showGrid={showGrid}
        gridSize={gridSize}
        layerScale={layerScale}
        opacity={baseMapOpacity}
        onLoad={onImageLoad}
        onError={onImageError}
        onContextMenu={onContextMenu}
      >
        {pinsRenderer}
        {/* SelectedPinPopup temporarily disabled - replaced by PinDetailsModule sidebar */}
        {/* {selectedPinId && (
          <SelectedPinPopup
            selectedPinId={selectedPinId}
            onClose={onPopupClose}
            imageDimensions={imageDimensions}
            layers={layers}
          />
        )} */}
      </MapImage>
    );
  }

  return (
    <div
      ref={imageRef}
      style={{
        width: imageDimensions.width * layerScale,
        height: imageDimensions.height * layerScale,
        position: "relative",
      }}
    >
      {pinsRenderer}
      {/* SelectedPinPopup temporarily disabled - replaced by PinDetailsModule sidebar */}
      {/* {selectedPinId && (
        <SelectedPinPopup
          selectedPinId={selectedPinId}
          onClose={onPopupClose}
          imageDimensions={imageDimensions}
          layers={layers}
        />
      )} */}
    </div>
  );
});

MapPinsWrapper.displayName = "MapPinsWrapper";
