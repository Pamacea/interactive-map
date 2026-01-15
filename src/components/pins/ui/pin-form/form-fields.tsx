import { FC } from "react";
import type { PinFormData } from "../../logic/use-pin-form";

export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
}

export interface TextFieldProps extends FormFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export interface TextAreaFieldProps extends FormFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export interface NumberFieldProps extends FormFieldProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const FormTextField: FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  required,
  inputRef,
}) => (
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
      className="w-full px-3 py-2 bg-background-base border border-border-subtle rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-accent-gold"
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export const FormTextAreaField: FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  rows = 3,
}) => (
  <div className="grid gap-2">
    <label className="text-sm font-medium leading-none">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 bg-background-base border border-border-subtle rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-accent-gold resize-none"
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export const FormNumberField: FC<NumberFieldProps> = ({
  label,
  value,
  onChange,
  error,
  min,
  max,
  step,
}) => (
  <div className="grid gap-2">
    <label className="text-sm font-medium leading-none">
      {label}
      {error && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      min={min}
      max={max}
      step={step}
      className="w-full px-3 py-2 bg-background-base border border-border-subtle rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-accent-gold"
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);
