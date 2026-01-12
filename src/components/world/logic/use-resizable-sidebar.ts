import { useState, useRef, useCallback, useEffect } from "react";

export function useResizableSidebar(initialWidth = 320, minWidth = 200, maxWidth = 600) {
  const [width, setWidth] = useState(initialWidth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const startX = useRef(0);
  const startWidth = useRef(0);
  const currentWidth = useRef(initialWidth);
  const rafId = useRef<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startX.current = e.clientX;
    startWidth.current = currentWidth.current;
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      if (rafId.current !== null) {
        return;
      }

      rafId.current = requestAnimationFrame(() => {
        const deltaX = e.clientX - startX.current;
        const newWidth = Math.min(Math.max(startWidth.current + deltaX, minWidth), maxWidth);
        currentWidth.current = newWidth;

        if (sidebarRef.current) {
          sidebarRef.current.style.width = `${newWidth}px`;
        }

        rafId.current = null;
      });
    },
    [isResizing, minWidth, maxWidth]
  );

  const stopResize = useCallback(() => {
    if (!isResizing) return;

    setIsResizing(false);
    setWidth(currentWidth.current);

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
      };
    }
  }, [isResizing, resize, stopResize]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return {
    width,
    isCollapsed,
    isResizing,
    startResize,
    toggleCollapse,
    sidebarRef,
  };
}
