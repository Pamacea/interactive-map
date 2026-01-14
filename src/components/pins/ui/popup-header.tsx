/**
 * Popup header component
 * Displays pin icon, title, type, and close button
 */

import * as React from "react";
import { X } from "lucide-react";
import { pinTypeConfig, type PinType } from "@/constants/pin-types";
import { getPinEmoji } from "../utils/pin-popup-utils";
import type { Pin } from "@prisma/client";

interface PopupHeaderProps {
  pin: Pin;
  onClose?: () => void;
}

export function PopupHeader({ pin, onClose }: PopupHeaderProps) {
  const pinConfig = pinTypeConfig[pin.pinType as PinType];

  return (
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
  );
}
