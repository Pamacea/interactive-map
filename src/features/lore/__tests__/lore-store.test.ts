/**
 *
 * Unit tests for the lore Zustand store (local state only)
 */

import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLoreStore } from "../store/use-lore-store";
import type { LoreEntry, LoreCategory } from "@prisma/client";

// ============================================
// TEST DATA
// ============================================

const mockLoreEntries: LoreEntry[] = [
  {
    id: "lore-1",
    title: "The History of Middle-earth",
    content: "A comprehensive history of the Third Age...",
    category: "HISTORY",
    isVisible: true,
    isPublic: true,
    order: 0,
    userId: "user-1",
    gameWorldId: "world-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    pinId: null,
    imageUrl: null,
    tags: [],
    relatedCharacterIds: [],
    relatedLoreIds: [],
  },
  {
    id: "lore-2",
    title: "Elven Magic Systems",
    content: "Elves use magic through song and light...",
    category: "MAGIC",
    isVisible: true,
    isPublic: true,
    order: 1,
    userId: "user-1",
    gameWorldId: "world-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    pinId: null,
    imageUrl: null,
    tags: ["elves", "magic"],
    relatedCharacterIds: [],
    relatedLoreIds: [],
  },
  {
    id: "lore-3",
    title: "Secret Dark Lore",
    content: "This lore is hidden from players...",
    category: "CUSTOM",
    isVisible: false,
    isPublic: true,
    order: 2,
    userId: "user-1",
    gameWorldId: "world-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    pinId: null,
    imageUrl: null,
    tags: [],
    relatedCharacterIds: [],
    relatedLoreIds: [],
  },
];

// ============================================
// SETUP
// ============================================

beforeEach(() => {
  // Reset store state before each test
  useLoreStore.getState().reset();
});

// ============================================
// UI STATE TESTS
// ============================================

describe("Lore Store - UI State", () => {
  it("should have initial state", () => {
    const { result } = renderHook(() => useLoreStore());

    expect(result.current.selectedLoreId).toBeNull();
    expect(result.current.isCreating).toBe(false);
    expect(result.current.isEditing).toBe(false);
    expect(result.current.expandedLoreIds.size).toBe(0);
  });

  it("should select lore entry", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.selectLore("lore-1");
    });

    expect(result.current.selectedLoreId).toBe("lore-1");
  });

  it("should clear selection", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.selectLore("lore-1");
    });

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedLoreId).toBeNull();
  });

  it("should toggle expanded lore entry", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.toggleExpanded("lore-1");
    });

    expect(result.current.expandedLoreIds.has("lore-1")).toBe(true);

    act(() => {
      result.current.toggleExpanded("lore-1");
    });

    expect(result.current.expandedLoreIds.has("lore-1")).toBe(false);
  });

  it("should track multiple expanded entries", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.toggleExpanded("lore-1");
      result.current.toggleExpanded("lore-2");
    });

    expect(result.current.expandedLoreIds.size).toBe(2);
  });

  it("should start creating mode", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.startCreating();
    });

    expect(result.current.isCreating).toBe(true);
    expect(result.current.isEditing).toBe(false);
    expect(result.current.selectedLoreId).toBeNull();
  });

  it("should stop creating mode", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.startCreating();
      result.current.stopCreating();
    });

    expect(result.current.isCreating).toBe(false);
  });

  it("should start editing mode", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.startEditing();
    });

    expect(result.current.isEditing).toBe(true);
  });

  it("should stop editing mode", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.startEditing();
      result.current.stopEditing();
    });

    expect(result.current.isEditing).toBe(false);
  });
});

// ============================================
// LORE DATA MANAGEMENT TESTS
// ============================================

