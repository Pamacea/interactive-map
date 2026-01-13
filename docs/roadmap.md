# Realm Forge - Feature Roadmap

**Project**: Interactive Map Platform for Fantasy World Building
**Status**: ~45% Complete
**Last Updated**: 2025-01-13

---

## Executive Summary

Realm Forge is a web-based platform for creating and sharing interactive fantasy world maps. The platform enables game masters, RPG creators, and fantasy writers to visualize their worlds with interactive maps, character placement, lore entries, and rich media galleries.

### Current Status

**Completed (Phase 1 - Foundation)**
- Next.js 16 + TypeScript 5.9 setup
- Authentication system with NextAuth.js
- World CRUD operations
- Map editor with MapLibre GL integration
- Layers system (create, toggle, visibility)
- Responsive UI with Tailwind CSS 4
- Database schema fully defined (Prisma ORM)

**In Progress**
- Map editor refinement (sidebar, zoom controls)
- World management UI polish

**Not Started**
- Pins UI (map markers)
- Lore entries UI
- Gallery system UI
- Collaboration features
- Advanced search
- Export functionality

### Technical Debt & Risks

**Blockers:**
- No file upload system for gallery images
- No rich text editor for lore entries
- No real-time collaboration infrastructure

**Technical Gaps:**
- Missing comprehensive error handling
- No loading states for async operations
- Limited accessibility (ARIA labels incomplete)

---

## Feature Matrix

| Feature | Status | Priority | Complexity | Dependencies | Est. Story Points |
|---------|--------|----------|------------|--------------|-------------------|
| **Authentication** | ✅ Complete | P0 | M | - | 8 (Done) |
| **World CRUD** | ✅ Complete | P0 | M | Auth | 13 (Done) |
| **Map Editor** | ✅ Complete | P0 | L | World CRUD | 8 (Done) |
| **Layers System** | ✅ Complete | P1 | M | Map Editor | 5 (Done) |
| **Pins UI** | ❌ Not Started | P0 | L | Schema, Map Editor | 13 |
| **Lore UI** | ❌ Not Started | P0 | M | Schema, Rich Text | 13 |
| **Gallery UI** | ❌ Not Started | P1 | M | File Upload, Schema | 8 |
| **Search** | ⚠️ Partial | P1 | L | Worlds, Pins, Lore | 8 |
| **User Profile** | ⚠️ Partial | P2 | S | Auth | 5 |
| **Settings** | ⚠️ Partial | P2 | S | Auth | 3 |
| **Collaboration** | ❌ Not Started | P2 | XL | Real-time, Permissions | 21 |
| **Export** | ❌ Not Started | P2 | M | Map Screenshot, PDF | 8 |
| **Templates** | ❌ Not Started | P3 | M | Worlds | 8 |

**Legend:**
- ✅ Complete: Fully implemented and tested
- ⚠️ Partial: Schema or basic structure exists, UI incomplete
- ❌ Not Started: No implementation yet
- Priority: P0 (Critical), P1 (High), P2 (Medium), P3 (Low)
- Complexity: S (< 3 pts), M (3-8 pts), L (8-13 pts), XL (> 13 pts)

---

## Detailed Feature Breakdowns

### 1. PINS SYSTEM (P0 - Critical)

**Status**: Schema defined, UI not implemented

**Description**:
Interactive map markers that users can place anywhere on their world maps. Pins represent cities, villages, points of interest, characters, dungeons, shops, quests, and custom locations.

**User Stories**:
- As a world builder, I want to place customizable markers on my map to identify important locations
- As a DM, I want to add character pins with dialogue and quest information
- As a user, I want to click on pins to view detailed information and associated lore
- As a creator, I want to show/hide pins and organize them into layers

**Technical Requirements**:

**Components** (`src/components/pins/`):
```
pins/
├── ui/
│   ├── pin-marker.tsx          # MapLibre marker component
│   ├── pin-popup.tsx           # Info popup on click
│   ├── pin-create-form.tsx     # Form to create new pin
│   ├── pin-edit-form.tsx       # Edit existing pin
│   └── pins-list.tsx           # List of all pins in sidebar
├── logic/
│   ├── use-pins.ts             # Fetch pins for world
│   ├── use-pin-create.ts       # Create pin mutation
│   ├── use-pin-update.ts       # Update pin mutation
│   └── use-pin-delete.ts       # Delete pin mutation
└── methods/
    └── pin-actions.ts          # Server Actions for pins
```

