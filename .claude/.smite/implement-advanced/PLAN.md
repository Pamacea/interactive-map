# Genesis - Advanced Features Implementation Plan

> Created: 2025-02-05
> Status: Planning Phase
> Priority: Medium

---

## Executive Summary

This document outlines the implementation strategy for 6 advanced features in the Genesis interactive map platform. Features are prioritized by value, complexity, and dependencies.

### Implementation Priority Order

| Priority | Feature | Effort | Dependencies |
|----------|---------|--------|--------------|
| 1 | Comments/Annotations | Medium | Existing collaboration system |
| 2 | Version History | Large | Comments (for context) |
| 3 | Import from Tools | Medium | Existing export system |
| 4 | Offline Mode | Large | Service worker setup |
| 5 | Map Providers | Medium | MapLibre GL integration |
| 6 | Mobile App (PWA) | Very Large | Offline mode foundation |

---

## 1. Comments/Annotations Feature

### Overview
Add notes and comments to specific map locations, pins, or general areas. Supports threaded discussions and resolved status.

### Database Schema

```prisma
// Add to prisma/schema.prisma

model MapComment {
  id          String   @id @default(cuid())
  worldId     String
  world       GameWorld @relation("WorldComments", fields: [worldId], references: [id], onDelete: Cascade)

  // Optional: Attach to pin
  pinId       String?
  pin         Pin?     @relation("PinComments", fields: [pinId], references: [id], onDelete: Cascade)

  // Location for free-standing annotations
  latitude    Float?
  longitude   Float?

  // Comment content
  content     String   @db.Text
  isResolved  Boolean  @default(false)

  // Thread support
  parentId    String?
  parent      MapComment? @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies     MapComment[] @relation("CommentReplies")

  // Metadata
  userId      String
  user        User     @relation("UserComments", fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([worldId, isResolved])
  @@index([pinId])
  @@index([parentId])
  @@index([latitude, longitude])
}

// Update User model
model User {
  // ... existing fields
  comments    MapComment[] @relation("UserComments")
}

// Update Pin model
model Pin {
  // ... existing fields
  comments    MapComment[] @relation("PinComments")
}

// Update GameWorld model
model GameWorld {
  // ... existing fields
  comments    MapComment[] @relation("WorldComments")
}
```

### File Structure

```
src/
├── actions/
│   └── comments.ts                    # Server Actions
├── components/
│   └── comments/
│       ├── ui/
│       │   ├── comment-marker.tsx     # Map marker for comments
│       │   ├── comment-popup.tsx      # Comment display popup
│       │   ├── comment-thread.tsx     # Thread view with replies
│       │   ├── comment-form.tsx       # Create/edit form
│       │   └── comment-filter.tsx     # Filter by status
│       ├── logic/
│       │   ├── use-comment-actions.ts # CRUD operations
│       │   ├── use-comments-filter.ts # Filter state
│       │   └── use-comment-position.ts # Position calculations
│       └── utils/
│           └── comment-utils.ts       # Helper functions
├── store/
│   └── use-comments-store.ts          # Zustand store
├── hooks/
│   └── use-comments-sync.ts           # Real-time sync
└── types/
    └── comments.types.ts              # TypeScript types
```

### Server Actions (`src/actions/comments.ts`)

```typescript
"use server"

import { db } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/server-helpers"
import { verifyWorldPermission } from "@/lib/server-helpers"
import { revalidatePath } from "next/cache"

// Create a new comment
export async function createComment(input: {
  worldId: string
  pinId?: string
  latitude?: number
  longitude?: number
  content: string
  parentId?: string
}) {
  const user = await getAuthenticatedUser()
  await verifyWorldPermission(input.worldId, user.id, "EDITOR")

  const comment = await db.mapComment.create({
    data: {
      worldId: input.worldId,
      pinId: input.pinId,
      latitude: input.latitude,
      longitude: input.longitude,
      content: input.content,
      parentId: input.parentId,
      userId: user.id,
    },
    include: {
      user: true,
      replies: { include: { user: true } },
    },
  })

  // Log to activity feed
  await safeLogCollaborationEvent({
    worldId: input.worldId,
    eventType: CollaborationEventType.COMMENT_CREATED,
    targetId: comment.id,
    targetType: "comment",
  })

  revalidatePath(`/world/${input.worldId}`)
  return comment
}

// Get comments for a world
export async function getWorldComments(input: {
  worldId: string
  pinId?: string
  includeResolved?: boolean
}) {
  await verifyWorldPermission(input.worldId, await getAuthenticatedUserId(), "READER")

  return await db.mapComment.findMany({
    where: {
      worldId: input.worldId,
      pinId: input.pinId,
      isResolved: input.includeResolved ? undefined : false,
      parentId: null, // Only top-level comments
    },
    include: {
      user: true,
      replies: { include: { user: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

// Resolve/unresolve a comment
export async function toggleCommentResolved(input: {
  commentId: string
  resolved: boolean
}) {
  const comment = await db.mapComment.findUnique({
    where: { id: input.commentId },
  })
  if (!comment) throw new Error("Comment not found")

  await verifyWorldPermission(comment.worldId, await getAuthenticatedUserId(), "EDITOR")

  const updated = await db.mapComment.update({
    where: { id: input.commentId },
    data: { isResolved: input.resolved },
  })

  await safeLogCollaborationEvent({
    worldId: comment.worldId,
    eventType: input.resolved
      ? CollaborationEventType.COMMENT_RESOLVED
      : CollaborationEventType.COMMENT_REOPENED,
    targetId: comment.id,
    targetType: "comment",
  })

  revalidatePath(`/world/${comment.worldId}`)
  return updated
}

// Delete a comment
export async function deleteComment(input: { commentId: string }) {
  const comment = await db.mapComment.findUnique({
    where: { id: input.commentId },
    include: { world: true },
  })

  if (!comment) throw new Error("Comment not found")

  const user = await getAuthenticatedUser()

  // Only author or owner can delete
  if (comment.userId !== user.id && comment.world.userId !== user.id) {
    throw new Error("Unauthorized")
  }

  await db.mapComment.delete({ where: { id: input.commentId } })

  await safeLogCollaborationEvent({
    worldId: comment.worldId,
    eventType: CollaborationEventType.COMMENT_DELETED,
    targetId: comment.id,
    targetType: "comment",
  })

  revalidatePath(`/world/${comment.worldId}`)
  return { success: true }
}
```

### UI Components

