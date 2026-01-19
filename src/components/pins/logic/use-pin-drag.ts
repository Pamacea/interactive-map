import { useState, useRef, useCallback, useEffect } from "react";
import { updatePinPosition } from "@/actions/pins";
import { pinSyncQueue } from "./pin-sync-queue";
import { useToast } from "@/hooks/use-toast";

/**
 * Configuration for usePinDrag hook
 */
export interface UsePinDragConfig {
  /** Pin ID to update */
  pinId: string;
  /** Initial position (as percentage 0-1) */
  latitude: number;
  longitude: number;
  /** Map dimensions in pixels for boundary clamping */
  mapWidth: number;
  mapHeight: number;
  /** Current transform scale for coordinate conversion */
  scale: number;
  /** Whether the layer is locked (prevents dragging) */
  isLocked?: boolean;
  /** Callback to select pin on drag start */
  onSelectPin?: (pinId: string) => void;
  /** Callback to update pin in Zustand store (optimistic update) */
  onUpdatePin?: (pinId: string, updates: { latitude: number; longitude: number }) => void;
}

/**
 * Return type for usePinDrag hook
 */
export interface UsePinDragReturn {
  /** Whether the pin is currently being dragged */
  isDragging: boolean;
  /** Current drag position in pixels (null if not dragging) */
  dragPosition: { x: number; y: number } | null;
  /** Whether the pin moved significantly during drag (prevents click on drag end) */
  hasMovedDuringDrag: boolean;
  /** Mouse down handler to attach to pin element */
  handleMouseDown: (e: React.MouseEvent) => void;
}

/**
 * Custom hook for pin drag-and-drop functionality.
 *
 * Features:
 * - Drag starts only after 3px movement (prevents hover from triggering drag)
 * - Position clamping to map boundaries
 * - Optimistic updates to Zustand store
 * - Background DB sync via updatePinPosition server action
 * - Window-level event listeners for drag continuation
 * - Layer lock detection
 *
 * @example
 * ```tsx
 * const { isDragging, dragPosition, hasMovedDuringDrag, handleMouseDown } = usePinDrag({
 *   pinId: pin.id,
 *   latitude: pin.latitude,
 *   longitude: pin.longitude,
 *   mapWidth: 1920,
 *   mapHeight: 1080,
 *   scale: transform.scale,
 *   isLocked: layer?.locked ?? false,
 *   onSelectPin: selectPin,
 *   onUpdatePin: updatePin,
 * });
 * ```
 */
