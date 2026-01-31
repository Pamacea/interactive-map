"use client";

import { forwardRef, useMemo } from "react";
import { X, ChevronDown, GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFloatingPanel, type UseFloatingPanelOptions } from "@/components/world/logic/use-floating-panel";
import { Z_INDEX_CLASSES } from "@/constants/z-index";

export interface FloatingPanelProps extends UseFloatingPanelOptions {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  showClose?: boolean;
  showCollapse?: boolean;
  showResize?: boolean;
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
      handlePanelClick,
      dragHandleProps,
      resizeHandleProps,
      collapseProps,
      closeProps,
    } = useFloatingPanel({
      panelId,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
    });

    const { isVisible, position, size, isCollapsed, zIndex } = panelState;

    // Don't render if not visible
    if (!isVisible) return null;

    const panelStyle = useMemo(
      () => ({
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: isCollapsed ? "auto" : `${size.height}px`,
        zIndex,
      }),
      [position, size, isCollapsed, zIndex]
    );

    return (
      <div
        ref={(node) => {
          panelRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "absolute bg-background-card/95 backdrop-blur-sm rounded-md border border-border-subtle shadow-xl overflow-hidden transition-shadow",
          isDragging && "shadow-2xl",
          isResizing && "cursor-se-resize",
          zIndex >= 25 && Z_INDEX_CLASSES.activeFloatingPanel,
          className
        )}
        style={panelStyle}
        onClick={handlePanelClick}
        role="dialog"
        aria-labelledby={`${panelId}-title`}
        aria-modal="false"
      >
        {/* Title bar / Drag handle */}
        <div
          {...dragHandleProps}
          className="flex items-center justify-between px-3 py-2 bg-background-elevated border-b border-border-subtle select-none"
        >
          <div className="flex items-center gap-2 min-w-0">
            {icon && <span className="flex-shrink-0 text-accent-gold">{icon}</span>}
            <h2
              id={`${panelId}-title`}
              className="text-sm font-semibold text-text-primary uppercase tracking-wide truncate"
            >
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {showCollapse && (
              <button
                {...collapseProps}
                type="button"
                className="p-1 text-text-muted hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-colors"
                aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
                title={isCollapsed ? "Expand" : "Collapse"}
              >
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    isCollapsed && "-rotate-90"
                  )}
                />
              </button>
            )}
            {showClose && (
              <button
                {...closeProps}
                type="button"
                className="p-1 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-sm transition-colors"
                aria-label="Close panel"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div
            className="overflow-auto"
            style={{
              maxHeight: `calc(${size.height}px - 40px)`,
              minHeight: `${minHeight - 40}px`,
            }}
          >
            {children}
          </div>
        )}

        {/* Resize handle */}
        {showResize && (
          <button
            onMouseDown={resizeHandleProps.se}
            type="button"
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-center justify-center text-text-muted hover:text-accent-gold transition-colors"
            aria-label="Resize panel"
          >
            <GripHorizontal className="w-3 h-3" />
          </button>
        )}

        {/* Resize indicator */}
        {isResizing && (
          <div className="absolute inset-0 border-2 border-accent-gold/50 pointer-events-none rounded-md" />
        )}
      </div>
    );
  }
);

FloatingPanel.displayName = "FloatingPanel";