#### Comment Marker (`src/components/comments/ui/comment-marker.tsx`)

```tsx
"use client"

import { memo } from "react"
import { MessageSquare } from "lucide-react"

interface CommentMarkerProps {
  latitude: number
  longitude: number
  count: number
  hasUnresolved: boolean
  onClick: () => void
}

export const CommentMarker = memo(function CommentMarker({
  latitude,
  longitude,
  count,
  hasUnresolved,
  onClick,
}: CommentMarkerProps) {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
      style={{ left: `${longitude * 100}%`, top: `${latitude * 100}%` }}
      onClick={onClick}
    >
      <div className={`
        relative flex items-center justify-center
        w-8 h-8 rounded-full border-2
        ${hasUnresolved
          ? "bg-accent-gold border-accent-gold text-slate-950"
          : "bg-slate-800 border-slate-600 text-slate-400"
        }
        group-hover:scale-110 transition-transform
      `}>
        <MessageSquare size={16} />
        {count > 1 && (
          <span className="absolute -top-1 -right-1 bg-slate-950 text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
      </div>
    </div>
  )
})
```

#### Comment Thread (`src/components/comments/ui/comment-thread.tsx`)

```tsx
"use client"

import { MapComment } from "@prisma/client"
import { User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface CommentThreadProps {
  comments: MapComment[]
  onReply: (parentId: string) => void
  onResolve: (commentId: string) => void
}

export function CommentThread({ comments, onReply, onResolve }: CommentThreadProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={onReply}
          onResolve={onResolve}
        />
      ))}
    </div>
  )
}

function CommentItem({ comment, onReply, onResolve }: { comment: MapComment, onReply: Function, onResolve: Function }) {
  return (
    <div className="bg-slate-800 rounded-sm p-4 border border-border-subtle">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
          <User size={16} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{comment.user.name}</span>
            <span className="text-slate-500 text-sm">
              {formatDistanceToNow(new Date(comment.createdAt))} ago
            </span>
          </div>
          <p className="mt-2 text-slate-300">{comment.content}</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => onReply(comment.id)} className="text-sm text-accent-gold hover:underline">
              Reply
            </button>
            {!comment.isResolved && (
              <button onClick={() => onResolve(comment.id)} className="text-sm text-slate-400 hover:underline">
                Resolve
              </button>
            )}
          </div>
        </div>
      </div>
      {comment.replies.length > 0 && (
        <div className="mt-4 ml-8 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} onResolve={onResolve} />
          ))}
        </div>
      )}
    </div>
  )
}
```

### Integration Points

1. **Map Canvas**: Add comment markers layer above pins
2. **Pin Popup**: Show comments attached to pin
3. **Activity Feed**: Log comment events
4. **Floating Panels**: Add comments module

---

## 2. Version History Feature

### Overview
Track and revert changes to worlds, pins, and layers. Builds on existing CollaborationEvent system.

### Database Schema

```prisma
// Add to prisma/schema.prisma

model WorldVersion {
  id          String   @id @default(cuid())
  worldId     String
  world       GameWorld @relation("WorldVersions", fields: [worldId], references: [id], onDelete: Cascade)
  version     Int
  name        String
  description String?
  snapshot    Json     // Complete world state snapshot
  userId      String
  user        User     @relation("UserWorldVersions", fields: [userId], references: [id])
  createdAt   DateTime @default(now())

  @@unique([worldId, version])
  @@index([worldId, createdAt])
}

model PinVersion {
  id          String   @id @default(cuid())
  pinId       String
  pin         Pin      @relation("PinVersions", fields: [pinId], references: [id], onDelete: Cascade)
  version     Int
  title       String
  description String?
  latitude    Float
  longitude   Float
  icon        String?
  color       String
  size        Int
  opacity     Float
  layerId     String?
  properties  Json?
  userId      String
  user        User     @relation("UserPinVersions", fields: [userId], references: [id])
  createdAt   DateTime @default(now())

  @@unique([pinId, version])
  @@index([pinId, createdAt])
}

model LayerVersion {
  id          String   @id @default(cuid())
  layerId     String
  layer       MapLayer @relation("LayerVersions", fields: [layerId], references: [id], onDelete: Cascade)
  version     Int
  name        String
  imageData   String?
  visible     Boolean
  opacity     Float
  offsetX     Float
  offsetY     Float
  scale       Float
  zIndex      Int
  userId      String
  user        User     @relation("UserLayerVersions", fields: [userId], references: [id])
  createdAt   DateTime @default(now())

  @@unique([layerId, version])
  @@index([layerId, createdAt])
}

// Update models
model User {
  // ... existing fields
  worldVersions WorldVersion[] @relation("UserWorldVersions")
  pinVersions   PinVersion[]   @relation("UserPinVersions")
  layerVersions LayerVersion[] @relation("UserLayerVersions")
}

model GameWorld {
  // ... existing fields
  versions WorldVersion[] @relation("WorldVersions")
}

model Pin {
  // ... existing fields
  versions PinVersion[] @relation("PinVersions")
}

model MapLayer {
  // ... existing fields
  versions LayerVersion[] @relation("LayerVersions")
}
```

### File Structure

```
src/
├── actions/
│   └── versions.ts                    # Server Actions
├── components/
│   └── versions/
│       ├── ui/
│       │   ├── version-timeline.tsx   # Timeline of versions
│       │   ├── version-diff.tsx       # Diff viewer
│       │   ├── version-restore-dialog.tsx # Confirm restore
│       │   └── auto-save-indicator.tsx   # Auto-save status
│       ├── logic/
│       │   ├── use-version-history.ts # Version data fetching
│       │   └── use-version-restore.ts # Restore logic
│       └── utils/
│           └── diff-utils.ts          # Diff calculation
├── store/
│   └── use-versions-store.ts          # Zustand store
└── hooks/
    └── use-auto-save.ts               # Auto-save hook
```

### Server Actions (`src/actions/versions.ts`)

