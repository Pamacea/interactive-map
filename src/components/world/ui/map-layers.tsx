import { type ReactNode } from "react";
import type { PinWithLayer } from "../../logic/use-pins-filtering";
import { MapPinsWrapper } from "./map-canvas/map-pins-wrapper";
import { MapLayersIndicator } from "./map-layers-indicator";
import type { Transform } from "../../logic/use-map-pan";

interface MapLayersProps {
  baseMapVisible: boolean;
  visiblePins: PinWithLayer[];
  selectedPin: PinWithLayer | null;
  imageDimensions: { width: number; height: number } | null;
  layerScale: number;
  mapImage: string;
  transform: Transform;
  imageRef: React.RefObject<HTMLImageElement | HTMLDivElement | null>;
  onPinClick: (pin: PinWithLayer) => void;
  onPopupClose: () => void;
  onImageLoad: () => void;
  onImageError: () => void;
  showGrid: boolean;
  gridSize: number;
  visibleLayers: Array<{
    id: string;
    visible: boolean;
    zIndex: number;
    isBaseMap?: boolean;
    scale?: number;
    offsetX?: number;
    offsetY?: number;
  }>;
  children?: ReactNode;
}

/**
 * Component to render map layers and pins
 * Handles layer visibility, z-indexing, and pin rendering
 */
export function MapLayers({
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
  showGrid,
  gridSize,
  visibleLayers,
  children,
}: MapLayersProps) {
  return (
    <>
      <MapPinsWrapper
        baseMapVisible={baseMapVisible}
        visiblePins={visiblePins}
        selectedPin={selectedPin}
        imageDimensions={imageDimensions}
        layerScale={layerScale}
        mapImage={mapImage}
        transform={transform}
        imageRef={imageRef}
        onPinClick={onPinClick}
        onPopupClose={onPopupClose}
        onImageLoad={onImageLoad}
        onImageError={onImageError}
        showGrid={showGrid}
        gridSize={gridSize}
      />
      <MapLayersIndicator layers={visibleLayers} />
      {children}
    </>
  );
}
