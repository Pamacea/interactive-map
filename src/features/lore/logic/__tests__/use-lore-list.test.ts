import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLoreList } from "../use-lore-list";
// import { useLoreStore } from "@/features/lore/store/use-lore-store";
import { getLoreEntriesByWorld } from "@/features/lore/actions/lore";

// Mock the actions
vi.mock("@/features/lore/actions/lore");

// Create mock functions for store methods
const mockSetLoreEntries = vi.fn();
const mockSetLoading = vi.fn();
const mockSetError = vi.fn();

// Mock the store to support selector pattern
vi.mock("@/features/lore/store/use-lore-store", () => ({
  useLoreStore: vi.fn((selector) => {
    const _state = {
      loreEntries: [],
      isLoading: false,
      error: null,
      setLoreEntries: mockSetLoreEntries,
      setLoading: mockSetLoading,
      setError: mockSetError,
    };
    return selector ? selector(state) : state;
  }),
}));

describe("useLoreList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initial state", () => {
    it("should return initial state", () => {
      const { result } = renderHook(() =>
        useLoreList({ worldId: "world-1" })
      );

      expect(result.current.loreEntries).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.refetch).toBe("function");
    });
  });

  describe("with initial data", () => {
    it("should use initial data when provided", () => {
      const initialData = [
        { id: "1", title: "Lore 1", content: "Content 1" },
        { id: "2", title: "Lore 2", content: "Content 2" },
      ] as Array<{ id: string; title: string; content?: string }>;

      renderHook(() =>
        useLoreList({ worldId: "world-1", initialData })
      );

      expect(mockSetLoreEntries).toHaveBeenCalledWith(initialData);
    });

    it("should not fetch when initial data is provided", () => {
      const initialData = [{ id: "1", title: "Lore 1" }] as unknown[];

      renderHook(() =>
        useLoreList({ worldId: "world-1", initialData })
      );

      expect(getLoreEntriesByWorld).not.toHaveBeenCalled();
    });
  });

  describe("fetching", () => {
    it("should fetch lore entries when enabled", async () => {
      vi.useRealTimers(); // Disable fake timers for async test
      const loreData = [
        { id: "1", title: "Lore 1" },
        { id: "2", title: "Lore 2" },
      ] as Array<{ id: string; title: string; content?: string }>;

      (getLoreEntriesByWorld as ReturnType<typeof vi.fn>).mockResolvedValue(loreData);

      renderHook(() =>
        useLoreList({ worldId: "world-1", enabled: true })
      );

      await waitFor(() => {
        expect(getLoreEntriesByWorld).toHaveBeenCalledWith("world-1");
      });
    });

    it("should not fetch when disabled", () => {
      renderHook(() =>
        useLoreList({ worldId: "world-1", enabled: false })
      );

      expect(getLoreEntriesByWorld).not.toHaveBeenCalled();
    });

    it("should not fetch when worldId is empty", () => {
      renderHook(() =>
        useLoreList({ worldId: "", enabled: true })
      );

      expect(getLoreEntriesByWorld).not.toHaveBeenCalled();
    });

    it("should set loading state during fetch", async () => {
      vi.useRealTimers(); // Disable fake timers for async test
      (getLoreEntriesByWorld as ReturnType<typeof vi.fn>).mockImplementation(
        () => new Promise((resolve) => {
          setTimeout(() => resolve([]), 100);
        })
      );

      renderHook(() =>
        useLoreList({ worldId: "world-1", enabled: true })
      );

      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });

    it("should set lore entries on successful fetch", async () => {
      vi.useRealTimers(); // Disable fake timers for async test
      const loreData = [
        { id: "1", title: "Lore 1", content: "Content 1" },
        { id: "2", title: "Lore 2", content: "Content 2" },
      ] as Array<{ id: string; title: string; content?: string }>;

      (getLoreEntriesByWorld as ReturnType<typeof vi.fn>).mockResolvedValue(loreData);

      renderHook(() =>
        useLoreList({ worldId: "world-1", enabled: true })
      );

      await waitFor(() => {
        expect(mockSetLoreEntries).toHaveBeenCalledWith(loreData);
        expect(mockSetLoading).toHaveBeenCalledWith(false);
      });
    });

    it("should handle fetch errors", async () => {
      vi.useRealTimers(); // Disable fake timers for async test
      const error = new Error("Network error");
      (getLoreEntriesByWorld as ReturnType<typeof vi.fn>).mockRejectedValue(error);

      renderHook(() =>
        useLoreList({ worldId: "world-1", enabled: true })
      );

      await waitFor(() => {
        expect(mockSetError).toHaveBeenCalledWith("Network error");
        expect(mockSetLoading).toHaveBeenCalledWith(false);
      });
    });

    it("should handle non-error objects", async () => {
      vi.useRealTimers(); // Disable fake timers for async test
      (getLoreEntriesByWorld as ReturnType<typeof vi.fn>).mockRejectedValue("String error");

      renderHook(() =>
        useLoreList({ worldId: "world-1", enabled: true })
      );

      await waitFor(() => {
        expect(mockSetError).toHaveBeenCalledWith("Failed to fetch lore entries");
      });
    });
  });

  describe("refetch", () => {
    it("should refetch lore entries", async () => {
      vi.useRealTimers(); // Disable fake timers for async test
      const loreData = [{ id: "1", title: "New Lore" }] as Array<{ id: string; title: string }>;

      (getLoreEntriesByWorld as ReturnType<typeof vi.fn>).mockResolvedValue(loreData);

      const { result } = renderHook(() =>
        useLoreList({ worldId: "world-1", enabled: true })
      );

      // Initial fetch
      await waitFor(() => {
        expect(getLoreEntriesByWorld).toHaveBeenCalledTimes(1);
      });

      // Refetch
      act(() => {
        result.current.refetch();
      });

      await waitFor(() => {
        expect(getLoreEntriesByWorld).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("edge cases", () => {
    it("should handle empty worldId", () => {
      const { result } = renderHook(() =>
        useLoreList({ worldId: "", enabled: true })
      );

      expect(result.current.loreEntries).toEqual([]);
    });

    it("should handle empty initial data array", () => {
      renderHook(() =>
        useLoreList({ worldId: "world-1", initialData: [] })
      );

      // Should still fetch when initial data is empty array
      expect(getLoreEntriesByWorld).toHaveBeenCalled();
    });

    it("should handle rapid enable/disable changes", () => {
      const { rerender } = renderHook(
        ({ enabled }) => useLoreList({ worldId: "world-1", enabled }),
        { initialProps: { enabled: true } }
      );

      rerender({ enabled: false });
      rerender({ enabled: true });
      rerender({ enabled: false });

      // Should not cause excessive fetches beyond initial (initial + 1 re-enable)
      expect(getLoreEntriesByWorld).toHaveBeenCalledTimes(2);
    });
  });
});
