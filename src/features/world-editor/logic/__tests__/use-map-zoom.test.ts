import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useMapZoom } from "../use-map-zoom";

describe("useMapZoom", () => {
  const _mockTransform = { scale: 1, translateX: 0, translateY: 0 };
  const mockSetTransform = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should return zoom handlers", () => {
      const { result } = renderHook(() =>
        useMapZoom(mockTransform, mockSetTransform)
      );

      expect(typeof result.current.handleWheel).toBe("function");
      expect(typeof result.current.handleZoomIn).toBe("function");
      expect(typeof result.current.handleZoomOut).toBe("function");
    });
  });

  describe("handleWheel", () => {
    it("should zoom in when scrolling up (negative delta)", () => {
      const onZoomChange = vi.fn();
      const { result } = renderHook(() =>
        useMapZoom(mockTransform, mockSetTransform, { onZoomChange })
      );

      act(() => {
        result.current.handleWheel({
          preventDefault: vi.fn(),
          deltaY: -100,
        } as unknown as React.WheelEvent);
      });

      expect(mockSetTransform).toHaveBeenCalledWith(expect.any(Function));
      expect(onZoomChange).toHaveBeenCalled();
    });

    it("should zoom out when scrolling down (positive delta)", () => {
      const { result } = renderHook(() =>
        useMapZoom(mockTransform, mockSetTransform)
      );

      act(() => {
        result.current.handleWheel({
          preventDefault: vi.fn(),
          deltaY: 100,
        } as unknown as React.WheelEvent);
      });

      expect(mockSetTransform).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should prevent default behavior", () => {
      const preventDefault = vi.fn();
      const { result } = renderHook(() =>
        useMapZoom(mockTransform, mockSetTransform)
      );

      act(() => {
        result.current.handleWheel({
          preventDefault,
          deltaY: 100,
        } as unknown as React.WheelEvent);
      });

      expect(preventDefault).toHaveBeenCalled();
    });

    it("should respect MIN_ZOOM limit", () => {
      const { result } = renderHook(() =>
        useMapZoom({ scale: 0.1, translateX: 0, translateY: 0 }, mockSetTransform)
      );

      act(() => {
        result.current.handleWheel({
          preventDefault: vi.fn(),
          deltaY: 100,
        } as unknown as React.WheelEvent);
      });

      expect(mockSetTransform).toHaveBeenCalledWith(expect.any(Function));
      const updateFn = mockSetTransform.mock.calls[0][0];
      const resultTransform = updateFn({ scale: 0.1, translateX: 0, translateY: 0 });
      expect(resultTransform.scale).toBeGreaterThanOrEqual(0.1);
    });

    it("should respect MAX_ZOOM limit", () => {
      const { result } = renderHook(() =>
        useMapZoom({ scale: 5.0, translateX: 0, translateY: 0 }, mockSetTransform)
      );

      act(() => {
        result.current.handleWheel({
          preventDefault: vi.fn(),
          deltaY: -100,
        } as unknown as React.WheelEvent);
      });

      expect(mockSetTransform).toHaveBeenCalledWith(expect.any(Function));
      const updateFn = mockSetTransform.mock.calls[0][0];
      const resultTransform = updateFn({ scale: 5.0, translateX: 0, translateY: 0 });
      expect(resultTransform.scale).toBeLessThanOrEqual(5.0);
    });
  });

  describe("handleZoomIn", () => {
    it("should increase scale by ZOOM_BUTTON_FACTOR", () => {
      const { result } = renderHook(() =>
        useMapZoom({ scale: 1, translateX: 0, translateY: 0 }, mockSetTransform)
      );

      act(() => {
        result.current.handleZoomIn();
      });

      expect(mockSetTransform).toHaveBeenCalledWith(expect.any(Function));
      const updateFn = mockSetTransform.mock.calls[0][0];
      const resultTransform = updateFn({ scale: 1, translateX: 0, translateY: 0 });
      expect(resultTransform.scale).toBeCloseTo(1.2, 1); // ZOOM_BUTTON_FACTOR = 1.2
    });

    it("should respect MAX_ZOOM limit", () => {
      const { result } = renderHook(() =>
        useMapZoom({ scale: 5.0, translateX: 0, translateY: 0 }, mockSetTransform)
      );

      act(() => {
        result.current.handleZoomIn();
      });

      expect(mockSetTransform).toHaveBeenCalledWith(expect.any(Function));
      const updateFn = mockSetTransform.mock.calls[0][0];
      const resultTransform = updateFn({ scale: 5.0, translateX: 0, translateY: 0 });
      expect(resultTransform.scale).toBeLessThanOrEqual(5.0);
    });

    it("should work from minimum zoom", () => {
      const { result } = renderHook(() =>
        useMapZoom({ scale: 0.1, translateX: 0, translateY: 0 }, mockSetTransform)
      );

      act(() => {
        result.current.handleZoomIn();
      });

      const updateFn = mockSetTransform.mock.calls[0][0];
      const resultTransform = updateFn({ scale: 0.1, translateX: 0, translateY: 0 });
      expect(resultTransform.scale).toBeGreaterThan(0.1);
    });
  });

  describe("handleZoomOut", () => {
    it("should decrease scale by ZOOM_BUTTON_FACTOR", () => {
      const { result } = renderHook(() =>
        useMapZoom({ scale: 1.2, translateX: 0, translateY: 0 }, mockSetTransform)
      );

      act(() => {
        result.current.handleZoomOut();
      });

      expect(mockSetTransform).toHaveBeenCalledWith(expect.any(Function));
      const updateFn = mockSetTransform.mock.calls[0][0];
      const resultTransform = updateFn({ scale: 1.2, translateX: 0, translateY: 0 });
      expect(resultTransform.scale).toBeCloseTo(1.0, 1); // 1.2 / 1.2 = 1.0
    });

    it("should respect MIN_ZOOM limit", () => {
      const { result } = renderHook(() =>
        useMapZoom({ scale: 0.1, translateX: 0, translateY: 0 }, mockSetTransform)
      );

      act(() => {
        result.current.handleZoomOut();
      });

      expect(mockSetTransform).toHaveBeenCalledWith(expect.any(Function));
      const updateFn = mockSetTransform.mock.calls[0][0];
      const resultTransform = updateFn({ scale: 0.1, translateX: 0, translateY: 0 });
      expect(resultTransform.scale).toBeGreaterThanOrEqual(0.1);
    });

    it("should work from maximum zoom", () => {
      const { result } = renderHook(() =>
        useMapZoom({ scale: 5.0, translateX: 0, translateY: 0 }, mockSetTransform)
      );

      act(() => {
        result.current.handleZoomOut();
      });

      const updateFn = mockSetTransform.mock.calls[0][0];
      const resultTransform = updateFn({ scale: 5.0, translateX: 0, translateY: 0 });
      expect(resultTransform.scale).toBeLessThan(5.0);
    });
  });

  describe("onZoomChange callback", () => {
    it("should call onZoomChange with new scale after wheel zoom", () => {
      const onZoomChange = vi.fn();
      const { result } = renderHook(() =>
        useMapZoom({ scale: 1, translateX: 0, translateY: 0 }, mockSetTransform, {
          onZoomChange,
        })
      );

      act(() => {
        result.current.handleWheel({
          preventDefault: vi.fn(),
          deltaY: -100,
        } as unknown as React.WheelEvent);
      });

      expect(onZoomChange).toHaveBeenCalled();
    });

    it("should not call onZoomChange for button zoom operations", () => {
      const onZoomChange = vi.fn();
      const { result } = renderHook(() =>
        useMapZoom({ scale: 1, translateX: 0, translateY: 0 }, mockSetTransform, {
          onZoomChange,
        })
      );

      act(() => {
        result.current.handleZoomIn();
      });

      expect(onZoomChange).not.toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should handle rapid zoom operations", () => {
      const { result } = renderHook(() =>
        useMapZoom({ scale: 1, translateX: 0, translateY: 0 }, mockSetTransform)
      );

      act(() => {
        result.current.handleZoomIn();
        result.current.handleZoomIn();
        result.current.handleZoomOut();
      });

      expect(mockSetTransform).toHaveBeenCalledTimes(3);
    });

    it("should preserve translateX and translateY when zooming", () => {
      const _transform = { scale: 1, translateX: 100, translateY: 200 };
      const { result } = renderHook(() =>
        useMapZoom(transform, mockSetTransform)
      );

      act(() => {
        result.current.handleZoomIn();
      });

      const updateFn = mockSetTransform.mock.calls[0][0];
      const resultTransform = updateFn(transform);
      expect(resultTransform.translateX).toBe(100);
      expect(resultTransform.translateY).toBe(200);
    });
  });

  describe("zoom constants", () => {
    it("should use correct MIN_ZOOM (0.1)", () => {
      const { result } = renderHook(() =>
        useMapZoom({ scale: 0.1, translateX: 0, translateY: 0 }, mockSetTransform)
      );

      act(() => {
        result.current.handleZoomOut();
      });

      const updateFn = mockSetTransform.mock.calls[0][0];
      const resultTransform = updateFn({ scale: 0.1, translateX: 0, translateY: 0 });
      expect(resultTransform.scale).toBe(0.1);
    });

    it("should use correct MAX_ZOOM (5.0)", () => {
      const { result } = renderHook(() =>
        useMapZoom({ scale: 5.0, translateX: 0, translateY: 0 }, mockSetTransform)
      );

      act(() => {
        result.current.handleZoomIn();
      });

      const updateFn = mockSetTransform.mock.calls[0][0];
      const resultTransform = updateFn({ scale: 5.0, translateX: 0, translateY: 0 });
      expect(resultTransform.scale).toBe(5.0);
    });
  });
});