```typescript
"use server"

import { db } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/server-helpers"
import { verifyWorldPermission } from "@/lib/server-helpers"
import { revalidatePath } from "next/cache"

// Create a world version snapshot
export async function createWorldVersion(input: {
  worldId: string
  name?: string
  description?: string
}) {
  const user = await getAuthenticatedUser()
  await verifyWorldPermission(input.worldId, user.id, "EDITOR")

  // Get latest version number
  const latestVersion = await db.worldVersion.findFirst({
    where: { worldId: input.worldId },
    orderBy: { version: "desc" },
  })

  const version = (latestVersion?.version ?? 0) + 1

  // Fetch complete world state
  const world = await db.gameWorld.findUnique({
    where: { id: input.worldId },
    include: {
      pins: { include: { layer: true } },
      layers: true,
      loreEntries: true,
      characters: true,
    },
  })

  if (!world) throw new Error("World not found")

  const snapshot = {
    world: {
      name: world.name,
      description: world.description,
      map: world.map,
    },
    pins: world.pins,
    layers: world.layers,
    loreEntries: world.loreEntries,
    characters: world.characters,
  }

  const worldVersion = await db.worldVersion.create({
    data: {
      worldId: input.worldId,
      version,
      name: input.name || `Version ${version}`,
      description: input.description,
      snapshot,
      userId: user.id,
    },
  })

  await safeLogCollaborationEvent({
    worldId: input.worldId,
    eventType: CollaborationEventType.WORLD_VERSION_CREATED,
    targetId: worldVersion.id,
    targetType: "version",
  })

  revalidatePath(`/world/${input.worldId}`)
  return worldVersion
}

// Get version history for a world
export async function getWorldVersions(input: {
  worldId: string
  limit?: number
}) {
  await verifyWorldPermission(input.worldId, await getAuthenticatedUserId(), "READER")

  return await db.worldVersion.findMany({
    where: { worldId: input.worldId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: input.limit ?? 50,
  })
}

// Restore world to a specific version
export async function restoreWorldVersion(input: {
  worldId: string
  versionId: string
}) {
  const user = await getAuthenticatedUser()
  await verifyWorldPermission(input.worldId, user.id, "OWNER")

  const worldVersion = await db.worldVersion.findUnique({
    where: { id: input.versionId },
  })

  if (!worldVersion || worldVersion.worldId !== input.worldId) {
    throw new Error("Version not found")
  }

  const snapshot = worldVersion.snapshot as any

  // Restore world metadata
  await db.gameWorld.update({
    where: { id: input.worldId },
    data: {
      name: snapshot.world.name,
      description: snapshot.world.description,
      map: snapshot.world.map,
    },
  })

  // Restore pins
  await db.pin.deleteMany({ where: { worldId: input.worldId } })
  for (const pin of snapshot.pins) {
    await db.pin.create({
      data: {
        ...pin,
        id: undefined, // Generate new IDs
        worldId: input.worldId,
      },
    })
  }

  await safeLogCollaborationEvent({
    worldId: input.worldId,
    eventType: CollaborationEventType.WORLD_VERSION_RESTORED,
    targetId: worldVersion.id,
    targetType: "version",
  })

  revalidatePath(`/world/${input.worldId}`)
  return { success: true }
}

// Pin versions
export async function createPinVersion(input: { pinId: string }) {
  const pin = await db.pin.findUnique({
    where: { id: input.pinId },
    include: { world: true },
  })

  if (!pin) throw new Error("Pin not found")

  await verifyWorldPermission(pin.worldId, await getAuthenticatedUserId(), "EDITOR")

  const latestVersion = await db.pinVersion.findFirst({
    where: { pinId: input.pinId },
    orderBy: { version: "desc" },
  })

  const version = (latestVersion?.version ?? 0) + 1

  const pinVersion = await db.pinVersion.create({
    data: {
      pinId: input.pinId,
      version,
      title: pin.title,
      description: pin.description,
      latitude: pin.latitude,
      longitude: pin.longitude,
      icon: pin.icon,
      color: pin.color,
      size: pin.size,
      opacity: pin.opacity,
      layerId: pin.layerId,
      properties: pin.properties,
      userId: await getAuthenticatedUserId(),
    },
  })

  return pinVersion
}

// Get diff between two versions
export async function getVersionDiff(input: {
  versionId1: string
  versionId2: string
  type: "world" | "pin" | "layer"
}) {
  // Implementation depends on type
  // Returns structured diff showing what changed
}
```

### Auto-Save Hook (`src/hooks/use-auto-save.ts`)

```typescript
"use client"

import { useEffect, useRef } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { createWorldVersion } from "@/actions/versions"

const AUTO_SAVE_INTERVAL = 5 * 60 * 1000 // 5 minutes

export function useAutoSave(worldId: string, hasUnsavedChanges: boolean) {
  const lastSaveRef = useRef(Date.now())
  const [isSaving, setIsSaving] = useState(false)

  const save = async () => {
    if (!hasUnsavedChanges) return

    setIsSaving(true)
    try {
      await createWorldVersion({
        worldId,
        name: `Auto-save ${new Date().toLocaleTimeString()}`,
      })
      lastSaveRef.current = Date.now()
    } finally {
      setIsSaving(false)
    }
  }

  const debouncedSave = useDebounce(save, 5000)

  useEffect(() => {
    if (hasUnsavedChanges) {
      debouncedSave()
    }
  }, [hasUnsavedChanges, debouncedSave])

  // Periodic save
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastSaveRef.current > AUTO_SAVE_INTERVAL) {
        save()
      }
    }, AUTO_SAVE_INTERVAL)

    return () => clearInterval(interval)
  }, [worldId, hasUnsavedChanges])

  return { isSaving, lastSave: lastSaveRef.current, save }
}
```

### Integration Points

1. **CollaborationEvent**: Add version events to enum
2. **Pin/Update Actions**: Hook to create versions before modifications
3. **Activity Feed**: Show version events
4. **Floating Panels**: Add version history module

---

## 3. Import from Tools Feature

### Overview
Import data from other worldbuilding tools (kanka.io, worldanvil.com, Notion, Obsidian, generic JSON/CSV).

### File Structure

```
src/
├── actions/
│   └── import.ts                      # Import Server Actions
├── components/
│   └── import/
│       ├── ui/
│       │   ├── import-dialog.tsx      # Main import dialog
│       │   ├── source-selector.tsx    # Choose source
│       │   ├── field-mapper.tsx       # Map fields to Genesis
│       │   ├── import-preview.tsx     # Preview before import
│       │   └── import-progress.tsx    # Progress indicator
│       ├── logic/
│       │   ├── use-import-wizard.ts   # Wizard state
│       │   └── use-import-executor.ts # Execute import
│       └── parsers/
│           ├── base-parser.ts         # Base parser interface
│           ├── kanka-parser.ts        # Kanka.io parser
│           ├── worldanvil-parser.ts   # WorldAnvil parser
│           ├── notion-parser.ts       # Notion parser
│           ├── obsidian-parser.ts     # Obsidian parser
│           ├── json-parser.ts         # Generic JSON parser
│           └── csv-parser.ts          # CSV parser
├── lib/
│   └── import-utils.ts                # Import utilities
└── types/
    └── import.types.ts                # Import types
```

