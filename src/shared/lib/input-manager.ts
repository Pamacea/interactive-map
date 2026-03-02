/**
 * Unified Input Manager - Fixed Version
 *
 * Centralizes all user input handling with proper priority and propagation control.
 * Eliminates event conflicts by providing a single source of truth for input state.
 *
 * Priority order (highest to lowest):
 * 1. Context menu (highest priority)
 * 2. Popup/Dialog
 * 3. Pin marker (drag/click)
 * 4. Map canvas (pan/zoom)
 * 5. Sidebar/panels
 */

import { useEffect, useRef } from "react";

// ============== Types ==============

export type InputElement =
  | "context-menu"
  | "popup"
  | "pin-marker"
  | "map-canvas"
  | "sidebar"
  | "zoom-controls"
  | "input-field"
  | "none";

export type InputMode =
  | "idle"
  | "dragging-map"
  | "dragging-pin"
  | "creating-pin"
  | "inspecting-pin"
  | "context-menu-open"
  | "popup-open"
  | "typing";

export type MouseButton = 0 | 1 | 2; // left, middle, right

export interface PointerState {
  readonly x: number;
  readonly y: number;
  readonly clientX: number;
  readonly clientY: number;
  readonly isDown: boolean;
  readonly button: MouseButton | null;
  readonly targetElement: InputElement;
}

export interface DragState {
  readonly isActive: boolean;
  readonly element: InputElement;
  readonly elementId: string | null;
  readonly startPointer: { x: number; y: number; clientX: number; clientY: number };
  readonly currentPointer: { x: number; y: number; clientX: number; clientY: number };
  readonly delta: { x: number; y: number };
  readonly totalDistance: number;
  readonly hasMovedPastThreshold: boolean;
  readonly button: MouseButton | null;
}

export interface KeyboardState {
  readonly pressedKeys: ReadonlySet<string>;
  readonly modifiers: {
    readonly ctrl: boolean;
    readonly shift: boolean;
    readonly alt: boolean;
    readonly meta: boolean;
  };
}

interface InputState {
  mode: InputMode;
  focusedElement: InputElement;
  capturedBy: InputElement;
  pointer: PointerState;
  drag: DragState;
  keyboard: KeyboardState;
  clickSequenceId: number; // Track click sequences to prevent click-after-drag
}

interface MouseHandler {
  down?: (e: MouseEvent) => boolean;
  move?: (e: MouseEvent) => boolean;
  up?: (e: MouseEvent) => boolean;
  click?: (e: MouseEvent) => boolean;
  dblClick?: (e: MouseEvent) => boolean;
  wheel?: (e: WheelEvent) => boolean;
  contextMenu?: (e: MouseEvent) => boolean;
}

interface KeyboardHandler {
  down?: (e: KeyboardEvent) => boolean;
  up?: (e: KeyboardEvent) => boolean;
  press?: (e: KeyboardEvent) => boolean;
}

interface InputHandlers {
  mouse: MouseHandler;
  keyboard: KeyboardHandler;
}

interface HandlerRegistration {
  element: InputElement;
  elementId?: string;
  priority: number;
  handlers: InputHandlers;
  enabled: () => boolean;
  mountedRef: { readonly current: boolean }; // Track if component is still mounted
}

// ============== Priority Constants ==============

export const INPUT_PRIORITY = {
  CONTEXT_MENU: 100,
  POPUP: 90,
  PIN_MARKER: 80,
  MAP_CANVAS: 50,
  SIDEBAR: 40,
  ZOOM_CONTROLS: 30,
  INPUT_FIELD: 20,
} as const;

// ============== Validation Utilities ==============

function isValidButton(button: number): button is MouseButton {
  return button === 0 || button === 1 || button === 2;
}

export function isHTMLElement(target: EventTarget | null): target is HTMLElement {
  return target !== null && "tagName" in target;
}

// ============== Input Manager Class ==============

class InputManager {
  private state: InputState;
  private registrations: Map<string, HandlerRegistration> = new Map();
  private nextId = 0;
  private listeners: Map<string, Set<() => void>> = new Map();
  private nativeListenersAttached = false;
  private dragThreshold = 5;
  private currentClickSequenceId = 0;
  private dispatchInProgress = false;

