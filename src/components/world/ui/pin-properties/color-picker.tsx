interface ColorPickerProps {
  value: string;
  disabled: boolean;
  onUpdate: (value: string) => void;
}

export function ColorPicker({ value, disabled, onUpdate }: ColorPickerProps) {
  return (
    <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
      <div className="flex items-center justify-between">
        <label className="text-xs text-text-muted">Color</label>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-text-secondary">{value}</span>
          <input
            type="color"
            value={value}
            onChange={(e) => {
              const color = e.target.value;
              if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
                onUpdate(color);
              }
            }}
            disabled={disabled}
            className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