### Parser Interface (`src/components/import/parsers/base-parser.ts`)

```typescript
export interface ImportResult {
  pins: PinImportData[]
  lore: LoreImportData[]
  characters: CharacterImportData[]
  layers: LayerImportData[]
  images: ImageImportData[]
  errors: ImportError[]
}

export interface PinImportData {
  title: string
  description?: string
  latitude: number
  longitude: number
  type: string
  icon?: string
  color?: string
  layer?: string
}

export interface LoreImportData {
  title: string
  content: string
  category?: string
  tags?: string[]
}

export interface ImportError {
  message: string
  source: string
  severity: "error" | "warning"
}

export interface ImportParser {
  name: string
  version: string

  // Detect if file/data is this format
  detect(data: unknown): boolean

  // Parse data into Genesis format
  parse(data: unknown): Promise<ImportResult>

  // Get field mappings for preview
  getFieldMappings(): Record<string, string>
}
```

### Example: Kanka Parser (`src/components/import/parsers/kanka-parser.ts`)

```typescript
import { ImportParser, ImportResult } from "./base-parser"

export class KankaParser implements ImportParser {
  name = "Kanka"
  version = "1.0"

  detect(data: unknown): boolean {
    const obj = data as any
    return (
      obj &&
      typeof obj === "object" &&
      ("entities" in obj || "characters" in obj || "locations" in obj)
    )
  }

  async parse(data: unknown): Promise<ImportResult> {
    const result: ImportResult = {
      pins: [],
      lore: [],
      characters: [],
      layers: [],
      images: [],
      errors: [],
    }

    const kankaData = data as any

    // Parse locations as pins
    if (kankaData.locations) {
      for (const location of kankaData.locations) {
        try {
          result.pins.push({
            title: location.name,
            description: location.entry?.summary || location.description,
            latitude: this.parseCoord(location.latitude),
            longitude: this.parseCoord(location.longitude),
            type: this.mapLocationType(location.type),
            color: location.colour,
          })
        } catch (e) {
          result.errors.push({
            message: `Failed to parse location: ${location.name}`,
            source: "kanka.locations",
            severity: "warning",
          })
        }
      }
    }

    // Parse characters
    if (kankaData.characters) {
      for (const character of kankaData.characters) {
        result.characters.push({
          name: character.name,
          description: character.entry?.summary || character.history,
          type: this.mapCharacterType(character.type),
        })
      }
    }

    return result
  }

  private parseCoord(value: any): number {
    if (typeof value === "number") return value
    if (typeof value === "string") {
      const parsed = parseFloat(value)
      if (!isNaN(parsed)) return parsed
    }
    return 0.5 // Default center
  }

  private mapLocationType(type: string): string {
    const typeMap: Record<string, string> = {
      city: "CITY",
      town: "VILLAGE",
      forest: "POI",
      mountain: "POI",
      dungeon: "DUNGEON",
    }
    return typeMap[type.toLowerCase()] || "CUSTOM"
  }

  private mapCharacterType(type: string): string {
    return type || "CUSTOM"
  }

  getFieldMappings(): Record<string, string> {
    return {
      "Location Name": "title",
      "Description": "description",
      "X Coordinate": "longitude",
      "Y Coordinate": "latitude",
      "Location Type": "type",
      "Colour": "color",
    }
  }
}
```

### Server Actions (`src/actions/import.ts`)

```typescript
"use server"

import { db } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/server-helpers"
import { verifyWorldPermission } from "@/lib/server-helpers"
import { revalidatePath } from "next/cache"
import { KankaParser } from "@/components/import/parsers/kanka-parser"
import { JSONParser } from "@/components/import/parsers/json-parser"
import { CSVParser } from "@/components/import/parsers/csv-parser"

const parsers = [new KankaParser(), new JSONParser(), new CSVParser()]

export async function detectImportFormat(data: unknown) {
  for (const parser of parsers) {
    if (parser.detect(data)) {
      return parser.name
    }
  }
  return null
}

export async function executeImport(input: {
  worldId: string
  data: unknown
  format: string
  fieldMappings?: Record<string, string>
  createLayers: boolean
  dryRun?: boolean
}) {
  const user = await getAuthenticatedUser()
  await verifyWorldPermission(input.worldId, user.id, "EDITOR")

  const parser = parsers.find((p) => p.name === input.format)
  if (!parser) throw new Error("Unsupported format")

  const result = await parser.parse(input.data)

  if (input.dryRun) {
    return result // Return preview without creating
  }

  // Create layers if needed
  const layerMap = new Map<string, string>()
  if (input.createLayers) {
    const uniqueLayers = [...new Set(result.pins.map((p) => p.layer).filter(Boolean))]
    for (const layerName of uniqueLayers) {
      const layer = await db.mapLayer.create({
        data: {
          worldId: input.worldId,
          name: layerName || "Imported",
          zIndex: await getNextZIndex(input.worldId),
        },
      })
      layerMap.set(layerName!, layer.id)
    }
  }

  // Create pins
  const createdPins = []
  for (const pinData of result.pins) {
    const pin = await db.pin.create({
      data: {
        worldId: input.worldId,
        title: pinData.title,
        description: pinData.description,
        latitude: pinData.latitude,
        longitude: pinData.longitude,
        type: pinData.type,
        icon: pinData.icon,
        color: pinData.color || "#3b82f6",
        size: 32,
        opacity: 1,
        layerId: pinData.layer ? layerMap.get(pinData.layer) : null,
      },
    })
    createdPins.push(pin)
  }

  // Create lore entries
  const createdLore = []
  for (const loreData of result.lore) {
    const lore = await db.loreEntry.create({
      data: {
        worldId: input.worldId,
        title: loreData.title,
        content: loreData.content,
        category: loreData.category || "GENERAL",
        tags: loreData.tags || [],
      },
    })
    createdLore.push(lore)
  }

  await safeLogCollaborationEvent({
    worldId: input.worldId,
    eventType: CollaborationEventType.IMPORT_COMPLETED,
    eventData: {
      format: input.format,
      pinsCount: createdPins.length,
      loreCount: createdLore.length,
      errors: result.errors.length,
    },
  })

  revalidatePath(`/world/${input.worldId}`)
  return {
    created: {
      pins: createdPins.length,
      lore: createdLore.length,
    },
    errors: result.errors,
  }
}
```

