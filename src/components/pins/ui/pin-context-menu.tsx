"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import * as LucideIcons from "lucide-react";
import { pinTypeConfig, type PinType } from "@/constants/pin-types";
import { cn } from "@/lib/utils";

/**
 * Pin Context Menu Component
 *
 * Displays a context menu on right-click for pin creation.
 * Shows all 9 pin types with icons and color previews.
 */

export interface PinContextMenuProps {
  /** Screen position for the menu (x, y coordinates) */
  position: { x: number; y: number };
  /** Callback when menu is closed */
  onClose: () => void;
  /** Callback when a pin type is selected */
  onSelectPinType: (pinType: string, lat: number, lng: number) => void;
  /** Map coordinates where pin will be created */
  coordinates: { lat: number; lng: number };
}

export function PinContextMenu({
  position,
  onClose,
  onSelectPinType,
  coordinates,
}: PinContextMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = React.useState(position);

  // Adjust position to prevent going off-screen
  React.useEffect(() => {
    if (!menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = position.x;
    let adjustedY = position.y;

    // Check horizontal bounds
    if (position.x + rect.width > viewportWidth - 16) {
      adjustedX = viewportWidth - rect.width - 16;
    }

    // Check vertical bounds
    if (position.y + rect.height > viewportHeight - 16) {
      adjustedY = viewportHeight - rect.height - 16;
    }

    // Ensure minimum bounds
    if (adjustedX < 16) adjustedX = 16;
    if (adjustedY < 16) adjustedY = 16;

    setAdjustedPosition({ x: adjustedX, y: adjustedY });
  }, [position]);

  // Close on click outside
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

  // Close on Escape key
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

  // Prevent default context menu
  React.useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // Handle pin type selection
  const handleSelectPinType = (pinType: PinType) => {
    console.log("📌 [PinContextMenu] handleSelectPinType called with:", {
      pinType,
      coordinates,
      lat: coordinates.lat,
      lng: coordinates.lng,
    });
    onSelectPinType(pinType, coordinates.lat, coordinates.lng);
    onClose();
  };

  // Get Lucide icon component by name
  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
    return IconComponent ? IconComponent : LucideIcons.MapPin;
  };

  const menuContent = (
    <div
      ref={menuRef}
      className={cn(
        "absolute z-50 min-w-[200px] rounded-sm border border-border-subtle",
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
      {/* Header */}
      <div className="px-3 py-2 border-b border-border-subtle">
        <h3 className="text-sm font-semibold text-text-primary">Create Pin</h3>
        <p className="text-xs text-text-muted">Select pin type</p>
      </div>

      {/* Pin Type Options */}
      <div className="py-1">
        {Object.entries(pinTypeConfig).map(([type, config]) => {
          const IconComponent = getIconComponent(config.icon);

          return (
            <button
              key={type}
              onClick={() => handleSelectPinType(type as PinType)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-sm",
                "text-left transition-all duration-150",
                "hover:bg-accent-gold/10 hover:border hover:border-accent-gold/50",
                "group"
              )}
              title={config.description}
            >
              {/* Icon with color preview */}
              <div
                className="flex h-8 w-8 items-center justify-center rounded-sm"
                style={{
                  backgroundColor: `${config.color}20`,
                  border: `1px solid ${config.color}40`,
                }}
              >
                <IconComponent
                  className="h-4 w-4"
                  style={{ color: config.color }}
                />
              </div>

              {/* Label */}
              <span className="flex-1 text-sm font-medium text-text-primary group-hover:text-accent-gold">
                {config.label}
              </span>

              {/* Color preview circle */}
              <div
                className="h-3 w-3 rounded-full shadow-sm"
                style={{ backgroundColor: config.color }}
              />
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="my-1 border-t border-border-subtle" />

      {/* Cancel Option */}
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

  // Render using Portal for proper z-index stacking
  return createPortal(menuContent, document.body);
}
