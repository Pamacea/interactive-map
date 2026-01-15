# Pin Feature Hook API Documentation

This document provides detailed API documentation for all custom hooks in the pin feature. Each hook includes TypeScript types, parameters, return values, and usage examples.

---

## Table of Contents

1. [usePinDrag](#usepindrag) - Drag-and-drop functionality
2. [usePinPosition](#usepinposition) - Position calculation
3. [usePinEvents](#usepinevents) - Event handling

---

## usePinDrag

Handles all drag-and-drop functionality for pin markers, including position clamping, optimistic updates, and database synchronization.

### Import

```typescript
import { usePinDrag } from "@/components/pins/logic/use-pin-drag";
```

### Type Signature

```typescript
function usePinDrag(config: UsePinDragConfig): UsePinDragReturn
```

### Parameters

#### `UsePinDragConfig`

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `pinId` | `string` | Yes | - | Unique identifier of the pin |
| `latitude` | `number` | Yes | - | Initial latitude position (0-1 range) |
| `longitude` | `number` | Yes | - | Initial longitude position (0-1 range) |
| `mapWidth` | `number` | Yes | - | Map width in pixels for boundary clamping |
| `mapHeight` | `number` | Yes | - | Map height in pixels for boundary clamping |
| `scale` | `number` | Yes | - | Current transform scale for coordinate conversion |
| `isLocked` | `boolean` | No | `false` | Whether the layer is locked (prevents dragging) |
| `onSelectPin` | `(pinId: string) => void` | No | - | Callback when pin is selected on drag start |
| `onUpdatePin` | `(pinId: string, updates: { latitude: number; longitude: number }) => void` | No | - | Callback for optimistic updates (Zustand store) |

### Return Value

#### `UsePinDragReturn`

| Property | Type | Description |
|----------|------|-------------|
| `isDragging` | `boolean` | Whether the pin is currently being dragged |
| `dragPosition` | `{ x: number; y: number } \| null` | Current drag position in pixels (null if not dragging) |
| `hasMovedDuringDrag` | `boolean` | Whether the pin moved significantly (prevents click after drag) |
| `handleMouseDown` | `(e: React.MouseEvent) => void` | Mouse down handler to attach to pin element |

### Usage Example

```typescript
import { usePinDrag } from "@/components/pins/logic/use-pin-drag";
import { usePinsStore } from "@/stores/use-pins-store";

function PinMarker({ pin, mapWidth, mapHeight, transform }) {
  const selectPin = usePinsStore((state) => state.selectPin);
  const updatePin = usePinsStore((state) => state.updatePin);
  const layer = useMapStore((state) =>
    state.layers.find((l) => l.id === pin.layerId)
  );

  const { isDragging, dragPosition, hasMovedDuringDrag, handleMouseDown } = usePinDrag({
    pinId: pin.id,
    latitude: pin.latitude,
    longitude: pin.longitude,
    mapWidth,
    mapHeight,
    scale: transform.scale,
    isLocked: layer?.locked ?? false,
    onSelectPin: selectPin,
    onUpdatePin: updatePin,
  });

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        left: `${dragPosition?.x ?? pin.longitude * mapWidth}px`,
        top: `${dragPosition?.y ?? pin.latitude * mapHeight}px`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      {/* Pin content */}
    </div>
  );
}
```

### Behavior

#### Drag Initialization
- Drag starts only after **3px of movement** (prevents hover from triggering drag)
- Only left mouse button (`e.button === 0`) initiates drag
- Layer lock check prevents dragging on locked layers

#### During Drag
- Position is clamped to map boundaries (0 to mapWidth/mapHeight)
- Visual position updates in real-time
- `isDragging` becomes `true` after movement threshold
- Window-level event listeners ensure drag continues even if mouse leaves pin

#### Drag End
- On mouse up, position is saved to database via `updatePinPosition` Server Action
- **Optimistic update**: Zustand store updated first, DB sync happens asynchronously
- `hasMovedDuringDrag` prevents click event from firing after drag
- Window listeners are cleaned up

### Edge Cases Handled

- **Small movements**: < 3px doesn't trigger drag (allows clicking without dragging)
- **Layer locked**: Drag prevented entirely, click still works
- **Map boundaries**: Position clamped to [0, mapWidth] and [0, mapHeight]
- **DB sync failure**: Error logged, optimistic update kept (next page refresh syncs)
- **Rapid clicks**: Multiple clicks don't create multiple drag operations

### Testing

```typescript
import { renderHook, act } from "@testing-library/react";
import { usePinDrag } from "@/components/pins/logic/use-pin-drag";

test("drag position updates during mouse move", () => {
  const { result } = renderHook(() =>
    usePinDrag({
      pinId: "test-pin",
      latitude: 0.5,
      longitude: 0.5,
      mapWidth: 1000,
      mapHeight: 800,
      scale: 1,
      isLocked: false,
    })
  );

  act(() => {
    const mouseDownEvent = new MouseEvent("mousedown", { button: 0 });
    Object.assign(mouseDownEvent, { clientX: 100, clientY: 100 });
    result.current.handleMouseDown(mouseDownEvent);

    const mouseMoveEvent = new MouseEvent("mousemove", {
      clientX: 150, // 50px movement
      clientY: 150,
    });
    window.dispatchEvent(mouseMoveEvent);
  });

  expect(result.current.isDragging).toBe(true);
  expect(result.current.dragPosition).toEqual({ x: 550, y: 450 }); // 500 + 50, 400 + 50
});
```

---

## usePinPosition

Calculates pin pixel position from latitude/longitude coordinates, applying layer offsets and drag position overrides.

### Import

```typescript
import { usePinPosition } from "@/components/pins/logic/use-pin-position";
```

### Type Signature

```typescript
function usePinPosition(
  pin: Pin & { layer?: { id: string; isVisible: boolean; zIndex: number } | null },
  dragPosition: { x: number; y: number } | null,
  imageDimensions: { width: number; height: number } | undefined,
  transform: { scale: number; translateX: number; translateY: number },
  layers: Array<{ id: string; offsetX?: number; offsetY?: number; locked?: boolean }>
): ReturnType<typeof usePinPosition>
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pin` | `Pin & { layer?: ... }` | Yes | Pin data with optional layer relation |
| `dragPosition` | `{ x: number; y: number } \| null` | Yes | Current drag position (null if not dragging) |
| `imageDimensions` | `{ width: number; height: number } \| undefined` | Yes | Original image dimensions from MapImage |
| `transform` | `{ scale: number; translateX: number; translateY: number }` | Yes | Map transform state (not used in calculation but kept for consistency) |
| `layers` | `Array<{ id: string; offsetX?: number; offsetY?: number; locked?: boolean }>` | Yes | Available layers for offset lookup |

### Return Value

#### `PinPosition`

| Property | Type | Description |
|----------|------|-------------|
| `x` | `number` | Calculated X position in pixels (with layer offset) |
| `y` | `number` | Calculated Y position in pixels (with layer offset) |
| `actualWidth` | `number` | Image width in pixels |
| `actualHeight` | `number` | Image height in pixels |
| `layer` | `Layer \| null` | Layer object (if pin has layerId) |
| `layerOffsetX` | `number` | Layer X offset in pixels |
| `layerOffsetY` | `number` | Layer Y offset in pixels |
| `latitude` | `number` | Latitude (0-1 range, using drag position if dragging) |
| `longitude` | `number` | Longitude (0-1 range, using drag position if dragging) |

### Usage Example

```typescript
import { usePinPosition } from "@/components/pins/logic/use-pin-position";

function PinMarker({ pin, dragPosition, imageDimensions, transform, layers }) {
  const position = usePinPosition(
    pin,
    dragPosition,
    imageDimensions,
    transform,
    layers
  );

  return (
    <div
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      Pin at {position.latitude.toFixed(2)}, {position.longitude.toFixed(2)}
      {position.layer && `(Layer: ${position.layer.id})`}
    </div>
  );
}
```

### Behavior

#### Coordinate Conversion
- Converts latitude/longitude (0-1 range) to pixel coordinates
- Uses `imageDimensions?.width/height` if available, otherwise falls back to 0
- Multiplies longitude by width, latitude by height

#### Layer Offset Application
- Finds layer by `pin.layerId` in the `layers` array
- Adds `layer.offsetX` and `layer.offsetY` to final position
- Defaults to 0 offset if layer not found

#### Drag Position Override
- If `dragPosition` is provided (during active drag), uses it instead of `pin.latitude/longitude`
- Converts drag position from pixels back to percentage for consistency
- Ensures smooth visual feedback during drag

#### Memoization
- All calculations are memoized using `useMemo`
- Only recalculates when dependencies change (pin, dragPosition, imageDimensions, layers)
- Prevents unnecessary recalculations on every render

### Type Exports

```typescript
import type { PinPosition, PinPositionCoordinates, PinPositionDimensions } from "@/components/pins/logic/use-pin-position";

// PinPosition: Full return type
// PinPositionCoordinates: { x: number; y: number }
// PinPositionDimensions: { actualWidth: number; actualHeight: number }
```

### Testing

```typescript
import { renderHook } from "@testing-library/react";
import { usePinPosition } from "@/components/pins/logic/use-pin-position";

test("calculates position without layer offset", () => {
  const pin = {
    id: "test-pin",
    latitude: 0.5,
    longitude: 0.5,
    layerId: null,
  };

  const { result } = renderHook(() =>
    usePinPosition(pin, null, { width: 1000, height: 800 }, { scale: 1, translateX: 0, translateY: 0 }, [])
  );

  expect(result.current.x).toBe(500); // 0.5 * 1000
  expect(result.current.y).toBe(400); // 0.5 * 800
  expect(result.current.layer).toBeNull();
});

test("applies layer offset to position", () => {
  const pin = {
    id: "test-pin",
    latitude: 0.5,
    longitude: 0.5,
    layerId: "layer-1",
  };

  const layers = [
    { id: "layer-1", offsetX: 100, offsetY: 50, locked: false }
  ];

  const { result } = renderHook(() =>
    usePinPosition(pin, null, { width: 1000, height: 800 }, { scale: 1, translateX: 0, translateY: 0 }, layers)
  );

  expect(result.current.x).toBe(600); // 500 + 100
  expect(result.current.y).toBe(450); // 400 + 50
  expect(result.current.layerOffsetX).toBe(100);
  expect(result.current.layerOffsetY).toBe(50);
});
```

---

## usePinEvents

Manages pin event interactions, including hover state, event capture, and integration with the pins store.

### Import

```typescript
import { usePinEvents } from "@/components/pins/logic/use-pin-events";
```

### Type Signature

```typescript
function usePinEvents(params: {
  pinId: string;
  isDragging: boolean;
  isPinSelected: boolean;
}): {
  isHovered: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}
```

### Parameters

#### `UsePinEventsParams`

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `pinId` | `string` | Yes | Unique identifier of the pin |
| `isDragging` | `boolean` | Yes | Whether the pin is currently being dragged |
| `isPinSelected` | `boolean` | Yes | Whether the pin is currently selected |

### Return Value

#### `UsePinEventsReturn`

| Property | Type | Description |
|----------|------|-------------|
| `isHovered` | `boolean` | Whether the pin is currently hovered |
| `handleMouseEnter` | `() => void` | Mouse enter event handler |
| `handleMouseLeave` | `() => void` | Mouse leave event handler |

### Usage Example

```typescript
import { usePinEvents } from "@/components/pins/logic/use-pin-events";
import { usePinsStore } from "@/stores/use-pins-store";

function PinMarker({ pin, isDragging }) {
  const selectedPinId = usePinsStore((state) => state.selectedPinId);
  const isPinSelected = selectedPinId === pin.id;

  const { isHovered, handleMouseEnter, handleMouseLeave } = usePinEvents({
    pinId: pin.id,
    isDragging,
    isPinSelected,
  });

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        opacity: isHovered ? 1 : 0.8,
        transform: isHovered ? "scale(1.1)" : "scale(1)",
      }}
    >
      {/* Pin content */}
    </div>
  );
}
```

### Behavior

#### Hover State Management
- Local `isHovered` state tracks hover for this specific pin
- State updates on `mouseenter` and `mouseleave` events

#### Event Capture
- When hovered or selected, registers event capture via `eventManager.capture("pin-marker")`
- **Prevents deselection bug**: Ensures map clicks don't interfere with pin interactions
- Automatically cleans up capture on unmount or state change

#### Global Hover Tracking
- Calls `setHoverPin(pinId)` from `usePinsStore` on mouse enter
- Calls `setHoverPin(null)` from `usePinsStore` on mouse leave
- Allows other components to know which pin is hovered

#### Drag Exclusion
- Does NOT capture events during active drag (`isDragging === true`)
- Drag operations have their own event handling via `usePinDrag`

### Event Manager Integration

The hook uses the global `eventManager` to prevent event propagation issues:

```typescript
// In lib/event-manager.ts
export const eventManager = {
  capture: (source: string) => {
    // Register event source
    // Returns cleanup function
    return () => { /* release capture */ };
  },
};
```

This prevents the "deselection bug" where clicking outside pins would deselect the current pin.

### Cleanup

The `useEffect` automatically cleans up event capture:

```typescript
useEffect(() => {
  if (!isDragging && (isHovered || isPinSelected)) {
    const release = eventManager.capture("pin-marker");
    return () => release(); // Cleanup on unmount or state change
  }
}, [isHovered, isPinSelected, isDragging]);
```

### Testing

```typescript
import { renderHook, act } from "@testing-library/react";
import { usePinEvents } from "@/components/pins/logic/use-pin-events";
import { usePinsStore } from "@/stores/use-pins-store";

vi.mock("@/stores/use-pins-store");

test("sets hover state on mouse enter", () => {
  const setHoverPin = vi.fn();
  usePinsStore.mockReturnValue({ setHoverPin });

  const { result } = renderHook(() =>
    usePinEvents({
      pinId: "test-pin",
      isDragging: false,
      isPinSelected: false,
    })
  );

  act(() => {
    result.current.handleMouseEnter();
  });

  expect(result.current.isHovered).toBe(true);
  expect(setHoverPin).toHaveBeenCalledWith("test-pin");
});

test("clears hover state on mouse leave", () => {
  const setHoverPin = vi.fn();
  usePinsStore.mockReturnValue({ setHoverPin });

  const { result } = renderHook(() =>
    usePinEvents({
      pinId: "test-pin",
      isDragging: false,
      isPinSelected: false,
    })
  );

  act(() => {
    result.current.handleMouseEnter();
    result.current.handleMouseLeave();
  });

  expect(result.current.isHovered).toBe(false);
  expect(setHoverPin).toHaveBeenCalledWith(null);
});
```

---

## Combined Usage Example

Here's how all three hooks work together in `PinMarker`:

```typescript
import { usePinDrag, usePinPosition, usePinEvents } from "@/components/pins/logic";
import { usePinsStore, useMapStore } from "@/stores";

function PinMarker({ pin, mapWidth, mapHeight, imageDimensions, transform }) {
  // Store interactions
  const selectPin = usePinsStore((state) => state.selectPin);
  const updatePin = usePinsStore((state) => state.updatePin);
  const selectedPinId = usePinsStore((state) => state.selectedPinId);
  const layers = useMapStore((state) => state.layers);

  const isPinSelected = selectedPinId === pin.id;

  // Position calculation
  const { isDragging, dragPosition, hasMovedDuringDrag, handleMouseDown } = usePinDrag({
    pinId: pin.id,
    latitude: pin.latitude,
    longitude: pin.longitude,
    mapWidth: imageDimensions?.width ?? mapWidth,
    mapHeight: imageDimensions?.height ?? mapHeight,
    scale: transform.scale,
    isLocked: layer?.locked ?? false,
    onSelectPin: selectPin,
    onUpdatePin: updatePin,
  });

  const { x, y, layer } = usePinPosition(pin, dragPosition, imageDimensions, transform, layers);

  const { isHovered, handleMouseEnter, handleMouseLeave } = usePinEvents({
    pinId: pin.id,
    isDragging,
    isPinSelected,
  });

  const handleClick = (e: React.MouseEvent) => {
    if (hasMovedDuringDrag) return; // Don't click if just finished dragging
    e.stopPropagation();
    selectPin(pin.id);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        cursor: isDragging ? "grabbing" : layer?.locked ? "not-allowed" : "pointer",
        opacity: isHovered ? 1 : pin.opacity,
      }}
    >
      {/* Pin content */}
    </div>
  );
}
```

---

## TypeScript Support

All hooks are fully typed with TypeScript. Import types for type-safe usage:

```typescript
import type {
  UsePinDragConfig,
  UsePinDragReturn,
  PinPosition,
  PinPositionCoordinates,
  PinPositionDimensions,
  UsePinEventsParams,
  UsePinEventsReturn,
} from "@/components/pins/logic";
```

---

## Best Practices

### 1. Hook Dependencies
Ensure all dependencies are included in useCallback/useMemo arrays:

```typescript
// Good
const handleMouseDown = useCallback((e) => {
  // ...
}, [isLocked, pinId, onSelectPin, handleMouseMove, handleMouseUp]);

// Bad - missing dependencies
const handleMouseDown = useCallback((e) => {
  // ...
}, []); // Will use stale values
```

### 2. Ref Usage for Drag State
Use refs for values that need to be accessed in event listeners without triggering re-renders:

```typescript
const isDraggingRef = useRef(false);

// Good - ref value accessible in closure
const handleMouseMove = useCallback((e) => {
  if (!isDraggingRef.current) return;
  // ...
}, []);
```

### 3. Cleanup
Always clean up event listeners and subscriptions:

```typescript
useEffect(() => {
  const release = eventManager.capture("pin-marker");
  return () => release(); // Cleanup
}, [isHovered, isPinSelected]);
```

### 4. Optimistic Updates
Update local state first, sync with server asynchronously:

```typescript
// Update Zustand store immediately
onUpdatePin(pinId, { latitude, longitude });

// Sync with DB in background
updatePinPosition(pinId, latitude, longitude).catch((error) => {
  console.error("Failed to save:", error);
  // Keep optimistic update
});
```

---

## Questions or Issues?

If you encounter problems with these hooks:
1. Check the test files for usage examples
2. Review the JSDoc comments in source files
3. Check the console for error messages
4. Create an issue with a minimal reproduction case

For more details, see:
- [REFACTORING.md](../../REFACTORING.md) - Overall refactoring summary
- [CLAUDE.md](../../CLAUDE.md) - Architecture patterns
- Test files in `src/components/pins/logic/__tests__/`
