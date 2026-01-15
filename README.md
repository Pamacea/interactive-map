# Interactive Map

A creative tool for building interactive maps for games, roleplay (RPG) worlds, and fantasy narratives. Inspired by League of Legends interactive maps.

## Features

- **Game World Creation**: Build custom worlds with unique slugs and descriptions
- **Interactive Pins**: Place cities, villages, POI, characters, dungeons, shops, and quest markers
- **Character System**: Add characters with dialogue, quests, and RPG properties
- **Lore & Knowledge Base**: Write rich lore entries with categories (History, Geography, Characters, Factions, Magic, Items, Quests)
- **Gallery System**: Attach images, videos, audio, and documents to pins and lore
- **Map Layers**: Organize content with multiple layers and visibility controls
- **Public/Private Worlds**: Control visibility and publish status

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4 + shadcn/ui
- **Maps**: MapLibre GL JS (open-source)
- **Geospatial**: Turf.js, Supercluster
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **State**: Zustand + TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Setup database
npm run db:generate
npm run db:push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Commands

```bash
npm run db:generate    # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:migrate    # Create and run migration
npm run db:reset      # Reset database (dev only)
npm run db:studio     # Open Prisma Studio
```

## Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm run test -- use-pin-drag
```

### Test Coverage

Current test coverage for the pin feature: **98.92%** (64/64 tests passing)

| Hook/Component | Tests | Coverage |
|----------------|-------|----------|
| `usePinDrag` | 18 tests | 98.46% |
| `usePinEvents` | 16 tests | 100% |
| `usePinPosition` | 30 tests | 100% |
| **Overall** | **64 tests** | **98.92%** |

### Running Specific Tests

```bash
# Test drag functionality
npm run test -- use-pin-drag

# Test event handling
npm run test -- use-pin-events

# Test position calculation
npm run test -- use-pin-position

# Run tests matching a pattern
npm run test -- --grep "drag"
```

## Development Workflow

### Adding New Features

1. **Create component** following `ui/logic/methods` pattern:
   ```bash
   src/components/[feature]/
   ├── ui/           # Presentational components
   ├── logic/        # Custom hooks, state management
   └── methods/      # API calls, data transformations
   ```

2. **Write tests** alongside implementation:
   ```bash
   src/components/[feature]/logic/__tests__/
   └── your-hook.test.ts
   ```

3. **Run tests** to ensure quality:
   ```bash
   npm run test:coverage
   ```

4. **Update documentation** (CLAUDE.md, README.md)

### Code Quality Standards

- **Max 70 lines per component** (extract sub-components if larger)
- **TypeScript strict mode** (no `any` types)
- **JSDoc comments** on all exported functions
- **80%+ test coverage** on business logic
- **ESLint passing** (`npm run lint`)
- **TypeScript passing** (`npm run build`)

### Performance Guidelines

- Use `memo()` for components that re-render frequently
- Implement custom comparison functions for complex props
- Apply `useMemo` for expensive calculations
- Use optimistic updates for better UX
- Test with React DevTools Profiler

## Documentation

- **[REFACTORING.md](REFACTORING.md)** - Pin feature refactoring summary (48% code reduction, 98.92% test coverage)
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Component hierarchy and data flow diagrams
- **[docs/HOOK_API.md](docs/HOOK_API.md)** - Hook API documentation with examples
- **[CLAUDE.md](CLAUDE.md)** - Development guidelines and architecture patterns
- **[docs/MASTER_PLAN.md](docs/MASTER_PLAN.md)** - Complete roadmap and planning

## License

MIT