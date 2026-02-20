/**
 * Search Store Tests
 *
 * Unit tests for the search Zustand store
 */

import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useSearchStore,
  useSearchIsOpen,
  useSearchQuery,
  useSearchResults,
  useSearchIsLoading,
  useSearchError,
  useSearchFilters,
  useSearchActiveTab,
  useSearchSuggestions,
  useSearchShowSuggestions,
  useSearchHighlightedIndex,
} from "../store/use-search-store";

// ============================================
// SETUP
// ============================================

beforeEach(() => {
  // Reset store state before each test
  useSearchStore.setState({
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
  });
});

// ============================================
// UI STATE TESTS
// ============================================

describe("Search Store - UI State", () => {
  it("should have initial closed state", () => {
    const { result } = renderHook(() => useSearchStore());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.query).toBe("");
    expect(result.current.debouncedQuery).toBe("");
  });

  it("should open search", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.openSearch();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("should close search", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.openSearch();
    });

    act(() => {
      result.current.closeSearch();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.query).toBe("");
    expect(result.current.results).toBeNull();
  });

  it("should toggle search open", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.toggleSearch();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("should toggle search closed", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.openSearch();
    });

    act(() => {
      result.current.toggleSearch();
    });

    expect(result.current.isOpen).toBe(false);
  });
});

// ============================================
// QUERY STATE TESTS
// ============================================

describe("Search Store - Query State", () => {
  it("should set query", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setQuery("test query");
    });

    expect(result.current.query).toBe("test query");
  });

  it("should set debounced query", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setDebouncedQuery("debounced query");
    });

    expect(result.current.debouncedQuery).toBe("debounced query");
  });

  it("should clear search", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setQuery("some query");
      result.current.setResults({
        pins: [],
        lore: [],
        characters: [],
      });
    });

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.query).toBe("");
    expect(result.current.debouncedQuery).toBe("");
    expect(result.current.results).toBeNull();
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.showSuggestions).toBe(false);
    expect(result.current.highlightedIndex).toBe(-1);
  });

  it("should use selector hook for query", () => {
    const { result } = renderHook(() => useSearchQuery());

    act(() => {
      useSearchStore.getState().setQuery("selector test");
    });

    expect(result.current).toBe("selector test");
  });
});

// ============================================
// RESULTS STATE TESTS
// ============================================

describe("Search Store - Results State", () => {
  it("should set results", () => {
    const { result } = renderHook(() => useSearchStore());

    const mockResults = {
      pins: [{ id: "pin-1", title: "Test Pin" }],
      lore: [{ id: "lore-1", title: "Test Lore" }],
      characters: [],
    };

    act(() => {
      result.current.setResults(mockResults);
    });

    expect(result.current.results).toEqual(mockResults);
  });

  it("should set loading state", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("should set error", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setError("Search failed");
    });

    expect(result.current.error).toBe("Search failed");
  });

  it("should clear error", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setError("Error");
    });

    act(() => {
      result.current.setError(null);
    });

    expect(result.current.error).toBeNull();
  });

  it("should use selector hook for results", () => {
    const { result } = renderHook(() => useSearchResults());

    const mockResults = {
      pins: [{ id: "pin-1" }],
      lore: [],
      characters: [],
    };

    act(() => {
      useSearchStore.getState().setResults(mockResults);
    });

    expect(result.current).toEqual(mockResults);
  });

  it("should use selector hook for loading", () => {
    const { result } = renderHook(() => useSearchIsLoading());

    act(() => {
      useSearchStore.getState().setLoading(true);
    });

    expect(result.current).toBe(true);
  });

  it("should use selector hook for error", () => {
    const { result } = renderHook(() => useSearchError());

    act(() => {
      useSearchStore.getState().setError("Test error");
    });

    expect(result.current).toBe("Test error");
  });
});

// ============================================
// FILTERS STATE TESTS
// ============================================

describe("Search Store - Filters State", () => {
  it("should set filters", () => {
    const { result } = renderHook(() => useSearchStore());

    const newFilters = {
      contentType: "pins" as const,
    };

    act(() => {
      result.current.setFilters(newFilters);
    });

    expect(result.current.filters).toEqual(newFilters);
  });

  it("should have initial filters", () => {
    const { result } = renderHook(() => useSearchStore());

    expect(result.current.filters).toEqual({
      contentType: "all",
    });
  });

  it("should use selector hook for filters", () => {
    const { result } = renderHook(() => useSearchFilters());

    const newFilters = {
      contentType: "lore" as const,
    };

    act(() => {
      useSearchStore.getState().setFilters(newFilters);
    });

    expect(result.current).toEqual(newFilters);
  });
});