describe("Lore Store - Lore Data", () => {
  it("should set lore entries", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.setLoreEntries(mockLoreEntries);
    });

    expect(result.current.loreEntries).toEqual(mockLoreEntries);
    expect(result.current.loreEntries).toHaveLength(3);
  });

  it("should add lore entry (prepends to array)", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.setLoreEntries([mockLoreEntries[0]]);
      result.current.addLoreEntry(mockLoreEntries[1]);
    });

    expect(result.current.loreEntries).toHaveLength(2);
    expect(result.current.loreEntries[0].id).toBe("lore-2"); // Prepended
  });

  it("should update lore entry", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.setLoreEntries(mockLoreEntries);
      result.current.updateLoreEntry("lore-1", { title: "Updated History" });
    });

    expect(result.current.loreEntries[0].title).toBe("Updated History");
    expect(result.current.loreEntries[1].title).toBe("Elven Magic Systems"); // Unchanged
  });

  it("should delete lore entry", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.setLoreEntries(mockLoreEntries);
      result.current.deleteLoreEntry("lore-1");
    });

    expect(result.current.loreEntries).toHaveLength(2);
    expect(result.current.loreEntries[0].id).toBe("lore-2");
  });

  it("should clear selection when deleting selected lore", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.setLoreEntries(mockLoreEntries);
      result.current.selectLore("lore-1");
      result.current.deleteLoreEntry("lore-1");
    });

    expect(result.current.selectedLoreId).toBeNull();
  });

  it("should preserve selection when deleting non-selected lore", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.setLoreEntries(mockLoreEntries);
      result.current.selectLore("lore-1");
      result.current.deleteLoreEntry("lore-2");
    });

    expect(result.current.selectedLoreId).toBe("lore-1");
  });
});

// ============================================
// FILTER STATE TESTS
// ============================================

describe("Lore Store - Filter State", () => {
  it("should have default category filters all true", () => {
    const { result } = renderHook(() => useLoreStore());

    expect(result.current.categoryFilters.GENERAL).toBe(true);
    expect(result.current.categoryFilters.HISTORY).toBe(true);
    expect(result.current.categoryFilters.GEOGRAPHY).toBe(true);
    expect(result.current.categoryFilters.CHARACTERS).toBe(true);
    expect(result.current.categoryFilters.FACTIONS).toBe(true);
    expect(result.current.categoryFilters.MAGIC).toBe(true);
    expect(result.current.categoryFilters.ITEMS).toBe(true);
    expect(result.current.categoryFilters.QUESTS).toBe(true);
    expect(result.current.categoryFilters.CUSTOM).toBe(true);
  });

  it("should have empty initial filters", () => {
    const { result } = renderHook(() => useLoreStore());

    expect(result.current.searchTerm).toBe("");
    expect(result.current.showVisibleOnly).toBe(false);
  });

  it("should set search term", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.setSearchTerm("magic");
    });

    expect(result.current.searchTerm).toBe("magic");
  });

  it("should set category filter", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.setCategoryFilter("MAGIC", false);
    });

    expect(result.current.categoryFilters.MAGIC).toBe(false);
  });

  it("should toggle category filter", () => {
    const { result } = renderHook(() => useLoreStore());

    expect(result.current.categoryFilters.MAGIC).toBe(true);

    act(() => {
      result.current.toggleCategoryFilter("MAGIC");
    });

    expect(result.current.categoryFilters.MAGIC).toBe(false);

    act(() => {
      result.current.toggleCategoryFilter("MAGIC");
    });

    expect(result.current.categoryFilters.MAGIC).toBe(true);
  });

  it("should show all categories", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.setCategoryFilter("MAGIC", false);
      result.current.showAllCategories();
    });

    expect(result.current.categoryFilters.MAGIC).toBe(true);
  });

  it("should hide all categories", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.hideAllCategories();
    });

    const filters = result.current.categoryFilters;
    expect(filters.GENERAL).toBe(false);
    expect(filters.HISTORY).toBe(false);
    expect(filters.GEOGRAPHY).toBe(false);
  });

  it("should toggle show visible only", () => {
    const { result } = renderHook(() => useLoreStore());

    expect(result.current.showVisibleOnly).toBe(false);

    act(() => {
      result.current.toggleShowVisibleOnly();
    });

    expect(result.current.showVisibleOnly).toBe(true);

    act(() => {
      result.current.toggleShowVisibleOnly();
    });

    expect(result.current.showVisibleOnly).toBe(false);
  });

  it("should reset all filters", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.setSearchTerm("history");
      result.current.setCategoryFilter("MAGIC", false);
      result.current.toggleShowVisibleOnly();
    });

    expect(result.current.searchTerm).toBe("history");
    expect(result.current.categoryFilters.MAGIC).toBe(false);
    expect(result.current.showVisibleOnly).toBe(true);

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.searchTerm).toBe("");
    expect(result.current.categoryFilters.MAGIC).toBe(true);
    expect(result.current.showVisibleOnly).toBe(false);
  });

  it("should get visible categories", () => {
    const { result } = renderHook(() => useLoreStore());

    // All visible initially
    let visible = result.current.getVisibleCategories();
    expect(visible).toHaveLength(9);

    act(() => {
      result.current.setCategoryFilter("MAGIC", false);
      result.current.setCategoryFilter("HISTORY", false);
    });

    visible = result.current.getVisibleCategories();
    expect(visible).toHaveLength(7);
    expect(visible).toContain("GENERAL");
    expect(visible).not.toContain("MAGIC");
    expect(visible).not.toContain("HISTORY");
  });
});

