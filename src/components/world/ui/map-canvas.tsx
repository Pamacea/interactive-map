"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Pin } from "@prisma/client";
import { PinTypeEnum } from "@/types/pin.type";
import { ZoomControls } from "./zoom-controls";
import { useGrid, useSnap, useScale, useLayers, useVisibleLayerIds, useSelectedLayerId } from "@/stores/map-store";
import { usePins } from "@/components/pins/logic/use-pins";
import { useSelectedPin, useIsCreatingPin, usePinsStore } from "@/stores/use-pins-store";
import { PinMarker } from "@/components/pins/ui/pin-marker";
import { PinPopup } from "@/components/pins/ui/pin-popup";
import { PinCreateForm } from "@/components/pins/ui/pin-create-form";
import { PinContextMenu } from "@/components/pins/ui/pin-context-menu";
import { flushSync } from "react-dom";

interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
}

interface MapCanvasProps {
  mapImage?: string | null;
  worldId?: string;
}

const GRID_SIZE = 40;

function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

export function MapCanvas({ mapImage, worldId }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const grid = useGrid();
  const snap = useSnap();
  const scale = useScale();
  const layers = useLayers();
  const visibleLayerIds = useVisibleLayerIds();

  // DEBUG: Log what MapCanvas receives
  console.log("[DEBUG MapCanvas] Props received:", {
    mapImage,
    mapImageType: typeof mapImage,
    isMapNull: mapImage === null,
    isMapUndefined: mapImage === undefined,
    worldId
  });

  // Pin integration
  const { pins } = usePins(worldId || "");
  const selectedPin = useSelectedPin();
  const isCreatingPin = useIsCreatingPin();
  const selectPin = usePinsStore((state) => state.selectPin);
  const clearSelection = usePinsStore((state) => state.clearSelection);
  const stopCreating = usePinsStore((state) => state.stopCreating);
  const startCreating = usePinsStore((state) => state.startCreating);
  const selectedLayerId = useSelectedLayerId();

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
  const [pendingPinCoords, setPendingPinCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [isMouseInCanvas, setIsMouseInCanvas] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    position: { x: number; y: number };
    coordinates: { lat: number; lng: number };
  } | null>(null);
  const [selectedPinType, setSelectedPinType] = useState<PinTypeEnum | null>(null);

  const getGridSize = (): number => {
    const scaleRatio = parseInt(scale.split(":")[1]);
    return GRID_SIZE * (1000 / scaleRatio);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Close context menu on left click
    if (contextMenu) {
      setContextMenu(null);
      return;
    }

    if (e.button === 0 && !isDragging) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Handle pin creation mode
      if (isCreatingPin && worldId) {
        // Convert screen coordinates to map coordinates (0-1 range)
        const mapWidth = imageDimensions.width || 1920;
        const mapHeight = imageDimensions.height || 1080;

        // Account for transform
        const adjustedX = (x - transform.translateX) / transform.scale;
        const adjustedY = (y - transform.translateY) / transform.scale;

        // Convert to latitude/longitude (0-1 range)
        const lng = adjustedX / mapWidth;
        const lat = adjustedY / mapHeight;

        setPendingPinCoords({ lat, lng });
        return;
      }

      // Handle grid snapping
      if (snap) {
        const gridSize = getGridSize();
        const snappedX = snapToGrid(x, gridSize);
        const snappedY = snapToGrid(y, gridSize);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    // Close context menu on zoom
    if (contextMenu) {
      setContextMenu(null);
    }
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(transform.scale * delta, 0.1), 5);

    setTransform((prev) => ({
      ...prev,
      scale: newScale,
    }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Close context menu on drag start
      if (contextMenu) {
        setContextMenu(null);
      }
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

    // Track mouse position for ghost pin when in create mode
    if (isCreatingPin && !isDragging) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsMouseInCanvas(false);
    setMousePosition(null);
  };

  const handleMouseEnter = () => {
    setIsMouseInCanvas(true);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Get screen coordinates
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert to map coordinates (0-1 range)
    const mapWidth = imageDimensions.width || 1920;
    const mapHeight = imageDimensions.height || 1080;

    const adjustedX = (x - transform.translateX) / transform.scale;
    const adjustedY = (y - transform.translateY) / transform.scale;

    const lng = adjustedX / mapWidth;
    const lat = adjustedY / mapHeight;

    setContextMenu({
      position: { x: e.clientX, y: e.clientY },
      coordinates: { lat, lng }
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleSelectPinType = (pinType: string, lat: number, lng: number) => {
    console.log("📌 [handleSelectPinType] Called with:", { pinType, lat, lng });

    // Use flushSync to ensure all state updates happen synchronously
    flushSync(() => {
      closeContextMenu();

      // Set local state first
      setSelectedPinType(pinType as PinTypeEnum);
      setPendingPinCoords({ lat, lng });

      // Then activate pin creation mode
      startCreating();
    });

    console.log("📌 [handleSelectPinType] State updates completed");
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
    console.log("[DEBUG MapCanvas] Image loaded successfully!");
    setImageLoaded(true);
    setImageError(false);
    if (imageRef.current) {
      const dimensions = {
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      };
      console.log("[DEBUG MapCanvas] Image dimensions:", dimensions);
      setImageDimensions(dimensions);
    }
  }, []);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("[DEBUG MapCanvas] Image failed to load!", {
      src: (e.target as HTMLImageElement).src,
      naturalWidth: (e.target as HTMLImageElement).naturalWidth,
      complete: (e.target as HTMLImageElement).complete
    });
    setImageError(true);
    setImageLoaded(false);
  }, []);

  useEffect(() => {
    console.log("[DEBUG MapCanvas] mapImage changed, resetting load state", {
      mapImage,
      imageLoaded,
      imageError
    });
    setImageLoaded(false);
    setImageError(false);
  }, [mapImage]);

  const shouldShowGrid = !mapImage || imageError || !imageLoaded;

  console.log("[DEBUG MapCanvas] Render state:", {
    shouldShowGrid,
    mapImage,
    imageError,
    imageLoaded,
    imageDimensions
  });

  const visibleLayers = layers
    .filter((layer) => layer.visible)
    .sort((a, b) => a.zIndex - b.zIndex);

  // Filter pins by visibility only - trust the DB data
  const visiblePins = pins.filter((pin) => {
    // Check pin visibility from DB
    if (!pin.isVisible) {
      console.log(`📌 [map-canvas] Pin "${pin.title}" filtered out: isVisible=false`);
      return false;
    }

    // Check layer visibility from DB (if layer assigned)
    if (pin.layerId && pin.layer) {
      if (!pin.layer.isVisible) {
        console.log(`📌 [map-canvas] Pin "${pin.title}" filtered out: layer ${pin.layerId} not visible in DB`, {
          pinLayerId: pin.layerId,
          dbLayerVisible: pin.layer.isVisible,
          pinLayer: pin.layer,
        });
        return false;
      }
    }

    // Pin is visible
    return true;
  })
    .sort((a, b) => {
      // Sort by layer zIndex
      const aLayer = layers.find((l) => l.id === a.layerId);
      const bLayer = layers.find((l) => l.id === b.layerId);
      const aZIndex = aLayer?.zIndex ?? 0;
      const bZIndex = bLayer?.zIndex ?? 0;
      return aZIndex - bZIndex;
    });

  console.log("📌 [map-canvas] Pin filtering:", {
    totalPins: pins.length,
    visiblePins: visiblePins.length,
    visibleLayerIds,
    layers: layers.map(l => ({ id: l.id, name: l.name, visible: l.visible })),
  });

  const handlePinClick = (pin: Pin) => {
    selectPin(pin.id);
  };

  const handlePopupClose = () => {
    clearSelection();
  };

  const handleCreateFormClose = () => {
    stopCreating();
    setPendingPinCoords(null);
    setSelectedPinType(null);
  };

  const handleCreateFormSuccess = () => {
    stopCreating();
    setPendingPinCoords(null);
    setSelectedPinType(null);
  };

  const handleToggleCreatePin = () => {
    if (isCreatingPin) {
      stopCreating();
      setPendingPinCoords(null);
      setMousePosition(null);
      setSelectedPinType(null);
    } else {
      selectPin(null); // Clear selection when starting to create
      startCreating();
    }
  };

  // Handle Escape key to cancel pin placement or close context menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (contextMenu) {
          setContextMenu(null);
        } else if (isCreatingPin) {
          stopCreating();
          setPendingPinCoords(null);
          setMousePosition(null);
          setSelectedPinType(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCreatingPin, stopCreating, contextMenu]);

  // Update cursor style based on mode
  const cursorStyle = isCreatingPin ? "crosshair" : "grab";

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden ${
        isCreatingPin && !contextMenu ? "cursor-crosshair ring-2 ring-accent-gold/50 ring-inset" : contextMenu ? "cursor-default" : "cursor-grab active:cursor-grabbing"
      }`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
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

            {/* Render PinMarkers */}
            {(() => {
              console.log("📌 [map-canvas] About to render PinMarkers:", {
                count: visiblePins.length,
                pins: visiblePins.map(p => ({
                  id: p.id,
                  title: p.title,
                  x: p.longitude * (imageDimensions.width || 1920),
                  y: p.latitude * (imageDimensions.height || 1080),
                }))
              });
              return visiblePins.map((pin) => {
                // Transform pin to match PinMarker expectations
                const pinWithLayer = {
                  ...pin,
                  layer: pin.layer ? {
                    id: pin.layer.id,
                    isVisible: pin.layer.isVisible,
                    zIndex: pin.layer.zIndex,
                  } : null,
                };
                console.log(`📌 [map-canvas] Rendering PinMarker for "${pin.title}"`, {
                  id: pin.id,
                  latitude: pin.latitude,
                  longitude: pin.longitude,
                  mapWidth: imageDimensions.width || 1920,
                  mapHeight: imageDimensions.height || 1080,
                });
                return (
                  <PinMarker
                    key={pin.id}
                    pin={pinWithLayer}
                    mapWidth={imageDimensions.width || 1920}
                    mapHeight={imageDimensions.height || 1080}
                    transform={transform}
                    onPinClick={handlePinClick}
                  />
                );
              });
            })()}

            {/* Ghost pin indicator when creating */}
            {isCreatingPin && isMouseInCanvas && mousePosition && !pendingPinCoords && (
              <div
                className="absolute pointer-events-none opacity-50"
                style={{
                  left: `${mousePosition.x}px`,
                  top: `${mousePosition.y}px`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 1000,
                }}
              >
                <div
                  className="flex items-center justify-center transition-all duration-150"
                  style={{
                    width: `${32 * transform.scale}px`,
                    height: `${32 * transform.scale}px`,
                    backgroundColor: "rgba(212, 175, 55, 0.5)",
                    borderRadius: "var(--radius-sm)",
                    boxShadow: "0 4px 12px rgba(212, 175, 55, 0.4)",
                  }}
                >
                  <svg
                    width={16 * transform.scale}
                    height={16 * transform.scale}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  </svg>
                </div>
              </div>
            )}

            {/* PinPopup for selected pin */}
            {selectedPin && (
              <div
                className="absolute z-50"
                style={{
                  left: `${selectedPin.longitude * (imageDimensions.width || 1920) * transform.scale + transform.translateX}px`,
                  top: `${selectedPin.latitude * (imageDimensions.height || 1080) * transform.scale + transform.translateY}px`,
                }}
              >
                <PinPopup
                  pin={selectedPin}
                  onClose={handlePopupClose}
                  position={{ x: 0, y: 0 }}
                />
              </div>
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
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
      />

      {/* Placement mode indicator */}
      {isCreatingPin && !contextMenu && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 bg-accent-gold/20 border border-accent-gold/50 px-4 py-2 rounded-sm backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span className="text-sm font-medium text-accent-gold">
              Click on map to place pin • Right-click for options
            </span>
          </div>
        </div>
      )}

      {/* Pin Create Form Modal */}
      {isCreatingPin && pendingPinCoords && worldId && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-background-card border border-border-ornate rounded-sm p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text-primary">Create Pin</h2>
              <button
                onClick={handleCreateFormClose}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <PinCreateForm
              worldId={worldId}
              initialLat={pendingPinCoords.lat}
              initialLng={pendingPinCoords.lng}
              initialLayerId={selectedLayerId || undefined}
              initialPinType={selectedPinType || undefined}
              layers={layers}
              onSuccess={handleCreateFormSuccess}
              onClose={handleCreateFormClose}
            />
          </div>
        </div>
      )}

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
