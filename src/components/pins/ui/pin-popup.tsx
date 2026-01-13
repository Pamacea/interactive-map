"use client";

import * as React from "react";
import { X, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pinTypeConfig, type PinType } from "@/constants/pin-types";
import { cn } from "@/lib/utils";
import type { Pin } from "@prisma/client";

interface PinPopupProps {
  pin: Pin;
  onClose?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
  position?: { x: number; y: number };
}

export function PinPopup({
  pin,
  onClose,
  onEdit,
  onDelete,
  isOwner = true,
  position,
}: PinPopupProps) {
  const popupRef = React.useRef<HTMLDivElement>(null);
  const [properties, setProperties] = React.useState<Record<string, unknown>>(
    (pin.properties as Record<string, unknown>) || {}
  );

  // Get pin type configuration
  const pinConfig = pinTypeConfig[pin.pinType as PinType];

  // Close popup on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Close popup on Escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className={cn(
        "absolute z-50 w-80 rounded-sm border-2 border-[var(--color-accent-gold)]",
        "bg-[var(--color-background-card)] shadow-2xl",
        "font-display text-[var(--color-text-primary)]",
        "animate-in fade-in zoom-in-95 duration-200"
      )}
      style={{
        left: position?.x ?? 0,
        top: position?.y ?? 0,
        transform: "translate(-50%, -100%) translateY(-16px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border-ornate)] bg-[rgb(212_175_55/0.05)] p-4">
        <div className="flex items-center gap-3">
          {/* Type Icon */}
          <div
            className="flex h-10 w-10 items-center justify-center rounded-sm"
            style={{
              backgroundColor: `${pinConfig.color}20`,
              border: `2px solid ${pinConfig.color}`,
            }}
          >
            <span className="text-lg" style={{ color: pinConfig.color }}>
              {/* Simple icon representation using emoji/fallback */}
              {getPinEmoji(pin.pinType as PinType)}
            </span>
          </div>

          {/* Title and Type */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {pin.title}
            </h3>
            <p
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: pinConfig.color }}
            >
              {pinConfig.label}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent-gold)]"
          aria-label="Close popup"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4 p-4">
        {/* Description */}
        {pin.description && (
          <div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {pin.description}
            </p>
          </div>
        )}

        {/* Properties (RPG Data) */}
        {Object.keys(properties).length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Properties
            </h4>
            <div className="space-y-1 rounded-sm border border-[var(--color-border-ornate)] bg-[rgb(0_0_0/0.2)] p-3">
              {Object.entries(properties).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-start justify-between gap-2 text-sm"
                >
                  <span className="font-medium text-[var(--color-text-secondary)] capitalize">
                    {key}:
                  </span>
                  <span className="text-right font-semibold text-[var(--color-text-primary)]">
                    {formatPropertyValue(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coordinates (Optional, for debugging/precision) */}
        <div className="flex gap-4 text-xs text-[var(--color-text-secondary)]">
          <div>
            <span className="font-medium">Lat:</span> {pin.latitude.toFixed(4)}
          </div>
          <div>
            <span className="font-medium">Lng:</span>{" "}
            {pin.longitude.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Footer Actions (Owner Only) */}
      {isOwner && (
        <div className="flex gap-2 border-t border-[var(--color-border-ornate)] bg-[rgb(0_0_0/0.2)] p-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onEdit}
            className="flex-1"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-950/50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      )}

      {/* Arrow Pointer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
        <div
          className="h-0 w-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[var(--color-accent-gold)]"
          style={{
            borderLeftWidth: "8px",
            borderRightWidth: "8px",
            borderTopWidth: "8px",
          }}
        />
      </div>
    </div>
  );
}

/**
 * Get emoji representation for pin type
 * Fallback icons that work without Lucide React
 */
function getPinEmoji(type: PinType): string {
  const emojiMap: Record<PinType, string> = {
    CITY: "🏰",
    VILLAGE: "🏠",
    POI: "📍",
    CHARACTER: "👤",
    DUNGEON: "⚔️",
    SHOP: "🛒",
    QUEST: "📜",
    TREASURE: "💎",
    CUSTOM: "⭐",
  };
  return emojiMap[type] || "📍";
}

/**
 * Format property value for display
 */
function formatPropertyValue(value: unknown): string {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return JSON.stringify(value);
}
