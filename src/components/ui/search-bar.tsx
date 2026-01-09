"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchFilters {
  query: string;
  pinTypes?: string[];
  factions?: string[];
  isPublic?: boolean;
}

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
  showFilters?: boolean;
}

export function SearchBar({
  placeholder = "Search worlds...",
  onSearch,
  className,
  showFilters = true,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    onSearch?.({ query: query.trim() });
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
    onSearch?.({ query: "" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setQuery("");
      setIsFocused(false);
      inputRef.current?.blur();
    }
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
          className={cn(
            "w-5 h-5 transition-colors",
            isFocused ? "text-accent-gold" : "text-text-muted"
          )}
        />
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="p-1.5 text-text-muted hover:text-text-primary hover:bg-background-card-hover rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Filter Button */}
        {showFilters && (
          <button
            className={cn(
              "p-1.5 rounded transition-colors",
              "text-text-muted hover:text-text-primary hover:bg-background-card-hover"
            )}
          >
            <Filter className="w-4 h-4" />
          </button>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className={cn(
            "px-3 py-1.5 rounded",
            "bg-gradient-to-r from-accent-gold to-accent-gold-dark",
            "text-background-base",
            "text-sm font-display font-medium",
            "hover:shadow-glow-subtle",
            "transition-all duration-200"
          )}
        >
          Search
        </button>
      </div>
    </div>
  );
}

// Compact version for navbar
export function SearchBarCompact({ className }: { className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div
      className={cn(
        "relative flex items-center",
        "bg-background-card",
        "rounded-md border border-border-subtle",
        "transition-all duration-300",
        isExpanded ? "w-64" : "w-10",
        className
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-2.5 text-text-muted hover:text-accent-gold transition-colors"
      >
        <Search className="w-4 h-4" />
      </button>

      {isExpanded && (
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className={cn(
            "flex-1 bg-transparent outline-none",
            "text-text-primary placeholder:text-text-muted text-sm",
            "animate-in fade-in slide-in-from-left-2 duration-200"
          )}
          autoFocus
        />
      )}

      {isExpanded && query && (
        <button
          onClick={() => setQuery("")}
          className="mr-2 text-text-muted hover:text-text-primary"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
