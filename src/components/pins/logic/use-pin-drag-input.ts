/**
 * Unified Pin Drag Handler - Fixed Version
 *
 * Uses the input manager for consistent drag behavior across all draggable elements.
 * Uses refs to avoid stale closures and prevent re-registration during drag.
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { inputManager, INPUT_PRIORITY } from "@/lib/input-manager";
import type { Pin } from "@prisma/client";
import { useUpdatePin } from "@/stores/use-pins-store";
import { usePinsDataStore } from "@/stores/pins/use-pins-data-store";

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
 * Hook for pin drag handling using the unified input manager
 * Provides consistent drag behavior with proper click vs drag detection
 *
 * CRITICAL: Uses refs for all values accessed in handlers to prevent:
 * 1. Stale closures during drag
 * 2. Re-registration when dependencies change (which breaks drag mid-operation)
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

  // Refs to track drag state
  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    startLat: number;
    startLng: number;
    sequenceId: number;
  } | null>(null);

  const hasMovedRef = useRef(false);
  // Ref that persists through the click cycle to prevent click-after-drag
  const justFinishedDragRef = useRef(false);

  // Store all values that handlers need in refs (updated each render, accessed in handlers)
  const pinIdRef = useRef(pin.id);
  const pinLatRef = useRef(pin.latitude);
  const pinLngRef = useRef(pin.longitude);
  const imageDimRef = useRef(imageDimensions);
  const transformScaleRef = useRef(transform.scale);
  const isLayerLockedRef = useRef(isLayerLocked);
  const onStartRef = useRef(onStart);
  const onEndRef = useRef(onEnd);

  // Update refs on each render
  pinIdRef.current = pin.id;
  pinLatRef.current = pin.latitude;
  pinLngRef.current = pin.longitude;
  imageDimRef.current = imageDimensions;
  transformScaleRef.current = transform.scale;
  isLayerLockedRef.current = isLayerLocked;
  onStartRef.current = onStart;
  onEndRef.current = onEnd;

  // Register with input manager ONCE (only when pin.id changes)
  // Handlers read from refs to always get latest values without re-registration
  useEffect(() => {
    console.log('[DEBUG] Registering pin drag handler for pin:', pin.id);
    const cleanup = inputManager.register({
      element: "pin-marker",
      elementId: pin.id,
      priority: INPUT_PRIORITY.PIN_MARKER,
      handlers: {
        mouse: {
          down: (e: MouseEvent) => {
            console.log('[DEBUG] Pin down handler called', {
              button: e.button,
              target: (e.target as HTMLElement).tagName,
              className: (e.target as HTMLElement).className,
              isLayerLocked: isLayerLockedRef.current,
            });
            if (e.button !== 0) return false;
            if (isLayerLockedRef.current) {
              console.log('[DEBUG] Layer locked, ignoring');
              return false;
            }

            // CRITICAL: Only capture if clicking directly on the pin element
            // Use closest() to find if we clicked within a pin marker (using data-pin-id attribute)
            const clickedPinElement = (e.target as HTMLElement).closest('[data-pin-id]');
            console.log('[DEBUG] clickedPinElement:', clickedPinElement?.getAttribute('data-pin-id'));

            // Check if this pin matches the current pin's ID
            const currentPinId = pinIdRef.current;
            if (!clickedPinElement) {
              console.log('[DEBUG] No pin element found in event target chain');
              return false;
            }
            if (clickedPinElement.getAttribute('data-pin-id') !== currentPinId) {
              console.log('[DEBUG] Pin ID mismatch', {
                clicked: clickedPinElement.getAttribute('data-pin-id'),
                expected: currentPinId,
              });
              return false;
            }

            // Get latest pin data from store at drag start (not from closure)
            const currentPin = usePinsDataStore.getState().pins.find(p => p.id === currentPinId);
            const startLat = currentPin?.latitude ?? pinLatRef.current;
            const startLng = currentPin?.longitude ?? pinLngRef.current;

            // Store initial state
            dragStartRef.current = {
              clientX: e.clientX,
              clientY: e.clientY,
              startLat,
              startLng,
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
              onStartRef.current?.();
            }

            // Get current values from refs (not closure)
            const currentScale = transformScaleRef.current;
            const currentImageDim = imageDimRef.current;
            const currentPinId = pinIdRef.current;

            // Convert screen delta to map delta (accounting for scale)
            const mapDeltaX = screenDeltaX / currentScale;
            const mapDeltaY = screenDeltaY / currentScale;

            // Calculate new position in pixels (from starting position)
            const newX = startLng * currentImageDim.width + mapDeltaX;
            const newY = startLat * currentImageDim.height + mapDeltaY;

            // Validate dimensions
            if (
              !currentImageDim ||
              currentImageDim.width <= 0 ||
              currentImageDim.height <= 0 ||
              !Number.isFinite(newX) ||
              !Number.isFinite(newY)
            ) {
              return true;
            }

            // Clamp to map boundaries
            const clampedX = Math.max(0, Math.min(currentImageDim.width, newX));
            const clampedY = Math.max(0, Math.min(currentImageDim.height, newY));

            // Update local state for instant visual feedback
            setDragPosition({ x: clampedX, y: clampedY });

            // Update store with normalized coordinates
            const newLat = clampedY / currentImageDim.height;
            const newLng = clampedX / currentImageDim.width;
            updatePin(currentPinId, { latitude: newLat, longitude: newLng });

            return true; // Capture event
          },
          up: (_e: MouseEvent) => {
            const wasDragging = hasMovedRef.current;
            dragStartRef.current = null;
            hasMovedRef.current = false;

            // Set flag BEFORE clearing state (for click-after-drag prevention)
            if (wasDragging) {
              justFinishedDragRef.current = true;
            }

            setIsDragging(false);
            setDragPosition(null);

            onEndRef.current?.(wasDragging);

            return false; // Let event continue
          },
        },
        keyboard: {}, // Empty keyboard handlers - this hook only handles mouse
      },
      enabled: () => !isLayerLockedRef.current,
    });

    return cleanup;
  }, [pin.id, updatePin]); // Only re-register if pin.id changes (new pin) or updatePin changes

  // Debug: Track when updatePin changes
  useEffect(() => {
    console.log('[DEBUG] updatePin reference changed for pin:', pin.id);
  }, [updatePin, pin.id]);

  // Debug: Check input manager state on mount
  useEffect(() => {
    console.log('[DEBUG] Input manager state:', {
      registrations: inputManager.getRegistrations().length,
      registrationsList: inputManager.getRegistrations().map(r => ({ element: r.element, elementId: r.elementId })),
    });
  }, []);

  // Mouse down handler for React event (delegates to input manager)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (isLayerLockedRef.current) return;

    // Stop propagation to prevent map pan
    e.stopPropagation();
    e.preventDefault();

    // The actual drag handling is done by input manager
  }, []); // No dependencies - reads from ref

  return {
    isDragging,
    dragPosition,
    handleMouseDown,
    justFinishedDragRef,
  };
}
