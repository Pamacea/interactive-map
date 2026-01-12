import { Plus, Minus, Maximize2 } from "lucide-react";

interface ZoomControlsProps {
  scale: number;
  mapScale: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function ZoomControls({ scale, mapScale, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
  return (
    <div className="absolute bottom-6 right-6 flex flex-col items-end gap-1.5">
      <div className="bg-background-base/95 backdrop-blur-sm rounded-sm border border-border-subtle shadow-lg px-2 py-1.5 flex items-center gap-1.5">
        <button
          onClick={onZoomOut}
          className="h-6 w-6 flex items-center justify-center text-text-secondary hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-all"
          title="Zoom out"
        >
          <Minus className="w-3 h-3" strokeWidth={2.5} />
        </button>

        <div className="h-4 w-px bg-border-subtle" />

        <span className="text-xs font-display font-semibold text-text-primary tabular-nums min-w-[2.5rem] text-center">
          {Math.round(scale * 100)}%
        </span>

        <div className="h-4 w-px bg-border-subtle" />

        <button
          onClick={onZoomIn}
          className="h-6 w-6 flex items-center justify-center text-text-secondary hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-all"
          title="Zoom in"
        >
          <Plus className="w-3 h-3" strokeWidth={2.5} />
        </button>

        <div className="h-4 w-px bg-border-subtle" />

        <button
          onClick={onReset}
          className="h-6 w-6 flex items-center justify-center text-text-muted hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-all"
          title="Reset view"
        >
          <Maximize2 className="w-3 h-3" strokeWidth={2.5} />
        </button>
      </div>

      <div className="bg-background-base/95 backdrop-blur-sm rounded-sm border border-border-subtle shadow-lg px-2 py-1">
        <span className="text-xs font-display font-medium text-accent-gold">{mapScale}</span>
      </div>
    </div>
  );
}
