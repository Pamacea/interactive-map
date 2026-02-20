# API Documentation - Genesis Interactive Map

> **Last Updated:** 2025-02-20
> **Version:** 1.1.4
> **Base URL:** `http://localhost:3000`

---

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Server Actions](#server-actions)
  - [Worlds](#worlds)
  - [Pins](#pins)
  - [Characters](#characters)
  - [Lore](#lore)
  - [Gallery](#gallery)
  - [Import/Export](#importexport)
- [API Routes](#api-routes)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Overview

Genesis Interactive Map API provides Server Actions for managing interactive fantasy world maps, including pins, lore entries, characters, and more.

**Base URL:** `http://localhost:3000`
**Content-Type:** `application/json`
**Authentication:** Required for all endpoints

---

## Authentication

All API requests require authentication via NextAuth session.

```typescript
// Session is automatically included with Server Actions
const session = await auth();
const userId = session?.user?.id;
```

### Permission Levels

- **READER** - Read-only access
- **EDITOR** - Can edit content
- **ADMIN** - Full control including user management

---

## Server Actions

### Worlds

#### `createWorld`

Create a new interactive world.

```typescript
/**
 * Create a new game world
 *
 * @param data - World creation data
 * @param data.title - World title (required)
 * @param data.description - World description
 * @param data.isPublic - Whether world is publicly visible
 * @returns Created world object
 *
 * @throws {Error} If user is not authenticated
 * @throws {Error} If title is empty
 */
createWorld(data: {
  title: string;
  description?: string;
  isPublic?: boolean;
}): Promise<World>
```

**Example:**
```typescript
const world = await createWorld({
  title: "Middle Earth",
  description: "A fantasy world for my campaign",
  isPublic: false
});
```

#### `getMyWorlds`

Get all worlds for the current user.

```typescript
/**
 * Get user's worlds
 *
 * @returns Array of user's worlds
 */
getMyWorlds(): Promise<World[]>
```

#### `getWorldById`

Get a single world by ID with all relations.

```typescript
/**
 * Get world by ID with full data
 *
 * @param params - Query parameters
 * @param params.worldId - World ID
 * @returns World object with pins, layers, members
 *
 * @throws {Error} If world not found
 * @throws {Error} If user lacks READ permission
 */
getWorldById(params: {
  worldId: string;
}): Promise<WorldWithRelations>
```

#### `updateWorldTitle`

Update world title.

```typescript
/**
 * Update world title
 *
 * @param params - Update parameters
 * @param params.worldId - World ID
 * @param params.title - New title
 * @returns Updated world
 */
updateWorldTitle(params: {
  worldId: string;
  title: string;
}): Promise<World>
```

#### `deleteWorld`

Delete a world and all its content.

```typescript
/**
 * Delete a world
 *
 * @param params - Delete parameters
 * @param params.worldId - World ID
 * @returns Deleted world
 *
 * @throws {Error} If user is not world owner
 * @throws {Error} If world has dependent data
 */
deleteWorld(params: {
  worldId: string;
}): Promise<World>
```

---

### Pins

#### `createPin`

Create a new pin on the map.

```typescript
/**
 * Create a new map pin
 *
 * @param data - Pin creation data
 * @param data.worldId - World ID (required)
 * @param data.title - Pin title (required)
 * @param data.description - Pin description
 * @param data.latitude - Latitude (-90 to 90, required)
 * @param data.longitude - Longitude (-180 to 180, required)
 * @param data.pinType - Pin type (CITY, TOWN, CUSTOM, etc.)
 * @param data.icon - Icon emoji or URL
 * @param data.color - Color hex code
 * @param data.size - Size in pixels (16-64)
 * @param data.opacity - Opacity (0-1)
 * @param data.isVisible - Whether pin is visible
 * @param data.minZoom - Minimum zoom level
 * @param data.maxZoom - Maximum zoom level
 * @returns Created pin
 *
 * @throws {Error} If coordinates are invalid
 * @throws {Error} If user lacks EDIT permission
 */
createPin(data: {
  worldId: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  pinType?: PinType;
  icon?: string;
  color?: string;
  size?: number;
  opacity?: number;
  isVisible?: boolean;
  minZoom?: number;
  maxZoom?: number;
}): Promise<Pin>
```

**Pin Types:** `CITY`, `TOWN`, `CASTLE`, `DUNGEON`, `FOREST`, `MOUNTAIN`, `RIVER`, `LAKE`, `CUSTOM`

**Example:**
```typescript
const pin = await createPin({
  worldId: "world-1",
  title: "Minas Tirith",
  description: "The White City",
  latitude: 45.5,
  longitude: -73.5,
  pinType: "CITY",
  icon: "🏰",
  color: "#e74c3c",
  size: 32
});
```

#### `updatePin`

Update an existing pin.

```typescript
/**
 * Update pin properties
 *
 * @param data - Update data
 * @param data.pinId - Pin ID
 * @param data.title - New title
 * @param data.description - New description
 * @param data.latitude - New latitude
 * @param data.longitude - New longitude
 * @param data.icon - New icon
 * @param data.color - New color
 * @returns Updated pin
 */
updatePin(data: {
  pinId: string;
  title?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  icon?: string;
  color?: string;
}): Promise<Pin>
```

#### `deletePin`

Delete a pin.

```typescript
/**
 * Delete a pin
 *
 * @param params - Delete parameters
 * @param params.pinId - Pin ID
 * @returns Deleted pin
 */
deletePin(params: {
  pinId: string;
}): Promise<Pin>
```

#### `getPinsByWorld`

Get all pins for a world.

```typescript
/**
 * Get pins by world with filtering
 *
 * @param params - Query parameters
 * @param params.worldId - World ID
 * @param params.pinType - Filter by pin type (optional)
 * @param params.isVisible - Filter by visibility (optional)
 * @returns Array of pins
 */
getPinsByWorld(params: {
  worldId: string;
  pinType?: PinType;
  isVisible?: boolean;
}): Promise<Pin[]>
```

---

### Characters

#### `createCharacter`

Create a new character.

```typescript
/**
 * Create a new character
 *
 * @param data - Character data
 * @param data.worldId - World ID
 * @param data.name - Character name
 * @param data.description - Character description
 * @param data.imageUrl - Portrait URL
 * @param data.race - Character race
 * @param data.class - Character class
 * @returns Created character
 */
createCharacter(data: {
  worldId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  race?: string;
  class?: string;
}): Promise<Character>
```

#### `updateCharacter`

Update character information.

```typescript
/**
 * Update character
 *
 * @param data - Update data
 * @param data.characterId - Character ID
 * @param data.name - New name
 * @param data.description - New description
 * @param data.imageUrl - New portrait
 * @returns Updated character
 */
updateCharacter(data: {
  characterId: string;
  name?: string;
  description?: string;
  imageUrl?: string;
}): Promise<Character>
```

#### `deleteCharacter`

Delete a character.

```typescript
/**
 * Delete a character
 *
 * @param params - Delete parameters
 * @param params.characterId - Character ID
 * @returns Deleted character
 */
deleteCharacter(params: {
  characterId: string;
}): Promise<Character>
```

#### `linkCharacterToPin`

Link a character to a pin.

```typescript
/**
 * Link character to a map pin
 *
 * @param data - Link data
 * @param data.characterId - Character ID
 * @param data.pinId - Pin ID
 * @returns Created link
 */
linkCharacterToPin(data: {
  characterId: string;
  pinId: string;
}): Promise<CharacterPinLink>
```

---

### Lore

#### `createLoreEntry`

Create a new lore entry.

```typescript
/**
 * Create a lore entry
 *
 * @param data - Lore data
 * @param data.worldId - World ID
 * @param data.title - Entry title
 * @param data.slug - URL slug
 * @param data.content - Markdown content
 * @param data.category - Category
 * @returns Created lore entry
 */
createLoreEntry(data: {
  worldId: string;
  title: string;
  slug: string;
  content: string;
  category?: string;
}): Promise<LoreEntry>
```

#### `updateLoreEntry`

Update lore entry.

```typescript
/**
 * Update lore entry
 *
 * @param data - Update data
 * @param data.entryId - Entry ID
 * @param data.title - New title
 * @param data.content - New content
 * @param data.category - New category
 * @returns Updated lore entry
 */
updateLoreEntry(data: {
  entryId: string;
  title?: string;
  content?: string;
  category?: string;
}): Promise<LoreEntry>
```

---

### Import/Export

#### `createImportJob`

Create a data import job.

```typescript
/**
 * Create import job
 *
 * @param data - Import data
 * @param data.worldId - World ID
 * @param data.sourceType - Source type (JSON, GEOJSON, IMAGE, KML, URL)
 * @param data.rawData - Raw data to import
 * @returns Created job
 */
createImportJob(data: {
  worldId: string;
  sourceType: ImportSourceType;
  filename?: string;
  rawData: unknown;
}): Promise<{ id: string; status: string }>
```

#### `processImportJob`

Process an import job.

```typescript
/**
 * Process import job
 *
 * @param params - Process parameters
 * @param params.jobId - Job ID
 * @returns Job status and result
 */
processImportJob(params: {
  jobId: string;
}): Promise<{
  status: string;
  result?: {
    pins: number;
    layers: number;
  };
}>
```

#### `cancelImportJob`

Cancel an import job.

```typescript
/**
 * Cancel import job
 *
 * @param params - Cancel parameters
 * @param params.jobId - Job ID
 * @returns Success status
 */
cancelImportJob(params: {
  jobId: string;
}): Promise<{ success: boolean }>
```

---

## API Routes

### `GET /api/worlds`

Get all worlds for current user.

**Response:**
```json
{
  "worlds": [
    {
      "id": "world-1",
      "title": "My World",
      "description": "Description",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### `GET /api/worlds/[id]`

Get single world by ID.

**Parameters:**
- `id` - World ID

**Response:**
```json
{
  "id": "world-1",
  "title": "My World",
  "pins": [...],
  "layers": [...]
}
```

### `POST /api/worlds`

Create a new world.

**Request Body:**
```json
{
  "title": "New World",
  "description": "Description"
}
```

### `PUT /api/worlds/[id]`

Update a world.

**Request Body:**
```json
{
  "title": "Updated Title"
}
```

### `DELETE /api/worlds/[id]`

Delete a world.

---

## Error Handling

All errors follow this format:

```typescript
{
  "success": false,
  "error": "Error message"
}
```

### Common Error Codes

| Error | Description | HTTP Status |
|-------|-------------|------------|
| `Unauthorized` | Not authenticated | 401 |
| `Forbidden` | Lacks permission | 403 |
| `Not Found` | Resource not found | 404 |
| `Validation Error` | Invalid input | 400 |
| `Database Error` | Database operation failed | 500 |

---

## Rate Limiting

API endpoints have the following rate limits:

- **GET requests:** 100/minute per user
- **POST/PUT/DELETE:** 20/minute per user
- **Bulk operations:** 5/minute per user

Exceeded limits return `429 Too Many Requests`.

---

## Data Types

### World
```typescript
interface World {
  id: string;
  title: string;
  description?: string;
  userId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Pin
```typescript
interface Pin {
  id: string;
  worldId: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  pinType: PinType;
  icon?: string;
  color?: string;
  size: number;
  opacity: number;
  isVisible: boolean;
  minZoom: number;
  maxZoom: number;
  createdAt: Date;
  updatedAt: Date;
}

type PinType =
  | 'CITY'
  | 'TOWN'
  | 'CASTLE'
  | 'DUNGEON'
  | 'FOREST'
  | 'MOUNTAIN'
  | 'RIVER'
  | 'LAKE'
  | 'CUSTOM';
```

### Character
```typescript
interface Character {
  id: string;
  worldId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  race?: string;
  class?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### LoreEntry
```typescript
interface LoreEntry {
  id: string;
  worldId: string;
  title: string;
  slug: string;
  content: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Examples

### Complete Workflow: Create World with Pins

```typescript
// 1. Create a world
const world = await createWorld({
  title: "My Campaign World",
  description: "Fantasy world for D&D campaign"
});

// 2. Create pins
const cityPin = await createPin({
  worldId: world.id,
  title: "Capital City",
  description: "The main city",
  latitude: 45.5,
  longitude: -73.5,
  pinType: "CITY",
  icon: "🏰",
  color: "#e74c3c"
});

const dungeonPin = await createPin({
  worldId: world.id,
  title: "Dragon's Lair",
  latitude: 45.6,
  longitude: -73.4,
  pinType: "DUNGEON",
  icon: "🐉"
});

// 3. Create characters
const hero = await createCharacter({
  worldId: world.id,
  name: "Aragorn",
  race: "Human",
  class: "Ranger"
});

// 4. Link character to pin
await linkCharacterToPin({
  characterId: hero.id,
  pinId: cityPin.id
});
```

---

## Testing

### Testing Server Actions

```typescript
// Example test
import { createPin } from '@/features/pins/actions';

describe('Pin Actions', () => {
  it('should create pin', async () => {
    const pin = await createPin({
      worldId: 'test-world',
      title: 'Test Pin',
      latitude: 45.5,
      longitude: -73.5,
      pinType: 'CITY'
    });

    expect(pin).toBeDefined();
    expect(pin.title).toBe('Test Pin');
  });
});
```

---

## Changelog

### v1.1.4 (2025-02-20)
- Added DOMPurify sanitization to markdown rendering
- Fixed test coverage (73.9% passing)
- Added Playwright E2E testing infrastructure
- Improved bundle optimization
- Added comprehensive API documentation

### v1.0.0 (Initial Release)
- Basic CRUD operations for worlds, pins, characters, lore
- Import/export functionality
- Real-time collaboration
