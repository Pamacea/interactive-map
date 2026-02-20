/**
 * InlineEditText - Editable text component
 *
 * Allows inline editing of text content with click-to-edit functionality.
 * Supports validation, auto-save, and keyboard shortcuts.
 */

import { memo, useCallback, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, X, Pencil } from "lucide-react";

export interface InlineEditTextProps {
  /** Current text value */
  value: string;
  /** Called when text is saved */
  onSave: (value: string) => void | Promise<void>;
  /** Placeholder text when empty */
  placeholder?: string;
  /** Maximum length */
  maxLength?: number;
  /** Is the input disabled */
  disabled?: boolean;
  /** Validate before saving */
  validate?: (value: string) => string | true;
  /** Display variant */
  variant?: "default" | "underline" | "ghost";
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Show edit icon on hover */
  showEditIcon?: boolean;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Multiline input */
  multiline?: boolean;
  /** Number of rows for multiline */
  rows?: number;
  /** Custom className */
  className?: string;
  /** Display class (when not editing) */
  displayClassName?: string;
}

/**
 * InlineEditText Component
 */
export const InlineEditText = memo(function InlineEditText({
  value,
  onSave,
  placeholder = "Click to edit...",
  maxLength = 200,
  disabled = false,
  validate,
  variant = "default",
  align = "left",
  showEditIcon = true,
  autoFocus = false,
  multiline = false,
  rows = 3,
  className,
  displayClassName,
}: InlineEditTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const prevValueRef = useRef(value);

  // Sync editValue when external value changes, but only when not editing
  useEffect(() => {
    if (!isEditing && prevValueRef.current !== value) {
      setEditValue(value);
    }
    prevValueRef.current = value;
  }, [value, isEditing]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing, autoFocus]);

  const startEditing = useCallback(() => {
    if (disabled) return;
    setIsEditing(true);
    setEditValue(value);
    setError(null);
  }, [disabled, value]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setEditValue(value);
    setError(null);
  }, [value]);

  const handleSave = useCallback(async () => {
    const trimmed = editValue.trim();

    // Validation
    if (!trimmed) {
      setError("This field cannot be empty");
      return;
    }

    if (validate) {
      const _result = validate(trimmed);
      if (result !== true) {
        setError(result);
        return;
      }
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(trimmed);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  }, [editValue, onSave, validate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !multiline && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelEditing();
      } else if (
        e.key === "Enter" &&
        multiline &&
        (e.metaKey || e.ctrlKey)
      ) {
        e.preventDefault();
        handleSave();
      }
    },
    [multiline, handleSave, cancelEditing]
  );

  // Variant styles
  const variantStyles = {
    default: "rounded-sm border border-transparent hover:border-border-subtle",
    underline: "border-b border-border-subtle rounded-none hover:border-accent-gold",
    ghost: "rounded-sm hover:bg-background-elevated",
  };

  // Alignment styles
  const alignStyles = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  // Display mode
  if (!isEditing) {
    return (
      <div
        className={cn(
          "group relative min-h-[2rem] flex items-center gap-2 transition-colors cursor-text",
          variantStyles[variant],
          alignStyles[align],
          disabled && "opacity-50 cursor-not-allowed",
          displayClassName || className
        )}
        onClick={disabled ? undefined : startEditing}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`Edit: ${value || placeholder}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            startEditing();
          }
        }}
      >
        <span
          className={cn(
            "flex-1 truncate",
            !value && "text-text-muted italic"
          )}
        >
          {value || placeholder}
        </span>

        {showEditIcon && !disabled && (
          <Pencil className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        )}
      </div>
    );
  }

  // Edit mode
  const InputComponent = multiline ? "textarea" : "input";

  return (
    <div className={cn("relative flex items-center gap-1", className)}>
      <InputComponent
        ref={inputRef as React.RefObject<HTMLInputElement | HTMLTextAreaElement>}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSaving || disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "flex-1 min-w-0 px-2 py-1 rounded-sm border border-accent-gold bg-background-input text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/50",
          multiline && "resize-y",
          alignStyles[align],
          error && "border-status-error"
        )}
        aria-label="Edit text"
        aria-invalid={!!error}
      />

      {/* Action buttons */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || disabled}
          className={cn(
            "p-1 rounded-sm transition-colors",
            "text-status-success hover:bg-status-success/10",
            (isSaving || disabled) && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Save"
        >
          <Check className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={cancelEditing}
          disabled={isSaving}
          className={cn(
            "p-1 rounded-sm transition-colors",
            "text-status-error hover:bg-status-error/10",
            isSaving && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Error message */}
      {error && (
        <span className="absolute -bottom-5 left-0 text-xs text-status-error whitespace-nowrap">
          {error}
        </span>
      )}

      {/* Keyboard hints */}
      <div className="absolute -bottom-5 right-0 text-xs text-text-muted opacity-50">
        {multiline ? "⌘↵" : "↵"}
      </div>
    </div>
  );
});

InlineEditText.displayName = "InlineEditText";

/**
 * InlineEditNumber - Numeric variant with increment/decrement
 */
export interface InlineEditNumberProps {
  value: number;
  onSave: (value: number) => void | Promise<void>;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  displayClassName?: string;
}

export const InlineEditNumber = memo(function InlineEditNumber({
  value,
  onSave,
  min,
  max,
  step = 1,
  disabled = false,
  className,
  displayClassName,
}: InlineEditNumberProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  const prevValueRef = useRef(value);

  // Sync editValue when external value changes, but only when not editing
  useEffect(() => {
    if (!isEditing && prevValueRef.current !== value) {
       
      setEditValue(value.toString());
    }
    prevValueRef.current = value;
  }, [value, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = useCallback(() => {
    if (disabled) return;
    setIsEditing(true);
  }, [disabled]);

  const handleSave = useCallback(() => {
    const num = parseFloat(editValue);
    if (isNaN(num)) return;

    if (min !== undefined && num < min) return;
    if (max !== undefined && num > max) return;

    onSave(num);
    setIsEditing(false);
  }, [editValue, onSave, min, max]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSave();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsEditing(false);
        setEditValue(value.toString());
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const current = parseFloat(editValue) || value;
        const newVal = Math.min(max ?? Infinity, current + step);
        setEditValue(newVal.toString());
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const current = parseFloat(editValue) || value;
        const newVal = Math.max(min ?? -Infinity, current - step);
        setEditValue(newVal.toString());
      }
    },
    [editValue, value, handleSave, min, max, step]
  );

  if (!isEditing) {
    return (
      <div
        className={cn(
          "group relative min-h-[2rem] flex items-center transition-colors cursor-pointer rounded-sm border border-transparent hover:border-border-subtle",
          disabled && "opacity-50 cursor-not-allowed",
          displayClassName || className
        )}
        onClick={disabled ? undefined : startEditing}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            startEditing();
          }
        }}
      >
        <span className="font-mono text-sm">{value}</span>
        {!disabled && (
          <Pencil className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative flex items-center gap-1", className)}>
      <input
        ref={inputRef}
        type="number"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleSave}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className="flex-1 min-w-0 px-2 py-1 rounded-sm border border-accent-gold bg-background-input text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
        aria-label="Edit number"
      />
      <button
        type="button"
        onClick={handleSave}
        className="p-1 rounded-sm text-status-success hover:bg-status-success/10"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => {
          setIsEditing(false);
          setEditValue(value.toString());
        }}
        className="p-1 rounded-sm text-status-error hover:bg-status-error/10"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
});

InlineEditNumber.displayName = "InlineEditNumber";
