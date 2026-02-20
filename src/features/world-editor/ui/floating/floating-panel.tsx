"use client";

import { forwardRef, useMemo, useState, useCallback } from "react";
import { GripHorizontal } from "lucide-react";
import { cn } from "@/shared/utils";
import { useFloatingPanel, type UseFloatingPanelOptions } from "@/features/world-editor/logic/use-floating-panel";
import { Z_INDEX_CLASSES } from "@/constants/z-index";
import { PanelHeader } from "../panel";

// Snap configuration
const SNAP_THRESHOLD = 20;
const SNAP_MARGIN = 0;

/**
 * Calculate snapped position to screen edges
 */
function getSnappedPosition(
  x: number,
  y: number,
  width: number,
  height: number
): { x: number; y: number; snapped: boolean } {
  const _viewportWidth = window.innerWidth;
  const _viewportHeight = window.innerHeight;

  let newX = x;
  let newY = y;
  let snapped = false;

  // Left edge
  if (x < SNAP_THRESHOLD + SNAP_MARGIN) {
    newX = SNAP_MARGIN;
    snapped = true;
  }
  // Right edge
  if (x + width > viewportWidth - SNAP_THRESHOLD - SNAP_MARGIN) {
    newX = viewportWidth - width - SNAP_MARGIN;
    snapped = true;
  }
  // Top edge
  if (y < SNAP_THRESHOLD + SNAP_MARGIN) {
    newY = SNAP_MARGIN;
    snapped = true;
  }
  // Bottom edge
  if (y + height > viewportHeight - SNAP_THRESHOLD - SNAP_MARGIN) {
    newY = viewportHeight - height - SNAP_MARGIN;
    snapped = true;
  }

  return { x: newX, y: newY, snapped };
}

export interface FloatingPanelProps extends UseFloatingPanelOptions {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  showClose?: boolean;
  showCollapse?: boolean;
  showResize?: boolean;
  onAdd?: () => void;
  actions?: React.ReactNode;
}

export const FloatingPanel = forwardRef<HTMLDivElement, FloatingPanelProps>(
  (
    {
      title,
      icon,
      children,
      className,
      showClose = true,
      showCollapse = true,
      showResize = true,
      onAdd,
      actions,
      panelId,
      minWidth = 200,
      maxWidth = 800,
      minHeight = 150,
      maxHeight = 800,
    },
    ref
  ) => {
    const {
      panelRef,
      panelState,
      isDragging,
      isResizing,
      dragHandleProps,
      resizeHandleProps,
      collapseProps,
      closeProps,
      updatePosition,
    } = useFloatingPanel({
      panelId,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
    });

    const { isVisible, position, size, isCollapsed, zIndex } = panelState;
    const [isSnapped, setIsSnapped] = useState(false);

    // Prevent map interactions when interacting with floating panels
    const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
      if (e.type === 'pointerup') {
        // Let handleDragEnd handle pointerup
        return;
      }
      e.stopPropagation();
    }, []);

    // Apply snap-to-edges on drag end
    const handleDragEnd = useCallback(() => {
      const snapped = getSnappedPosition(
        position.x,
        position.y,
        size.width,
        size.height
      );

      if (snapped.snapped) {
        updatePosition(panelId, { x: snapped.x, y: snapped.y });
        setIsSnapped(true);
        // Clear snapped state after animation
        setTimeout(() => setIsSnapped(false), 300);
      }
    }, [panelId, position, size, updatePosition]);

    const panelStyle = useMemo(
      () => ({
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: isCollapsed ? "auto" : `${size.height}px`,
        zIndex,
        transition: isDragging ? "none" : isSnapped ? "left 0.2s ease-out, top 0.2s ease-out" : undefined,
      }),
      [position, size, isCollapsed, zIndex, isDragging, isSnapped]
    );

    // Don't render if not visible
    if (!isVisible) return null;

    return (
      <div
        ref={(node) => {
          panelRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "absolute bg-obsidian/80 backdrop-blur-md rounded-sm border border-iron shadow-xl overflow-hidden",
          "hover:border-accent-gold/50",
          isDragging && "shadow-2xl border-accent-gold/30",
          isResizing && "cursor-se-resize",
          zIndex >= 25 && Z_INDEX_CLASSES.activeFloatingPanel,
          isSnapped && "ring-2 ring-accent-gold/30",
          className
        )}
        style={panelStyle}
        onMouseDown={handleInteraction}
        onMouseUp={handleInteraction}
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
        onTouchEnd={handleInteraction}
        onTouchMove={handleInteraction}
        onPointerUp={handleDragEnd}
        role="dialog"
        aria-labelledby={`${panelId}-title`}
        aria-modal="false"
      >
        {/* Ornate gold corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-gold/40 pointer-events-none transition-colors" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent-gold/40 pointer-events-none transition-colors" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent-gold/40 pointer-events-none transition-colors" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-gold/40 pointer-events-none transition-colors" />

        {/* Cracked pattern overlay */}
        <div className="absolute inset-0 bg-crack-pattern opacity-[0.03] pointer-events-none" />

        {/* Title bar / Drag handle */}
        <PanelHeader
          id={`${panelId}-title`}
          title={title}
          icon={icon}
          variant="floating"
          isCollapsed={isCollapsed}
          onToggle={showCollapse ? () => collapseProps.onClick() : undefined}
          onClose={showClose ? () => closeProps.onClick() : undefined}
          onAdd={onAdd}
          actions={actions}
          dragHandleProps={dragHandleProps}
        />

        {/* Content */}
        {!isCollapsed && (
          <div
            className="overflow-auto"
            style={{
              maxHeight: `calc(${size.height}px - 40px)`,
              minHeight: `${minHeight - 40}px`,
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        )}

        {/* Resize handle */}
        {showResize && (
          <button
            onPointerDown={resizeHandleProps.se}
            type="button"
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-center justify-center text-bone-dark/40 hover:text-accent-gold transition-colors"
            aria-label="Resize panel"
          >
            <span suppressHydrationWarning>
              <GripHorizontal className="w-3 h-3" />
            </span>
          </button>
        )}

        {/* Resize indicator */}
        {isResizing && (
          <div className="absolute inset-0 border-2 border-accent-gold/50 pointer-events-none rounded-sm" />
        )}
      </div>
    );
  }
);

FloatingPanel.displayName = "FloatingPanel";
