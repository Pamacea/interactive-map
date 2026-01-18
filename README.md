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

## Error Handling

The application implements comprehensive error boundaries to gracefully handle errors and prevent the entire app from crashing.

### Error Boundary Architecture

Based on [Next.js 16 Error Handling](https://nextjs.org/docs/app/getting-started/error-handling):

1. **Global Error Boundary** (`app/global-error.tsx`):
   - Catches errors at the root layout level
   - Last resort error handler for the entire application
   - Must define its own `<html>` and `<body>` tags

2. **Route-level Error Boundaries** (`app/world/[id]/error.tsx`):
   - Catches errors in specific route segments
   - Provides contextual error messages for world editor
   - Allows recovery without losing entire app

3. **Component-level Error Boundaries** (`components/ui/error-boundary.tsx`):
   - Reusable ErrorBoundary component for wrapping critical components
   - Used in WorldClient, Layout, and other interactive components
   - Provides granular error isolation

### Usage Examples

**Basic ErrorBoundary:**
```tsx
import { ErrorBoundary } from "@/components/ui/error-boundary";

<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error("Component error:", error);
    // Send to error reporting service
  }}
>
  <YourComponent />
</ErrorBoundary>
```

**Custom Fallback:**
```tsx
<ErrorBoundary
  fallback={
    <div className="p-4">
      <p>Something went wrong loading this section</p>
      <button onClick={reset}>Try Again</button>
    </div>
  }
>
  <YourComponent />
</ErrorBoundary>
```

### Error Logging

Errors are automatically logged to the console in development. In production, integrate with an error reporting service (Sentry, LogRocket, etc.) by modifying the `logErrorToService` method in the ErrorBoundary components.

### Testing Error Boundaries

Use the `ErrorTestButton` component to verify error boundaries work correctly:

```tsx
import { ErrorTestButton } from "@/components/ui/error-test-button";

<ErrorTestButton type="render" /> // Tests rendering errors
```

**IMPORTANT**: Remove ErrorTestButton in production - it's only for development/testing.

### What Errors Are Caught?

- ✅ Rendering errors (component trees, lifecycle methods)
- ✅ Errors in useEffect and other hooks
- ❌ Event handler errors (use try/catch manually)
- ❌ Async errors (use try/catch in async functions)
- ❌ Server-side errors (use Server Actions error handling)

### Best Practices

1. **Place error boundaries strategically**:
   - Around third-party components
   - Around complex interactive features
   - At route levels (Next.js error.tsx)

2. **Provide helpful fallback UI**:
   - Clear error messages
   - Recovery actions (retry, go home)
   - Context-specific guidance

3. **Log errors appropriately**:
   - Development: Console logs with details
   - Production: Error reporting service integration
   - Include context (component stack, user info)

4. **Don't overuse**:
   - Error boundaries have performance overhead
   - Use for critical UI sections, not every component
   - Prioritize preventing errors over catching them

## Documentation

- **[REFACTORING.md](REFACTORING.md)** - Pin feature refactoring summary (48% code reduction, 98.92% test coverage)
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Component hierarchy and data flow diagrams
- **[docs/HOOK_API.md](docs/HOOK_API.md)** - Hook API documentation with examples
- **[CLAUDE.md](CLAUDE.md)** - Development guidelines and architecture patterns
- **[docs/MASTER_PLAN.md](docs/MASTER_PLAN.md)** - Complete roadmap and planning

## License

MIT