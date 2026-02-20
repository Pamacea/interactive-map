import { FC } from "react";

export interface FormSizeSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  id?: string;
  name?: string;
}

export const FormSizeSlider: FC<FormSizeSliderProps> = ({
  label,
  value,
  onChange,
  error,
  min = 16,
  max = 128,
  disabled = false,
  id,
  name,
}) => {
  // Generate id from label if not provided
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  const inputName = name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium leading-none" htmlFor={inputId}>{label}</label>
        <span className="text-sm text-text-muted">{value}px</span>
      </div>
      <input
        id={inputId}
        name={inputName}
        type="range"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        min={min}
        max={max}
        disabled={disabled}
        className="w-full disabled:opacity-50"
      />
      {error && <p className="text-xs text-status-error">{error}</p>}
    </div>
  );
};