export function usePinDrag(config: UsePinDragConfig): UsePinDragReturn {
  const {
    pinId,
    latitude,
    longitude,
    mapWidth,
    mapHeight,
    scale,
    isLocked = false,
    onSelectPin,
    onUpdatePin,
  } = config;

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [hasMovedDuringDrag, setHasMovedDuringDrag] = useState(false);

  // Toast notifications
  const { showToast } = useToast();

  // Refs for drag logic
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const dragPositionRef = useRef<{ x: number; y: number } | null>(null);
  const hasMovedDuringDragRef = useRef(false);
  const lastKnownPositionRef = useRef<{ latitude: number; longitude: number } | null>(null);

  /**
   * Mouse move handler - attached to window during drag
   */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Initialize drag on first significant movement
    if (!dragStartPos.current || !dragOffset.current) {
      return;
    }

    // Calculate delta in screen coordinates (adjusted for scale)
    const deltaX = (e.clientX - dragStartPos.current.x) / scale;
    const deltaY = (e.clientY - dragStartPos.current.y) / scale;

    // Check if movement is significant (> 3 pixels to account for small movements)
    const hasSignificantMovement = Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3;

    if (hasSignificantMovement) {
      // Start dragging on first significant movement
      if (!isDraggingRef.current) {
        isDraggingRef.current = true;
        setIsDragging(true);
      }
      hasMovedDuringDragRef.current = true;
      setHasMovedDuringDrag(true);
    }

    // Only update position if we're actively dragging
    if (!isDraggingRef.current) {
      return;
    }

    // Calculate new position: current mouse position minus offset (both adjusted for scale)
    let newX = (e.clientX / scale) - dragOffset.current.x;
    let newY = (e.clientY / scale) - dragOffset.current.y;

    // Clamp to map boundaries
    newX = Math.max(0, Math.min(mapWidth, newX));
    newY = Math.max(0, Math.min(mapHeight, newY));

    // Convert to lat/lng (0-1 range) and update store IMMEDIATELY (optimistic update)
    const newLatitude = newY / mapHeight;
    const newLongitude = newX / mapWidth;

    // Update Zustand store in real-time so popup can follow
    if (onUpdatePin) {
      onUpdatePin(pinId, {
        latitude: newLatitude,
        longitude: newLongitude,
      });
    }

    // Also update local drag position for PinMarker to use
    const newPosition = { x: newX, y: newY };
    dragPositionRef.current = newPosition;
    setDragPosition(newPosition);
  }, [scale, mapWidth, mapHeight, pinId, onUpdatePin]);

  /**
   * Mouse up handler - attached to window during drag
   */
  const handleMouseUp = useCallback(async (e: MouseEvent) => {
    // Only proceed with drag logic if we were actually dragging
    if (!isDraggingRef.current) {
      dragStartPos.current = null;
      dragOffset.current = null;
      // Clean up listeners even if we didn't drag
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      return;
    }

    isDraggingRef.current = false;
    setIsDragging(false);

    // Clean up listeners after drag completes
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);

    // If we have a drag position and actually moved, save to database
    const currentDragPosition = dragPositionRef.current;
    if (currentDragPosition && hasMovedDuringDragRef.current) {
      // Convert pixel position to map coordinates (0-1 range)
      const newLatitude = Math.max(0, Math.min(1, currentDragPosition.y / mapHeight));
      const newLongitude = Math.max(0, Math.min(1, currentDragPosition.x / mapWidth));

      // Store position for potential rollback
      const rollbackPosition = lastKnownPositionRef.current || { latitude, longitude };

      // CRITICAL FIX: Cancel any pending sync request for this pin
      // This prevents race conditions when dragging rapidly
      pinSyncQueue.cancelPendingRequest(pinId);

      // CRITICAL FIX: Update Zustand store FIRST (optimistic update)
      // This prevents race condition where TanStack Query refetch overwrites new position
      if (onUpdatePin) {
        onUpdatePin(pinId, {
          latitude: newLatitude,
          longitude: newLongitude,
        });
      }

      // Store the new position as last known
      lastKnownPositionRef.current = { latitude: newLatitude, longitude: newLongitude };

      // Register new sync request and get abort controller
      const abortController = pinSyncQueue.registerRequest(pinId, rollbackPosition);

      // Then update database in background
      // Zustand is now source of truth, DB sync happens asynchronously
      try {
        await updatePinPosition(pinId, newLatitude, newLongitude);

        // Check if request was cancelled (user dragged again)
        if (abortController.signal.aborted) {
          return;
        }

        // Success: mark request as completed
        pinSyncQueue.markCompleted(pinId);
      } catch (error) {
        // Check if request was aborted (expected when user drags again)
        if (abortController.signal.aborted) {
          return;
        }

        // Real error occurred: rollback and notify user

        // Rollback to last known position
        if (onUpdatePin && rollbackPosition) {
          onUpdatePin(pinId, rollbackPosition);
          lastKnownPositionRef.current = rollbackPosition;
        }

        // Show error toast to user
        showToast(
          "Failed to save pin position. Please check your connection.",
          "error"
        );

        // Mark as completed (failed)
        pinSyncQueue.markCompleted(pinId);
      }

      // Clear drag position
      dragPositionRef.current = null;
      setDragPosition(null);
    }

    dragStartPos.current = null;
    dragOffset.current = null;
    // Note: Don't reset hasMovedDuringDrag here, as handleClick needs it
    // It will be reset on next mouseDown
  }, [mapWidth, mapHeight, pinId, latitude, longitude, onUpdatePin, showToast]);

  /**
   * Mouse down handler - attach to pin element
   */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Prevent dragging if layer is locked
    if (isLocked) {
      return;
    }

    // Only left mouse button
    if (e.button !== 0) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    // Convert pin's current position to pixels (accounting for scale)
    const pinPixelX = longitude * mapWidth;
    const pinPixelY = latitude * mapHeight;

    // Store initial mouse position
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
    };

    // Calculate offset: distance from mouse to pin (in scaled coordinates)
    // This ensures the pin doesn't "jump" to the mouse position on drag start
    dragOffset.current = {
      x: (e.clientX / scale) - pinPixelX,
      y: (e.clientY / scale) - pinPixelY,
    };

    // DON'T set isDragging yet - wait for actual mouse movement
    // This prevents hover from triggering drag behavior
    setHasMovedDuringDrag(false); // Reset movement flag
    hasMovedDuringDragRef.current = false;

    // Select pin on drag start
    if (onSelectPin) {
      onSelectPin(pinId);
    }

    // Add window-level event listeners for drag continuation
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }, [isLocked, pinId, latitude, longitude, mapWidth, mapHeight, scale, onSelectPin, handleMouseMove, handleMouseUp]);

  // Cleanup: Cancel any pending sync requests on unmount
  useEffect(() => {
    return () => {
      pinSyncQueue.cancelPendingRequest(pinId);
      // Clean up any dangling event listeners
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [pinId, handleMouseMove, handleMouseUp]);

  return {
    isDragging,
    dragPosition,
    hasMovedDuringDrag,
    handleMouseDown,
  };
}
