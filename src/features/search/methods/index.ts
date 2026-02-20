/**
 * Search Methods - Barrel Export
 *
 * Centralized exports for all search Server Action wrappers
 */

// Re-export from actions/search.ts
export {
  searchWorld,
  getSearchSuggestions,
  unescapeHighlight,
  type SearchQuery,
  type SearchFilters,
  type SearchResults,
  type PinSearchResult,
  type LoreSearchResult,
} from "@/features/search/actions";
