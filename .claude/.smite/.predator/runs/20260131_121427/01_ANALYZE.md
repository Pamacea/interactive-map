# Analysis Report - World Editor UI Refactor

## Task Summary
Refactor the World Editor UI (`/world/[id]`) to replace the fixed header/sidebar with floating, draggable, and resizable modules.

---

## Current Architecture

### 1. World Client Layout (`world-client.tsx`)
```
┌─────────────────────────────────────────────────┐
│  WorldNavigation (fixed header, h-12)          │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ Sidebar  │         Map Canvas                   │
│ (320px)  │     (flex-1, relative)               │
│          │                                      │
│          │    + ZoomControls (absolute)         │
│          │    + AutosaveIndicator              │
└──────────┴──────────────────────────────────────┘
```

**Key Files:**
- `src/app/world/[id]/page.tsx` - Server entry point
- `src/components/world/ui/world-client.tsx` - Main client layout
- `src/components/world/ui/world-navigation.tsx` - Fixed header component
- `src/components/world/ui/sidebar/sidebar.tsx` - Resizable sidebar

### 2. Current Header (`world-navigation.tsx`)
- **Position**: Fixed, top of viewport (`h-12`)
- **Components**: Back button, Search, My Worlds, World Title, GENESIS branding, Explore, Export, Profile
- **Styling**: `bg-background-base/95 backdrop-blur-sm border-b border-b-accent-gold-dark`
- **Issue**: Fixed height, takes up horizontal space, not collapsible

### 3. Current Sidebar (`sidebar.tsx`)
- **Position**: Left side, resizable (200-600px), collapsible to 70px
- **Sections**: Layers, Pins, Lore, Filters, Properties, Gallery
- **Toggle**: Button at left edge, expands/collapses
- **Resize**: Custom `useResizableSidebar` hook with RAF optimization

### 4. Current Zoom Controls (`zoom-controls.tsx`)
- **Position**: `absolute bottom-6 right-6`
- **Features**: Zoom in/out, percentage display, reset, scale dropdown
- **Already floating!** - Can be reused/merged with new floating header

---

## Problems with Current Implementation

1. **Fixed Header**: Takes up space, not "floating", can't be moved
2. **Fixed Sidebar**: Anchored to left, not modular/floatable
3. **No Drag & Drop**: Panels can't be repositioned
4. **No Module System**: All sidebar sections are in one container
5. **Poor QoL**: No collapse-all, no resize, no independent positioning

---

## User Requirements

### Bottom-Right Floating Header (replacing fixed header)
- Back to My Worlds
- Back to Home (Explore)
- World name display
- Export button
- Profile/settings access
- Zoom/scale controls (merge with existing ZoomControls)
- NOT fixed - should be floating
- Margin on right and left edges

### Bottom-Left Module Toggles (replacing sidebar)
- Toggle buttons for: Layers, Lore, Filter, Properties
- Modules can be shown/hidden via these buttons
- Modules should be draggable and resizable
- Collapse functionality

### Module Panels (floating panels)
- **Layers Panel**: Layer management
- **Lore Panel**: Lore entries
- **Filter Panel**: Pin filters
- **Properties Panel**: Map properties
- Features:
  - Draggable
  - Resizable
  - Collapsible
  - Stackable z-index management

---

## Existing Patterns to Reuse

### 1. Floating UI Pattern
Already used in:
- `ZoomControls` - `absolute bottom-6 right-6`
- `SelectedPinPopup` - Percentage-based positioning
- `PinContextMenu` - `fixed z-50` with smart positioning

**Reusable Classes:**
```tsx
className="absolute bottom-6 right-6 z-40 bg-background-base/95 backdrop-blur-sm rounded-sm border border-border-subtle shadow-lg"
```

### 2. Collapsible Pattern
- `CollapsibleSection` component
- Shadcn `Collapsible` primitive
- Chevron rotation animation

### 3. Resize Pattern
- `useResizableSidebar` hook with RAF
- `ResizeHandle` component with visual feedback
- Min/max width constraints

### 4. Z-Index Management
Current scale (needs improvement):
- `z-10`: Resize handles
- `z-40`: Floating indicators
- `z-50`: Context menus, popups
- `z-[9999]`: Portaled dropdowns (arbitrary, should be fixed)

---

## Technical Decisions Needed

### 1. Drag & Drop Library
**Options:**
- `@dnd-kit/core` - Modern, modular, ~10KB (recommended)
- `react-draggable` - Simple, straightforward
- Custom implementation - Using native pointer events

**Recommendation**: Custom implementation using pointer events (lighter, less dependencies)

### 2. Resize Implementation
**Options:**
- `react-resizable-panels` - Full-featured (4.9k stars)
- Custom resize handles - Like existing sidebar

