"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SearchSuggestionsProps {
  suggestions: string[];
  highlightedIndex: number;
  onSuggestionClick: (suggestion: string) => void;
}

export function SearchSuggestions({
  suggestions,
  highlightedIndex,
  onSuggestionClick,
}: SearchSuggestionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="max-h-64 overflow-y-auto border-b border-border-subtle">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="ghost"
          onClick={() => onSuggestionClick(suggestion)}
          className={cn(
            "w-full justify-start text-left px-4 py-2 hover:bg-background-card-hover",
            highlightedIndex === index && "bg-background-card-hover"
          )}
        >
          <Search className="w-4 h-4 mr-2 text-text-muted" />
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
