"use client";

import * as React from "react";
import { MapPin, MousePointer } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailsEmptyStateProps {
  className?: string;
  type?: "pin" | "layer" | "general";
}

/**
 * DetailsEmptyState - Engaging empty state for the right dock
 *
 * Shows when no item is selected, with:
 * - Illustrative icon with subtle animation
 * - Helpful message
 * - Call-to-action for the user
 */
export function DetailsEmptyState({
  className,
  type = "pin",
}: DetailsEmptyStateProps) {
  const content = React.useMemo(() => {
    switch (type) {
      case "pin":
        return {
          icon: <MapPin className="w-12 h-12" />,
          title: "Select a Pin",
          message: "Click on a pin to view its details",
          cta: "Use the Select tool (V) to click on a pin",
        };
      case "layer":
        return {
          icon: <MapPin className="w-12 h-12" />,
          title: "Select a Layer",
          message: "Choose a layer to view its properties",
          cta: "Toggle layers from the left panel",
        };
      case "general":
      default:
        return {
          icon: <MapPin className="w-12 h-12" />,
          title: "Nothing Selected",
          message: "Select an item to view its details",
          cta: "Click on a pin, layer, or use the Select tool (V)",
        };
    }
  }, [type]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full min-h-64 p-8 text-center",
        className
      )}
    >
      {/* Animated icon */}
      <div className="relative mb-6">
        {/* Outer ring with pulse animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border border-accent-gold/20 animate-ping opacity-20" />
        </div>

        {/* Middle ring with slower pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border border-accent-gold/30 animate-pulse" />
        </div>

        {/* Icon container with subtle float */}
        <div className="relative flex items-center justify-center w-12 h-12">
          <div className="absolute inset-0 text-accent-gold/20 animate-pulse">
            <MousePointer className="w-12 h-12" />
          </div>
          <span className="relative text-accent-gold animate-bounce" style={{ animationDuration: "2s" }}>
            {content.icon}
          </span>
        </div>
      </div>

      {/* Messages */}
      <h3 className="text-lg font-display font-semibold text-text-primary mb-2">
        {content.title}
      </h3>
      <p className="text-sm text-text-secondary mb-4">
        {content.message}
      </p>

      {/* Call-to-action badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-accent-gold/10 border border-accent-gold/30 text-accent-gold">
        <MousePointer className="w-4 h-4" />
        <span className="text-xs font-medium">{content.cta}</span>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="mt-6 flex items-center gap-2 text-xs text-text-muted">
        <kbd className="px-2 py-1 bg-obsidian border border-iron rounded text-text-secondary font-mono">
          V
        </kbd>
        <span>to select</span>
        <kbd className="px-2 py-1 bg-obsidian border border-iron rounded text-text-secondary font-mono">
          P
        </kbd>
        <span>to place pin</span>
      </div>
    </div>
  );
}

/**
 * CompactEmptyState - Smaller variant for tighter spaces
 */
interface CompactEmptyStateProps {
  message?: string;
  className?: string;
}

export function CompactEmptyState({
  message = "No selection",
  className,
}: CompactEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 text-center",
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center mb-3">
        <MapPin className="w-5 h-5 text-accent-gold" />
      </div>
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
}
