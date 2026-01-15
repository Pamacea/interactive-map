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
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Zoom Visibility
        </span>
        <button
          type="button"
          onClick={onReset}
          disabled={disabled}
          className="text-xs text-accent-gold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset to default
        </button>
      </div>

      <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-text-muted">Min Zoom</label>
          <span className="text-xs font-display font-medium text-accent-gold">
            {minZoom}%
          </span>
        </div>
        <input
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
          className="w-full h-1.5 bg-background-base rounded-lg appearance-none cursor-pointer accent-accent-gold disabled:opacity-50"
        />
      </div>

      <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-text-muted">Max Zoom</label>
          <span className="text-xs font-display font-medium text-accent-gold">
            {maxZoom}%
          </span>
        </div>
        <input
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
          className="w-full h-1.5 bg-background-base rounded-lg appearance-none cursor-pointer accent-accent-gold disabled:opacity-50"
        />
      </div>

      <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
        <label className="block text-xs text-text-muted mb-1.5">
          Visibility Range
        </label>
        <div className="text-xs text-text-secondary">
          This pin will be visible at{" "}
          <span className="font-semibold text-accent-gold">
            {minZoom}% - {maxZoom}%
          </span>{" "}
          zoom
        </div>
      </div>
    </div>
  );
}
