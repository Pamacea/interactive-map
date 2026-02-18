/**
 * Simplified Pin Drag Handler
 *
 * Direct event handling without inputManager overhead.
 * Each pin handles its own drag events.
 */

import { useState, useRef } from "react";
import type { Pin } from "@prisma/client";
import { usePinsDataStore } from "@/stores/use-pins-store";

export interface UsePinDragInputOptions {
  pin: Pin;
  imageDimensions: { width: number; height: number };
  transform: { scale: number; translateX: number; translateY: number };
  isLayerLocked: boolean;
  onStart?: () => void;
  onEnd?: (wasDragging: boolean) => void;
}

export interface UsePinDragInputReturn {
  isDragging: boolean;
  dragPosition: { x: number; y: number } | null;
  handleMouseDown: (e: React.MouseEvent) => void;
  justFinishedDragRef: React.MutableRefObject<boolean>;
}

const DRAG_THRESHOLD = 5;

/**
 * Hook for pin drag handling with direct event handling
 */
export function usePinDragInput({
  pin,
  imageDimensions,
  transform,
  isLayerLocked,
  onStart,
  onEnd,
}: UsePinDragInputOptions): UsePinDragInputReturn {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    startLat: number;
    startLng: number;
  } | null>(null);

  const hasMovedRef = useRef(false);
  const justFinishedDragRef = useRef(false);

  // Store refs for callbacks to avoid closure issues
  const pinIdRef = useRef(pin.id);
  const imageDimensionsRef = useRef(imageDimensions);
  const transformRef = useRef(transform);
  const onStartRef = useRef(onStart);
  const onEndRef = useRef(onEnd);

  // Update refs when values change
  pinIdRef.current = pin.id;
  imageDimensionsRef.current = imageDimensions;
  transformRef.current = transform;
  onStartRef.current = onStart;
  onEndRef.current = onEnd;

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only left click
    if (e.button !== 0) return;
    if (isLayerLocked) return;

    // Stop propagation to prevent map pan
    e.stopPropagation();
    e.preventDefault();

    // Get initial position from store using current refs
    const store = usePinsDataStore.getState();
    const currentPin = store.pins.find(p => p.id === pinIdRef.current);
    const startLat = currentPin?.latitude ?? pin.latitude;
    const startLng = currentPin?.longitude ?? pin.longitude;

    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startLat,
      startLng,
    };
    hasMovedRef.current = false;

    // Global mouse move handler
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dragStart = dragStartRef.current;
      if (!dragStart) return;

      const { clientX: startClientX, clientY: startClientY, startLat, startLng } = dragStart;

      const screenDeltaX = moveEvent.clientX - startClientX;
      const screenDeltaY = moveEvent.clientY - startClientY;
      const distance = Math.sqrt(screenDeltaX ** 2 + screenDeltaY ** 2);

      if (!hasMovedRef.current && distance <= DRAG_THRESHOLD) {
        return;
      }

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        setIsDragging(true);
        onStartRef.current?.();
      }

      // Get current refs
      const currentTransform = transformRef.current;
      const currentImageDimensions = imageDimensionsRef.current;

      // Convert screen delta to map delta
      const mapDeltaX = screenDeltaX / currentTransform.scale;
      const mapDeltaY = screenDeltaY / currentTransform.scale;

      // Calculate new position
      const newX = startLng * currentImageDimensions.width + mapDeltaX;
      const newY = startLat * currentImageDimensions.height + mapDeltaY;

      // Clamp to map boundaries
      const clampedX = Math.max(0, Math.min(currentImageDimensions.width, newX));
      const clampedY = Math.max(0, Math.min(currentImageDimensions.height, newY));

      // Update local state
      setDragPosition({ x: clampedX, y: clampedY });

      // Update store (optimistic)
      const newLat = clampedY / currentImageDimensions.height;
      const newLng = clampedX / currentImageDimensions.width;
      usePinsDataStore.getState().updatePin(pinIdRef.current, { latitude: newLat, longitude: newLng });
    };

    // Global mouse up handler
    const handleMouseUp = async () => {
      const wasDragging = hasMovedRef.current;

      if (wasDragging) {
        // Save to server when drag ends
        const store = usePinsDataStore.getState();
        const currentPin = store.pins.find(p => p.id === pinIdRef.current);
        if (currentPin) {
          try {
            await store.updatePinServer({
              id: pinIdRef.current,
              latitude: currentPin.latitude,
              longitude: currentPin.longitude,
            });
          } catch (error) {
            console.error("Failed to save pin position:", error);
          }
        }
        justFinishedDragRef.current = true;
      }

      dragStartRef.current = null;
      hasMovedRef.current = false;

      setIsDragging(false);
      setDragPosition(null);
      onEndRef.current?.(wasDragging);

      // Remove global listeners
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    // Add global listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return {
    isDragging,
    dragPosition,
    handleMouseDown,
    justFinishedDragRef,
  };
}
