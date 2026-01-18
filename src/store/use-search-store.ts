import { create } from "zustand";
import type {
  SearchResults,
  SearchResultItem,
  SearchFilters,
} from "@/actions/search";

interface SearchState {
  // UI State
  isOpen: boolean;
  query: string;
  debouncedQuery: string;

  // Results
  results: SearchResults | null;
  isLoading: boolean;
  error: string | null;

  // Filters
  filters: SearchFilters;
  activeTab: "all" | "pins" | "lore";

  // Suggestions
  suggestions: string[];
  showSuggestions: boolean;
  highlightedIndex: number;

  // Actions
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  setQuery: (query: string) => void;
  setDebouncedQuery: (query: string) => void;
  setResults: (results: SearchResults | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: SearchFilters) => void;
  setActiveTab: (tab: "all" | "pins" | "lore") => void;
  setSuggestions: (suggestions: string[]) => void;
  setShowSuggestions: (show: boolean) => void;
  setHighlightedIndex: (index: number) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  // Initial state
  isOpen: false,
  query: "",
  debouncedQuery: "",
  results: null,
  isLoading: false,
  error: null,
  filters: {
    contentType: "all",
  },
  activeTab: "all",
  suggestions: [],
  showSuggestions: false,
  highlightedIndex: -1,

  // Actions
  openSearch: () => set({ isOpen: true }),
  closeSearch: () => set({
    isOpen: false,
    query: "",
    debouncedQuery: "",
    results: null,
    error: null,
    suggestions: [],
    showSuggestions: false,
    highlightedIndex: -1,
  }),
  toggleSearch: () => set((state) => {
    if (state.isOpen) {
      return {
        isOpen: false,
        query: "",
        debouncedQuery: "",
        results: null,
        error: null,
        suggestions: [],
        showSuggestions: false,
        highlightedIndex: -1,
      };
    }
    return { isOpen: true };
  }),

  setQuery: (query) => set({ query }),
  setDebouncedQuery: (debouncedQuery) => set({ debouncedQuery }),
  setResults: (results) => set({ results }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSuggestions: (suggestions) => set({ suggestions }),
  setShowSuggestions: (showSuggestions) => set({ showSuggestions }),
  setHighlightedIndex: (highlightedIndex) => set({ highlightedIndex }),

  clearSearch: () => set({
    query: "",
    debouncedQuery: "",
    results: null,
    error: null,
    suggestions: [],
    showSuggestions: false,
    highlightedIndex: -1,
  }),
}));

// Selector hooks for optimized re-renders
export const useSearchIsOpen = () => useSearchStore((state) => state.isOpen);
export const useSearchQuery = () => useSearchStore((state) => state.query);
export const useSearchResults = () => useSearchStore((state) => state.results);
export const useSearchIsLoading = () => useSearchStore((state) => state.isLoading);
export const useSearchError = () => useSearchStore((state) => state.error);
