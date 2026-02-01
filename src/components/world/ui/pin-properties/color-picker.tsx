interface ColorPickerProps {
  value: string;
  disabled: boolean;
  onUpdate: (value: string) => void;
}

export function ColorPicker({ value, disabled, onUpdate }: ColorPickerProps) {
  return (
    <div className="px-3 py-2.5 bg-obsidian/60 border-x border-b border-iron/50">
      <div className="flex items-center justify-between">
        <label className="text-xs font-display text-bone-dark uppercase tracking-wide">Color</label>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-accent-gold bg-void/50 px-2 py-1 rounded border border-iron/30">{value}</span>
          <div className="relative">
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
              className="w-9 h-9 rounded cursor-pointer border-2 border-iron/50 bg-transparent disabled:opacity-50 hover:border-accent-gold transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
