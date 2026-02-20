/**
 * PinCoordinateInput - Unified coordinate input for pins
 *
 * Handles both normalized (0-1) and geographic coordinates
 * with validation and visual feedback.
 */

import { memo, useCallback, useState } from "react";
import { cn } from "@/shared/utils";
import { COORDINATE_LIMITS } from "./pin-constants";

export interface PinCoordinateInputProps {
  /** Current latitude value */
  latitude: number;
  /** Current longitude value */
  longitude: number;
  /** Called when coordinates change */
  onChange: (latitude: number, longitude: number) => void;
  /** Error messages */
  latError?: string;
  lngError?: string;
  /** Disable the inputs */
  disabled?: boolean;
  /** Labels for the inputs */
  latLabel?: string;
  lngLabel?: string;
  /** Coordinate type */
  coordinateType?: "normalized" | "geographic";
  /** Step size for increment/decrement */
  step?: number;
  /** Show validation feedback */
  showValidation?: boolean;
  /** Number of decimal places to display */
  decimals?: number;
}

/**
 * Format number to specified decimal places
 */
function formatNumber(num: number, decimals: number = 4): string {
  return num.toFixed(decimals);
}

/**
 * Parse string to number safely
 */
function parseNumber(value: string, fallback: number = 0): number {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * PinCoordinateInput Component
 */
export const PinCoordinateInput = memo(function PinCoordinateInput({
  latitude,
  longitude,
  onChange,
  latError,
  lngError,
  disabled = false,
  latLabel = "Latitude",
  lngLabel = "Longitude",
  coordinateType = "normalized",
  step = 0.0001,
  showValidation = true,
  decimals = 4,
}: PinCoordinateInputProps) {
  const [focusedLat, setFocusedLat] = useState<string | null>(null);
  const [focusedLng, setFocusedLng] = useState<string | null>(null);

  // Determine limits based on coordinate type
  // Get specific limits for each axis
  const latLimits =
    coordinateType === "normalized"
      ? COORDINATE_LIMITS.NORMALIZED
      : COORDINATE_LIMITS.LATITUDE;
  const lngLimits =
    coordinateType === "normalized"
      ? COORDINATE_LIMITS.NORMALIZED
      : COORDINATE_LIMITS.LONGITUDE;

  // Validate coordinates
  const isValidLat =
    latitude >= latLimits.MIN && latitude <= latLimits.MAX;
  const isValidLng =
    longitude >= lngLimits.MIN && longitude <= lngLimits.MAX;

  // Handle latitude change
  const handleLatChange = useCallback(
    (value: string) => {
      const parsed = parseNumber(value, latitude);
      onChange(parsed, longitude);
    },
    [onChange, latitude, longitude]
  );

  // Handle longitude change
  const handleLngChange = useCallback(
    (value: string) => {
      const parsed = parseNumber(value, longitude);
      onChange(latitude, parsed);
    },
    [onChange, latitude, longitude]
  );

  // Input class helper
  const getInputClass = (isValid: boolean, error?: string) => {
    return cn(
      "flex-1 h-10 rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/50 disabled:opacity-50 bg-background-input font-mono",
      error || !isValid ? "border-status-error" : "border-input"
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Latitude Input */}
      <div className="grid gap-1.5">
        <label className="text-sm font-medium leading-none flex items-center gap-1">
          {latLabel}
          {showValidation && (
            latError ? (
              <span className="text-xs text-status-error" aria-label="Invalid coordinate">
                ⚠
              </span>
            ) : isValidLat ? (
              <span className="text-xs text-status-success" aria-label="Valid coordinate">
                ✓
              </span>
            ) : (
              <span className="text-xs text-text-muted" aria-label="Unchecked coordinate">
                ?
              </span>
            )
          )}
        </label>
        <input
          type="number"
          value={focusedLat !== null ? focusedLat : formatNumber(latitude, decimals)}
          onChange={(e) => handleLatChange(e.target.value)}
          onFocus={() => setFocusedLat(formatNumber(latitude, decimals))}
          onBlur={() => setFocusedLat(null)}
          disabled={disabled}
          step={step}
          min={latLimits.MIN}
          max={latLimits.MAX}
          className={getInputClass(isValidLat, latError)}
          aria-invalid={!!latError || !isValidLat}
          aria-describedby={
            latError ? `${latLabel.toLowerCase()}-error` : undefined
          }
        />
        {latError && (
          <p
            id={`${latLabel.toLowerCase()}-error`}
            className="text-xs text-status-error"
          >
            {latError}
          </p>
        )}
      </div>

      {/* Longitude Input */}
      <div className="grid gap-1.5">
        <label className="text-sm font-medium leading-none flex items-center gap-1">
          {lngLabel}
          {showValidation && (
            lngError ? (
              <span className="text-xs text-status-error" aria-label="Invalid coordinate">
                ⚠
              </span>
            ) : isValidLng ? (
              <span className="text-xs text-status-success" aria-label="Valid coordinate">
                ✓
              </span>
            ) : (
              <span className="text-xs text-text-muted" aria-label="Unchecked coordinate">
                ?
              </span>
            )
          )}
        </label>
        <input
          type="number"
          value={focusedLng !== null ? focusedLng : formatNumber(longitude, decimals)}
          onChange={(e) => handleLngChange(e.target.value)}
          onFocus={() => setFocusedLng(formatNumber(longitude, decimals))}
          onBlur={() => setFocusedLng(null)}
          disabled={disabled}
          step={step}
          min={lngLimits.MIN}
          max={lngLimits.MAX}
          className={getInputClass(isValidLng, lngError)}
          aria-invalid={!!lngError || !isValidLng}
          aria-describedby={
            lngError ? `${lngLabel.toLowerCase()}-error` : undefined
          }
        />
        {lngError && (
          <p
            id={`${lngLabel.toLowerCase()}-error`}
            className="text-xs text-status-error"
          >
            {lngError}
          </p>
        )}
      </div>
    </div>
  );
});

PinCoordinateInput.displayName = "PinCoordinateInput";

/**
 * CoordinateDisplay - Read-only display of coordinates
 */
export interface CoordinateDisplayProps {
  latitude: number;
  longitude: number;
  format?: "decimal" | "dms" | "percent";
  decimals?: number;
  className?: string;
}

export const CoordinateDisplay = memo(function CoordinateDisplay({
  latitude,
  longitude,
  format = "decimal",
  decimals = 4,
  className,
}: CoordinateDisplayProps) {
  const formatValue = (value: number) => {
    switch (format) {
      case "percent":
        return `${(value * 100).toFixed(decimals)}%`;
      case "dms":
        // Convert to degrees/minutes/seconds
        const degrees = Math.floor(value);
        const minutesFloat = (value - degrees) * 60;
        const minutes = Math.floor(minutesFloat);
        const seconds = ((minutesFloat - minutes) * 60).toFixed(1);
        return `${degrees}° ${minutes}' ${seconds}"`;
      default:
        return value.toFixed(decimals);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm font-mono text-text-secondary",
        className
      )}
    >
      <span>{formatValue(latitude)}</span>
      <span className="text-text-muted">×</span>
      <span>{formatValue(longitude)}</span>
    </div>
  );
});

CoordinateDisplay.displayName = "CoordinateDisplay";