// ============================================
// FILTER APPLICATION TESTS
// ============================================

describe("Lore Store - Filter Application", () => {
  beforeEach(() => {
    // Set data directly on store before each test
    useLoreStore.getState().setLoreEntries(mockLoreEntries);
  });

  it("should filter by search term (title)", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.setSearchTerm("History");
      result.current.applyFilters();
    });

    expect(result.current.filteredLoreEntries).toHaveLength(1);
    expect(result.current.filteredLoreEntries[0].title).toBe("The History of Middle-earth");
  });

  it("should be case insensitive for search term", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.setSearchTerm("history");
      result.current.applyFilters();
    });

    expect(result.current.filteredLoreEntries).toHaveLength(1);
  });

  it("should filter by category", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.setCategoryFilter("HISTORY", false);
      result.current.setCategoryFilter("MAGIC", false);
      result.current.applyFilters();
    });

    expect(result.current.filteredLoreEntries).toHaveLength(1);
    expect(result.current.filteredLoreEntries[0].category).toBe("CUSTOM");
  });

  it("should filter by visibility", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.toggleShowVisibleOnly();
      result.current.applyFilters();
    });

    expect(result.current.filteredLoreEntries).toHaveLength(2);
    expect(result.current.filteredLoreEntries.every((l) => l.isVisible)).toBe(true);
  });

  it("should apply combined filters", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.setSearchTerm("Magic");
      result.current.setCategoryFilter("HISTORY", false);
      result.current.toggleShowVisibleOnly();
      result.current.applyFilters();
    });

    expect(result.current.filteredLoreEntries).toHaveLength(1);
    expect(result.current.filteredLoreEntries[0].title).toBe("Elven Magic Systems");
  });

  it("should return all entries when no filters active", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.applyFilters();
    });

    expect(result.current.filteredLoreEntries).toHaveLength(3);
  });

  it("should return empty when search matches nothing", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.setSearchTerm("NonExistent");
      result.current.applyFilters();
    });

    expect(result.current.filteredLoreEntries).toHaveLength(0);
  });

  it("should return empty when all categories are hidden", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.hideAllCategories();
      result.current.applyFilters();
    });

    expect(result.current.filteredLoreEntries).toHaveLength(0);
  });

  it("should return all visible when show visible only and all are visible", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.toggleShowVisibleOnly();
      result.current.applyFilters();
    });

    // Only 2 out of 3 mock entries are visible
    expect(result.current.filteredLoreEntries).toHaveLength(2);
  });
});

// ============================================
// LOADING AND ERROR STATE TESTS
// ============================================

describe("Lore Store - Loading and Error State", () => {
  it("should set loading state", () => {
    const { result } = renderHook(() => useLoreStore());

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
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.setError("Failed to load lore");
    });

    expect(result.current.error).toBe("Failed to load lore");

    act(() => {
      result.current.setError(null);
    });

    expect(result.current.error).toBeNull();
  });
});

// ============================================
// RESET TESTS
// ============================================

