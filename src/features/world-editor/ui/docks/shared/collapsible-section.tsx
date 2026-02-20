"use client";

import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils";

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  badge?: React.ReactNode;
  onToggle?: (isOpen: boolean) => void;
  storageKey?: string; // Optional localStorage key to persist state
}

/**
 * CollapsibleSection - Reusable accordion-style section
 *
 * Features:
 * - Smooth expand/collapse animation
 * - Optional localStorage persistence
 * - Badge support for counts/indicators
 * - Icon support in header
 */
export function CollapsibleSection({
  title,
  icon,
  defaultOpen = true,
  children,
  className,
  contentClassName,
  badge,
  onToggle,
  storageKey,
}: CollapsibleSectionProps) {
  // Get initial state from localStorage or use defaultOpen
  const getInitialState = () => {
    if (storageKey) {
      try {
        const stored = localStorage.getItem(`section-${storageKey}`);
        return stored ? JSON.parse(stored) : defaultOpen;
      } catch {
        return defaultOpen;
      }
    }
    return defaultOpen;
  };

  const [isOpen, setIsOpen] = React.useState(getInitialState);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);

    // Persist to localStorage if storageKey provided
    if (storageKey) {
      try {
        localStorage.setItem(`section-${storageKey}`, JSON.stringify(newState));
      } catch {
        // Ignore localStorage errors
      }
    }
  };

  return (
    <div className={cn("border-b border-border-subtle last:border-0", className)}>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0">
          {icon && (
            <span className="text-text-muted flex-shrink-0 group-hover:text-accent-gold transition-colors">
              {icon}
            </span>
          )}
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {title}
          </span>
          {badge && (
            <span className="flex-shrink-0 text-xs text-accent-gold">
              {badge}
            </span>
          )}
        </div>
        <span className="text-text-muted flex-shrink-0 ml-2">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 transition-transform duration-200" />
          ) : (
            <ChevronRight className="w-4 h-4 transition-transform duration-200" />
          )}
        </span>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className={cn("px-4 pb-4", contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * CompactCollapsibleSection - Smaller variant for tighter layouts
 */
interface CompactCollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  storageKey?: string;
}

export function CompactCollapsibleSection({
  title,
  defaultOpen = true,
  children,
  className,
  contentClassName,
  storageKey,
}: CompactCollapsibleSectionProps) {
  const getInitialState = () => {
    if (storageKey) {
      try {
        const stored = localStorage.getItem(`section-${storageKey}`);
        return stored ? JSON.parse(stored) : defaultOpen;
      } catch {
        return defaultOpen;
      }
    }
    return defaultOpen;
  };

  const [isOpen, setIsOpen] = React.useState(getInitialState);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    if (storageKey) {
      try {
        localStorage.setItem(`section-${storageKey}`, JSON.stringify(newState));
      } catch {
        // Ignore localStorage errors
      }
    }
  };

  return (
    <div className={cn("border-b border-iron", className)}>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between py-2 hover:bg-white/5 transition-colors px-2 -mx-2 rounded-sm"
        aria-expanded={isOpen}
      >
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          {title}
        </span>
        <span className="text-text-muted">
          {isOpen ? (
            <ChevronDown className="w-3 h-3 transition-transform duration-200" />
          ) : (
            <ChevronRight className="w-3 h-3 transition-transform duration-200" />
          )}
        </span>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className={cn("pt-2", contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}
