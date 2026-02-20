/**
 *
 * Unit tests for the character Zustand store (local state only)
 */

import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCharacterStore } from "../store/use-character-store";
import type { Character } from "@prisma/client";

// ============================================
// TEST DATA
// ============================================

const mockCharacters: Character[] = [
  {
    id: "char-1",
    name: "Gandalf",
    shortName: "Gandalf",
    characterType: "COMPANION",
    role: "MENTOR",
    portraitUrl: null,
    age: 1000,
    gender: "Male",
    species: "Wizard",
    height: "6'2\"",
    build: "Slender",
    level: 50,
    class: "Wizard",
    faction: "The Fellowship",
    stats: null,
    skills: null,
    equipment: null,
    personality: "Wise",
    background: "Ancient",
    goals: "Defeat evil",
    fears: "Corruption",
    dialogue: null,
    quests: null,
    shopInventory: null,
    isVisible: true,
    isPublic: true,
    order: 0,
    userId: "user-1",
    gameWorldId: "world-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "char-2",
    name: "Aragorn",
    shortName: "Aragorn",
    characterType: "PLAYER",
    role: "PROTAGONIST",
    portraitUrl: null,
    age: 87,
    gender: "Male",
    species: "Human",
    height: "6'6\"",
    build: "Athletic",
    level: 45,
    class: "Ranger",
    faction: "The Fellowship",
    stats: null,
    skills: null,
    equipment: null,
    personality: "Brave",
    background: "Heir of Isildur",
    goals: "Reclaim throne",
    fears: "Failure",
    dialogue: null,
    quests: null,
    shopInventory: null,
    isVisible: true,
    isPublic: true,
    order: 1,
    userId: "user-1",
    gameWorldId: "world-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "char-3",
    name: "Sauron",
    shortName: "Sauron",
    characterType: "ENEMY",
    role: "ANTAGONIST",
    portraitUrl: null,
    age: null,
    gender: null,
    species: "Maia",
    height: null,
    build: null,
    level: 100,
    class: "Dark Lord",
    faction: "Mordor",
    stats: null,
    skills: null,
    equipment: null,
    personality: null,
    background: null,
    goals: null,
    fears: null,
    dialogue: null,
    quests: null,
    shopInventory: null,
    isVisible: false,
    isPublic: true,
    order: 2,
    userId: "user-1",
    gameWorldId: "world-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ============================================
// SETUP
// ============================================

beforeEach(() => {
  // Reset store state before each test
  useCharacterStore.getState().reset();
});

// ============================================
// UI STATE TESTS
// ============================================

describe("Character Store - UI State", () => {
  it("should have initial state", () => {
    const { result } = renderHook(() => useCharacterStore());

    expect(result.current.selectedCharacterId).toBeNull();
    expect(result.current.isCreating).toBe(false);
    expect(result.current.isEditing).toBe(false);
    expect(result.current.isRelationshipMode).toBe(false);
    expect(result.current.expandedCharacterIds.size).toBe(0);
  });

  it("should select character", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.selectCharacter("char-1");
    });

    expect(result.current.selectedCharacterId).toBe("char-1");
  });

  it("should clear selection", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.selectCharacter("char-1");
    });

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedCharacterId).toBeNull();
  });

  it("should toggle expanded character", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.toggleExpanded("char-1");
    });

    expect(result.current.expandedCharacterIds.has("char-1")).toBe(true);

    act(() => {
      result.current.toggleExpanded("char-1");
    });

    expect(result.current.expandedCharacterIds.has("char-1")).toBe(false);
  });

  it("should track multiple expanded characters", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.toggleExpanded("char-1");
      result.current.toggleExpanded("char-2");
    });

    expect(result.current.expandedCharacterIds.size).toBe(2);
    expect(result.current.expandedCharacterIds.has("char-1")).toBe(true);
    expect(result.current.expandedCharacterIds.has("char-2")).toBe(true);
  });

  it("should start creating mode", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.startCreating();
    });

    expect(result.current.isCreating).toBe(true);
    expect(result.current.isEditing).toBe(false);
    expect(result.current.selectedCharacterId).toBeNull();
  });

  it("should stop creating mode", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.startCreating();
      result.current.stopCreating();
    });

    expect(result.current.isCreating).toBe(false);
  });

  it("should start editing mode", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.startEditing();
    });

    expect(result.current.isEditing).toBe(true);
  });

  it("should stop editing mode", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.startEditing();
      result.current.stopEditing();
    });

    expect(result.current.isEditing).toBe(false);
  });

  it("should toggle relationship mode", () => {
    const { result } = renderHook(() => useCharacterStore());

    expect(result.current.isRelationshipMode).toBe(false);

    act(() => {
      result.current.toggleRelationshipMode();
    });

    expect(result.current.isRelationshipMode).toBe(true);

    act(() => {
      result.current.toggleRelationshipMode();
    });

    expect(result.current.isRelationshipMode).toBe(false);
  });
});