// ============================================
// TAB STATE TESTS
// ============================================

describe("Search Store - Tab State", () => {
  it("should set active tab", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setActiveTab("pins");
    });

    expect(result.current.activeTab).toBe("pins");
  });

  it("should accept all tab options", () => {
    const { result } = renderHook(() => useSearchStore());

    const tabs: Array<"all" | "pins" | "lore"> = ["all", "pins", "lore"];

    tabs.forEach((tab) => {
      act(() => {
        result.current.setActiveTab(tab);
      });

      expect(result.current.activeTab).toBe(tab);
    });
  });

  it("should use selector hook for active tab", () => {
    const { result } = renderHook(() => useSearchActiveTab());

    act(() => {
      useSearchStore.getState().setActiveTab("lore");
    });

    expect(result.current).toBe("lore");
  });
});

// ============================================
// SUGGESTIONS STATE TESTS
// ============================================

describe("Search Store - Suggestions State", () => {
  it("should set suggestions", () => {
    const { result } = renderHook(() => useSearchStore());

    const suggestions = ["suggestion 1", "suggestion 2", "suggestion 3"];

    act(() => {
      result.current.setSuggestions(suggestions);
    });

    expect(result.current.suggestions).toEqual(suggestions);
  });

  it("should set show suggestions", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setShowSuggestions(true);
    });

    expect(result.current.showSuggestions).toBe(true);

    act(() => {
      result.current.setShowSuggestions(false);
    });

    expect(result.current.showSuggestions).toBe(false);
  });

  it("should set highlighted index", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setHighlightedIndex(5);
    });

    expect(result.current.highlightedIndex).toBe(5);

    act(() => {
      result.current.setHighlightedIndex(-1);
    });

    expect(result.current.highlightedIndex).toBe(-1);
  });

  it("should use selector hook for suggestions", () => {
    const { result } = renderHook(() => useSearchSuggestions());

    const suggestions = ["test1", "test2"];

    act(() => {
      useSearchStore.getState().setSuggestions(suggestions);
    });

    expect(result.current).toEqual(suggestions);
  });

  it("should use selector hook for show suggestions", () => {
    const { result } = renderHook(() => useSearchShowSuggestions());

    act(() => {
      useSearchStore.getState().setShowSuggestions(true);
    });

    expect(result.current).toBe(true);
  });

  it("should use selector hook for highlighted index", () => {
    const { result } = renderHook(() => useSearchHighlightedIndex());

    act(() => {
      useSearchStore.getState().setHighlightedIndex(3);
    });

    expect(result.current).toBe(3);
  });
});

// ============================================
// INTEGRATION SCENARIOS
// ============================================

