import { MapPin, ChevronDown, Lock } from "lucide-react";

interface DropdownTriggerProps {
  isOpen: boolean;
  isLayerSelected: boolean;
  showTooltip: boolean;
  onToggle: () => void;
  onShowTooltip: () => void;
  onHideTooltip: () => void;
}

export function DropdownTrigger({
  isOpen,
  isLayerSelected,
  showTooltip,
  onToggle,
  onShowTooltip,
  onHideTooltip,
}: DropdownTriggerProps) {
  return (
    <div className="relative">
      <button
        onClick={() => isLayerSelected && onToggle()}
        onMouseEnter={() => !isLayerSelected && onShowTooltip()}
        onMouseLeave={onHideTooltip}
        disabled={!isLayerSelected}
        className={`
          w-full flex items-center justify-center gap-2 px-3 py-2 rounded-sm
          transition-all duration-200
          bg-background-elevated border border-border-subtle
          ${isLayerSelected
            ? "hover:text-accent-gold hover:border-accent-gold/50 hover:bg-accent-gold/10 cursor-pointer"
            : "opacity-50 cursor-not-allowed"
          }
          ${isOpen ? "border-accent-gold/50 bg-accent-gold/10" : "text-text-secondary"}
        `}
        title={isLayerSelected ? "Add Pin" : undefined}
      >
        <MapPin className="w-4 h-4" />
        <span className="text-sm font-medium">Add Pin</span>
        {isLayerSelected && (
          <ChevronDown
            className={`
              w-4 h-4 transition-transform duration-200
              ${isOpen ? "rotate-180" : ""}
            `}
          />
        )}
        {!isLayerSelected && <Lock className="w-3 h-3 ml-auto" />}
      </button>

      {/* Tooltip when no layer selected */}
      {!isLayerSelected && showTooltip && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-3 py-2 bg-background-elevated border border-border-subtle rounded-sm shadow-lg whitespace-nowrap">
          <div className="flex items-start gap-2 text-xs">
            <Lock className="w-3 h-3 mt-0.5 flex-shrink-0 text-accent-gold" />
            <p className="text-text-secondary">Select a layer first to add pins</p>
          </div>
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-background-elevated border-l border-b border-border-subtle transform rotate-45" />
        </div>
      )}
    </div>
  );
}
