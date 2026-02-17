# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Real-time collaboration features
- Mobile responsive design improvements
- Export map as image/PDF
- Import/export world data
- Advanced filtering and search

## [1.1.0] - 2025-02-17

### Added
- **Test Infrastructure**: Comprehensive testing framework with Vitest and Playwright
  - 157+ unit tests covering core hooks, utilities, and components
  - 63 E2E tests for authentication, world creation, and map interactions
  - happy-dom integration replacing jsdom for better compatibility
  - Performance testing scripts (k6, Node.js benchmarks)
- **Bundle Analysis**: Automated bundle size analysis and optimization recommendations
- **Dependency Audit**: Analysis reports for TanStack Query, Prisma, and React Compiler

### Changed
- Replaced jsdom with happy-dom in test environment for better lru-cache compatibility
- Updated vitest configuration with coverage thresholds (70% target)

### Fixed
- Resolved lru-cache v8 compatibility issue with @asamuzakjp/css-color
- Fixed test mocks for inputManager integration

[Unreleased]: https://github.com/Pamacea/interactive-map/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/Pamacea/interactive-map/releases/tag/v1.1.0
[1.0.0]: https://github.com/Pamacea/interactive-map/releases/tag/v1.0.0

### Added
- **World Management**: Create and manage custom game worlds with unique slugs and descriptions
- **Interactive Pins**: Place cities, villages, POI, characters, dungeons, shops, and quest markers on maps
- **Character System**: Add characters with dialogue, quests, and RPG properties
- **Lore & Knowledge Base**: Write rich lore entries with categories (History, Geography, Characters, Factions, Magic, Items, Quests)
- **Gallery System**: Attach images, videos, audio, and documents to pins and lore entries
- **Map Layers**: Organize content with multiple layers and visibility controls
- **Public/Private Worlds**: Control visibility and publish status of worlds
- **Tech Stack**: Built with Next.js 16, React 19, TypeScript 5, TailwindCSS 4, shadcn/ui, and MapLibre GL JS

### Security
- Authentication system for secure world management
- Authorization controls for public/private worlds

[Unreleased]: https://github.com/Pamacea/interactive-map/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Pamacea/interactive-map/releases/tag/v1.0.0
