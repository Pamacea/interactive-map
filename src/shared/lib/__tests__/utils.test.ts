import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn (utility function)", () => {
  it("should merge class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("should handle undefined and null values", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
  });

  it("should handle empty strings", () => {
    expect(cn("foo", "", "bar")).toBe("foo bar");
  });

  it("should handle arrays", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("should handle objects with boolean values", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  it("should handle mixed inputs", () => {
    expect(cn("foo", { bar: true, baz: false }, ["qux"])).toBe("foo bar qux");
  });

  it("should handle Tailwind conflict resolution with twMerge", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("should handle multiple conflicting classes", () => {
    expect(cn("text-red-500 text-blue-500")).toBe("text-blue-500");
  });

  it("should return empty string for no inputs", () => {
    expect(cn()).toBe("");
  });

  it("should return empty string for all falsy values", () => {
    expect(cn(false, null, undefined, "")).toBe("");
  });
});
