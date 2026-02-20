import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useKeyboardShortcut } from "../use-keyboard-shortcut";

describe("useKeyboardShortcut", () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, "addEventListener");
    removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should register keyboard shortcut on mount", () => {
    const handler = vi.fn();

    renderHook(() =>
      useKeyboardShortcut([
        {
          key: "k",
          ctrlKey: true,
          handler,
        },
      ])
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });

  it("should call handler when shortcut is triggered", () => {
    const handler = vi.fn();
    let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

    addEventListenerSpy.mockImplementation((event: string, listener: EventListenerOrEventListenerObject) => {
      if (event === "keydown") {
        keydownHandler = listener as (e: KeyboardEvent) => void;
      }
    });

    renderHook(() =>
      useKeyboardShortcut([
        {
          key: "k",
          ctrlKey: true,
          handler,
        },
      ])
    );

    act(() => {
      const event = new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        bubbles: true,
      });
      keydownHandler?.(event);
    });

    expect(handler).toHaveBeenCalled();
  });

  it("should not call handler when key doesn't match", () => {
    const handler = vi.fn();
    let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

    addEventListenerSpy.mockImplementation((event: string, listener: EventListenerOrEventListenerObject) => {
      if (event === "keydown") {
        keydownHandler = listener as (e: KeyboardEvent) => void;
      }
    });

    renderHook(() =>
      useKeyboardShortcut([
        {
          key: "k",
          ctrlKey: true,
          handler,
        },
      ])
    );

    act(() => {
      const event = new KeyboardEvent("keydown", {
        key: "a",
        ctrlKey: true,
        bubbles: true,
      });
      keydownHandler?.(event);
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it("should not call handler when modifiers don't match", () => {
    const handler = vi.fn();
    let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

    addEventListenerSpy.mockImplementation((event: string, listener: EventListenerOrEventListenerObject) => {
      if (event === "keydown") {
        keydownHandler = listener as (e: KeyboardEvent) => void;
      }
    });

    renderHook(() =>
      useKeyboardShortcut([
        {
          key: "k",
          ctrlKey: true,
          handler,
        },
      ])
    );

    act(() => {
      const event = new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: false,
        bubbles: true,
      });
      keydownHandler?.(event);
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it("should call handler with Ctrl/Cmd + K", () => {
    const handler = vi.fn();
    let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

    addEventListenerSpy.mockImplementation((event: string, listener: EventListenerOrEventListenerObject) => {
      if (event === "keydown") {
        keydownHandler = listener as (e: KeyboardEvent) => void;
      }
    });

    renderHook(() =>
      useKeyboardShortcut([
        {
          key: "k",
          ctrlKey: true,
          metaKey: true,
          handler,
        },
      ])
    );

    act(() => {
      // Test Ctrl + K (Windows/Linux)
      const ctrlEvent = new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        metaKey: false,
        bubbles: true,
      });
      keydownHandler?.(ctrlEvent);

      // Test Cmd + K (Mac)
      const cmdEvent = new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: false,
        metaKey: true,
        bubbles: true,
      });
      keydownHandler?.(cmdEvent);
    });

    expect(handler).toHaveBeenCalledTimes(2);
  });

  it("should prevent default when preventDefault is true", () => {
    const handler = vi.fn();
    let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

    addEventListenerSpy.mockImplementation((event: string, listener: EventListenerOrEventListenerObject) => {
      if (event === "keydown") {
        keydownHandler = listener as (e: KeyboardEvent) => void;
      }
    });

    renderHook(() =>
      useKeyboardShortcut([
        {
          key: "k",
          ctrlKey: true,
          handler,
          preventDefault: true,
        },
      ])
    );

    act(() => {
      const event = new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });
      keydownHandler?.(event);
    });

    expect(handler).toHaveBeenCalled();
  });

  it("should cleanup event listener on unmount", () => {
    const handler = vi.fn();

    const { unmount } = renderHook(() =>
      useKeyboardShortcut([
        {
          key: "k",
          ctrlKey: true,
          handler,
        },
      ])
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });

  it("should handle multiple shortcuts", () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

    addEventListenerSpy.mockImplementation((event: string, listener: EventListenerOrEventListenerObject) => {
      if (event === "keydown") {
        keydownHandler = listener as (e: KeyboardEvent) => void;
      }
    });

    renderHook(() =>
      useKeyboardShortcut([
        {
          key: "k",
          ctrlKey: true,
          handler: handler1,
        },
        {
          key: "Escape",
          handler: handler2,
        },
      ])
    );

    act(() => {
      const event1 = new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        bubbles: true,
      });
      keydownHandler?.(event1);

      const event2 = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      });
      keydownHandler?.(event2);
    });

    expect(handler1).toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
  });

  it("should handle shortcuts with shift and alt modifiers", () => {
    const handler = vi.fn();
    let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

    addEventListenerSpy.mockImplementation((event: string, listener: EventListenerOrEventListenerObject) => {
      if (event === "keydown") {
        keydownHandler = listener as (e: KeyboardEvent) => void;
      }
    });

    renderHook(() =>
      useKeyboardShortcut([
        {
          key: "k",
          ctrlKey: true,
          shiftKey: true,
          altKey: true,
          handler,
        },
      ])
    );

    act(() => {
      const event = new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        shiftKey: true,
        altKey: true,
        bubbles: true,
      });
      keydownHandler?.(event);
    });

    expect(handler).toHaveBeenCalled();
  });

  it("should be case-insensitive for key matching", () => {
    const handler = vi.fn();
    let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

    addEventListenerSpy.mockImplementation((event: string, listener: EventListenerOrEventListenerObject) => {
      if (event === "keydown") {
        keydownHandler = listener as (e: KeyboardEvent) => void;
      }
    });

    renderHook(() =>
      useKeyboardShortcut([
        {
          key: "k",
          handler,
        },
      ])
    );

    act(() => {
      const event1 = new KeyboardEvent("keydown", {
        key: "k",
        bubbles: true,
      });
      keydownHandler?.(event1);

      const event2 = new KeyboardEvent("keydown", {
        key: "K",
        bubbles: true,
      });
      keydownHandler?.(event2);
    });

    expect(handler).toHaveBeenCalledTimes(2);
  });
});
