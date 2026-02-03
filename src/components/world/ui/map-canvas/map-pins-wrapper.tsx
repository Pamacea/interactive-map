"use client";

import { useRef, memo, type ReactNode } from "react";
import type { PinWithLayer } from "../../logic/use-pins-filtering";
import { MapImage } from "../map-image";
import { PinsRenderer } from "../pins-renderer";
import { SelectedPinPopup } from "../selected-pin-popup";
import { useMapStore } from "@/stores/map-store";

interface MapPinsWrapperProps {
  baseMapVisible: boolean;
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
  visiblePins,
  selectedPin,
  imageDimensions,
  layerScale,
  mapImage,
  transform,
  imageRef,
  onPinClick,
  onPopupClose,
  onImageLoad,
  onImageError,
  onContextMenu,
  showGrid,
  gridSize,
}: MapPinsWrapperProps) {
  // Get layers for popup positioning
  const layers = useMapStore((state) => state.layers);

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
        onLoad={onImageLoad}
        onError={onImageError}
        onContextMenu={onContextMenu}
      >
        {pinsRenderer}
        {selectedPin && (
          <SelectedPinPopup
            selectedPin={selectedPin}
            onClose={onPopupClose}
            imageDimensions={imageDimensions}
            layers={layers}
          />
        )}
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
      {selectedPin && (
        <SelectedPinPopup
          selectedPin={selectedPin}
          onClose={onPopupClose}
          imageDimensions={imageDimensions}
          layers={layers}
        />
      )}
    </div>
  );
});

MapPinsWrapper.displayName = "MapPinsWrapper";
