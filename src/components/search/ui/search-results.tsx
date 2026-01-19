"use client";

import React, { useCallback } from "react";
import { MapPin, BookOpen, Loader2 } from "lucide-react";
import { SearchHighlight } from "./search-highlight";
import type { SearchResults, SearchResultItem } from "@/lib/search-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface SearchResultsProps {
  results: SearchResults | null;
  isLoading: boolean;
  error: string | null;
  query: string;
  activeTab: "all" | "pins" | "lore";
  onTabChange: (tab: "all" | "pins" | "lore") => void;
  onResultClick: (result: SearchResultItem) => void;
}

export function SearchResults({
  results,
  isLoading,
  error,
  query,
  activeTab,
  onTabChange,
  onResultClick,
}: SearchResultsProps) {
  const handleResultClick = useCallback(
    (result: SearchResultItem) => {
      onResultClick(result);
    },
    [onResultClick]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-12">
        <Loader2 className="w-6 h-6 animate-spin text-accent-gold" />
        <span className="text-sm text-text-muted">Searching...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-text-destructive">{error}</p>
      </div>
    );
  }

  // No results state
  if (results && results.total === 0) {
    return (
      <div className="flex flex-col gap-2 py-8 text-center">
        <p className="text-sm text-text-muted">
          No results found for &quot;{query}&quot;
        </p>
        <p className="text-xs text-text-muted">
          Try different keywords or check your filters
        </p>
      </div>
    );
  }

  // Initial state
  if (!results) {
    return (
      <div className="flex flex-col gap-6 py-8 text-center">
        <p className="text-sm text-text-muted">
          Start typing to search pins and lore entries
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <kbd className="px-2 py-1 bg-background-elevated border border-border-subtle rounded">
              Ctrl + K
            </kbd>
            <span>to open search</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <kbd className="px-2 py-1 bg-background-elevated border border-border-subtle rounded">
              Tab
            </kbd>
            <span>to navigate tabs</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <kbd className="px-2 py-1 bg-background-elevated border border-border-subtle rounded">
              Enter
            </kbd>
            <span>to select result</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <kbd className="px-2 py-1 bg-background-elevated border border-border-subtle rounded">
              Esc
            </kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    );
  }

  // Calculate counts
  const pinsCount = results.pins.length;
  const loreCount = results.lore.length;

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-border-subtle">
        <Button
          variant="ghost"
          onClick={() => onTabChange("all")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 rounded-none",
            activeTab === "all"
              ? "text-accent-gold bg-background-elevated border-b-2 border-accent-gold"
              : "text-text-muted hover:text-text-secondary"
          )}
        >
          All
          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
            {results.total}
          </Badge>
        </Button>
        <Button
          variant="ghost"
          onClick={() => onTabChange("pins")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 rounded-none",
            activeTab === "pins"
              ? "text-accent-gold bg-background-elevated border-b-2 border-accent-gold"
              : "text-text-muted hover:text-text-secondary"
          )}
        >
          <MapPin className="w-4 h-4" />
          Pins
          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
            {pinsCount}
          </Badge>
        </Button>
        <Button
          variant="ghost"
          onClick={() => onTabChange("lore")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 rounded-none",
            activeTab === "lore"
              ? "text-accent-gold bg-background-elevated border-b-2 border-accent-gold"
              : "text-text-muted hover:text-text-secondary"
          )}
        >
          <BookOpen className="w-4 h-4" />
          Lore
          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
            {loreCount}
          </Badge>
        </Button>
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto">
        {(activeTab === "all" || activeTab === "pins") && results.pins.length > 0 && (
          <div className="divide-y divide-border-subtle">
            {results.pins.map((pin) => (
              <SearchResultItem key={pin.id} result={pin} query={query} onClick={handleResultClick} />
            ))}
          </div>
        )}

        {(activeTab === "all" || activeTab === "lore") && results.lore.length > 0 && (
          <div className="divide-y divide-border-subtle">
            {results.lore.map((lore) => (
              <SearchResultItem key={lore.id} result={lore} query={query} onClick={handleResultClick} />
            ))}
          </div>
        )}

        {activeTab === "pins" && results.pins.length === 0 && (
          <div className="py-8 text-center text-sm text-text-muted">
            No pins found
          </div>
        )}

        {activeTab === "lore" && results.lore.length === 0 && (
          <div className="py-8 text-center text-sm text-text-muted">
            No lore entries found
          </div>
        )}
      </div>
    </div>
  );
}

interface SearchResultItemProps {
  result: SearchResultItem;
  query: string;
  onClick: (result: SearchResultItem) => void;
}

function SearchResultItem({ result, query, onClick }: SearchResultItemProps) {
  const handleClick = useCallback(() => {
    onClick(result);
  }, [result, onClick]);

  const isPin = result.type === "pin";

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className="w-full justify-start px-4 py-3 text-left hover:bg-background-card-hover focus:bg-background-card-hover rounded-none"
    >
      <div className="flex items-start gap-3 w-full">
        {/* Icon */}
        <div
          className={cn(
            "mt-0.5 flex-shrink-0",
            isPin ? "text-accent-gold" : "text-text-muted"
          )}
        >
          {isPin ? <MapPin className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="text-sm font-medium text-text-primary">
            <SearchHighlight text={result.title} query={query} />
          </div>

          {/* Pin: Description */}
          {isPin && result.description && (
            <p className="text-xs text-text-secondary line-clamp-2">
              <SearchHighlight text={result.description} query={query} />
            </p>
          )}

          {/* Lore: Content preview */}
          {!isPin && (
            <p className="text-xs text-text-secondary line-clamp-2">
              <SearchHighlight text={result.content} query={query} />
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-text-muted">
            {/* Pin: Layer */}
            {isPin && (result as any).layerName && (
              <Badge variant="outline" className="px-1.5 py-0.5">
                {(result as any).layerName}
              </Badge>
            )}

            {/* Pin: Type */}
            {isPin && (
              <Badge variant="outline" className="px-1.5 py-0.5 capitalize">
                {(result as any).pinType}
              </Badge>
            )}

            {/* Lore: Category */}
            {!isPin && (
              <Badge variant="outline" className="px-1.5 py-0.5 capitalize">
                {(result as any).category}
              </Badge>
            )}

            {/* Relevance indicator */}
            <span className="ml-auto text-accent-gold">
              {Math.round(result.relevance)}% match
            </span>
          </div>
        </div>
      </div>
    </Button>
  );
}
