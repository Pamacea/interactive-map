"use client";

import * as React from "react";
import { useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelectedPinId, useClearSelection, usePinById } from "@/stores/use-pins-store";
import { useResizableDock } from "../../logic/use-resizable-dock";
import { PinDetailsPanel } from "./pin-details-panel";
import { MapPropertiesPanel } from "./map-properties-panel";
import { DetailsEmptyState } from "./details-empty-state";
import { useRightDock } from "../../logic/use-right-dock";
import type { GameWorld } from "@/types/world.type";

interface RightDockProps {
  worldId: string;
  world?: GameWorld | null;
}

const DEFAULT_RIGHT_DOCK_WIDTH = 320; // w-80 in Tailwind

/**
 * RightDock - Collapsible right-side dock for details and properties
 *
 * Features:
 * - Resizable width (200px - 600px) with persisted state
 * - Collapsed: width-12 (48px)
 * - Smooth animation on toggle
 * - Persisted state via zustand
 * - Shows pin details when pin selected
 * - Shows world properties when no pin selected
 * - Resets to expanded state when world changes
 */
export function RightDock({ worldId, world }: RightDockProps) {
  const selectedPinId = useSelectedPinId();
  const clearSelection = useClearSelection();
  const pin = usePinById(selectedPinId ?? "");

  // Use persistent dock state
  const { isCollapsed, toggle, expand } = useRightDock();

  // Reset to expanded state when world changes
  useEffect(() => {
    expand();
  }, [worldId, expand]);

  const { isResizing, startResize, getDockStyle, getContentStyle } =
    useResizableDock("right", DEFAULT_RIGHT_DOCK_WIDTH);

  // Custom close handler
  const handleClose = () => {
    clearSelection();
  };

  // Prevent map interactions when interacting with the dock
  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  // Always show the dock (remove the isVisible check that was causing issues)
  const isPinSelected = !!selectedPinId && !!pin;

  return (
    <div
      className={cn(
        "fixed right-0 top-14 bottom-12 z-20",
        "bg-obsidian/95 backdrop-blur-sm",
        "border-l border-iron/50",
        "transition-all duration-300 ease-in-out",
        "flex flex-col",
        !isResizing && "duration-300",
        // Responsive: collapsed on mobile, expanded on larger screens
        isCollapsed ? "w-12" : "w-72 md:w-80 lg:w-96",
        // Max width constraint and responsive limits
        "max-w-[90vw] md:max-w-[600px]"
      )}
      style={isCollapsed ? undefined : getDockStyle()}
      onMouseDown={handleInteraction}
      onMouseUp={handleInteraction}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      onTouchEnd={handleInteraction}
      onTouchMove={handleInteraction}
    >
      {/* Ornate gold corners */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent-gold/40 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent-gold/40 pointer-events-none" />

      {/* Cracked pattern overlay */}
      <div className="absolute inset-0 bg-crack-pattern opacity-[0.03] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-iron/50 bg-obsidian/50">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 min-w-0">
            {isPinSelected ? (
              <>
                <X className="w-4 h-4 text-accent-gold flex-shrink-0 cursor-pointer hover:text-accent-gold/80" onClick={handleClose} />
                <h2 className="text-sm font-display font-semibold text-bone uppercase tracking-wide truncate">
                  Pin Details
                </h2>
              </>
            ) : (
              <>
                <div className="w-4 h-4" />
                <h2 className="text-sm font-display font-semibold text-bone uppercase tracking-wide truncate">
                  Properties
                </h2>
              </>
            )}
          </div>
        ) : (
          <div className="mx-auto">
            {isPinSelected ? (
              <X className="w-5 h-5 text-accent-gold cursor-pointer hover:text-accent-gold/80" onClick={handleClose} />
            ) : (
              <div className="w-5 h-5 rounded-sm bg-accent-gold/20 border border-accent-gold/50" />
            )}
          </div>
        )}
        <button
          type="button"
          onClick={toggle}
          className="p-1.5 text-bone-dark/60 hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-colors"
          aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Resize handle - visible on left edge when expanded */}
      {!isCollapsed && (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize dock"
          className={cn(
            "absolute top-0 bottom-0 cursor-col-resize z-30",
            "hover:bg-accent-gold/50 transition-colors group",
            "left-0 w-1"
          )}
          onMouseDown={startResize}
        >
          {/* Visual indicator on hover */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-8 rounded-sm bg-accent-gold/10 border border-accent-gold/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-accent-gold/50" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative flex-1 overflow-y-auto overflow-x-hidden" style={getContentStyle()}>
        <div className={cn(
          "p-3 transition-all duration-300",
          isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
          {!isCollapsed && (
            <>
              {isPinSelected && pin ? (
                <PinDetailsPanel pin={pin} worldId={worldId} />
              ) : (
                <>
                  {world ? (
                    <MapPropertiesPanel worldId={worldId} world={world} />
                  ) : (
                    <DetailsEmptyState hasPin={false} />
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Collapsed state - single icon */}
        {isCollapsed && (
          <div className="flex flex-col items-center py-4">
            {isPinSelected ? (
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-6 h-6 rounded-sm bg-accent-gold/20 border border-accent-gold/50 flex items-center justify-center">
                  <X className="w-3 h-3 text-accent-gold cursor-pointer hover:text-accent-gold/80" onClick={handleClose} />
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-6 h-6 rounded-sm bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-sm bg-accent-gold/40" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resize overlay during drag */}
      {isResizing && (
        <div
          className="fixed inset-0 z-40 pointer-events-none"
          style={{ cursor: "col-resize" }}
        />
      )}
    </div>
  );
}
