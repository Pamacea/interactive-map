# Implementation Plan - Pin Feature Critical Bugs Fix

## Overview

Complete rewrite of pin positioning system to fix critical bugs where:
- Pins don't spawn at mouse position when creating
- Popup doesn't follow the pin
- Drag may have coordinate issues

## Files to Create

| File | Purpose | Size |
|------|---------|------|
| `src/components/pins/logic/use-pin-screen-coordinates.ts` | Shared coordinate calculation hook | Medium |

## Files to Modify

| File | Changes | Risk |
|---------|---------|------|
| `src/components/world/logic/use-map-interactions.ts` | Fix coordinate calculation for pin creation | High |
| `src/components/world/ui/selected-pin-popup.tsx` | Rewrite positioning to match pins | High |
| `src/components/pins/logic/use-pin-position.ts` | Add screen position calculation | Medium |
| `src/components/pins/ui/pin-marker.tsx` | Update to use new coordinate system | Low |
| `src/components/world/ui/map-canvas/map-pins-wrapper.tsx` | Restructure popup rendering | Medium |

## Acceptance Criteria

### Functional Requirements
- [ ] Pin created at exact mouse position when right-clicking
- [ ] Popup appears directly above its pin (with layer offset applied)
- [ ] Popup follows pin during drag operations
- [ ] Drag operation updates pin position smoothly
- [ ] Pins respect layer offsets (offsetX, offsetY)
- [ ] All operations work correctly during pan/zoom

### Non-Functional Requirements
- [ ] Code passes linting
- [ ] Code passes typecheck
- [ ] Build succeeds
- [ ] No console errors during operations
- [ ] Performance maintained (60fps during drag)

## Implementation Steps

### Phase 1: Core Coordinate System

**Step 1**: Create `use-pin-screen-coordinates.ts`
- Extract coordinate calculation logic
- Handle all transforms: translateX, translateY, scale
- Apply layer offsets
- Return both map coordinates (0-1) and screen coordinates (pixels)

**Step 2**: Update `use-pin-position.ts`
- Add screen position calculation
- Ensure consistency with new hook
- Export types for consumers

### Phase 2: Fix Pin Creation

**Step 3**: Fix `use-map-interactions.ts`
- Rewrite coordinate calculation in `handleContextMenu`
- Use proper transform-aware mouse position
- Ensure correct lat/lng storage

### Phase 3: Fix Popup Positioning

**Step 4**: Rewrite `selected-pin-popup.tsx`
- Use same coordinate calculation as pins
- Apply layer offsets correctly
- Ensure popup follows during drag

**Step 5**: Update `map-pins-wrapper.tsx`
- Ensure popup has access to same props as pins
- Pass transform, imageDimensions, layers

### Phase 4: Validation

**Step 6**: Test all scenarios
- Create pin at various positions
- Drag pin and verify popup follows
- Test with layers that have offsets
- Test during pan/zoom
- Verify popup closes correctly

## Risk Assessment

### High Risk Items
- **Coordinate calculation changes** - Affects all pin operations
  - **Mitigation**: Create shared hook, test extensively
- **Popup positioning rewrite** - Could break layout
  - **Mitigation**: Use same calculation as pins (known working)

### Medium Risk Items
- **Layer offset application** - May have edge cases
  - **Mitigation**: Test with various layer configurations
- **Transform during pan/zoom** - Complex interaction
  - **Mitigation**: Test with various zoom levels

### Low Risk Items
- **Type exports** - Simple additions
- **UI component updates** - Visual only, doesn't affect logic

## Success Metrics

1. **Pin Creation Accuracy**: Pin spawns within 5px of mouse position
2. **Popup Alignment**: Popup center aligns with pin center (accounting for offsets)
3. **Drag Smoothness**: No visual lag during drag operations
4. **Layer Support**: All layer features work correctly

## Rollback Plan

If issues arise:
1. Revert to original positioning for pins (already working)
2. Keep coordinate fix for creation only
3. Popup can remain detached temporarily

## Notes

- The current pin marker positioning (via `usePinPosition`) is actually CORRECT
- The issue is that popup and creation don't use the same logic
- Solution: Share the positioning logic between all components
