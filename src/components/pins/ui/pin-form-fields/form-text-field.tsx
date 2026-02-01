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
        {required && <span className="text-status-error ml-1">*</span>}
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
        className={`h-10 rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-interactive-focus disabled:opacity-50 bg-background-input ${
          error ? "border-status-error" : "border-input"
        }`}
      />
      {error && <p className="text-xs text-status-error">{error}</p>}
    </div>
  );
};
