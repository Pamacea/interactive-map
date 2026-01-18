"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Pin } from "@prisma/client";
import { PopupHeader } from "./popup-header";
import { PopupContentEnhanced } from "./popup-content-enhanced";
import { PopupArrow } from "./popup-arrow";
import { eventManager, stopPropagation } from "@/lib/event-manager";
import { useFocusTrap, useFocusReturn } from "@/hooks/accessibility";

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

  // Focus management - return focus when popup closes
  useFocusReturn(true);

  // Focus trap - keep focus within popup
  useFocusTrap(true, popupRef as React.RefObject<HTMLElement>);

  // Announce to screen readers
  React.useEffect(() => {
    const announce = (message: string) => {
      const liveRegion = document.getElementById('global-live-region');
      if (liveRegion) {
        liveRegion.textContent = '';
        requestAnimationFrame(() => {
          liveRegion.textContent = message;
        });
      }
    };

    announce(`Pin popup opened: ${pin.title || 'Untitled'}`);

    return () => {
      announce('Pin popup closed');
    };
  }, [pin.title]);

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
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-popup-title"
      aria-describedby="pin-popup-description"
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
