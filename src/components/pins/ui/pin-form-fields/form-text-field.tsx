import { FC } from "react";

export interface FormTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const FormTextField: FC<FormTextFieldProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  autoFocus = false,
  inputRef,
}) => {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium leading-none">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoFocus={autoFocus}
        className={`h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
          error ? "border-red-500" : "border-slate-200"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
