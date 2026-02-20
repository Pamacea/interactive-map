/**
 * Search UI Components
 *
 * Barrel export for all search UI components.
 * Provides clean imports for search bar, input, suggestions, results, and highlighting.
 */

// Main search bar with keyboard shortcuts and modal
export { SearchBar } from './search-bar';
export type { SearchBarProps } from './search-bar';

// Search input field with loading and clear states
export { SearchInput } from './search-input';
export type { SearchInputProps } from './search-input';

// Search suggestions dropdown with keyboard navigation
export { SearchSuggestions } from './search-suggestions';
export type { SearchSuggestionsProps } from './search-suggestions';

// Search results with tabs, filtering, and highlighting
export { SearchResults } from './search-results';
export type { SearchResultsProps } from './search-results';

// Text highlighting for search terms
export { SearchHighlight } from './search-highlight';
export type { SearchHighlightProps } from './search-highlight';
