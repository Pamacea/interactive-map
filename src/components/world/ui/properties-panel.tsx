"use client";

import { useState, useRef, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { useGrid, useSnap, useScale, useMapStore } from "@/stores/map-store";

const SCALE_OPTIONS = ["1:1000", "1:500", "1:100"] as const;

export function PropertiesPanel() {
  const grid = useGrid();
  const snap = useSnap();
  const scale = useScale();
  const setGrid = useMapStore((state) => state.setGrid);
  const setSnap = useMapStore((state) => state.setSnap);
  const setScale = useMapStore((state) => state.setScale);
  const [scaleDropdownOpen, setScaleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setScaleDropdownOpen(false);
      }
    };

    if (scaleDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [scaleDropdownOpen]);

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <div className={`flex items-center justify-between px-3 py-2 rounded-sm bg-background-elevated transition-colors ${grid ? "border border-accent-gold/30" : ""}`}>
          <span className="text-sm text-text-secondary">Grid</span>
          <Switch checked={grid} onCheckedChange={setGrid} />
        </div>

        <div className={`flex items-center justify-between px-3 py-2 rounded-sm bg-background-elevated transition-colors ${snap ? "border border-accent-gold/30" : ""}`}>
          <span className="text-sm text-text-secondary">Snap</span>
          <Switch checked={snap} onCheckedChange={setSnap} />
        </div>

        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center justify-between px-3 py-2 rounded-sm bg-background-elevated cursor-pointer hover:bg-background-elevated/80 transition-colors"
            onClick={() => setScaleDropdownOpen(!scaleDropdownOpen)}
          >
            <span className="text-sm text-text-secondary">Scale</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-display font-medium text-accent-gold">{scale}</span>
              <svg
                className={`w-4 h-4 text-text-muted transition-transform ${scaleDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {scaleDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background-elevated border border-border-subtle rounded-sm overflow-hidden shadow-lg z-50">
              {SCALE_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setScale(option);
                    setScaleDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-display transition-colors ${
                    scale === option
                      ? "bg-accent-gold/20 text-accent-gold font-medium"
                      : "text-text-secondary hover:bg-background-elevated/80"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