// ============================================
// CHARACTER DATA MANAGEMENT TESTS
// ============================================

describe("Character Store - Character Data", () => {
  it("should set characters", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setCharacters(mockCharacters);
    });

    expect(result.current.characters).toEqual(mockCharacters);
    expect(result.current.characters).toHaveLength(3);
  });

  it("should add character", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setCharacters([mockCharacters[0]]);
      result.current.addCharacter(mockCharacters[1]);
    });

    expect(result.current.characters).toHaveLength(2);
    expect(result.current.characters[1].id).toBe("char-2");
  });

  it("should update character", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setCharacters(mockCharacters);
      result.current.updateCharacter("char-1", { name: "Updated Gandalf" });
    });

    expect(result.current.characters[0].name).toBe("Updated Gandalf");
    expect(result.current.characters[1].name).toBe("Aragorn"); // Unchanged
  });

  it("should delete character", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setCharacters(mockCharacters);
      result.current.deleteCharacter("char-1");
    });

    expect(result.current.characters).toHaveLength(2);
    expect(result.current.characters[0].id).toBe("char-2");
  });

  it("should clear selection when deleting selected character", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setCharacters(mockCharacters);
      result.current.selectCharacter("char-1");
      result.current.deleteCharacter("char-1");
    });

    expect(result.current.selectedCharacterId).toBeNull();
  });

  it("should preserve selection when deleting non-selected character", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setCharacters(mockCharacters);
      result.current.selectCharacter("char-1");
      result.current.deleteCharacter("char-2");
    });

    expect(result.current.selectedCharacterId).toBe("char-1");
  });
});

// ============================================
// FILTER STATE TESTS
// ============================================