  // Snapshot of registrations for dispatch (prevents race conditions)
  private dispatchSnapshot: HandlerRegistration[] = [];

  // Native event handlers (bound once)
  private readonly handleNativeMouseDown = this.onMouseDown.bind(this);
  private readonly handleNativeMouseMove = this.onMouseMove.bind(this);
  private readonly handleNativeMouseUp = this.onMouseUp.bind(this);
  private readonly handleNativeClick = this.onClick.bind(this);
  private readonly handleNativeDblClick = this.onDblClick.bind(this);
  private readonly handleNativeWheel = this.onWheel.bind(this);
  private readonly handleNativeContextMenu = this.onContextMenu.bind(this);
  private readonly handleNativeKeyDown = this.onKeyDown.bind(this);
  private readonly handleNativeKeyUp = this.onKeyUp.bind(this);
  private readonly handleNativeKeyPress = this.onKeyPress.bind(this);
  private readonly handleWindowBlur = this.onWindowBlur.bind(this);

  constructor() {
    this.state = this.createInitialState();
    // Only attach listeners if we're in a browser environment
    if (typeof window !== "undefined") {
      this.attachNativeListeners();
    }
  }

  private createInitialState(): InputState {
    return {
      mode: "idle",
      focusedElement: "none",
      capturedBy: "none",
      pointer: {
        x: 0,
        y: 0,
        clientX: 0,
        clientY: 0,
        isDown: false,
        button: null,
        targetElement: "none",
      },
      drag: {
        isActive: false,
        element: "none",
        elementId: null,
        startPointer: { x: 0, y: 0, clientX: 0, clientY: 0 },
        currentPointer: { x: 0, y: 0, clientX: 0, clientY: 0 },
        delta: { x: 0, y: 0 },
        totalDistance: 0,
        hasMovedPastThreshold: false,
        button: null,
      },
      keyboard: {
        pressedKeys: new Set(),
        modifiers: { ctrl: false, shift: false, alt: false, meta: false },
      },
      clickSequenceId: 0,
    };
  }

  // ============== Native Event Attachment ==============

  private attachNativeListeners(): void {
    if (this.nativeListenersAttached) return;
    this.nativeListenersAttached = true;

    // Mouse events
    window.addEventListener("mousedown", this.handleNativeMouseDown, { passive: false });
    window.addEventListener("mousemove", this.handleNativeMouseMove, { passive: false });
    window.addEventListener("mouseup", this.handleNativeMouseUp, { passive: false });
    window.addEventListener("click", this.handleNativeClick, { passive: false });
    window.addEventListener("dblclick", this.handleNativeDblClick, { passive: false });
    window.addEventListener("wheel", this.handleNativeWheel, { passive: false });
    window.addEventListener("contextmenu", this.handleNativeContextMenu, { passive: false });

    // Keyboard events
    window.addEventListener("keydown", this.handleNativeKeyDown, { passive: false });
    window.addEventListener("keyup", this.handleNativeKeyUp, { passive: false });
    window.addEventListener("keypress", this.handleNativeKeyPress, { passive: false });

    // Window events for cleanup
    window.addEventListener("blur", this.handleWindowBlur);
  }

  // ============== Handler Registration ==============

  /**
   * Register input handlers for an element
   * @returns Cleanup function to unregister
   */
  register(config: {
    element: InputElement;
    elementId?: string;
    priority?: number;
    handlers: InputHandlers;
    enabled?: () => boolean;
  }): () => void {
    const id = `${config.element}-${config.elementId || "global"}-${this.nextId++}`;

    // Create mounted ref to track if component is still mounted
    const mountedRef = { current: true };

    // Validate handlers are functions
    if (config.handlers) {
      const validateHandlers = (handlers: Record<string, unknown> | undefined | null, prefix: string) => {
        if (!handlers) return; // Skip validation if handlers is undefined or null
        for (const [key, handler] of Object.entries(handlers)) {
          if (handler !== undefined && typeof handler !== "function") {
            console.warn(`[InputManager] Invalid handler at ${prefix}${key}: must be a function`);
            delete handlers[key as keyof typeof handlers];
          }
        }
      };
      validateHandlers(config.handlers.mouse, "mouse.");
      validateHandlers(config.handlers.keyboard, "keyboard.");
    }

    const registration: HandlerRegistration = {
      element: config.element,
      elementId: config.elementId,
      priority: config.priority ?? INPUT_PRIORITY.MAP_CANVAS,
      handlers: config.handlers,
      enabled: config.enabled ?? (() => true),
      mountedRef,
    };

    this.registrations.set(id, registration);

    return () => {
      // Mark as unmounted first (prevents calling handlers during cleanup)
      mountedRef.current = false;

      this.registrations.delete(id);

      // Clean up state if this was the active element
      if (this.state.focusedElement === config.element) {
        this.state.focusedElement = "none";
      }
      if (this.state.capturedBy === config.element) {
        this.state.capturedBy = "none";
      }
    };
  }

