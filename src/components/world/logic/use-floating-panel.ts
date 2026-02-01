import { useCallback, useRef, useState, useEffect } from "react";
import { useFloatingPanelsStore, type FloatingPanelId } from "@/store/use-floating-panels-store";

export interface UseFloatingPanelOptions {
  panelId: FloatingPanelId;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
}

interface DragState {
  isDragging: boolean;
  isResizing: boolean;
  resizeDirection: "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | null;
}

export function useFloatingPanel({
  panelId,
  minWidth = 200,
  maxWidth = 800,
  minHeight = 150,
  maxHeight = 800,
  onDragStart,
  onDragEnd,
  onResizeStart,
  onResizeEnd,
}: UseFloatingPanelOptions) {
  const panelState = useFloatingPanelsStore((state) => state.panels[panelId]);
  const updatePosition = useFloatingPanelsStore((state) => state.updatePosition);
  const updateSize = useFloatingPanelsStore((state) => state.updateSize);
  const bringToFront = useFloatingPanelsStore((state) => state.bringToFront);

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    isResizing: false,
    resizeDirection: null,
  });

  const startPosRef = useRef({ x: 0, y: 0 });
  const startPanelPosRef = useRef({ x: 0, y: 0 });
  const startPanelSizeRef = useRef({ width: 0, height: 0 });
  const rafIdRef = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef({ minWidth, maxWidth, minHeight, maxHeight });

  // Keep constraints ref up to date
  useEffect(() => {
    constraintsRef.current = { minWidth, maxWidth, minHeight, maxHeight };
  }, [minWidth, maxWidth, minHeight, maxHeight]);

  // Bring panel to front on click
  const handlePanelClick = useCallback(() => {
    if (!dragState.isDragging && !dragState.isResizing) {
      bringToFront(panelId);
    }
  }, [panelId, bringToFront, dragState.isDragging, dragState.isResizing]);

  // Drag handlers
  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      // Only left mouse button
      if (e.button !== 0) return;

      e.preventDefault();
      e.stopPropagation();

      startPosRef.current = { x: e.clientX, y: e.clientY };
      startPanelPosRef.current = { ...panelState.position };

      setDragState({ isDragging: true, isResizing: false, resizeDirection: null });
      bringToFront(panelId);
      onDragStart?.();

      // Capture pointer on currentTarget (the element with the handler)
      const target = e.currentTarget as HTMLElement;
      try {
        target.setPointerCapture(e.pointerId);
      } catch {
        // Pointer capture might fail if pointer is already released
        // Fall back to document-level event listeners which are already set up
      }
    },
    [panelState.position, panelId, bringToFront, onDragStart]
  );

  // Resize handlers
  const handleResizeStart = useCallback(
    (e: React.PointerEvent, direction: DragState["resizeDirection"]) => {
      // Only left mouse button
      if (e.button !== 0) return;

      e.preventDefault();
      e.stopPropagation();

      startPosRef.current = { x: e.clientX, y: e.clientY };
      startPanelPosRef.current = { ...panelState.position };
      startPanelSizeRef.current = { ...panelState.size };

      setDragState({ isDragging: false, isResizing: true, resizeDirection: direction });
      bringToFront(panelId);
      onResizeStart?.();

      // Capture pointer on currentTarget (the element with the handler)
      const target = e.currentTarget as HTMLElement;
      try {
        target.setPointerCapture(e.pointerId);
      } catch {
        // Pointer capture might fail if pointer is already released
        // Fall back to document-level event listeners which are already set up
      }
    },
    [panelState.position, panelState.size, panelId, bringToFront, onResizeStart]
  );

  // Pointer move handler
  useEffect(() => {
    if (!dragState.isDragging && !dragState.isResizing) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (rafIdRef.current !== null) return;

      rafIdRef.current = requestAnimationFrame(() => {
        const deltaX = e.clientX - startPosRef.current.x;
        const deltaY = e.clientY - startPosRef.current.y;
        const { minWidth, maxWidth, minHeight, maxHeight } = constraintsRef.current;

        if (dragState.isDragging) {
          // Update position
          const newX = startPanelPosRef.current.x + deltaX;
          const newY = startPanelPosRef.current.y + deltaY;

          // Boundary constraints (keep panel at least partially visible)
          const panelWidth = panelState.size.width;
          const panelHeight = panelState.size.height;
          const maxX = window.innerWidth - 50;
          const maxY = window.innerHeight - 50;

          updatePosition(panelId, {
            x: Math.max(-panelWidth + 50, Math.min(newX, maxX - 50)),
            y: Math.max(0, Math.min(newY, maxY - 50)),
          });
        } else if (dragState.isResizing && dragState.resizeDirection) {
          // Update size and possibly position based on resize direction
          const dir = dragState.resizeDirection;
          let newWidth = startPanelSizeRef.current.width;
          let newHeight = startPanelSizeRef.current.height;
          let newX = startPanelPosRef.current.x;
          let newY = startPanelPosRef.current.y;

          // East/West resize
          if (dir.includes("e")) {
            newWidth = Math.min(maxWidth, Math.max(minWidth, startPanelSizeRef.current.width + deltaX));
          }
          if (dir.includes("w")) {
            const w = Math.min(maxWidth, Math.max(minWidth, startPanelSizeRef.current.width - deltaX));
            newX = startPanelPosRef.current.x + (startPanelSizeRef.current.width - w);
            newWidth = w;
          }

          // North/South resize
          if (dir.includes("s")) {
            newHeight = Math.min(maxHeight, Math.max(minHeight, startPanelSizeRef.current.height + deltaY));
          }
          if (dir.includes("n")) {
            const h = Math.min(maxHeight, Math.max(minHeight, startPanelSizeRef.current.height - deltaY));
            newY = startPanelPosRef.current.y + (startPanelSizeRef.current.height - h);
            newHeight = h;
          }

          updateSize(panelId, { width: newWidth, height: newHeight });
          if (newX !== startPanelPosRef.current.x || newY !== startPanelPosRef.current.y) {
            updatePosition(panelId, { x: newX, y: newY });
          }
        }

        rafIdRef.current = null;
      });
    };

    const handlePointerUp = (e: PointerEvent) => {
      // Release pointer capture
      const target = e.target as HTMLElement;
      if (target && target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
      }

      if (dragState.isDragging) {
        setDragState((prev) => ({ ...prev, isDragging: false }));
        onDragEnd?.();
      }
      if (dragState.isResizing) {
        setDragState({ isDragging: false, isResizing: false, resizeDirection: null });
        onResizeEnd?.();
      }

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };

    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointercancel", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointercancel", handlePointerUp);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [
    dragState,
    panelId,
    panelState.size,
    updatePosition,
    updateSize,
    onDragEnd,
    onResizeEnd,
  ]);

  // Collapse toggle
  const toggleCollapse = useCallback(() => {
    useFloatingPanelsStore.getState().toggleCollapse(panelId);
  }, [panelId]);

  // Close panel
  const closePanel = useCallback(() => {
    useFloatingPanelsStore.getState().hidePanel(panelId);
  }, [panelId]);

  return {
    panelRef,
    panelState,
    isDragging: dragState.isDragging,
    isResizing: dragState.isResizing,
    handlePanelClick,
    dragHandleProps: {
      onPointerDown: handleDragStart,
      style: { cursor: dragState.isDragging ? "grabbing" : "grab" },
    },
    resizeHandleProps: {
      se: (e: React.PointerEvent) => handleResizeStart(e, "se"),
    },
    collapseProps: {
      onClick: toggleCollapse,
    },
    closeProps: {
      onClick: closePanel,
    },
  };
}
