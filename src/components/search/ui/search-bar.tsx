"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { searchWorld, getSearchSuggestions } from "@/actions/search";
import { useSearchStore } from "@/store/use-search-store";
import { SearchResults } from "./search-results";
import { cn } from "@/lib/utils";
import type { SearchResultItem } from "@/actions/search";

interface SearchBarProps {
  worldId: string;
  onResultClick?: (result: SearchResultItem) => void;
  className?: string;
}

export function SearchBar({ worldId, onResultClick, className }: SearchBarProps) {
  const {
    isOpen,
    query,
    setQuery,
    results,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    suggestions,
    setSuggestions,
    showSuggestions,
    setShowSuggestions,
    highlightedIndex,
    setHighlightedIndex,
    openSearch,
    closeSearch,
    clearSearch,
    setResults,
    setLoading,
    setError,
  } = useSearchStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Perform search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults(null);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await searchWorld({
          worldId,
          query: debouncedQuery,
          limit: 50,
        });

        if (result.success) {
          setResults(result.data);
          setShowSuggestions(false);
        } else {
          setError(result.error.message);
          setResults(null);
        }
      } catch (err) {
        setError("Search failed. Please try again.");
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, worldId, setResults, setLoading, setError, setShowSuggestions]);

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query || query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const result = await getSearchSuggestions(worldId, query, 8);
        if (result.success && result.data.length > 0) {
          setSuggestions(result.data);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query, worldId, setSuggestions, setShowSuggestions]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Close on Escape
      if (e.key === "Escape") {
        e.preventDefault();
        closeSearch();
        return;
      }

      // Navigate suggestions
      if (showSuggestions && suggestions.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === "Enter" && highlightedIndex >= 0) {
          e.preventDefault();
          const suggestion = suggestions[highlightedIndex];
          setQuery(suggestion);
          setShowSuggestions(false);
          setHighlightedIndex(-1);
        }
      }

      // Navigate tabs with Tab
      if (e.key === "Tab" && !e.shiftKey) {
        const tabs: Array<"all" | "pins" | "lore"> = ["all", "pins", "lore"];
        const currentIndex = tabs.indexOf(activeTab);
        const nextTab = tabs[(currentIndex + 1) % tabs.length];
        setActiveTab(nextTab);
      }
    },
    [
      showSuggestions,
      suggestions,
      highlightedIndex,
      activeTab,
      closeSearch,
      setQuery,
      setShowSuggestions,
      setHighlightedIndex,
      setActiveTab,
    ]
  );

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      setHighlightedIndex(-1);
    },
    [setQuery, setHighlightedIndex]
  );

  // Handle clear
  const handleClear = useCallback(() => {
    clearSearch();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [clearSearch]);

  // Handle result click
  const handleResultClick = useCallback(
    (result: SearchResultItem) => {
      if (onResultClick) {
        onResultClick(result);
      }
      closeSearch();
    },
    [onResultClick, closeSearch]
  );

  // Handle suggestion click
  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setQuery(suggestion);
      setShowSuggestions(false);
    },
    [setQuery, setShowSuggestions]
  );

  if (!isOpen) {
    return (
      <button
        onClick={openSearch}
        className={cn(
          "flex items-center gap-2 px-4 py-2 bg-background-card border border-border-subtle rounded-md text-sm text-text-muted hover:text-text-secondary hover:border-border-ornate transition-all",
          className
        )}
        aria-label="Open search (Ctrl+K)"
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="ml-auto px-1.5 py-0.5 bg-background-elevated border border-border-subtle rounded text-xs">
          Ctrl K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeSearch}
        aria-hidden="true"
      />

      {/* Search panel */}
      <div className="relative w-full max-w-2xl bg-background-card border border-border-ornate rounded-lg shadow-xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
          <Search className="w-5 h-5 text-text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search pins and lore..."
            className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted"
            aria-label="Search"
            autoComplete="off"
          />

          {isLoading && <Loader2 className="w-5 h-5 animate-spin text-accent-gold" />}

          {query && !isLoading && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-background-card-hover rounded transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5 text-text-muted" />
            </button>
          )}

          <kbd className="px-1.5 py-0.5 bg-background-elevated border border-border-subtle rounded text-xs text-text-muted">
            Esc
          </kbd>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && !results && (
          <div className="max-h-64 overflow-y-auto border-b border-border-subtle">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm hover:bg-background-card-hover transition-colors",
                  highlightedIndex === index && "bg-background-card-hover"
                )}
              >
                <Search className="w-4 h-4 inline mr-2 text-text-muted" />
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="max-h-96">
          <SearchResults
            results={results}
            isLoading={isLoading}
            error={error}
            query={query}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onResultClick={handleResultClick}
          />
        </div>
      </div>
    </div>
  );
}
