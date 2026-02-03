"use client";

import { forwardRef, memo, useEffect, type ReactNode } from "react";
import { useMapExport } from "@/components/export/utils/use-map-export-context";

interface MapContainerProps {
  isCreatingPin: boolean;
  isDragging: boolean;
  showContextMenu: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onContextMenu: (e: React.MouseEvent<HTMLDivElement>) => void;
  children: ReactNode;
}

export const MapContainer = memo(
  forwardRef<HTMLDivElement, MapContainerProps>(
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
      const { setMapElement } = useMapExport();

      // Register map element with export context when ref is set
      useEffect(() => {
        if (typeof ref === "object" && ref !== null && ref.current) {
          setMapElement(ref.current);
        }
      }, [setMapElement, ref]);

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
  )
);

MapContainer.displayName = "MapContainer";
