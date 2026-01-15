import { useState } from "react";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchInput } from "./search-input";

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

  const handleSearch = () => {
    onSearch?.({ query: query.trim() });
  };

  const handleClear = () => {
    setQuery("");
    onSearch?.({ query: "" });
  };

  const rightActions = (
    <>
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
    </>
  );

  return (
    <SearchInput
      query={query}
      isFocused={isFocused}
      placeholder={placeholder}
      onQueryChange={setQuery}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClear={handleClear}
      rightActions={rightActions}
      className={className}
    />
  );
}
