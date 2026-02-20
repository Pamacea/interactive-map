/**
 * Tests for useAutosave hook
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAutosave } from "./use-autosave";

// Mock toast
const mockToast = vi.fn();
vi.mock("@/shared/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

describe("useAutosave", () => {
  const mockSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockSave.mockResolvedValue(undefined);
    mockToast.mockReset();
  });

  it("starts with idle status", () => {
    const { result } = renderHook(() =>
      useAutosave({ onSave: mockSave, showToasts: false })
    );
    expect(result.current.status).toBe("idle");
    expect(result.current.isPending).toBe(false);
  });

  it("transitions to debouncing then saving", async () => {
    const { result } = renderHook(() =>
      useAutosave({ onSave: mockSave, debounceMs: 50, showToasts: false })
    );

    act(() => {
      result.current.debouncedSave({ test: "data" });
    });

    expect(result.current.status).toBe("debouncing");

    // Wait for debounce + save to complete (transitions through saving to saved)
    await waitFor(
      () => expect(result.current.status).toBe("saved"),
      { timeout: 1000 }
    );
  });

  it("calls save function with data", async () => {
    const { result } = renderHook(() =>
      useAutosave({ onSave: mockSave, debounceMs: 50, showToasts: false })
    );

    act(() => {
      result.current.debouncedSave({ test: "data" });
    });

    await waitFor(
      () => expect(mockSave).toHaveBeenCalledWith({ test: "data" }),
      { timeout: 200 }
    );
  });

  it("cancels pending save on cancel call", async () => {
    const { result } = renderHook(() =>
      useAutosave({ onSave: mockSave, debounceMs: 500, showToasts: false })
    );

    act(() => {
      result.current.debouncedSave({ test: "data" });
    });

    expect(result.current.status).toBe("debouncing");

    act(() => {
      result.current.cancel();
    });

    expect(result.current.status).toBe("idle");
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("transitions to saved status on success", async () => {
    const { result } = renderHook(() =>
      useAutosave({ onSave: mockSave, debounceMs: 50, showToasts: false })
    );

    act(() => {
      result.current.debouncedSave({ test: "data" });
    });

    await waitFor(
      () => expect(result.current.status).toBe("saved"),
      { timeout: 200 }
    );
  });

  it("transitions to error status on failure", async () => {
    const error = new Error("Save failed");
    mockSave.mockRejectedValue(error);

    const { result } = renderHook(() =>
      useAutosave({ onSave: mockSave, debounceMs: 50, showToasts: false })
    );

    act(() => {
      result.current.debouncedSave({ test: "data" });
    });

    await waitFor(
      () => expect(result.current.status).toBe("error"),
      { timeout: 200 }
    );

    expect(result.current.error).toBe(error);
  });

  it("resets to idle after saved status", async () => {
    const { result } = renderHook(() =>
      useAutosave({ onSave: mockSave, debounceMs: 50, showToasts: false })
    );

    act(() => {
      result.current.debouncedSave({ test: "data" });
    });

    await waitFor(
      () => expect(result.current.status).toBe("saved"),
      { timeout: 200 }
    );

    await waitFor(
      () => expect(result.current.status).toBe("idle"),
      { timeout: 2000 }
    );
  });

  it("saves immediately when calling save method", async () => {
    const { result } = renderHook(() =>
      useAutosave({ onSave: mockSave, debounceMs: 500, showToasts: false })
    );

    act(() => {
      result.current.save({ test: "data" });
    });

    // Should immediately be saving, not debouncing
    expect(result.current.status).toBe("saving");
  });
});
