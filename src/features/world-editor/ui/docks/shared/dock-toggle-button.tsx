import { forwardRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils";

interface DockToggleButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
  position: "left" | "right";
  className?: string;
}

export const DockToggleButton = forwardRef<HTMLButtonElement, DockToggleButtonProps>(
  ({ isExpanded, onToggle, position, className }, ref) => {
    const ChevronIcon = position === "left"
      ? (isExpanded ? ChevronLeft : ChevronRight)
      : (isExpanded ? ChevronRight : ChevronLeft);

    const tooltip = isExpanded ? "Collapse" : "Expand";
    const positionClass = position === "left"
      ? "-right-3 left-auto"
      : "-left-3 right-auto";

    return (
      <button
        ref={ref}
        onClick={onToggle}
        type="button"
        className={cn(
          "absolute top-1/2 -translate-y-1/2 z-10",
          "w-6 h-8 flex items-center justify-center",
          "bg-obsidian border border-iron/50 rounded-sm",
          "text-bone-dark hover:text-accent-gold hover:border-accent-gold/50",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-accent-gold/50",
          positionClass,
          className
        )}
        title={tooltip}
        aria-label={tooltip}
      >
        <ChevronIcon className="w-4 h-4" />
      </button>
    );
  }
);

DockToggleButton.displayName = "DockToggleButton";
