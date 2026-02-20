import { describe, it, expect, vi, beforeEach } from "vitest";
import { eventManager, useEventManager, shouldAllowClick, stopPropagation } from "../event-manager";

describe("eventManager", () => {
  beforeEach(() => {
    eventManager.reset();
  });

  describe("initial state", () => {
    it("should initialize with idle mode", () => {
      expect(eventManager.getMode()).toBe("idle");
    });

    it("should initialize with no captured element", () => {
      expect(eventManager.isCaptured()).toBe(false);
    });

    it("should initialize with not interacting state", () => {
      expect(eventManager.isInteracting()).toBe(false);
    });

    it("should have no active elements", () => {
      const _state = eventManager.getState();
      expect(state.activeElements.size).toBe(0);
    });
  });

  describe("capture", () => {
    it("should capture an event for a specific element", () => {
      const cleanup = eventManager.capture("pin-marker");

      expect(eventManager.isCaptured()).toBe(true);
      expect(eventManager.isCapturedBy("pin-marker")).toBe(true);
      expect(eventManager.isInteracting()).toBe(true);

      cleanup();

      expect(eventManager.isCaptured()).toBe(false);
      expect(eventManager.isInteracting()).toBe(false);
    });

    it("should only return true for the captured element", () => {
      eventManager.capture("pin-marker");

      expect(eventManager.isCapturedBy("pin-marker")).toBe(true);
      expect(eventManager.isCapturedBy("sidebar")).toBe(false);
    });

    it("should handle multiple captures (last one wins)", () => {
      eventManager.capture("pin-marker");
      expect(eventManager.isCapturedBy("pin-marker")).toBe(true);

      eventManager.capture("sidebar");
      expect(eventManager.isCapturedBy("sidebar")).toBe(true);
      expect(eventManager.isCapturedBy("pin-marker")).toBe(false);

      // Note: The current implementation doesn't use a stack,
      // so when sidebar is released, pin-marker is NOT automatically restored
      eventManager.reset();
      expect(eventManager.isCaptured()).toBe(false);
    });

    it("should call capture event listeners", () => {
      const callback = vi.fn();
      eventManager.on("capture", callback);

      eventManager.capture("pin-marker");

      expect(callback).toHaveBeenCalled();
    });

    it("should call release event listeners on cleanup", () => {
      const callback = vi.fn();
      eventManager.on("release", callback);

      const cleanup = eventManager.capture("pin-marker");
      cleanup();

      expect(callback).toHaveBeenCalled();
    });
  });

  describe("mode management", () => {
    it("should set and get interaction mode", () => {
      eventManager.setMode("dragging-pin");
      expect(eventManager.getMode()).toBe("dragging-pin");
    });

    it("should notify listeners on mode change", () => {
      const callback = vi.fn();
      eventManager.on("mode-change", callback);

      eventManager.setMode("creating-pin");

      expect(callback).toHaveBeenCalled();
    });

    it("should support all valid modes", () => {
      const modes: Array<"idle" | "dragging-map" | "dragging-pin" | "creating-pin" | "inspecting-pin"> = [
        "idle",
        "dragging-map",
        "dragging-pin",
        "creating-pin",
        "inspecting-pin",
      ];

      modes.forEach((mode) => {
        eventManager.setMode(mode);
        expect(eventManager.getMode()).toBe(mode);
      });
    });
  });

  describe("active elements", () => {
    it("should activate an element", () => {
      const cleanup = eventManager.activateElement("sidebar");

      expect(eventManager.isElementActive("sidebar")).toBe(true);

      cleanup();

      expect(eventManager.isElementActive("sidebar")).toBe(false);
    });

    it("should handle multiple active elements", () => {
      const cleanup1 = eventManager.activateElement("sidebar");
      const cleanup2 = eventManager.activateElement("zoom-controls");

      expect(eventManager.isElementActive("sidebar")).toBe(true);
      expect(eventManager.isElementActive("zoom-controls")).toBe(true);

      cleanup1();

      expect(eventManager.isElementActive("sidebar")).toBe(false);
      expect(eventManager.isElementActive("zoom-controls")).toBe(true);

      cleanup2();

      expect(eventManager.isElementActive("zoom-controls")).toBe(false);
    });

    it("should return false for non-active elements", () => {
      expect(eventManager.isElementActive("sidebar")).toBe(false);
    });
  });

  describe("event subscriptions", () => {
    it("should subscribe to events", () => {
      const callback = vi.fn();
      const cleanup = eventManager.on("custom-event", callback);

      eventManager.setMode("dragging-pin");

      // Mode change triggers internal notify
      expect(callback).not.toHaveBeenCalled(); // custom-event not triggered

      cleanup();
    });

    it("should unsubscribe from events", () => {
      const callback = vi.fn();
      const cleanup = eventManager.on("mode-change", callback);

      eventManager.setMode("dragging-pin");
      expect(callback).toHaveBeenCalledTimes(1);

      cleanup();

      eventManager.setMode("creating-pin");
      expect(callback).toHaveBeenCalledTimes(1); // Still 1, not called again
    });

    it("should support multiple subscribers", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      eventManager.on("mode-change", callback1);
      eventManager.on("mode-change", callback2);

      eventManager.setMode("dragging-pin");

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it("should handle removing one of multiple subscribers", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const cleanup1 = eventManager.on("mode-change", callback1);
      eventManager.on("mode-change", callback2);

      eventManager.setMode("dragging-pin");
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);

      cleanup1();

      eventManager.setMode("creating-pin");
      expect(callback1).toHaveBeenCalledTimes(1); // Removed
      expect(callback2).toHaveBeenCalledTimes(2); // Still active
    });
  });

  describe("reset", () => {
    it("should reset all state", () => {
      eventManager.setMode("dragging-pin");
      eventManager.capture("pin-marker");
      eventManager.activateElement("sidebar");

      eventManager.reset();

      expect(eventManager.getMode()).toBe("idle");
      expect(eventManager.isCaptured()).toBe(false);
      expect(eventManager.isInteracting()).toBe(false);
      expect(eventManager.isElementActive("sidebar")).toBe(false);
    });
  });

  describe("getState", () => {
    it("should return a read-only copy of state", () => {
      eventManager.setMode("dragging-pin");
      eventManager.capture("pin-marker");

      const _state = eventManager.getState();

      expect(state.mode).toBe("dragging-pin");
      expect(state.capturedBy).toBe("pin-marker");
      expect(state.isInteracting).toBe(true);

      // Verify it's a copy, not a reference
      expect(state).not.toBe(eventManager.getState());
    });
  });

  describe("edge cases", () => {
    it("should handle calling cleanup multiple times", () => {
      const cleanup = eventManager.capture("pin-marker");

      expect(eventManager.isCaptured()).toBe(true);

      cleanup();
      expect(eventManager.isCaptured()).toBe(false);

      cleanup();
      expect(eventManager.isCaptured()).toBe(false); // Still false, no error
    });

    it("should handle rapid mode changes", () => {
      const callback = vi.fn();
      eventManager.on("mode-change", callback);

      eventManager.setMode("dragging-pin");
      eventManager.setMode("creating-pin");
      eventManager.setMode("idle");

      expect(callback).toHaveBeenCalledTimes(3);
    });
  });
});

