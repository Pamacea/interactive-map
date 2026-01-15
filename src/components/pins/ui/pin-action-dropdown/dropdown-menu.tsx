import { Plus, Crosshair, FileText, Copy } from "lucide-react";

interface DropdownMenuProps {
  isOpen: boolean;
  isPlacingMode: boolean;
  onAddPin: () => void;
  onTogglePlaceMode: () => void;
}

export function DropdownMenu({
  isOpen,
  isPlacingMode,
  onAddPin,
  onTogglePlaceMode,
}: DropdownMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`
        absolute left-0 top-full mt-1 w-full z-50
        bg-background-card border border-border-subtle rounded-sm
        shadow-lg overflow-hidden
        animate-in fade-in slide-in-from-top-1 duration-200
      `}
    >
      {/* Primary Action: Add Pin (opens form modal) */}
      <button
        onClick={onAddPin}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5
          text-sm text-accent-gold font-medium
          hover:bg-accent-gold/10 transition-colors
          border-b border-border-subtle
        `}
      >
        <Plus className="w-4 h-4 flex-shrink-0" />
        <span>Add Pin</span>
      </button>

      {/* Secondary Action: Place Pin Mode (click-to-place on map) */}
      <button
        onClick={onTogglePlaceMode}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5
          text-sm text-text-secondary
          hover:text-accent-gold hover:bg-accent-gold/10
          transition-colors border-b border-border-subtle
          ${isPlacingMode ? "bg-accent-gold/20 text-accent-gold" : ""}
        `}
      >
        <Crosshair className="w-4 h-4 flex-shrink-0" />
        <div className="flex-1 text-left">
          <span>Click on Map</span>
          {isPlacingMode && (
            <span className="ml-2 text-xs text-accent-gold-light">(Active)</span>
          )}
        </div>
      </button>

      {/* Placeholder: Import from CSV */}
      <button
        className="
          w-full flex items-center gap-3 px-3 py-2.5
          text-sm text-text-muted
          hover:text-text-secondary hover:bg-background-elevated
          transition-colors border-b border-border-subtle
          cursor-not-allowed opacity-60
        "
        disabled
        title="Coming soon"
      >
        <FileText className="w-4 h-4 flex-shrink-0" />
        <div className="flex-1 text-left">
          <span>Import from CSV</span>
          <span className="ml-2 text-xs text-text-muted">(Coming soon)</span>
        </div>
      </button>

      {/* Placeholder: Duplicate Existing */}
      <button
        className="
          w-full flex items-center gap-3 px-3 py-2.5
          text-sm text-text-muted
          hover:text-text-secondary hover:bg-background-elevated
          transition-colors
          cursor-not-allowed opacity-60
        "
        disabled
        title="Coming soon"
      >
        <Copy className="w-4 h-4 flex-shrink-0" />
        <div className="flex-1 text-left">
          <span>Duplicate Existing</span>
          <span className="ml-2 text-xs text-text-muted">(Coming soon)</span>
        </div>
      </button>
    </div>
  );
}