describe("Character Store - Filter State", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useCharacterStore());
    act(() => {
      result.current.setCharacters(mockCharacters);
    });
  });

  it("should have default type filters all true", () => {
    const { result } = renderHook(() => useCharacterStore());

    const filters = result.current.typeFilters;
    expect(filters.PLAYER).toBe(true);
    expect(filters.NPC).toBe(true);
    expect(filters.ENEMY).toBe(true);
    expect(filters.COMPANION).toBe(true);
  });

  it("should have default role filters all true", () => {
    const { result } = renderHook(() => useCharacterStore());

    const filters = result.current.roleFilters;
    expect(filters.PROTAGONIST).toBe(true);
    expect(filters.ANTAGONIST).toBe(true);
    expect(filters.MENTOR).toBe(true);
  });

  it("should have empty initial filters", () => {
    const { result } = renderHook(() => useCharacterStore());

    expect(result.current.searchTerm).toBe("");
    expect(result.current.factionFilters).toEqual({});
    expect(result.current.showVisibleOnly).toBe(false);
  });

  it("should set search term", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setSearchTerm("Gandalf");
    });

    expect(result.current.searchTerm).toBe("Gandalf");
  });

  it("should set type filter", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setTypeFilter("PLAYER", false);
    });

    expect(result.current.typeFilters.PLAYER).toBe(false);
  });

  it("should toggle type filter", () => {
    const { result } = renderHook(() => useCharacterStore());

    expect(result.current.typeFilters.PLAYER).toBe(true);

    act(() => {
      result.current.toggleTypeFilter("PLAYER");
    });

    expect(result.current.typeFilters.PLAYER).toBe(false);

    act(() => {
      result.current.toggleTypeFilter("PLAYER");
    });

    expect(result.current.typeFilters.PLAYER).toBe(true);
  });

  it("should set role filter", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setRoleFilter("MENTOR", false);
    });

    expect(result.current.roleFilters.MENTOR).toBe(false);
  });

  it("should toggle role filter", () => {
    const { result } = renderHook(() => useCharacterStore());

    expect(result.current.roleFilters.MENTOR).toBe(true);

    act(() => {
      result.current.toggleRoleFilter("MENTOR");
    });

    expect(result.current.roleFilters.MENTOR).toBe(false);
  });

  it("should add faction filter", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.addFactionFilter("The Fellowship");
    });

    expect(result.current.factionFilters["The Fellowship"]).toBe(true);
  });

  it("should remove faction filter", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.addFactionFilter("The Fellowship");
      result.current.removeFactionFilter("The Fellowship");
    });

    expect(result.current.factionFilters["The Fellowship"]).toBeUndefined();
  });

  it("should toggle show visible only", () => {
    const { result } = renderHook(() => useCharacterStore());

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
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setSearchTerm("test");
      result.current.setTypeFilter("PLAYER", false);
      result.current.addFactionFilter("Test Faction");
      result.current.toggleShowVisibleOnly();
    });

    expect(result.current.searchTerm).toBe("test");
    expect(result.current.typeFilters.PLAYER).toBe(false);
    expect(result.current.factionFilters["Test Faction"]).toBe(true);
    expect(result.current.showVisibleOnly).toBe(true);

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.searchTerm).toBe("");
    expect(result.current.typeFilters.PLAYER).toBe(true);
    expect(result.current.factionFilters).toEqual({});
    expect(result.current.showVisibleOnly).toBe(false);
  });
});

// ============================================
// FILTER APPLICATION TESTS
// ============================================

