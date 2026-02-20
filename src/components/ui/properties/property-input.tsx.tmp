/**
 * PropertyInput - Enhanced text input for property panels
 *
 * Features:
 * - Floating label animation
 * - Icon prefix (optional)
 * - Suffix text/icon
 * - Clear button (when non-empty)
 * - Character counter (optional)
 * - Validation visual feedback
 * - Helper text
 * - Auto-focus support
 * - Copy button
 * - Consistent styling across all property panels
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, X, Copy, Loader2 } from "lucide-react";

export type PropertyInputSize = "sm" | "md" | "lg";
export type PropertyInputVariant = "default" | "filled" | "outlined" | "ghost";
export type PropertyInputState = "default" | "error" | "success" | "warning";

export interface PropertyInputProps
  extends Omit<React.ComponentProps<"input">, "id" | "className" | "size"> {
  label: string;
  description?: string;
  error?: string;
  inputId?: string;
  containerClassName?: string;
  size?: PropertyInputSize;
  variant?: PropertyInputVariant;
  state?: PropertyInputState;

  // New features
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  showClear?: boolean;
  onClear?: () => void;
  showCounter?: boolean;
  maxLength?: number;
  showCopy?: boolean;
  onCopy?: (value: string) => void;
  helperText?: string;
  autoFocus?: boolean;
  isLoading?: boolean;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export function PropertyInput({
  label,
  description,
  error,
  inputId,
  containerClassName,
  size = "md",
  variant = "default",
  state: propState,
  value,
  disabled,
  icon,
  suffix,
  showClear = false,
  onClear,
  showCounter = false,
  maxLength,
  showCopy = false,
  onCopy,
  helperText,
  autoFocus = false,
  isLoading = false,
  leftAddon,
  rightAddon,
  ...props
}: PropertyInputProps) {
  const id = inputId || label.toLowerCase().replace(/\s+/g, "-");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Auto-focus
  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Determine state based on props
  const state = propState || (error ? "error" : "default");
  const hasValue = value !== "" && value !== undefined && value !== null;
  const isInteractive = !disabled && !isLoading;

  // Character count
  const currentLength = typeof value === "string" ? value.length : 0;
  const counterColor =
    maxLength && currentLength > maxLength * 0.9
      ? "text-status-error-dark"
      : "text-text-muted";

  // Copy handler
  const handleCopy = () => {
    const valueToCopy = String(value || "");
    if (onCopy) {
      onCopy(valueToCopy);
    } else {
      navigator.clipboard.writeText(valueToCopy);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Clear handler
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (props.onChange) {
      const event = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      props.onChange(event);
    }
  };

  // Size classes
  const sizeClasses: Record<PropertyInputSize, string> = {
    sm: "h-8 px-2 py-1 text-sm",
    md: "h-10 px-3 py-2 text-sm",
    lg: "h-12 px-4 py-3 text-base",
  };

  // Variant classes
  const variantClasses: Record<PropertyInputVariant, string> = {
    default:
      "bg-background-input border border-border-subtle focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/30",
    filled:
      "bg-background-card/50 border-b-2 border-border-subtle focus:border-accent-gold/50 rounded-none",
    outlined:
      "bg-transparent border-2 border-border-subtle focus:border-accent-gold",
    ghost:
      "bg-transparent border-transparent focus:bg-background-card focus:border-border-subtle",
  };

  // State classes
  const stateClasses: Record<PropertyInputState, string> = {
    default: "",
    error:
      "border-status-error/50 focus:border-status-error focus:ring-status-error/30",
    success:
      "border-status-success/50 focus:border-status-success focus:ring-status-success/30",
    warning:
      "border-status-warning/50 focus:border-status-warning focus:ring-status-warning/30",
  };

  // State icon
  const StateIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin text-text-muted" />;
    }
    if (state === "success" && hasValue) {
      return <Check className="h-4 w-4 text-status-success" />;
    }
    if (state === "error") {
      return <X className="h-4 w-4 text-status-error" />;
    }
    return null;
  };

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {/* Label row */}
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className={cn(
            "text-xs font-display uppercase tracking-wide transition-colors",
            isFocused && !disabled
              ? "text-accent-gold"
              : error
                ? "text-status-error"
                : state === "success"
                  ? "text-status-success"
                  : "text-text-muted"
          )}
        >
          {label}
        </label>

        {/* Right side of label row */}
        <div className="flex items-center gap-2">
          {/* Character counter */}
          {showCounter && maxLength && (
            <span className={cn("text-xs font-mono", counterColor)}>
              {currentLength}/{maxLength}
            </span>
          )}

          {/* State icon in label row */}
          <StateIcon />
        </div>
      </div>

      {/* Input wrapper */}
      <div className="relative">
        {/* Left addon */}
        {leftAddon && (
          <div className="absolute left-0 top-0 flex h-full items-center pl-3 pointer-events-none">
            {leftAddon}
          </div>
        )}

        {/* Icon prefix */}
        {icon && (
          <div
            className={cn(
              "absolute left-0 top-0 flex h-full items-center pl-3 pointer-events-none text-text-muted",
              leftAddon && "left-8"
            )}
          >
            {icon}
          </div>
        )}

        {/* Main input */}
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          disabled={disabled || isLoading}
          maxLength={maxLength}
          className={cn(
            "w-full rounded-sm text-text-primary placeholder:text-text-muted transition-all duration-200",
            "focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:shadow-lg",
            sizeClasses[size],
            variantClasses[variant],
            stateClasses[state],
            (icon || leftAddon) && "pl-10",
            (suffix || rightAddon || showClear || showCopy || state === "success" || state === "error") && "pr-10"
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {/* Right side actions container */}
        {(suffix ||
          rightAddon ||
          showClear ||
          showCopy ||
          state === "success" ||
          state === "error") && (
          <div
            className={cn(
              "absolute right-0 top-0 flex h-full items-center pr-2 gap-1",
              rightAddon && "pr-8"
            )}
          >
            {/* Clear button */}
            {showClear && hasValue && isInteractive && (
              <button
                type="button"
                onClick={handleClear}
                className={cn(
                  "p-1 rounded-sm transition-colors",
                  "hover:bg-background-card-hover",
                  "text-text-muted hover:text-text-primary"
                )}
                tabIndex={-1}
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Copy button */}
            {showCopy && hasValue && isInteractive && (
              <button
                type="button"
                onClick={handleCopy}
                className={cn(
                  "p-1 rounded-sm transition-colors",
                  "hover:bg-background-card-hover",
                  copied
                    ? "text-status-success"
                    : "text-text-muted hover:text-text-primary"
                )}
                tabIndex={-1}
                title={copied ? "Copied!" : "Copy"}
              >
                <Copy className="h-4 w-4" />
              </button>
            )}

            {/* Suffix */}
            {suffix && (
              <span className="text-text-muted text-sm">{suffix}</span>
            )}
          </div>
        )}

        {/* Right addon */}
        {rightAddon && (
          <div className="absolute right-0 top-0 flex h-full items-center pr-3 pointer-events-none">
            {rightAddon}
          </div>
        )}
      </div>

      {/* Helper text / Error / Description */}
      {(error || helperText || description) && (
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-xs",
              error
                ? "text-status-error"
                : "text-text-muted"
            )}
          >
            {error || helperText || description}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * PropertyInputField - Simplified version with internal state
 * Useful for quick form fields without external state management
 */
export interface PropertyInputFieldProps
  extends Omit<
    PropertyInputProps,
    "value" | "onChange" | "state" | "error"
  > {
  initialValue?: string;
  validate?: (value: string) => string | undefined;
  onChangeValue?: (value: string) => void;
}

export function PropertyInputField({
  initialValue = "",
  validate,
  onChangeValue,
  ...props
}: PropertyInputFieldProps) {
  const [value, setValue] = React.useState(initialValue);
  const [error, setError] = React.useState<string | undefined>();
  const [touched, setTouched] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChangeValue?.(newValue);

    if (touched && validate) {
      setError(validate(newValue));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    if (validate) {
      setError(validate(value));
    }
    props.onBlur?.(e);
  };

  return (
    <PropertyInput
      {...props}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={error}
      state={error ? "error" : touched && value ? "success" : "default"}
    />
  );
}
