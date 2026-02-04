# Genesis - Feature Progress Tracker

> Last updated: 2026-02-04 | Overall completion: **~99%**

---

## Quick Summary

| Status | Features |
|--------|----------|
| **Fully Implemented** | Auth, Worlds, Pins, Layers, Explore, Search, Export, Lore, Gallery, Invite System, Real-time Presence, Characters |
| **Partially Implemented** | Collaboration (real-time sync pending) |
| **Not Started** | Templates, Advanced Features |

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

## 2. Fully Implemented Features

### 2.1 Lore Entries System
**Status**: ✅ Complete | **Priority**: High | **Tests**: None

- **Schema**: LoreEntry, LoreCategory, LorePinRelation, LoreReference
  - Bi-directional lore-pin linking with relation types
  - Cross-references between lore entries
- **Backend** (`src/actions/lore.ts`):
  - `createLoreEntry`, `updateLoreEntry`, `deleteLoreEntry`, `toggleLoreVisibility`
  - `getLoreEntryById`, `getLoreEntriesByWorld`, `getLoreEntryBySlug`
  - **NEW**: `linkLoreToPin`, `unlinkLoreFromPin` - Pin linking
  - **NEW**: `getPinsForLore`, `getLoreForPin` - Linked data fetching
  - **NEW**: `createLoreReference`, `deleteLoreReference` - Cross-references
  - **NEW**: `getLoreReferences`, `getLoreReferencedBy` - Reference traversal
- **State Management**: `src/stores/use-lore-store.ts` (472 lines)
- **UI Components** (`src/components/lore/ui/`):
  - `lore-card.tsx`, `lore-form.tsx`, `lore-list.tsx`
  - `lore-detail.tsx` - Detail view with markdown rendering
  - `markdown-editor.tsx` - Markdown editor with live preview
  - `markdown-renderer.tsx` - Markdown display with wiki-link support
  - **NEW**: `lore-detail-client.tsx` - Full page view
  - **NEW**: `lore-link-preview.tsx` - Hover preview for wiki links
  - **NEW**: `lore-table-of-contents.tsx` - Auto-generated TOC
  - **NEW**: `related-entries.tsx` - Related entries sidebar
- **Routes**:
  - **NEW**: `/world/[id]/lore/[slug]` - Individual lore entry page

---

### 2.2 Image Gallery System
**Status**: ✅ Complete | **Priority**: Medium | **Tests**: None

- **Schema**: GalleryItem, GalleryCollection, CollectionItem
  - Collections/folders organization
  - Tags and metadata support
  - Crop data and image dimensions
- **Backend** (`src/actions/gallery.ts`):
  - `uploadGalleryImage` - Single file upload
  - **NEW**: `uploadGalleryImagesBulk` - Batch upload with progress
  - `updateGalleryItem`, `deleteGalleryItem`
  - `linkGalleryItemToPin`, `linkGalleryItemToLore`
  - **NEW**: `createCollection`, `updateCollection`, `deleteCollection`
  - **NEW**: `addItemsToCollection`, `removeItemsFromCollection`
  - **NEW**: `updateItemTags`, `searchGalleryByTags`
  - **NEW**: `getCollectionsByWorld` - Collection fetching
- **State Management**: `src/stores/use-gallery-store.ts` (468 lines)
- **Data Fetching**: TanStack Query hooks
- **UI Components** (`src/components/gallery/ui/`):
  - `image-gallery.tsx`, `image-card.tsx`, `image-lightbox.tsx`
  - `image-upload-zone.tsx` - Drop zone for uploads
  - `gallery-grid.tsx` - Grid layout

---

### 2.3 Invite System
**Status**: ✅ Complete | **Priority**: High | **Tests**: None

- **Schema**: WorldInvite with token-based invites
  - Email-specific and shareable link invites
  - Expiration tracking and status management
- **Backend** (`src/actions/invites.ts`):
  - `createInvite` - Email invite generation
  - `createShareLink` - Shareable link creation
  - `acceptInvite`, `declineInvite` - Invite handling
  - `getPendingInvites` - List pending invites
  - `revokeInvite`, `resendInvite` - Invite management
  - `getInviteByToken` - Public invite lookup
  - `getInvitesForUser` - User's incoming invites
- **Routes**:
  - `/invite/[token]` - Public invite accept page

---

## 3. Basic Implementation Features

### 3.1 Collaboration System
**Status**: 90% Complete | **Priority**: High | **Effort**: Large

**What Works**:
- **Schema**: WorldMember with roles (READER, EDITOR, OWNER), WorldInvite
- **NEW Schema**: UserPresence, CollaborationEvent (for real-time tracking)
- **Permission System**: `src/lib/server-helpers.ts`
  - `verifyWorldPermission`, `verifyPinPermission`, etc.
- **Backend** (`src/actions/worlds.ts`):
  - `getWorldMembers`, `addWorldMember`, `updateWorldMemberPermission`, `removeWorldMember`
- **Backend** (`src/actions/invites.ts`):
  - `createInvite`, `createShareLink` - Invite generation
  - `acceptInvite`, `declineInvite`, `revokeInvite`, `resendInvite` - Invite management
  - `getPendingInvites`, `getInvitesForUser`, `getInviteByToken` - Invite lookup
- **NEW Backend** (`src/actions/presence.ts`):
  - `updatePresence` - Track user presence with cursor/viewport
  - `getActiveUsers` - Get currently active users
  - `removePresence` - Clean up on disconnect
  - `cleanupInactivePresences` - Remove stale presence
  - `logCollaborationEvent` - Log collaborative actions
  - `getRecentEvents` - Fetch activity history
