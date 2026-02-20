/**
 * PropertyCoordinates - Display/edit coordinates for map items
 *
 * Features:
 * - Read-only display with copy on click
 * - Editable mode (optional)
 * - Latitude/Longitude labels
 * - Consistent styling
 */

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/shared/utils";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PropertyCoordinatesProps {
  coordinates: Coordinates;
  editable?: boolean;
  onCoordinatesChange?: (coords: Coordinates) => void;
  precision?: number;
  containerClassName?: string;
  label?: string;
}

export function PropertyCoordinates({
  coordinates,
  editable = false,
  onCoordinatesChange,
  precision = 4,
  containerClassName,
  label = "Coordinates",
}: PropertyCoordinatesProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValues, setEditValues] = React.useState({
    lat: coordinates.latitude.toFixed(precision),
    lng: coordinates.longitude.toFixed(precision),
  });
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = `${coordinates.latitude.toFixed(precision)}, ${coordinates.longitude.toFixed(precision)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const lat = parseFloat(editValues.lat);
    const lng = parseFloat(editValues.lng);

    if (!isNaN(lat) && !isNaN(lng)) {
      onCoordinatesChange?.({ latitude: lat, longitude: lng });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValues({
      lat: coordinates.latitude.toFixed(precision),
      lng: coordinates.longitude.toFixed(precision),
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  if (editable && isEditing) {
    return (
      <div className={cn("space-y-2", containerClassName)}>
        <label className="text-xs font-display text-text-muted uppercase tracking-wide">
          {label}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-text-muted/70 block mb-1">
              Latitude
            </label>
            <input
              type="number"
              step="0.0001"
              min="-90"
              max="90"
              value={editValues.lat}
              onChange={(e) => setEditValues({ ...editValues, lat: e.target.value })}
              onKeyDown={handleKeyDown}
              className="w-full bg-background-input border border-border-subtle rounded-sm px-2 py-1.5 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-gold"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted/70 block mb-1">
              Longitude
            </label>
            <input
              type="number"
              step="0.0001"
              min="-180"
              max="180"
              value={editValues.lng}
              onChange={(e) => setEditValues({ ...editValues, lng: e.target.value })}
              onKeyDown={handleKeyDown}
              className="w-full bg-background-input border border-border-subtle rounded-sm px-2 py-1.5 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-gold"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="text-xs text-text-muted hover:text-text-primary px-2 py-1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="text-xs text-accent-gold hover:text-accent-gold/80 px-2 py-1"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "px-3 py-2.5 bg-obsidian/60 border border-border-subtle",
        containerClassName
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-display text-text-muted uppercase tracking-wide">
          {label}
        </label>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs text-text-muted hover:text-accent-gold transition-colors flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-background-input rounded-sm px-2.5 py-2 border border-border-subtle">
          <span className="text-xs text-text-muted/70 block mb-0.5">Lat</span>
          <span className="text-xs font-mono text-accent-gold font-semibold">
            {coordinates.latitude.toFixed(precision)}
          </span>
        </div>
        <div className="bg-background-input rounded-sm px-2.5 py-2 border border-border-subtle">
          <span className="text-xs text-text-muted/70 block mb-0.5">Lng</span>
          <span className="text-xs font-mono text-accent-gold font-semibold">
            {coordinates.longitude.toFixed(precision)}
          </span>
        </div>
      </div>
    </div>
  );
}
