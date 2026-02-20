"use client";

import { forwardRef, memo, useEffect, type ReactNode } from "react";
import { useMapExport } from "@/features/export/utils/use-map-export-context";

interface MapContainerProps {
  isCreatingPin: boolean;
  isDragging: boolean;
  showContextMenu: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onContextMenu: (e: React.MouseEvent<HTMLDivElement>) => void;
  cursor?: string; // Dynamic cursor based on active tool
  backgroundColor?: string; // Background color for the map
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
        onMouseMove,
        onMouseUp,
        onClick,
        onContextMenu,
        cursor,
        backgroundColor = "#1a1a1a",
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

      // Build cursor style
      const getCursorStyle = (): React.CSSProperties => {
        // If we have a custom cursor from tools manager, use it as style
        if (cursor) {
          return { cursor };
        }
        // Default cursors
        if (isCreatingPin && !showContextMenu) {
          return { cursor: "crosshair" };
        }
        if (isDragging) {
          return { cursor: "grabbing" };
        }
        return { cursor: "grab" };
      };

      const getCursorClass = () => {
        // Additional classes for ring effect when creating pin
        if (isCreatingPin && !showContextMenu && !cursor) {
          return "ring-2 ring-accent-gold/50 ring-inset";
        }
        return "";
      };

      return (
        <div
          ref={ref}
          data-map-container="true"
          className={`relative w-full h-full overflow-hidden ${getCursorClass()}`}
          style={{ backgroundColor, ...getCursorStyle() }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
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