describe("Search Store - Integration Scenarios", () => {
  it("should handle complete search flow", () => {
    const { result } = renderHook(() => useSearchStore());

    // Open search
    act(() => {
      result.current.openSearch();
    });
    expect(result.current.isOpen).toBe(true);

    // Set query
    act(() => {
      result.current.setQuery("test");
    });
    expect(result.current.query).toBe("test");

    // Set loading
    act(() => {
      result.current.setLoading(true);
    });
    expect(result.current.isLoading).toBe(true);

    // Set results
    const mockResults = {
      pins: [{ id: "pin-1", title: "Test" }],
      lore: [],
      characters: [],
    };

    act(() => {
      result.current.setResults(mockResults);
      result.current.setLoading(false);
    });

    expect(result.current.results).toEqual(mockResults);
    expect(result.current.isLoading).toBe(false);

    // Close search (should reset)
    act(() => {
      result.current.closeSearch();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.query).toBe("");
    expect(result.current.results).toBeNull();
  });

  it("should handle suggestion flow", () => {
    const { result } = renderHook(() => useSearchStore());

    // Set query
    act(() => {
      result.current.setQuery("test");
    });

    // Show suggestions
    const suggestions = ["test1", "test2", "test3"];

    act(() => {
      result.current.setSuggestions(suggestions);
      result.current.setShowSuggestions(true);
    });

    expect(result.current.suggestions).toEqual(suggestions);
    expect(result.current.showSuggestions).toBe(true);

    // Navigate suggestions
    act(() => {
      result.current.setHighlightedIndex(0);
    });
    expect(result.current.highlightedIndex).toBe(0);

    act(() => {
      result.current.setHighlightedIndex(1);
    });
    expect(result.current.highlightedIndex).toBe(1);

    // Hide suggestions
    act(() => {
      result.current.setShowSuggestions(false);
      result.current.setHighlightedIndex(-1);
    });

    expect(result.current.showSuggestions).toBe(false);
    expect(result.current.highlightedIndex).toBe(-1);
  });

  it("should handle tab switching", () => {
    const { result } = renderHook(() => useSearchStore());

    // Start with 'all' tab
    expect(result.current.activeTab).toBe("all");

    // Switch to pins
    act(() => {
      result.current.setActiveTab("pins");
    });
    expect(result.current.activeTab).toBe("pins");

    // Switch to lore
    act(() => {
      result.current.setActiveTab("lore");
    });
    expect(result.current.activeTab).toBe("lore");

    // Back to all
    act(() => {
      result.current.setActiveTab("all");
    });
    expect(result.current.activeTab).toBe("all");
  });

  it("should handle error and recovery", () => {
    const { result } = renderHook(() => useSearchStore());

    // Set loading
    act(() => {
      result.current.setLoading(true);
    });

    // Error occurs
    act(() => {
      result.current.setError("Network error");
      result.current.setLoading(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.isLoading).toBe(false);

    // Clear and retry
    act(() => {
      result.current.setError(null);
      result.current.setLoading(true);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(true);

    // Success
    act(() => {
      result.current.setResults({
        pins: [],
        lore: [],
        characters: [],
      });
      result.current.setLoading(false);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.results).toBeDefined();
  });
});

// ============================================
// SELECTOR HOOKS TESTS
// ============================================

describe("Search Store - Selector Hooks", () => {
  it("should use isOpen selector", () => {
    const { result } = renderHook(() => useSearchIsOpen());

    expect(result.current).toBe(false);

    act(() => {
      useSearchStore.getState().openSearch();
    });

    expect(result.current).toBe(true);
  });

  it("should use query selector", () => {
    const { result } = renderHook(() => useSearchQuery());

    expect(result.current).toBe("");

    act(() => {
      useSearchStore.getState().setQuery("test query");
    });

    expect(result.current).toBe("test query");
  });

  it("should use debounced query selector", () => {
    const { result } = renderHook(() => useSearchStore((state) => state.debouncedQuery));

    act(() => {
      useSearchStore.getState().setDebouncedQuery("debounced");
    });

    expect(result.current).toBe("debounced");
  });

  it("should use filters selector", () => {
    const { result } = renderHook(() => useSearchFilters());

    expect(result.current).toEqual({ contentType: "all" });

    act(() => {
      useSearchStore.getState().setFilters({ contentType: "pins" });
    });

    expect(result.current).toEqual({ contentType: "pins" });
  });
});

// ============================================
// STATE RESET TESTS
// ============================================

describe("Search Store - State Reset", () => {
  it("should reset state on clear", () => {
    const { result } = renderHook(() => useSearchStore());

    // Set various states
    act(() => {
      result.current.setQuery("test query");
      result.current.setDebouncedQuery("debounced");
      result.current.setResults({
        pins: [{ id: "pin-1" }],
        lore: [],
        characters: [],
      });
      result.current.setError("error");
      result.current.setSuggestions(["s1", "s2"]);
      result.current.setShowSuggestions(true);
      result.current.setHighlightedIndex(2);
    });

    // Verify state is set
    expect(result.current.query).toBe("test query");
    expect(result.current.results).not.toBeNull();
    expect(result.current.error).toBe("error");
    expect(result.current.suggestions).toHaveLength(2);
    expect(result.current.showSuggestions).toBe(true);
    expect(result.current.highlightedIndex).toBe(2);

    // Clear
    act(() => {
      result.current.clearSearch();
    });

    // Verify reset
    expect(result.current.query).toBe("");
    expect(result.current.debouncedQuery).toBe("");
    expect(result.current.results).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.showSuggestions).toBe(false);
    expect(result.current.highlightedIndex).toBe(-1);
  });

  it("should reset state on close", () => {
    const { result } = renderHook(() => useSearchStore());

    // Set states
    act(() => {
      result.current.openSearch();
      result.current.setQuery("query");
      result.current.setResults({
        pins: [],
        lore: [],
        characters: [],
      });
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.query).toBe("query");

    // Close
    act(() => {
      result.current.closeSearch();
    });

    // Verify reset
    expect(result.current.isOpen).toBe(false);
    expect(result.current.query).toBe("");
    expect(result.current.results).toBeNull();
  });

  it("should not reset isOpen on clear", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.openSearch();
      result.current.setQuery("test");
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.query).toBe("test");

    act(() => {
      result.current.clearSearch();
    });

    // isOpen should remain true, only search-specific state cleared
    expect(result.current.isOpen).toBe(true);
    expect(result.current.query).toBe("");
  });
});
