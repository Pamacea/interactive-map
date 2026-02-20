/**
 * Pin Sync Queue Tests
 *
 * Unit tests for the request queue system that prevents race conditions
 * in pin position updates.
 */

import { pinSyncQueue } from "./pin-sync-queue";

describe("PinSyncQueue", () => {
  beforeEach(() => {
    // Clear all pending requests before each test
    pinSyncQueue.clearAll();
  });

  describe("registerRequest", () => {
    it("should register a new request and return abort controller", () => {
      const rollbackPos = { latitude: 0.5, longitude: 0.5 };
      const controller = pinSyncQueue.registerRequest("pin-1", rollbackPos);

      expect(controller).toBeInstanceOf(AbortController);
      expect(controller.signal.aborted).toBe(false);
      expect(pinSyncQueue.hasPendingRequest("pin-1")).toBe(true);
    });

    it("should cancel existing request when registering new one for same pin", () => {
      const rollbackPos1 = { latitude: 0.3, longitude: 0.3 };
      const rollbackPos2 = { latitude: 0.7, longitude: 0.7 };

      const controller1 = pinSyncQueue.registerRequest("pin-1", rollbackPos1);
      expect(controller1.signal.aborted).toBe(false);

      const controller2 = pinSyncQueue.registerRequest("pin-1", rollbackPos2);

      // First controller should be aborted
      expect(controller1.signal.aborted).toBe(true);
      // Second controller should be active
      expect(controller2.signal.aborted).toBe(false);
      expect(pinSyncQueue.hasPendingRequest("pin-1")).toBe(true);
    });
  });

  describe("cancelPendingRequest", () => {
    it("should cancel pending request and return rollback position", () => {
      const rollbackPos = { latitude: 0.5, longitude: 0.5 };
      pinSyncQueue.registerRequest("pin-1", rollbackPos);

      const _result = pinSyncQueue.cancelPendingRequest("pin-1");

      expect(result).toEqual(rollbackPos);
      expect(pinSyncQueue.hasPendingRequest("pin-1")).toBe(false);
    });

    it("should return null when no pending request exists", () => {
      const _result = pinSyncQueue.cancelPendingRequest("non-existent");

      expect(result).toBeNull();
    });

    it("should abort the request's abort controller", () => {
      const rollbackPos = { latitude: 0.5, longitude: 0.5 };
      const controller = pinSyncQueue.registerRequest("pin-1", rollbackPos);

      pinSyncQueue.cancelPendingRequest("pin-1");

      expect(controller.signal.aborted).toBe(true);
    });
  });

  describe("markCompleted", () => {
    it("should remove completed request from pending map", () => {
      const rollbackPos = { latitude: 0.5, longitude: 0.5 };
      pinSyncQueue.registerRequest("pin-1", rollbackPos);

      expect(pinSyncQueue.hasPendingRequest("pin-1")).toBe(true);

      pinSyncQueue.markCompleted("pin-1");

      expect(pinSyncQueue.hasPendingRequest("pin-1")).toBe(false);
    });
  });

  describe("hasPendingRequest", () => {
    it("should return true when request is pending", () => {
      const rollbackPos = { latitude: 0.5, longitude: 0.5 };
      pinSyncQueue.registerRequest("pin-1", rollbackPos);

      expect(pinSyncQueue.hasPendingRequest("pin-1")).toBe(true);
    });

    it("should return false when no request is pending", () => {
      expect(pinSyncQueue.hasPendingRequest("pin-1")).toBe(false);
    });
  });

  describe("getPendingPins", () => {
    it("should return array of pin IDs with pending requests", () => {
      pinSyncQueue.registerRequest("pin-1", { latitude: 0.1, longitude: 0.1 });
      pinSyncQueue.registerRequest("pin-2", { latitude: 0.2, longitude: 0.2 });
      pinSyncQueue.registerRequest("pin-3", { latitude: 0.3, longitude: 0.3 });

      const pending = pinSyncQueue.getPendingPins();

      expect(pending).toHaveLength(3);
      expect(pending).toContain("pin-1");
      expect(pending).toContain("pin-2");
      expect(pending).toContain("pin-3");
    });

    it("should return empty array when no requests pending", () => {
      const pending = pinSyncQueue.getPendingPins();

      expect(pending).toEqual([]);
    });
  });

  describe("clearAll", () => {
    it("should cancel all pending requests", () => {
      const controller1 = pinSyncQueue.registerRequest("pin-1", { latitude: 0.1, longitude: 0.1 });
      const controller2 = pinSyncQueue.registerRequest("pin-2", { latitude: 0.2, longitude: 0.2 });

      pinSyncQueue.clearAll();

      expect(controller1.signal.aborted).toBe(true);
      expect(controller2.signal.aborted).toBe(true);
      expect(pinSyncQueue.getPendingPins()).toEqual([]);
    });
  });

  describe("Race condition prevention", () => {
    it("should handle rapid successive requests for same pin", () => {
      const controllers: AbortController[] = [];

      // Simulate rapid dragging
      for (let i = 0; i < 10; i++) {
        const controller = pinSyncQueue.registerRequest("pin-1", {
          latitude: i * 0.1,
          longitude: i * 0.1,
        });
        controllers.push(controller);
      }

      // All previous controllers should be aborted
      for (let i = 0; i < 9; i++) {
        expect(controllers[i].signal.aborted).toBe(true);
      }

      // Only the last controller should be active
      expect(controllers[9].signal.aborted).toBe(false);
      expect(pinSyncQueue.getPendingPins()).toEqual(["pin-1"]);
    });

    it("should handle multiple pins with independent requests", () => {
      const controller1 = pinSyncQueue.registerRequest("pin-1", { latitude: 0.1, longitude: 0.1 });
      const controller2 = pinSyncQueue.registerRequest("pin-2", { latitude: 0.2, longitude: 0.2 });
      const controller3 = pinSyncQueue.registerRequest("pin-3", { latitude: 0.3, longitude: 0.3 });

      // All should be active (different pins)
      expect(controller1.signal.aborted).toBe(false);
      expect(controller2.signal.aborted).toBe(false);
      expect(controller3.signal.aborted).toBe(false);

      expect(pinSyncQueue.getPendingPins().sort()).toEqual(["pin-1", "pin-2", "pin-3"]);
    });
  });
});
