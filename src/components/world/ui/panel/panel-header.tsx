"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, X, Plus } from "lucide-react";

export type PanelHeaderVariant = "floating" | "sidebar" | "minimal";

export interface PanelHeaderProps {
  title: string;
  icon?: React.ReactNode;
  variant?: PanelHeaderVariant;
  isCollapsed?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  onAdd?: () => void;
  actions?: React.ReactNode;
  className?: string;
  id?: string;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function PanelHeader({
  title,
  icon,
  variant = "floating",
  isCollapsed = false,
  onToggle,
  onClose,
  onAdd,
  actions,
  className,
  id,
  dragHandleProps,
}: PanelHeaderProps) {
  const baseClasses = "relative flex items-center justify-between select-none";

  const variantStyles = {
    floating: "px-3 py-2 bg-stone/50 border-b border-iron/50",
    sidebar: "px-4 py-3 border-b border-iron/50 hover:bg-obsidian/30 transition-colors group cursor-pointer",
    minimal: "px-3 py-2 border-b border-iron/50",
  };

  const isClickable = variant === "sidebar" && onToggle;

  // Stop propagation completely for button clicks
  const handleButtonClick = (
    e: React.MouseEvent,
    callback: () => void
  ) => {
    e.stopPropagation();
    e.preventDefault();
    callback();
  };

  return (
    <div className={cn(baseClasses, variantStyles[variant], className)}>
      {/* Left section: icon + title - This is the drag handle area for floating variant */}
      {variant === "floating" && dragHandleProps ? (
        <div
          {...dragHandleProps}
          className="flex items-center gap-2 min-w-0 flex-1"
          onClick={isClickable ? onToggle : undefined}
        >
          {icon && (
            <span className="flex-shrink-0 text-accent-gold/80">
              {icon}
            </span>
          )}
          <h2
            id={id}
            className="text-sm font-display font-semibold text-bone uppercase tracking-wide truncate"
          >
            {title}
          </h2>
        </div>
      ) : (
        <div
          className="flex items-center gap-2 min-w-0"
          onClick={isClickable ? onToggle : undefined}
        >
          {icon && (
            <span className={cn(
              "flex-shrink-0",
              variant === "floating" && "text-accent-gold/80",
              variant === "sidebar" && "text-accent-gold/70"
            )}>
              {icon}
            </span>
          )}
          <h2
            id={id}
            className="text-sm font-display font-semibold text-bone uppercase tracking-wide truncate"
          >
            {title}
          </h2>
        </div>
      )}

      {/* Right section: actions + toggle + close - NOT draggable */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {actions}
        {onAdd && variant === "floating" && (
          <button
            type="button"
            onClick={(e) => handleButtonClick(e, onAdd)}
            className="p-1 text-bone-dark/60 hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-colors"
            aria-label={`Add ${title}`}
            title={`Add ${title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
        {variant === "sidebar" && onToggle && (
          <ChevronDown
            className={cn(
              "w-4 h-4 text-bone-dark transition-transform duration-200",
              !isCollapsed && "rotate-180"
            )}
          />
        )}
        {variant === "floating" && onToggle && (
          <button
            type="button"
            onClick={(e) => handleButtonClick(e, onToggle)}
            className="p-1 text-bone-dark/60 hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-colors"
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
        {onClose && (
          <button
            type="button"
            onClick={(e) => handleButtonClick(e, onClose)}
            className="p-1 text-bone-dark/60 hover:text-blood hover:bg-blood/10 rounded-sm transition-colors"
            aria-label="Close panel"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
