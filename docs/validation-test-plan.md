# UI Refinements Validation Test Plan
**User Story**: US-009 - Test and validate all UI refinements
**Branch**: feature/ui-refinements-pin-management
**Date**: 2026-01-13

---

## Test Environment
- **Browser**: Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Viewport**: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- **Test Data**: Existing world with map image, authenticated user session

---

## Test Suite 1: Zoom Control Icon Sizing (US-001)

### Test 1.1: Verify Icon Visual Balance
**Preconditions**: User is on world map page
**Steps**:
1. Locate zoom controls in bottom-right corner
2. Observe the plus (+) and minus (-) icons
3. Compare icon sizes to surrounding UI elements

**Expected Results**:
- Zoom icons are visibly smaller than before (reduced from w-5 h-5 to w-4 h-4)
- Icons are visually balanced with each other
- Icons maintain proper alignment within buttons
- Icons are clearly clickable (min 44x44px touch target)

**Priority**: High
**Status**: [ ] Pass [ ] Fail

---

### Test 1.2: Verify Icon Spacing
**Steps**:
1. Inspect the space between zoom icons
2. Check vertical gap between zoom in/out buttons

**Expected Results**:
- Consistent spacing between buttons
- No visual crowding or excessive whitespace
- Proper alignment with container edges

**Priority**: Medium
**Status**: [ ] Pass [ ] Fail

---

## Test Suite 2: Pin Button Migration to Sidebar (US-002)

### Test 2.1: Verify Button Location
**Preconditions**: User is on world map page
**Steps**:
1. Locate the sidebar on the left side
2. Scroll to Pins section (if collapsed, expand it)
3. Verify "Add Pin" button is present in sidebar header

**Expected Results**:
- "Add Pin" button is visible in sidebar Pins section
- Button is NOT present in zoom controls (bottom-right)
- Button placement follows visual hierarchy
- Button is easily discoverable by users

**Priority**: High
**Status**: [ ] Pass [ ] Fail

---

### Test 2.2: Verify Button Visual Design
**Steps**:
1. Observe the "Add Pin" button in its default state
2. Hover over the button
3. Click the button to open dropdown

**Expected Results**:
- Button uses design system colors (accent-gold)
- Proper rounded-sm corners
- Clear hover state with visual feedback
- Active state when dropdown is open
- ChevronDown icon rotates 180 degrees when open

**Priority**: High
**Status**: [ ] Pass [ ] Fail

---

## Test Suite 3: Dropdown Functionality (US-003)

### Test 3.1: Dropdown Open/Close
**Preconditions**: User is on world map page with sidebar visible
**Steps**:
1. Click "Add Pin" button in sidebar
2. Verify dropdown appears
3. Click "Add Pin" button again
4. Verify dropdown closes

**Expected Results**:
- Dropdown opens smoothly on first click
- Dropdown closes smoothly on second click
- Animation is fluid (200ms duration)
- No layout shift when opening/closing

**Priority**: High
**Status**: [ ] Pass [ ] Fail

---

### Test 3.2: Dropdown Outside Click
**Steps**:
1. Click "Add Pin" button to open dropdown
2. Click anywhere outside the dropdown (map area, other UI elements)
3. Verify dropdown closes

**Expected Results**:
- Dropdown closes on outside click
- Click detection works correctly across different regions
- No event propagation issues
- Click on dropdown content does not close it

**Priority**: High
**Status**: [ ] Pass [ ] Fail

---

### Test 3.3: Dropdown Escape Key
**Steps**:
1. Click "Add Pin" button to open dropdown
2. Press Escape key
3. Verify dropdown closes

**Expected Results**:
- Dropdown closes on Escape key press
- Focus returns to trigger button
- Keyboard navigation works properly

**Priority**: Medium
**Status**: [ ] Pass [ ] Fail

---

## Test Suite 4: Add Pin via Dropdown (US-004)

### Test 4.1: Primary Action - Add Pin
**Preconditions**: Dropdown is open
**Steps**:
1. Click "Add Pin" option (with Plus icon) in dropdown
2. Verify pin creation form modal opens
3. Cancel the form

**Expected Results**:
- Modal opens immediately after click
- Dropdown closes after selection
- Form is in create mode (not edit mode)
- All form fields are empty/default
- Modal is centered and properly z-indexed (z-50)

