# Analysis Report - Pin Feature Critical Bugs

## Executive Summary

The pin feature has **critical bugs** that make it unusable. The main issues are:

1. **Pin positioning broken** - Pins don't spawn at mouse position when creating
2. **Popup positioning broken** - Popup doesn't follow the pin correctly
3. **Drag may not work properly** - Events may be captured incorrectly

## Root Cause Analysis

### Issue 1: Pin Positioning During Creation

**Problem**: In `use-map-interactions.ts:106-110`, the coordinate calculation is **incorrect**:

```typescript
// Convert to map coordinates (0-1 range)
const adjustedX = (x - transform.translateX) / transform.scale;
const adjustedY = (y - transform.translateY) / transform.scale;

const lng = adjustedX / imageDimensions.width;
const lat = adjustedY / imageDimensions.height;
```

**Why it's wrong**:
- `x` and `y` are calculated from `e.clientX - rect.left` which gives **container-relative** coordinates
- But the container has `transform: translateX/translateY` applied via CSS
- The coordinates don't account for the fact that the **map content itself** is transformed

**What should happen**:
- Need to get the actual mouse position relative to the **transformed map content**
- Currently, when user clicks at a specific location, the pin spawns elsewhere

### Issue 2: Popup Positioning

**Problem**: In `selected-pin-popup.tsx:38-42`:

```typescript
style={{
  left: `${selectedPin.longitude * 100}%`,
  top: `${selectedPin.latitude * 100}%`,
  transform: "translateX(-50%) translateY(-100%) translateY(-24px)",
}}
```

**Why it's wrong**:
1. **Missing layer offset** - The popup doesn't account for `layer.offsetX` and `layer.offsetY`
2. **The popup container is inside MapImage** which has `layerScale` applied but doesn't transform position
3. **Layer offsets are not applied** - Unlike `usePinPosition` which correctly applies them

**What happens**:
- When a pin is on a layer with offsets, the pin appears at correct position (via `usePinPosition`)
- But the popup appears at a different position (no offset applied)
- This causes the popup to be detached from the pin

### Issue 3: Marker Container Positioning

**Problem**: In `pin-marker/marker-container.tsx`, the positioning is:

```typescript
style={{
  left: x,
  top: y,
  transform: `translate(-50%, -50%) scale(${transformScale})`,
}}
```

**Why it's wrong**:
- `x` and `y` come from `usePinPosition` which correctly calculates position with layer offsets
- BUT the popup doesn't use the same calculation

## Detailed File Map

### Files Related to Pin Positioning

| File | Purpose | Status |
|------|---------|--------|
| `src/components/pins/logic/use-pin-position.ts` | Calculates pin position with layer offsets | ✅ Correct |
| `src/components/world/ui/selected-pin-popup.tsx` | Positions popup relative to pin | ❌ BROKEN - No layer offset |
| `src/components/world/logic/use-map-interactions.ts` | Handles click to create pin | ❌ BROKEN - Wrong coordinate calc |
| `src/components/pins/logic/use-pin-drag.ts` | Handles drag operations | ⚠️ May have issues |
| `src/components/world/ui/map-canvas/map-pins-wrapper.tsx` | Wraps pins and popup | ⚠️ Structure issue |

### Coordinate Flow

```
User clicks map
  ↓
handleContextMenu (use-map-interactions.ts)
  ↓
Calculates: lng = adjustedX / imageWidth, lat = adjustedY / imageHeight
  ↓
createPin() called with these coords
  ↓
Pin stored in DB with wrong coords
  ↓
Pin renders at wrong position
```

### The Transform Problem

The map uses CSS transforms:
- `MapTransformLayer` has: `translateX`, `translateY`, `scale`
- Mouse events give viewport coordinates
- Need to transform viewport → container → map-content

Current code does:
```
adjustedX = (e.clientX - rect.left) / scale
```

But should do:
```
adjustedX = (e.clientX - rect.left - transform.translateX) / scale
```

AND even that's not quite right because the transform is on the parent element.

## The Architecture Issue

### Current Structure Problem

```
MapCanvas
  └─ MapContainer (ref=containerRef)
      └─ MapTransformLayer (has translateX, translateY, scale)
          └─ MapContent
              └─ MapLayers
                  └─ MapPinsWrapper
                      └─ MapImage (has layerScale width/height)
                          ├─ PinsRenderer (renders pins)
                          └─ SelectedPinPopup (renders popup)
```

**Problem**: The popup is positioned as a child of `MapImage` but:
1. MapImage may have different dimensions due to `layerScale`
2. The coordinate system doesn't properly account for all transforms

## Issues Summary

### Critical Bugs

1. **Pin Creation Position** - `use-map-interactions.ts` - Incorrect coordinate conversion
2. **Popup Not Following Pin** - `selected-pin-popup.tsx` - Missing layer offset application
3. **Event Capture Issues** - May prevent proper drag/click interactions

### Design Issues

1. **Mixed coordinate systems** - Some places use pixels, some use percentages
2. **Transform not fully accounted for** - The `transform` prop isn't used correctly everywhere
3. **Popup positioning separate from pin positioning** - Should use same calculation logic

## Files That Need Complete Rewrite

1. `src/components/world/ui/selected-pin-popup.tsx` - Rewrite to use same positioning as pins
2. `src/components/world/logic/use-map-interactions.ts` - Fix coordinate calculation
3. Consider consolidating positioning logic into a single shared utility

## Recommendations

### Option A: Minimal Fix
- Fix the coordinate calculation in `use-map-interactions.ts`
- Add layer offset to popup positioning
- Test thoroughly

### Option B: Architectural Fix (Recommended)
- Create a single `usePinCoordinates` hook that:
  - Takes pin data + transform + container info
  - Returns proper screen coordinates
  - Used by BOTH pins and popup
- Refactor popup to be rendered alongside its pin
- Ensure consistent coordinate system throughout

## Next Steps

1. Create detailed implementation plan
2. Implement coordinate fix
3. Fix popup positioning
4. Test all scenarios (create, drag, select, pan, zoom)
