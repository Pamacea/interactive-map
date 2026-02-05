/**
 * Unified Pin Drag Handler - Fixed Version
 *
 * Uses the input manager for consistent drag behavior across all draggable elements.
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { inputManager, INPUT_PRIORITY } from "@/lib/input-manager";
import type { Pin } from "@prisma/client";
import { usePinById, useUpdatePin } from "@/stores/use-pins-store";

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
}

const DRAG_THRESHOLD = 5;

/**
 * Hook for pin drag handling using the unified input manager
 * Provides consistent drag behavior with proper click vs drag detection
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

  const updatePin = useUpdatePin();
  const latestPin = usePinById(pin.id);

  // Refs to track drag state
  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    startLat: number;
    startLng: number;
    sequenceId: number;
  } | null>(null);

  const hasMovedRef = useRef(false);

  // Register with input manager
  useEffect(() => {
    if (isLayerLocked) return;

    const cleanup = inputManager.register({
      element: "pin-marker",
      elementId: pin.id,
      priority: INPUT_PRIORITY.PIN_MARKER,
      handlers: {
        mouse: {
          down: (e: MouseEvent) => {
            if (e.button !== 0) return false;
            if (isLayerLocked) return false;

            // CRITICAL: Only capture if clicking directly on the pin element
            // Use closest() to find if we clicked within a pin marker (using data-pin-id attribute)
            const clickedPinElement = (e.target as HTMLElement).closest('[data-pin-id]');

            // Check if this pin matches the current pin's ID
            if (!clickedPinElement) return false;
            if (clickedPinElement.getAttribute('data-pin-id') !== pin.id) return false;

            // Store initial state
            dragStartRef.current = {
              clientX: e.clientX,
              clientY: e.clientY,
              startLat: latestPin?.latitude ?? pin.latitude,
              startLng: latestPin?.longitude ?? pin.longitude,
              sequenceId: Date.now(),
            };
            hasMovedRef.current = false;

            return true; // Capture event
          },
          move: (e: MouseEvent) => {
            if (!dragStartRef.current) {
              return false;
            }

            const { clientX: startClientX, clientY: startClientY, startLat, startLng } = dragStartRef.current;

            // Calculate screen delta
            const screenDeltaX = e.clientX - startClientX;
            const screenDeltaY = e.clientY - startClientY;

            // Check threshold
            const distance = Math.sqrt(screenDeltaX ** 2 + screenDeltaY ** 2);

            if (!hasMovedRef.current && distance <= DRAG_THRESHOLD) {
              return true; // Continue, don't capture yet
            }

            if (!hasMovedRef.current) {
              hasMovedRef.current = true;
              setIsDragging(true);
              onStart?.();
            }

            // Convert screen delta to map delta (accounting for scale)
            const mapDeltaX = screenDeltaX / transform.scale;
            const mapDeltaY = screenDeltaY / transform.scale;

            // Calculate new position in pixels (from starting position)
            const newX = startLng * imageDimensions.width + mapDeltaX;
            const newY = startLat * imageDimensions.height + mapDeltaY;

            // Validate dimensions
            if (
              !imageDimensions ||
              imageDimensions.width <= 0 ||
              imageDimensions.height <= 0 ||
              !Number.isFinite(newX) ||
              !Number.isFinite(newY)
            ) {
              return true;
            }

            // Clamp to map boundaries
            const clampedX = Math.max(0, Math.min(imageDimensions.width, newX));
            const clampedY = Math.max(0, Math.min(imageDimensions.height, newY));

            // Update local state for instant visual feedback
            setDragPosition({ x: clampedX, y: clampedY });

            // Update store with normalized coordinates
            const newLat = clampedY / imageDimensions.height;
            const newLng = clampedX / imageDimensions.width;
            updatePin(pin.id, { latitude: newLat, longitude: newLng });

            return true; // Capture event
          },
          up: (_e: MouseEvent) => {
            const wasDragging = hasMovedRef.current;
            dragStartRef.current = null;
            hasMovedRef.current = false;
            setIsDragging(false);
            setDragPosition(null);

            onEnd?.(wasDragging);

            return false; // Let event continue
          },
        },
        keyboard: {}, // Empty keyboard handlers - this hook only handles mouse
      },
      enabled: () => !isLayerLocked,
    });

    return cleanup;
  }, [pin.id, pin.latitude, pin.longitude, latestPin, imageDimensions, transform.scale, isLayerLocked, onStart, onEnd, updatePin]);

  // Mouse down handler for React event (delegates to input manager)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (isLayerLocked) return;

    // Stop propagation to prevent map pan
    e.stopPropagation();
    e.preventDefault();

    // The actual drag handling is done by input manager
  }, [isLayerLocked]);

  return {
    isDragging,
    dragPosition,
    handleMouseDown,
  };
}
