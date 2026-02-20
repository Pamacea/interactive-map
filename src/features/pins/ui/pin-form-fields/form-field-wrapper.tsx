import { FC, ReactNode } from "react";

export interface FormFieldWrapperProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Shared wrapper component for consistent form field layout.
 * Provides label, required indicator, error display, and consistent spacing.
 *
 * @example
 * ```tsx
 * <FormFieldWrapper label="Title" error={errors.title} required>
 *   <input value={value} onChange={onChange} />
 * </FormFieldWrapper>
 * ```
 */
export const FormFieldWrapper: FC<FormFieldWrapperProps> = ({
  label,
  error,
  required = false,
  children,
  className = "",
}) => {
  return (
    <div className={`grid gap-2 ${className}`}>
      <label className="text-sm font-medium leading-none">
        {label}
        {required && <span className="text-status-error ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-status-error">{error}</p>}
    </div>
  );
};