**API/Server Actions** (`actions/pins.ts`):
```typescript
- createPin(data: PinInput)           // Create new pin
- updatePin(id: string, data: PinInput) // Update pin
- deletePin(id: string)               // Delete pin
- getPinById(id: string)              // Get single pin
- getPinsByWorld(worldId: string)     // Get all pins for world
- getNearbyPins(lat, lng, radius)     // Geospatial query
```

**Data Models** (Already in schema):
```typescript
enum PinType {
  CITY, VILLAGE, POI, CHARACTER, DUNGEON,
  SHOP, QUEST, TREASURE, CUSTOM
}

model Pin {
  id          string   @id
  title       string
  description string?
  pinType     PinType  @default(CUSTOM)
  latitude    float
  longitude   float
  icon        string?
  color       string   @default("#3b82f6")
  size        int      @default(32)
  isVisible   boolean  @default(true)
  properties  Json?    // RPG data (level, faction, etc.)
  layerId     string?
  // ... relations
}
```

**Zod Validation Schemas**:
```typescript
const CreatePinSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  pinType: z.enum(pinTypes),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  size: z.number().min(16).max(128),
  layerId: z.string().cuid().optional(),
  properties: z.record(z.any()).optional(),
});
```

**Dependencies**:
- Database schema: ✅ Done
- MapLibre GL integration: ✅ Done
- TanStack Query: ✅ Installed
- Zod: ✅ Installed

**Acceptance Criteria**:
- [ ] User can click on map to place pin
- [ ] Pin creation modal appears with form
- [ ] Pin type selector with icons for each type
- [ ] Color picker for pin color
- [ ] Size slider for pin size (16-128px)
- [ ] Pin can be linked to layer
- [ ] Pins are saved to database
- [ ] Pins appear on map at correct coordinates
- [ ] Clicking pin shows popup with title, description
- [ ] Pins can be edited via properties panel
- [ ] Pins can be deleted
- [ ] Pins can be toggled visible/hidden
- [ ] Pins load correctly on page refresh
- [ ] Map centers on pin when clicked from list

**Complexity**: L (13 story points)
**Priority**: P0 (Blocks user core workflows)

---

### 2. LORE ENTRIES SYSTEM (P0 - Critical)

**Status**: Schema defined, UI not implemented

**Description**:
Rich text documentation for world-building. Lore entries can be categorized (History, Geography, Characters, Factions, Magic, Items, Quests) and linked to specific map pins. Each entry has a unique slug for URL access.

**User Stories**:
- As a world builder, I want to document the history and geography of my world
- As a writer, I want to create character profiles and faction descriptions
- As a DM, I want to write quest logs and magic system descriptions
- As a user, I want to access lore entries via slugs (e.g., /world/my-world/lore/kingdom-of-azoria)
- As a creator, I want to link lore entries to specific map locations

**Technical Requirements**:

**Components** (`src/components/lore/`):
```
lore/
├── ui/
│   ├── lore-list.tsx            # List of all lore entries
│   ├── lore-card.tsx            # Single lore card
│   ├── lore-create-form.tsx     # Create new entry
│   ├── lore-editor.tsx          # Rich text editor
│   └── lore-viewer.tsx          # View formatted lore
├── logic/
│   ├── use-lore.ts              # Fetch lore entries
│   ├── use-lore-create.ts       # Create lore mutation
│   ├── use-lore-update.ts       # Update lore mutation
│   └── use-lore-delete.ts       # Delete lore mutation
└── methods/
    └── lore-actions.ts          # Server Actions for lore
```

**Required Packages**:
```bash
# Rich text editor
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
npm install @tiptap/extension-link @tiptap/extension-image

# OR alternative
npm install react-quill react-dom
```

**API/Server Actions** (`actions/lore.ts`):
```typescript
- createLoreEntry(data: LoreInput)
- updateLoreEntry(id: string, data: LoreInput)
- deleteLoreEntry(id: string)
- getLoreEntryById(id: string)
- getLoreBySlug(worldId: string, slug: string)
- getLoreByWorld(worldId: string, category?: LoreCategory)
- searchLore(worldId: string, query: string)
```

**Data Models** (Already in schema):
```typescript
enum LoreCategory {
  GENERAL, HISTORY, GEOGRAPHY, CHARACTERS,
  FACTIONS, MAGIC, ITEMS, QUESTS, CUSTOM
}

model LoreEntry {
  id          string       @id
  title       string
  content     string       @db.Text  // Rich text HTML/JSON
  slug        string
  category    LoreCategory @default(GENERAL)
  isVisible   boolean      @default(false)
  isPublic    boolean      @default(true)
  // ... relations
}
```

