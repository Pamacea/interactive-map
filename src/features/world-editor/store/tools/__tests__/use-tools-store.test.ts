/**
 * Tools Store Tests
 *
 * Tests for the tools state management store
 */

import { renderHook, act } from "@testing-library/react";
import { useToolsStore } from "../use-tools-store";

describe("useToolsStore", () => {
  beforeEach(() => {
    // Reset store before each test
    const { reset } = useToolsStore.getState();
    reset();
  });

  describe("Mode Management", () => {
    it("should have initial mode as 'select'", () => {
      const { result } = renderHook(() => useToolsStore());
      expect(result.current.mode).toBe("select");
    });

    it("should change mode", () => {
      const { result } = renderHook(() => useToolsStore());

      act(() => {
        result.current.setMode("measure");
      });

      expect(result.current.mode).toBe("measure");
    });

    it("should clear measure state when switching from measure", () => {
      const { result } = renderHook(() => useToolsStore());

      act(() => {
        // First change to measure mode
        result.current.setMode("measure");
        result.current.startMeasure();
        result.current.addMeasurePoint({ x: 0, y: 0, lat: 0, lng: 0 });
        result.current.addMeasurePoint({ x: 100, y: 100, lat: 0.1, lng: 0.1 });
        // Then switch back to select
        result.current.setMode("select");
      });

      expect(result.current.mode).toBe("select");
      expect(result.current.measurePoints).toEqual([]);
      expect(result.current.isMeasuring).toBe(false);
    });

    it("should clear selection state when switching from area", () => {
      const { result } = renderHook(() => useToolsStore());

      act(() => {
        // First change to area mode
        result.current.setMode("area");
        result.current.startSelection(0, 0);
        // Then switch back to select
        result.current.setMode("select");
      });

      expect(result.current.selectionRect).toBeNull();
      expect(result.current.isSelecting).toBe(false);
    });
  });

  describe("Measure Tool", () => {
    it("should start measuring", () => {
      const { result } = renderHook(() => useToolsStore());

      act(() => {
        result.current.startMeasure();
      });

      expect(result.current.isMeasuring).toBe(true);
      expect(result.current.measurePoints).toEqual([]);
    });

    it("should add measure points", () => {
      const { result } = renderHook(() => useToolsStore());

      act(() => {
        result.current.startMeasure();
        result.current.addMeasurePoint({ x: 0, y: 0, lat: 0, lng: 0 });
        result.current.addMeasurePoint({ x: 100, y: 100, lat: 0.1, lng: 0.1 });
      });

      expect(result.current.measurePoints).toHaveLength(2);
      expect(result.current.measurePoints[0]).toEqual({ x: 0, y: 0, lat: 0, lng: 0 });
      expect(result.current.measurePoints[1]).toEqual({ x: 100, y: 100, lat: 0.1, lng: 0.1 });
    });

    it("should remove last measure point", () => {
      const { result } = renderHook(() => useToolsStore());

      act(() => {
        result.current.startMeasure();
        result.current.addMeasurePoint({ x: 0, y: 0, lat: 0, lng: 0 });
        result.current.addMeasurePoint({ x: 100, y: 100, lat: 0.1, lng: 0.1 });
        result.current.addMeasurePoint({ x: 200, y: 200, lat: 0.2, lng: 0.2 });
        result.current.removeLastMeasurePoint();
      });

      expect(result.current.measurePoints).toHaveLength(2);
    });

    it("should clear measure", () => {
      const { result } = renderHook(() => useToolsStore());

      act(() => {
        result.current.startMeasure();
        result.current.addMeasurePoint({ x: 0, y: 0, lat: 0, lng: 0 });
        result.current.clearMeasure();
      });

      expect(result.current.measurePoints).toEqual([]);
      expect(result.current.isMeasuring).toBe(false);
    });

    it("should finish measuring", () => {
      const { result } = renderHook(() => useToolsStore());

      act(() => {
        result.current.startMeasure();
        result.current.addMeasurePoint({ x: 0, y: 0, lat: 0, lng: 0 });
        result.current.finishMeasure();
      });

      expect(result.current.isMeasuring).toBe(false);
      expect(result.current.measurePoints).toHaveLength(1); // Points preserved
    });
  });

  describe("Area/Selection Tool", () => {
    it("should start selection", () => {
      const { result } = renderHook(() => useToolsStore());

      act(() => {
        result.current.startSelection(100, 100);
      });

      expect(result.current.isSelecting).toBe(true);
      expect(result.current.selectionRect).toMatchObject({
        startX: 100,
        startY: 100,
        endX: 100,
        endY: 100,
      });
    });

    it("should update selection", () => {
      const { result } = renderHook(() => useToolsStore());

      act(() => {
        result.current.startSelection(100, 100);
        result.current.updateSelection(200, 200);
      });

      expect(result.current.selectionRect).toMatchObject({
        startX: 100,
        startY: 100,
        endX: 200,
        endY: 200,
      });
    });

    it("should end selection", () => {
      const { result } = renderHook(() => useToolsStore());

      act(() => {
        result.current.startSelection(100, 100);
        result.current.updateSelection(200, 200);
        result.current.endSelection();
      });

      expect(result.current.isSelecting).toBe(false);
      expect(result.current.selectionRect).not.toBeNull(); // Rect preserved
    });

    it("should clear selection", () => {
      const { result } = renderHook(() => useToolsStore());

      act(() => {
        result.current.startSelection(100, 100);
        result.current.clearSelection();
      });

      expect(result.current.selectionRect).toBeNull();
      expect(result.current.isSelecting).toBe(false);
      expect(result.current.selectedPinIds).toEqual([]);
    });

    it("should toggle pin selection", () => {
      const { result } = renderHook(() => useToolsStore());

      act(() => {
        result.current.togglePinSelection("pin-1");
      });

      expect(result.current.selectedPinIds).toEqual(["pin-1"]);

      act(() => {
        result.current.togglePinSelection("pin-1");
      });

      expect(result.current.selectedPinIds).toEqual([]);
    });

    it("should set multiple pin selection", () => {
      const { result } = renderHook(() => useToolsStore());

      act(() => {
        result.current.setMultiplePinSelection(["pin-1", "pin-2", "pin-3"]);
      });

      expect(result.current.selectedPinIds).toEqual(["pin-1", "pin-2", "pin-3"]);
    });
  });

  describe("Temporary Mode", () => {
    it("should set temporary mode and preserve previous", () => {
      const { result } = renderHook(() => useToolsStore());

      act(() => {
        result.current.setMode("select");
        result.current.setTemporaryMode("pan");
      });

      expect(result.current.mode).toBe("pan");
      expect(result.current.previousMode).toBe("select");
    });

    it("should restore previous mode", () => {
      const { result } = renderHook(() => useToolsStore());

      act(() => {
        result.current.setMode("select");
        result.current.setTemporaryMode("pan");
        result.current.restorePreviousMode();
      });

      expect(result.current.mode).toBe("select");
      expect(result.current.previousMode).toBeNull();
    });
  });

  describe("Reset", () => {
    it("should reset to initial state", () => {
      const { result } = renderHook(() => useToolsStore());

      act(() => {
        result.current.setMode("measure");
        result.current.startMeasure();
        result.current.addMeasurePoint({ x: 0, y: 0, lat: 0, lng: 0 });
        result.current.startSelection(100, 100);
        result.current.togglePinSelection("pin-1");
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.mode).toBe("select");
      expect(result.current.measurePoints).toEqual([]);
      expect(result.current.isMeasuring).toBe(false);
      expect(result.current.selectionRect).toBeNull();
      expect(result.current.isSelecting).toBe(false);
      expect(result.current.selectedPinIds).toEqual([]);
      expect(result.current.previousMode).toBeNull();
    });
  });
});

/**
 * Utility hooks tests
 */
import { useMeasureTotalDistance, useMeasureSegments } from "../use-tools-store";

describe("useMeasureTotalDistance", () => {
  beforeEach(() => {
    useToolsStore.getState().reset();
  });

  it("should return zero distance when no points", () => {
    const { result } = renderHook(() => useMeasureTotalDistance());
    expect(result.current.pixels).toBe(0);
    expect(result.current.world).toBe(0);
  });

  it("should return zero distance when one point", () => {
    const { result } = renderHook(() => useMeasureTotalDistance());
    const store = useToolsStore.getState();

    act(() => {
      store.addMeasurePoint({ x: 0, y: 0, lat: 0, lng: 0 });
    });

    expect(result.current.pixels).toBe(0);
    expect(result.current.world).toBe(0);
  });

  it("should calculate distance for two points", () => {
    const { result } = renderHook(() => useMeasureTotalDistance());
    const store = useToolsStore.getState();

    act(() => {
      // Use different lng values to create distance (hook uses lng/lat for calculation)
      store.addMeasurePoint({ x: 0, y: 0, lat: 0, lng: 0 });
      store.addMeasurePoint({ x: 100, y: 0, lat: 0, lng: 0.1 });
    });

    // Distance = sqrt(0.1^2 + 0^2) = 0.1 normalized
    // Pixel distance = 0.1 * 1000 = 100 pixels
    // World distance = 100 / 100 = 1 unit
    expect(result.current.pixels).toBe(100);
    expect(result.current.world).toBe(1);
  });

  it("should calculate distance for multiple points", () => {
    const { result } = renderHook(() => useMeasureTotalDistance());
    const store = useToolsStore.getState();

    act(() => {
      // Use different lng/lat values to create distance
      store.addMeasurePoint({ x: 0, y: 0, lat: 0, lng: 0 });
      store.addMeasurePoint({ x: 100, y: 0, lat: 0, lng: 0.1 });
      store.addMeasurePoint({ x: 100, y: 100, lat: 0.1, lng: 0.1 });
    });

    // Distance = 0.1 + 0.1 = 0.2 normalized
    // Pixel distance = 0.2 * 1000 = 200 pixels
    // World distance = 200 / 100 = 2 units
    expect(result.current.pixels).toBe(200);
    expect(result.current.world).toBe(2);
  });
});

describe("useMeasureSegments", () => {
  beforeEach(() => {
    useToolsStore.getState().reset();
  });

  it("should return empty array when no points", () => {
    const { result } = renderHook(() => useMeasureSegments());
    expect(result.current).toEqual([]);
  });

  it("should return one segment for two points", () => {
    const { result } = renderHook(() => useMeasureSegments());
    const store = useToolsStore.getState();

    act(() => {
      // Use different lng values to create distance (hook uses lng/lat for calculation)
      store.addMeasurePoint({ x: 0, y: 0, lat: 0, lng: 0 });
      store.addMeasurePoint({ x: 100, y: 0, lat: 0, lng: 0.1 });
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].pixelDistance).toBe(100);
    expect(result.current[0].worldDistance).toBe(1);
  });

  it("should return multiple segments for multiple points", () => {
    const { result } = renderHook(() => useMeasureSegments());
    const store = useToolsStore.getState();

    act(() => {
      // Use different lng/lat values to create distance
      store.addMeasurePoint({ x: 0, y: 0, lat: 0, lng: 0 });
      store.addMeasurePoint({ x: 100, y: 0, lat: 0, lng: 0.1 });
      store.addMeasurePoint({ x: 100, y: 100, lat: 0.1, lng: 0.1 });
    });

    expect(result.current).toHaveLength(2);
    expect(result.current[0].pixelDistance).toBe(100);
    expect(result.current[1].pixelDistance).toBe(100);
  });
});
