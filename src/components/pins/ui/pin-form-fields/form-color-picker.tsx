import { FC } from "react";

export interface FormColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const PRESET_COLORS = [
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#10b981", // Green
  "#f59e0b", // Amber
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#64748b", // Slate
  "#000000", // Black
  "#ffffff", // White
];

export const FormColorPicker: FC<FormColorPickerProps> = ({
  label,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium leading-none">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-16 h-10 rounded cursor-pointer disabled:opacity-50"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`flex-1 h-10 rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-interactive-focus disabled:opacity-50 bg-background-input ${
            error ? "border-status-error" : "border-input"
          }`}
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            disabled={disabled}
            className={`w-8 h-8 rounded border-2 transition-all ${
              value.toLowerCase() === color.toLowerCase()
                ? "border-interactive-primary scale-110"
                : "border-hover"
            } disabled:opacity-50`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      {error && <p className="text-xs text-status-error">{error}</p>}
    </div>
  );
};
