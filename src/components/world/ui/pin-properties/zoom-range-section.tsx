interface ZoomRangeSectionProps {
  minZoom: number;
  maxZoom: number;
  disabled: boolean;
  onUpdateMinZoom: (value: number) => void;
  onUpdateMaxZoom: (value: number) => void;
  onReset: () => void;
}

export function ZoomRangeSection({
  minZoom,
  maxZoom,
  disabled,
  onUpdateMinZoom,
  onUpdateMaxZoom,
  onReset,
}: ZoomRangeSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-3 py-2 bg-obsidian/60 border-t border-x border-iron/50 rounded-t">
        <span className="text-xs font-display font-semibold text-accent-gold uppercase tracking-widest">
          Zoom Visibility
        </span>
        <button
          type="button"
          onClick={onReset}
          disabled={disabled}
          className="text-xs text-bone-dark hover:text-accent-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <span className="text-accent-gold/40 text-xs">ᛟ</span>
          Reset
        </button>
      </div>

      <div className="px-3 py-2.5 bg-obsidian/60 border-x border-iron/50">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-display text-bone-dark uppercase tracking-wide" htmlFor="pin-min-zoom">Min Zoom</label>
          <span className="text-xs font-display font-semibold text-accent-gold px-2 py-0.5 bg-accent-gold/10 rounded">
            {minZoom}%
          </span>
        </div>
        <input
          id="pin-min-zoom"
          name="pinMinZoom"
          type="range"
          min="0"
          max="200"
          value={minZoom}
          onChange={(e) => {
            const zoom = parseInt(e.target.value);
            if (zoom < maxZoom) {
              onUpdateMinZoom(zoom);
            }
          }}
          disabled={disabled}
          className="w-full h-1.5 bg-void rounded-sm appearance-none cursor-pointer accent-accent-gold disabled:opacity-50"
        />
      </div>

      <div className="px-3 py-2.5 bg-obsidian/60 border-x border-iron/50">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-display text-bone-dark uppercase tracking-wide" htmlFor="pin-max-zoom">Max Zoom</label>
          <span className="text-xs font-display font-semibold text-accent-gold px-2 py-0.5 bg-accent-gold/10 rounded">
            {maxZoom}%
          </span>
        </div>
        <input
          id="pin-max-zoom"
          name="pinMaxZoom"
          type="range"
          min="0"
          max="200"
          value={maxZoom}
          onChange={(e) => {
            const zoom = parseInt(e.target.value);
            if (zoom > minZoom) {
              onUpdateMaxZoom(zoom);
            }
          }}
          disabled={disabled}
          className="w-full h-1.5 bg-void rounded-sm appearance-none cursor-pointer accent-accent-gold disabled:opacity-50"
        />
      </div>

      <div className="px-3 py-2.5 bg-obsidian/60 border-x border-b border-iron/50 rounded-b">
        <label className="block text-xs font-display text-bone-dark mb-2 uppercase tracking-wide">
          Visibility Range
        </label>
        <div className="text-xs text-bone-dark font-fell flex items-center gap-2">
          <span>Visible at</span>
          <span className="font-semibold text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded">
            {minZoom}% - {maxZoom}%
          </span>
          <span>zoom</span>
        </div>
      </div>
    </div>
  );
}