- **NEW Real-time Infrastructure** (`src/lib/pusher.ts`):
  - Pusher server client configuration
  - Presence/private channel helpers
  - Event type definitions
- **NEW Client Hooks** (`src/hooks/use-pusher-channel.ts`):
  - `usePresenceChannel` - Subscribe to presence updates
  - `useRealtimeSubscription` - Subscribe to collaboration events
- **NEW Presence Components** (`src/components/presence/`):
  - `PresenceIndicator` - Show online users with avatars
  - `UserCursor` - Render other users' cursors on map
  - `CursorFlag` - User name flag on cursor
  - `usePresence` - Presence state management hook
  - `useCursorBroadcast` - Cursor broadcasting with debouncing
- **UI Components** (`src/components/members/`):
  - `members-list.tsx` - Members list with management
- **Floating Panel**: `src/components/world/ui/floating/members-module.tsx`

**What's Missing**:
- [ ] Real-time editing synchronization (WebSocket/Socket.io)
- [ ] Conflict resolution for concurrent edits
- [ ] Activity feed UI (recent changes)

**Tech Considerations**:
- Pusher integration for real-time events
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
**Status**: ✅ Complete | **Priority**: Low | **Effort**: Large

- **Schema**: Character, CharacterType, CharacterRole, CharacterPinRelation, CharacterRelationship
  - 8 character types (PLAYER, NPC, ENEMY, MERCHANT, QUEST_GIVER, COMPANION, BOSS, CUSTOM)
  - 8 role types (PROTAGONIST, ANTAGONIST, SUPPORTING, BACKGROUND, MENTOR, ALLY, NEUTRAL, HOSTILE)
  - Character-to-Pin linking (similar to Lore-Pin)
  - Character-to-Character relationships
  - Stats, skills, equipment, dialogue, shop inventory (JSON fields)
- **Backend** (`src/actions/characters.ts`):
  - `createCharacter`, `updateCharacter`, `deleteCharacter`, `toggleCharacterVisibility`
  - `getCharactersByWorld`, `getCharactersFiltered`, `getCharacterById`
  - `linkCharacterToPin`, `unlinkCharacterFromPin`
  - `getPinsForCharacter`, `getCharactersForPin`
  - `createCharacterRelationship`, `updateCharacterRelationship`, `deleteCharacterRelationship`
  - `getCharacterRelationships`, `uploadCharacterPortrait`
  - `reorderCharacters`
- **State Management**: `src/stores/use-character-store.ts`
- **UI Components** (`src/components/character/ui/`):
  - `character-card.tsx` - Character display card with portrait
  - `character-list.tsx` - Grid/list view with type/role filters
  - `character-form.tsx` - Create/edit form with all fields
  - `character-detail.tsx` - Full detail view with stats, relationships, linked pins
  - `character-stat-block.tsx` - RPG stat block display
- **Floating Panel**: `src/components/world/ui/floating/characters-module.tsx`
- **Pin Popup Integration**: Linked characters shown in pin popup (`src/components/pins/ui/popup-content-sections/pin-characters-section.tsx`)
- **Features**:
  - Character CRUD with validation
  - Type and role filtering
  - Portrait upload support
  - Pin-to-Character bi-directional linking
  - Character-to-Character relationships
  - Stat blocks with D&D-style stats
  - Skills, equipment, factions
  - Dialogue and quest storage (JSON)

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
| Characters | 0% | Add character CRUD tests |

### 5.2 Performance
- [x] TanStack Query caching implemented for Gallery
- [ ] Implement caching for Search results
- [ ] Implement Tanstack Form for all forms.
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

### v0.7 - Current State ✅
- ✅ Auth, Worlds, Pins, Layers, Explore
- ✅ Search (full UI with keyboard shortcut)
- ✅ Export (PNG/PDF/JSON with dialog)
- ✅ Lore (markdown editor, detail view, wiki-links, cross-references)
- ✅ Lore-to-pin linking (bi-directional with relation types)
- ✅ Gallery (TanStack Query, bulk upload, collections/folders)
- ✅ Invite system (email invites, shareable links)
- ✅ Member management UI
- ✅ Character system (CRUD, stat blocks, portraits, relationships, pin linking)

### v0.8 - Next Release
- [x] Real-time presence indicators
- [x] Character system complete
- [ ] Activity feed UI
- [ ] Test coverage for core features
- [ ] Performance optimizations

### v1.0 - MVP
- [ ] Real-time editing synchronization (WebSocket/Socket.io)
- [ ] Conflict resolution for concurrent edits
- [ ] Full feature parity across all core features
- [ ] 80%+ test coverage
- [ ] Production-ready error handling
- [ ] Accessibility compliance

---

## 7. Progress Bar

```
Core Features     [████████████████████] 100% (Auth, Worlds, Pins, Layers, Explore)
Content Tools      [████████████████████] 100% (Lore ✅, Gallery ✅, Invites ✅, Characters ✅)
Collaboration      [███████████████████░░] 90%  (Members UI, Presence ✅, sync pending)
Search & Export    [████████████████████] 100% (Search ✅, Export ✅)
Advanced           [░░░░░░░░░░░░░░░░░░░░░] 5%   (Templates)
────────────────────────────────────────────────────────────────────────────────
Overall            [████████████████████░] 99%
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
