interface OpacitySliderProps {
  value: number;
  disabled: boolean;
  onUpdate: (value: number) => void;
}

export function OpacitySlider({
  value,
  disabled,
  onUpdate,
}: OpacitySliderProps) {
  return (
    <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-text-muted">Opacity</label>
        <span className="text-xs font-display font-medium text-accent-gold">
          {Math.round(value * 100)}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) => {
          const opacity = parseFloat(e.target.value);
          if (opacity >= 0 && opacity <= 1) {
            onUpdate(opacity);
          }
        }}
        disabled={disabled}
        className="w-full h-1.5 bg-background-base rounded-lg appearance-none cursor-pointer accent-accent-gold disabled:opacity-50"
      />
    </div>
  );
}
