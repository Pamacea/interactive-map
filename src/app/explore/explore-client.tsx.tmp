"use client";

import { useState, useMemo, memo, useCallback, useEffect } from "react";
import { Search } from "lucide-react";
import { FilterSidebar } from "@/features/explore/ui/filter-sidebar";
import { ResultsHeader } from "@/features/explore/ui/results-header";
import { WorldsGrid } from "@/features/explore/ui/worlds-grid";
import { useExploreFilters } from "@/features/explore/logic/use-explore-filters";
import { filterWorlds } from "@/features/explore/methods/filter-worlds";
import { useDebounce } from "@/shared/hooks/use-debounce";
import type { GameWorld } from "@/types/world.type";

export const ExploreClient = memo(function ExploreClient({ initialWorlds }: { initialWorlds: GameWorld[] }) {
  const {
    filters,
    activeFilters,
    viewMode,
    showFilters,
    handleSearch,
    toggleFilter,
    clearAllFilters,
    setViewMode,
    toggleShowFilters,
  } = useExploreFilters();

  const [searchQuery, setSearchQuery] = useState(filters.query);
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Trigger search with debounced query
  useEffect(() => {
    handleSearch({ query: debouncedQuery });
  }, [debouncedQuery, handleSearch]);

  // Memoize filtered worlds to prevent unnecessary recalculations
  const filteredWorlds = useMemo(
    () => filterWorlds({ worlds: initialWorlds, query: filters.query }),
    [initialWorlds, filters.query]
  );

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSearch({ query: searchQuery });
  }, [searchQuery, handleSearch]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <>
      {/* Search Bar */}
      <div className="px-4 pt-4 pb-2">
        <form onSubmit={handleSearchSubmit} className="max-w-3/5 mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by world name, description, or creator..."
              className="w-full h-12 pl-12 pr-32 rounded border border-iron bg-obsidian/60 text-bone placeholder:text-bone-dark/50 focus:border-accent-gold focus:outline-none transition-colors"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bone-dark" strokeWidth={1.5} />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded bg-accent-gold text-background-base text-sm font-display font-medium hover:bg-accent-gold/90 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <main className="px-4 py-8">
        <div className="max-w-4/5 mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          <FilterSidebar
            showFilters={showFilters}
            activeFilters={activeFilters}
            onToggleFilter={toggleFilter}
            onClearAll={clearAllFilters}
          />
          <div className="flex flex-col gap-6">
            <ResultsHeader
              filteredCount={filteredWorlds.length}
              viewMode={viewMode}
              showFilters={showFilters}
              activeFilters={activeFilters}
              onViewModeChange={setViewMode}
              onToggleFilters={toggleShowFilters}
              onToggleFilter={toggleFilter}
              onClearAllFilters={clearAllFilters}
            />
            <WorldsGrid
              worlds={filteredWorlds}
              viewMode={viewMode}
              onClearFilters={clearAllFilters}
            />
          </div>
        </div>
      </main>
    </>
  );
});
