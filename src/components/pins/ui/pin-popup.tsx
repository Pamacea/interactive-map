"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Pin } from "@prisma/client";
import { PopupHeader } from "./popup-header";
import { PopupContentEnhanced } from "./popup-content-enhanced";
import { PopupArrow } from "./popup-arrow";
import { eventManager, stopPropagation } from "@/lib/event-manager";

interface PinPopupProps {
  pin: Pin;
  onClose?: () => void;
  onDelete?: () => void;
  onTitleChange?: (newTitle: string) => void;
}

export function PinPopup({
  pin,
  onClose,
  onDelete,
  onTitleChange,
}: PinPopupProps) {
  const popupRef = React.useRef<HTMLDivElement>(null);

  // Capture events when popup is mounted to prevent map interactions
  React.useEffect(() => {
    const release = eventManager.capture("pin-popup");
    return () => release();
  }, []);

  // NOTE: We DON'T close popup on click outside anymore
  // User must explicitly click the X button or press Escape to close
  // This allows clicking on the map without losing pin selection

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
        "relative z-50 min-w-[320px] max-w-[400px] rounded-sm border-2 border-[var(--color-accent-gold)]",
        "bg-[var(--color-background-card)] shadow-2xl",
        "font-display text-[var(--color-text-primary)]",
        "animate-in fade-in zoom-in-95 duration-200"
      )}
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      onMouseUp={stopPropagation}
    >
      <PopupHeader pin={pin} onClose={onClose} onDelete={onDelete} onTitleChange={onTitleChange} />
      <PopupContentEnhanced pin={pin} />
      <PopupArrow />
    </div>
  );
}