**Zod Validation**:
```typescript
const CreateLoreSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  category: z.enum(loreCategories),
  isPublic: z.boolean().default(true),
  isVisible: z.boolean().default(false),
});

// Slug generator utility
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
```

**Routes**:
```
GET  /world/[id]/lore                    # List all lore
GET  /world/[id]/lore/[slug]             # View single lore entry
POST /world/[id]/lore/create             # Create form
GET  /world/[id]/lore/[slug]/edit        # Edit form
```

**Dependencies**:
- Rich text editor: ❌ Need to install TipTap or Quill
- Database schema: ✅ Done
- Zod: ✅ Installed

**Acceptance Criteria**:
- [ ] Rich text editor with formatting toolbar
- [ ] Bold, italic, underline, headings
- [ ] Links to other lore entries
- [ ] Image embedding
- [ ] Category selector
- [ ] Slug auto-generation from title (editable)
- [ ] Preview mode
- [ ] Lore entries saved to database
- [ ] Lore list with search and filter by category
- [ ] Lore accessible via slug URL
- [ ] Lore can be linked to pins
- [ ] Public/private visibility toggle
- [ ] SEO-friendly (meta tags, open graph)

**Complexity**: M (13 story points)
**Priority**: P0 (Core world-building feature)

---

### 3. GALLERY SYSTEM (P1 - High)

**Status**: Schema defined, UI not implemented

**Description**:
Media management for pins and lore entries. Supports images, videos, audio, and documents. Gallery items can be attached to pins or lore entries and displayed in ordered sequences.

**User Stories**:
- As a world builder, I want to add images to my city pins
- As a creator, I want to attach maps, diagrams, and concept art to lore entries
- As a DM, I want to add ambient audio to location pins
- As a user, I want to view image galleries in a lightbox

**Technical Requirements**:

**Components** (`src/components/gallery/`):
```
gallery/
├── ui/
│   ├── gallery-grid.tsx          # Grid of gallery items
│   ├── gallery-item.tsx          # Single item card
│   ├── upload-zone.tsx           # Drag-and-drop upload
│   ├── lightbox.tsx              # Fullscreen image viewer
│   └── media-preview.tsx         # Preview different media types
├── logic/
│   ├── use-gallery.ts            # Fetch gallery items
│   ├── use-upload.ts             # Upload mutation
│   └── use-media-delete.ts       # Delete media
└── methods/
    └── media-actions.ts          # Server Actions for media
```

**Required Packages**:
```bash
# File upload handling
npm install react-dropzone

# Image optimization
npm install next/image  # Built into Next.js

# Lightbox for image viewing
npm install yet-another-react-lightbox
```

**File Storage Strategy**:

**Option A: Local Storage (Dev)**
```typescript
// Store in /public/uploads/worlds/{worldId}/{filename}
// Use fs.promises for upload handling
```

**Option B: Cloud Storage (Production)**
```bash
npm install @aws-sdk/client-s3
npm install @aws-sdk/s3-request-presigner
```

**API/Server Actions** (`actions/media.ts`):
```typescript
interface UploadInput {
  file: File;
  title?: string;
  description?: string;
  pinId?: string;
  loreEntryId?: string;
  order?: number;
}

- uploadMedia(input: UploadInput)           // Upload file
- updateGalleryItem(id: string, data)       // Update metadata
- deleteGalleryItem(id: string)             // Delete file
- reorderGallery(items: {id: string, order: number}[])
- getGalleryByPin(pinId: string)
- getGalleryByLore(loreEntryId: string)
```

**Data Models** (Already in schema):
```typescript
enum MediaType {
  IMAGE, VIDEO, AUDIO, DOCUMENT
}

model GalleryItem {
  id          string     @id
  title       string
  description string?
  imageUrl    string     // S3 URL or local path
  type        MediaType @default(IMAGE)
  order       int        @default(0)
  pinId       string?
  loreEntryId string?
  // ... relations
}
```

**Upload Handler** (`app/api/upload/route.ts`):
```typescript
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const worldId = formData.get('worldId') as string;

  // Validate file type and size
  // Max 10MB for images, 50MB for videos

  // Generate unique filename
  const filename = `${cuid()}-${file.name}`;

  // Upload to S3 or save locally
  const url = await uploadFile(file, worldId, filename);

  // Save to database
  const item = await db.galleryItem.create({
    data: { imageUrl: url, title: file.name, type: detectType(file) }
  });

  return Response.json(item);
}
```

