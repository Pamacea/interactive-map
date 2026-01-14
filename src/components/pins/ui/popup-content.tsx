/**
 * Popup content component
 * Displays pin description, properties, and coordinates
 */

import * as React from "react";
import { formatPropertyValue, formatCoordinate } from "../utils/pin-popup-utils";
import type { Pin } from "@prisma/client";

interface PopupContentProps {
  pin: Pin;
}

export function PopupContent({ pin }: PopupContentProps) {
  const properties = (pin.properties as Record<string, unknown>) || {};

  return (
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

      {/* Coordinates */}
      <div className="flex gap-4 text-xs text-[var(--color-text-secondary)]">
        <div>
          <span className="font-medium">Lat:</span> {formatCoordinate(pin.latitude)}
        </div>
        <div>
          <span className="font-medium">Lng:</span> {formatCoordinate(pin.longitude)}
        </div>
      </div>
    </div>
  );
}
