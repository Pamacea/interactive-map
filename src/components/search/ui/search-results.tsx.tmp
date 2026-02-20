"use client";

import React, { useCallback } from "react";
import type { SearchResults, SearchResultItem } from "@/lib/search-types";
import { SearchTabs } from "./search-tabs";
import { SearchResultItem as ResultItem } from "./search-result-item";
import {
  SearchEmptyState,
  SearchLoadingState,
  SearchErrorState,
  SearchNoResults,
} from "./search-states";

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

  if (isLoading) {
    return <SearchLoadingState />;
  }

  if (error) {
    return <SearchErrorState error={error} />;
  }

  if (results && results.total === 0) {
    return <SearchNoResults query={query} />;
  }

  if (!results) {
    return <SearchEmptyState query={query} />;
  }

  const pinsCount = results.pins.length;
  const loreCount = results.lore.length;

  return (
    <div className="flex flex-col h-full">
      <SearchTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        totalCount={results.total}
        pinsCount={pinsCount}
        loreCount={loreCount}
      />

      <SearchResultsList
        activeTab={activeTab}
        results={results}
        query={query}
        onResultClick={handleResultClick}
      />
    </div>
  );
}

interface SearchResultsListProps {
  activeTab: "all" | "pins" | "lore";
  results: SearchResults;
  query: string;
  onResultClick: (result: SearchResultItem) => void;
}

function SearchResultsList({
  activeTab,
  results,
  query,
  onResultClick,
}: SearchResultsListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {(activeTab === "all" || activeTab === "pins") && results.pins.length > 0 && (
        <div className="divide-y divide-border-subtle">
          {results.pins.map((pin) => (
            <ResultItem key={pin.id} result={pin} query={query} onClick={onResultClick} />
          ))}
        </div>
      )}

      {(activeTab === "all" || activeTab === "lore") && results.lore.length > 0 && (
        <div className="divide-y divide-border-subtle">
          {results.lore.map((lore) => (
            <ResultItem key={lore.id} result={lore} query={query} onClick={onResultClick} />
          ))}
        </div>
      )}

      {activeTab === "pins" && results.pins.length === 0 && (
        <div className="py-8 text-center text-sm text-text-muted">No pins found</div>
      )}

      {activeTab === "lore" && results.lore.length === 0 && (
        <div className="py-8 text-center text-sm text-text-muted">No lore entries found</div>
      )}
    </div>
  );
}
