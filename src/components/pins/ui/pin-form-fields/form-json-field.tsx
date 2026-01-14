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
        className={`font-mono text-xs rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none ${
          error ? "border-red-500" : "border-slate-200"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-slate-500">
        Enter JSON data for custom properties (level, faction, etc.)
      </p>
    </div>
  );
};