### Integration Points

1. **Export System**: Use existing export format for round-trip
2. **Layer System**: Create layers during import
3. **Activity Feed**: Log import completion
4. **World Editor**: Add import button to toolbar

---

## 4. Offline Mode Feature

### Overview
Enable offline functionality using service workers and IndexedDB for local storage and sync.

### File Structure

```
src/
├── app/
│   └── service-worker/
│       ├── register.tsx              # Service worker registration
│       └── service-worker.ts         # Service worker implementation
├── components/
│   └── offline/
│       ├── ui/
│       │   ├── offline-indicator.tsx # Offline status banner
│       │   ├── sync-progress.tsx     # Sync progress display
│       │   └── conflict-dialog.tsx   # Resolve sync conflicts
│       ├── logic/
│       │   ├── use-offline-status.ts # Detect online/offline
│       │   └── use-sync-queue.ts     # Manage offline actions
│       └── store/
│           └── offline-store.ts      # IndexedDB wrapper
├── lib/
│   ├── indexed-db.ts                 # IndexedDB utilities
│   └── sync-manager.ts               # Sync logic
└── hooks/
    └── use-offline-action.ts         # Offline-aware actions
```

### Service Worker (`public/service-worker.ts`)

```typescript
const CACHE_NAME = "genesis-v1"
const STATIC_CACHE = "genesis-static-v1"
const API_CACHE = "genesis-api-v1"

// Static assets to cache
const STATIC_ASSETS = [
  "/",
  "/worlds",
  "/offline",
  "/manifest.json",
  // Core JS and CSS will be precached by workbox
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  )
})

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== API_CACHE)
          .map((name) => caches.delete(name))
      )
    })
  )
})

// Fetch event - network first for API, cache first for static
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // API requests - network first, cache fallback
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/world/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.ok) {
            const clone = response.clone()
            caches.open(API_CACHE).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
        .catch(() => {
          // Offline - return cached or offline response
          return caches.match(event.request).then((cached) => {
            return cached || new Response(JSON.stringify({ offline: true }), {
              headers: { "Content-Type": "application/json" },
            })
          })
        })
    )
  } else {
    // Static assets - cache first, network fallback
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request).then((response) => {
            const clone = response.clone()
            caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, clone))
            return response
          })
        )
      })
    )
  }
})

// Background sync
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-offline-actions") {
    event.waitUntil(syncOfflineActions())
  }
})

async function syncOfflineActions() {
  // Called when connection is restored
  // Reads from IndexedDB and sends to server
}
```

### IndexedDB Store (`src/lib/indexed-db.ts`)

```typescript
import { openDB, DBSchema, IDBPDatabase } from "idb"

interface OfflineDB extends DBSchema {
  actions: {
    key: string
    value: {
      id: string
      action: string
      data: unknown
      timestamp: number
      worldId: string
    }
    indexes: { "by-world": string; "by-timestamp": number }
  }
  worlds: {
    key: string
    value: {
      id: string
      data: unknown
      timestamp: number
    }
  }
  pins: {
    key: string
    value: {
      id: string
      worldId: string
      data: unknown
      timestamp: number
      pendingSync: boolean
    }
    indexes: { "by-world": string }
  }
}

let db: IDBPDatabase<OfflineDB> | null = null

export async function getDB() {
  if (!db) {
    db = await openDB<OfflineDB>("genesis-offline", 1, {
      upgrade(db) {
        const actionStore = db.createObjectStore("actions", { keyPath: "id" })
        actionStore.createIndex("by-world", "worldId")
        actionStore.createIndex("by-timestamp", "timestamp")

        db.createObjectStore("worlds", { keyPath: "id" })

        const pinStore = db.createObjectStore("pins", { keyPath: "id" })
        pinStore.createIndex("by-world", "worldId")
      },
    })
  }
  return db
}

export async function queueOfflineAction(action: {
  action: string
  data: unknown
  worldId: string
}) {
  const db = await getDB()
  await db.add("actions", {
    id: crypto.randomUUID(),
    ...action,
    timestamp: Date.now(),
  })
}

export async function getPendingActions(worldId?: string) {
  const db = await getDB()
  if (worldId) {
    return await db.getAllFromIndex("actions", "by-world", worldId)
  }
  return await db.getAll("actions")
}

export async function removeAction(id: string) {
  const db = await getDB()
  await db.delete("actions", id)
}

export async function cacheWorld(worldId: string, data: unknown) {
  const db = await getDB()
  await db.put("worlds", {
    id: worldId,
    data,
    timestamp: Date.now(),
  })
}

export async function getCachedWorld(worldId: string) {
  const db = await getDB()
  return await db.get("worlds", worldId)
}

export async function cachePin(pin: any) {
  const db = await getDB()
  await db.put("pins", {
    id: pin.id,
    worldId: pin.worldId,
    data: pin,
    timestamp: Date.now(),
    pendingSync: true,
  })
}
```

### Offline Action Hook (`src/hooks/use-offline-action.ts`)

```typescript
"use client"

import { useState } from "react"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { queueOfflineAction, getPendingActions, removeAction } from "@/lib/indexed-db"

export function useOfflineAction() {
  const isOnline = useOnlineStatus()
  const [pendingCount, setPendingCount] = useState(0)

  const executeAction = async <T,>(
    action: () => Promise<T>,
    offlineData: { action: string; worldId: string; data: unknown }
  ): Promise<T> => {
    if (isOnline) {
      return await action()
    } else {
      // Queue for later
      await queueOfflineAction(offlineData)
      setPendingCount((c) => c + 1)
      throw new Error("Offline - action queued")
    }
  }

  const syncPending = async (worldId?: string) => {
    if (!isOnline) return

    const pending = await getPendingActions(worldId)
    for (const item of pending) {
      try {
        // Re-execute the action
        await fetch("/api/sync", {
          method: "POST",
          body: JSON.stringify(item),
        })
        await removeAction(item.id)
        setPendingCount((c) => c - 1)
      } catch (e) {
        console.error("Sync failed for item:", item.id, e)
      }
    }
  }

  return {
    isOnline,
    pendingCount,
    executeAction,
    syncPending,
  }
}
```

### Offline Indicator (`src/components/offline/ui/offline-indicator.tsx`)

