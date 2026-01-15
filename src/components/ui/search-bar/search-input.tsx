import { useRef, KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  query: string;
  isFocused: boolean;
  showActions?: boolean;
  placeholder?: string;
  onQueryChange: (query: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onClear: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  rightActions?: React.ReactNode;
  className?: string;
}

export function SearchInput({
  query,
  isFocused,
  showActions = true,
  placeholder = "Search...",
  onQueryChange,
  onFocus,
  onBlur,
  onClear,
  onKeyDown,
  rightActions,
  className,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onQueryChange("");
      onBlur();
      inputRef.current?.blur();
    }
    onKeyDown?.(e);
  };

  return (
    <div
      className={cn(
        "relative",
        "bg-background-card",
        "rounded-md border",
        "transition-all duration-200",
        isFocused
          ? "border-accent-gold shadow-glow-subtle"
          : "border-border-subtle hover:border-border-default",
        className
      )}
    >
      {/* Search Icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <Search
          className={cn("w-5 h-5 transition-colors", isFocused ? "text-accent-gold" : "text-text-muted")}
        />
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "w-full",
          "bg-transparent",
          "text-text-primary placeholder:text-text-muted",
          "py-3 pr-24 pl-10",
          "outline-none",
          "font-body"
        )}
      />

      {/* Right Side Actions */}
      {showActions && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Clear Button */}
          {query && (
            <button
              onClick={onClear}
              className="p-1.5 text-text-muted hover:text-text-primary hover:bg-background-card-hover rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {rightActions}
        </div>
      )}
    </div>
  );
}