**Recommendation**: Custom resize handles on panel edges (consistent with existing pattern)

### 3. State Management
**Current**: Zustand stores (`use-pins-store`, `map-store`, `use-lore-store`)
**New**: Add `floating-panels-store.ts` for:
- Panel positions (x, y)
- Panel sizes (width, height)
- Panel visibility
- Panel z-index stack
- Collapsed state

### 4. Z-Index Hierarchy (Standardized)
```typescript
// constants/z-index.ts
export const Z_INDEX = {
  base: 0,
  floatingPanel: 10,
  activePanel: 20,
  dropdown: 30,
  popover: 40,
  modal: 50,
  toast: 60,
} as const;
```

---

## File Structure for New Implementation

### Files to Create
```
src/components/world/ui/floating/
├── floating-panel.tsx           # Base draggable/resizable panel wrapper
├── floating-header.tsx          # Bottom-right floating header
├── module-dock.tsx              # Bottom-left module toggle buttons
├── layers-module.tsx            # Layers floating module
├── lore-module.tsx              # Lore floating module
├── filters-module.tsx           # Filters floating module
├── properties-module.tsx        # Properties floating module
└── index.ts                     # Public exports

src/components/world/logic/
├──use-floating-panel.ts         # Drag/resize logic for panels
└── use-panel-dock.ts           # Module dock state management

src/store/
└── use-floating-panels-store.ts # Panel positions, sizes, visibility

src/constants/
└── z-index.ts                  # Z-index constants
```

### Files to Modify
```
src/components/world/ui/world-client.tsx    # Remove fixed header/sidebar
src/app/world/[id]/page.tsx                 # Update if needed
```

### Files to Deprecate (not delete, yet)
```
src/components/world/ui/world-navigation.tsx
src/components/world/ui/sidebar/
src/components/world/logic/use-resizable-sidebar.ts
```

---

## Dependencies

### External Libraries
- No new libraries needed (use native pointer events for drag/resize)
- Existing: Shadcn UI components (Collapsible, etc.)

### Internal Dependencies
- `@/stores/map-store` - For layer state
- `@/stores/use-pins-store` - For pins/filters
- `@/stores/use-lore-store` - For lore entries
- `@/components/ui/*` - Shadcn primitives
- `@/lib/utils` - `cn()` utility

---

## Risk Assessment

### High Risk
- **Breaking existing keyboard shortcuts** - Need to audit all shortcuts
- **State synchronization** - Multiple stores need to stay in sync
- **Mobile responsiveness** - Floating panels need mobile handling

### Medium Risk
- **Z-index conflicts** - With existing popups, dropdowns
- **Performance** - Too many re-renders from drag/resize
- **Accessibility** - Keyboard navigation for floating panels

### Low Risk
- **Visual consistency** - Can reuse existing Tailwind patterns
- **LocalStorage persistence** - Can add after MVP

---

## Reference Implementations Found

### 1. Figma Floating Panels
- Panels can be dragged anywhere
- Resize handles on all edges
- Collapse to small header
- Stack order management

### 2. Resize Handle Pattern (existing)
```tsx
// Already working in sidebar
<div
  onMouseDown={onResizeStart}
  className="absolute right-0 top-0 bottom-0 w-8 cursor-col-resize"
>
  {/* Visual feedback */}
</div>
```

### 3. Collapsible Animation Pattern (existing)
```tsx
// CollapsibleSection uses Shadcn Collapsible
<Collapsible open={isOpen} onOpenChange={onToggle}>
  <CollapsibleTrigger className="flex justify-between">
    <span>{title}</span>
    <ChevronDown className={isOpen ? "rotate-180" : ""} />
  </CollapsibleTrigger>
  <CollapsibleContent>{children}</CollapsibleContent>
</Collapsible>
```

---

## Success Criteria

### Functional Requirements
- [ ] Fixed header removed
- [ ] Fixed sidebar removed
- [ ] Floating header in bottom-right (merged with zoom controls)
- [ ] Module dock in bottom-left (toggle buttons)
- [ ] 4 floating modules: Layers, Lore, Filters, Properties
- [ ] Modules are draggable
- [ ] Modules are resizable
- [ ] Modules are collapsible
- [ ] Z-index management (click to bring to front)

### Non-Functional Requirements
- [ ] Use only Tailwind CSS (no arbitrary values except calculated positions)
- [ ] Follow project design system (shadows, borders, radius)
- [ ] No new external dependencies for drag/resize
- [ ] Keyboard accessibility for all interactions
- [ ] Mobile responsive (panels stack or hide on small screens)

### Quality Standards
- [ ] Code passes linting
- [ ] Code passes typecheck
- [ ] Build succeeds
- [ ] Follows ui/logic/methods separation
- [ ] No console.log statements