**Priority**: High
**Status**: [ ] Pass [ ] Fail

---

### Test 4.2: Verify Form Accessibility
**Steps**:
1. Open "Add Pin" form
2. Test keyboard navigation (Tab, Shift+Tab)
3. Test screen reader announcements (if available)

**Expected Results**:
- Tab order follows logical visual flow
- Focus trap works within modal
- Escape key closes modal
- ARIA labels are present

**Priority**: Medium
**Status**: [ ] Pass [ ] Fail

---

## Test Suite 5: Place Pin Mode via Dropdown (US-005)

### Test 5.1: Enable Place Pin Mode
**Preconditions**: Dropdown is open, place mode is inactive
**Steps**:
1. Click "Place Pin Mode" option (with Crosshair icon) in dropdown
2. Verify mode activation
3. Move cursor over map

**Expected Results**:
- Dropdown closes after selection
- Cursor changes to crosshair on map area
- "Place Pin Mode" text shows "(Active)" indicator
- Button in dropdown shows active state (bg-accent-gold/20)
- User can now right-click to add pins

**Priority**: High
**Status**: [ ] Pass [ ] Fail

---

### Test 5.2: Disable Place Pin Mode
**Preconditions**: Place pin mode is active
**Steps**:
1. Click "Place Pin Mode" option again
2. Verify mode deactivation
3. Move cursor over map

**Expected Results**:
- Mode toggles off (no longer active)
- Cursor returns to normal pointer
- "(Active)" indicator disappears
- Right-click no longer opens pin context menu

**Priority**: High
**Status**: [ ] Pass [ ] Fail

---

### Test 5.3: Visual Feedback
**Steps**:
1. Enable place pin mode
2. Observe cursor changes
3. Move cursor in and out of map area

**Expected Results**:
- Cursor changes to crosshair only over map
- Normal cursor outside map
- Smooth transitions between states
- Visual indicator is clear to user

**Priority**: Medium
**Status**: [ ] Pass [ ] Fail

---

## Test Suite 6: Context Menu Positioning (US-006)

### Test 6.1: Right-Click Context Menu
**Preconditions**: Place pin mode is active
**Steps**:
1. Right-click at various positions on map:
   - Top-left corner
   - Top-right corner
   - Bottom-left corner
   - Bottom-right corner
   - Center of map
2. Verify context menu appears at correct position

**Expected Results**:
- Context menu appears at click location
- Menu stays fully visible (no overflow off-screen)
- Menu repositions if near viewport edge
- Menu appears above map layer (z-50)
- No visual clipping

**Priority**: High
**Status**: [ ] Pass [ ] Fail

---

### Test 6.2: Context Menu Edge Cases
**Steps**:
1. Right-click near viewport edges
2. Right-click with zoomed map
3. Right-click with panned map

**Expected Results**:
- Menu always stays within viewport
- Menu adjusts position intelligently
- No scroll bars appear
- Menu remains interactive

**Priority**: Medium
**Status**: [ ] Pass [ ] Fail

---

## Test Suite 7: Context Menu Pin Type Display (US-007)

### Test 7.1: Verify All 9 Pin Types
**Preconditions**: Context menu is open
**Steps**:
1. Count the number of pin type options
2. Verify each has correct icon
3. Verify each has correct color

