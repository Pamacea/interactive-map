/**
 * PropertyTextarea - Enhanced textarea for property panels
 *
 * Features:
 * - Auto-resize support
 * - Markdown preview toggle
 * - Character/word counter
 * - Clear button
 * - Fullscreen toggle
 * - Toolbar markdown (bold, italic, link, etc.)
 * - Save indicator integration
 * - Max length validation
 * - Consistent styling
 */

import * as React from "react";
import { cn } from "@/shared/utils";
import {
  X,
  Copy,
  Loader2,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  Quote,
  Code,
  Type,
  Check,
} from "lucide-react";
import { useAutosave } from "@/features/world-editor/logic/use-autosave";

export type PropertyTextareaSize = "sm" | "md" | "lg";
export type PropertyTextareaVariant = "default" | "filled" | "outlined";
export type PropertyTextareaMode = "edit" | "preview" | "split";

export interface PropertyTextareaProps
  extends Omit<React.ComponentProps<"textarea">, "id" | "className"> {
  label: string;
  description?: string;
  error?: string;
  inputId?: string;
  containerClassName?: string;
  size?: PropertyTextareaSize;
  variant?: PropertyTextareaVariant;

  // Auto-resize
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;

  // Character/word counter
  showCounter?: boolean;
  showWordCount?: boolean;
  maxLength?: number;

  // Clear button
  showClear?: boolean;
  onClear?: () => void;

  // Copy button
  showCopy?: boolean;
  onCopy?: (value: string) => void;

  // Fullscreen
  allowFullscreen?: boolean;
  fullscreenClassName?: string;

  // Markdown support
  enableMarkdown?: boolean;
  markdownToolbar?: boolean;
  onMarkdownToggle?: (mode: PropertyTextareaMode) => void;
  renderMarkdown?: (content: string) => React.ReactNode;
  defaultMode?: PropertyTextareaMode;

  // Autosave integration
  autosaveConfig?: {
    onSave: (data: { value: string }) => Promise<void>;
    debounceMs?: number;
  };

  // State
  isLoading?: boolean;
  state?: "default" | "error" | "success" | "warning";
}

