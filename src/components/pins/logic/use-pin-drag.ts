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
  /** Actual rendered X position (with layer offsets applied) */
  renderedX?: number;
  /** Actual rendered Y position (with layer offsets applied) */
  renderedY?: number;
}

/**
 * Refs to store the latest callback dependencies
 * This prevents the cleanup effect from re-running when dependencies change
 */
interface DragRefs {
  scale: number;
  mapWidth: number;
  mapHeight: number;
  pinId: string;
  onUpdatePin: UsePinDragConfig["onUpdatePin"];
  onSelectPin: UsePinDragConfig["onSelectPin"];
  latitude: number;
  longitude: number;
  renderedX: number | undefined;
  renderedY: number | undefined;
  isLocked: boolean;
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
    renderedX,
    renderedY,
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

  // Ref to store the latest config values - prevents cleanup effect from re-running
  // Initialize with current values
  const configRef = useRef<DragRefs>({
    scale,
    mapWidth,
    mapHeight,
    pinId,
    onUpdatePin,
    onSelectPin,
    latitude,
    longitude,
    renderedX,
    renderedY,
    isLocked,
  });

  // Update config ref on each render using an effect to avoid linter error
  useEffect(() => {
    configRef.current = {
      scale,
      mapWidth,
      mapHeight,
      pinId,
      onUpdatePin,
      onSelectPin,
      latitude,
      longitude,
      renderedX,
      renderedY,
      isLocked,
    };
  });

  // Refs to store the latest handler functions
  // This allows handleMouseUp to reference handleMouseMove before it's declared
  const handleMouseMoveRef = useRef<(e: MouseEvent) => void>(() => {});
  const handleMouseUpRef = useRef<(e: MouseEvent) => Promise<void>>(async () => {});

  /**
   * Mouse move handler - attached to window during drag
   * Uses refs to avoid dependency changes
   */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const config = configRef.current;

    // Initialize drag on first significant movement
    if (!dragStartPos.current || !dragOffset.current) {
      return;
    }

    // Calculate delta in screen coordinates (adjusted for scale)
    const deltaX = (e.clientX - dragStartPos.current.x) / config.scale;
    const deltaY = (e.clientY - dragStartPos.current.y) / config.scale;

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
    let newX = (e.clientX / config.scale) - dragOffset.current.x;
    let newY = (e.clientY / config.scale) - dragOffset.current.y;

    // Clamp to map boundaries
    newX = Math.max(0, Math.min(config.mapWidth, newX));
    newY = Math.max(0, Math.min(config.mapHeight, newY));

    // Convert to lat/lng (0-1 range) and update store IMMEDIATELY (optimistic update)
    const newLatitude = newY / config.mapHeight;
    const newLongitude = newX / config.mapWidth;

    // Update Zustand store in real-time so popup can follow
    if (config.onUpdatePin) {
      config.onUpdatePin(config.pinId, {
        latitude: newLatitude,
        longitude: newLongitude,
      });
    }

