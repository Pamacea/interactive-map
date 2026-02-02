# Genesis - Feature Progress Tracker

> Last updated: 2025-02-02 | Overall completion: **~65%**

---

## Quick Summary

| Status | Features |
|--------|----------|
| **Fully Implemented** | Auth, Worlds, Pins, Layers, Explore |
| **Partially Implemented** | Lore, Gallery (UI exists, needs integration) |
| **Not Started** | Collaboration UI, Search UI, Export UI, Templates, Characters |

---

## 1. Fully Implemented Features

### 1.1 Authentication System
**Status**: ✅ Complete | **Priority**: Foundation | **Tests**: N/A (NextAuth)

- **Schema**: User, Account, Session, VerificationToken (NextAuth)
- **Backend**: NextAuth.js configuration (`src/app/api/auth/[...nextauth]/route.ts`)
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
  - `updateWorld` - Edit world metadata
  - `deleteWorld` - Remove world
  - `getWorldsByUser` - List user's worlds
  - `getPublicWorlds` - Discover public worlds
  - `addWorldMember`, `removeWorldMember` - Member management
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
  - `pin-marker.tsx` - Main marker (176 lines, 48% reduced from original)
  - `pin-icon.tsx` - Icon renderer (Lucide/custom images)
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

## 2. Partially Implemented Features

### 2.1 Lore Entries System
**Status**: 70% Complete | **Priority**: High | **Tests**: None

**What Works**:
- **Schema**: LoreEntry, LoreCategory (PEOPLE, PLACES, EVENTS, ITEMS, CONCEPTS)
- **Backend** (`src/actions/lore.ts`):
  - `createLoreEntry`, `updateLoreEntry`, `deleteLoreEntry`
  - `getLoreEntriesByWorld`, `getLoreEntryBySlug`
  - Category management
- **UI Components** (`src/components/lore/`):
  - `lore-card.tsx` - Entry display card
  - `lore-form.tsx` - Create/edit form
  - `lore-list.tsx` - List view
  - `lore-fields.tsx` - Form fields
  - Category selection UI

**What's Missing**:
- [ ] Markdown editor for content (currently plain text)
- [ ] Lore-to-pin linking in UI
- [ ] Lore entry detail page/route
- [ ] Lore sidebar integration in world editor
- [ ] Category-based filtering
- [ ] Cross-referencing between entries
- [ ] Test coverage

**Files**:
- `src/components/lore/` - 12 UI components
- `src/actions/lore.ts` - Server actions
- `prisma/schema.prisma` - LoreEntry, LoreCategory models

---

### 2.2 Image Gallery System
**Status**: 60% Complete | **Priority**: Medium | **Tests**: None

**What Works**:
- **Schema**: GalleryItem (IMAGE, VIDEO), MediaType
- **Backend** (`src/actions/gallery.ts`):
  - `uploadGalleryItem` - With validation
  - `updateGalleryItem`, `deleteGalleryItem`
  - `getGalleryItemsByWorld`
  - Pin/lore associations
- **UI Components** (`src/components/gallery/`):
  - `image-card.tsx` - Gallery item display
  - `image-lightbox.tsx` - Full-screen viewer
  - `upload-zone.tsx` - Drop zone for uploads
  - `gallery-grid.tsx` - Grid layout

**What's Missing**:
- [ ] Gallery sidebar integration in world editor
- [ ] Image editing/cropping tools
- [ ] Gallery organization (folders/albums)
- [ ] Bulk upload
- [ ] Image captions/alt text editing
- [ ] Video preview thumbnails
- [ ] Test coverage
- [ ] Storage optimization (compression, CDN)

**Files**:
- `src/components/gallery/` - 11 UI components
- `src/actions/gallery.ts` - Server actions
- `prisma/schema.prisma` - GalleryItem model

---

## 3. Not Started Features

### 3.1 Collaboration System
**Status**: Schema Only | **Priority**: High | **Effort**: Large

**What Exists**:
- **Schema**: WorldMember with roles (READER, EDITOR, OWNER)
- **Backend**: Basic member add/remove in `src/actions/worlds.ts`

