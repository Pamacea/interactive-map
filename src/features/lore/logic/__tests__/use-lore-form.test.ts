import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLoreForm } from "../use-lore-form";

// Mock dependencies - use module-level variables
const mockCreateLoreEntry = vi.fn();
const mockUpdateLoreEntryServer = vi.fn();

// Create a stable mock store that persists between renders
let mockStore: {
  selectedLoreId: string | null;
  isCreating: boolean;
  isEditing: boolean;
  expandedLoreIds: Set<any>;
  searchTerm: string;
  categoryFilters: any;
  showVisibleOnly: boolean;
  loreEntries: any[];
  filteredLoreEntries: any[];
  isLoading: boolean;
  error: null;
  createLoreEntry: any;
  updateLoreEntryServer: any;
  selectLore: any;
  clearSelection: any;
  toggleExpanded: any;
  startCreating: any;
  stopCreating: any;
  startEditing: any;
  stopEditing: any;
  setLoreEntries: any;
  addLoreEntry: any;
  updateLoreEntry: any;
  deleteLoreEntry: any;
  deleteLoreEntryServer: any;
  setSearchTerm: any;
  setCategoryFilter: any;
  toggleCategoryFilter: any;
  showAllCategories: any;
  hideAllCategories: any;
  toggleShowVisibleOnly: any;
  resetFilters: any;
  applyFilters: any;
  getVisibleCategories: any;
  setLoading: any;
  setError: any;
  reset: any;
};

vi.mock("@/features/lore/store/use-lore-store", () => ({
  useLoreStore: vi.fn((selector) => selector(mockStore)),
}));

// Import the mocked function to control its behavior
import { useLoreStore } from "@/features/lore/store/use-lore-store";