    // Also update local drag position for PinMarker to use
    const newPosition = { x: newX, y: newY };
    dragPositionRef.current = newPosition;
    setDragPosition(newPosition);
  }, []); // Empty deps - uses configRef instead

  /**
   * Mouse up handler - attached to window during drag
   * Uses refs to avoid dependency changes
   */
  const handleMouseUp = useCallback(async (_e: MouseEvent) => {
    const config = configRef.current;

    // Only proceed with drag logic if we were actually dragging
    if (!isDraggingRef.current) {
      dragStartPos.current = null;
      dragOffset.current = null;
      // Clean up listeners even if we didn't drag
      window.removeEventListener("mousemove", handleMouseMoveRef.current);
      window.removeEventListener("mouseup", handleMouseUpRef.current);
      return;
    }

    isDraggingRef.current = false;
    setIsDragging(false);

    // Clean up listeners after drag completes
    window.removeEventListener("mousemove", handleMouseMoveRef.current);
    window.removeEventListener("mouseup", handleMouseUpRef.current);

    // If we have a drag position and actually moved, save to database
    const currentDragPosition = dragPositionRef.current;
    if (currentDragPosition && hasMovedDuringDragRef.current) {
      // Convert pixel position to map coordinates (0-1 range)
      const newLatitude = Math.max(0, Math.min(1, currentDragPosition.y / config.mapHeight));
      const newLongitude = Math.max(0, Math.min(1, currentDragPosition.x / config.mapWidth));

      // Store position for potential rollback
      const rollbackPosition = lastKnownPositionRef.current || { latitude: config.latitude, longitude: config.longitude };

      // CRITICAL FIX: Cancel any pending sync request for this pin
      // This prevents race conditions when dragging rapidly
      pinSyncQueue.cancelPendingRequest(config.pinId);

      // CRITICAL FIX: Update Zustand store FIRST (optimistic update)
      // This prevents race condition where TanStack Query refetch overwrites new position
      if (config.onUpdatePin) {
        config.onUpdatePin(config.pinId, {
          latitude: newLatitude,
          longitude: newLongitude,
        });
      }

      // Store the new position as last known
      lastKnownPositionRef.current = { latitude: newLatitude, longitude: newLongitude };

      // Register new sync request and get abort controller
      const abortController = pinSyncQueue.registerRequest(config.pinId, rollbackPosition);

      // Then update database in background
      // Zustand is now source of truth, DB sync happens asynchronously
      try {
        await updatePinPosition(config.pinId, newLatitude, newLongitude);

        // Check if request was cancelled (user dragged again)
        if (abortController.signal.aborted) {
          return;
        }

        // Success: mark request as completed
        pinSyncQueue.markCompleted(pinId);
      } catch {
        // Check if request was aborted (expected when user drags again)
        if (abortController.signal.aborted) {
          return;
        }

        // Real error occurred: rollback and notify user

        // Rollback to last known position
        if (config.onUpdatePin && rollbackPosition) {
          config.onUpdatePin(config.pinId, rollbackPosition);
          lastKnownPositionRef.current = rollbackPosition;
        }

        // Show error toast to user
        showToast(
          "Failed to save pin position. Please check your connection.",
          "error"
        );

        // Mark as completed (failed)
        pinSyncQueue.markCompleted(config.pinId);
      }

      // Clear drag position
      dragPositionRef.current = null;
      setDragPosition(null);
    }

    dragStartPos.current = null;
    dragOffset.current = null;
    // Note: Don't reset hasMovedDuringDrag here, as handleClick needs it
    // It will be reset on next mouseDown
  }, [showToast, pinId]); // showToast and pinId as deps, everything else from configRef

  /**
   * Mouse down handler - attach to pin element
   * Uses refs to avoid dependency changes
   */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const config = configRef.current;

    // Prevent dragging if layer is locked
    if (config.isLocked) {
      return;
    }

    // Only left mouse button
    if (e.button !== 0) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    // Use rendered position if provided (includes layer offsets), otherwise calculate from lat/lng
    const pinPixelX = config.renderedX ?? config.longitude * config.mapWidth;
    const pinPixelY = config.renderedY ?? config.latitude * config.mapHeight;

    // Store initial mouse position
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
    };

    // Calculate offset: distance from mouse to pin (in scaled coordinates)
    // This ensures the pin doesn't "jump" to the mouse position on drag start
    dragOffset.current = {
      x: (e.clientX / config.scale) - pinPixelX,
      y: (e.clientY / config.scale) - pinPixelY,
    };

    // DON'T set isDragging yet - wait for actual mouse movement
    // This prevents hover from triggering drag behavior
    setHasMovedDuringDrag(false); // Reset movement flag
    hasMovedDuringDragRef.current = false;

    // Select pin on drag start
    if (config.onSelectPin) {
      config.onSelectPin(config.pinId);
    }

    // Add window-level event listeners for drag continuation
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }, []); // Empty deps - uses configRef

  // Update handler refs whenever the callbacks change
  // This allows handleMouseUp to reference handleMouseMove
  useEffect(() => {
    handleMouseMoveRef.current = handleMouseMove;
    handleMouseUpRef.current = handleMouseUp;
  }); // eslint-disable-line react-hooks/exhaustive-deps -- Only updating refs, intentionally no deps

  // Cleanup: Cancel any pending sync requests on unmount
  // Note: Uses refs to handlers, so no dependency issues
  useEffect(() => {
    return () => {
      pinSyncQueue.cancelPendingRequest(pinId);
      // Clean up any dangling event listeners
      window.removeEventListener("mousemove", handleMouseMoveRef.current);
      window.removeEventListener("mouseup", handleMouseUpRef.current);
    };
  }, [pinId]); // Only pinId as dependency - handlers accessed via refs

  return {
    isDragging,
    dragPosition,
    hasMovedDuringDrag,
    handleMouseDown,
  };
}
