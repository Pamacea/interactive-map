"use client";

import { memo, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Wrench } from "lucide-react";
import { cn } from "@/shared/utils";
import { useLeftDock } from "../../logic/use-left-dock";
import { useResizableDock } from "../../logic/use-resizable-dock";
import { ToolsPanel } from "./tools-panel";
import { LayersDockPanel } from "./layers/layers-panel";

interface LeftDockProps {
  className?: string;
  worldId?: string;
}

export const LeftDock = memo(function LeftDock({
  className,
  worldId,
}: LeftDockProps) {
  const { isExpanded, toggle, reset } = useLeftDock();
  const { isResizing, startResize, getDockStyle, getContentStyle } =
    useResizableDock("left");

  // Reset to expanded state when world changes
  useEffect(() => {
    if (worldId) {
      reset();
    }
  }, [worldId, reset]);

  // Prevent map interactions when interacting with the dock
  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className={cn(
        "fixed left-0 top-14 bottom-12 z-20",
        "bg-obsidian/95 backdrop-blur-sm",
        "border-r border-iron/50",
        "transition-all duration-300 ease-in-out",
        "flex flex-col",
        !isResizing && "duration-300",
        // Responsive: collapsed on mobile, expanded on larger screens
        isExpanded ? "w-64 md:w-72 lg:w-80" : "w-12",
        // On very small screens, always stay collapsed to save space
        "max-w-[85vw]", // Prevent overflow on small screens
        className
      )}
      style={isExpanded ? getDockStyle() : undefined}
      onMouseDown={handleInteraction}
      onMouseUp={handleInteraction}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      onTouchEnd={handleInteraction}
      onTouchMove={handleInteraction}
    >
      {/* Ornate gold corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent-gold/40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent-gold/40 pointer-events-none" />

      {/* Cracked pattern overlay */}
      <div className="absolute inset-0 bg-crack-pattern opacity-[0.03] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-iron/50 bg-obsidian/50">
        {!isExpanded ? (
          <div className="mx-auto">
            <Wrench className="w-5 h-5 text-accent-gold" />
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <Wrench className="w-5 h-5 text-accent-gold flex-shrink-0" />
            <h2 className="text-sm font-display font-semibold text-bone uppercase tracking-wide truncate">
              Tools
            </h2>
          </div>
        )}
        <button
          type="button"
          onClick={toggle}
          className="p-1.5 text-bone-dark/60 hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-colors"
          aria-label={isExpanded ? "Collapse tools" : "Expand tools"}
          title={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Resize handle - visible on right edge when expanded */}
      {isExpanded && (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize dock"
          className={cn(
            "absolute top-0 bottom-0 cursor-col-resize z-30",
            "hover:bg-accent-gold/50 transition-colors group",
            "right-0 w-1"
          )}
          onMouseDown={startResize}
        >
          {/* Visual indicator on hover */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-8 rounded-sm bg-accent-gold/10 border border-accent-gold/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-accent-gold/50" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative flex-1 overflow-y-auto overflow-x-hidden" style={getContentStyle()}>
        <div className={cn(
          "p-3 space-y-6 transition-all duration-300",
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <ToolsPanel />
          <LayersDockPanel worldId={worldId} />
        </div>

        {/* Collapsed state - icon strip */}
        {!isExpanded && (
          <div className="flex flex-col items-center py-4 space-y-4">
            {/* Mini tool indicator - shows current tool with icon */}
            <div className="w-8 h-8 flex items-center justify-center">
              <div className="w-6 h-6 rounded-sm bg-accent-gold/20 border border-accent-gold/50 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-accent-gold animate-pulse" />
              </div>
            </div>

            {/* Mini layers indicator */}
            <div className="flex flex-col items-center space-y-1">
              <div className="w-6 h-6 rounded-sm bg-stone/50 border border-iron/50 flex items-center justify-center">
                <div className="w-3 h-3 rounded-sm bg-accent-gold/60" />
              </div>
              <div className="w-4 h-4 rounded-sm bg-stone/30 border border-iron/30 flex items-center justify-center ml-1">
                <div className="w-2 h-2 rounded-sm bg-bone-dark/40" />
              </div>
            </div>
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
});