  // ============== Event Dispatch ==============

  private getSortedRegistrations(): HandlerRegistration[] {
    const allRegs = Array.from(this.registrations.values());
    const filtered = allRegs.filter((reg) => {
      const enabled = reg.enabled();
      const mounted = reg.mountedRef.current;
      return enabled && mounted;
    });
    const sorted = filtered.sort((a, b) => b.priority - a.priority);
    return sorted;
  }

  private createDispatchSnapshot(): void {
    this.dispatchSnapshot = this.getSortedRegistrations();
  }

  private dispatchMouseEvent(
    eventType: keyof MouseHandler,
    event: MouseEvent,
    stopIfHandled = true
  ): boolean {
    // If dispatch is in progress, use snapshot to prevent race conditions
    const handlersToCall = this.dispatchInProgress
      ? this.dispatchSnapshot
      : this.getSortedRegistrations();

    for (const reg of handlersToCall) {
      // Double-check component is still mounted before calling handler
      if (!reg.mountedRef.current) continue;

      // Defensive: mouse handlers may not be registered
      const mouseHandlers = reg.handlers.mouse;
      if (!mouseHandlers) continue;

      const handler = mouseHandlers[eventType];
      if (handler) {
        try {
          const result = handler(event);
          // Handler returns true = handled/captured, false = continue
          if (result === true && stopIfHandled) {
            event.preventDefault();
            event.stopPropagation();
            return true;
          }
        } catch (error) {
          console.error(`[InputManager] Error in ${reg.element} ${eventType} handler:`, error);
        }
      }
    }

    return false;
  }

  private dispatchKeyboardEvent(
    eventType: keyof KeyboardHandler,
    event: KeyboardEvent,
    stopIfHandled = true
  ): boolean {
    const handlersToCall = this.dispatchInProgress
      ? this.dispatchSnapshot
      : this.getSortedRegistrations();

    for (const reg of handlersToCall) {
      if (!reg.mountedRef.current) continue;

      // Defensive: keyboard handlers may not be registered
      const keyboardHandlers = reg.handlers.keyboard;
      if (!keyboardHandlers) continue;

      const handler = keyboardHandlers[eventType];
      if (handler) {
        try {
          const _result = handler(event);
          if (result === true && stopIfHandled) {
            event.preventDefault();
            event.stopPropagation();
            return true;
          }
        } catch (error) {
          console.error(`[InputManager] Error in ${reg.element} ${eventType} handler:`, error);
        }
      }
    }

    return false;
  }

  // ============== Mouse Event Handlers ==============

