"use client";

import { memo, useState, useRef, useCallback } from "react";
import { useMapStore } from "@/stores/map-store";
import { useSelectPin, useSelectedPinId, useClearSelection, useUpdatePin, usePinById } from "@/stores/use-pins-store";
import { getPinTypeConfig, type PinType } from "@/constants/pin-types";
import { usePinEvents } from "@/components/pins/logic/use-pin-events";
import { usePinScreenCoordinates } from "@/components/pins/logic/use-pin-screen-coordinates";
import type { Pin } from "@prisma/client";
import { MarkerContainer } from "./pin-marker/marker-container";
import { useMarkerVisibility } from "./pin-marker/use-marker-visibility";
import { useMarkerStyling } from "./pin-marker/use-marker-styling";

interface PinMarkerProps {
  pin: Pin & {
    layer?: {
      id: string;
      isVisible: boolean;
      zIndex: number;
    } | null;
  };
  imageDimensions: { width: number; height: number };
  transform: {
    scale: number;
    translateX: number;
    translateY: number;
  };
  onPinClick?: (pin: Pin) => void;
}

// Movement threshold to distinguish click from drag
const DRAG_THRESHOLD = 5;

/**
 * PinMarker - Interactive map pin
 *
 * Click: toggle selection
 * Drag: move pin (pin follows cursor exactly)
 */
export function PinMarker({
  pin,
  imageDimensions,
  transform,
  onPinClick,
}: PinMarkerProps) {
  // Store access
  const layers = useMapStore((state) => state.layers);
  const selectPin = useSelectPin();
  const clearSelection = useClearSelection();
  const selectedPinId = useSelectedPinId();
  const updatePin = useUpdatePin();

  // Get real-time pin data from store (for position updates during drag)
  const latestPin = usePinById(pin.id);

  const isPinSelected = selectedPinId === pin.id;

  // Local drag state for real-time position updates
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  // Get initial position from store
  const basePosition = usePinScreenCoordinates({
    pin: latestPin || pin,
    imageDimensions,
    layers,
  });

  // Use drag position if dragging, otherwise use base position
  const position = dragPosition || basePosition;

  // Get layer info for lock state
  const layer = pin.layerId ? layers.find((layer) => layer.id === pin.layerId) : null;
  const isLayerLocked = layer?.locked ?? false;

  // Event handling (hover, event capture)
  const { isHovered, handleMouseEnter, handleMouseLeave } = usePinEvents({
    pinId: pin.id,
    isDragging,
    isPinSelected,
  });

  // Visibility calculation
  const shouldRender = useMarkerVisibility({
    pin,
    transform,
    isDragging,
    isHovered,
    isPinSelected,
  });

  // Style calculations
  const markerStyling = useMarkerStyling({
    pin,
    transform,
    isDragging,
    isPinSelected,
    isHovered,
  });

  if (!shouldRender) {
    return null;
  }

  // Icon configuration
  const pinConfig = getPinTypeConfig(pin.pinType as PinType);
  const iconName = pin.icon || pinConfig.icon;
  const isCustomImage = iconName?.startsWith("/");

  const { finalZIndex, finalSize, iconSize, boxShadow, transformScale } = markerStyling;

  // Track drag state
  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    startLat: number;
    startLng: number;
  } | null>(null);
  const hasMovedRef = useRef(false);

  // Handle mouse move during drag
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragStartRef.current) return;

    const { clientX: startClientX, clientY: startClientY, startLat, startLng } = dragStartRef.current;

    // Calculate screen delta
    const screenDeltaX = e.clientX - startClientX;
    const screenDeltaY = e.clientY - startClientY;

    // Check threshold
    const distance = Math.sqrt(screenDeltaX ** 2 + screenDeltaY ** 2);
    if (!hasMovedRef.current && distance <= DRAG_THRESHOLD) {
      return;
    }

    if (!hasMovedRef.current) {
      hasMovedRef.current = true;
      setIsDragging(true);
    }

    // Convert screen delta to map delta (accounting for scale)
    const mapDeltaX = screenDeltaX / transform.scale;
    const mapDeltaY = screenDeltaY / transform.scale;

    // Calculate new position in pixels (from starting position)
    const newX = startLng * imageDimensions.width + mapDeltaX;
    const newY = startLat * imageDimensions.height + mapDeltaY;

    // Clamp to map boundaries
    const clampedX = Math.max(0, Math.min(imageDimensions.width, newX));
    const clampedY = Math.max(0, Math.min(imageDimensions.height, newY));

    // Update local state for instant visual feedback
    setDragPosition({ x: clampedX, y: clampedY });

    // Update store with normalized coordinates
    const newLat = clampedY / imageDimensions.height;
    const newLng = clampedX / imageDimensions.width;
    updatePin(pin.id, { latitude: newLat, longitude: newLng });
  }, [imageDimensions, transform.scale, pin.id, updatePin]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    dragStartRef.current = null;
    if (!hasMovedRef.current) {
      setDragPosition(null);
    } else {
      hasMovedRef.current = false;
    }
    setIsDragging(false);
    setDragPosition(null);

    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  // Click handler - toggle selection
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }

    if (isPinSelected) {
      clearSelection();
    } else {
      selectPin(pin.id);
      onPinClick?.(pin);
    }
  };

  // Mouse down handler - start drag tracking
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (isLayerLocked) return;

    e.stopPropagation();
    e.preventDefault();

    // Store initial state
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startLat: latestPin?.latitude ?? pin.latitude,
      startLng: latestPin?.longitude ?? pin.longitude,
    };
    hasMovedRef.current = false;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <MarkerContainer
      x={position.x}
      y={position.y}
      zIndex={finalZIndex}
      size={finalSize}
      iconSize={iconSize}
      isCustomImage={isCustomImage}
      iconName={iconName}
      title={pin.title}
      color={pin.color}
      opacity={pin.opacity}
      boxShadow={boxShadow}
      transformScale={transformScale}
      isSelected={isPinSelected}
      isLayerLocked={isLayerLocked}
      isDragging={isDragging}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}

/**
 * MemoizedPinMarker - Performance-optimized pin marker
 */
export const MemoizedPinMarker = memo(PinMarker, (prevProps, nextProps) => {
  // Always re-render during drag or if pin changed
  if (prevProps.pin !== nextProps.pin) return false;
  if (prevProps.transform.scale !== nextProps.transform.scale) return false;
  if (prevProps.imageDimensions.width !== nextProps.imageDimensions.width) return false;
  if (prevProps.imageDimensions.height !== nextProps.imageDimensions.height) return false;
  return false; // Force re-render to get latest pin position from store
});

MemoizedPinMarker.displayName = "MemoizedPinMarker";

// Re-export atomic sub-components
export { MarkerContainer } from "./pin-marker/marker-container";
export { MarkerIcon } from "./pin-marker/marker-icon";
export { MarkerSelectionRing } from "./pin-marker/marker-selection-ring";
export { useMarkerVisibility } from "./pin-marker/use-marker-visibility";
export { useMarkerStyling } from "./pin-marker/use-marker-styling";