**What's Needed**:
- [ ] Real-time presence indicators (who's viewing/editing)
- [ ] Real-time editing synchronization (WebSocket/Socket.io)
- [ ] Conflict resolution for concurrent edits
- [ ] Activity feed (recent changes)
- [ ] Permission-aware UI (hide edit controls for READERS)
- [ ] Invite system (email invites, share links)
- [ ] Member list UI in world editor

**Tech Considerations**:
- WebSocket server or Pusher/Ably for real-time
- Operational transformation or CRDT for conflict resolution
- Notification system for mentions/changes

---

### 3.2 Search System
**Status**: Backend Only | **Priority**: Medium | **Effort**: Medium

**What Exists**:
- **Backend**: `src/actions/search.ts` with basic search
- **Types**: Search result types defined

**What's Needed**:
- [ ] Global search UI component
- [ ] Search results display with grouping
- [ ] Advanced filters (by type, date, creator)
- [ ] Search suggestions/autocomplete
- [ ] Full-text indexing (PostgreSQL tsvector or dedicated search service)
- [ ] Recent searches
- [ ] Search within current world

**Tech Considerations**:
- PostgreSQL full-text search or Algolia/Meilisearch
- Debounced search input
- Keyboard shortcut (Ctrl/Cmd + K)

---

### 3.3 Export Functionality
**Status**: Backend Only | **Priority**: Medium | **Effort**: Medium

**What Exists**:
- **Backend**: `src/actions/export.ts` with PNG, PDF, JSON export
- **Types**: Export format types defined

**What's Needed**:
- [ ] Export dialog/modal UI
- [ ] Export format selection
- [ ] Export options (resolution, include pins, etc.)
- [ ] Export progress indicator
- [ ] Export history/downloads list
- [ ] Shareable export links

**Tech Considerations**:
- Puppeteer/Playwright for PDF/image generation
- S3/R2 for storing exports
- Background jobs for large exports

---

### 3.4 World Templates
**Status**: Not Started | **Priority**: Low | **Effort**: Medium

**What's Needed**:
- [ ] Template system design
- [ ] Pre-built world templates (fantasy kingdom, sci-fi station, etc.)
- [ ] Template selection on world creation
- [ ] Custom template creation
- [ ] Template marketplace (future)
- [ ] Template from existing world

---

### 3.5 Character System
**Status**: Schema Only | **Priority**: Low | **Effort**: Large

**What Exists**:
- **Schema**: Character model (defined but not integrated)
- **PinType**: CHARACTER pin type exists

**What's Needed**:
- [ ] Character CRUD UI
- [ ] Character stat blocks
- [ ] Character portraits
- [ ] Character-to-pin linking
- [ ] Character relationships/factions
- [ ] Dialogue system (optional)
- [ ] Quest integration (optional)

---

### 3.6 Advanced Features
**Status**: Not Started | **Priority**: Varies | **Effort**: Varies

| Feature | Priority | Effort | Description |
|---------|----------|--------|-------------|
| Version History | Low | Large | Track and revert world changes |
| Comments/Annotations | Low | Medium | Add notes to map locations |
| Map Providers | Low | Medium | Integrate third-party map tiles |
| Mobile App | Low | Very Large | Native mobile experience |
| Offline Mode | Low | Large | Service worker, local storage |
| Import/Export | Medium | Medium | Import from other worldbuilding tools |

---

## 4. Technical Debt & Improvements

### 4.1 Testing
| Feature | Coverage | Action Needed |
|---------|----------|---------------|
| Pins | 98.92% (64 tests) | ✅ Excellent |
| Worlds | 0% | Add integration tests |
| Lore | 0% | Add unit tests for actions |
| Gallery | 0% | Add upload handling tests |
| Layers | 0% | Add reorder/visibility tests |

### 4.2 Performance
- [ ] Implement proper caching strategy
- [ ] Optimize map rendering for large worlds
- [ ] Add pagination for large pin/lore lists
- [ ] Image optimization and lazy loading
- [ ] Bundle size analysis and optimization

### 4.3 Accessibility
- [ ] Full keyboard navigation audit
- [ ] Screen reader testing
- [ ] Focus management in modals/forms
- [ ] ARIA labels review
- [ ] Color contrast verification

---

## 5. Milestones

### v0.5 - Current State
- ✅ Auth, Worlds, Pins, Layers
- ✅ Explore/public worlds
- ⚠️ Lore (partial)
- ⚠️ Gallery (partial)

### v0.6 - Next Release
- [ ] Complete Lore integration
- [ ] Complete Gallery integration
- [ ] Search UI
- [ ] Export UI
- [ ] Permission-aware UI for collaborators

### v0.7 - Collaboration
- [ ] Real-time presence
- [ ] Activity feed
- [ ] Invite system
- [ ] Member management UI

### v1.0 - MVP
- [ ] Full feature parity across all core features
- [ ] 80%+ test coverage
- [ ] Production-ready error handling
- [ ] Performance optimizations
- [ ] Accessibility compliance

---

## 6. Progress Bar

```
Core Features  [████████████████████░░] 90%  (Auth, Worlds, Pins, Layers)
Content Tools   [████████████░░░░░░░░░░] 60%  (Lore, Gallery - UI exists, needs integration)
Collaboration   [███░░░░░░░░░░░░░░░░░░] 15%  (Schema exists, UI missing)
Search & Export [████░░░░░░░░░░░░░░░░░] 20%  (Backend exists, UI missing)
Advanced        [░░░░░░░░░░░░░░░░░░░░░] 0%   (Templates, Characters, etc.)
────────────────────────────────────────────────────────────────────────────────
Overall         [████████████████░░░░░░] 65%
```

---

## 7. Quick Reference for Developers

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
npm test -- [feature]
```

---

*This file is a living document. Update as features are implemented or priorities change.*
