# US-004 Quick Start: Testing Pin Editing

## How to Test

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Navigate to a World
- Go to http://localhost:3000/worlds
- Click on any world with pins

### 3. Select a Pin
- Click on any pin on the map
- **Expected**: Properties Panel shows "Pin Properties" section at top

### 4. Test Each Field

#### Title
- Edit the title text
- **Expected**: Updates immediately, saves to database

#### Description
- Edit the description (multi-line)
- **Expected**: Updates immediately, saves to database

#### Pin Type
- Change from dropdown (CITY, VILLAGE, POI, etc.)
- **Expected**: Icon in header updates, pin on map updates

#### Size
- Drag slider (10-100px)
- **Expected**: Value shows in gold, pin size changes on map

#### Color
- Click color swatch
- Select new color
- **Expected**: Hex updates, pin color changes on map

#### Visibility
- Toggle the switch
- **Expected**: Pin shows/hides on map

#### Coordinates
- View lat/lng display
- **Expected**: Read-only, shows 4 decimals

### 5. Test Empty State
- Click on empty map area (deselect pin)
- **Expected**: "No pin selected" message appears

### 6. Test Multiple Pins
- Click different pins
- **Expected**: Form updates with each pin's data

---

## Troubleshooting

### Pin properties don't show
**Check**: Is a pin selected?
**Fix**: Click on a pin marker on the map

### Changes not saving
**Check**: Browser console for errors
**Fix**: Ensure database is running, restart dev server

### Type mismatch errors
**Check**: Run `npx tsc --noEmit`
**Fix**: Should pass without errors

### Icon not showing
**Check**: Pin type in dropdown
**Fix**: Change type to trigger icon update

---

## Success Criteria

✅ Pin selection works
✅ All fields editable
✅ Changes persist to database
✅ UI updates immediately
✅ No console errors
✅ Typecheck passes

---

## Files Changed

```
src/components/world/ui/properties-panel.tsx
  - Added pin properties section
  - Added state for pin editing
  - Added update handlers
  - Added "No pin selected" empty state
```

---

## What's Next?

After testing US-004, you can:
1. Report any bugs found
2. Request additional features (layer dropdown, delete button)
3. Move to next user story (US-005: Layer assignment)
