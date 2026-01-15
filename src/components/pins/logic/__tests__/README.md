# Pin Hooks Test Documentation

This directory contains comprehensive unit tests for the custom React hooks used in the pin marker system.

## Test Coverage

As of the latest test run, the coverage is:

| Hook | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| **usePinDrag** | 98.46% | 84% | 100% | 98.46% |
| **usePinEvents** | 100% | 100% | 100% | 100% |
| **usePinPosition** | 100% | 100% | 100% | 100% |
| **Overall** | **98.92%** | **90.9%** | **100%** | **98.9%** |

## Test Files

### 1. `use-pin-drag.test.ts` (18 tests)

Tests the drag-and-drop functionality for pin markers.

**Test Categories:**
- **Initial State**: Verifies correct default state initialization
- **Drag Threshold Behavior**: Tests the 3px movement threshold before drag starts
- **Position Clamping**: Validates boundary checking to keep pins within map limits
- **Optimistic Updates**: Tests Zustand store updates and server action calls
- **Event Listener Cleanup**: Ensures proper cleanup of window event listeners
- **Layer Lock Prevention**: Validates that locked layers prevent dragging
- **Mouse Button Handling**: Tests left-button-only drag initiation
- **Scale Handling**: Verifies correct position adjustment with zoom/scale
- **Error Handling**: Tests graceful handling of database errors

**Key Test Scenarios:**
- Drag doesn't start on movements < 3px
- Drag starts after movements > 3px
- Position is clamped to [0, mapWidth] and [0, mapHeight]
- onUpdatePin is called with normalized coordinates (0-1 range)
- updatePinPosition server action is called in background
- Event listeners are cleaned up on drag end
- Locked layers prevent drag initiation
- Only left mouse button (button 0) starts drag

### 2. `use-pin-position.test.ts` (30 tests)

Tests coordinate conversion and position calculations for pin markers.

**Test Categories:**
- **Coordinate Conversion**: Validates lat/lng to pixel conversion
- **Layer Offset Application**: Tests layer offset application to position
- **Dimension Calculation**: Tests correct dimension handling from image metadata
- **Drag Position Handling**: Validates drag position vs stored position logic
- **Edge Cases**: Tests null/undefined/zero values and extreme coordinates
- **Memoization**: Verifies React.useMemo optimization
- **Coordinate Precision**: Tests high-precision coordinate handling

**Key Test Scenarios:**
- Converts latitude/longitude (0-1) to pixel coordinates
- Applies layer offsets to final position
- Handles drag position when provided
- Falls back to pin coordinates when drag is null
- Returns layer reference and offset information
- Handles undefined/zero image dimensions
- Maintains precision with fractional coordinates

### 3. `use-pin-events.test.ts` (16 tests)

Tests hover state management and event capture integration.

**Test Categories:**
- **Initial State**: Verifies isHovered starts as false
- **Hover State Management**: Tests mouse enter/leave handlers
- **Event Capture Integration**: Tests eventManager.capture integration
- **Store Integration**: Validates Zustand store.setHoverPin calls
- **Edge Cases**: Tests rapid hover changes and missing pinId
- **Memory Leak Prevention**: Ensures cleanup on unmount

**Key Test Scenarios:**
- isHovered becomes true on mouse enter
- isHovered becomes false on mouse leave
- Event capture is triggered on hover
- Event capture is triggered on selection
- Event capture is prevented during drag
- setHoverPin is called with correct pinId
- Event listeners are cleaned up on unmount

## Running Tests

### Run all tests once:
```bash
pnpm test
```

### Run tests in watch mode:
```bash
pnpm test --watch
```

### Run tests with UI:
```bash
pnpm test:ui
```

### Run coverage report:
```bash
pnpm test:coverage
```

## Test Architecture

### Mocking Strategy

1. **Server Actions**: `vi.mock('@/actions/pins')`
   - Mocks `updatePinPosition` to test async database updates

2. **Event Manager**: `vi.mock('@/lib/event-manager')`
   - Mocks `eventManager.capture` to test event capture logic

3. **Zustand Store**: `vi.mock('@/stores/use-pins-store')`
   - Mocks `usePinsStore` selector to test store integration

### Testing Utilities

- **renderHook**: From `@testing-library/react` for hook testing
- **act**: For wrapping state updates in tests
- **waitFor**: For async assertions and cleanup verification
- **vi.fn()**: For creating mock functions
- **vi.clearAllMocks()**: For clean test isolation

### Test Structure

Each test file follows this pattern:

1. **Mock Setup**: Configure module mocks at top of file
2. **Test Data**: Define mock parameters and props
3. **Describe Blocks**: Group tests by functionality
4. **Before Each**: Reset mocks before each test
5. **Assertions**: Clear expect() statements with descriptive messages

## Coverage Goals

All hooks maintain >80% coverage as required:
- ✅ usePinDrag: 98.46%
- ✅ usePinEvents: 100%
- ✅ usePinPosition: 100%

## Notes

- Tests use Vitest (not Jest) for better performance and ESM support
- Tests use `jsdom` environment for DOM simulation
- Tests use `@testing-library/react` for hook testing utilities
- All mocks are properly cleaned up between tests to prevent interference
- Floating point comparisons use `toBeCloseTo()` for precision handling

## Future Improvements

Potential areas for additional test coverage:
- Integration tests with actual map component
- Performance tests for rapid drag operations
- Accessibility tests for keyboard navigation
- Visual regression tests for pin rendering