export function PropertyTextarea({
  label,
  description,
  error,
  inputId,
  containerClassName,
  size = "md",
  variant = "default",
  autoResize = true,
  minRows = 3,
  maxRows = 12,
  showCounter = false,
  showWordCount = false,
  maxLength,
  showClear = false,
  onClear,
  showCopy = false,
  onCopy,
  allowFullscreen = false,
  fullscreenClassName,
  enableMarkdown = false,
  markdownToolbar = false,
  onMarkdownToggle,
  renderMarkdown,
  defaultMode = "edit",
  autosaveConfig,
  isLoading = false,
  state: propState,
  value,
  disabled,
  ...props
}: PropertyTextareaProps) {
  const id = inputId || label.toLowerCase().replace(/\s+/g, "-");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [mode, setMode] = React.useState<PropertyTextareaMode>(defaultMode);

  // Autosave integration
  const autosave = autosaveConfig
    ? useAutosave({
        onSave: autosaveConfig.onSave,
        debounceMs: autosaveConfig.debounceMs ?? 500,
        showToasts: false,
      })
    : null;

  // Handle change with autosave
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onChange?.(e);
    if (autosave && typeof value === "string") {
      autosave.debouncedSave({ value: e.target.value });
    }
  };

  // Determine state
  const state = propState || (error ? "error" : autosave?.status === "error" ? "error" : "default");
  const hasValue = value !== "" && value !== undefined && value !== null;
  const isInteractive = !disabled && !isLoading;

  // Character/word count
  const currentLength = typeof value === "string" ? value.length : 0;
  const wordCount = typeof value === "string"
    ? value.trim().split(/\s+/).filter(w => w.length > 0).length
    : 0;
  const counterColor =
    maxLength && currentLength > maxLength * 0.9
      ? "text-status-error"
      : "text-text-muted";

  // Auto-resize functionality
  React.useEffect(() => {
    if (autoResize && textareaRef.current && !isFullscreen) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const minHeight = minRows * 24; // Approximate line height
      const maxHeight = maxRows * 24;
      textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
    }
  }, [value, autoResize, minRows, maxRows, isFullscreen]);

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
      } as React.ChangeEvent<HTMLTextAreaElement>;
      props.onChange(event);
    }
  };

  // Mode toggle
  const handleModeToggle = () => {
    const modes: PropertyTextareaMode[] = ["edit", "preview", "split"];
    const currentIndex = modes.indexOf(mode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setMode(nextMode);
    onMarkdownToggle?.(nextMode);
  };

  // Insert markdown syntax
  const insertMarkdown = (syntax: string, placeholder = "") => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = String(value || "");
    const before = text.substring(0, start);
    const after = text.substring(end);
    const insertion = syntax.replace("{}", placeholder);

    const newValue = before + insertion + after;
    props.onChange?.({
      target: { value: newValue },
    } as React.ChangeEvent<HTMLTextAreaElement>);

    // Set cursor position
    setTimeout(() => {
      const cursorPos = start + syntax.indexOf("{}");
      if (cursorPos >= 0) {
        textarea.setSelectionRange(cursorPos, cursorPos + placeholder.length);
      }
      textarea.focus();
    }, 0);
  };

  // Markdown toolbar actions
  const markdownActions = [
    { icon: Bold, label: "Bold", syntax: "**{}**", placeholder: "bold text" },
    { icon: Italic, label: "Italic", syntax: "_{}_", placeholder: "italic text" },
    { icon: Type, label: "Heading", syntax: "## {}", placeholder: "Heading" },
    { icon: LinkIcon, label: "Link", syntax: "[{}]()", placeholder: "link text" },
    { icon: List, label: "List", syntax: "\n- ", placeholder: "" },
    { icon: Quote, label: "Quote", syntax: "\n> ", placeholder: "" },
    { icon: Code, label: "Code", syntax: "`{}`", placeholder: "code" },
  ];

  // Size classes
  const sizeClasses: Record<PropertyTextareaSize, string> = {
    sm: "px-2 py-1.5 text-sm",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  // Variant classes
  const variantClasses: Record<PropertyTextareaVariant, string> = {
    default:
      "bg-background-input border border-border-subtle focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/30",
    filled:
      "bg-background-card/50 border-b-2 border-border-subtle focus:border-accent-gold/50 rounded-none",
    outlined:
      "bg-transparent border-2 border-border-subtle focus:border-accent-gold",
  };

  // State classes
  const stateClasses: Record<PropertyTextareaSize, string> = {
    default: "",
    error: "border-status-error/50 focus:border-status-error",
    success: "border-status-success/50 focus:border-status-success",
    warning: "border-status-warning/50 focus:border-status-warning",
  };

  // Autosave status indicator
  const AutosaveStatus = () => {
    if (!autosave) return null;
    const status = autosave.status;

    if (status === "idle") return null;

    const statusConfig = {
      debouncing: { icon: null, text: "Waiting...", color: "text-text-muted" },
      saving: { icon: Loader2, text: "Saving...", color: "text-accent-gold" },
      saved: { icon: Check, text: "Saved", color: "text-status-success" },
      error: { icon: X, text: "Failed", color: "text-status-error" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={cn("flex items-center gap-1 text-xs", config.color)}>
        {Icon && <Icon className="h-3 w-3 animate-spin" />}
        {config.text}
      </span>
    );
  };

  // Markdown preview
  const MarkdownPreview = () => {
    if (!renderMarkdown) return null;
    return (
      <div className="prose prose-sm prose-invert max-w-none p-3 text-text-primary">
        {renderMarkdown(String(value || ""))}
      </div>
    );
  };

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "space-y-1.5",
        isFullscreen && "fixed inset-0 z-50 bg-background-base p-6",
        fullscreenClassName && isFullscreen && fullscreenClassName,
        containerClassName
      )}
    >
      {/* Label row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label
            htmlFor={id}
            className={cn(
              "text-xs font-display uppercase tracking-wide transition-colors",
              isFocused && !disabled
                ? "text-accent-gold"
                : error
                  ? "text-status-error"
                  : "text-text-muted"
            )}
          >
            {label}
          </label>
          <AutosaveStatus />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Counter */}
          {(showCounter || showWordCount) && (
            <span className={cn("text-xs font-mono", counterColor)}>
              {showCounter && `${currentLength}`}
              {showCounter && showWordCount && " / "}
              {showWordCount && `${wordCount} words`}
              {maxLength && ` / ${maxLength}`}
            </span>
          )}
        </div>
      </div>

      {/* Toolbar */}
      {markdownToolbar && enableMarkdown && (
        <div className="flex items-center gap-1 border-b border-border-subtle pb-2">
          {markdownActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => insertMarkdown(action.syntax, action.placeholder)}
              className={cn(
                "p-1.5 rounded-sm transition-colors",
                "hover:bg-background-card-hover",
                "text-text-muted hover:text-text-primary"
              )}
              title={action.label}
            >
              <action.icon className="h-4 w-4" />
            </button>
          ))}
          <div className="flex-1" />
          {enableMarkdown && (
            <button
              type="button"
              onClick={handleModeToggle}
              className={cn(
                "p-1.5 rounded-sm transition-colors",
                "hover:bg-background-card-hover",
                "text-text-muted hover:text-text-primary"
              )}
              title={mode === "edit" ? "Show preview" : mode === "preview" ? "Show split" : "Edit only"}
            >
              {mode === "edit" && <Eye className="h-4 w-4" />}
              {mode === "preview" && <EyeOff className="h-4 w-4" />}
              {mode === "split" && <Type className="h-4 w-4" />}
            </button>
          )}
        </div>
      )}

      {/* Textarea / Preview container */}
      <div className={cn(
        "relative rounded-sm",
        isFullscreen && "h-[calc(100%-8rem)]"
      )}>
        {/* Edit mode */}
        {(mode === "edit" || mode === "split") && (
          <textarea
            ref={textareaRef}
            id={id}
            value={value}
            disabled={disabled || isLoading}
            maxLength={maxLength}
            className={cn(
              "w-full rounded-sm text-text-primary placeholder:text-text-muted transition-all duration-200",
              "focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
              sizeClasses[size],
              variantClasses[variant],
              stateClasses[state],
              mode === "split" ? "rounded-r-none border-r-0" : "",
              isFullscreen ? "h-full resize-none" : autoResize ? "overflow-hidden" : "resize-y"
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            onChange={handleChange}
            {...props}
          />
        )}

        {/* Preview mode */}
        {(mode === "preview" || mode === "split") && (
          <div className={cn(
            "border border-border-subtle bg-background-input rounded-sm text-sm text-text-primary overflow-auto",
            mode === "split" ? "rounded-l-none border-l-0" : "rounded-sm",
            isFullscreen && "h-full"
          )}>
            <MarkdownPreview />
          </div>
        )}

        {/* Floating actions */}
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
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

          {/* Fullscreen button */}
          {allowFullscreen && (
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={cn(
                "p-1 rounded-sm transition-colors",
                "hover:bg-background-card-hover",
                "text-text-muted hover:text-text-primary"
              )}
              tabIndex={-1}
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-text-muted" />
          )}
        </div>
      </div>

      {/* Helper text / Error */}
      {(error || description) && (
        <p
          className={cn(
            "text-xs",
            error ? "text-status-error" : "text-text-muted"
          )}
        >
          {error || description}
        </p>
      )}
    </div>
  );
}
