# Genesis - Feature Progress Tracker

> Last updated: 2026-02-02 | Overall completion: **~85%**

---

## Quick Summary

| Status | Features |
|--------|----------|
| **Fully Implemented** | Auth, Worlds, Pins, Layers, Explore, Search, Export |
| **Partially Implemented** | Lore (95% - markdown editor complete, pin/linking pending), Gallery (95% - data fetching complete, bulk upload pending) |
| **Basic Implementation** | Collaboration (member management UI complete, real-time features pending) |
| **Not Started** | Templates, Characters, Advanced Features |

---

## 1. Fully Implemented Features

### 1.1 Authentication System
**Status**: ✅ Complete | **Priority**: Foundation | **Tests**: N/A (NextAuth)

- **Schema**: User, Account, Session, VerificationToken (NextAuth)
- **Backend**: NextAuth.js configuration (`src/lib/auth.ts`)
- **UI**: Sign in page (`src/app/(auth)/signin/page.tsx`)
- **Features**:
  - Email/password authentication
  - Session management
  - Protected routes middleware
- **Files**:
  - `src/lib/auth.ts` - Auth configuration
  - `src/app/(auth)/` - Auth routes
  - `src/middleware.ts` - Route protection

---

### 1.2 World Management
**Status**: ✅ Complete | **Priority**: Core | **Tests**: Manual

- **Schema**: GameWorld, WorldMember, permissions (READER, EDITOR, OWNER)
- **UI Components**:
  - World cards with thumbnails
  - Create world form with map upload
  - World list (grid/list views)
  - Settings pages
- **Backend** (`src/actions/worlds.ts`):
  - `createWorld` - Create new world
  - `updateWorld`, `updateWorldTitle`, `updateWorldState` - Edit world
  - `deleteWorld` - Remove world
  - `getWorldsByUser` - List user's worlds
  - `getPublicWorlds` - Discover public worlds
  - `uploadWorldMap` - Map image upload
  - **NEW**: `getWorldMembers`, `addWorldMember`, `updateWorldMemberPermission`, `removeWorldMember`
- **Routes**:
  - `/worlds` - World list
  - `/create` - Create world
  - `/world/[id]` - World editor
  - `/settings` - User settings
- **Files**:
  - `src/components/worlds/` - World UI components
  - `src/actions/worlds.ts` - Server actions

---

### 1.3 Pins System
**Status**: ✅ Complete | **Priority**: Core | **Tests**: 64 tests, 98.92% coverage

- **Schema**: Pin, PinType (LOCATION, CHARACTER, ITEM, EVENT, NOTE, CUSTOM)
- **UI Components** (`src/components/pins/ui/`):
  - `pin-marker.tsx` - Main marker (176 lines)
  - `pin-icon.tsx` - Icon renderer
  - `pin-selection-ring.tsx` - Selection indicator
  - `pin-popup.tsx` - Info popup card
  - `pin-form.tsx` - Create/edit form
  - `icon-picker.tsx` - Icon selection
- **Logic Hooks** (`src/components/pins/logic/`):
  - `use-pin-drag.ts` - Drag-and-drop (235 lines)
  - `use-pin-position.ts` - Coordinate calculations (93 lines)
  - `use-pin-events.ts` - Hover/events (81 lines)
  - `use-pin-form.ts` - Form state
- **State Management**: `src/store/use-pins-store.ts` (569 lines)
- **Backend** (`src/actions/pins.ts`):
  - `createPin`, `updatePin`, `deletePin`
  - Batch operations
- **Features**:
  - Drag-and-drop with optimistic updates
  - Layer support with visibility/lock controls
  - Advanced filtering (type, search, layer)
  - Zoom-based visibility culling
  - Custom icon uploads
  - Z-index sorting

---

### 1.4 Map Layers System
**Status**: ✅ Complete | **Priority**: Core | **Tests**: Manual

- **Schema**: MapLayer (visibility, opacity, offsetX, offsetY, zIndex)
- **UI Components** (`src/components/layers/`):
  - Layer panel with toggle controls
  - Layer properties editor
  - Add/remove layer buttons
  - Layer reorder UI
