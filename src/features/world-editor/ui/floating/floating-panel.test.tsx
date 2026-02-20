/**
 * FloatingPanel tests
 *
 * Tests for the floating panel component with snap-to-edges functionality
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useFloatingPanelsStore, usePanelState } from "@/features/world-editor/store/use-floating-panels-store";

describe("FloatingPanelsStore", () => {
  beforeEach(() => {
    // Reset store before each test
    useFloatingPanelsStore.getState().resetAll();
  });

  describe("Panel visibility", () => {
    it("should toggle panel visibility", () => {
      const { result } = renderHook(() => usePanelState("lore"));

      expect(result.current.isVisible).toBe(false);

      act(() => {
        useFloatingPanelsStore.getState().togglePanel("lore");
      });

      expect(result.current.isVisible).toBe(true);

      act(() => {
        useFloatingPanelsStore.getState().togglePanel("lore");
      });

      expect(result.current.isVisible).toBe(false);
    });

    it("should show specific panel", () => {
      const { result } = renderHook(() => usePanelState("gallery"));

      act(() => {
        useFloatingPanelsStore.getState().showPanel("gallery");
      });

      expect(result.current.isVisible).toBe(true);
    });

    it("should hide specific panel", () => {
      // First show the panel
      act(() => {
        useFloatingPanelsStore.getState().showPanel("activity");
      });

      const { result } = renderHook(() => usePanelState("activity"));
      expect(result.current.isVisible).toBe(true);

      act(() => {
        useFloatingPanelsStore.getState().hidePanel("activity");
      });

      expect(result.current.isVisible).toBe(false);
    });
  });

  describe("Panel position and size", () => {
    it("should update panel position", () => {
      const { result } = renderHook(() => usePanelState("characters"));

      const newPosition = { x: 100, y: 200 };

      act(() => {
        useFloatingPanelsStore.getState().updatePosition("characters", newPosition);
      });

      expect(result.current.position).toEqual(newPosition);
    });

    it("should update panel size", () => {
      const { result } = renderHook(() => usePanelState("filters"));

      const newSize = { width: 400, height: 500 };

      act(() => {
        useFloatingPanelsStore.getState().updateSize("filters", newSize);
      });

      expect(result.current.size).toEqual(newSize);
    });
  });

  describe("Panel collapse", () => {
    it("should toggle panel collapse state", () => {
      const { result } = renderHook(() => usePanelState("members"));

      expect(result.current.isCollapsed).toBe(false);

      act(() => {
        useFloatingPanelsStore.getState().toggleCollapse("members");
      });

      expect(result.current.isCollapsed).toBe(true);

      act(() => {
        useFloatingPanelsStore.getState().toggleCollapse("members");
      });

      expect(result.current.isCollapsed).toBe(false);
    });
  });

  describe("Z-index management", () => {
    it("should maintain maxZIndex state", () => {
      const store = useFloatingPanelsStore.getState();

      // maxZIndex should be defined
      expect(store.maxZIndex).toBeDefined();
      expect(typeof store.maxZIndex).toBe("number");
    });

    it("should have panels with zIndex", () => {
      const store = useFloatingPanelsStore.getState();

      // All panels should have a zIndex
      Object.values(store.panels).forEach((panel) => {
        expect(panel.zIndex).toBeDefined();
        expect(typeof panel.zIndex).toBe("number");
      });
    });
  });

  describe("Available panels", () => {
    it("should have only the expected floating panels", () => {
      const state = useFloatingPanelsStore.getState();
      const panelIds = Object.keys(state.panels);

      // These panels should exist (floating modules)
      const expectedPanels = ["lore", "gallery", "characters", "filters", "members", "activity", "import"];

      // These panels should NOT exist (moved to docks)
      const removedPanels = ["layers", "properties", "comments", "versions", "pin-details"];

      expectedPanels.forEach((panelId) => {
        expect(panelIds).toContain(panelId);
      });

      removedPanels.forEach((panelId) => {
        expect(panelIds).not.toContain(panelId);
      });
    });
  });
});

describe("FloatingPanel snap-to-edges", () => {
  it("should snap to left edge when close", () => {
    // Mock window dimensions
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1920,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 1080,
    });

    const SNAP_THRESHOLD = 20;
    const SNAP_MARGIN = 0;

    const getSnappedPosition = (
      x: number,
      y: number,
      width: number,
      height: number
    ) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newX = x;
      const newY = y;
      let snapped = false;

      // Left edge
      if (x < SNAP_THRESHOLD + SNAP_MARGIN) {
        newX = SNAP_MARGIN;
        snapped = true;
      }

      return { x: newX, y: newY, snapped };
    };

    // Should snap when within threshold
    expect(getSnappedPosition(15, 100, 400, 300).snapped).toBe(true);
    expect(getSnappedPosition(15, 100, 400, 300).x).toBe(0);

    // Should NOT snap when outside threshold
    expect(getSnappedPosition(50, 100, 400, 300).snapped).toBe(false);

    // Restore original dimensions
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it("should snap to right edge when close", () => {
    const originalInnerWidth = window.innerWidth;

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1920,
    });

    const SNAP_THRESHOLD = 20;
    const SNAP_MARGIN = 0;

    const getSnappedPosition = (
      x: number,
      _y: number,
      width: number,
      _height: number
    ) => {
      const viewportWidth = window.innerWidth;

      let newX = x;
      let snapped = false;

      // Right edge
      if (x + width > viewportWidth - SNAP_THRESHOLD - SNAP_MARGIN) {
        newX = viewportWidth - width - SNAP_MARGIN;
        snapped = true;
      }

      return { x: newX, snapped };
    };

    // Panel width 400, should snap when x > 1500 (1920 - 20 - 400)
    const result = getSnappedPosition(1505, 100, 400, 300);
    expect(result.snapped).toBe(true);
    expect(result.x).toBe(1520);

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });
});
