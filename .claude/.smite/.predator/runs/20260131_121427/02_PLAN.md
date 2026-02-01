# Implementation Plan - World Editor UI Refactor

## Overview
Replace fixed header/sidebar with floating, draggable modules using pure Tailwind CSS and native pointer events.

---

## Files to Create

### Core Floating Components
| File | Purpose | Dependencies | Size |
|------|---------|--------------|------|
| `src/constants/z-index.ts` | Z-index constants | none | small |
| `src/store/use-floating-panels-store.ts` | Panel state (pos, size, visibility) | Zustand | medium |
| `src/components/world/logic/use-floating-panel.ts` | Drag/resize logic hooks | React | medium |
| `src/components/world/ui/floating/floating-panel.tsx` | Base draggable/resizable panel | use-floating-panel.ts | medium |
| `src/components/world/ui/floating/floating-header.tsx` | Bottom-right header + zoom | ZoomControls pattern | medium |
| `src/components/world/ui/floating/module-dock.tsx` | Bottom-left toggle buttons | Icons | small |
| `src/components/world/ui/floating/layers-module.tsx` | Layers floating panel | LayersPanel | small |
| `src/components/world/ui/floating/lore-module.tsx` | Lore floating panel | LoreList, LoreForm | small |
| `src/components/world/ui/floating/filters-module.tsx` | Filters floating panel | PinsFilterPanel | small |
| `src/components/world/ui/floating/properties-module.tsx` | Properties floating panel | PropertiesPanel | small |
| `src/components/world/ui/floating/index.ts` | Public exports | all floating components | small |

### Utility Hooks
| File | Purpose | Dependencies | Size |
|------|---------|--------------|------|
| `src/components/world/logic/use-panel-dock.ts` | Module dock state management | use-floating-panels-store | small |

---

## Files to Modify

| File | Changes | Risk | Dependencies Affected |
|------|---------|------|----------------------|
| `src/components/world/ui/world-client.tsx` | Remove fixed header/sidebar, add floating layout | High | WorldNavigation, Sidebar |
| `src/app/world/[id]/page.tsx` | Update props if needed | Low | world-client |

---

## Implementation Order

### Phase 1: Foundation (Setup)
1. **Create Z-index constants** (`z-index.ts`)
2. **Create floating panels store** (`use-floating-panels-store.ts`)
3. **Create drag/resize hooks** (`use-floating-panel.ts`)

### Phase 2: Base Components
4. **Create FloatingPanel wrapper** (`floating-panel.tsx`)
5. **Create FloatingHeader** (`floating-header.tsx`)
6. **Create ModuleDock** (`module-dock.tsx`)

### Phase 3: Module Panels
7. **Create LayersModule** (`layers-module.tsx`)
8. **Create LoreModule** (`lore-module.tsx`)
9. **Create FiltersModule** (`filters-module.tsx`)
10. **Create PropertiesModule** (`properties-module.tsx`)

### Phase 4: Integration
11. **Update WorldClient** (`world-client.tsx`)
12. **Create barrel export** (`floating/index.ts`)

### Phase 5: Cleanup
13. **Verify no broken imports**
14. **Test all interactions**

---

## Detailed Implementation Specs

### 1. Z-Index Constants (`z-index.ts`)
```typescript
export const Z_INDEX = {
  // Base layers
  base: 0,
  map: 1,
  pin: 10,

  // Floating UI
  floatingPanel: 20,
  activeFloatingPanel: 25,
  floatingHeader: 30,
  moduleDock: 30,

  // Overlays
  dropdown: 40,
  popover: 45,
  contextMenu: 50,
  modal: 60,
  toast: 70,
} as const;
```

### 2. Floating Panels Store (`use-floating-panels-store.ts`)
```typescript
interface PanelState {
  id: string;
  isVisible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isCollapsed: boolean;
  zIndex: number;
}

interface FloatingPanelsStore {
  panels: Record<string, PanelState>;
  activePanel: string | null;

  // Actions
  togglePanel: (id: string) => void;
  updatePosition: (id: string, position: { x: number; y: number }) => void;
  updateSize: (id: string, size: { width: number; height: number }) => void;
  toggleCollapse: (id: string) => void;
  bringToFront: (id: string) => void;
  resetAll: () => void;
}

// Default positions (bottom-left area for modules, bottom-right for header)
const DEFAULT_PANELS: Record<string, Omit<PanelState, 'zIndex'>> = {
  layers: { isVisible: false, position: { x: 16, y: 16 }, size: { width: 280, height: 400 }, isCollapsed: false },
  lore: { isVisible: false, position: { x: 312, y: 16 }, size: { width: 280, height: 400 }, isCollapsed: false },
  filters: { isVisible: false, position: { x: 16, y: 432 }, size: { width: 280, height: 300 }, isCollapsed: false },
  properties: { isVisible: false, position: { x: 312, y: 432 }, size: { width: 280, height: 300 }, isCollapsed: false },
};
```

### 3. Use Floating Panel Hook (`use-floating-panel.ts`)
```typescript
interface UseFloatingPanelOptions {
  panelId: string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
}

// Returns:
// - isDragging
// - isResizing
// - dragHandleProps
// - resizeHandleProps (N, S, E, W, NE, NW, SE, SW)
// - collapseProps
```

