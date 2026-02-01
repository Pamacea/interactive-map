"use client";

import * as React from "react";

interface Position {
  x: number;
  y: number;
}

interface UseContextMenuPositionOptions {
  position: Position;
  onClose: () => void;
}

interface UseContextMenuPositionReturn {
  menuRef: React.RefObject<HTMLDivElement | null>;
  adjustedPosition: Position;
}

export function useContextMenuPosition({
  position,
  onClose,
}: UseContextMenuPositionOptions): UseContextMenuPositionReturn {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = React.useState(position);

  React.useEffect(() => {
    if (!menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = position.x;
    let adjustedY = position.y;

    if (position.x + rect.width > viewportWidth - 16) {
      adjustedX = viewportWidth - rect.width - 16;
    }

    if (position.y + rect.height > viewportHeight - 16) {
      adjustedY = viewportHeight - rect.height - 16;
    }

    if (adjustedX < 16) adjustedX = 16;
    if (adjustedY < 16) adjustedY = 16;

    setAdjustedPosition({ x: adjustedX, y: adjustedY });
  }, [position]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  React.useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      // Only prevent context menu inside the menu itself
      // Let clicks outside pass through so the map can handle them
      if (
        menuRef.current &&
        menuRef.current.contains(event.target as Node)
      ) {
        event.preventDefault();
      }
      // Otherwise, let the event propagate to the map's context menu handler
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return { menuRef, adjustedPosition };
}