- **Backend** (`src/actions/layers.ts`):
  - `createLayer`, `updateLayer`, `deleteLayer`
  - `reorderLayers`
- **Features**:
  - Multiple map layers per world
  - Independent visibility/opacity per layer
  - Layer offset for parallax effects
  - Layer lock for editing

---

### 1.5 Explore / Public Worlds
**Status**: ✅ Complete | **Priority**: Secondary | **Tests**: Manual

- **Schema**: GameWorld.isPublic flag
- **UI Components** (`src/components/explore/`):
  - Explore page layout
  - Public world cards
  - Search/filter controls
- **Backend**: `getPublicWorlds` in `src/actions/worlds.ts`
- **Routes**: `/explore`
- **Features**:
  - Discover public worlds
  - View-only mode for non-members

---

### 1.6 Search System ✨ NEW
**Status**: ✅ Complete | **Priority**: Medium | **Tests**: Manual

- **Backend** (`src/actions/search.ts`):
  - `searchWorld()` - Full-text search with relevance scoring
  - `getSearchSuggestions()` - Autocomplete
  - Searches across pins and lore entries
  - Filter by type, category, layer
- **UI Components** (`src/components/search/ui/`):
  - `search-bar.tsx` - Modal search interface (Ctrl+K)
  - `search-results.tsx` - Tabbed results (All/Pins/Lore)
  - `search-result-item.tsx` - Rich result display
  - `search-suggestions.tsx` - Autocomplete dropdown
  - `search-highlight.tsx` - Text highlighting
  - `search-states.tsx` - Loading/error states
- **State Management**: `src/store/use-search-store.ts`
- **Features**:
  - Keyboard shortcut (Ctrl/Cmd + K)
  - Real-time search with debouncing
  - Relevance scoring
  - Text highlighting with context

---

### 1.7 Export Functionality ✨ NEW
**Status**: ✅ Complete | **Priority**: Medium | **Tests**: Manual

- **Backend** (`src/actions/export.ts`):
  - `getWorldExportData()` - Fetch world data for export
- **Client Utilities** (`src/components/export/utils/export-utils.ts`):
  - `exportAsPNG` - Image export via html2canvas
  - `exportAsPDF` - PDF export via jsPDF
  - `exportAsJSON` - Data export
- **UI Components** (`src/components/export/ui/`):
  - `export-button.tsx` - Export trigger button
  - `export-dialog.tsx` - Format selection dialog
- **Context**: `src/components/export/utils/use-map-export-context.tsx`
- **Features**:
  - PNG, PDF, JSON export formats
  - File size estimation
  - Export progress indicator
  - Map element registration for capture

---

## 2. Partially Implemented Features

### 2.1 Lore Entries System
**Status**: 95% Complete | **Priority**: High | **Tests**: None

**What Works**:
- **Schema**: LoreEntry, LoreCategory (GENERAL, HISTORY, GEOGRAPHY, CHARACTERS, FACTIONS, MAGIC, ITEMS, QUESTS, CUSTOM)
- **Backend** (`src/actions/lore.ts`):
  - `createLoreEntry`, `updateLoreEntry`, `deleteLoreEntry`
  - `getLoreEntriesByWorld`, `getLoreEntryBySlug`
  - `toggleLoreVisibility`
- **State Management**: `src/stores/use-lore-store.ts` (472 lines)
  - Optimistic CRUD operations
  - Filter state (search, categories, visibility)
- **UI Components** (`src/components/lore/ui/`):
  - `lore-card.tsx` - Entry display card
  - `lore-form.tsx` - Create/edit form
  - `lore-list.tsx` - List view with filters
  - `lore-detail.tsx` - ✨ NEW Detail view with markdown rendering
  - `markdown-editor.tsx` - ✨ NEW Markdown editor with live preview
  - `markdown-renderer.tsx` - ✨ NEW Markdown display component
  - Category selection and filtering UI
- **Integration**: Sidebar in world editor via `LoreModule`

