"use client";

import { Grid3x3, Columns, Rows, LayoutGrid } from "lucide-react";
import { cn } from "@/shared/utils";

export type GalleryLayout = "grid-3" | "grid-2" | "vertical-1-2" | "horizontal-3";

const LAYOUTS: Record<GalleryLayout, { name: string; cols: number; rows?: number }> = {
  "grid-3": { name: "Grid 3x", cols: 3 },
  "grid-2": { name: "Grid 2x", cols: 2 },
  "vertical-1-2": { name: "1+2", cols: 2, rows: 3 },
  "horizontal-3": { name: "3 Row", cols: 1, rows: 3 },
};

interface GalleryLayoutControlsProps {
  layout: GalleryLayout;
  onLayoutChange: (layout: GalleryLayout) => void;
}

/**
 * Gallery Layout Controls
 * Buttons to switch between different gallery layouts
 */
export function GalleryLayoutControls({ layout, onLayoutChange }: GalleryLayoutControlsProps) {
  return (
    <div className="flex items-center border border-border-subtle rounded-sm overflow-hidden">
      {(Object.entries(LAYOUTS) as [GalleryLayout, { name: string; cols: number }][]).map(([key, { name }]) => (
        <button
          key={key}
          type="button"
          onClick={() => onLayoutChange(key as GalleryLayout)}
          className={cn(
            "px-2 py-1 text-xs transition-colors",
            layout === key
              ? "bg-accent-gold/20 text-accent-gold"
              : "text-text-muted hover:text-text-primary hover:bg-white/5"
          )}
          title={name}
        >
          {key === "grid-3" && <Grid3x3 className="h-3 w-3" />}
          {key === "grid-2" && <Columns className="h-3 w-3" />}
          {key === "vertical-1-2" && <LayoutGrid className="h-3 w-3" />}
          {key === "horizontal-3" && <Rows className="h-3 w-3" />}
        </button>
      ))}
    </div>
  );
}

export function getGridClass(layout: GalleryLayout): string {
  switch (layout) {
    case "grid-3":
      return "grid grid-cols-3 gap-2";
    case "grid-2":
      return "grid grid-cols-2 gap-2";
    case "vertical-1-2":
      return "grid grid-cols-2 gap-2";
    case "horizontal-3":
      return "grid grid-cols-1 gap-2";
    default:
      return "grid grid-cols-3 gap-2";
  }
}

export function getImageClass(index: number, layout: GalleryLayout): string {
  if (layout === "vertical-1-2") {
    return index === 0 ? "row-span-2" : "";
  }
  return "";
}
