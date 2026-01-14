"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, Plus, Crosshair, FileText, Copy, Lock } from "lucide-react";

export interface PinActionDropdownProps {
  worldId: string;
  onAddPin: () => void;
  onTogglePlaceMode: () => void;
  isPlacingMode?: boolean;
  isLayerSelected?: boolean;
}

export function PinActionDropdown({
  worldId,
  onAddPin,
  onTogglePlaceMode,
  isPlacingMode = false,
  isLayerSelected = true,
}: PinActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    // Close dropdown on Escape key
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  const handleAddPin = () => {
    setIsOpen(false);
    onAddPin();
  };

  const handleTogglePlaceMode = () => {
    setIsOpen(false);
    onTogglePlaceMode();
  };

  const handleImportCSV = () => {
    setIsOpen(false);
    // TODO: Implement CSV import functionality
  };

  const handleDuplicateExisting = () => {
    setIsOpen(false);
    // TODO: Implement duplicate existing functionality
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <div className="relative">
        <button
          onClick={() => isLayerSelected && setIsOpen(!isOpen)}
          onMouseEnter={() => !isLayerSelected && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          disabled={!isLayerSelected}
          className={`
            w-full flex items-center justify-center gap-2 px-3 py-2 rounded-sm
            transition-all duration-200
            bg-background-elevated border border-border-subtle
            ${isLayerSelected
              ? "hover:text-accent-gold hover:border-accent-gold/50 hover:bg-accent-gold/10 cursor-pointer"
              : "opacity-50 cursor-not-allowed"
            }
            ${isOpen ? "border-accent-gold/50 bg-accent-gold/10" : "text-text-secondary"}
          `}
          title={isLayerSelected ? "Add Pin" : undefined}
        >
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">Add Pin</span>
          {isLayerSelected && (
            <ChevronDown
              className={`
                w-4 h-4 transition-transform duration-200
                ${isOpen ? "rotate-180" : ""}
              `}
            />
          )}
          {!isLayerSelected && <Lock className="w-3 h-3 ml-auto" />}
        </button>

        {/* Tooltip when no layer selected */}
        {!isLayerSelected && showTooltip && (
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-3 py-2 bg-background-elevated border border-border-subtle rounded-sm shadow-lg whitespace-nowrap">
            <div className="flex items-start gap-2 text-xs">
              <Lock className="w-3 h-3 mt-0.5 flex-shrink-0 text-accent-gold" />
              <p className="text-text-secondary">
                Select a layer first to add pins
              </p>
            </div>
            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-background-elevated border-l border-b border-border-subtle transform rotate-45" />
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute left-0 top-full mt-1 w-full z-50
            bg-background-card border border-border-subtle rounded-sm
            shadow-lg overflow-hidden
            animate-in fade-in slide-in-from-top-1 duration-200
          `}
        >
          {/* Primary Action: Add Pin (opens form modal) */}
          <button
            onClick={handleAddPin}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5
              text-sm text-accent-gold font-medium
              hover:bg-accent-gold/10 transition-colors
              border-b border-border-subtle
            `}
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            <span>Add Pin</span>
          </button>

          {/* Secondary Action: Place Pin Mode (click-to-place on map) */}
          <button
            onClick={handleTogglePlaceMode}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5
              text-sm text-text-secondary
              hover:text-accent-gold hover:bg-accent-gold/10
              transition-colors border-b border-border-subtle
              ${isPlacingMode ? "bg-accent-gold/20 text-accent-gold" : ""}
            `}
          >
            <Crosshair className="w-4 h-4 flex-shrink-0" />
            <div className="flex-1 text-left">
              <span>Click on Map</span>
              {isPlacingMode && (
                <span className="ml-2 text-xs text-accent-gold-light">(Active)</span>
              )}
            </div>
          </button>

          {/* Placeholder: Import from CSV */}
          <button
            onClick={handleImportCSV}
            className="
              w-full flex items-center gap-3 px-3 py-2.5
              text-sm text-text-muted
              hover:text-text-secondary hover:bg-background-elevated
              transition-colors border-b border-border-subtle
              cursor-not-allowed opacity-60
            "
            disabled
            title="Coming soon"
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            <div className="flex-1 text-left">
              <span>Import from CSV</span>
              <span className="ml-2 text-xs text-text-muted">(Coming soon)</span>
            </div>
          </button>

          {/* Placeholder: Duplicate Existing */}
          <button
            onClick={handleDuplicateExisting}
            className="
              w-full flex items-center gap-3 px-3 py-2.5
              text-sm text-text-muted
              hover:text-text-secondary hover:bg-background-elevated
              transition-colors
              cursor-not-allowed opacity-60
            "
            disabled
            title="Coming soon"
          >
            <Copy className="w-4 h-4 flex-shrink-0" />
            <div className="flex-1 text-left">
              <span>Duplicate Existing</span>
              <span className="ml-2 text-xs text-text-muted">(Coming soon)</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