describe("Character Store - Filter Application", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useCharacterStore());
    act(() => {
      result.current.setCharacters(mockCharacters);
    });
  });

  it("should filter by search term (name)", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setSearchTerm("Gandalf");
      result.current.applyFilters();
    });

    expect(result.current.filteredCharacters).toHaveLength(1);
    expect(result.current.filteredCharacters[0].name).toBe("Gandalf");
  });

  it("should filter by search term (short name)", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setSearchTerm("Aragorn");
      result.current.applyFilters();
    });

    expect(result.current.filteredCharacters).toHaveLength(1);
    expect(result.current.filteredCharacters[0].name).toBe("Aragorn");
  });

  it("should filter by search term (faction)", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setSearchTerm("Fellowship");
      result.current.applyFilters();
    });

    expect(result.current.filteredCharacters).toHaveLength(2);
  });

  it("should be case insensitive for search term", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setSearchTerm("gandalf");
      result.current.applyFilters();
    });

    expect(result.current.filteredCharacters).toHaveLength(1);
  });

  it("should filter by character type", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setTypeFilter("PLAYER", false);
      result.current.setTypeFilter("ENEMY", false);
      result.current.applyFilters();
    });

    expect(result.current.filteredCharacters).toHaveLength(1);
    expect(result.current.filteredCharacters[0].characterType).toBe("COMPANION");
  });

  it("should filter by role", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setRoleFilter("MENTOR", false);
      result.current.setRoleFilter("PROTAGONIST", false);
      result.current.applyFilters();
    });

    expect(result.current.filteredCharacters).toHaveLength(1);
    expect(result.current.filteredCharacters[0].role).toBe("ANTAGONIST");
  });

  it("should filter by faction", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.addFactionFilter("The Fellowship");
      result.current.applyFilters();
    });

    expect(result.current.filteredCharacters).toHaveLength(2);
    expect(result.current.filteredCharacters.every((c) => c.faction === "The Fellowship")).toBe(true);
  });

  it("should filter by visibility", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.toggleShowVisibleOnly();
      result.current.applyFilters();
    });

    expect(result.current.filteredCharacters).toHaveLength(2);
    expect(result.current.filteredCharacters.every((c) => c.isVisible)).toBe(true);
  });

  it("should apply combined filters", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setSearchTerm("Gandalf");
      result.current.setTypeFilter("ENEMY", false);
      result.current.toggleShowVisibleOnly();
      result.current.applyFilters();
    });

    expect(result.current.filteredCharacters).toHaveLength(1);
    expect(result.current.filteredCharacters[0].name).toBe("Gandalf");
  });

  it("should return all characters when no filters active", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.applyFilters();
    });

    expect(result.current.filteredCharacters).toHaveLength(3);
  });

  it("should return empty when search matches nothing", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setSearchTerm("NonExistentCharacter");
      result.current.applyFilters();
    });

    expect(result.current.filteredCharacters).toHaveLength(0);
  });

  it("should return empty when type filter excludes all", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      Object.keys(result.current.typeFilters).forEach((type) => {
        result.current.setTypeFilter(type, false);
      });
      result.current.applyFilters();
    });

    expect(result.current.filteredCharacters).toHaveLength(0);
  });

  it("should return empty when faction filter matches nothing", () => {
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.addFactionFilter("NonExistent Faction");
      result.current.applyFilters();
    });

    expect(result.current.filteredCharacters).toHaveLength(0);
  });
});

// ============================================
// LOADING AND ERROR STATE TESTS
// ============================================

describe("Character Store - Loading and Error State", () => {
  it("should set loading state", () => {
    const { result } = renderHook(() => useCharacterStore());

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
    const { result } = renderHook(() => useCharacterStore());

    act(() => {
      result.current.setError("Failed to load characters");
    });

    expect(result.current.error).toBe("Failed to load characters");

    act(() => {
      result.current.setError(null);
    });

    expect(result.current.error).toBeNull();
  });
});

// ============================================
// RESET TESTS
// ============================================

describe("Character Store - Reset", () => {
  it("should reset to initial state", () => {
    const { result } = renderHook(() => useCharacterStore());

    // Set various states
    // Note: startCreating clears selection, so call selectCharacter after it
    act(() => {
      result.current.setCharacters(mockCharacters);
      result.current.setSearchTerm("test");
      result.current.setLoading(true);
      result.current.setError("error");
      result.current.toggleExpanded("char-2");
      result.current.startCreating();
      result.current.selectCharacter("char-1"); // Call after startCreating
    });

    // Verify states are set - use fresh store state
    const stateAfterSet = useCharacterStore.getState();
    expect(stateAfterSet.selectedCharacterId).toBe("char-1");
    expect(stateAfterSet.characters).toHaveLength(3);
    expect(stateAfterSet.searchTerm).toBe("test");
    expect(stateAfterSet.isLoading).toBe(true);
    expect(stateAfterSet.error).toBe("error");
    expect(stateAfterSet.expandedCharacterIds.has("char-2")).toBe(true);
    expect(stateAfterSet.isCreating).toBe(true);

    // Reset
    act(() => {
      result.current.reset();
    });

    // Verify reset to initial
    expect(result.current.selectedCharacterId).toBeNull();
    expect(result.current.characters).toHaveLength(0);
    expect(result.current.searchTerm).toBe("");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.expandedCharacterIds.size).toBe(0);
    expect(result.current.isCreating).toBe(false);
    expect(result.current.isEditing).toBe(false);
    expect(result.current.isRelationshipMode).toBe(false);
  });
});