**What's Missing**:
- [ ] Lore-to-pin linking in UI
- [ ] Cross-referencing between entries
- [ ] Individual lore entry detail page/route
- [ ] Test coverage

**Files**:
- `src/components/lore/` - 15 UI components
- `src/actions/lore.ts` - Server actions
- `src/stores/use-lore-store.ts` - State management

---

### 2.2 Image Gallery System
**Status**: 95% Complete | **Priority**: Medium | **Tests**: None

**What Works**:
- **Schema**: GalleryItem (IMAGE, VIDEO, AUDIO, DOCUMENT)
- **Backend** (`src/actions/gallery.ts`):
  - `uploadGalleryImage` - File upload with validation
  - `updateGalleryItem`, `deleteGalleryItem`
  - `getGalleryItemsByWorld`
  - `linkGalleryItemToPin`, `linkGalleryItemToLore`
- **State Management**: `src/stores/use-gallery-store.ts` (468 lines)
  - Optimistic CRUD operations
  - Upload progress tracking
  - Filter state
- **Data Fetching** (`src/components/gallery/logic/`):
  - ✨ NEW `use-gallery-query.ts` - TanStack Query hooks
  - `useGallery` - Fetch gallery items for world
  - `useUploadGallery`, `useDeleteGallery`, `useUpdateGallery` - Mutations
- **UI Components** (`src/components/gallery/ui/`):
  - `image-gallery.tsx` - ✨ UPDATED Now fetches data via TanStack Query
  - `image-card.tsx` - Gallery item display
  - `image-lightbox.tsx` - Full-screen viewer
  - `image-upload-zone.tsx` - Drop zone for uploads
  - `gallery-grid.tsx` - Grid layout

**What's Missing**:
- [ ] Bulk upload (single file only)
- [ ] Image editing/cropping tools
- [ ] Gallery organization (folders/albums)
- [ ] Video preview thumbnails
- [ ] Test coverage

**Files**:
- `src/components/gallery/` - 12 UI components
- `src/actions/gallery.ts` - Server actions
- `src/stores/use-gallery-store.ts` - State management

---

## 3. Basic Implementation Features

### 3.1 Collaboration System
**Status**: 60% Complete | **Priority**: High | **Effort**: Large

**What Works**:
- **Schema**: WorldMember with roles (READER, EDITOR, OWNER)
- **Permission System**: `src/lib/server-helpers.ts`
  - `verifyWorldPermission`, `verifyPinPermission`, etc.
- **Backend** (`src/actions/worlds.ts`):
  - ✨ NEW `getWorldMembers` - Fetch all members
  - ✨ NEW `addWorldMember` - Add member by email
  - ✨ NEW `updateWorldMemberPermission` - Change permissions
  - ✨ NEW `removeWorldMember` - Remove member
- **UI Components** (`src/components/members/`):
  - ✨ NEW `members-list.tsx` - Members list with management
- **Floating Panel**: `src/components/world/ui/floating/members-module.tsx`
  - Integrated into world editor
  - Toggle via ModuleDock (Users icon)
- **State Management**: Added to `src/store/use-floating-panels-store.ts`

