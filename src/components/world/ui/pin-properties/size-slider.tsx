interface SizeSliderProps {
  value: number;
  disabled: boolean;
  onUpdate: (value: number) => void;
}

export function SizeSlider({ value, disabled, onUpdate }: SizeSliderProps) {
  return (
    <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-text-muted">Size</label>
        <span className="text-xs font-display font-medium text-accent-gold">
          {value}px
        </span>
      </div>
      <input
        type="range"
        min="16"
        max="128"
        step="1"
        value={value}
        onChange={(e) => {
          const size = parseInt(e.target.value);
          if (size >= 16 && size <= 128) {
            onUpdate(size);
          }
        }}
        disabled={disabled}
        className="w-full h-1.5 bg-background-base rounded-lg appearance-none cursor-pointer accent-accent-gold disabled:opacity-50"
      />
    </div>
  );
}
