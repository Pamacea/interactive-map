import { useState, useRef, useCallback, useEffect } from "react";

const STORAGE_KEYS = {
  left: "genesis-left-dock-width",
  right: "genesis-right-dock-width",
} as const;

const DEFAULT_WIDTH = 240; // w-60 in Tailwind
const MIN_WIDTH = 200;
const MAX_WIDTH = 600;

// Visual feedback configuration
const RESIZE_OVERLAY_OPACITY = 0.1;
const HANDLE_HOVER_WIDTH = 6;
const HANDLE_DEFAULT_WIDTH = 4;

/**
 * Hook pour gérer le redimensionnement des docks
 *
 * Features:
 * - Drag sur le bord pour redimensionner
 * - Largeur min/max (200px - 600px)
 * - Persistance dans localStorage
 * - Curseur col-resize sur le handle
 * - Animation smooth pendant le drag
 * - Overlay pendant le drag (pointer-events-none sur le contenu)
 * - Visual feedback: handle expands on hover, overlay shows during resize
 * - Current size indicator during resize
 */
export interface ResizableDockReturn {
  width: number;
  isResizing: boolean;
  isHandleHovered: boolean;
  dockRef: React.RefObject<HTMLDivElement>;
  handleRef: React.RefObject<HTMLDivElement>;
  startResize: (e: React.MouseEvent) => void;
  onHandleEnter: () => void;
  onHandleLeave: () => void;
  getDockStyle: () => React.CSSProperties;
  getHandleStyle: () => React.CSSProperties;
  getOverlayStyle: () => React.CSSProperties;
  getIndicatorStyle: () => React.CSSProperties;
  getContentStyle: () => React.CSSProperties;
}