  private onMouseDown(e: MouseEvent): void {
    // Increment click sequence ID - this ties click events to their mousedown
    this.currentClickSequenceId++;

    // Update pointer state
    this.state.pointer.isDown = true;
    this.state.pointer.button = isValidButton(e.button) ? e.button : null;
    this.state.pointer.clientX = e.clientX;
    this.state.pointer.clientY = e.clientY;

    // Initialize drag state
    this.state.drag.startPointer = { x: e.clientX, y: e.clientY, clientX: e.clientX, clientY: e.clientY };
    this.state.drag.currentPointer = { x: e.clientX, y: e.clientY, clientX: e.clientX, clientY: e.clientY };
    this.state.drag.delta = { x: 0, y: 0 };
    this.state.drag.totalDistance = 0;
    this.state.drag.hasMovedPastThreshold = false;
    this.state.drag.button = isValidButton(e.button) ? e.button : null;

    // Create snapshot for this event sequence
    this.createDispatchSnapshot();

    // Find which element was clicked
    for (const reg of this.dispatchSnapshot) {
      if (!reg.mountedRef.current) continue;

      if (reg.handlers.mouse.down) {
        try {
          const result = reg.handlers.mouse.down(e);
          if (result === true) {
            // Handler captured the event (true = handled)
            this.state.capturedBy = reg.element;
            this.state.drag.element = reg.element;
            this.state.drag.elementId = reg.elementId ?? null;
            e.preventDefault();
            e.stopPropagation();
            return;
          }
        } catch (error) {
          console.error(`[InputManager] Error in ${reg.element} down handler:`, error);
        }
      }
    }

    // Set mode based on button and target
    if (e.button === 0) {
      this.state.mode = "idle";
    }
  }

  private onMouseMove(e: MouseEvent): void {
    const dx = e.clientX - this.state.drag.startPointer.clientX;
    const dy = e.clientY - this.state.drag.startPointer.clientY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Update pointer state
    this.state.pointer.clientX = e.clientX;
    this.state.pointer.clientY = e.clientY;

    // Update drag state
    this.state.drag.currentPointer = { x: e.clientX, y: e.clientY, clientX: e.clientX, clientY: e.clientY };
    this.state.drag.delta = { x: dx, y: dy };
    this.state.drag.totalDistance = distance;

    if (this.state.pointer.isDown && distance > this.dragThreshold) {
      if (!this.state.drag.hasMovedPastThreshold) {
        this.state.drag.hasMovedPastThreshold = true;
        // Start drag mode
        if (this.state.drag.element === "pin-marker") {
          this.state.mode = "dragging-pin";
        } else if (this.state.drag.element === "map-canvas") {
          this.state.mode = "dragging-map";
        }
        this.state.drag.isActive = true;
        this.notify("drag-start");
      }
    }

    // Dispatch to handlers
    this.dispatchMouseEvent("move", e, false);
  }

  private onMouseUp(e: MouseEvent): void {
    const wasDragging = this.state.drag.isActive;

    // Update pointer state
    this.state.pointer.isDown = false;
    this.state.pointer.button = null;

    // Reset drag state
    this.state.drag.isActive = false;
    this.state.drag.hasMovedPastThreshold = false;

    if (wasDragging) {
      this.notify("drag-end");
      // Return to idle mode
      if (this.state.mode === "dragging-pin" || this.state.mode === "dragging-map") {
        this.state.mode = "idle";
      }
    }

    this.state.capturedBy = "none";
    this.state.drag.element = "none";
    this.state.drag.elementId = null;

    this.dispatchMouseEvent("up", e, false);
  }

  private onClick(e: MouseEvent): void {
    // Check if this click belongs to a sequence that had dragging
    // We use the sequence ID to track if this click was preceded by drag
    if (this.state.drag.hasMovedPastThreshold) {
      return;
    }

    // Additional check: if we recently had a drag, ignore click
    const wasDragging = this.state.drag.isActive;
    if (wasDragging) {
      return;
    }

    this.dispatchMouseEvent("click", e);
  }

  private onDblClick(e: MouseEvent): void {
    if (this.state.drag.hasMovedPastThreshold) {
      return;
    }

    this.dispatchMouseEvent("dblClick", e);
  }

  private onWheel(e: WheelEvent): void {
    this.dispatchMouseEvent("wheel", e);
  }

  private onContextMenu(e: MouseEvent): void {
    const handled = this.dispatchMouseEvent("contextMenu", e);

    if (!handled) {
      // Default behavior - show context menu
      this.state.mode = "context-menu-open";
    }
  }

  // ============== Keyboard Event Handlers ==============

  private updateModifiers(e: KeyboardEvent): void {
    this.state.keyboard.modifiers.ctrl = e.ctrlKey;
    this.state.keyboard.modifiers.shift = e.shiftKey;
    this.state.keyboard.modifiers.alt = e.altKey;
    this.state.keyboard.modifiers.meta = e.metaKey;
  }

