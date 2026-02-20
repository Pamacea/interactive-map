/**
 * Centralized Event Management System
 *
 * Provides a unified way to handle UI interactions with proper event bubbling control.
 * Prevents event conflicts between overlapping UI elements (popups, panels, etc.)
 *
 * @module event-manager
 */

export type InteractiveElement =
  | "map-canvas"
  | "pin-marker"
  | "pin-popup"
  | "sidebar"
  | "zoom-controls"
  | "context-menu";

export type InteractionMode =
  | "idle"
  | "dragging-map"
  | "dragging-pin"
  | "creating-pin"
  | "inspecting-pin";

interface EventState {
  /** Current mode of interaction */
  mode: InteractionMode;

  /** Element that captured the last event */
  capturedBy: InteractiveElement | null;

  /** Elements that should receive events (whitelist) */
  activeElements: Set<InteractiveElement>;

  /** Prevents deselection during interaction */
  isInteracting: boolean;
}

class EventManager {
  private state: EventState = {
    mode: "idle",
    capturedBy: null,
    activeElements: new Set(),
    isInteracting: false,
  };

  private listeners: Map<string, Set<() => void>> = new Map();

  /**
   * Capture an event for a specific element
   * @param element - The element capturing the event
   * @returns Cleanup function to release capture
   */
  capture(element: InteractiveElement): () => void {
    this.state.capturedBy = element;
    this.state.isInteracting = true;

    // Notify listeners
    this.notify("capture", element);

    // Return cleanup function
    return () => {
      if (this.state.capturedBy === element) {
        this.state.capturedBy = null;
        this.state.isInteracting = false;
        this.notify("release", element);
      }
    };
  }

  /**
   * Check if an event was captured by a specific element
   */
  isCapturedBy(element: InteractiveElement): boolean {
    return this.state.capturedBy === element;
  }

  /**
   * Check if any element has captured the event
   */
  isCaptured(): boolean {
    return this.state.capturedBy !== null;
  }

  /**
   * Set the current interaction mode
   */
  setMode(mode: InteractionMode): void {
    const previous = this.state.mode;
    this.state.mode = mode;
    this.notify("mode-change", { previous, current: mode });
  }

  /**
   * Get current interaction mode
   */
  getMode(): InteractionMode {
    return this.state.mode;
  }

  /**
   * Register an active element (should receive events)
   */
  activateElement(element: InteractiveElement): () => void {
    this.state.activeElements.add(element);

    return () => {
      this.state.activeElements.delete(element);
    };
  }

  /**
   * Check if an element is active
   */
  isElementActive(element: InteractiveElement): boolean {
    return this.state.activeElements.has(element);
  }

  /**
   * Check if we're currently interacting
   */
  isInteracting(): boolean {
    return this.state.isInteracting;
  }

  /**
   * Subscribe to event manager events
   */
  on(event: string, callback: () => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(callback);

    // Return cleanup function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  /**
   * Notify all listeners of an event
   */
  private notify(event: string, _data?: unknown): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb());
    }
  }

  /**
   * Reset all state (useful for testing/cleanup)
   */
  reset(): void {
    this.state = {
      mode: "idle",
      capturedBy: null,
      activeElements: new Set(),
      isInteracting: false,
    };
  }

  /**
   * Get current state (read-only)
   */
  getState(): Readonly<EventState> {
    return { ...this.state };
  }
}

// Singleton instance
export const eventManager = new EventManager();

/**
 * React hook for event management
 */
export function useEventManager() {
  return {
    capture: eventManager.capture.bind(eventManager),
    isCapturedBy: eventManager.isCapturedBy.bind(eventManager),
    isCaptured: eventManager.isCaptured.bind(eventManager),
    setMode: eventManager.setMode.bind(eventManager),
    getMode: eventManager.getMode.bind(eventManager),
    activateElement: eventManager.activateElement.bind(eventManager),
    isElementActive: eventManager.isElementActive.bind(eventManager),
    isInteracting: eventManager.isInteracting.bind(eventManager),
    on: eventManager.on.bind(eventManager),
  };
}

/**
 * Higher-order component props for event handling
 */
export interface WithEventCaptureProps {
  onCaptureStart?: () => void;
  onCaptureEnd?: () => void;
}

/**
 * Utility to stop event propagation safely
 */
export function stopPropagation(event: React.MouseEvent | MouseEvent): void {
  event.stopPropagation();
  event.preventDefault();
}

/**
 * Check if click should be allowed based on event manager state
 */
export function shouldAllowClick(
  event: React.MouseEvent,
  currentElement: InteractiveElement
): boolean {
  // If nothing captured, allow
  if (!eventManager.isCaptured()) {
    return true;
  }

  // If current element captured, allow
  if (eventManager.isCapturedBy(currentElement)) {
    return true;
  }

  // Otherwise, block
  return false;
}
