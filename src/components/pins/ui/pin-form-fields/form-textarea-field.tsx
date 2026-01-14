import { FC } from "react";

export interface FormTextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

export const FormTextAreaField: FC<FormTextAreaFieldProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  rows = 3,
  disabled = false,
}) => {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium leading-none">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none ${
          error ? "border-red-500" : "border-slate-200"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
