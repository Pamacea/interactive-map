/**
 * Tests for shared property validation schemas
 */

import { describe, it, expect } from "vitest";
import {
  TitleSchema,
  SlugSchema,
  HexColorSchema,
  CoordinatesSchema,
  SizeSchema,
  OpacitySchema,
  ZoomLevelSchema,
  UrlSchema,
} from "../property-schemas";

describe("Property Validation Schemas", () => {
  describe("TitleSchema", () => {
    it("accepts valid titles", () => {
      expect(() => TitleSchema.parse("Valid Title")).not.toThrow();
      expect(() => TitleSchema.parse("A")).not.toThrow();
    });

    it("rejects empty titles", () => {
      expect(() => TitleSchema.parse("")).toThrow();
    });

    it("rejects titles over 200 characters", () => {
      const longTitle = "a".repeat(201);
      expect(() => TitleSchema.parse(longTitle)).toThrow();
    });
  });

  describe("SlugSchema", () => {
    it("accepts valid slugs", () => {
      expect(() => SlugSchema.parse("valid-slug")).not.toThrow();
      expect(() => SlugSchema.parse("test123")).not.toThrow();
      expect(() => SlugSchema.parse("my-slug-123")).not.toThrow();
    });

    it("rejects invalid slugs", () => {
      expect(() => SlugSchema.parse("Invalid Slug")).toThrow();
      expect(() => SlugSchema.parse("slug_with_underscore")).toThrow();
      expect(() => SlugSchema.parse("slug.with.dots")).toThrow();
    });
  });

  describe("HexColorSchema", () => {
    it("accepts valid hex colors", () => {
      expect(() => HexColorSchema.parse("#ffffff")).not.toThrow();
      expect(() => HexColorSchema.parse("#000000")).not.toThrow();
      expect(() => HexColorSchema.parse("#c9a227")).not.toThrow();
    });

    it("rejects invalid hex colors", () => {
      expect(() => HexColorSchema.parse("ffffff")).toThrow();
      expect(() => HexColorSchema.parse("#fff")).toThrow();
      expect(() => HexColorSchema.parse("#gggggg")).toThrow();
    });
  });

  describe("CoordinatesSchema", () => {
    it("accepts valid coordinates", () => {
      expect(() =>
        CoordinatesSchema.parse({ latitude: 45.5, longitude: -73.6 })
      ).not.toThrow();
      expect(() =>
        CoordinatesSchema.parse({ latitude: 0, longitude: 0 })
      ).not.toThrow();
    });

    it("rejects invalid latitude", () => {
      expect(() =>
        CoordinatesSchema.parse({ latitude: 91, longitude: 0 })
      ).toThrow();
      expect(() =>
        CoordinatesSchema.parse({ latitude: -91, longitude: 0 })
      ).toThrow();
    });

    it("rejects invalid longitude", () => {
      expect(() =>
        CoordinatesSchema.parse({ latitude: 0, longitude: 181 })
      ).toThrow();
      expect(() =>
        CoordinatesSchema.parse({ latitude: 0, longitude: -181 })
      ).toThrow();
    });
  });

  describe("SizeSchema", () => {
    it("accepts valid sizes", () => {
      expect(() => SizeSchema.parse(16)).not.toThrow();
      expect(() => SizeSchema.parse(32)).not.toThrow();
      expect(() => SizeSchema.parse(128)).not.toThrow();
    });

    it("rejects sizes outside range", () => {
      expect(() => SizeSchema.parse(15)).toThrow();
      expect(() => SizeSchema.parse(129)).toThrow();
    });

    it("rejects non-integer sizes", () => {
      expect(() => SizeSchema.parse(32.5)).toThrow();
    });
  });

  describe("OpacitySchema", () => {
    it("accepts valid opacity values", () => {
      expect(() => OpacitySchema.parse(0)).not.toThrow();
      expect(() => OpacitySchema.parse(0.5)).not.toThrow();
      expect(() => OpacitySchema.parse(1)).not.toThrow();
    });

    it("rejects invalid opacity values", () => {
      expect(() => OpacitySchema.parse(-0.1)).toThrow();
      expect(() => OpacitySchema.parse(1.1)).toThrow();
    });
  });

  describe("ZoomLevelSchema", () => {
    it("accepts valid zoom levels", () => {
      expect(() => ZoomLevelSchema.parse(0)).not.toThrow();
      expect(() => ZoomLevelSchema.parse(100)).not.toThrow();
      expect(() => ZoomLevelSchema.parse(200)).not.toThrow();
    });

    it("rejects invalid zoom levels", () => {
      expect(() => ZoomLevelSchema.parse(-1)).toThrow();
      expect(() => ZoomLevelSchema.parse(201)).toThrow();
    });

    it("rejects non-integer zoom levels", () => {
      expect(() => ZoomLevelSchema.parse(100.5)).toThrow();
    });
  });

  describe("UrlSchema", () => {
    it("accepts valid URLs", () => {
      expect(() => UrlSchema.parse("https://example.com")).not.toThrow();
      expect(() => UrlSchema.parse("http://test.org")).not.toThrow();
    });

    it("rejects invalid URLs", () => {
      expect(() => UrlSchema.parse("not-a-url")).toThrow();
      expect(() => UrlSchema.parse("example")).toThrow();
    });
  });
});
