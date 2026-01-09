# MASTER PLAN - Interactive Map for Games & Roleplay Worlds

## Project Overview

**Interactive Map** is a creative tool for building interactive maps for games, roleplay (RPG) worlds, and fantasy narratives. Inspired by League of Legends interactive maps, it allows creators to build rich, visual worlds with pins for cities, villages, points of interest (POI), characters, and lore documentation with galleries.

### Vision
Create an immersive world-building platform where game masters, RPG creators, and fantasy writers can visualize their worlds with interactive maps, character placement, lore entries, and rich media galleries.

### Core Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript 5
- **Styling**: TailwindCSS 4, shadcn/ui components
- **Maps**: MapLibre GL JS (open-source, no API key required)
- **Geospatial Processing**: Turf.js, Supercluster (clustering)
- **State Management**: Zustand (client), TanStack Query (server)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js 4
- **Validation**: Zod schemas

---

## Architecture Principles

### Type-Level Programming
- All I/O boundaries validated with Zod schemas
- Opaque types for IDs and sensitive primitives
- Contract-first API design

### Side-Effect Isolation
- Pure functions for geospatial computations
- Effect wrappers for external service calls
- Clear separation between UI and business logic

### Zero-Debt Engineering
- **Max Cognitive Complexity**: 8 per function
- **Max Dependency Depth**: 5 levels
- **Min Test Coverage**: 90%
- **Max Cyclomatic Complexity**: 10 per function

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── auth/          # NextAuth endpoints
│   ├── globals.css        # Global styles + shadcn/ui
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── @map/              # Map-specific components
│   │   └── interactive-map.tsx
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   └── utils.ts           # Utility functions (cn, etc.)
├── types/                 # TypeScript type definitions
├── constants/             # Application constants
├── utils/                 # Pure utility functions
├── hooks/                 # Custom React hooks
└── stores/                # Zustand stores
```

---

## Key Features (Roadmap)

### Phase 1: Foundation (Current)
- [x] Project initialization with Next.js 16 + TypeScript
- [x] TailwindCSS + shadcn/ui setup
- [x] MapLibre GL JS integration
- [x] Prisma schema for game worlds
- [x] NextAuth.js authentication setup
- [ ] Landing page with hero section
- [ ] User authentication flow
- [ ] Game world creation interface

### Phase 2: World Building Core
- [ ] **Game World Management**
  - Create worlds with custom slugs
  - World cover images and descriptions
  - Public/private visibility controls
  - Publish/unpublish functionality

- [ ] **Interactive Pins**
  - Cities, villages, POI markers
  - Character pins with dialogue
  - Dungeons, shops, quest markers
  - Custom icons and colors
  - Pin visibility controls

- [ ] **Map Layers**
  - Multiple layers per world
  - Toggle visibility
  - Layer opacity controls
  - Z-index ordering

### Phase 3: Lore & Knowledge Base
- [ ] **Lore Entries**
  - Rich text content for world history
  - Categories: History, Geography, Characters, Factions, Magic, Items, Quests
  - Link lore to map pins
  - Public/private lore entries
  - Slug-based URLs

- [ ] **Gallery System**
  - Images, videos, audio, documents
  - Attach to pins or lore entries
  - Ordered galleries
  - Media type support

### Phase 4: Advanced Features
- [ ] **Character System**
  - Character profiles on map
  - Level, faction, class data
  - Dialogue and quest associations
  - Shop keepers and services

- [ ] **Map Interactions**
  - Marker clustering (Supercluster)
  - Custom map styles/themes
  - Geospatial queries (nearby pins)
  - Pin search and filtering

- [ ] **Library/Explorer**
  - Browse public game worlds
  - Search by title, tags
  - Featured worlds
  - User profile pages

### Phase 5: SaaS & Collaboration
- [ ] **User Accounts**
  - Profile management
  - World portfolio
  - Activity feed

- [ ] **Collaboration**
  - Multi-user editing
  - Permission levels
  - Comment system
  - Version history

- [ ] **Monetization**
  - Subscription tiers (free, pro)
  - Usage quotas
  - Team features
  - Analytics dashboard

---

## Database Schema

### Core Models

**User**
- Authentication and profile (name, bio, image)
- Game worlds created
- Pins and lore entries authored

**GameWorld**
- Slug-based URLs for world pages
- Title, description, cover image
- Public/private visibility
- Published/unpublished state

**Pin**
- Geographic coordinates (latitude, longitude)
- Pin types: CITY, VILLAGE, POI, CHARACTER, DUNGEON, SHOP, QUEST, TREASURE, CUSTOM
- Custom icons, colors, sizes
- Flexible JSON properties for RPG data (level, faction, dialogue, quests)
- Layer associations
- Visibility controls

**MapLayer**
- Named layers within a world
- Opacity and z-index controls
- Pin grouping

**LoreEntry**
- Rich text content
- Slug-based URLs within worlds
- Categories: GENERAL, HISTORY, GEOGRAPHY, CHARACTERS, FACTIONS, MAGIC, ITEMS, QUESTS
- Public/private visibility
- Linked to map pins

**GalleryItem**
- Media types: IMAGE, VIDEO, AUDIO, DOCUMENT
- Attached to pins or lore entries
- Ordered display

### Example Character Pin Properties
```json
{
  "character": {
    "level": 5,
    "faction": "Alliance",
    "class": "Warrior",
    "dialogue": [
      "Hello traveler!",
      "What brings you here?"
    ],
    "quests": ["quest-id-1", "quest-id-2"],
    "shop": true
  }
}
```

### Geospatial Queries
```typescript
// Find all pins in a game world
const worldPins = await prisma.pin.findMany({
  where: { gameWorldId: worldId },
  include: { layer: true, gallery: true },
});