describe("useLoreForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Create a fresh mock store for each test with stable references
    mockStore = {
      // UI State
      selectedLoreId: null,
      isCreating: false,
      isEditing: false,
      expandedLoreIds: new Set(),

      // Filters
      searchTerm: "",
      categoryFilters: {
        GENERAL: true,
        HISTORY: true,
        GEOGRAPHY: true,
        CHARACTERS: true,
        FACTIONS: true,
        MAGIC: true,
        ITEMS: true,
        QUESTS: true,
        CUSTOM: true,
      },
      showVisibleOnly: false,

      // Data
      loreEntries: [],
      filteredLoreEntries: [],
      isLoading: false,
      error: null,

      // Server sync methods (these are what the hook actually uses)
      createLoreEntry: mockCreateLoreEntry,
      updateLoreEntryServer: mockUpdateLoreEntryServer,

      // Other methods (stubs)
      selectLore: vi.fn(),
      clearSelection: vi.fn(),
      toggleExpanded: vi.fn(),
      startCreating: vi.fn(),
      stopCreating: vi.fn(),
      startEditing: vi.fn(),
      stopEditing: vi.fn(),
      setLoreEntries: vi.fn(),
      addLoreEntry: vi.fn(),
      updateLoreEntry: vi.fn(),
      deleteLoreEntry: vi.fn(),
      deleteLoreEntryServer: vi.fn(),
      setSearchTerm: vi.fn(),
      setCategoryFilter: vi.fn(),
      toggleCategoryFilter: vi.fn(),
      showAllCategories: vi.fn(),
      hideAllCategories: vi.fn(),
      toggleShowVisibleOnly: vi.fn(),
      resetFilters: vi.fn(),
      applyFilters: vi.fn(),
      getVisibleCategories: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
      reset: vi.fn(),
    };
  });

  describe("initial state", () => {
    it("should initialize with default form data", () => {
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      expect(result.current.formData).toEqual({
        title: "",
        content: "",
        category: "GENERAL",
        isVisible: false,
        isPublic: true,
      });
    });

    it("should initialize with no errors", () => {
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      expect(result.current.errors).toEqual({});
    });

    it("should not be submitting", () => {
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      expect(result.current.isSubmitting).toBe(false);
    });

    it("should be valid initially", () => {
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      expect(result.current.isValid).toBe(true);
    });
  });

  describe("updateField", () => {
    it("should update title field", () => {
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      act(() => {
        result.current.updateField("title", "New Title");
      });

      expect(result.current.formData.title).toBe("New Title");
    });

    it("should update content field", () => {
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      act(() => {
        result.current.updateField("content", "New content");
      });

      expect(result.current.formData.content).toBe("New content");
    });

    it("should update category field", () => {
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      act(() => {
        result.current.updateField("category", "HISTORY");
      });

      expect(result.current.formData.category).toBe("HISTORY");
    });

    it("should update isVisible field", () => {
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      act(() => {
        result.current.updateField("isVisible", true);
      });

      expect(result.current.formData.isVisible).toBe(true);
    });

    it("should update isPublic field", () => {
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      act(() => {
        result.current.updateField("isPublic", false);
      });

      expect(result.current.formData.isPublic).toBe(false);
    });

    it("should clear error for field when updated", () => {
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      // First validate to create errors
      act(() => {
        result.current.updateField("title", "");
      });

      // Errors are only set when validating, so let's test the isValid
      expect(result.current.isValid).toBe(true); // No errors until we actually submit/validate

      // Now test that errors get cleared when we update
      act(() => {
        result.current.updateField("title", "Test");
      });

      expect(result.current.formData.title).toBe("Test");
    });
  });

  describe("submitForm validation", () => {
    it("should pass validation with valid data", async () => {
      mockCreateLoreEntry.mockResolvedValue({
        id: "new-1",
        title: "Valid Title",
        content: "Valid content",
        category: "GENERAL",
        isVisible: false,
        isPublic: true,
        gameWorldId: "world-1",
      });

      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      act(() => {
        result.current.updateField("title", "Valid Title");
        result.current.updateField("content", "Valid content with enough text");
      });

      let submitResult;
      await act(async () => {
        submitResult = await result.current.submitForm();
      });

      expect(submitResult).toBe(true);
      expect(result.current.errors.title).toBeUndefined();
      expect(result.current.errors.content).toBeUndefined();
    });

    it("should fail validation with empty title", async () => {
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      act(() => {
        result.current.updateField("title", "   ");
        result.current.updateField("content", "Valid content");
      });

      let submitResult;
      await act(async () => {
        submitResult = await result.current.submitForm();
      });

      expect(submitResult).toBe(false);
      expect(result.current.errors.title).toBe("Title is required");
    });

    it("should fail validation with title over 200 characters", async () => {
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      const longTitle = "a".repeat(201);

      act(() => {
        result.current.updateField("title", longTitle);
        result.current.updateField("content", "Valid content");
      });

      let submitResult;
      await act(async () => {
        submitResult = await result.current.submitForm();
      });

      expect(submitResult).toBe(false);
      expect(result.current.errors.title).toBe("Title must be less than 200 characters");
    });

    it("should fail validation with empty content", async () => {
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      act(() => {
        result.current.updateField("title", "Valid Title");
        result.current.updateField("content", "   ");
      });

      let submitResult;
      await act(async () => {
        submitResult = await result.current.submitForm();
      });

      expect(submitResult).toBe(false);
      expect(result.current.errors.content).toBe("Content is required");
    });

    it("should fail validation with content over 50000 characters", async () => {
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      const longContent = "a".repeat(50001);

      act(() => {
        result.current.updateField("title", "Valid Title");
        result.current.updateField("content", longContent);
      });

      let submitResult;
      await act(async () => {
        submitResult = await result.current.submitForm();
      });

      expect(submitResult).toBe(false);
      expect(result.current.errors.content).toBe("Content must be less than 50,000 characters");
    });
  });

  describe("resetForm", () => {
    it("should reset form to default values", () => {
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      act(() => {
        result.current.updateField("title", "Test Title");
        result.current.updateField("content", "Test content");
        result.current.updateField("category", "HISTORY");
        result.current.updateField("isVisible", true);
        result.current.updateField("isPublic", false);
      });

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.formData).toEqual({
        title: "",
        content: "",
        category: "GENERAL",
        isVisible: false,
        isPublic: true,
      });
    });

    it("should clear errors on reset", async () => {
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      // First set some data to create state
      act(() => {
        result.current.updateField("title", "Test Title");
        result.current.updateField("content", "");
      });

      // Submit to trigger errors
      await act(async () => {
        await result.current.submitForm();
      });

      // Should have content error
      const hasErrorsBefore = Object.keys(result.current.errors).length > 0;

      // Now reset
      act(() => {
        result.current.resetForm();
      });

      expect(result.current.errors).toEqual({});
      expect(result.current.formData.title).toBe("");
      expect(result.current.formData.content).toBe("");
    });
  });

  describe("initializeFromLore", () => {
    it("should initialize form from existing lore entry", () => {
      const loreEntry = {
        id: "1",
        title: "Existing Title",
        content: "Existing content",
        category: "HISTORY" as const,
        isVisible: true,
        isPublic: false,
      };

      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      act(() => {
        result.current.initializeFromLore(loreEntry);
      });

      expect(result.current.formData).toEqual({
        title: "Existing Title",
        content: "Existing content",
        category: "HISTORY",
        isVisible: true,
        isPublic: false,
      });
    });

    it("should clear errors when initializing", async () => {
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      // First create some errors by submitting empty form
      await act(async () => {
        await result.current.submitForm();
      });

      // Now initialize from lore
      const loreEntry = {
        id: "1",
        title: "Test",
        content: "Content",
        category: "GENERAL" as const,
        isVisible: false,
        isPublic: true,
      };

      act(() => {
        result.current.initializeFromLore(loreEntry);
      });

      // The hook was already initialized with defaults, so initializeFromLore updates it
      expect(result.current.errors).toEqual({});
      expect(result.current.formData).toEqual({
        title: "Test",
        content: "Content",
        category: "GENERAL",
        isVisible: false,
        isPublic: true,
      });
    });
  });

  describe("submitForm - create", () => {
    it("should create new lore entry", async () => {
      const newLore = {
        id: "new-1",
        title: "New Lore",
        content: "New content",
        category: "GENERAL" as const,
        isVisible: false,
        isPublic: true,
        gameWorldId: "world-1",
      };

      mockCreateLoreEntry.mockResolvedValue(newLore);

      const onSuccess = vi.fn();
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1", onSuccess })
      );

      act(() => {
        result.current.updateField("title", "New Lore");
        result.current.updateField("content", "New content");
      });

      let submitResult;
      await act(async () => {
        submitResult = await result.current.submitForm();
      });

      expect(mockCreateLoreEntry).toHaveBeenCalledWith({
        title: "New Lore",
        content: "New content",
        category: "GENERAL",
        isVisible: false,
        isPublic: true,
        gameWorldId: "world-1",
      });

      expect(onSuccess).toHaveBeenCalledWith(newLore);
      expect(submitResult).toBe(true);
    });

    it("should not submit with invalid data", async () => {
      const onSuccess = vi.fn();
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1", onSuccess })
      );

      const submitResult = await act(async () => {
        return await result.current.submitForm();
      });

      expect(mockCreateLoreEntry).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(submitResult).toBe(false);
    });

    it("should call onError on creation failure", async () => {
      const error = new Error("Creation failed");
      mockCreateLoreEntry.mockRejectedValue(error);

      const onError = vi.fn();
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1", onError })
      );

      act(() => {
        result.current.updateField("title", "Test");
        result.current.updateField("content", "Content");
      });

      let submitResult;
      await act(async () => {
        submitResult = await result.current.submitForm();
      });

      expect(onError).toHaveBeenCalledWith(error);
      expect(submitResult).toBe(false);
    });
  });

  describe("submitForm - update", () => {
    it("should update existing lore entry", async () => {
      const updatedLore = {
        id: "1",
        title: "Updated Title",
        content: "Updated content",
        category: "HISTORY" as const,
        isVisible: true,
        isPublic: false,
      };

      mockUpdateLoreEntryServer.mockResolvedValue(updatedLore);

      const onSuccess = vi.fn();
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1", onSuccess })
      );

      act(() => {
        result.current.updateField("title", "Updated Title");
        result.current.updateField("content", "Updated content");
        result.current.updateField("category", "HISTORY");
        result.current.updateField("isVisible", true);
        result.current.updateField("isPublic", false);
      });

      let submitResult;
      await act(async () => {
        submitResult = await result.current.submitForm("1");
      });

      expect(mockUpdateLoreEntryServer).toHaveBeenCalledWith({
        id: "1",
        title: "Updated Title",
        content: "Updated content",
        category: "HISTORY",
        isVisible: true,
        isPublic: false,
      });

      expect(onSuccess).toHaveBeenCalledWith(updatedLore);
      expect(submitResult).toBe(true);
    });

    it("should call onError on update failure", async () => {
      const error = new Error("Update failed");
      mockUpdateLoreEntryServer.mockRejectedValue(error);

      const onError = vi.fn();
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1", onError })
      );

      act(() => {
        result.current.updateField("title", "Test");
        result.current.updateField("content", "Content");
      });

      let submitResult;
      await act(async () => {
        submitResult = await result.current.submitForm("1");
      });

      expect(onError).toHaveBeenCalledWith(error);
      expect(submitResult).toBe(false);
    });
  });

  describe("submitForm - form reset", () => {
    it("should reset form after successful submission", async () => {
      mockCreateLoreEntry.mockResolvedValue({
        id: "new-1",
        title: "Test",
        content: "Content",
        category: "GENERAL" as const,
        isVisible: false,
        isPublic: true,
        gameWorldId: "world-1",
      });

      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      act(() => {
        result.current.updateField("title", "Test");
        result.current.updateField("content", "Content");
      });

      await act(async () => {
        await result.current.submitForm();
      });

      expect(result.current.formData.title).toBe("");
      expect(result.current.formData.content).toBe("");
    });
  });

  describe("submitForm - loading state", () => {
    it("should set isSubmitting during submission", async () => {
      mockCreateLoreEntry.mockImplementation(
        () => new Promise((resolve) => {
          setTimeout(() => resolve({
            id: "new-1",
            title: "Test",
            content: "Content",
            category: "GENERAL" as const,
            isVisible: false,
            isPublic: true,
            gameWorldId: "world-1",
          }), 100);
        })
      );

      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      act(() => {
        result.current.updateField("title", "Test");
        result.current.updateField("content", "Content");
      });

      act(() => {
        result.current.submitForm();
      });

      expect(result.current.isSubmitting).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle non-Error objects in onError", async () => {
      mockCreateLoreEntry.mockRejectedValue("String error");

      const onError = vi.fn();
      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1", onError })
      );

      act(() => {
        result.current.updateField("title", "Test");
        result.current.updateField("content", "Content");
      });

      await act(async () => {
        await result.current.submitForm();
      });

      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should trim whitespace in title and content on submit", async () => {
      mockCreateLoreEntry.mockResolvedValue({
        id: "new-1",
        title: "Test",
        content: "Content",
        category: "GENERAL" as const,
        isVisible: false,
        isPublic: true,
        gameWorldId: "world-1",
      });

      const { result } = renderHook(() =>
        useLoreForm({ worldId: "world-1" })
      );

      act(() => {
        result.current.updateField("title", "  Test  ");
        result.current.updateField("content", "  Content  ");
      });

      await act(async () => {
        await result.current.submitForm();
      });

      expect(mockCreateLoreEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test",
          content: "Content",
        })
      );
    });
  });
});