describe("useEventManager hook", () => {
  beforeEach(() => {
    eventManager.reset();
  });

  it("should return event manager methods", () => {
    const manager = useEventManager();

    expect(typeof manager.capture).toBe("function");
    expect(typeof manager.isCapturedBy).toBe("function");
    expect(typeof manager.isCaptured).toBe("function");
    expect(typeof manager.setMode).toBe("function");
    expect(typeof manager.getMode).toBe("function");
    expect(typeof manager.activateElement).toBe("function");
    expect(typeof manager.isElementActive).toBe("function");
    expect(typeof manager.isInteracting).toBe("function");
    expect(typeof manager.on).toBe("function");
  });

  it("should delegate to singleton instance", () => {
    const manager = useEventManager();

    manager.setMode("dragging-pin");

    expect(eventManager.getMode()).toBe("dragging-pin");
  });
});

describe("stopPropagation utility", () => {
  it("should stop propagation and prevent default", () => {
    const event = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    } as unknown as React.MouseEvent;

    stopPropagation(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });
});

describe("shouldAllowClick utility", () => {
  beforeEach(() => {
    eventManager.reset();
  });

  it("should allow click when nothing is captured", () => {
    const event = {} as React.MouseEvent;
    expect(shouldAllowClick(event, "pin-marker")).toBe(true);
  });

  it("should allow click when current element captured", () => {
    eventManager.capture("pin-marker");

    const event = {} as React.MouseEvent;
    expect(shouldAllowClick(event, "pin-marker")).toBe(true);
  });

  it("should block click when another element captured", () => {
    eventManager.capture("sidebar");

    const event = {} as React.MouseEvent;
    expect(shouldAllowClick(event, "pin-marker")).toBe(false);
  });

  it("should block click when different element captured", () => {
    const cleanup = eventManager.capture("pin-marker");

    const event = {} as React.MouseEvent;
    expect(shouldAllowClick(event, "sidebar")).toBe(false);

    cleanup();
  });
});
