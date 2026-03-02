/**
 * Tests for Pin Validation Schemas
 */

import { describe, it, expect } from "vitest";
import { CreatePinSchema, UpdatePinSchema } from "../pin-schemas";

describe("Pin Schemas", () => {
  describe("CreatePinSchema", () => {
    it("should accept minimal required data (what use-tools-manager passes)", () => {
      const minimalData = {
        gameWorldId: "cm4abc123def456",
        title: "New Pin",
        pinType: "POI",
        latitude: 0.5,
        longitude: 0.5,
        layerId: undefined,
        isVisible: true,
      };

      const result = CreatePinSchema.parse(minimalData);

      expect(result).toBeDefined();
      expect(result.title).toBe("New Pin");
      expect(result.pinType).toBe("POI");
      expect(result.latitude).toBe(0.5);
      expect(result.longitude).toBe(0.5);
      expect(result.color).toBe("#3b82f6"); // Default should be applied
      expect(result.size).toBe(32); // Default should be applied
      expect(result.opacity).toBe(1.0); // Default should be applied
      expect(result.minZoom).toBe(0); // Default should be applied
      expect(result.maxZoom).toBe(200); // Default should be applied
    });

    it("should accept data with all optional fields provided", () => {
      const fullData = {
        gameWorldId: "cm4abc123def456",
        title: "Full Pin",
        pinType: "CITY",
        latitude: 0.3,
        longitude: 0.7,
        description: "A detailed description",
        icon: "castle",
        color: "#ff0000",
        size: 48,
        opacity: 0.8,
        minZoom: 5,
        maxZoom: 150,
        isVisible: false,
        layerId: "cm4layer123def456",
      };

      const result = CreatePinSchema.parse(fullData);

      expect(result).toBeDefined();
      expect(result.color).toBe("#ff0000");
      expect(result.size).toBe(48);
      expect(result.opacity).toBe(0.8);
      expect(result.minZoom).toBe(5);
      expect(result.maxZoom).toBe(150);
    });

    it("should reject invalid hex color", () => {
      const invalidData = {
        gameWorldId: "cm4abc123def456",
        title: "Invalid Pin",
        pinType: "POI",
        latitude: 0.5,
        longitude: 0.5,
        color: "invalid-color",
      };

      expect(() => CreatePinSchema.parse(invalidData)).toThrow();
    });

    it("should reject coordinates outside 0-1 range", () => {
      const invalidData = {
        gameWorldId: "cm4abc123def456",
        title: "Invalid Pin",
        pinType: "POI",
        latitude: 50, // Should be 0-1
        longitude: 0.5,
      };

      expect(() => CreatePinSchema.parse(invalidData)).toThrow();
    });

    it("should reject minZoom >= maxZoom", () => {
      const invalidData = {
        gameWorldId: "cm4abc123def456",
        title: "Invalid Pin",
        pinType: "POI",
        latitude: 0.5,
        longitude: 0.5,
        minZoom: 100,
        maxZoom: 50,
      };

      expect(() => CreatePinSchema.parse(invalidData)).toThrow();
    });

    it("should accept valid pin types", () => {
      const validTypes = ["CITY", "VILLAGE", "POI", "CHARACTER", "DUNGEON", "SHOP", "QUEST", "TREASURE", "CUSTOM"];

      validTypes.forEach((pinType) => {
        const data = {
          gameWorldId: "cm4abc123def456",
          title: `Test ${pinType}`,
          pinType,
          latitude: 0.5,
          longitude: 0.5,
        };

        expect(() => CreatePinSchema.parse(data)).not.toThrow();
      });
    });
  });

  describe("UpdatePinSchema", () => {
    it("should accept partial updates", () => {
      const partialUpdate = {
        id: "cm4pin123def456",
        title: "Updated Title",
      };

      const result = UpdatePinSchema.parse(partialUpdate);

      expect(result).toBeDefined();
      expect(result.title).toBe("Updated Title");
    });

    it("should reject invalid coordinates in update", () => {
      const invalidUpdate = {
        id: "cm4pin123def456",
        latitude: 50, // Should be 0-1
      };

      expect(() => UpdatePinSchema.parse(invalidUpdate)).toThrow();
    });
  });
});
