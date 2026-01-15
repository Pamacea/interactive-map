import { Lock } from "lucide-react";

interface LayerPropertiesProps {
  opacity: number;
  scale: number;
  isVisible: boolean;
  isLocked: boolean;
  onOpacityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onScaleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetScale: () => void;
}

export function LayerProperties({
  opacity,
  scale,
  isVisible,
  isLocked,
  onOpacityChange,
  onScaleChange,
  onResetScale,
}: LayerPropertiesProps) {
  return (
    <div className="px-3 pb-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
      {/* Opacity Control */}
      <SliderControl
        label="Opacity"
        value={opacity * 100}
        onChange={onOpacityChange}
        displayValue={`${Math.round(opacity * 100)}%`}
      />

      {/* Size Control */}
      <SliderControl
        label="Size"
        value={scale * 100}
        onChange={onScaleChange}
        min={50}
        max={200}
        step={5}
        displayValue={`${Math.round(scale * 100)}%`}
        showReset={scale !== 1.0}
        onReset={onResetScale}
      />

      {/* Layer Info */}
      <div className="space-y-1.5 text-xs">
        <InfoRow label="Position" value="Fixed (0, 0)" icon={<Lock className="w-3 h-3" />} />
        <InfoRow label="Status" value={isVisible ? "Visible" : "Hidden"} valueClassName={isVisible ? "text-accent-gold" : "text-text-muted"} />
        <InfoRow label="Locked" value="Yes" icon={<Lock className="w-3 h-3" />} />
      </div>
    </div>
  );
}

interface SliderControlProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  displayValue: string;
  showReset?: boolean;
  onReset?: () => void;
}

function SliderControl({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  displayValue,
  showReset,
  onReset,
}: SliderControlProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-text-secondary font-medium">{displayValue}</span>
          {showReset && onReset && (
            <button
              onClick={onReset}
              className="text-xs text-accent-gold hover:text-accent-gold/80 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-1.5 bg-background-base rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-gold [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
      />
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  valueClassName?: string;
}

function InfoRow({ label, value, icon, valueClassName = "font-medium text-text-muted" }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-muted">{label}</span>
      <span className={`flex items-center gap-1 ${valueClassName}`}>
        {icon}
        {value}
      </span>
    </div>
  );
}