```tsx
"use client"

import { useOnlineStatus } from "@/hooks/use-online-status"
import { WifiOff, Cloud } from "lucide-react"
import { useOfflineAction } from "@/hooks/use-offline-action"

export function OfflineIndicator() {
  const isOnline = useOnlineStatus()
  const { pendingCount } = useOfflineAction()

  if (isOnline && pendingCount === 0) return null

  return (
    <div className={`
      fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-sm shadow-xl
      ${isOnline ? "bg-green-900" : "bg-amber-900"}
      text-white
    `}>
      {isOnline ? (
        <>
          <Cloud size={16} />
          <span>Syncing {pendingCount} changes...</span>
        </>
      ) : (
        <>
          <WifiOff size={16} />
          <span>Offline - {pendingCount} changes pending</span>
        </>
      )}
    </div>
  )
}
```

### Integration Points

1. **Service Worker Registration**: In root layout
2. **Server Actions**: Wrap with offline-aware hook
3. **TanStack Query**: Configure for offline support
4. **Zustand Stores**: Persist to IndexedDB

---

## 5. Map Providers Feature

### Overview
Integrate third-party map tile providers beyond uploaded images.

### Database Schema

```prisma
// Add to prisma/schema.prisma

enum MapProviderType {
  UPLOADED   // User uploaded image
  OPENSTREETMAP
  MAPBOX
  STAMEN
  CARTO
  CUSTOM     // Custom tile server
}

model MapProviderConfig {
  id          String   @id @default(cuid())
  worldId     String
  world       GameWorld @relation(fields: [worldId], references: [id], onDelete: Cascade)

  type        MapProviderType
  name        String

  // Provider-specific config
  tileUrl     String?  // URL template for tiles: {x}, {y}, {z}
  apiKey      String?  // Stored encrypted
  attribution String?
  minZoom     Int      @default(0)
  maxZoom     Int      @default(18)

  // Styling
  opacity     Float    @default(1)

  // User preferences (per-user API keys for public providers)
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])

  isDefault   Boolean  @default(false)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([worldId])
  @@index([userId])
}

// Update GameWorld
model GameWorld {
  // ... existing fields
  providerConfigs MapProviderConfig[]
  defaultProvider MapProviderConfig?
}
```

### File Structure

```
src/
├── actions/
│   └── map-providers.ts               # Provider Server Actions
├── components/
│   └── map-providers/
│       ├── ui/
│       │   ├── provider-selector.tsx  # Choose provider
│       │   ├── provider-config.tsx    # Configure provider
│       │   ├── custom-tile-form.tsx   # Custom tile server
│       │   └── layer-controls.tsx     # Provider layer controls
│       ├── logic/
│       │   ├── use-map-provider.ts    # Provider state
│       │   └── use-tile-layer.ts      # Tile rendering
│       └── providers/
│           ├── base-provider.ts       # Provider interface
│           ├── openstreetmap.ts       # OSM implementation
│           ├── mapbox.ts              # Mapbox implementation
│           ├── stamen.ts              # Stamen implementation
│           └── custom.ts              # Custom tile server
└── lib/
    └── maplibre-providers.ts          # MapLibre integration
```

### Provider Interface (`src/components/map-providers/providers/base-provider.ts`)

```typescript
export interface MapProvider {
  id: string
  name: string
  type: string
  minZoom: number
  maxZoom: number
  attribution: string

  // Get tile URL for given coordinates
  getTileUrl(x: number, y: number, z: number): string

  // Get MapLibre style specification
  getMapLibreConfig(apiKey?: string): object

  // Validate API key if needed
  validateApiKey?(apiKey: string): Promise<boolean>

  // Configuration form fields
  getConfigFields(): ConfigField[]
}

export interface ConfigField {
  name: string
  label: string
  type: "text" | "password" | "number" | "select"
  required: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
}
```

### OpenStreetMap Provider (`src/components/map-providers/providers/openstreetmap.ts`)

```typescript
import { MapProvider } from "./base-provider"

export const OpenStreetMapProvider: MapProvider = {
  id: "osm",
  name: "OpenStreetMap",
  type: "OPENSTREETMAP",
  minZoom: 0,
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",

  getTileUrl(x: number, y: number, z: number) {
    return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`
  },

  getMapLibreConfig() {
    return {
      version: 8,
      sources: {
        "osm-tiles": {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: this.attribution,
        },
      },
      layers: [
        {
          id: "osm-layer",
          type: "raster",
          source: "osm-tiles",
        },
      ],
    }
  },

  getConfigFields() {
    return [] // No configuration needed
  },
}
```

### Mapbox Provider (`src/components/map-providers/providers/mapbox.ts`)

```typescript
import { MapProvider } from "./base-provider"

export const MapboxProvider: MapProvider = {
  id: "mapbox",
  name: "Mapbox",
  type: "MAPBOX",
  minZoom: 0,
  maxZoom: 22,
  attribution: "&copy; Mapbox",

  getTileUrl(x: number, y: number, z: number, style = "streets-v12") {
    // Mapbox uses their own SDK, but for tiles:
    return `https://api.mapbox.com/styles/v1/mapbox/${style}/tiles/${z}/${x}/${y}?access_token={apiKey}`
  },

  getMapLibreConfig(apiKey?: string) {
    if (!apiKey) throw new Error("Mapbox API key required")

    return {
      version: 8,
      sources: {
        "mapbox-tiles": {
          type: "raster",
          tiles: [
            `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}?access_token=${apiKey}`,
          ],
          tileSize: 256,
          attribution: this.attribution,
        },
      },
      layers: [
        {
          id: "mapbox-layer",
          type: "raster",
          source: "mapbox-tiles",
        },
      ],
    }
  },

  async validateApiKey(apiKey: string) {
    try {
      const response = await fetch(
        `https://api.mapbox.com/tiles/v1?access_token=${apiKey}`
      )
      return response.ok
    } catch {
      return false
    }
  },

  getConfigFields() {
    return [
      {
        name: "apiKey",
        label: "API Key",
        type: "password",
        required: true,
        placeholder: "pk.xxx...",
      },
      {
        name: "style",
        label: "Map Style",
        type: "select",
        required: false,
        options: [
          { value: "streets-v12", label: "Streets" },
          { value: "outdoors-v12", label: "Outdoors" },
          { value: "satellite-v9", label: "Satellite" },
        ],
      },
    ]
  },
}
```

### Server Actions (`src/actions/map-providers.ts`)

```typescript
"use server"

