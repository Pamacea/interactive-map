import { FC } from "react";

export interface FormSizeSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export const FormSizeSlider: FC<FormSizeSliderProps> = ({
  label,
  value,
  onChange,
  error,
  min = 16,
  max = 128,
  disabled = false,
}) => {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium leading-none">{label}</label>
        <span className="text-sm text-slate-600">{value}px</span>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        min={min}
        max={max}
        disabled={disabled}
        className="w-full disabled:opacity-50"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