  private onKeyDown(e: KeyboardEvent): void {
    this.updateModifiers(e);
    this.state.keyboard.pressedKeys.add(e.key);

    // Update mode based on key
    if (e.key === "Escape") {
      // Escape always resets to idle, handlers can prevent
      const handled = this.dispatchKeyboardEvent("down", e);
      if (!e.defaultPrevented && !handled) {
        this.resetMode();
      }
      return;
    }

    this.dispatchKeyboardEvent("down", e);
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.updateModifiers(e);
    this.state.keyboard.pressedKeys.delete(e.key);

    this.dispatchKeyboardEvent("up", e);
  }

  private onKeyPress(e: KeyboardEvent): void {
    this.dispatchKeyboardEvent("press", e);
  }

  // ============== Window Event Handlers ==============

  private onWindowBlur(): void {
    // Clear pressed keys when window loses focus (prevents stuck keys)
    this.state.keyboard.pressedKeys.clear();
    this.state.keyboard.modifiers = { ctrl: false, shift: false, alt: false, meta: false };

    // Reset drag state if mouse was down
    if (this.state.pointer.isDown) {
      this.state.pointer.isDown = false;
      this.state.pointer.button = null;
      this.state.drag.isActive = false;
      this.state.drag.hasMovedPastThreshold = false;
    }
  }

  // ============== Mode Management ==============

  setMode(mode: InputMode): void {
    const previous = this.state.mode;
    this.state.mode = mode;
    this.notify("mode-change", { previous, current: mode });
  }

  getMode(): InputMode {
    return this.state.mode;
  }

  resetMode(): void {
    this.state.mode = "idle";
    this.state.capturedBy = "none";
    this.state.drag.isActive = false;
    this.notify("mode-reset");
  }

  // ============== State Accessors ==============

  getState(): Readonly<InputState> {
    return this.state;
  }

  getPointer(): Readonly<PointerState> {
    return this.state.pointer;
  }

  getDrag(): Readonly<DragState> {
    return this.state.drag;
  }

  getKeyboard(): Readonly<KeyboardState> {
    return this.state.keyboard;
  }

  isDragging(): boolean {
    return this.state.drag.isActive;
  }

  isDraggingElement(element: InputElement, elementId?: string): boolean {
    return this.state.drag.isActive &&
      this.state.drag.element === element &&
      (elementId === undefined || this.state.drag.elementId === elementId);
  }

  isKeyPressed(key: string): boolean {
    return this.state.keyboard.pressedKeys.has(key);
  }

  getModifiers(): Readonly<{ ctrl: boolean; shift: boolean; alt: boolean; meta: boolean }> {
    return this.state.keyboard.modifiers;
  }

  isModifierPressed(modifier: "ctrl" | "shift" | "alt" | "meta"): boolean {
    return this.state.keyboard.modifiers[modifier];
  }

  isCaptured(): boolean {
    return this.state.capturedBy !== "none";
  }

  isCapturedBy(element: InputElement): boolean {
    return this.state.capturedBy === element;
  }

  setFocusedElement(element: InputElement): void {
    this.state.focusedElement = element;
  }

  getFocusedElement(): InputElement {
    return this.state.focusedElement;
  }

  // ============== Configuration ==============

  setDragThreshold(threshold: number): void {
    this.dragThreshold = Math.max(0, Math.min(50, threshold)); // Clamp to reasonable range
  }

  getDragThreshold(): number {
    return this.dragThreshold;
  }

  // ============== Event Subscription ==============

  on(event: string, callback: (data?: unknown) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const callbacks = this.listeners.get(event)!;
    callbacks.add(callback);

    return () => {
      callbacks.delete(callback);
      // Clean up empty sets
      if (callbacks.size === 0) {
        this.listeners.delete(event);
      }
    };
  }

