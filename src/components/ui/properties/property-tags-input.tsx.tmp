/**
 * PropertyTagsInput - Specialized input for tags
 *
 * Features:
 * - Tag creation on Enter
 * - Tag removal on click/x
 * - Autocomplete/suggestions
 * - Duplicate prevention
 * - Max tags limit
 * - Tag validation
 * - Keyboard navigation (Backspace to remove last tag)
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { X, Hash, Loader2 } from "lucide-react";

export interface Tag {
  id: string;
  label: string;
  color?: string;
}

export interface PropertyTagsInputProps {
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;

  // Tags
  tags: Tag[];
  onChange: (tags: Tag[]) => void;
  maxTags?: number;
  allowDuplicates?: boolean;

  // Input
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;

  // Suggestions
  suggestions?: string[];
  onAddSuggestion?: (tag: string) => void;

  // Validation
  validate?: (tag: string) => string | undefined;
  tagValidator?: (tag: string) => boolean;

  // Styling
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "outlined";
}

export function PropertyTagsInput({
  label,
  description,
  error,
  containerClassName,
  tags,
  onChange,
  maxTags = 20,
  allowDuplicates = false,
  placeholder = "Add tag...",
  disabled = false,
  isLoading = false,
  suggestions,
  onAddSuggestion,
  validate,
  tagValidator,
  size = "md",
  variant = "default",
}: PropertyTagsInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [filteredSuggestions, setFilteredSuggestions] = React.useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const suggestionsRef = React.useRef<HTMLUListElement>(null);

  const isDisabled = disabled || isLoading || tags.length >= maxTags;
  const sizeClasses = {
    sm: "h-8 px-2 py-1 text-sm",
    md: "h-10 px-3 py-2 text-sm",
    lg: "h-12 px-4 py-3 text-base",
  };

  const variantClasses = {
    default: "bg-background-input border border-border-subtle",
    filled: "bg-background-card/50 border-b-2 border-border-subtle",
    outlined: "bg-transparent border-2 border-border-subtle",
  };

  // Filter suggestions based on input
  React.useEffect(() => {
    if (suggestions && inputValue.length > 0) {
      const filtered = suggestions.filter(
        (s) =>
          s.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.some((t) => t.label.toLowerCase() === s.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(-1);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, suggestions, tags]);

  // Close suggestions on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add a tag
  const addTag = (tagLabel: string) => {
    const trimmed = tagLabel.trim();
    if (!trimmed) return;

    // Validation
    if (validate) {
      const error = validate(trimmed);
      if (error) return;
    }

    if (tagValidator && !tagValidator(trimmed)) {
      return;
    }

    // Check duplicates
    if (!allowDuplicates) {
      const exists = tags.some(
        (t) => t.label.toLowerCase() === trimmed.toLowerCase()
      );
      if (exists) return;
    }

    // Check max tags
    if (tags.length >= maxTags) return;

    const newTag: Tag = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label: trimmed,
    };

    onChange([...tags, newTag]);
    setInputValue("");
    setShowSuggestions(false);
    onAddSuggestion?.(trimmed);
  };

  // Remove a tag
  const removeTag = (tagId: string) => {
    onChange(tags.filter((t) => t.id !== tagId));
  };

  // Handle input keydown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle suggestion navigation
    if (showSuggestions) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) =>
          i < filteredSuggestions.length - 1 ? i + 1 : i
        );
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i > 0 ? i - 1 : -1));
        return;
      }
      if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        addTag(filteredSuggestions[selectedIndex]);
        return;
      }
      if (e.key === "Escape") {
        setShowSuggestions(false);
        setSelectedIndex(-1);
        return;
      }
    }

    // Handle tag operations
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    }

    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1].id);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Scroll selected suggestion into view
  React.useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      selectedElement?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-display text-text-muted uppercase tracking-wide">
            {label}
          </label>
          <span className="text-xs text-text-muted">
            {tags.length}/{maxTags}
          </span>
        </div>
      )}

      {/* Tags input container */}
      <div
        ref={containerRef}
        className={cn(
          "relative flex flex-wrap gap-2 rounded-sm transition-all duration-200",
          "focus-within:ring-1 focus-within:ring-accent-gold/30 focus-within:border-accent-gold/50",
          sizeClasses[size],
          variantClasses[variant],
          isDisabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {/* Tags */}
        {tags.map((tag) => (
          <span
            key={tag.id}
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-sm font-medium",
              "bg-accent-gold/10 text-accent-gold border border-accent-gold/20",
              "transition-colors hover:bg-accent-gold/20"
            )}
          >
            <Hash className="h-3 w-3" />
            <span>{tag.label}</span>
            {!isDisabled && (
              <button
                type="button"
                onClick={() => removeTag(tag.id)}
                className="hover:text-status-error transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}

        {/* Input */}
        {!isDisabled && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            placeholder={tags.length === 0 ? placeholder : ""}
            disabled={isDisabled}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (inputValue && filteredSuggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-text-primary placeholder:text-text-muted"
          />
        )}

        {/* Loading indicator */}
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-text-muted self-center" />
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul
          ref={suggestionsRef}
          className={cn(
            "absolute z-10 w-full mt-1 bg-background-card border border-border-subtle rounded-sm shadow-lg",
            "max-h-60 overflow-auto"
          )}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              onClick={() => addTag(suggestion)}
              className={cn(
                "px-3 py-2 cursor-pointer text-sm transition-colors",
                "hover:bg-background-card-hover",
                index === selectedIndex && "bg-background-card-hover text-accent-gold"
              )}
            >
              <Hash className="h-3 w-3 inline mr-2 text-text-muted" />
              {suggestion}
            </li>
          ))}
        </ul>
      )}

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

      {/* Keyboard hints */}
      {!disabled && (
        <div className="flex gap-3 text-xs text-text-muted">
          <span>
            <kbd className="px-1 py-0.5 bg-background-card rounded-sm">Enter</kbd>{" "}
            to add
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-background-card rounded-sm">Backspace</kbd>{" "}
            to remove last
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * PropertyTagsField - Internal state version
 */
export interface PropertyTagsFieldProps extends Omit<PropertyTagsInputProps, "tags" | "onChange"> {
  initialTags?: Tag[];
  onChangeTags?: (tags: Tag[]) => void;
}

export function PropertyTagsField({
  initialTags = [],
  onChangeTags,
  ...props
}: PropertyTagsFieldProps) {
  const [tags, setTags] = React.useState<Tag[]>(initialTags);

  const handleChange = (newTags: Tag[]) => {
    setTags(newTags);
    onChangeTags?.(newTags);
  };

  return (
    <PropertyTagsInput
      {...props}
      tags={tags}
      onChange={handleChange}
    />
  );
}
