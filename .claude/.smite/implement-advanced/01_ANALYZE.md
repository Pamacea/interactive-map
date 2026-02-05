# 01_ANALYZE - Advanced Features Implementation

## Current State Assessment

### Comments/Annotations System: ALREADY IMPLEMENTED
- Status: Complete
- Database: `MapComment` model exists
- Actions: `src/actions/comments.ts` - full CRUD
- UI: `src/components/comments/ui/` - all components
- Store: `src/store/use-comments-store.ts`
- Integration: Already in world-client.tsx
- **Action Required: None - Mark as complete in PROGRESS.md**

### Version History: NEEDS IMPLEMENTATION
- Existing infrastructure:
  - `CollaborationEvent` model provides audit trail
  - `createdAt`/`updatedAt` timestamps on all models
  - Export system with version field
- Missing:
  - `MapVersion` model for snapshots
  - Version CRUD actions
  - UI for creating/restoring versions
  - Changelog management

### Map Providers: NEEDS IMPLEMENTATION
- Current: Image-based custom map system
- Existing: MapLibre GL dependency installed but unused
- Missing:
  - `MapProvider` model for provider configuration
  - Tile provider integration
  - UI for provider selection
  - Integration with custom map system

### Import from Tools: NEEDS IMPLEMENTATION
- Current: Export only (JSON format)
- Existing: `src/actions/export.ts` patterns
- Missing:
  - `ImportJob` model for job tracking
  - Import actions (reverse of export)
  - UI for import workflow
  - Format converters (GeoJSON, etc.)

## Existing Patterns to Follow

### Architecture
```
components/[feature]/
├── ui/           # Presentational components
├── logic/        # Custom hooks
└── methods/      # (if needed)
```

### State Management
- Server State: TanStack Query (`useQuery`, `useMutation`)
- Client State: Zustand stores in `src/stores/`
- Form State: React Hook Form + Zod

### Server Actions Pattern
```typescript
export async function actionName(data: InputType) {
  return safeAsync(async () => {
    const validated = Schema.parse(data);
    const user = await getAuthenticatedUser();
    // ...business logic
    await safeLogCollaborationEvent({...});
  }, "actionName");
}
```

## Implementation Priority

1. **Version History** (Medium effort) - Builds on existing CollaborationEvent
2. **Import from Tools** (Medium effort) - Extends existing export patterns
3. **Map Providers** (Medium effort) - Integration with custom system

## Database Models to Add

```prisma
// Version History
model MapVersion {
  id        String   @id @default(cuid())
  worldId   String
  world     GameWorld @relation("WorldVersions", fields: [worldId], references: [id], onDelete: Cascade)
  version   Int      // Auto-incrementing version number
  title     String   // "v1.0", "Initial Draft", etc.
  snapshot  Json     // Complete world state
  changelog String?  @db.Text
  isAuto    Boolean  @default(false) // Auto-saved vs manual
  createdAt DateTime @default(now())
  createdBy String
  user      User     @relation("UserVersions", fields: [createdBy], references: [id], onDelete: Cascade)

  @@index([worldId])
  @@index([createdAt(sort=Desc)])
}

// Import Jobs
model ImportJob {
  id         String       @id @default(cuid())
  worldId    String
  world      GameWorld    @relation(fields: [worldId], references: [id], onDelete: Cascade)
  sourceType String       // "JSON", "GEOJSON", "IMAGE", "URL"
  status     ImportStatus @default(PENDING)
  rawData    Json         // Original imported data
  processed  Json?        // Processed data
  error      String?      @db.Text
  progress   Int          @default(0)
  createdBy  String
  user       User         @relation(fields: [createdBy], references: [id])
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt

  @@index([worldId])
  @@index([status])
}

enum ImportStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

## Files to Create/Modify

### Version History
- `prisma/schema.prisma` - Add MapVersion model
- `src/actions/versions.ts` - NEW: Version CRUD
- `src/hooks/use-versions.ts` - NEW: TanStack Query hooks
- `src/stores/use-versions-store.ts` - NEW: UI state
- `src/components/versions/ui/` - NEW: Version UI components
- `src/components/world/ui/floating/versions-module.tsx` - NEW

### Import from Tools
- `prisma/schema.prisma` - Add ImportJob model
- `src/actions/import.ts` - NEW: Import actions
- `src/hooks/use-import.ts` - NEW: Import hooks
- `src/components/import/ui/` - NEW: Import UI
- Update `src/actions/export.ts` - Ensure compatibility

### Map Providers (Deferred - Lower Priority)
- Would require significant map renderer changes
- Consider Phase 2

## Key Integration Points

1. **Floating Panel System** - Add new modules to dock
2. **Collaboration Events** - Log all version/import actions
3. **Export System** - Ensure round-trip compatibility
4. **World Settings** - Add configuration options

## Success Criteria

1. Version History:
   - Create manual versions
   - View version list with changelog
   - Restore world to previous version
   - Auto-save versions before major changes

2. Import from Tools:
   - Import JSON exports (round-trip)
   - Import images as new layers
   - Import GeoJSON as pins
   - Progress tracking for large imports

3. Comments:
   - Mark as complete in PROGRESS.md
