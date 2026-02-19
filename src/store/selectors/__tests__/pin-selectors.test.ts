/**
 * Pin Selectors Tests
 */

import { describe, it, expect } from "vitest";
import type { Pin } from "@prisma/client";
import { PinType } from "@/types/pin.type";
import * as selectors from "../pin-selectors";

describe("Pin Selectors", () => {
  // ============================================================================
  // Test Data
  // ============================================================================

  const mockPins: Pin[] = [
    {
      id: "1",
      title: "Capital City",
      gameWorldId: "world1",
      latitude: 100,
      longitude: 100,
      pinType: PinType.CITY,
      isVisible: true,
      opacity: 1,
      size: 32,
      minZoom: 0,
      maxZoom: 200,
      layerId: "layer1",
      order: 1,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "2",
      title: "Small Village",
      gameWorldId: "world1",
      latitude: 200,
      longitude: 200,
      pinType: PinType.VILLAGE,
      isVisible: true,
      opacity: 1,
      size: 24,
      minZoom: 0,
      maxZoom: 200,
      layerId: "layer1",
      order: 2,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "3",
      title: "Hidden Dungeon",
      gameWorldId: "world1",
      latitude: 150,
      longitude: 150,
      pinType: PinType.DUNGEON,
      isVisible: false,
      opacity: 1,
      size: 32,
      minZoom: 0,
      maxZoom: 200,
      layerId: "layer2",
      order: 3,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "4",
      title: "Forest of Elves",
      gameWorldId: "world1",
      latitude: 300,
      longitude: 300,
      pinType: PinType.CUSTOM,
      isVisible: true,
      opacity: 1,
      size: 32,
      minZoom: 50,
      maxZoom: 200,
      layerId: "layer2",
      order: 4,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  ];

  // ============================================================================
  // Basic Selectors
  // ============================================================================

  describe("selectAllPins", () => {
    it("should return all pins", () => {
      expect(selectors.selectAllPins(mockPins)).toEqual(mockPins);
    });

    it("should return empty array for empty input", () => {
      expect(selectors.selectAllPins([])).toEqual([]);
    });
  });

  describe("selectPinById", () => {
    it("should return pin by ID", () => {
      const result = selectors.selectPinById(mockPins, "1");
      expect(result).toEqual(mockPins[0]);
      expect(result?.title).toBe("Capital City");
    });

    it("should return undefined for non-existent ID", () => {
      const result = selectors.selectPinById(mockPins, "999");
      expect(result).toBeUndefined();
    });
  });

  describe("selectPinsByLayer", () => {
    it("should return pins for layer", () => {
      const result = selectors.selectPinsByLayer(mockPins, "layer1");
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toEqual(["1", "2"]);
    });

    it("should return empty array for layer with no pins", () => {
      const result = selectors.selectPinsByLayer(mockPins, "layer999");
      expect(result).toEqual([]);
    });
  });

  describe("selectPinsByType", () => {
    it("should return pins by type", () => {
      const result = selectors.selectPinsByType(mockPins, PinType.CITY);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });
  });

  describe("selectVisiblePins", () => {
    it("should return only visible pins", () => {
      const result = selectors.selectVisiblePins(mockPins);
      expect(result).toHaveLength(3);
      expect(result.every((p) => p.isVisible)).toBe(true);
    });
  });

  describe("selectHiddenPins", () => {
    it("should return only hidden pins", () => {
      const result = selectors.selectHiddenPins(mockPins);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("3");
    });
  });

  // ============================================================================
  // Filter Selectors
  // ============================================================================

  describe("selectFilteredPins", () => {
    const defaultFilters: selectors.PinFilters = {
      searchTerm: "",
      pinTypeFilters: {},
      layerIds: [],
      showVisibleOnly: false,
    };

    it("should return all pins with no filters", () => {
      const result = selectors.selectFilteredPins(mockPins, defaultFilters);
      expect(result).toHaveLength(4);
    });

    it("should filter by search term", () => {
      const filters = { ...defaultFilters, searchTerm: "City" };
      const result = selectors.selectFilteredPins(mockPins, filters);
      expect(result).toHaveLength(2); // "Capital City" and "Small City"
    });

    it("should filter by pin type", () => {
      const filters = {
        ...defaultFilters,
        pinTypeFilters: { [PinType.VILLAGE]: false },
      };
      const result = selectors.selectFilteredPins(mockPins, filters);
      expect(result.every((p) => p.pinType !== PinType.VILLAGE)).toBe(true);
    });

    it("should filter by layer", () => {
      const filters = { ...defaultFilters, layerIds: ["layer1"] };
      const result = selectors.selectFilteredPins(mockPins, filters);
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.layerId === "layer1")).toBe(true);
    });

    it("should filter visible only", () => {
      const filters = { ...defaultFilters, showVisibleOnly: true };
      const result = selectors.selectFilteredPins(mockPins, filters);
      expect(result).toHaveLength(3);
      expect(result.every((p) => p.isVisible)).toBe(true);
    });

    it("should combine multiple filters", () => {
      const filters = {
        ...defaultFilters,
        searchTerm: "City",
        layerIds: ["layer1"],
        showVisibleOnly: true,
      };
      const result = selectors.selectFilteredPins(mockPins, filters);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });
  });

  describe("selectPinCountByType", () => {
    it("should count pins by type", () => {
      const result = selectors.selectPinCountByType(mockPins);
      expect(result[PinType.CITY]).toBe(1);
      expect(result[PinType.VILLAGE]).toBe(1);
      expect(result[PinType.DUNGEON]).toBe(1);
      expect(result[PinType.CUSTOM]).toBe(1);
    });
  });

  // ============================================================================
  // Zoom-based Selectors
  // ============================================================================

  describe("selectPinsAtZoom", () => {
    it("should return pins visible at zoom level", () => {
      const result = selectors.selectPinsAtZoom(mockPins, 100);
      // Pin 4 has minZoom: 50, so it should be visible at 100
      expect(result.length).toBeGreaterThan(0);
    });

    it("should exclude pins outside zoom range", () => {
      const result = selectors.selectPinsAtZoom(mockPins, 25);
      // Pin 4 has minZoom: 50, so it should NOT be visible at 25
      expect(result.every((p) => p.id !== "4")).toBe(true);
    });
  });

  // ============================================================================
  // Position-based Selectors
  // ============================================================================

  describe("selectPinsInBounds", () => {
    it("should return pins within bounds", () => {
      const bounds = { minX: 50, minY: 50, maxX: 250, maxY: 250 };
      const result = selectors.selectPinsInBounds(mockPins, bounds);
      expect(result.length).toBe(3); // Pins 1, 2, 3
    });

    it("should return empty array when no pins in bounds", () => {
      const bounds = { minX: 500, minY: 500, maxX: 600, maxY: 600 };
      const result = selectors.selectPinsInBounds(mockPins, bounds);
      expect(result).toEqual([]);
    });
  });

  describe("selectPinsNearPosition", () => {
    it("should return pins near position", () => {
      const result = selectors.selectPinsNearPosition(mockPins, { x: 100, y: 100 }, 60);
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.some((p) => p.id === "1")).toBe(true);
    });

    it("should return empty array when no pins nearby", () => {
      const result = selectors.selectPinsNearPosition(mockPins, { x: 500, y: 500 }, 10);
      expect(result).toEqual([]);
    });
  });

  // ============================================================================
  // Utility Selectors
  // ============================================================================

  describe("selectPinLayerIds", () => {
    it("should return unique layer IDs", () => {
      const result = selectors.selectPinLayerIds(mockPins);
      expect(result).toEqual(expect.arrayContaining(["layer1", "layer2"]));
      expect(result).toHaveLength(2);
    });
  });

  describe("selectPinsSortedByTitle", () => {
    it("should sort pins alphabetically by title", () => {
      const result = selectors.selectPinsSortedByTitle(mockPins);
      expect(result[0].title).toBe("Capital City");
      expect(result[1].title).toBe("Forest of Elves");
      expect(result[2].title).toBe("Hidden Dungeon");
      expect(result[3].title).toBe("Small Village");
    });
  });

  // ============================================================================
  // Composed Selectors
  // ============================================================================

  describe("selectPinsGroupedByLayer", () => {
    it("should group pins by layer", () => {
      const result = selectors.selectPinsGroupedByLayer(mockPins);
      expect(result.get("layer1")).toHaveLength(2);
      expect(result.get("layer2")).toHaveLength(2);
    });
  });

  describe("selectPinsGroupedByType", () => {
    it("should group pins by type", () => {
      const result = selectors.selectPinsGroupedByType(mockPins);
      expect(result.get(PinType.CITY)).toHaveLength(1);
      expect(result.get(PinType.VILLAGE)).toHaveLength(1);
      expect(result.get(PinType.DUNGEON)).toHaveLength(1);
      expect(result.get(PinType.CUSTOM)).toHaveLength(1);
    });
  });

  describe("selectSearchHighlightPositions", () => {
    it("should return highlight positions for matching search", () => {
      const pin = mockPins[0]; // "Capital City"
      const result = selectors.selectSearchHighlightPositions(pin, "Capital");
      expect(result).toEqual({ start: 0, end: 7 });
    });

    it("should return null for non-matching search", () => {
      const pin = mockPins[0];
      const result = selectors.selectSearchHighlightPositions(pin, "Dragon");
      expect(result).toBeNull();
    });

    it("should be case-insensitive", () => {
      const pin = mockPins[0];
      const result = selectors.selectSearchHighlightPositions(pin, "capital");
      expect(result).toEqual({ start: 0, end: 7 });
    });
  });
});
