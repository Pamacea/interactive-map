# Input Manager System

## Overview

The Input Manager is a centralized system for handling all user input events in the application. It provides:

- **Priority-based event routing**: Higher priority elements capture events first
- **Unified drag handling**: Consistent click vs drag detection across all elements
- **Keyboard shortcuts**: Global and scoped keyboard handlers
- **Event capture**: Prevents conflicts between overlapping UI elements

## Architecture

### Priority Order (highest to lowest)

1. **Context Menu** (100) - Right-click menus
2. **Popup** (90) - Modal dialogs, pin popups
3. **Pin Marker** (80) - Draggable pins
4. **Map Canvas** (50) - Map panning, zooming
5. **Sidebar** (40) - Side panels
6. **Zoom Controls** (30) - Zoom buttons
7. **Input Field** (20) - Text inputs

## Usage

### Basic Event Capture

```tsx
import { useEventCapture } from "@/hooks/use-event-capture";

function MyPopup({ onClose }) {
  useEventCapture({
    scope: "popup",
    onEscape: onClose,
  });

  return <div>Popup content</div>;
}
```

### Keyboard Shortcuts

```tsx
import { useKeyboardShortcuts, COMMON_SHORTCUTS } from "@/hooks/use-keyboard-shortcuts";

function Editor({ onSave, onClose, onDelete }) {
  useKeyboardShortcuts({
    shortcuts: [
      { ...COMMON_SHORTCUTS.CLOSE, handler: onClose },
      { ...COMMON_SHORTCUTS.SAVE, handler: onSave },
      { ...COMMON_SHORTCUTS.DELETE, handler: onDelete },
    ],
    scope: "popup",
  });

  return <div>Editor content</div>;
}
```

### Custom Drag Handling

```tsx
import { useDrag } from "@/lib/input-manager";

function DraggableElement({ onDrag, onClick }) {
  useDrag({
    element: "pin-marker",
    elementId: "my-element",
    onStart: () => console.log("drag started"),
    onMove: (e, delta) => onDrag(delta),
    onEnd: (e, wasDragging) => {
      if (!wasDragging) onClick(e);
    },
  });

  return <div>Drag me</div>;
}
```

### Low-Level Registration

```tsx
import { inputManager, INPUT_PRIORITY } from "@/lib/input-manager";

useEffect(() => {
  const cleanup = inputManager.register({
    element: "map-canvas",
    priority: INPUT_PRIORITY.MAP_CANVAS,
    handlers: {
      mouse: {
        down: (e) => {
          console.log("mouse down", e);
          return false; // Capture event
        },
        move: (e) => {
          console.log("mouse move", e);
          return false;
        },
        up: (e) => {
          console.log("mouse up", e);
          return true; // Let other handlers process
        },
      },
      keyboard: {
        down: (e) => {
          if (e.key === "Escape") {
            console.log("escape pressed");
            return false; // Prevent default
          }
          return true;
        },
      },
    },
    enabled: () => !isDisabled,
  });

  return cleanup;
}, [isDisabled]);
```

## Hooks Reference

### `useInputManager(options, callbacks)`

Register input handlers for an element with auto-cleanup.

**Options:**
- `element: InputElement` - The type of element
- `elementId?: string` - Unique ID for this instance
- `priority?: number` - Priority for event routing
- `enabled?: boolean` - Whether handlers are active

**Callbacks:**
- `onMouseDown?`, `onMouseMove?`, `onMouseUp?`
- `onClick?`, `onDblClick?`, `onWheel?`, `onContextMenu?`
- `onKeyDown?`, `onKeyUp?`, `onKeyPress?`

### `useDrag(options)`

Unified drag handling with click vs drag detection.

**Options:**
- `element: InputElement` - The element type
- `elementId?: string` - Unique ID
- `threshold?: number` - Drag threshold in pixels (default: 5)
- `onStart?` - Called when drag starts
- `onMove?` - Called during drag with delta
- `onEnd?` - Called when drag ends (with wasDragging flag)
- `onClick?` - Called if no drag occurred
- `onDblClick?` - Called on double click

### `useKeyboard(options)`

Global keyboard shortcuts with input field awareness.

**Options:**
- `enabled?: boolean`
- `onEscape?`, `onDelete?`, `onEnter?`, `onSpace?`
- `onArrowUp?`, `onArrowDown?`, `onArrowLeft?`, `onArrowRight?`
- `onKey?` - Fallback for any other key
- `scope?: InputElement` - Scope for priority

### `useKeyboardShortcuts(options)`

Declarative keyboard shortcuts.

**Options:**
- `shortcuts: KeyboardShortcut[]` - Array of shortcuts
- `enabled?: boolean`
- `scope?: InputElement`
- `ignoreInputFields?: boolean` - Don't trigger when typing

### `useEventCapture(options)`

Simple event capture for popups/dialogs.

**Options:**
- `enabled?: boolean`
- `scope?: "context-menu" | "popup" | "sidebar" | "input-field"`
- `onEscape?: () => void` - Escape key handler
- `onCaptureLost?: () => void` - Called when another element captures

## Migration Guide

### Before (Old Event Manager)

```tsx
import { eventManager } from "@/lib/event-manager";

useEffect(() => {
  const release = eventManager.capture("pin-popup");
  return () => release();
}, []);

useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };
  document.addEventListener("keydown", handleEscape);
  return () => document.removeEventListener("keydown", handleEscape);
}, [onClose]);
```

### After (New Input Manager)

```tsx
import { useEventCapture } from "@/hooks/use-event-capture";

useEventCapture({
  scope: "popup",
  onEscape: onClose,
});
```

## Events Flow

```
User Input (mouse/keyboard)
    ↓
Input Manager (singleton)
    ↓
Sort registrations by priority
    ↓
Dispatch to highest priority handler
    ↓
If handler returns false → stop propagation
If handler returns true → continue to next handler
```

## State Access

```tsx
// Get current state
const state = inputManager.getState();

// Check if dragging
if (inputManager.isDragging()) { }

// Check specific element
if (inputManager.isDraggingElement("pin-marker", "pin-123")) { }

// Check keyboard
if (inputManager.isKeyPressed("Escape")) { }
if (inputManager.isModifierPressed("ctrl")) { }

// Get pointer position
const pointer = inputManager.getPointer();
console.log(pointer.x, pointer.y);
```

## Testing Utilities

```tsx
import { inputManager } from "@/lib/input-manager";

// Reset all state
inputManager.reset();

// Simulate key press
inputManager.simulateKeyPress("Escape", { ctrl: true });

// Get all registrations (debugging)
console.log(inputManager.getRegistrations());
```
