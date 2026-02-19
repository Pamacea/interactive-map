/**
 * Layer Selectors Tests
 */

import { describe, it, expect } from "vitest";
import type { UILayer } from "../layer-selectors";
import * as selectors from "../layer-selectors";

describe("Layer Selectors", () => {
  // ============================================================================
  // Test Data
  // ============================================================================

  const mockLayers: UILayer[] = [
    {
      id: "1",
      name: "Base Map",
      visible: true,
      locked: true,
      opacity: 1,
      zIndex: 0,
      scale: 1.0,
      offsetX: 0,
      offsetY: 0,
      imageUrl: "/base-map.png",
    },
    {
      id: "2",
      name: "Terrain",
      visible: true,
      locked: false,
      opacity: 0.8,
      zIndex: 1,
      scale: 1.0,
      offsetX: 10,
      offsetY: 10,
      minZoom: 0,
      maxZoom: 200,
    },
    {
      id: "3",
      name: "Markers",
      visible: false,
      locked: false,
      opacity: 1,
      zIndex: 2,
      scale: 1.0,
      offsetX: 0,
      offsetY: 0,
      minZoom: 50,
      maxZoom: 200,
    },
    {
      id: "4",
      name: "Labels",
      visible: true,
      locked: false,
      opacity: 0.9,
      zIndex: 3,
      scale: 1.0,
      offsetX: 0,
      offsetY: 0,
    },
  ];

  // ============================================================================
  // Basic Selectors
  // ============================================================================

  describe("selectAllLayers", () => {
    it("should return all layers", () => {
      expect(selectors.selectAllLayers(mockLayers)).toEqual(mockLayers);
    });

    it("should return empty array for empty input", () => {
      expect(selectors.selectAllLayers([])).toEqual([]);
    });
  });

  describe("selectLayerById", () => {
    it("should return layer by ID", () => {
      const result = selectors.selectLayerById(mockLayers, "2");
      expect(result).toEqual(mockLayers[1]);
      expect(result?.name).toBe("Terrain");
    });

    it("should return undefined for non-existent ID", () => {
      const result = selectors.selectLayerById(mockLayers, "999");
      expect(result).toBeUndefined();
    });
  });

  describe("selectVisibleLayers", () => {
    it("should return only visible layers", () => {
      const result = selectors.selectVisibleLayers(mockLayers);
      expect(result).toHaveLength(3);
      expect(result.every((l) => l.visible)).toBe(true);
    });
  });

  describe("selectLockedLayers", () => {
    it("should return only locked layers", () => {
      const result = selectors.selectLockedLayers(mockLayers);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });
  });

  describe("selectUnlockedLayers", () => {
    it("should return only unlocked layers", () => {
      const result = selectors.selectUnlockedLayers(mockLayers);
      expect(result).toHaveLength(3);
      expect(result.every((l) => !l.locked)).toBe(true);
    });
  });

  // ============================================================================
  // Ordering Selectors
  // ============================================================================

  describe("selectLayersSortedByZIndex", () => {
    it("should sort layers by z-index ascending", () => {
      const result = selectors.selectLayersSortedByZIndex(mockLayers);
      expect(result[0].zIndex).toBeLessThanOrEqual(result[1].zIndex);
      expect(result[1].zIndex).toBeLessThanOrEqual(result[2].zIndex);
      expect(result[2].zIndex).toBeLessThanOrEqual(result[3].zIndex);
    });

    it("should maintain original array", () => {
      const originalOrder = mockLayers.map((l) => l.id);
      selectors.selectLayersSortedByZIndex(mockLayers);
      expect(mockLayers.map((l) => l.id)).toEqual(originalOrder);
    });
  });

  describe("selectLayersSortedByName", () => {
    it("should sort layers alphabetically", () => {
      const result = selectors.selectLayersSortedByName(mockLayers);
      expect(result[0].name).toBe("Base Map");
      expect(result[1].name).toBe("Labels");
      expect(result[2].name).toBe("Markers");
      expect(result[3].name).toBe("Terrain");
    });
  });

  // ============================================================================
  // Layer IDs Selectors
  // ============================================================================

  describe("selectVisibleLayerIds", () => {
    it("should return IDs of visible layers", () => {
      const result = selectors.selectVisibleLayerIds(mockLayers);
      expect(result).toEqual(["1", "2", "4"]);
    });
  });

  describe("selectActiveLayerIds", () => {
    it("should return IDs of unlocked layers", () => {
      const result = selectors.selectActiveLayerIds(mockLayers);
      expect(result).toEqual(["2", "3", "4"]);
    });
  });

  // ============================================================================
  // State Selectors
  // ============================================================================

  describe("selectIsBaseMapVisible", () => {
    it("should return true when base map is visible", () => {
      const result = selectors.selectIsBaseMapVisible(mockLayers);
      expect(result).toBe(true);
    });

    it("should return false when base map is hidden", () => {
      const layers = mockLayers.map((l) =>
        l.id === "1" ? { ...l, visible: false } : l
      );
      const result = selectors.selectIsBaseMapVisible(layers);
      expect(result).toBe(false);
    });

    it("should return true when no base map exists", () => {
      const result = selectors.selectIsBaseMapVisible(
        mockLayers.slice(1) // Remove base map
      );
      expect(result).toBe(true); // Default to true
    });
  });

  describe("selectLayerOpacity", () => {
    it("should return layer opacity", () => {
      const result = selectors.selectLayerOpacity(mockLayers, "2");
      expect(result).toBe(0.8);
    });

    it("should return 1 for non-existent layer", () => {
      const result = selectors.selectLayerOpacity(mockLayers, "999");
      expect(result).toBe(1);
    });
  });

  describe("selectLayerOffset", () => {
    it("should return layer offset", () => {
      const result = selectors.selectLayerOffset(mockLayers, "2");
      expect(result).toEqual({ offsetX: 10, offsetY: 10 });
    });

    it("should return zero offset for non-existent layer", () => {
      const result = selectors.selectLayerOffset(mockLayers, "999");
      expect(result).toEqual({ offsetX: 0, offsetY: 0 });
    });
  });

  // ============================================================================
  // Zoom-based Selectors
  // ============================================================================

  describe("selectLayersAtZoom", () => {
    it("should return layers visible at zoom level", () => {
      const result = selectors.selectLayersAtZoom(mockLayers, 100);
      expect(result.every((l) => {
        const minZoom = l.minZoom ?? 0;
        const maxZoom = l.maxZoom ?? 200;
        return 100 >= minZoom && 100 <= maxZoom;
      })).toBe(true);
    });

    it("should exclude layers outside zoom range", () => {
      const result = selectors.selectLayersAtZoom(mockLayers, 25);
      expect(result.every((l) => l.id !== "3")).toBe(true); // Layer 3 has minZoom: 50
    });
  });

  describe("selectIsLayerVisibleAtZoom", () => {
    it("should check layer visibility at zoom", () => {
      // Layer 2 is visible and has no zoom restrictions
      expect(selectors.selectIsLayerVisibleAtZoom(mockLayers, "2", 100)).toBe(true);
    });

    it("should return false when layer is hidden", () => {
      expect(selectors.selectIsLayerVisibleAtZoom(mockLayers, "3", 100)).toBe(false);
    });

    it("should return false when outside zoom range", () => {
      expect(selectors.selectIsLayerVisibleAtZoom(mockLayers, "3", 25)).toBe(false);
    });
  });

  // ============================================================================
  // Transform Selectors
  // ============================================================================

  describe("selectLayerTransform", () => {
    it("should return transform CSS string", () => {
      const result = selectors.selectLayerTransform(mockLayers, "2");
      expect(result).toBe("scale(1) translate(10px, 10px)");
    });

    it("should return empty string for non-existent layer", () => {
      const result = selectors.selectLayerTransform(mockLayers, "999");
      expect(result).toBe("");
    });
  });

  describe("selectLayerStyle", () => {
    it("should return style object", () => {
      const result = selectors.selectLayerStyle(mockLayers, "2");
      expect(result).toEqual({
        opacity: 0.8,
        zIndex: 1,
        transform: "scale(1) translate(10px, 10px)",
      });
    });

    it("should return empty object for non-existent layer", () => {
      const result = selectors.selectLayerStyle(mockLayers, "999");
      expect(result).toEqual({});
    });
  });

  // ============================================================================
  // Utility Selectors
  // ============================================================================

  describe("selectVisibleLayerCount", () => {
    it("should count visible layers", () => {
      expect(selectors.selectVisibleLayerCount(mockLayers)).toBe(3);
    });
  });

  describe("selectLockedLayerCount", () => {
    it("should count locked layers", () => {
      expect(selectors.selectLockedLayerCount(mockLayers)).toBe(1);
    });
  });

  describe("selectMaxZIndex", () => {
    it("should return max z-index", () => {
      expect(selectors.selectMaxZIndex(mockLayers)).toBe(3);
    });

    it("should return 0 for empty array", () => {
      expect(selectors.selectMaxZIndex([])).toBe(0);
    });
  });

  describe("selectNextZIndex", () => {
    it("should return next available z-index", () => {
      expect(selectors.selectNextZIndex(mockLayers)).toBe(4);
    });
  });

  describe("selectHasLayerImages", () => {
    it("should return true when layers have images", () => {
      expect(selectors.selectHasLayerImages(mockLayers)).toBe(true);
    });

    it("should return false when no layers have images", () => {
      const layers = mockLayers.map((l) => ({ ...l, imageUrl: undefined }));
      expect(selectors.selectHasLayerImages(layers)).toBe(false);
    });
  });

  // ============================================================================
  // Batch Selectors
  // ============================================================================

  describe("selectLayerStateSummary", () => {
    it("should return layer state summary", () => {
      const result = selectors.selectLayerStateSummary(mockLayers);
      expect(result).toEqual({
        total: 4,
        visible: 3,
        locked: 1,
        hasBaseMap: true,
        baseMapVisible: true,
        maxZIndex: 3,
      });
    });
  });

  describe("selectDisplayLayers", () => {
    it("should exclude base map and sort by z-index", () => {
      const result = selectors.selectDisplayLayers(mockLayers);
      expect(result).toHaveLength(3);
      expect(result.every((l) => l.id !== "1")).toBe(true);
      expect(result[0].zIndex).toBeLessThanOrEqual(result[1].zIndex);
    });
  });
});