// Find nearby pins using bounding box
const nearby = await prisma.pin.findMany({
  where: {
    latitude: { gte: minLat, lte: maxLat },
    longitude: { gte: minLng, lte: maxLng },
    isVisible: true,
  },
});

// Distance calculation with Turf.js
import distance from "@turf/distance";
const d = distance([lng1, lat1], [lng2, lat2], { units: "kilometers" });
```

---

## Development Workflow

### Setup
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your DATABASE_URL and NEXTAUTH_SECRET

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

### Code Quality
```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Format code (if using Prettier)
npm run format
```

### Database Migrations
```bash
# Create migration
npx prisma migrate dev --name <migration-name>

# Reset database (dev only)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

---

## API Design Principles

### RESTful Endpoints

**Game Worlds**
```
GET    /api/worlds                  # List public worlds
POST   /api/worlds                  # Create world
GET    /api/worlds/:slug            # Get world by slug
PUT    /api/worlds/:id              # Update world
DELETE /api/worlds/:id              # Delete world
GET    /api/worlds/:slug/pins       # Get all pins for world
```

**Pins**
```
GET    /api/worlds/:worldId/pins    # List pins in world
POST   /api/worlds/:worldId/pins    # Create pin
GET    /api/pins/:id                # Get single pin
PUT    /api/pins/:id                # Update pin
DELETE /api/pins/:id                # Delete pin
POST   /api/pins/:id/gallery        # Add gallery item
```

**Lore**
```
GET    /api/worlds/:worldId/lore    # List lore entries
POST   /api/worlds/:worldId/lore    # Create lore entry
GET    /api/worlds/:worldId/lore/:slug  # Get lore entry
PUT    /api/lore/:id                # Update lore
DELETE /api/lore/:id                # Delete lore
```

**Map Layers**
```
GET    /api/worlds/:worldId/layers  # List layers
POST   /api/worlds/:worldId/layers  # Create layer
PUT    /api/layers/:id              # Update layer
DELETE /api/layers/:id              # Delete layer
```

### Validation with Zod
```typescript
import { z } from "zod";

const CreateGameWorldSchema = z.object({
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
});

const CreatePinSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  pinType: z.enum(["CITY", "VILLAGE", "POI", "CHARACTER", "DUNGEON", "SHOP", "QUEST", "TREASURE", "CUSTOM"]),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  size: z.number().min(16).max(128),
  layerId: z.string().cuid().optional(),
  properties: z.record(z.any()).optional(),
});

const CreateLoreEntrySchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  slug: z.string().min(1).max(100),
  category: z.enum(["GENERAL", "HISTORY", "GEOGRAPHY", "CHARACTERS", "FACTIONS", "MAGIC", "ITEMS", "QUESTS", "CUSTOM"]),
  isPublic: z.boolean().default(true),
});
```

---

## Testing Strategy

### Unit Tests
- Pure functions (utils, hooks logic)
- Geospatial calculations
- Zod schema validation

### Integration Tests
- API endpoints
- Database operations
- Authentication flow

### E2E Tests
- Map interactions
- User workflows
- Critical paths

---

## Performance Optimization

### Map Rendering
- Virtual scrolling for large datasets
- Marker clustering (Supercluster)
- Web Workers for geospatial computations
- Lazy loading of map layers

### Data Fetching
- TanStack Query caching
- Optimistic updates
- Pagination for large datasets
- IndexedDB for offline storage

### Bundle Size
- Code splitting by route
- Dynamic imports for heavy components
- Tree shaking unused code

---

## Security Considerations

- Rate limiting on API endpoints
- Input validation with Zod
- SQL injection prevention (Prisma)
- XSS protection (React defaults)
- CSRF protection (NextAuth)
- Environment variable validation
- Secure headers (CSP, HSTS)

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Linting clean
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Bundle size optimized

### Production Build
```bash
npm run build
npm start
```

### Monitoring
- Error tracking (Sentry)
- Analytics (Plausible/PostHog)
- Performance monitoring (Vercel Analytics)
- Uptime monitoring

---

## Contributing Guidelines

### Code Style
- Follow existing patterns in the codebase
- Use barrel exports for components
- Prefer composition over prop drilling
- Keep components < 250 lines
- Extract complex logic to hooks/utils

### Commit Convention
```
feat: add marker clustering feature
fix: resolve map zoom on mobile
refactor: extract map state to Zustand store
test: add unit tests for geospatial utils
docs: update MASTER_PLAN with new features
```

---

## License

MIT License - See LICENSE file for details
