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

## Documentation

See [docs/MASTER_PLAN.md](docs/MASTER_PLAN.md) for complete architecture documentation and roadmap.

## License

MIT