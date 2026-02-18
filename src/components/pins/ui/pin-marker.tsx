"use client";

import { memo, useCallback } from "react";
import { useMapStore } from "@/stores/map-store";
import { useSelectPin, useSelectedPinId, useClearSelection, usePinById } from "@/stores/use-pins-store";
import { getPinTypeConfig, type PinType } from "@/constants/pin-types";
import { usePinEvents } from "@/components/pins/logic/use-pin-events";
import { usePinScreenCoordinates } from "@/components/pins/logic/use-pin-screen-coordinates";
import { usePinDragInput } from "@/components/pins/logic/use-pin-drag-input";
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

/**
 * PinMarker - Interactive map pin
 *
 * Click: toggle selection
 * Drag: move pin (pin follows cursor exactly)
 *
 * Uses the unified input manager for consistent event handling.
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

  // Get real-time pin data from store (for position updates during drag)
  const latestPin = usePinById(pin.id);

  const isPinSelected = selectedPinId === pin.id;

  // Get layer info for lock state
  const layer = pin.layerId ? layers.find((layer) => layer.id === pin.layerId) : null;
  const isLayerLocked = layer?.locked ?? false;

  // Unified drag handling using input manager
  const { isDragging, dragPosition, handleMouseDown: handleDragMouseDown, justFinishedDragRef } = usePinDragInput({
    pin,
    imageDimensions,
    transform,
    isLayerLocked,
  });

  // Get initial position from store
  const basePosition = usePinScreenCoordinates({
    pin: latestPin || pin,
    imageDimensions,
    layers,
  });

  // Use drag position if dragging, otherwise use base position
  const position = dragPosition || basePosition;

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

  // Icon configuration
  const pinConfig = getPinTypeConfig(pin.pinType as PinType);
  const iconName = pin.icon || pinConfig.icon;
  const isCustomImage = iconName?.startsWith("/");

  const { finalZIndex, finalSize, iconSize, boxShadow, transformScale } = markerStyling;

  // Click handler - toggle selection (only if not dragging)
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

    // Don't handle click if we were just dragging
    // Check and clear the flag in the same operation
    if (justFinishedDragRef.current) {
      justFinishedDragRef.current = false;
      return;
    }

    if (isPinSelected) {
      clearSelection();
    } else {
      selectPin(pin.id);
      onPinClick?.(pin);
    }
  }, [isPinSelected, clearSelection, selectPin, pin, onPinClick, justFinishedDragRef]);

  // Combined mouse down handler
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (isLayerLocked) {
      return;
    }

    // Stop propagation to prevent map pan
    e.stopPropagation();

    // Delegate to drag handler
    handleDragMouseDown(e);
  }, [isLayerLocked, handleDragMouseDown, pin.id]);

  if (!shouldRender) {
    return null;
  }

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
      pinId={pin.id}
      iconShape={(latestPin || pin).iconShape}
      customIcon={(latestPin || pin).customIcon}
      iconBackground={(latestPin || pin).iconBackground}
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
