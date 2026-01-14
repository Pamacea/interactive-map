"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Pin } from "@prisma/client";
import { PopupHeader } from "./popup-header";
import { PopupContent } from "./popup-content";
import { PopupActions } from "./popup-actions";
import { PopupArrow } from "./popup-arrow";

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
      <PopupHeader pin={pin} onClose={onClose} />
      <PopupContent pin={pin} />
      {isOwner && <PopupActions onEdit={onEdit} onDelete={onDelete} />}
      <PopupArrow />
    </div>
  );
}