### 4. FloatingPanel Component (`floating-panel.tsx`)
```tsx
interface FloatingPanelProps {
  id: string;
  title: string;
  children: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  showResize?: boolean;
  showCollapse?: boolean;
  className?: string;
}

// Features:
// - Drag via title bar
// - Resize via corner handle (SE)
// - Collapse to title bar only
// - Close button
// - Click to bring to front (z-index)
```

### 5. FloatingHeader Component (`floating-header.tsx`)
```tsx
interface FloatingHeaderProps {
  worldTitle: string;
  worldId: string;
  onSearchResultClick?: (result: SearchResultItem) => void;
}

// Features:
// - Positioned bottom-right (margin from edges)
// - Merges: Back buttons, World Title, Export, Profile, Zoom controls
// - NOT draggable (or optionally draggable)
// - Styled as floating card with backdrop blur
```

### 6. ModuleDock Component (`module-dock.tsx`)
```tsx
interface ModuleDockProps {
  // None - uses store
}

// Features:
// - Positioned bottom-left (margin from edges)
// - 4 toggle buttons: Layers, Lore, Filters, Properties
// - Visual indication when module is visible
// - Tooltip on hover
```

---

## Design Specifications

### Floating Panel Styling
```tsx
// Base panel
className="absolute bg-background-card/95 backdrop-blur-sm rounded-sm border border-border-subtle shadow-xl overflow-hidden"

// Title bar (drag handle)
className="flex items-center justify-between px-3 py-2 bg-background-elevated border-b border-border-subtle cursor-move"

// Content area
className="overflow-auto"

// Resize handle (SE corner)
className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
```

### Floating Header Styling
```tsx
// Container
className="fixed bottom-6 right-6 bg-background-base/95 backdrop-blur-sm rounded-sm border border-border-subtle shadow-xl"

// Layout: horizontal flex with gap
// - Left: Back to Worlds, Back to Home
// - Center: World name
// - Right: Export, Profile, Zoom controls
```

### Module Dock Styling
```tsx
// Container
className="fixed bottom-6 left-6 flex flex-col gap-2"

// Individual button
className="w-12 h-12 bg-background-card/95 backdrop-blur-sm rounded-sm border border-border-subtle shadow-lg flex items-center justify-center text-text-secondary hover:text-accent-gold hover:border-accent-gold/50 hover:bg-accent-gold/10 transition-all"

// Active state (when module visible)
"border-accent-gold text-accent-gold bg-accent-gold/10"
```

---

## Acceptance Criteria

### Functional Requirements
- [ ] Fixed header (`WorldNavigation`) is removed from layout
- [ ] Fixed sidebar (`Sidebar`) is removed from layout
- [ ] Floating header appears in bottom-right
- [ ] Module dock appears in bottom-left
- [ ] Clicking dock toggle shows/hides corresponding module
- [ ] Modules are draggable via title bar
- [ ] Modules are resizable via corner handle
- [ ] Modules are collapsible (collapse to title bar)
- [ ] Clicking a module brings it to front (z-index)
- [ ] Zoom controls are merged into floating header
- [ ] All existing functionality preserved (layers, pins, lore, etc.)

### Non-Functional Requirements
- [ ] Uses only Tailwind CSS utilities (no arbitrary shadow/border/radius values)
- [ ] No external drag-drop libraries
- [ ] Keyboard accessible (Escape to close, Tab navigation)
- [ ] Responsive (panels stack on mobile)
- [ ] State persists in localStorage (optional, can add later)

### Quality Standards
- [ ] Code passes ESLint
- [ ] Code passes TypeScript typecheck
- [ ] Build succeeds
- [ ] Follows ui/logic/methods pattern
- [ ] No console.log statements

---

## Risk Assessment

### High Risk Items
1. **State synchronization** - Multiple stores (map, pins, lore, floating) need coordination
   - **Mitigation**: Keep stores independent, sync via props
2. **Keyboard shortcuts** - Existing shortcuts may conflict with new UI
   - **Mitigation**: Audit all shortcuts, add event.stopPropagation() where needed
3. **Mobile responsiveness** - Floating panels don't work well on small screens
   - **Mitigation**: Hide panels by default on mobile, use full-screen modals

### Medium Risk Items
1. **Z-index conflicts** - With existing popups, tooltips, dropdowns
   - **Mitigation**: Use standardized Z_INDEX constants
2. **Performance** - Drag/resize may cause excessive re-renders
   - **Mitigation**: Use RAF, memoize panel content, use transform instead of top/left
3. **Accessibility** - Keyboard navigation for draggable elements
   - **Mitigation**: Add ARIA attributes, ensure focus management

### Low Risk Items
1. **Visual bugs** - Panels may overlap awkwardly
   - **Mitigation**: Add boundary constraints, smart positioning
2. **State loss** - Positions reset on refresh
   - **Mitigation**: Acceptable for MVP, add localStorage later

---

## Estimated Complexity
**Overall**: High
- New architecture pattern
- Multiple interdependent components
- Complex state management

**Time Estimate**: 4-6 hours of focused work
