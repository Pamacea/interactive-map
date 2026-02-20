/**
 * Help Button - Opens keyboard shortcuts help
 *
 * Shows available keyboard shortcuts in a tooltip/modal
 */

import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HelpButtonProps {
  onClick: () => void;
  className?: string;
}

export function HelpButton({ onClick, className }: HelpButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-8 w-8 flex items-center justify-center text-bone-dark hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-gold/50 bg-obsidian/90 backdrop-blur-md border border-iron",
        className
      )}
      title="Keyboard shortcuts (?)"
      aria-label="Show keyboard shortcuts"
      type="button"
    >
      <HelpCircle className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
