import { FC } from "react";

export interface FormJsonFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const FormJsonField: FC<FormJsonFieldProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = '{"key": "value"}',
  disabled = false,
}) => {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium leading-none">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        disabled={disabled}
        className={`font-mono text-xs rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-interactive-focus disabled:opacity-50 resize-none bg-background-input ${
          error ? "border-status-error" : "border-input"
        }`}
      />
      {error && <p className="text-xs text-status-error">{error}</p>}
      <p className="text-xs text-text-muted">
        Enter JSON data for custom properties (level, faction, etc.)
      </p>
    </div>
  );
};
