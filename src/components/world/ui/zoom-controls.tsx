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

const _SCALE_OPTIONS = ["1:1000", "1:500", "1:100"] as const;

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

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && scaleDropdownOpen) {
        setScaleDropdownOpen(false);
        setDropdownPosition(null);
        triggerRef.current?.querySelector("button")?.focus();
      }
    };

    if (scaleDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
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

  const handleScaleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        const nextIndex = (index + 1) % SCALE_OPTIONS.length;
        (dropdownRef.current?.children[nextIndex] as HTMLElement)?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        const prevIndex = index === 0 ? SCALE_OPTIONS.length - 1 : index - 1;
        (dropdownRef.current?.children[prevIndex] as HTMLElement)?.focus();
        break;
      case "Escape":
        e.preventDefault();
        setScaleDropdownOpen(false);
        setDropdownPosition(null);
        triggerRef.current?.querySelector("button")?.focus();
        break;
    }
  };

  return (
    <div className="absolute bottom-6 right-6 flex flex-row items-center gap-2" role="group" aria-label="Map zoom controls">
      <div className="bg-obsidian/90 backdrop-blur-md rounded-sm border border-iron shadow-xl px-2 py-1.5 flex items-center gap-1.5 hover:border-accent-gold/50 transition-all duration-300">
        <button
          onClick={onZoomOut}
          className="h-5 w-5 flex items-center justify-center text-bone-dark hover:text-accent-gold hover:bg-accent-gold/20 rounded-sm transition-all duration-150 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
          title="Zoom out"
          aria-label="Zoom out"
          type="button"
        >
          <Minus className="w-2.5 h-2.5" strokeWidth={2} aria-hidden="true" />
        </button>

        <div className="h-4 w-px bg-iron/50" aria-hidden="true" />

        <span
          className="text-xs font-display font-semibold text-bone tabular-nums min-w-[2.5rem] text-center"
          aria-label={`Current zoom level: ${Math.round(scale * 100)} percent`}
          role="status"
        >
          {Math.round(scale * 100)}%
        </span>

        <div className="h-4 w-px bg-iron/50" aria-hidden="true" />

        <button
          onClick={onZoomIn}
          className="h-5 w-5 flex items-center justify-center text-bone-dark hover:text-accent-gold hover:bg-accent-gold/20 rounded-sm transition-all duration-150 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
          title="Zoom in"
          aria-label="Zoom in"
          type="button"
        >
          <Plus className="w-2.5 h-2.5" strokeWidth={2} aria-hidden="true" />
        </button>

        <div className="h-4 w-px bg-iron/50" aria-hidden="true" />

        <button
          onClick={onReset}
          className="h-5 w-5 flex items-center justify-center text-bone-dark hover:text-accent-gold hover:bg-accent-gold/20 rounded-sm transition-all duration-150 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
          title="Reset view"
          aria-label="Reset zoom to default"
          type="button"
        >
          <Maximize2 className="w-2.5 h-2.5" strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <div className="h-6 w-px bg-iron/50" aria-hidden="true" />

      <div className="relative" ref={triggerRef}>
        <button
          onClick={handleToggleDropdown}
          className="bg-obsidian/90 backdrop-blur-md rounded-sm border border-iron shadow-lg px-2 py-1 flex items-center gap-1.5 hover:border-accent-gold/70 hover:bg-accent-gold/10 transition-all duration-150 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
          title="Change map scale"
          aria-label="Change map scale. Current scale: {mapScale}"
          aria-expanded={scaleDropdownOpen}
          aria-haspopup="listbox"
          type="button"
        >
          <span className="text-xs font-display font-medium text-accent-gold">{mapScale}</span>
          <ChevronDown
            className={`w-3 h-3 text-accent-gold transition-transform ${scaleDropdownOpen ? "rotate-180" : ""}`}
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>

        {scaleDropdownOpen &&
          dropdownPosition &&
          createPortal(
            <div
              ref={dropdownRef}
              role="listbox"
              aria-label="Select map scale"
              className="fixed bg-obsidian/95 backdrop-blur-md border border-iron rounded-sm overflow-hidden shadow-xl z-[9999]"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
              }}
            >
              {SCALE_OPTIONS.map((option, index) => (
                <button
                  key={option}
                  role="option"
                  aria-selected={mapScale === option}
                  onClick={() => {
                    setScale(option);
                    setScaleDropdownOpen(false);
                    setDropdownPosition(null);
                  }}
                  onKeyDown={(e) => handleScaleKeyDown(e, index)}
                  className={`w-full px-2 py-1.5 text-left text-xs font-display transition-colors focus:outline-none focus:bg-accent-gold/20 ${
                    mapScale === option
                      ? "bg-accent-gold/20 text-accent-gold font-medium"
                      : "text-bone-dark hover:bg-obsidian"
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
