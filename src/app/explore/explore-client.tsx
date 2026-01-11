"use client";

import { ExploreHeader } from "@/components/explore/ui/explore-header";
import { FilterSidebar } from "@/components/explore/ui/filter-sidebar";
import { ResultsHeader } from "@/components/explore/ui/results-header";
import { WorldsGrid } from "@/components/explore/ui/worlds-grid";
import { useExploreFilters } from "@/components/explore/logic/use-explore-filters";
import { filterWorlds } from "@/components/explore/methods/filter-worlds";
import type { GameWorld } from "@/types/world.type";

export function ExploreClient({ initialWorlds }: { initialWorlds: GameWorld[] }) {
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

  const filteredWorlds = filterWorlds({ worlds: initialWorlds, query: filters.query });

  return (
    <>
      <ExploreHeader onSearch={handleSearch} />

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
}
