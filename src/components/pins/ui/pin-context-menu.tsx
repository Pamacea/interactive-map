"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { pinTypeConfig, type PinType } from "@/constants/pin-types";
import { useContextMenuPosition } from "../logic/use-context-menu-position";
import { PinMenuHeader } from "./pin-menu-header";
import { PinTypeMenuItem } from "./pin-type-menu-item";
import { useFocusTrap } from "@/hooks/accessibility";

export interface PinContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onSelectPinType: (pinType: string, lat: number, lng: number) => void;
  coordinates: { lat: number; lng: number };
}

export function PinContextMenu({
  position,
  onClose,
  onSelectPinType,
  coordinates,
}: PinContextMenuProps) {
  const { menuRef, adjustedPosition } = useContextMenuPosition({
    position,
    onClose,
  });

  useFocusTrap(true, menuRef as React.RefObject<HTMLElement>);

  useEffect(() => {
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

  const handleSelectPinType = (pinType: string) => {
    onSelectPinType(pinType, coordinates.lat, coordinates.lng);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Create pin menu"
      aria-orientation="vertical"
      className={cn(
        "fixed z-50 min-w-52 rounded-sm border border-iron",
        "bg-obsidian/90 backdrop-blur-md shadow-xl overflow-hidden",
        "animate-in fade-in zoom-in-95 duration-200"
      )}
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      {/* Ornate gold corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent-gold/40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent-gold/40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent-gold/40 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent-gold/40 pointer-events-none" />

      <PinMenuHeader />

      <div role="none" className="py-1">
        {Object.entries(pinTypeConfig).map(([type, config]) => (
          <PinTypeMenuItem
            key={type}
            type={type}
            config={config}
            onSelect={handleSelectPinType}
          />
        ))}
      </div>

      <div role="none" className="my-1 border-t border-iron/50 mx-2" />

      <button
        onClick={onClose}
        role="menuitem"
        className={cn(
          "w-full flex items-center justify-center px-3 py-2 rounded-sm mx-1 mb-1",
          "text-sm font-display font-medium text-bone-dark",
          "hover:text-accent-gold hover:bg-obsidian",
          "transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
        )}
        type="button"
      >
        Cancel
      </button>
    </div>
  );
}
