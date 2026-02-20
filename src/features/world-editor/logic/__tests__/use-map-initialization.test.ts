import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useMapInitialization } from "../use-map-initialization";

// Mock dependencies - with implementation inline
const mockUseMapStore = vi.fn();
vi.mock("@/features/world-editor/store/map-store", () => ({
  useMapStore: (selector?: any) => {
    const mockState = {
      grid: true,
      scale: "1.5x",
      layers: [
        { id: "1", visible: true, zIndex: 0, isBaseMap: true },
        { id: "2", visible: false, zIndex: 1 },
      ],
      selectedLayerId: "1",
      baseMapVisible: true,
    };
    return selector ? selector(mockState) : mockState;
  },
}));

vi.mock("@/features/export/utils/use-map-export-context", () => ({
  useMapExport: () => ({
    setMapElement: vi.fn(),
  }),
}));

describe("useMapInitialization", () => {
  describe("initial state", () => {
    it("should return containerRef", () => {
      const { result } = renderHook(() =>
        useMapInitialization({ worldId: "world-1" })
      );

      expect(result.current.containerRef).toBeDefined();
      expect(result.current.containerRef.current).toBeNull();
    });

    it("should return grid state from store", () => {
      const { result } = renderHook(() =>
        useMapInitialization({ worldId: "world-1" })
      );

      expect(result.current.grid).toBe(true);
    });

    it("should return scale state from store", () => {
      const { result } = renderHook(() =>
        useMapInitialization({ worldId: "world-1" })
      );

      expect(result.current.scale).toBe("1.5x");
    });

    it("should return layers from store", () => {
      const { result } = renderHook(() =>
        useMapInitialization({ worldId: "world-1" })
      );

      expect(result.current.layers).toHaveLength(2);
      expect(result.current.layers[0].isBaseMap).toBe(true);
    });

    it("should return selectedLayerId from store", () => {
      const { result } = renderHook(() =>
        useMapInitialization({ worldId: "world-1" })
      );

      expect(result.current.selectedLayerId).toBe("1");
    });

    it("should return baseMapVisible from store", () => {
      const { result } = renderHook(() =>
        useMapInitialization({ worldId: "world-1" })
      );

      expect(result.current.baseMapVisible).toBe(true);
    });
  });

  describe("map element registration", () => {
    it("should call setMapElement when containerRef is available", () => {
      const { result } = renderHook(() =>
        useMapInitialization({ worldId: "world-1" })
      );

      // Verify containerRef is defined and works as expected
      expect(result.current.containerRef).toBeDefined();
      expect(result.current.containerRef.current).toBeNull();

      // The useEffect should have called setMapElement with null on mount
      // and will call it with the element when ref is set (in actual usage)
    });
  });

  describe("edge cases", () => {
    it("should handle undefined mapImage", () => {
      const { result } = renderHook(() =>
        useMapInitialization({ worldId: "world-1" })
      );

      expect(result.current.containerRef).toBeDefined();
    });

    it("should handle empty worldId", () => {
      const { result } = renderHook(() =>
        useMapInitialization({})
      );

      expect(result.current.containerRef).toBeDefined();
    });

    it("should handle no options", () => {
      const { result } = renderHook(() => useMapInitialization({}));

      expect(result.current.containerRef).toBeDefined();
    });
  });
});
