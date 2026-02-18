# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- WebSocket/Socket.io for true real-time sync
- Conflict resolution for concurrent edits (CRDT/OT)
- Test coverage for core features
- Performance optimizations

## [1.1.3] - 2026-02-18

### Added
- **Gallery Module**: New floating panel module for image gallery accessible from dock
- **Pin Details Sidebar**: Replaced popup with floating sidebar panel for pin details
  - Edit title, description, icon, color, layer
  - GPS coordinates display
  - Visibility toggle
  - Delete functionality
- **Pin Gallery Integration**: Link/unlink images to pins with two-tab dialog
  - Gallery tab: Select from all world images
  - Upload New tab: Direct image upload from pin dialog
  - Search functionality for finding images
  - Images can be shared across multiple pins

### Changed
- Simplified pin drag handler by removing complex inputManager dependency
- Each pin now handles its own drag events directly with window listeners
- Improved FloatingPanel content click isolation to prevent unwanted map interactions

### Fixed
- **Pin Drag & Drop**: Fixed critical issue where pins couldn't be dragged on the map
- **Pin Position Persistence**: Fixed issue where dragged pins would revert to original position after page reload
  - Now correctly saves final position to database via server action
- **Event Listener Closure Issues**: Fixed stale closure problems in drag handler using refs for dynamic values
- **Gallery Upload**: Fixed missing `worldId` causing uploaded images to not appear in gallery
- **Button Click Propagation**: Fixed Edit/Add Image buttons deselecting pins due to event bubbling

## [1.1.2] - 2026-02-18

### Changed
- **Documentation**: Restructured documentation following TrigMem convention
  - README.md converted to 30-second hook format
  - CLAUDE.md simplified as developer reference
  - Added project identity, architecture patterns, and design tokens

### Fixed
- Cleaned up redundant documentation sections
- Standardized file naming conventions across codebase

## [1.1.1] - 2025-02-17

### Fixed
- Security vulnerabilities in dependencies
- Updated lru-cache to v8.0.1 for compatibility

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

## [1.0.0] - 2025-02-10

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

[Unreleased]: https://github.com/Pamacea/interactive-map/compare/v1.1.3...HEAD
[1.1.3]: https://github.com/Pamacea/interactive-map/releases/tag/v1.1.3
[1.1.2]: https://github.com/Pamacea/interactive-map/compare/v1.1.2...v1.1.3
[1.1.1]: https://github.com/Pamacea/interactive-map/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/Pamacea/interactive-map/releases/tag/v1.1.0
[1.0.0]: https://github.com/Pamacea/interactive-map/releases/tag/v1.0.0
