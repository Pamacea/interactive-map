"use client";

import { useState, useRef, useCallback } from "react";
import { useMapStore } from "@/stores/map-store";
import { usePinsStore } from "@/stores/use-pins-store";
import { getPinTypeConfig, type PinType } from "@/constants/pin-types";
import { updatePinPosition } from "@/actions/pins";
import type { Pin } from "@prisma/client";

interface PinMarkerProps {
  pin: Pin & {
    layer?: {
      id: string;
      isVisible: boolean;
      zIndex: number;
    } | null;
  };
  mapWidth: number;
  mapHeight: number;
  transform: {
    scale: number;
    translateX: number;
    translateY: number;
  };
  onPinClick?: (pin: Pin) => void;
}

export function PinMarker({ pin, mapWidth, mapHeight, transform, onPinClick }: PinMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  const layers = useMapStore((state) => state.layers);
  const selectPin = usePinsStore((state) => state.selectPin);
  const setHoverPin = usePinsStore((state) => state.setHoverPin);
  const updatePin = usePinsStore((state) => state.updatePin);

  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  const pinConfig = getPinTypeConfig(pin.pinType as PinType);

  // Check if layer is locked
  const layer = pin.layerId
    ? layers.find((layer) => layer.id === pin.layerId)
    : null;
  const isLayerLocked = layer?.locked ?? false;

  // Check visibility
  const isVisible = pin.isVisible && (!pin.layerId || pin.layer?.isVisible);

  // Check if layer is visible
  const layerVisible = pin.layerId
    ? layers.some((layer) => layer.id === pin.layerId && layer.visible)
    : true;

  console.log(`📌 [pin-marker] Rendering pin "${pin.title}"`, {
    id: pin.id,
    isVisible,
    layerVisible,
    pin: {
      isVisible: pin.isVisible,
      layerId: pin.layerId,
      layerIsVisible: pin.layer?.isVisible,
    },
  });

  if (!isVisible || !layerVisible) {
    console.log(`📌 [pin-marker] Skipping pin "${pin.title}" - not visible`, {
      isVisible,
      layerVisible,
    });
    return null;
  }

  // SVG icon paths for each pin type
  const iconPaths: Record<PinType, string> = {
    CITY: "M3 21h18M5 21V7l8-4 8 4v14M8 21v-9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v9",
    VILLAGE: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    POI: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z",
    CHARACTER: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
    DUNGEON: "M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6",
    SHOP: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z",
    QUEST: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",
    TREASURE: "M6 3h12l4 6-10 13L2 9l4-6",
    CUSTOM: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  };

  // Convert lat/lng to pixel coordinates
  // Using drag position if dragging, otherwise use pin's stored position
  const latitude = dragPosition ? dragPosition.y / mapHeight : pin.latitude;
  const longitude = dragPosition ? dragPosition.x / mapWidth : pin.longitude;

  const x = longitude * mapWidth;
  const y = latitude * mapHeight;

  // Apply transform
  const transformedX = x * transform.scale + transform.translateX;
  const transformedY = y * transform.scale + transform.translateY;

  console.log(`📌 [pin-marker] Pin "${pin.title}" coordinates:`, {
    latitude: pin.latitude,
    longitude: pin.longitude,
    x,
    y,
    transformedX,
    transformedY,
    mapWidth,
    mapHeight,
    transform,
    isDragging,
    dragPosition,
  });

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Prevent dragging if layer is locked
    if (isLayerLocked) {
      return;
    }

    // Only left mouse button
    if (e.button !== 0) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    // Calculate offset from pin center to mouse position
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
    };

    setIsDragging(true);
    selectPin(pin.id);

    // Add window-level event listeners for drag continuation
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }, [isLayerLocked, pin.id, selectPin]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragStartPos.current) {
      return;
    }

    // Calculate delta in screen coordinates
    const deltaX = (e.clientX - dragStartPos.current.x) / transform.scale;
    const deltaY = (e.clientY - dragStartPos.current.y) / transform.scale;

    // Calculate new position (start from pin's original position)
    const startX = pin.longitude * mapWidth;
    const startY = pin.latitude * mapHeight;

    let newX = startX + deltaX;
    let newY = startY + deltaY;

    // Clamp to map boundaries
    newX = Math.max(0, Math.min(mapWidth, newX));
    newY = Math.max(0, Math.min(mapHeight, newY));

    // Update visual position only (not database yet)
    setDragPosition({ x: newX, y: newY });
  }, [isDragging, mapWidth, mapHeight, transform.scale, pin.latitude, pin.longitude]);

  const handleMouseUp = useCallback(async (e: MouseEvent) => {
    if (!isDragging) {
      return;
    }

    // Clean up window listeners
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);

    setIsDragging(false);

    // If we have a drag position, save to database
    if (dragPosition) {
      try {
        // Convert pixel position to map coordinates (0-1 range)
        const newLatitude = Math.max(0, Math.min(1, dragPosition.y / mapHeight));
        const newLongitude = Math.max(0, Math.min(1, dragPosition.x / mapWidth));

        // Update in database
        await updatePinPosition(pin.id, newLatitude, newLongitude);

        // Update local store to reflect the change
        updatePin(pin.id, {
          latitude: newLatitude,
          longitude: newLongitude,
        });

        console.log("📌 [pin-marker] Pin position saved:", {
          pinId: pin.id,
          newLatitude,
          newLongitude,
        });
      } catch (error) {
        console.error("📌 [pin-marker] Failed to save pin position:", error);
      }

      // Clear drag position
      setDragPosition(null);
    }

    dragStartPos.current = null;
  }, [isDragging, dragPosition, mapWidth, mapHeight, pin.id, updatePin, handleMouseMove]);

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger click if we just finished dragging
    if (isDragging) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    selectPin(pin.id);
    onPinClick?.(pin);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setHoverPin(pin.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setHoverPin(null);
  };

  const zIndex = pin.layer?.zIndex ?? 0;
  const dragZIndex = isDragging ? 9999 : zIndex;

  return (
    <div
      className={`absolute ${isDragging ? "cursor-grabbing" : isLayerLocked ? "cursor-not-allowed" : "cursor-grab"}`}
      style={{
        left: `${transformedX}px`,
        top: `${transformedY}px`,
        transform: "translate(-50%, -50%)",
        zIndex: dragZIndex,
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex items-center justify-center transition-all duration-150"
        style={{
          width: `${pin.size * transform.scale}px`,
          height: `${pin.size * transform.scale}px`,
          backgroundColor: pin.color,
          borderRadius: "var(--radius-sm)",
          boxShadow: isDragging
            ? "0 8px 20px rgba(0, 0, 0, 0.6)"
            : isHovered
              ? "0 4px 12px rgba(0, 0, 0, 0.5)"
              : "0 2px 8px rgba(0, 0, 0, 0.3)",
          transform: isDragging ? "scale(1.2)" : isHovered ? "scale(1.1)" : "scale(1)",
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
          style={{ opacity: 0.9 }}
        >
          <path d={iconPaths[pin.pinType as PinType]} />
        </svg>
      </div>
    </div>
  );
}