"use client";

import { cn } from "@/lib/utils";
import { pinTypeConfig, type PinType } from "@/constants/pin-types";
import { useContextMenuPosition } from "../logic/use-context-menu-position";
import { PinMenuHeader } from "./pin-menu-header";
import { PinTypeMenuItem } from "./pin-type-menu-item";

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

  const handleSelectPinType = (pinType: string) => {
    onSelectPinType(pinType, coordinates.lat, coordinates.lng);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className={cn(
        "fixed z-50 min-w-[200px] rounded-sm border border-border-subtle",
        "bg-background-card shadow-xl p-1",
        "animate-in fade-in zoom-in-95 duration-200",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
      )}
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      <PinMenuHeader />

      <div className="py-1">
        {Object.entries(pinTypeConfig).map(([type, config]) => (
          <PinTypeMenuItem
            key={type}
            type={type}
            config={config}
            onSelect={handleSelectPinType}
          />
        ))}
      </div>

      <div className="my-1 border-t border-border-subtle" />

      <button
        onClick={onClose}
        className={cn(
          "w-full flex items-center justify-center px-3 py-2 rounded-sm",
          "text-sm font-medium text-text-muted",
          "hover:text-text-primary hover:bg-background-elevated",
          "transition-all duration-150"
        )}
      >
        Cancel
      </button>
    </div>
  );
}
