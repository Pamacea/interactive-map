# Search Feature Documentation

## Overview

The Search feature provides full-text search capabilities across pins and lore entries within a world. Users can quickly find content using keyboard shortcuts (Ctrl/Cmd + K) and navigate to search results.

## Features

### 1. Full-Text Search
- **Pins**: Search titles, descriptions, and custom properties
- **Lore**: Search titles, content, and categories
- **Relevance Scoring**: Results ranked by match quality (exact match > starts with > contains)
- **Highlighting**: Matching terms highlighted in search results

### 2. Advanced Filtering
- Filter by content type (All, Pins, Lore)
- Filter by pin type (City, Village, POI, Character, Dungeon, etc.)
- Filter by lore category (General, History, Geography, etc.)
- Filter by layer

### 3. User Experience
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + K` - Open/close search
  - `Tab` - Navigate between tabs
  - `Arrow Up/Down` - Navigate suggestions
  - `Enter` - Select suggestion/result
  - `Esc` - Close search
- **Autocomplete**: Search suggestions as you type
- **Debounced Input**: 300ms delay to reduce server load
- **Result Tabs**: Organize results by type (All/Pins/Lore)
- **Relevance Indicators**: Show match percentage for each result

### 4. Integration
- Integrated into world navigation bar
- Click on pins to select and center on map
- Click on lore entries to open details (TODO: implement)

## Architecture

### Directory Structure

```
src/
├── actions/
│   └── search.ts                    # Server Actions for search
├── components/
│   └── search/
│       ├── index.ts                 # Barrel export
│       └── ui/
│           ├── search-bar.tsx       # Main search input component
│           ├── search-results.tsx   # Results display component
│           ├── search-highlight.tsx # Text highlighting component
│           └── __tests__/
│               └── search-highlight.test.tsx
├── hooks/
│   ├── use-debounce.ts              # Debounce utility
│   ├── use-keyboard-shortcut.ts     # Keyboard shortcut hook
│   └── __tests__/
│       └── use-keyboard-shortcut.test.ts
└── store/
    └── use-search-store.ts          # Zustand search state
```

### Key Components

#### 1. Server Actions (`src/actions/search.ts`)

**Functions**:
- `searchWorld(data: SearchQuery)` - Main search function
- `getSearchSuggestions(worldId, query)` - Autocomplete suggestions

**Search Algorithm**:
```typescript
// Relevance scoring:
- Exact title match: 100 points
- Title starts with query: 80 points
- Title contains query: 60 points
- Word matches in title: 10 points each
- Content matches: 5 points each (max 25)
```

**Validation**:
- All inputs validated with Zod schemas
- Query length: 1-200 characters
- Limit: 1-100 results (default 50)
- Authentication required
- World permission verified

#### 2. UI Components

**SearchBar** (`search-bar.tsx`):
- Collapsible search input
- Shows as button in navigation when closed
- Expands to modal when opened
- Handles keyboard navigation
- Displays suggestions dropdown
- Integrates with search store

**SearchResults** (`search-results.tsx`):
- Tabbed interface (All/Pins/Lore)
- Shows result count
- Displays loading/error states
- Renders result items with metadata
- Handles keyboard navigation

**SearchHighlight** (`search-highlight.tsx`):
- Highlights matching terms in results
- Truncates long text with ellipsis
- Context window: 50 chars before/after match
- Case-insensitive matching

#### 3. State Management (`use-search-store.ts`)

**State**:
```typescript
{
  isOpen: boolean;           // Search modal visibility
  query: string;             // Current search input
  debouncedQuery: string;    // Debounced query for API calls
  results: SearchResults | null;
  isLoading: boolean;
  error: string | null;
  filters: SearchFilters;    // Content type, pin type, category, layer
  activeTab: "all" | "pins" | "lore";
  suggestions: string[];     // Autocomplete suggestions
  showSuggestions: boolean;
  highlightedIndex: number;  // For keyboard navigation
}
```

**Actions**:
- `openSearch()` / `closeSearch()` / `toggleSearch()`
- `setQuery()` / `setDebouncedQuery()`
- `setResults()` / `setLoading()` / `setError()`
- `setFilters()` / `setActiveTab()`
- `setSuggestions()` / `setShowSuggestions()`
- `clearSearch()`

#### 4. Keyboard Shortcuts (`use-keyboard-shortcut.ts`)

**Hook API**:
```typescript
useKeyboardShortcut([
  {
    key: "k",
    ctrlKey: true,
    metaKey: true,
    handler: () => console.log("Search opened"),
    preventDefault: true
  }
])
```

**Features**:
- Cross-platform (Ctrl on Windows/Linux, Cmd on Mac)
- Supports modifiers: Ctrl, Meta, Shift, Alt
- Automatic cleanup on unmount
- Case-insensitive key matching

## Usage Examples

### Basic Search

```typescript
import { SearchBar } from "@/components/search";

function WorldEditor() {
  return (
    <div>
      <SearchBar
        worldId="world-123"
        onResultClick={(result) => {
          if (result.type === "pin") {
            console.log("Selected pin:", result.id);
          }
        }}
      />
    </div>
  );
}
```

### With Custom Filters

```typescript
import { searchWorld } from "@/actions/search";

async function searchWithFilters() {
  const result = await searchWorld({
    worldId: "world-123",
    query: "dragon",
    filters: {
      contentType: "pins",
      pinType: "CHARACTER",
    },
    limit: 25,
  });

  if (result.success) {
    console.log("Found pins:", result.data.pins);
  }
}
```

### Search Suggestions

```typescript
import { getSearchSuggestions } from "@/actions/search";

