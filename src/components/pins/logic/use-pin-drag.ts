import { useState, useRef, useCallback } from "react";
import { updatePinPosition } from "@/actions/pins";

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

  // Refs for drag logic
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const dragPositionRef = useRef<{ x: number; y: number } | null>(null);
  const hasMovedDuringDragRef = useRef(false);

  // Convert percentage coordinates to pixels
  const initialPixelX = longitude * mapWidth;
  const initialPixelY = latitude * mapHeight;

  /**
   * Mouse move handler - attached to window during drag
   */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Initialize drag on first significant movement
    if (!dragStartPos.current) {
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

    // Calculate new position (start from pin's original position)
    let newX = initialPixelX + deltaX;
    let newY = initialPixelY + deltaY;

    // Clamp to map boundaries
    newX = Math.max(0, Math.min(mapWidth, newX));
    newY = Math.max(0, Math.min(mapHeight, newY));

    // Update visual position only (not database yet)
    const newPosition = { x: newX, y: newY };
    dragPositionRef.current = newPosition;
    setDragPosition(newPosition);
  }, [scale, mapWidth, mapHeight, initialPixelX, initialPixelY]);

  /**
   * Mouse up handler - attached to window during drag
   */
  const handleMouseUp = useCallback(async (e: MouseEvent) => {
    // Always clean up window listeners, even if we never started dragging
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);

    // Only proceed with drag logic if we were actually dragging
    if (!isDraggingRef.current) {
      dragStartPos.current = null;
      return;
    }

    isDraggingRef.current = false;
    setIsDragging(false);

    // If we have a drag position and actually moved, save to database
    const currentDragPosition = dragPositionRef.current;
    if (currentDragPosition && hasMovedDuringDragRef.current) {
      // Convert pixel position to map coordinates (0-1 range)
      const newLatitude = Math.max(0, Math.min(1, currentDragPosition.y / mapHeight));
      const newLongitude = Math.max(0, Math.min(1, currentDragPosition.x / mapWidth));

      // CRITICAL FIX: Update Zustand store FIRST (optimistic update)
      // This prevents race condition where TanStack Query refetch overwrites new position
      if (onUpdatePin) {
        onUpdatePin(pinId, {
          latitude: newLatitude,
          longitude: newLongitude,
        });
      }

      // Then update database in background (fire-and-forget)
      // Zustand is now source of truth, DB sync happens asynchronously
      updatePinPosition(pinId, newLatitude, newLongitude).catch((error) => {
        console.error("Failed to save pin position to database:", error);
        // Note: We could rollback here, but for UX we keep the optimistic update
        // The next page refresh will sync with DB state
      });

      // Clear drag position
      dragPositionRef.current = null;
      setDragPosition(null);
    }

    dragStartPos.current = null;
    // Note: Don't reset hasMovedDuringDrag here, as handleClick needs it
    // It will be reset on next mouseDown
  }, [mapWidth, mapHeight, pinId, onUpdatePin, handleMouseMove]);

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

    // Store initial mouse position
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
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
  }, [isLocked, pinId, onSelectPin, handleMouseMove, handleMouseUp]);

  return {
    isDragging,
    dragPosition,
    hasMovedDuringDrag,
    handleMouseDown,
  };
}
