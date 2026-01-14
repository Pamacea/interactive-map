import type { FC } from "react";

export interface MapImageProps {
  imageRef: React.RefObject<HTMLImageElement | null>;
  mapImage: string;
  imageDimensions: { width: number; height: number };
  showGrid: boolean;
  gridSize: number;
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
  onLoad,
  onError,
  children,
}) => {
  const { width, height } = imageDimensions;

  return (
    <div className="relative">
      <img
        ref={imageRef}
        src={mapImage}
        alt="World map"
        className="max-w-none"
        style={{
          width: width > 0 ? "auto" : "100%",
          height: height > 0 ? "auto" : "100%",
          objectFit: "contain",
        }}
        onLoad={onLoad}
        onError={onError}
      />

      {showGrid && (
        <svg
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: width || "100%",
            height: height || "100%",
          }}
          viewBox={`0 0 ${width || 1920} ${height || 1080}`}
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id={`grid-${gridSize}`}
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                fill="none"
                stroke="rgba(212, 175, 55, 0.2)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${gridSize})`} />
        </svg>
      )}

      {children}
    </div>
  );
};