async function fetchSuggestions(query: string) {
  const result = await getSearchSuggestions("world-123", query, 8);

  if (result.success) {
    console.log("Suggestions:", result.data);
  }
}
```

## Performance Considerations

### 1. Debouncing
- Search input debounced by 300ms
- Reduces API calls during typing
- Improves perceived performance

### 2. Result Limits
- Maximum 100 results per request
- Default 50 results
- Pagination can be added for large result sets

### 3. Database Queries
- Indexed fields: `gameWorldId`, `isVisible`, `pinType`, `category`
- Uses Prisma's `contains` operator (case-insensitive)
- Parallel queries for pins and lore
- Filters applied at database level

### 4. Client-Side Optimization
- Zustand for minimal re-renders
- Selector hooks for component optimization
- Memoized components where needed
- Virtual scrolling for large lists (TODO)

## Testing

### Unit Tests

**SearchHighlight** (10 tests):
- Plain text rendering
- Text highlighting
- Case insensitivity
- Special regex characters
- Long text truncation
- Custom className
- Edge positions (start/end)

**useKeyboardShortcut** (10 tests):
- Event listener registration
- Handler invocation
- Key matching
- Modifier matching
- Ctrl/Cmd + K cross-platform
- Prevent default
- Cleanup on unmount
- Multiple shortcuts
- Combined modifiers (Shift/Alt)
- Case-insensitive matching

### Test Coverage

Total: **101 tests** (20 new for search feature)
- SearchHighlight: 10 tests
- useKeyboardShortcut: 10 tests
- Overall test suite: 101 tests passing

## Future Enhancements

### Phase 2 Features
1. **Map Navigation**
   - Center map on selected pin
   - Zoom to pin location
   - Animate camera movement

2. **Lore Entry Integration**
   - Open lore entry in sidebar
   - Scroll to content
   - Highlight matching text in lore viewer

3. **Advanced Filters**
   - Date range filters
   - Tag-based filtering
   - Multi-select filters
   - Saved search queries

4. **Search Analytics**
   - Track search queries
   - Popular searches
   - Zero-result queries
   - Search performance metrics

5. **Performance**
   - Full-text search with PostgreSQL `tsvector`
   - Search result caching
   - Virtual scrolling for large lists
   - Lazy loading of result details

### Phase 3 Features
1. **Fuzzy Search**
   - Typo tolerance
   - Phonetic matching
   - Autocorrect suggestions

2. **Semantic Search**
   - Vector embeddings
   - Similarity search
   - Concept-based queries

3. **Collaborative Search**
   - Shared search queries
   - Team search history
   - Search result sharing

## Troubleshooting

### Common Issues

**1. Search not returning results**
- Check user has permission to access the world
- Verify `isVisible` is true for pins/lore
- Check query length (min 2 characters)
- Review database indexes

**2. Keyboard shortcut not working**
- Ensure focus is on the page (not in input)
- Check browser extensions don't intercept shortcuts
- Verify `useKeyboardShortcut` is mounted
- Check console for errors

**3. Slow search performance**
- Check database indexes on `gameWorldId`, `isVisible`
- Reduce `limit` parameter
- Consider caching frequent queries
- Profile Prisma queries

**4. TypeScript errors**
- Ensure Prisma client is generated: `npx prisma generate`
- Check Zod schema types match Prisma types
- Verify `Pin` and `LoreEntry` types are up to date

## API Reference

### Types

```typescript
interface SearchQuery {
  worldId: string;
  query: string;          // 1-200 characters
  filters?: SearchFilters;
  limit?: number;         // 1-100, default 50
}

interface SearchFilters {
  contentType?: "all" | "pins" | "lore";
  pinType?: PinType;
  loreCategory?: LoreCategory;
  layerId?: string;
}

interface SearchResults {
  pins: PinSearchResult[];
  lore: LoreSearchResult[];
  total: number;
  query: string;
}

interface PinSearchResult {
  type: "pin";
  id: string;
  title: string;
  description: string | null;
  pinType: string;
  latitude: number;
  longitude: number;
  layerId: string | null;
  layerName: string | null;
  icon: string | null;
  color: string;
  relevance: number;  // 0-100
}

interface LoreSearchResult {
  type: "lore";
  id: string;
  title: string;
  content: string;
  category: string;
  slug: string;
  relevance: number;  // 0-100
}
```

### Server Actions

```typescript
// Search world content
const result = await searchWorld({
  worldId: "world-123",
  query: "dragon",
  filters: {
    contentType: "all",
    pinType: "CHARACTER",
  },
  limit: 50,
});

// Get search suggestions
const suggestions = await getSearchSuggestions(
  "world-123",
  "dra",  // partial query
  10      // max suggestions
);
```

### Store Selectors

```typescript
// State selectors
const isOpen = useSearchIsOpen();
const query = useSearchQuery();
const results = useSearchResults();
const isLoading = useSearchIsLoading();
const error = useSearchError();

// Actions
const { openSearch, closeSearch, toggleSearch } = useSearchStore();
const { setQuery, setResults, clearSearch } = useSearchStore();
const { setFilters, setActiveTab } = useSearchStore();
```

## Contributing

When modifying the search feature:

1. **Add tests** for new functionality
2. **Update TypeScript types** for any API changes
3. **Run tests**: `npm test`
4. **Type check**: `npx tsc --noEmit`
5. **Update documentation** in this file

## License

MIT - Part of the Genesis Interactive Map Platform
