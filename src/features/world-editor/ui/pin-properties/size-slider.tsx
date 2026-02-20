import { Slider } from "@/shared/ui/slider";
import { Label } from "@/shared/ui/label";

interface SizeSliderProps {
  value: number;
  disabled: boolean;
  onUpdate: (value: number) => void;
}

export function SizeSlider({ value, disabled, onUpdate }: SizeSliderProps) {
  return (
    <div className="px-3 py-2.5 bg-obsidian/60 border-x border-b border-iron/50">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-xs font-display text-bone-dark uppercase tracking-wide">Size</Label>
        <span className="text-xs font-display font-semibold text-accent-gold px-2 py-0.5 bg-accent-gold/10 rounded">
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