import { db } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/server-helpers"
import { verifyWorldPermission } from "@/lib/server-helpers"

export async function setMapProvider(input: {
  worldId: string
  providerId: string
}) {
  const user = await getAuthenticatedUser()
  await verifyWorldPermission(input.worldId, user.id, "OWNER")

  // Set as default provider for world
  await db.mapProviderConfig.updateMany({
    where: { worldId: input.worldId, isDefault: true },
    data: { isDefault: false },
  })

  await db.mapProviderConfig.update({
    where: { id: input.providerId, worldId: input.worldId },
    data: { isDefault: true },
  })

  revalidatePath(`/world/${input.worldId}`)
}

export async function createCustomProvider(input: {
  worldId: string
  name: string
  tileUrl: string
  minZoom?: number
  maxZoom?: number
  attribution?: string
}) {
  const user = await getAuthenticatedUser()
  await verifyWorldPermission(input.worldId, user.id, "OWNER")

  return await db.mapProviderConfig.create({
    data: {
      worldId: input.worldId,
      type: "CUSTOM",
      name: input.name,
      tileUrl: input.tileUrl,
      minZoom: input.minZoom ?? 0,
      maxZoom: input.maxZoom ?? 18,
      attribution: input.attribution,
    },
  })
}

export async function getWorldProviders(worldId: string) {
  await verifyWorldPermission(worldId, await getAuthenticatedUserId(), "READER")

  return await db.mapProviderConfig.findMany({
    where: { worldId },
    orderBy: { isDefault: "desc" },
  })
}
```

### Integration Points

1. **MapLibre Initialization**: Use provider config
2. **Layer System**: Add as base layer
3. **World Editor**: Provider selector in settings
4. **Export/Import**: Include provider config

---

## 6. Mobile App (PWA Enhancements) Feature

### Overview
Enhance mobile experience with responsive design, touch gestures, and PWA improvements.

### File Structure

```
src/
├── app/
│   ├── layout.tsx                      # Add viewport meta tag
│   └── service-worker/
│       └── register.tsx                # SW registration
├── components/
│   └── mobile/
│       ├── ui/
│       │   ├── bottom-navigation.tsx   # Mobile nav
│       │   ├── drawer-menu.tsx         # Collapsible sidebar
│       │   ├── bottom-sheet.tsx        # Properties panel
│       │   └── touch-controls.tsx      # Touch-friendly controls
│       ├── logic/
│       │   ├── use-mobile-detect.ts    # Device detection
│       │   ├── use-touch-gestures.ts   # Gesture handling
│       │   └── use-responsive-layout.ts # Layout state
│       └── gestures/
│           ├── pinch-zoom.ts           # Pinch to zoom
│           ├── two-finger-pan.ts       # Two finger pan
│           └── long-press.ts           # Long press handler
├── lib/
│   └── mobile-utils.ts                 # Mobile utilities
└── styles/
    └── mobile.css                      # Mobile-specific styles
```

### Viewport Configuration (`src/app/layout.tsx`)

```tsx
export const metadata = {
  title: "Genesis",
  description: "Interactive fantasy world map",
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
  themeColor: "#d4af37",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Genesis",
  },
}
```

### Mobile Detection Hook (`src/components/mobile/logic/use-mobile-detect.ts`)

```typescript
"use client"

import { useEffect, useState } from "react"

export function useMobileDetect() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [screenSize, setScreenSize] = useState<"sm" | "md" | "lg">("lg")

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTouch("ontouchstart" in window)
      setScreenSize(
        window.innerWidth < 640 ? "sm" : window.innerWidth < 1024 ? "md" : "lg"
      )
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return { isMobile, isTouch, screenSize }
}
```

### Touch Gestures Hook (`src/components/mobile/logic/use-touch-gestures.ts`)

```typescript
"use client"

import { useRef, useEffect } from "react"

export interface TouchHandlers {
  onPinch?: (scale: number, center: { x: number; y: number }) => void
  onTwoFingerPan?: (deltaX: number, deltaY: number) => void
  onLongPress?: (position: { x: number; y: number }) => void
  onDoubleTap?: (position: { x: number; y: number }) => void
}

export function useTouchGestures(
  targetRef: RefObject<HTMLElement>,
  handlers: TouchHandlers
) {
  const touchesRef = useRef<TouchList | null>(null)
  const lastDistanceRef = useRef(0)
  const lastCenterRef = useRef({ x: 0, y: 0 })
  const longPressTimerRef = useRef<NodeJS.Timeout>()
  const tapCountRef = useRef(0)
  const lastTapTimeRef = useRef(0)

  useEffect(() => {
    const element = targetRef.current
    if (!element) return

    const handleTouchStart = (e: TouchEvent) => {
      touchesRef.current = e.touches

      if (e.touches.length === 1) {
        // Potential long press
        longPressTimerRef.current = setTimeout(() => {
          handlers.onLongPress?.({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          })
        }, 500)
      } else if (e.touches.length === 2) {
        // Clear long press on multi-touch
        clearTimeout(longPressTimerRef.current)

        // Calculate pinch center and distance
        const dx = e.touches[1].clientX - e.touches[0].clientX
        const dy = e.touches[1].clientY - e.touches[0].clientY
        lastDistanceRef.current = Math.sqrt(dx * dx + dy * dy)
        lastCenterRef.current = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchesRef.current?.length === 2) {
        // Pinch zoom
        const dx = e.touches[1].clientX - e.touches[0].clientX
        const dy = e.touches[1].clientY - e.touches[0].clientY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (lastDistanceRef.current > 0) {
          const scale = distance / lastDistanceRef.current
          const center = {
            x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
            y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
          }
          handlers.onPinch?.(scale, center)
        }

        lastDistanceRef.current = distance
      } else if (e.touches.length === 1 && touchesRef.current?.length === 2) {
        // Two-finger pan (one finger lifted)
        const deltaX = e.touches[0].clientX - touchesRef.current[0].clientX
        const deltaY = e.touches[0].clientY - touchesRef.current[0].clientY
        handlers.onTwoFingerPan?.(deltaX, deltaY)
      }

      // Clear long press on movement
      clearTimeout(longPressTimerRef.current)
      touchesRef.current = e.touches
    }

    const handleTouchEnd = (e: TouchEvent) => {
      clearTimeout(longPressTimerRef.current)

      if (e.touches.length === 0) {
        // Check for double tap
        const now = Date.now()
        if (now - lastTapTimeRef.current < 300) {
          tapCountRef.current++
          if (tapCountRef.current === 2) {
            handlers.onDoubleTap?.({
              x: e.changedTouches[0].clientX,
              y: e.changedTouches[0].clientY,
            })
            tapCountRef.current = 0
          }
        } else {
          tapCountRef.current = 1
        }
        lastTapTimeRef.current = now
      }

      touchesRef.current = e.touches
    }

    element.addEventListener("touchstart", handleTouchStart)
    element.addEventListener("touchmove", handleTouchMove)
    element.addEventListener("touchend", handleTouchEnd)

    return () => {
      element.removeEventListener("touchstart", handleTouchStart)
      element.removeEventListener("touchmove", handleTouchMove)
      element.removeEventListener("touchend", handleTouchEnd)
      clearTimeout(longPressTimerRef.current)
    }
  }, [handlers])
}
```

### Bottom Navigation (`src/components/mobile/ui/bottom-navigation.tsx`)

```tsx
"use client"

