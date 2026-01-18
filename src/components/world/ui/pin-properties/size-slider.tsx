import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface SizeSliderProps {
  value: number;
  disabled: boolean;
  onUpdate: (value: number) => void;
}

export function SizeSlider({ value, disabled, onUpdate }: SizeSliderProps) {
  return (
    <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
      <div className="flex items-center justify-between mb-1.5">
        <Label className="text-xs text-text-muted">Size</Label>
        <span className="text-xs font-display font-medium text-accent-gold">
          {value}px
        </span>
      </div>
      <Slider
        min={16}
        max={128}
        step={1}
        value={[value]}
        onValueChange={([size]) => {
          if (size >= 16 && size <= 128) {
            onUpdate(size);
          }
        }}
        disabled={disabled}
        className="w-full disabled:opacity-50"
      />
    </div>
  );
}
