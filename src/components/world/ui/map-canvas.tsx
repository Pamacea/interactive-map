"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ZoomControls } from "./zoom-controls";
import { useGrid, useSnap, useScale, useLayers } from "@/stores/map-store";

interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
}

interface MapCanvasProps {
  mapImage?: string | null;
}

const GRID_SIZE = 40;

function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

export function MapCanvas({ mapImage }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const grid = useGrid();
  const snap = useSnap();
  const scale = useScale();
  const layers = useLayers();
  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const getGridSize = (): number => {
    const scaleRatio = parseInt(scale.split(":")[1]);
    return GRID_SIZE * (1000 / scaleRatio);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.button === 0 && !isDragging && snap) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const gridSize = getGridSize();
      const snappedX = snapToGrid(x, gridSize);
      const snappedY = snapToGrid(y, gridSize);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(transform.scale * delta, 0.1), 5);

    setTransform((prev) => ({
      ...prev,
      scale: newScale,
    }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.translateX, y: e.clientY - transform.translateY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setTransform((prev) => ({
        ...prev,
        translateX: e.clientX - dragStart.x,
        translateY: e.clientY - dragStart.y,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setTransform((prev) => ({ ...prev, scale: Math.min(prev.scale * 1.2, 5) }));
  };

  const handleZoomOut = () => {
    setTransform((prev) => ({ ...prev, scale: Math.max(prev.scale * 0.8, 0.1) }));
  };

  const handleReset = () => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
  };

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
    if (imageRef.current) {
      setImageDimensions({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
    }
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
  }, []);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [mapImage]);

  const shouldShowGrid = !mapImage || imageError || !imageLoaded;

  const visibleLayers = layers
    .filter((layer) => layer.visible)
    .sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
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
          <div className="relative">
            <img
              ref={imageRef}
              src={mapImage}
              alt="World map"
              className="max-w-none"
              style={{
                width: imageDimensions.width ? "auto" : "100%",
                height: imageDimensions.height ? "auto" : "100%",
                objectFit: "contain",
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {grid && imageLoaded && (
              <svg
                className="absolute top-0 left-0 pointer-events-none"
                style={{
                  width: imageDimensions.width || "100%",
                  height: imageDimensions.height || "100%",
                }}
                viewBox={`0 0 ${imageDimensions.width || 1920} ${imageDimensions.height || 1080}`}
                preserveAspectRatio="none"
              >
                <defs>
                  <pattern id="grid-overlay" width={getGridSize()} height={getGridSize()} patternUnits="userSpaceOnUse">
                    <path d={`M ${getGridSize()} 0 L 0 0 0 ${getGridSize()}`} fill="none" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-overlay)" />
              </svg>
            )}
          </div>
        ) : (
          <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
            {grid && (
              <defs>
                <pattern id="grid-placeholder" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                </pattern>
              </defs>
            )}
            {grid && <rect width="100%" height="100%" fill="url(#grid-placeholder)" />}
            <circle cx="960" cy="540" r="100" fill="none" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="2"/>
            <circle cx="960" cy="540" r="200" fill="none" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="1"/>
            <circle cx="960" cy="540" r="300" fill="none" stroke="rgba(212, 175, 55, 0.1)" strokeWidth="1"/>
          </svg>
        )}

        {visibleLayers.length > 0 && (
          <div
            className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none"
            style={{ opacity: 0.8 }}
          >
            {visibleLayers.map((layer) => (
              <div
                key={layer.id}
                className="px-3 py-1.5 rounded-sm bg-background-elevated/90 border border-border-subtle text-xs text-text-secondary backdrop-blur-sm"
                style={{
                  opacity: layer.opacity,
                  zIndex: layer.zIndex,
                }}
              >
                {layer.name}
                {layer.locked && (
                  <span className="ml-2 text-accent-gold">🔒</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ZoomControls
        scale={transform.scale}
        mapScale={scale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
      />
    </div>
  );
}
