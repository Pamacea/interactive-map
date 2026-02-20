import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateExportFilename } from "../filename-utils";

describe("generateExportFilename", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-02-17T10:30:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should generate filename with PNG extension", () => {
    const _result = generateExportFilename("My World", "png");
    expect(result).toBe("my-world-2025-02-17.png");
  });

  it("should generate filename with PDF extension", () => {
    const _result = generateExportFilename("My World", "pdf");
    expect(result).toBe("my-world-2025-02-17.pdf");
  });

  it("should generate filename with JSON extension", () => {
    const _result = generateExportFilename("My World", "json");
    expect(result).toBe("my-world-2025-02-17.json");
  });

  it("should convert title to lowercase", () => {
    const _result = generateExportFilename("MY WORLD TITLE", "png");
    expect(result).toBe("my-world-title-2025-02-17.png");
  });

  it("should replace spaces with hyphens", () => {
    const _result = generateExportFilename("My Great World", "pdf");
    expect(result).toBe("my-great-world-2025-02-17.pdf");
  });

  it("should remove special characters", () => {
    const _result = generateExportFilename("My@World#With$Special%Chars!", "png");
    expect(result).toBe("myworldwithspecialchars-2025-02-17.png");
  });

  it("should collapse multiple hyphens into one", () => {
    const _result = generateExportFilename("My---World", "pdf");
    expect(result).toBe("my-world-2025-02-17.pdf");
  });

  it("should trim leading/trailing hyphens", () => {
    const _result = generateExportFilename("---My World---", "json");
    expect(result).toBe("my-world-2025-02-17.json");
  });

  it("should handle empty title", () => {
    const _result = generateExportFilename("", "png");
    expect(result).toBe("-2025-02-17.png");
  });

  it("should handle title with only special characters", () => {
    const _result = generateExportFilename("@#$%", "pdf");
    expect(result).toBe("-2025-02-17.pdf");
  });

  it("should handle title with numbers", () => {
    const _result = generateExportFilename("World 123", "json");
    expect(result).toBe("world-123-2025-02-17.json");
  });

  it("should handle title with mixed case and special chars", () => {
    const _result = generateExportFilename("The Kingdom of El-Doria 2025", "png");
    expect(result).toBe("the-kingdom-of-el-doria-2025-2025-02-17.png");
  });

  it("should handle single word title", () => {
    const _result = generateExportFilename("Middleearth", "pdf");
    expect(result).toBe("middleearth-2025-02-17.pdf");
  });

  it("should handle title with existing hyphens", () => {
    const _result = generateExportFilename("My-World-Map", "json");
    expect(result).toBe("my-world-map-2025-02-17.json");
  });

  it("should handle unicode letters", () => {
    const _result = generateExportFilename("Café World", "png");
    expect(result).toBe("caf-world-2025-02-17.png");
  });
});