  private notify(event: string, data?: unknown): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      // Create array copy to prevent issues if callbacks modify the set during iteration
      const callbacksArray = Array.from(callbacks);
      for (const cb of callbacksArray) {
        try {
          cb(data);
        } catch (error) {
          console.error(`[InputManager] Error in ${event} listener:`, error);
        }
      }
    }
  }

  // ============== Testing Utilities ==============

  /**
   * Reset all state (useful for testing)
   */
  reset(): void {
    this.state = this.createInitialState();
    this.registrations.clear();
    this.listeners.clear();
    this.currentClickSequenceId = 0;
    this.notify("reset");
  }

  /**
   * Simulate a key press (for testing)
   */
  simulateKeyPress(key: string, modifiers?: Partial<{ ctrl: boolean; shift: boolean; alt: boolean; meta: boolean }>): void {
    const event = new KeyboardEvent("keydown", {
      key,
      ctrlKey: modifiers?.ctrl ?? false,
      shiftKey: modifiers?.shift ?? false,
      altKey: modifiers?.alt ?? false,
      metaKey: modifiers?.meta ?? false,
    });
    this.onKeyDown(event);
  }

  /**
   * Get all registered handlers (for debugging)
   */
  getRegistrations(): ReadonlyArray<HandlerRegistration> {
    return Array.from(this.registrations.values());
  }
}

// ============== Singleton Instance ==============

// Lazy initialization to avoid SSR issues
let inputManagerInstance: InputManager | null = null;

function getInputManager(): InputManager {
  if (!inputManagerInstance) {
    inputManagerInstance = new InputManager();
  }
  return inputManagerInstance;
}

// Export a proxy that defers access until first use
// Properly handles method calls by binding to the instance
export const inputManager = new Proxy({} as InputManager, {
  get(_target, prop) {
    const instance = getInputManager();
    const value = instance[prop as keyof InputManager];

    // If it's a function, bind it to the instance
    if (typeof value === 'function') {
      return value.bind(instance);
    }

    return value;
  },
}) as InputManager;

// ============== React Hook ==============

export interface UseInputManagerOptions {
  element: InputElement;
  elementId?: string;
  priority?: number;
  enabled?: boolean;
}

export interface InputManagerCallbacks {
  onMouseDown?: (e: MouseEvent) => boolean;
  onMouseMove?: (e: MouseEvent) => boolean;
  onMouseUp?: (e: MouseEvent) => boolean;
  onClick?: (e: MouseEvent) => boolean;
  onDblClick?: (e: MouseEvent) => boolean;
  onWheel?: (e: WheelEvent) => boolean;
  onContextMenu?: (e: MouseEvent) => boolean;
  onKeyDown?: (e: KeyboardEvent) => boolean;
  onKeyUp?: (e: KeyboardEvent) => boolean;
  onKeyPress?: (e: KeyboardEvent) => boolean;
}

/**
 * React hook for input manager
 * Register input handlers with auto-cleanup on unmount
 */
export function useInputManager(
  options: UseInputManagerOptions,
  callbacks?: InputManagerCallbacks
): void {
  const { element, elementId, priority, enabled = true } = options;

  // Use refs to maintain stable references for handlers
  const enabledRef = useRef(enabled);
  const callbacksRef = useRef(callbacks);

  // Update refs in effect, not during render
  useEffect(() => {
    enabledRef.current = enabled;
    callbacksRef.current = callbacks;
  });

  useEffect(() => {
    if (!enabled) return;

    const cleanup = inputManager.register({
      element,
      elementId,
      priority,
      handlers: {
        mouse: {
          down: (e) => callbacksRef.current?.onMouseDown?.(e) ?? false,
          move: (e) => callbacksRef.current?.onMouseMove?.(e) ?? false,
          up: (e) => callbacksRef.current?.onMouseUp?.(e) ?? false,
          click: (e) => callbacksRef.current?.onClick?.(e) ?? false,
          dblClick: (e) => callbacksRef.current?.onDblClick?.(e) ?? false,
          wheel: (e) => callbacksRef.current?.onWheel?.(e) ?? false,
          contextMenu: (e) => callbacksRef.current?.onContextMenu?.(e) ?? false,
        },
        keyboard: {
          down: (e) => callbacksRef.current?.onKeyDown?.(e) ?? false,
          up: (e) => callbacksRef.current?.onKeyUp?.(e) ?? false,
          press: (e) => callbacksRef.current?.onKeyPress?.(e) ?? false,
        },
      },
      enabled: () => enabledRef.current,
    });

    return cleanup;
  }, [element, elementId, priority, enabled]);
}

