import { useState, useCallback } from "react";

interface SearchFilters {
  query: string;
}

export function useExploreFilters(initialFilters: SearchFilters = { query: "" }) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  const toggleFilter = useCallback((filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters([]);
    setFilters({ query: "" });
  }, []);

  const toggleShowFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  return {
    filters,
    activeFilters,
    viewMode,
    showFilters,
    handleSearch,
    toggleFilter,
    clearAllFilters,
    setViewMode,
    toggleShowFilters,
  };
}
