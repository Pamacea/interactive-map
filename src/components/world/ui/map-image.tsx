import type { FC } from "react";
import React from "react";

export interface MapImageProps {
  imageRef: React.RefObject<HTMLImageElement | HTMLDivElement | null>;
  mapImage: string;
  imageDimensions: { width: number; height: number };
  showGrid: boolean;
  gridSize: number;
  layerScale?: number; // Scale factor for layer content (0.5 - 2.0)
  onLoad: () => void;
  onError: () => void;
  children?: React.ReactNode;
}

export const MapImage: FC<MapImageProps> = ({
  imageRef,
  mapImage,
  imageDimensions,
  showGrid,
  gridSize,
  layerScale = 1,
  onLoad,
  onError,
  children,
}) => {
  const { width, height } = imageDimensions;

  // Apply layer scale to dimensions instead of CSS transform
  const scaledWidth = width * layerScale;
  const scaledHeight = height * layerScale;

  return (
    <div
      className="relative"
      style={{
        width: scaledWidth > 0 ? scaledWidth : "100%",
        height: scaledHeight > 0 ? scaledHeight : "100%",
      }}
    >
      <img
        ref={imageRef as any}
        src={mapImage}
        alt="World map"
        className="max-w-none"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
        onLoad={onLoad}
        onError={onError}
      />

      {showGrid && (
        <svg
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: scaledWidth || "100%",
            height: scaledHeight || "100%",
            zIndex: 5,
          }}
          viewBox={`0 0 ${scaledWidth || 1920} ${scaledHeight || 1080}`}
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id={`grid-${gridSize}`}
              width={gridSize * layerScale}
              height={gridSize * layerScale}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${gridSize * layerScale} 0 L 0 0 0 ${gridSize * layerScale}`}
                fill="none"
                stroke="rgba(212, 175, 55, 0.2)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${gridSize})`} />
        </svg>
      )}

      {/* Pass ORIGINAL dimensions to children (pins need this for correct positioning) */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            imageDimensions: { width, height },
          } as any);
        }
        return child;
      })}
    </div>
  );
};