// ============== Utility Hooks ==============

export interface UseDragOptions {
  element: InputElement;
  elementId?: string;
  priority?: number;
  enabled?: boolean;
  threshold?: number;
  onStart?: (e: MouseEvent) => void;
  onMove?: (e: MouseEvent, delta: { x: number; y: number }) => void;
  onEnd?: (e: MouseEvent, wasDragging: boolean) => void;
  onClick?: (e: MouseEvent) => void;
  onDblClick?: (e: MouseEvent) => void;
}

/**
 * Hook for unified drag handling with click vs drag detection
 */
export function useDrag(options: UseDragOptions): void {
  const {
    element,
    elementId,
    priority,
    enabled = true,
    threshold,
    onStart,
    onMove,
    onEnd,
    onClick,
    onDblClick,
  } = options;

  const dragStartRef = useRef<{ x: number; y: number; sequenceId: number } | null>(null);
  const hasMovedRef = useRef(false);

  useInputManager(
    { element, elementId, priority, enabled },
    {
      onMouseDown: (e) => {
        if (e.button !== 0) return false; // Only left click
        dragStartRef.current = { x: e.clientX, y: e.clientY, sequenceId: Date.now() };
        hasMovedRef.current = false;
        onStart?.(e);
        return true; // Capture event
      },
      onMouseMove: (e) => {
        if (!dragStartRef.current) return false;

        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const currentThreshold = threshold ?? inputManager.getDragThreshold();

        if (distance > currentThreshold) {
          hasMovedRef.current = true;
          onMove?.(e, { x: dx, y: dy });
        }

        return true;
      },
      onMouseUp: (e) => {
        const wasDragging = hasMovedRef.current;
        dragStartRef.current = null;
        hasMovedRef.current = false;

        if (wasDragging) {
          onEnd?.(e, true);
        } else {
          onEnd?.(e, false);
          onClick?.(e);
        }

        return false;
      },
      onDblClick: (e) => {
        onDblClick?.(e);
        return true;
      },
    }
  );
}

export interface UseKeyboardOptions {
  enabled?: boolean;
  onEscape?: (e: KeyboardEvent) => boolean;
  onDelete?: (e: KeyboardEvent) => boolean;
  onEnter?: (e: KeyboardEvent) => boolean;
  onSpace?: (e: KeyboardEvent) => boolean;
  onArrowUp?: (e: KeyboardEvent) => boolean;
  onArrowDown?: (e: KeyboardEvent) => boolean;
  onArrowLeft?: (e: KeyboardEvent) => boolean;
  onArrowRight?: (e: KeyboardEvent) => boolean;
  onKey?: (key: string, e: KeyboardEvent) => boolean;
  scope?: InputElement;
}

/**
 * Hook for keyboard shortcuts with scope support
 */
export function useKeyboard(options: UseKeyboardOptions): void {
  const {
    enabled = true,
    onEscape,
    onDelete,
    onEnter,
    onSpace,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onKey,
    scope = "none",
  } = options;

  useInputManager(
    { element: scope, priority: INPUT_PRIORITY.POPUP, enabled },
    {
      onKeyDown: (e) => {
        // Safely check target
        if (!isHTMLElement(e.target)) {
          return onKey?.(e.key, e) ?? false;
        }

        const target = e.target;

        // Check if typing in an input field
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          // Only handle Escape in input fields
          if (e.key === "Escape") {
            return onEscape?.(e) ?? false;
          }
          return false; // Let input handle other keys
        }

        switch (e.key) {
          case "Escape":
            return onEscape?.(e) ?? false;
          case "Delete":
          case "Backspace":
            return onDelete?.(e) ?? false;
          case "Enter":
            return onEnter?.(e) ?? false;
          case " ":
            return onSpace?.(e) ?? false;
          case "ArrowUp":
            return onArrowUp?.(e) ?? false;
          case "ArrowDown":
            return onArrowDown?.(e) ?? false;
          case "ArrowLeft":
            return onArrowLeft?.(e) ?? false;
          case "ArrowRight":
            return onArrowRight?.(e) ?? false;
          default:
            return onKey?.(e.key, e) ?? false;
        }
      },
    }
  );
}