describe("Lore Store - Reset", () => {
  it("should reset to initial state", () => {
    // Set various states (calling methods on store)
    // Note: startCreating clears selection, so call selectLore after it
    useLoreStore.getState().setLoreEntries(mockLoreEntries);
    useLoreStore.getState().setSearchTerm("test");
    useLoreStore.getState().setLoading(true);
    useLoreStore.getState().setError("error");
    useLoreStore.getState().toggleExpanded("lore-2");
    useLoreStore.getState().startCreating();
    useLoreStore.getState().selectLore("lore-1"); // Call after startCreating
    useLoreStore.getState().setCategoryFilter("MAGIC", false);

    // Verify states are set (get fresh state after mutations)
    const store = useLoreStore.getState();
    expect(store.selectedLoreId).toBe("lore-1");
    expect(store.loreEntries).toHaveLength(3);
    expect(store.searchTerm).toBe("test");
    expect(store.isLoading).toBe(true);
    expect(store.error).toBe("error");
    expect(store.expandedLoreIds.has("lore-2")).toBe(true);
    expect(store.isCreating).toBe(true);
    expect(store.categoryFilters.MAGIC).toBe(false);

    // Reset
    useLoreStore.getState().reset();

    // Verify reset to initial
    const storeAfterReset = useLoreStore.getState();
    expect(storeAfterReset.selectedLoreId).toBeNull();
    expect(storeAfterReset.loreEntries).toHaveLength(0);
    expect(storeAfterReset.searchTerm).toBe("");
    expect(storeAfterReset.isLoading).toBe(false);
    expect(storeAfterReset.error).toBeNull();
    expect(storeAfterReset.expandedLoreIds.size).toBe(0);
    expect(storeAfterReset.isCreating).toBe(false);
    expect(storeAfterReset.isEditing).toBe(false);
  });
});

// ============================================
// CATEGORY FILTER COMPREHENSIVE TESTS
// ============================================

describe("Lore Store - Category Filters", () => {
  const allCategories: LoreCategory[] = [
    "GENERAL",
    "HISTORY",
    "GEOGRAPHY",
    "CHARACTERS",
    "FACTIONS",
    "MAGIC",
    "ITEMS",
    "QUESTS",
    "CUSTOM",
  ];

  it("should have all categories initialized to true", () => {
    const { result } = renderHook(() => useLoreStore());

    allCategories.forEach((category) => {
      expect(result.current.categoryFilters[category]).toBe(true);
    });
  });

  it("should toggle each category independently", () => {
    const { result } = renderHook(() => useLoreStore());

    allCategories.forEach((category) => {
      const initialValue = result.current.categoryFilters[category];

      act(() => {
        result.current.toggleCategoryFilter(category);
      });

      expect(result.current.categoryFilters[category]).toBe(!initialValue);

      act(() => {
        result.current.toggleCategoryFilter(category);
      });

      expect(result.current.categoryFilters[category]).toBe(initialValue);
    });
  });

  it("should set each category independently", () => {
    const { result } = renderHook(() => useLoreStore());

    allCategories.forEach((category) => {
      act(() => {
        result.current.setCategoryFilter(category, false);
      });

      expect(result.current.categoryFilters[category]).toBe(false);
    });
  });

  it("should showAllCategories after hideAllCategories", () => {
    const { result } = renderHook(() => useLoreStore());

    // Hide all
    act(() => {
      result.current.hideAllCategories();
    });

    allCategories.forEach((category) => {
      expect(result.current.categoryFilters[category]).toBe(false);
    });

    // Show all
    act(() => {
      result.current.showAllCategories();
    });

    allCategories.forEach((category) => {
      expect(result.current.categoryFilters[category]).toBe(true);
    });
  });

  it("should correctly report visible categories", () => {
    const { result } = renderHook(() => useLoreStore());

    // Turn off a few categories
    act(() => {
      result.current.setCategoryFilter("HISTORY", false);
      result.current.setCategoryFilter("MAGIC", false);
      result.current.setCategoryFilter("ITEMS", false);
    });

    const visible = result.current.getVisibleCategories();
    expect(visible).toHaveLength(6);
    expect(visible).toContain("GENERAL");
    expect(visible).not.toContain("HISTORY");
    expect(visible).not.toContain("MAGIC");
    expect(visible).not.toContain("ITEMS");
  });

  it("should report empty visible categories when all hidden", () => {
    const { result } = renderHook(() => useLoreStore());

    act(() => {
      result.current.hideAllCategories();
    });

    const visible = result.current.getVisibleCategories();
    expect(visible).toHaveLength(0);
  });
});