**Dependencies**:
- File upload library: ❌ Need react-dropzone
- Image optimization: ✅ Built into Next.js
- Storage: ❌ Need S3 or local storage setup
- Lightbox: ❌ Need to install

**Acceptance Criteria**:
- [ ] Drag-and-drop upload zone
- [ ] File type validation (images, videos, audio, PDFs)
- [ ] File size limits (configurable)
- [ ] Progress indicator during upload
- [ ] Thumbnail generation for images
- [ ] Gallery grid with lazy loading
- [ ] Lightbox for fullscreen image viewing
- [ ] Audio player for audio files
- [ ] Video player for video files
- [ ] Reorder gallery items via drag-and-drop
- [ ] Delete gallery items
- [ ] Attach to pins or lore entries
- [ ] SEO optimization (alt text, lazy loading)

**Complexity**: M (8 story points)
**Priority**: P1 (High value, non-blocking)

---

### 4. SEARCH & DISCOVERY (P1 - High)

**Status**: Partial (basic UI exists, backend incomplete)

**Description**:
Full-text search across worlds, pins, and lore entries. Advanced filtering by tags, categories, and metadata.

**User Stories**:
- As a user, I want to search for worlds by title, description
- As a creator, I want to find specific pins by name or type
- As a player, I want to search lore entries by keywords
- As a user, I want to filter worlds by tags, popularity, date

**Technical Requirements**:

**Required Packages**:
```bash
# For full-text search (optional)
npm install pg-trgm  # PostgreSQL trigram extension

# Or use simple LIKE queries
```

**Components** (`src/components/search/`):
```
search/
├── ui/
│   ├── search-bar.tsx            # Global search input
│   ├── search-results.tsx        # Results dropdown
│   ├── filters-panel.tsx         # Advanced filters
│   └── recent-searches.tsx       # Search history
├── logic/
│   ├── use-search.ts             # Search hook
│   └── use-search-history.ts     # Local storage history
└── methods/
    └── search-actions.ts         # Server Actions for search
```

**API/Server Actions** (`actions/search.ts`):
```typescript
interface SearchInput {
  query: string;
  type?: 'worlds' | 'pins' | 'lore';
  filters?: {
    pinType?: PinType;
    loreCategory?: LoreCategory;
    isPublic?: boolean;
  };
}

- searchWorlds(query: string, filters?)
- searchPins(worldId: string, query: string, filters?)
- searchLore(worldId: string, query: string, filters?)
- globalSearch(query: string)  // Search all types
- getRecentSearches(userId: string)
- saveSearch(userId: string, query: string)
```

**Database Optimization**:
```sql
-- Add indexes for search
CREATE INDEX idx_worlds_title ON gameworlds USING gin(to_tsvector('english', title));
CREATE INDEX idx_pins_title ON pin USING gin(to_tsvector('english', title));
CREATE INDEX idx_lore_content ON loreentry USING gin(to_tsvector('english', content));

-- Or use simple LIKE queries
CREATE INDEX idx_worlds_title_like ON gameworlds(title);
CREATE INDEX idx_pins_title_like ON pin(title);
```

**Search Implementation**:
```typescript
// Simple search (PostgreSQL)
export async function searchWorlds(query: string) {
  return await db.gameWorld.findMany({
    where: {
      isPublic: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      user: { select: { name: true, image: true } },
      _count: { select: { pins: true, loreEntries: true } },
    },
  });
}

// Advanced search (with full-text)
export async function searchWorldsAdvanced(query: string) {
  return await db.$queryRaw`
    SELECT * FROM gameworlds
    WHERE to_tsvector('english', title || ' ' || description) @@ to_tsquery('english', ${query})
    AND is_public = true
  `;
}
```

**Dependencies**:
- Database: ✅ Ready
- No additional packages needed for basic search
- Optional: PostgreSQL extensions for advanced search

**Acceptance Criteria**:
- [ ] Global search bar in navigation
- [ ] Search results dropdown with keyboard navigation
- [ ] Search worlds by title, description
- [ ] Search pins by name, type
- [ ] Search lore by title, content
- [ ] Filter by categories
- [ ] Search history (recent searches)
- [ ] Highlight matching text
- [ ] Search analytics (track popular searches)
- [ ] Debounced search (300ms)

**Complexity**: L (8 story points)
**Priority**: P1 (High value, improves UX)

---

### 5. USER PROFILES (P2 - Medium)

**Status**: Partial (basic page exists)