import { useMobileDetect } from "../logic/use-mobile-detect"
import { Layers, Pins, Search, Menu } from "lucide-react"

export function BottomNavigation() {
  const { isMobile } = useMobileDetect()

  if (!isMobile) return null

  return (
    <nav className="
      fixed bottom-0 left-0 right-0 z-50
      bg-slate-900/95 backdrop-blur-sm
      border-t border-border-subtle
      safe-area-inset-bottom
    ">
      <div className="flex justify-around items-center h-16">
        <NavItem icon={<Layers size={24} />} label="Layers" href="#" />
        <NavItem icon={<Pins size={24} />} label="Pins" href="#" />
        <NavItem icon={<Search size={24} />} label="Search" href="#" />
        <NavItem icon={<Menu size={24} />} label="Menu" href="#" />
      </div>
    </nav>
  )
}

function NavItem({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <a
      href={href}
      className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-accent-gold active:text-accent-gold"
    >
      {icon}
      <span className="text-xs">{label}</span>
    </a>
  )
}
```

### Bottom Sheet (`src/components/mobile/ui/bottom-sheet.tsx`)

```tsx
"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  snapPoints?: number[] // Percentage heights, e.g., [25, 50, 90]
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  snapPoints = [25, 50, 90],
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef(0)

  useEffect(() => {
    if (!isOpen) return

    const sheet = sheetRef.current
    if (!sheet) return

    let startY = 0
    let currentSnap = 1 // Middle snap point by default

    const handleDragStart = (e: TouchEvent | MouseEvent) => {
      startY = "touches" in e ? e.touches[0].clientY : e.clientY
      sheet.style.transition = "none"
    }

    const handleDragMove = (e: TouchEvent | MouseEvent) => {
      const currentY = "touches" in e ? e.touches[0].clientY : e.clientY
      const delta = currentY - startY
      dragRef.current = delta

      sheet.style.transform = `translateY(${delta}px)`
    }

    const handleDragEnd = () => {
      sheet.style.transition = "transform 0.3s ease-out"

      // Determine snap point
      const threshold = 50
      const sheetHeight = sheet.offsetHeight
      const currentIndex = snapPoints.indexOf(currentSnap)

      if (dragRef.current < -threshold) {
        // Swipe up - snap to next
        currentSnap = snapPoints[Math.min(currentIndex + 1, snapPoints.length - 1)]
      } else if (dragRef.current > threshold) {
        // Swipe down - snap to previous
        const newIndex = currentIndex - 1
        if (newIndex < 0) {
          onClose() // Close sheet
          return
        }
        currentSnap = snapPoints[newIndex]
      }

      sheet.style.transform = `translateY(${100 - currentSnap}%)`
      dragRef.current = 0
    }

    // Initialize at middle snap point
    sheet.style.transform = `translateY(${100 - snapPoints[1]}%)`

    sheet.addEventListener("touchstart", handleDragStart)
    sheet.addEventListener("touchmove", handleDragMove)
    sheet.addEventListener("touchend", handleDragEnd)

    return () => {
      sheet.removeEventListener("touchstart", handleDragStart)
      sheet.removeEventListener("touchmove", handleDragMove)
      sheet.removeEventListener("touchend", handleDragEnd)
    }
  }, [isOpen, snapPoints])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-lg shadow-xl max-h-[90vh]"
      >
        <div className="flex justify-between items-center p-4 border-b border-border-subtle">
          <h2 className="text-lg font-semibold">Properties</h2>
          <button onClick={onClose} className="p-2">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-auto max-h-[calc(90vh-60px)]">
          {children}
        </div>
      </div>
    </div>
  )
}
```

### Integration Points

1. **Input Manager**: Extend for touch gesture support
2. **Map Canvas**: Add pinch-to-zoom, two-finger pan
3. **Responsive Layout**: Mobile-first CSS breakpoints
4. **Service Worker**: Enable offline functionality

---

## Summary & Implementation Order

### Phase 1: Foundation (Week 1-2)
1. **Comments/Annotations** - Medium effort
   - Build on existing collaboration system
   - Add MapComment model
   - Create UI components
   - Integrate with activity feed

### Phase 2: Version Control (Week 3-4)
2. **Version History** - Large effort
   - Add version tables
   - Implement auto-save
   - Create timeline UI
   - Add diff viewer

### Phase 3: Data Portability (Week 5)
3. **Import from Tools** - Medium effort
   - Create parser system
   - Implement kanka/worldanvil parsers
   - Build import wizard UI
   - Add preview and validation

### Phase 4: Offline & PWA (Week 6-7)
4. **Offline Mode** - Large effort
   - Implement service worker
   - Create IndexedDB store
   - Build sync queue
   - Add offline UI indicators

### Phase 5: Map Enhancements (Week 8)
5. **Map Providers** - Medium effort
   - Add provider system
   - Implement OSM, Mapbox providers
   - Create provider config UI
   - Integrate with MapLibre

### Phase 6: Mobile Experience (Week 9-10)
6. **Mobile App (PWA)** - Very Large effort
   - Responsive design improvements
   - Touch gesture support
   - Mobile-specific UI components
   - PWA enhancements

---

## Notes

- **Estimated Total Timeline**: 10 weeks
- **Team Size**: 1-2 developers
- **Dependencies**: Each phase builds on previous work
- **Testing**: Comprehensive testing required for each feature
- **Documentation**: Update PROGRESS.md after each feature completion
