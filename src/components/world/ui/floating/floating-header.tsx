"use client";

import Link from "next/link";
import { memo, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Home, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScale, useMapStore } from "@/stores/map-store";
import { ExportButton } from "@/components/export/ui/export-button";

const SCALE_OPTIONS = ["1:1000", "1:500", "1:100"] as const;

interface FloatingHeaderProps {
  worldTitle: string;
  worldId: string;
  mapElement?: HTMLElement | null;
}

function ScaleDropdown() {
  const mapScale = useScale();
  const setScale = useMapStore((state) => state.setScale);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="bg-background-base/95 backdrop-blur-sm rounded-sm border border-border-subtle shadow-lg px-2 py-1 flex items-center gap-1.5 hover:border-accent-gold/30 transition-all focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
        title="Change map scale"
        aria-label="Change map scale"
        aria-expanded={open}
        type="button"
      >
        <span className="text-xs font-display font-medium text-accent-gold">{mapScale}</span>
        <ChevronDown
          className={cn("w-3 h-3 text-accent-gold transition-transform", open && "rotate-180")}
        />
      </button>

      {open &&
        createPortal(
          <div
            role="listbox"
            aria-label="Select map scale"
            className="fixed bg-background-base/95 backdrop-blur-sm border border-border-subtle rounded-sm overflow-hidden shadow-lg z-[40]"
            style={{
              bottom: "100px",
              right: "24px",
            }}
            onClick={() => setOpen(false)}
          >
            {SCALE_OPTIONS.map((option) => (
              <button
                key={option}
                role="option"
                aria-selected={mapScale === option}
                onClick={() => setScale(option)}
                className={cn(
                  "w-full px-2 py-1.5 text-left text-xs font-display transition-colors focus:outline-none focus:bg-accent-gold/20 whitespace-nowrap",
                  mapScale === option
                    ? "bg-accent-gold/20 text-accent-gold font-medium"
                    : "text-text-secondary hover:bg-background-elevated/80"
                )}
              >
                {option}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

export const FloatingHeader = memo(function FloatingHeader({
  worldTitle,
  worldId,
  mapElement,
}: FloatingHeaderProps) {
  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-2 items-end">
      {/* Main floating header card */}
      <div className="bg-background-base/95 backdrop-blur-sm rounded-md border border-border-subtle shadow-xl p-2 flex items-center gap-2">
        {/* Navigation buttons */}
        <div className="flex items-center gap-1 pr-2 border-r border-border-subtle">
          <Link
            href="/worlds"
            className="p-2 text-text-secondary hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-colors"
            title="My Worlds"
            aria-label="My Worlds"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link
            href="/explore"
            className="p-2 text-text-secondary hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-colors"
            title="Home"
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
          </Link>
        </div>

        {/* World title */}
        <div className="px-2">
          <span className="text-sm font-display font-medium text-text-primary">
            {worldTitle}
          </span>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-border-subtle" />

        {/* Export button */}
        {mapElement && (
          <ExportButton worldId={worldId} worldTitle={worldTitle} mapElement={mapElement} />
        )}

        {/* Profile link */}
        <Link
          href="/profile"
          className="p-2 text-text-secondary hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-colors"
          title="Profile"
          aria-label="Profile"
        >
          <User className="w-4 h-4" />
        </Link>
      </div>

      {/* Scale dropdown */}
      <ScaleDropdown />
    </div>
  );
});