**Description**:
Public user profiles showing world portfolio, bio, and activity. Users can customize their profile with avatar, bio, and social links.

**User Stories**:
- As a creator, I want to showcase my worlds on my profile
- As a user, I want to see other creators' profiles and their work
- As a player, I want to follow my favorite creators

**Technical Requirements**:

**Routes**:
```
GET /profile                     # Own profile (edit mode)
GET /profile/[userId]            # Public profile (view only)
GET /api/profile/[userId]        # Profile data API
```

**Components** (`src/components/profile/`):
```
profile/
├── ui/
│   ├── profile-header.tsx       # Avatar, name, bio
│   ├── profile-stats.tsx        # Worlds count, followers
│   ├── worlds-grid.tsx          # User's worlds
│   ├── edit-profile-form.tsx    # Edit profile
│   └── activity-feed.tsx        # Recent activity
├── logic/
│   └── use-profile.ts           # Fetch profile data
└── methods/
    └── profile-actions.ts       # Update profile
```

**Database Schema** (Already exists):
```typescript
model User {
  id      string  @id
  name    string?
  email   string?
  image   string?  // Avatar URL
  bio     string?  @db.Text
  role    Role     @default(USER)
  gameWorlds GameWorld[]
  // ... other fields
}
```

**Server Actions** (`actions/profile.ts`):
```typescript
- updateProfile(userId: string, data: { name, bio, image })
- getProfileById(userId: string)
- getPublicProfile(userId: string)  // Excludes private data
- uploadAvatar(file: File)
```

**Acceptance Criteria**:
- [ ] Public profile page accessible at /profile/[userId]
- [ ] Display user's name, avatar, bio
- [ ] Show all public worlds
- [ ] Stats (worlds created, pins count, lore entries)
- [ ] Edit profile form (name, bio, avatar)
- [ ] Avatar upload with cropping
- [ ] Social links (optional)
- [ ] Activity feed (recent world updates)

**Complexity**: S (5 story points)
**Priority**: P2 (Nice to have)

---

### 6. COLLABORATION (P2 - Medium - Complex)

**Status**: Schema defined (WorldMember model), UI not implemented

**Description**:
Multi-user editing with permission levels (Owner, Editor, Reader). Real-time collaboration using WebSockets or polling.

**User Stories**:
- As a world builder, I want to invite collaborators to my world
- As an editor, I want to add/edit pins and lore
- As a reader, I want to view but not edit
- As an owner, I want to manage permissions

**Technical Requirements**:

**Required Packages**:
```bash
# Real-time collaboration
npm install pusher           # Pusher for WebSocket
npm install pusher-js

# OR use server-sent events
# Built into Next.js
```

**Components** (`src/components/collaboration/`):
```
collaboration/
├── ui/
│   ├── invite-form.tsx           # Invite collaborators
│   ├── members-list.tsx          # List of members
│   ├── permission-selector.tsx   # Permission dropdown
│   └── presence-indicator.tsx    # Show active users
├── logic/
│   ├── use-members.ts            # Fetch members
│   ├── use-presence.ts           # Track active users
│   └── use-realtime.ts           # WebSocket hook
└── methods/
    └── collaboration-actions.ts  # Invite, remove, update permissions
```

**Database Schema** (Already exists):
```typescript
enum Permission {
  READER   // View only
  EDITOR   // Add/edit pins and lore
  OWNER    // Full control + settings
}

model WorldMember {
  id         string     @id
  userId     string
  gameWorldId string
  permission Permission @default(READER)
  createdAt  DateTime   @default(now())
  // ... relations
}
```

**Server Actions** (`actions/collaboration.ts`):
```typescript
- inviteMember(worldId: string, email: string, permission: Permission)
- updateMemberPermission(memberId: string, permission: Permission)
- removeMember(memberId: string)
- getWorldMembers(worldId: string)
- acceptInvite(inviteToken: string)
```

**Real-time Updates**:
```typescript
// Pusher trigger
import { pusherServer } from '@/lib/pusher';

export async function notifyPinCreated(worldId: string, pin: Pin) {
  await pusherServer.trigger(`world-${worldId}`, 'pin:created', pin);
}

// Client-side listening
import { useEffect } from 'react';
import Pusher from 'pusher-js';

useEffect(() => {
  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!);
  const channel = pusher.subscribe(`world-${worldId}`);

  channel.bind('pin:created', (pin) => {
    // Update local state
    queryClient.invalidateQueries(['pins', worldId]);
  });

  return () => { pusher.disconnect(); };
}, [worldId]);
```

