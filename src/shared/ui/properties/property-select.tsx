/**
 * PropertySelect - Reusable select dropdown for property panels
 *
 * Features:
 * - Consistent styling
 * - Label and description
 * - Option groups support
 * - Clearable option
 */

import * as React from "react";
import { cn } from "@/shared/utils";

export interface PropertySelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface PropertySelectOptionGroup {
  label: string;
  options: PropertySelectOption[];
}

export interface PropertySelectProps {
  label: string;
  description?: string;
  error?: string;
  options: PropertySelectOption[] | PropertySelectOptionGroup[];
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  inputId?: string;
  containerClassName?: string;
  clearable?: boolean;
  onClear?: () => void;
}

export function PropertySelect({
  label,
  description,
  error,
  options,
  value,
  onChange,
  disabled,
  placeholder = "Select...",
  inputId,
  containerClassName,
  clearable = false,
  onClear,
}: PropertySelectProps) {
  const id = inputId || label.toLowerCase().replace(/\s+/g, "-");

  // Flatten options if grouped
  const flatOptions = React.useMemo(() => {
    if (options.length === 0) return [];
    if ("options" in options[0]!) {
      return options as PropertySelectOptionGroup[];
    }
    return [{ label: "", options: options as PropertySelectOption[] }];
  }, [options]);

  const handleClear = () => {
    onClear?.();
    onChange("");
  };

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-xs font-display text-text-muted uppercase tracking-wide"
        >
          {label}
        </label>
        {clearable && value && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="text-xs text-text-muted hover:text-text-primary transition-colors disabled:opacity-50"
          >
            Clear
          </button>
        )}
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "w-full bg-background-input border border-border-subtle rounded-sm px-3 py-2 text-sm text-text-primary",
          "focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/30",
          "transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/30"
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {flatOptions.map((group) => (
          <React.Fragment key={group.label}>
            {group.label && (
              <optgroup label={group.label}>
                {group.options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </optgroup>
            )}
            {!group.label &&
              group.options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
          </React.Fragment>
        ))}
      </select>
      {description && !error && (
        <p className="text-xs text-text-muted">{description}</p>
      )}
    </div>
  );
}
