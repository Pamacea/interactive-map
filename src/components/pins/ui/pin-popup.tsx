"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Pin } from "@prisma/client";
import { PopupHeader } from "./popup-header";
import { PopupContentEnhanced } from "./popup-content-enhanced";
import { PopupArrow } from "./popup-arrow";
import { stopPropagation } from "@/lib/event-manager";
import { useFocusTrap, useFocusReturn } from "@/hooks/accessibility";
import { useEventCapture } from "@/hooks/use-event-capture";

interface PinPopupProps {
  pin: Pin;
  worldId?: string;
  onClose?: () => void;
  onDelete?: () => void;
  onTitleChange?: (newTitle: string) => void;
}

export function PinPopup({
  pin,
  worldId,
  onClose,
  onDelete,
  onTitleChange,
}: PinPopupProps) {
  const popupRef = React.useRef<HTMLDivElement>(null);

  // Capture events when popup is mounted to prevent map interactions
  // Using the unified input manager
  useEventCapture({
    scope: "popup",
    onEscape: onClose,
  });

  // Focus management
  useFocusReturn(true);
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

  return (
    <div
      ref={popupRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-popup-title"
      aria-describedby="pin-popup-description"
      className={cn(
        "relative z-50 min-w-80 max-w-96 rounded-sm border-2 border-accent-gold",
        "bg-obsidian/95 backdrop-blur-md shadow-2xl",
        "font-display text-text-primary",
        "animate-in fade-in zoom-in-95 duration-200"
      )}
      onClick={stopPropagation}
      onMouseUp={stopPropagation}
    >
      {/* Header */}
      <PopupHeader pin={pin} onClose={onClose} onDelete={onDelete} onTitleChange={onTitleChange} />

      <PopupContentEnhanced pin={pin} worldId={worldId} />
      <PopupArrow />
    </div>
  );
}