**Acceptance Criteria**:
- [ ] Invite members via email
- [ ] Permission selector (Reader, Editor, Owner)
- [ ] Members list with avatars
- [ ] Remove members
- [ ] Real-time presence indicator (who's viewing)
- [ ] Real-time updates for pins and lore
- [ ] Activity log (who changed what)
- [ ] Email notifications for invites

**Complexity**: XL (21 story points)
**Priority**: P2 (High value, but complex)

---

### 7. EXPORT & SHARING (P2 - Medium)

**Status**: Not implemented

**Description**:
Export worlds as images, PDFs, or JSON for offline use and sharing.

**User Stories**:
- As a creator, I want to export my world as a high-res image
- As a DM, I want to export a PDF with all lore and pins
- As a user, I want to share my world via a public link

**Technical Requirements**:

**Required Packages**:
```bash
# Map screenshot
npm install mapbox-gl-to-pdf  # Or use MapLibre's built-in

# PDF generation
npm install jspdf

# JSON export/import
# Built-in
```

**Components** (`src/components/export/`):
```
export/
├── ui/
│   ├── export-modal.tsx           # Export options
│   ├── export-preview.tsx         # Preview before export
│   └── share-modal.tsx            # Share link generator
└── methods/
    └── export-actions.ts          # Export handlers
```

**Server Actions** (`actions/export.ts`):
```typescript
- exportWorldAsImage(worldId: string)     // PNG/JPEG
- exportWorldAsPDF(worldId: string)       // PDF with lore
- exportWorldAsJSON(worldId: string)      // Backup JSON
- importWorldFromJSON(json: string)       // Restore world
- generateShareLink(worldId: string)      // Public URL
```

**Export Implementations**:

**Map Screenshot**:
```typescript
// Use MapLibre's map.getCanvas().toDataURL()
function exportMapAsImage() {
  const canvas = map.getMap().getCanvas();
  const dataUrl = canvas.toDataURL('image/png');
  downloadImage(dataUrl, 'world-map.png');
}
```

**PDF Export**:
```typescript
import { jsPDF } from 'jspdf';

export async function exportWorldAsPDF(worldId: string) {
  const world = await getWorldById(worldId);
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text(world.title, 20, 20);

  let y = 40;
  for (const lore of world.loreEntries) {
    doc.setFontSize(14);
    doc.text(lore.title, 20, y);
    y += 10;
    doc.setFontSize(10);
    doc.text(lore.content.substring(0, 500), 20, y);
    y += 20;
  }

  doc.save(`${world.slug}.pdf`);
}
```

**JSON Export**:
```typescript
export async function exportWorldAsJSON(worldId: string) {
  const world = await db.gameWorld.findUnique({
    where: { id: worldId },
    include: {
      pins: true,
      loreEntries: true,
      layers: true,
      members: true,
    },
  });

  const json = JSON.stringify(world, null, 2);
  return new Response(json, {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

**Acceptance Criteria**:
- [ ] Export map as PNG image
- [ ] Export world as PDF (title, description, lore)
- [ ] Export world as JSON (backup)
- [ ] Import world from JSON
- [ ] Generate shareable link
- [ ] QR code for sharing (optional)
- [ ] Include/exclude private data option

**Complexity**: M (8 story points)
**Priority**: P2 (Medium value)

---

### 8. TEMPLATES (P3 - Low)

**Status**: Not implemented

**Description**:
Starter world templates for quick creation (Fantasy Kingdom, Sci-Fi Universe, Post-Apocalyptic, etc.).

**User Stories**:
- As a new user, I want to start from a template instead of blank
- As a creator, I want to browse template gallery
- As an admin, I want to create custom templates

**Technical Requirements**:

**Database Schema** (Add new model):
```typescript
model Template {
  id          string   @id @default(cuid())
  name        string
  description string
  category    string   // fantasy, sci-fi, modern, etc.
  thumbnail   string
  isOfficial  boolean  @default(true)
  worlds      GameWorld[]
  createdAt   DateTime @default(now())
}
```

**Components** (`src/components/templates/`):
```
templates/
├── ui/
│   ├── template-gallery.tsx       # Browse templates
│   ├── template-card.tsx          # Single template
│   └── use-template-modal.tsx     # Confirm template use
└── methods/
    └── template-actions.ts        # Create world from template
```

**Server Actions**:
```typescript
- getTemplates()
- createWorldFromTemplate(templateId: string, userId: string)
- createTemplate(data: TemplateInput)
```

**Acceptance Criteria**:
- [ ] Template gallery page
- [ ] Preview template before use
- [ ] Create world from template (copies all data)
- [ ] Template categories
- [ ] Official vs community templates

**Complexity**: M (8 story points)
**Priority**: P3 (Low priority)

---

## Implementation Phases

### Phase 1: Core Features (Current Focus)

**Goal**: Complete MVP with pins, lore, and gallery

**Timeline**: ~4-6 weeks

**Tasks**:
1. **Pins System** (2 weeks)
   - Pin marker component
   - Pin creation/editing forms
   - MapLibre integration
   - Pin properties panel
   - Layer association

2. **Lore System** (2 weeks)
   - Rich text editor (TipTap)
   - Lore CRUD
   - Slug-based routing
   - Category filtering
   - Link lore to pins

3. **Gallery System** (1-2 weeks)
   - File upload (S3 or local)
   - Image gallery grid
   - Lightbox viewer
   - Attach to pins/lore

**Deliverables**:
- Fully functional world builder
- Pins, lore, and gallery working
- Exportable as JSON
- Public sharing links

---

### Phase 2: Enhanced Experience

**Goal**: Improve UX, add search, polish UI

**Timeline**: ~3-4 weeks

**Tasks**:
1. **Search & Discovery** (1 week)
   - Global search bar
   - Search worlds, pins, lore
   - Advanced filters
   - Search history

2. **User Profiles** (1 week)
   - Public profile pages
   - Edit profile form
   - Avatar upload
   - World portfolio

3. **Settings** (3 days)
   - Preferences
   - Notification settings
   - Privacy controls

4. **UI Polish** (1 week)
   - Loading states
   - Error handling
   - Accessibility (ARIA)
   - Animations

**Deliverables**:
- Improved UX
- Better navigation
- Professional UI

---

### Phase 3: Collaboration & Advanced

**Goal**: Multi-user editing, export, templates

**Timeline**: ~4-5 weeks

**Tasks**:
1. **Collaboration** (2-3 weeks)
   - Invite members
   - Permission system
   - Real-time presence
   - Activity log

2. **Export & Sharing** (1 week)
   - Map screenshot
   - PDF export
   - JSON export/import
   - Shareable links

3. **Templates** (1 week)
   - Template gallery
   - Create from template
   - Official templates

**Deliverables**:
- Full collaboration features
- Export capabilities
- Template system

---

## Technical Considerations

### Required Packages

**Missing / Need to Install**:
```bash
# Rich Text Editor
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-link

# File Upload
npm install react-dropzone

# Lightbox
npm install yet-another-react-lightbox

# Real-time (optional)
npm install pusher pusher-js

# PDF Export
npm install jspdf

# Image optimization (built-in)
# next/image is already available
```

### Database Migrations Needed

**All core schemas are defined**, but may need:
- Indexes for search performance
- Trigram extension for full-text search
- Additional constraints (unique slugs per world)

### API Routes to Create

```
/api/pins              # Pin CRUD
/api/lore              # Lore CRUD
/api/gallery           # Gallery CRUD
/api/upload            # File uploads
/api/search            # Search
/api/export            # Export handlers
/api/collaboration     # Invite members
/api/profile           # User profiles
```

### State Management Strategy

**Zustand Stores** (Client UI State):
```typescript
store/
├── use-sidebar.ts              # ✅ Already exists
├── use-map.ts                  # Map state (zoom, center)
├── use-pins.ts                 # Selected pin, editing state
├── use-lore.ts                 # Selected lore, editing state
└── use-collaboration.ts        # Active users, presence
```

**TanStack Query** (Server State):
```typescript
// All data fetching uses useQuery
const { data: pins } = useQuery({
  queryKey: ['pins', worldId],
  queryFn: () => getPinsByWorld(worldId),
});

// Mutations use useMutation
const createPin = useMutation({
  mutationFn: createPin,
  onSuccess: () => {
    queryClient.invalidateQueries(['pins', worldId]);
  },
});
```

---

## Dependencies Graph

```
Authentication (Complete)
    ↓
World CRUD (Complete)
    ↓
Map Editor (Complete)
    ↓
    ├─→ Layers System (Complete)
    │
    ├─→ Pins System (Not Started) ──→ Lore Links
    │       ↓
    │   Gallery Attachments
    │
    ├─→ Lore System (Not Started) ──→ Rich Text Editor
    │       ↓
    │   Gallery Attachments
    │
    └─→ Gallery System (Not Started) ──→ File Upload

Search (Partial) ──→ Worlds, Pins, Lore

Collaboration (Not Started) ──→ Permissions, Real-time

Export (Not Started) ──→ Screenshot, PDF, JSON

Templates (Not Started) ──→ World CRUD
```

---

## Technical Blockers

### Critical Blockers

1. **File Upload System** (Blocks Gallery)
   - Need S3 bucket or local storage setup
   - File validation and security
   - Image optimization pipeline

2. **Rich Text Editor** (Blocks Lore)
   - Need to install TipTap or Quill
   - Sanitize HTML output (security)
   - Image upload integration

3. **Real-time Infrastructure** (Blocks Collaboration)
   - Pusher account or WebSocket server
   - Presence tracking system
   - Conflict resolution (if multiple editors)

### Solutions

**File Upload**:
- **Quick Solution**: Local storage in `/public/uploads`
- **Production Solution**: AWS S3 or Cloudflare R2
- **Cost**: $0-20/month for S3

**Rich Text Editor**:
- **Recommended**: TipTap (most flexible)
- **Alternative**: Quill (simpler)
- **Cost**: Free

**Real-time**:
- **Quick Solution**: Polling every 5s
- **Production Solution**: Pusher ($0-200/month)
- **Alternative**: Supabase Realtime (free tier)

---

## Recommended Next Steps

### Immediate Actions (Week 1-2)

**Priority: P0 Features**

1. **Install Missing Dependencies**
   ```bash
   npm install @tiptap/react @tiptap/starter-kit
   npm install react-dropzone yet-another-react-lightbox
   ```

2. **Create Pins System**
   - File structure: `components/pins/`
   - Server Actions: `actions/pins.ts`
   - UI: Pin marker, creation form, properties panel
   - Integration with MapLibre

3. **Set Up File Upload**
   - Create `/app/api/upload/route.ts`
   - Configure storage (local or S3)
   - Add validation and security

### Short-term Goals (Week 3-4)

4. **Create Lore System**
   - Install TipTap
   - File structure: `components/lore/`
   - Rich text editor component
   - Slug-based routing

5. **Create Gallery System**
   - File structure: `components/gallery/`
   - Upload zone component
   - Gallery grid and lightbox

### Medium-term Goals (Week 5-8)

6. **Implement Search**
   - Global search bar
   - Search API routes
   - Database indexes

7. **Polish UI**
   - Loading states
   - Error handling
   - Accessibility

### Long-term Goals (Week 9-16)

8. **Collaboration**
   - Permission system
   - Real-time updates
   - Activity log

9. **Export & Templates**
   - Screenshot export
   - PDF generation
   - Template system

---

## Success Metrics

### Phase 1 Success Criteria
- [ ] Users can create worlds with 50+ pins
- [ ] Users can write 20+ lore entries per world
- [ ] Gallery supports 100+ images per world
- [ ] Page load time < 2s
- [ ] Zero data loss bugs

### Phase 2 Success Criteria
- [ ] Search response time < 500ms
- [ ] 1000+ concurrent users
- [ ] 99.9% uptime
- [ ] Mobile responsiveness complete

### Phase 3 Success Criteria
- [ ] 5+ users can collaborate simultaneously
- [ ] Export success rate > 95%
- [ ] User adoption > 1000 MAU

---

## Appendix

### A. Story Point Estimation Guide

- **S (Small)**: 1-3 points (~1 day)
  - Simple forms, basic CRUD, UI polish

- **M (Medium)**: 3-8 points (~2-4 days)
  - Moderate complexity, multiple components, some integrations

- **L (Large)**: 8-13 points (~1 week)
  - Complex features, multiple integrations, significant logic

- **XL (Extra Large)**: 13+ points (~2+ weeks)
  - Very complex, new infrastructure, multiple systems

### B. Priority Definitions

- **P0 (Critical)**: Blocks core functionality, must have for MVP
- **P1 (High)**: Important features, significantly improves UX
- **P2 (Medium)**: Nice to have, improves value but not essential
- **P3 (Low)**: Future enhancements, can be deferred

### C. Risk Assessment

**High Risk**:
- File upload security (vulnerabilities if misconfigured)
- Real-time collaboration (conflict resolution complexity)
- Performance with large datasets (1000+ pins)

**Mitigation**:
- File upload: Validate types, limit sizes, use virus scanning
- Real-time: Use proven solutions (Pusher, Supabase)
- Performance: Implement clustering, pagination, lazy loading

---

**Document Status**: Living document, updated weekly
**Maintainer**: Development team
**Review Date**: Every sprint planning
