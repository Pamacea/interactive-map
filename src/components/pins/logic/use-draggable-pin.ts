"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { useUpdatePin } from "@/stores/use-pins-store";
import { updatePinPosition } from "@/actions/pins";
import { useToast } from "@/hooks/use-toast";

interface UseDraggablePinOptions {
  pinId: string;
  latitude: number;
  longitude: number;
  mapWidth: number;
  mapHeight: number;
  scale: number;
  isLocked?: boolean;
}

interface UseDraggablePinReturn {
  isDragging: boolean;
  startDrag: (e: React.MouseEvent) => void;
}

// Movement threshold to distinguish click from drag (in pixels)
const DRAG_THRESHOLD = 5;

/**
 * Drag hook for pins with click/drag separation
 *
 * When dragging:
 * 1. Updates pin coordinates in store (optimistic)
 * 2. Popup follows automatically via usePinScreenCoordinates
 * 3. Saves to server on mouseup
 */
export function useDraggablePin(options: UseDraggablePinOptions): UseDraggablePinReturn {
  const {
    pinId,
    latitude,
    longitude,
    mapWidth,
    mapHeight,
    scale,
    isLocked = false,
  } = options;

  const updatePin = useUpdatePin();
  const { showToast } = useToast();

  const [isDragging, setIsDragging] = useState(false);
  const startPosRef = useRef<{ clientX: number; clientY: number; pinX: number; pinY: number } | null>(null);
  const hasMovedRef = useRef(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!startPosRef.current) return;

    const { clientX: startClientX, clientY: startClientY, latitude: startLat, longitude: startLng } = startPosRef.current;

    // Check if movement exceeds threshold
    const deltaX = e.clientX - startClientX;
    const deltaY = e.clientY - startClientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (!hasMovedRef.current && distance <= DRAG_THRESHOLD) {
      return;
    }

    if (!hasMovedRef.current) {
      hasMovedRef.current = true;
      setIsDragging(true);
    }

    // Convert screen delta to map delta (accounting for scale)
    const mapDeltaX = deltaX / scale;
    const mapDeltaY = deltaY / scale;

    // Convert map delta to lat/lng (0-1 range)
    const lngDelta = mapDeltaX / mapWidth;
    const latDelta = mapDeltaY / mapHeight;

    // Calculate new lat/lng
    const newLatitude = startLat + latDelta;
    const newLongitude = startLng + lngDelta;

    // Clamp to valid range
    const clampedLat = Math.max(0, Math.min(1, newLatitude));
    const clampedLng = Math.max(0, Math.min(1, newLongitude));

    // Update store in real-time
    updatePin(pinId, { latitude: clampedLat, longitude: clampedLng });
  }, [scale, mapWidth, mapHeight, pinId, updatePin]);

  const handleMouseUp = useCallback(async (e: MouseEvent) => {
    if (!startPosRef.current) return;

    const wasDragging = hasMovedRef.current;

    if (wasDragging) {
      // Save final position to server
      const { clientX: startClientX, clientY: startClientY, pinX: startPinX, pinY: startPinY } = startPosRef.current;

      const deltaX = (e.clientX - startClientX) / scale;
      const deltaY = (e.clientY - startClientY) / scale;

      const newPinX = startPinX + deltaX;
      const newPinY = startPinY + deltaY;

      // Clamp to map boundaries
      const clampedX = Math.max(0, Math.min(mapWidth, newPinX));
      const clampedY = Math.max(0, Math.min(mapHeight, newPinY));

      // Convert to lat/lng (0-1 range)
      const newLatitude = clampedY / mapHeight;
      const newLongitude = clampedX / mapWidth;

      // Save to server
      try {
        await updatePinPosition(pinId, newLatitude, newLongitude);
      } catch (error) {
        // Rollback on error
        updatePin(pinId, { latitude, longitude });
        console.error("Failed to save pin position:", error);
        showToast("Failed to save pin position.", "error");
      }
    }

    // Cleanup
    setIsDragging(false);
    hasMovedRef.current = false;
    startPosRef.current = null;

    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }, [scale, mapWidth, mapHeight, pinId, latitude, longitude, updatePin, showToast, handleMouseMove]);

  const startDrag = useCallback((e: React.MouseEvent) => {
    if (isLocked) return;
    if (e.button !== 0) return;

    startPosRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      latitude,
      longitude,
    };
    hasMovedRef.current = false;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }, [isLocked, latitude, longitude, handleMouseMove, handleMouseUp]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return {
    isDragging,
    startDrag,
  };
}