**What's Missing**:
- [ ] Real-time presence indicators (who's viewing/editing)
- [ ] Real-time editing synchronization (WebSocket/Socket.io)
- [ ] Conflict resolution for concurrent edits
- [ ] Activity feed (recent changes)
- [ ] Invite system (email invites, share links)

**Tech Considerations**:
- WebSocket server or Pusher/Ably for real-time
- Operational transformation or CRDT for conflict resolution
- Notification system for mentions/changes

---

## 4. Not Started Features

### 4.1 World Templates
**Status**: Not Started | **Priority**: Low | **Effort**: Medium

- Template system design
- Pre-built world templates (fantasy kingdom, sci-fi station, etc.)
- Template selection on world creation
- Custom template creation
- Template marketplace (future)

---

### 4.2 Character System
**Status**: Schema Only | **Priority**: Low | **Effort**: Large

- Character CRUD UI
- Character stat blocks
- Character portraits
- Character-to-pin linking
- Character relationships/factions
- Dialogue system (optional)
- Quest integration (optional)

---

### 4.3 Advanced Features
**Status**: Not Started | **Priority**: Varies | **Effort**: Varies

| Feature | Priority | Effort | Description |
|---------|----------|--------|-------------|
| Version History | Low | Large | Track and revert world changes |
| Comments/Annotations | Low | Medium | Add notes to map locations |
| Map Providers | Low | Medium | Integrate third-party map tiles |
| Mobile App | Low | Very Large | Native mobile experience |
| Offline Mode | Low | Large | Service worker, local storage |
| Import from Tools | Medium | Medium | Import from other worldbuilding tools |

---

## 5. Technical Debt & Improvements

### 5.1 Testing
| Feature | Coverage | Action Needed |
|---------|----------|---------------|
| Pins | 98.92% (64 tests) | ✅ Excellent |
| Worlds | 0% | Add integration tests |
| Lore | 0% | Add unit tests for actions |
| Gallery | 0% | Add upload handling tests |
| Layers | 0% | Add reorder/visibility tests |
| Search | 0% | Add search tests |
| Export | 0% | Add export tests |
| Members | 0% | Add permission tests |

### 5.2 Performance
- [x] TanStack Query caching implemented for Gallery
- [ ] Implement caching for Search results
- [ ] Optimize map rendering for large worlds
- [ ] Add pagination for large pin/lore lists
- [ ] Image optimization and lazy loading
- [ ] Bundle size analysis and optimization

### 5.3 Accessibility
- [ ] Full keyboard navigation audit
- [ ] Screen reader testing
- [ ] Focus management in modals/forms
- [ ] ARIA labels review
- [ ] Color contrast verification

---

## 6. Milestones

### v0.6 - Current State ✅
- ✅ Auth, Worlds, Pins, Layers, Explore
- ✅ Search (full UI with keyboard shortcut)
- ✅ Export (PNG/PDF/JSON with dialog)
- ✅ Lore (markdown editor, detail view)
- ✅ Gallery (TanStack Query, data fetching)
- ✅ Member management UI

### v0.7 - Next Release
- [ ] Lore-to-pin linking
- [ ] Bulk gallery upload
- [ ] Test coverage for core features
- [ ] Performance optimizations

### v0.8 - Collaboration Enhancement
- [ ] Real-time presence indicators
- [ ] Activity feed
- [ ] Invite system (email invites, share links)

### v1.0 - MVP
- [ ] Full feature parity across all core features
- [ ] 80%+ test coverage
- [ ] Production-ready error handling
- [ ] Performance optimizations
- [ ] Accessibility compliance

---

## 7. Progress Bar

```
Core Features     [████████████████████] 100% (Auth, Worlds, Pins, Layers, Explore)
Content Tools      [████████████████████░] 95%  (Lore 95%, Gallery 95%)
Collaboration      [██████████░░░░░░░░░░░] 60%  (Members UI, real-time pending)
Search & Export    [████████████████████] 100% (Search ✅, Export ✅)
Advanced           [░░░░░░░░░░░░░░░░░░░░░] 0%   (Templates, Characters)
────────────────────────────────────────────────────────────────────────────────
Overall            [████████████████████░] 85%
```

---

## 8. Quick Reference for Developers

### Add a New Feature
1. Update schema in `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description`
3. Create Server Actions in `src/actions/`
4. Create UI components in `src/components/[feature]/ui/`
5. Create logic hooks in `src/components/[feature]/logic/`
6. Add route in `src/app/`
7. Update this file with progress

### Check Implementation Status
```bash
# Find components for a feature
ls src/components/[feature]/

# Check for actions
ls src/actions/[feature].ts

# Run tests
pnpm test -- [feature]
```

### TanStack Query Patterns
```typescript
// Query hook
import { useQuery } from "@tanstack/react-query";

const { data, isLoading } = useQuery({
  queryKey: ["resource", id],
  queryFn: () => getResource(id),
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// Mutation hook
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@tanstack/react-query";

const mutation = useMutation({
  mutationFn: createResource,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["resource"] });
  },
});
```

---

*This file is a living document. Update as features are implemented or priorities change.*
