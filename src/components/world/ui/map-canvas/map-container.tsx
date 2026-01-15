"use client";

import { forwardRef, type ReactNode } from "react";

interface MapContainerProps {
  isCreatingPin: boolean;
  isDragging: boolean;
  showContextMenu: boolean;
  onMouseDown: () => void;
  onClick: () => void;
  onContextMenu: () => void;
  children: ReactNode;
}

export const MapContainer = forwardRef<HTMLDivElement, MapContainerProps>(
  (
    {
      isCreatingPin,
      isDragging,
      showContextMenu,
      onMouseDown,
      onClick,
      onContextMenu,
      children,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden ${
          isCreatingPin && !showContextMenu
            ? "cursor-crosshair ring-2 ring-accent-gold/50 ring-inset"
            : isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
        }`}
        onMouseDown={onMouseDown}
        onClick={onClick}
        onContextMenu={onContextMenu}
      >
        {children}
      </div>
    );
  }
);

MapContainer.displayName = "MapContainer";
