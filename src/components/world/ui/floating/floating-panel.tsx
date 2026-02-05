"use client";

import { forwardRef, useMemo } from "react";
import { GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFloatingPanel, type UseFloatingPanelOptions } from "@/components/world/logic/use-floating-panel";
import { Z_INDEX_CLASSES } from "@/constants/z-index";
import { PanelHeader } from "../panel";

export interface FloatingPanelProps extends UseFloatingPanelOptions {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  showClose?: boolean;
  showCollapse?: boolean;
  showResize?: boolean;
  onAdd?: () => void;
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
          "absolute bg-obsidian/80 backdrop-blur-md rounded-sm border border-iron shadow-xl overflow-hidden transition-all duration-300",
          "hover:border-accent-gold/50",
          isDragging && "shadow-2xl border-accent-gold/30",
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