export function useResizableDock(
  side: "left" | "right",
  initialWidth = DEFAULT_WIDTH,
  minWidth = MIN_WIDTH,
  maxWidth = MAX_WIDTH
): ResizableDockReturn {
  const storageKey = STORAGE_KEYS[side];

  // Load width from localStorage on mount
  const getInitialWidth = useCallback(() => {
    if (typeof window === "undefined") return initialWidth;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= minWidth && parsed <= maxWidth) {
          return parsed;
        }
      }
    } catch {
      // Ignore storage errors
    }
    return initialWidth;
  }, [storageKey, initialWidth, minWidth, maxWidth]);

  const [width, setWidth] = useState(getInitialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [isHandleHovered, setIsHandleHovered] = useState(false);

  const startX = useRef(0);
  const startWidth = useRef(0);
  const currentWidth = useRef(getInitialWidth());
  const rafId = useRef<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  // Save width to localStorage when it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(storageKey, width.toString());
    } catch {
      // Ignore storage errors
    }
  }, [width, storageKey]);

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    startX.current = e.clientX;
    startWidth.current = currentWidth.current;

    // Disable text selection during resize
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    // Add global overlay class for visual feedback
    document.body.classList.add("is-resizing-dock");
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      if (rafId.current !== null) {
        return;
      }

      rafId.current = requestAnimationFrame(() => {
        // For left dock: delta is positive when dragging right
        // For right dock: delta is negative when dragging left (because handle is on left edge)
        const deltaX = side === "left"
          ? e.clientX - startX.current
          : startX.current - e.clientX;

        const newWidth = Math.min(
          Math.max(startWidth.current + deltaX, minWidth),
          maxWidth
        );

        currentWidth.current = newWidth;
        setWidth(newWidth);

        rafId.current = null;
      });
    },
    [isResizing, minWidth, maxWidth, side]
  );

  const stopResize = useCallback(() => {
    if (!isResizing) return;

    setIsResizing(false);
    setWidth(currentWidth.current);

    // Re-enable text selection
    document.body.style.userSelect = "";
    document.body.style.cursor = "";

    // Remove global overlay class
    document.body.classList.remove("is-resizing-dock");

    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", resize, { passive: true });
      document.addEventListener("mouseup", stopResize);

      return () => {
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);

        if (rafId.current !== null) {
          cancelAnimationFrame(rafId.current);
          rafId.current = null;
        }

        // Re-enable text selection on cleanup
        document.body.style.userSelect = "";
        document.body.style.cursor = "";

        // Remove global overlay class on cleanup
        document.body.classList.remove("is-resizing-dock");
      };
    }
  }, [isResizing, resize, stopResize]);

  // Handle hover events
  const onHandleEnter = useCallback(() => {
    setIsHandleHovered(true);
  }, []);

  const onHandleLeave = useCallback(() => {
    setIsHandleHovered(false);
  }, []);

  // Handle style for the dock
  const getDockStyle = useCallback((): React.CSSProperties => ({
    width: `${width}px`,
    transition: isResizing ? "none" : "width 150ms ease-out",
  }), [width, isResizing]);

  // Handle style for the resize handle
  const getHandleStyle = useCallback((): React.CSSProperties => {
    const handleWidth = isResizing || isHandleHovered ? HANDLE_HOVER_WIDTH : HANDLE_DEFAULT_WIDTH;

    if (side === "left") {
      // Left dock handle on right edge
      return {
        right: 0,
        top: 0,
        bottom: 0,
        width: `${handleWidth}px`,
        backgroundColor: isResizing ? "rgba(212, 175, 55, 0.3)" : isHandleHovered ? "rgba(212, 175, 55, 0.2)" : "transparent",
        transition: isResizing ? "none" : "all 150ms ease-out",
        cursor: "col-resize",
      } as React.CSSProperties;
    } else {
      // Right dock handle on left edge
      return {
        left: 0,
        top: 0,
        bottom: 0,
        width: `${handleWidth}px`,
        backgroundColor: isResizing ? "rgba(212, 175, 55, 0.3)" : isHandleHovered ? "rgba(212, 175, 55, 0.2)" : "transparent",
        transition: isResizing ? "none" : "all 150ms ease-out",
        cursor: "col-resize",
      } as React.CSSProperties;
    }
  }, [side, isResizing, isHandleHovered]);

  // Overlay style for resize feedback
  const getOverlayStyle = useCallback((): React.CSSProperties => ({
    position: "fixed",
    inset: 0,
    backgroundColor: side === "left"
      ? `rgba(212, 175, 55, ${RESIZE_OVERLAY_OPACITY})`
      : `rgba(212, 175, 55, ${RESIZE_OVERLAY_OPACITY})`,
    pointerEvents: "none",
    opacity: isResizing ? 1 : 0,
    transition: "opacity 150ms ease-out",
    zIndex: 9998,
    // Show overlay on the side being resized
    ...(
      side === "left"
        ? { left: 0, right: "auto", width: `${width}px` }
        : { right: 0, left: "auto", width: `${width}px` }
    ),
  }), [side, isResizing, width]);

  // Size indicator style (shows current width in pixels)
  const getIndicatorStyle = useCallback((): React.CSSProperties => ({
    position: "fixed",
    top: "50%",
    transform: "translateY(-50%)",
    ...(side === "left" ? { left: `${width + 16}px` } : { right: `${width + 16}px` }),
    backgroundColor: "rgba(20, 20, 20, 0.9)",
    color: "#d4af37",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
    pointerEvents: "none",
    opacity: isResizing ? 1 : 0,
    transition: "opacity 150ms ease-out",
    zIndex: 9999,
    whiteSpace: "nowrap",
  }), [side, isResizing, width]);

  // Content container style during resize
  const getContentStyle = useCallback((): React.CSSProperties => ({
    pointerEvents: isResizing ? "none" : "auto",
    opacity: isResizing ? 0.7 : 1,
    transition: isResizing ? "none" : "opacity 150ms ease-out",
  }), [isResizing]);

  return {
    width,
    isResizing,
    isHandleHovered,
    dockRef,
    handleRef,
    startResize,
    onHandleEnter,
    onHandleLeave,
    getDockStyle,
    getHandleStyle,
    getOverlayStyle,
    getIndicatorStyle,
    getContentStyle,
  };
}
