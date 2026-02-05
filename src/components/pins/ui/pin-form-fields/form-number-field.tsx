import { FC } from "react";

export interface FormNumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  id?: string;
  name?: string;
}

export const FormNumberField: FC<FormNumberFieldProps> = ({
  label,
  value,
  onChange,
  error,
  min,
  max,
  step = "any",
  disabled = false,
  id,
  name,
}) => {
  // Generate id from label if not provided
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  const inputName = name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium leading-none" htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        name={inputName}
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`h-10 rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-interactive-focus disabled:opacity-50 bg-background-input ${
          error ? "border-status-error" : "border-input"
        }`}
      />
      {error && <p className="text-xs text-status-error">{error}</p>}
    </div>
  );
};
