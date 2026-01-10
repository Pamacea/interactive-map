import { Plus, Minus, RotateCcw } from "lucide-react";

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function ZoomControls({ scale, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      <div className="flex flex-col gap-1.5">
        <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 rounded-lg border border-slate-500/30 p-1.5 shadow-xl">
          <div className="flex flex-col gap-1">
            <button
              onClick={onZoomIn}
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-accent-gold hover:bg-white/5 rounded transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="h-px bg-slate-500/30" />
            <button
              onClick={onZoomOut}
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-accent-gold hover:bg-white/5 rounded transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="h-px bg-slate-500/30" />
            <button
              onClick={onReset}
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-accent-gold hover:bg-white/5 rounded transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 rounded-lg border border-slate-500/30 px-2.5 py-1.5 shadow-xl flex items-center justify-center">
          <span className="text-xs font-display font-bold text-accent-gold tabular-nums">
            {Math.round(scale * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
