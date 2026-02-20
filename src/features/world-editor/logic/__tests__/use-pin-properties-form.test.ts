import { renderHook, act, waitFor } from "@testing-library/react";
import { usePinPropertiesForm } from "../use-pin-properties-form";

describe("usePinPropertiesForm", () => {
  it("should initialize with provided form state", () => {
    const formState = {
      title: "Test Pin",
      description: "Test Description",
      pinType: "CITY" as const,
      icon: null,
      size: 32,
      color: "#3b82f6",
      opacity: 1,
      isVisible: true,
      minZoom: 0,
      maxZoom: 200,
    };

    const { result } = renderHook(() =>
      usePinPropertiesForm({ formState })
    );

    expect(result.current.localTitle).toBe("Test Pin");
    expect(result.current.localDescription).toBe("Test Description");
  });

  it("should update local state when user types", () => {
    const formState = {
      title: "Initial Title",
      description: "Initial Description",
      pinType: "CITY" as const,
      icon: null,
      size: 32,
      color: "#3b82f6",
      opacity: 1,
      isVisible: true,
      minZoom: 0,
      maxZoom: 200,
    };

    const { result } = renderHook(() =>
      usePinPropertiesForm({ formState })
    );

    act(() => {
      result.current.handleTitleUpdate("Updated Title");
      result.current.handleDescriptionUpdate("Updated Description");
    });

    expect(result.current.localTitle).toBe("Updated Title");
    expect(result.current.localDescription).toBe("Updated Description");
  });

  it("should sync local state when formState changes externally", async () => {
    const initialFormState = {
      title: "Initial Title",
      description: "Initial Description",
      pinType: "CITY" as const,
      icon: null,
      size: 32,
      color: "#3b82f6",
      opacity: 1,
      isVisible: true,
      minZoom: 0,
      maxZoom: 200,
    };

    const { result, rerender } = renderHook(
      ({ formState }) => usePinPropertiesForm({ formState }),
      {
        initialProps: { formState: initialFormState },
      }
    );

    expect(result.current.localTitle).toBe("Initial Title");

    // Simulate external update (e.g., from popup)
    const updatedFormState = {
      ...initialFormState,
      title: "External Update",
    };

    rerender({ formState: updatedFormState });

    // Wait for setTimeout to complete
    await waitFor(() => {
      expect(result.current.localTitle).toBe("External Update");
    });
  });

  it("should reset zoom to default values", () => {
    const formState = {
      title: "Test",
      description: "Test",
      pinType: "CITY" as const,
      icon: null,
      size: 32,
      color: "#3b82f6",
      opacity: 1,
      isVisible: true,
      minZoom: 10,
      maxZoom: 150,
    };

    const { result } = renderHook(() =>
      usePinPropertiesForm({ formState })
    );

    const resetValues = result.current.resetZoom();

    expect(resetValues).toEqual({ minZoom: 0, maxZoom: 200 });
  });
});