**Expected Results**:
- All 9 pin types are present:
  1. City (MapPin - #3b82f6 Blue)
  2. Landmark (Mountain - #22c55e Green)
  3. Dungeon (Sword - #a855f7 Purple)
  4. Point of Interest (Star - #eab308 Gold)
  5. Settlement (Home - #f97316 Orange)
  6. Battle Location (Crosshair - #ef4444 Red)
  7. Resource Node (Gem - #06b6d4 Cyan)
  8. Quest Location (Scroll - #8b5cf6 Indigo)
  9. Natural Feature (Tree - #84cc16 Lime)
- Icons are correctly sized (w-5 h-5)
- Colors match pin type constants

**Priority**: High
**Status**: [ ] Pass [ ] Fail

---

### Test 7.2: Verify Menu Structure
**Steps**:
1. Inspect context menu layout
2. Check visual grouping
3. Verify hover states

**Expected Results**:
- Pin types are in a grid or list layout
- Each type has icon + label
- Hover highlights entire row with accent-gold/10
- Visual feedback on hover
- Proper spacing between items

**Priority**: Medium
**Status**: [ ] Pass [ ] Fail

---

## Test Suite 8: Context Menu Selection & Form Pre-population (US-008)

### Test 8.1: Select Pin Type from Context Menu
**Preconditions**: Context menu is open at a specific location
**Steps**:
1. Click on a specific pin type (e.g., "City")
2. Verify form opens
3. Check pin type field

**Expected Results**:
- Context menu closes immediately
- Pin creation form modal opens
- Form's "Pin Type" field is pre-selected to "City"
- Location fields (X, Y) are pre-filled with click coordinates
- Form is ready for user input

**Priority**: High
**Status**: [ ] Pass [ ] Fail

---

### Test 8.2: Verify Coordinate Accuracy
**Steps**:
1. Right-click at a known position on map
2. Select a pin type
3. Check form coordinates

**Expected Results**:
- X coordinate matches click location (accounting for scale/pan)
- Y coordinate matches click location (accounting for scale/pan)
- Coordinates are in correct reference system
- Coordinates persist when form is opened

**Priority**: High
**Status**: [ ] Pass [ ] Fail

---

### Test 8.3: Cancel and Retain Context
**Steps**:
1. Open form via context menu with pre-selected type
2. Cancel the form
3. Right-click at different location
4. Select different pin type

**Expected Results**:
- Previous selection is cleared
- New form has new type and coordinates
- No state leakage between interactions
- Form opens cleanly each time

**Priority**: Medium
**Status**: [ ] Pass [ ] Fail

---

## Test Suite 9: Context Menu Dismissal (US-009)

### Test 9.1: Outside Click Dismissal
**Preconditions**: Context menu is open
**Steps**:
1. Right-click to open context menu
2. Click on map area (not on menu)
3. Verify menu closes

**Expected Results**:
- Context menu closes on outside click
- No pin type is selected
- User can right-click again to reopen
- No console errors

**Priority**: High
**Status**: [ ] Pass [ ] Fail

---

### Test 9.2: Escape Key Dismissal
**Steps**:
1. Right-click to open context menu
2. Press Escape key
3. Verify menu closes

**Expected Results**:
- Context menu closes on Escape
- Focus returns to map
- Place pin mode remains active
- User can right-click again

**Priority**: High
**Status**: [ ] Pass [ ] Fail

---

### Test 9.3: Selection Auto-Closes
**Steps**:
1. Right-click to open context menu
2. Click on any pin type
3. Verify menu closes immediately

**Expected Results**:
- Menu closes before form opens
- No animation overlap
- Clean transition between states
- Form opens at correct z-index

**Priority**: Medium
**Status**: [ ] Pass [ ] Fail

---

## Test Suite 10: Visual Indicators (US-010)

### Test 10.1: Mode Activation Indicators
**Steps**:
1. Enable place pin mode
2. Check all visual indicators
3. Disable place pin mode
4. Verify indicators clear

**Expected Results**:
- Cursor changes to crosshair (when over map)
- Dropdown button shows active state
- "(Active)" text appears in dropdown
- All indicators clear when mode is disabled

**Priority**: High
**Status**: [ ] Pass [ ] Fail

---

### Test 10.2: Consistent Visual Language
**Steps**:
1. Compare indicators across different components
2. Check color consistency
3. Check animation consistency

**Expected Results**:
- All active states use accent-gold
- All transitions use 200ms duration
- Hover states are consistent
- No jarring visual jumps

**Priority**: Medium
**Status**: [ ] Pass [ ] Fail

---

## Test Suite 11: Design System Consistency (US-011)

### Test 11.1: Rounded Corners
**Steps**:
1. Inspect all new components
2. Verify rounded-sm is used consistently
3. Check for inconsistent border radius

**Expected Results**:
- All UI elements use rounded-sm (4px radius)
- No rounded-md, rounded-lg, etc. (unless intentional)
- Consistent across buttons, inputs, menus
- Matches existing design system

**Priority**: High
**Status**: [ ] Pass [ ] Fail

---

### Test 11.2: Color Tokens
**Steps**:
1. Check all color usage
2. Verify design tokens are used
3. Check for hardcoded colors

**Expected Results**:
- accent-gold used for primary actions
- background-card for card backgrounds
- background-elevated for elevated surfaces
- border-border-subtle for borders
- No hardcoded hex colors (except in CSS variables)

**Priority**: High
**Status**: [ ] Pass [ ] Fail

---

### Test 11.3: Z-Index Hierarchy
**Steps**:
1. Inspect z-index values
2. Verify stacking order
3. Check for conflicts

**Expected Results**:
- Dropdowns: z-50
- Modals: z-50
- Context menus: z-50
- Popups: z-50
- No z-index wars or unexpected overlaps

**Priority**: Medium
**Status**: [ ] Pass [ ] Fail

---

## Test Suite 12: Error Handling & Edge Cases

### Test 12.1: Rapid Click Testing
**Steps**:
1. Rapidly click "Add Pin" button 10 times
2. Rapidly right-click on map 10 times
3. Verify no errors or state corruption

**Expected Results**:
- No console errors
- No duplicate menus/modals
- State remains consistent
- Event handlers debounce properly

**Priority**: Medium
**Status**: [ ] Pass [ ] Fail

---

### Test 12.2: Window Resize
**Steps**:
1. Open dropdown or context menu
2. Resize browser window
3. Verify UI remains usable

**Expected Results**:
- Menus reposition correctly
- No layout breaks
- Buttons remain clickable
- No horizontal scroll bars

**Priority**: Low
**Status**: [ ] Pass [ ] Fail

---

### Test 12.3: Network Latency
**Steps**:
1. Slow down network (Chrome DevTools)
2. Create pin via dropdown
3. Create pin via context menu

**Expected Results**:
- Loading states appear
- No duplicate submissions
- Graceful error handling
- User feedback is clear

**Priority**: Low
**Status**: [ ] Pass [ ] Fail

---

## Cross-Browser Compatibility

### Browser Matrix
| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 120+ | [ ] | Primary target |
| Firefox | 120+ | [ ] | Full support |
| Safari | 17+ | [ ] | Full support |
| Edge | 120+ | [ ] | Chromium-based |

### Mobile Responsive
| Viewport | Width | Status | Notes |
|----------|-------|--------|-------|
| Desktop | 1920x1080 | [ ] | Full feature set |
| Tablet | 768x1024 | [ ] | Adapted layout |
| Mobile | 375x667 | [ ] | Simplified UI |

---

## Accessibility Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order follows visual hierarchy
- [ ] Focus indicators are visible
- [ ] ARIA labels present on icon-only buttons
- [ ] Screen reader announces state changes
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Touch targets are minimum 44x44px
- [ ] No keyboard traps
- [ ] Escape key closes all modals/menus

---

## Performance Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| First Contentful Paint | < 1.5s | [ ] | |
| Time to Interactive | < 3.5s | [ ] | |
| Cumulative Layout Shift | < 0.1 | [ ] | |
| Total Blocking Time | < 200ms | [ ] | |

---

## Regression Testing

### Existing Features
- [ ] World list still loads
- [ ] Map zoom still works
- [ ] Layer toggling still works
- [ ] Existing pins still display
- [ ] Sidebar resize still works
- [ ] Auth flow unchanged
- [ ] No console errors on page load

---

## Test Execution Summary

### Automated Tests
- Typecheck: [ ] Pass
- Lint: [ ] Pass (N/A - no ESLint config)
- Build: [ ] Pass

### Manual Tests
- Total Test Cases: 42
- Passed: [ ]
- Failed: [ ]
- Skipped: [ ]

### Critical Bugs Found
1.
2.
3.

### Non-Critical Issues Found
1.
2.
3.

---

## Sign-Off

**Tester**: _______________
**Date**: _______________
**Status**: [ ] Approved [ ] Approved with Notes [ ] Needs Fixes

**Tester Comments**:
___________________________________________________________________
___________________________________________________________________
___________________________________________________________________

---

## Next Steps

1. Fix all critical bugs
2. Address high-priority failures
3. Document any workarounds
4. Schedule re-test if needed
5. Update documentation with known issues
