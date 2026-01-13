"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Minus, Maximize2, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import { useScale, useMapStore } from "@/stores/map-store";

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const SCALE_OPTIONS = ["1:1000", "1:500", "1:100"] as const;

export function ZoomControls({ scale, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
  const mapScale = useScale();
  const setScale = useMapStore((state) => state.setScale);
  const [scaleDropdownOpen, setScaleDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        triggerRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setScaleDropdownOpen(false);
        setDropdownPosition(null);
      }
    };

    if (scaleDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [scaleDropdownOpen]);

  const handleToggleDropdown = () => {
    if (!scaleDropdownOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.top - 4 - (SCALE_OPTIONS.length * 32),
        left: rect.left,
        width: rect.width,
      });
    }
    setScaleDropdownOpen(!scaleDropdownOpen);
    if (scaleDropdownOpen) {
      setDropdownPosition(null);
    }
  };

  return (
    <div className="absolute bottom-6 right-6 flex flex-row items-center gap-2">
      <div className="bg-background-base/95 backdrop-blur-sm rounded-sm border border-border-subtle shadow-lg px-2 py-1.5 flex items-center gap-1.5">
        <button
          onClick={onZoomOut}
          className="h-5 w-5 flex items-center justify-center text-text-secondary hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-all"
          title="Zoom out"
        >
          <Minus className="w-2.5 h-2.5" strokeWidth={2} />
        </button>

        <div className="h-4 w-px bg-border-subtle" />

        <span className="text-xs font-display font-semibold text-text-primary tabular-nums min-w-[2.5rem] text-center">
          {Math.round(scale * 100)}%
        </span>

        <div className="h-4 w-px bg-border-subtle" />

        <button
          onClick={onZoomIn}
          className="h-5 w-5 flex items-center justify-center text-text-secondary hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-all"
          title="Zoom in"
        >
          <Plus className="w-2.5 h-2.5" strokeWidth={2} />
        </button>

        <div className="h-4 w-px bg-border-subtle" />

        <button
          onClick={onReset}
          className="h-5 w-5 flex items-center justify-center text-text-muted hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-all"
          title="Reset view"
        >
          <Maximize2 className="w-2.5 h-2.5" strokeWidth={2} />
        </button>
      </div>

      <div className="h-6 w-px bg-border-subtle" />

      <div className="relative" ref={triggerRef}>
        <button
          onClick={handleToggleDropdown}
          className="bg-background-base/95 backdrop-blur-sm rounded-sm border border-border-subtle shadow-lg px-2 py-1 flex items-center gap-1.5 hover:border-accent-gold/30 transition-all"
          title="Change map scale"
        >
          <span className="text-xs font-display font-medium text-accent-gold">{mapScale}</span>
          <ChevronDown
            className={`w-3 h-3 text-accent-gold transition-transform ${scaleDropdownOpen ? "rotate-180" : ""}`}
            strokeWidth={2}
          />
        </button>

        {scaleDropdownOpen &&
          dropdownPosition &&
          createPortal(
            <div
              ref={dropdownRef}
              className="fixed bg-background-base/95 backdrop-blur-sm border border-border-subtle rounded-sm overflow-hidden shadow-lg z-[9999]"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
              }}
            >
              {SCALE_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setScale(option);
                    setScaleDropdownOpen(false);
                    setDropdownPosition(null);
                  }}
                  className={`w-full px-2 py-1.5 text-left text-xs font-display transition-colors ${
                    mapScale === option
                      ? "bg-accent-gold/20 text-accent-gold font-medium"
                      : "text-text-secondary hover:bg-background-elevated/80"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>,
            document.body
          )}
      </div>
    </div>
  );
}
