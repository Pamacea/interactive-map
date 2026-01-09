"use client";

import { NavigationBar } from "@/components/ui/navigation-bar";
import { ExploreHeader } from "@/components/explore/ui/explore-header";
import { FilterSidebar } from "@/components/explore/ui/filter-sidebar";
import { ResultsHeader } from "@/components/explore/ui/results-header";
import { WorldsGrid } from "@/components/explore/ui/worlds-grid";
import { useExploreFilters } from "@/components/explore/logic/use-explore-filters";
import { getAllWorlds } from "@/components/explore/methods/get-all-worlds";
import { filterWorlds } from "@/components/explore/methods/filter-worlds";

export default function ExplorePage() {
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

  const allWorlds = getAllWorlds();
  const filteredWorlds = filterWorlds({ worlds: allWorlds, query: filters.query });

  return (
    <div className="min-h-screen bg-background-base">
      <NavigationBar />
      <ExploreHeader onSearch={handleSearch} />

      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            <FilterSidebar
              showFilters={showFilters}
              activeFilters={activeFilters}
              onToggleFilter={toggleFilter}
              onClearAll={clearAllFilters}
            />
            <div className="flex-1 space-y-6">
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
        </div>
      </section>
    </div>
  );
}
