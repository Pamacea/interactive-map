# E2E Tests with Playwright

This directory contains end-to-end tests for the Genesis Interactive Map platform using Playwright.

## Setup

First, install Playwright browsers:

```bash
npx playwright install
```

For CI environments, install system dependencies:

```bash
npx playwright install-deps
```

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug

# Run tests in headed mode (show browser)
npm run test:e2e:headed

# View test report
npm run test:e2e:report
```

## Test Structure

```
tests/e2e/
├── auth.spec.ts           # Authentication flow tests
├── create-world.spec.ts   # World creation flow tests
├── map-editor.spec.ts     # Map interaction tests
├── user-journey.spec.ts   # Complete user journey tests
├── fixtures.ts            # Shared test fixtures
└── helpers/
    ├── auth-helpers.ts    # Authentication utilities
    ├── world-helpers.ts   # World creation utilities
    ├── map-helpers.ts     # Map interaction utilities
    └── test-data.ts       # Test data generators
```

## Test Flows

### Authentication (`auth.spec.ts`)
- Sign in page renders correctly
- OAuth buttons (GitHub, Discord) are functional
- Loading states work correctly
- Error handling

### World Creation (`create-world.spec.ts`)
- Form validation
- Public/private toggle
- Form submission
- Navigation after creation

### Map Editor (`map-editor.spec.ts`)
- Map renders correctly
- Pin creation (double-click)
- Pin selection and popup
- Pin dragging
- Filters and layers

### User Journey (`user-journey.spec.ts`)
- Complete new user flow
- Authenticated user flow
- World explorer flow
- Responsive design

## Environment Variables

Set these in your `.env` file or CI configuration:

```bash
# Base URL for tests (default: http://localhost:3000)
BASE_URL=http://localhost:3000

# Test world ID for map editor tests
TEST_WORLD_ID=your-test-world-id
```

## OAuth Authentication Testing

Since this app uses OAuth (GitHub/Discord), true E2E authentication testing requires one of these approaches:

1. **Test Accounts**: Create test OAuth accounts and handle the flow
2. **Mocking**: Mock the OAuth callbacks and session state
3. **Session Injection**: Inject valid session tokens before tests

Current tests focus on UI validation and interaction patterns rather than full OAuth flows.

## Writing New Tests

1. Create a new spec file in `tests/e2e/`
2. Import fixtures and helpers:

```typescript
import { test, expect } from './fixtures';
import { generateTestWorldName } from './helpers/test-data';

test.describe('My Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/my-page');
    await expect(page.getByText('Hello')).toBeVisible();
  });
});
```

## Debugging

Use the UI mode for interactive debugging:

```bash
npm run test:e2e:ui
```

Or debug mode with inspector:

```bash
npm run test:e2e:debug
```

## CI/CD Integration

Tests run automatically in CI. The configuration:
- Runs on Chromium
- Retries failed tests twice
- Generates HTML report
- Captures screenshots/videos on failure
- Uses existing dev server when available

## Test Data

Tests use deterministic test data from `helpers/test-data.ts`:
- `testUsers`: Test user profiles
- `testWorlds`: Sample world data
- `testPins`: Sample pin data
- `generateTestWorldName()`: Unique world names with timestamps

## Notes

- Tests use a mock world ID (`TEST_WORLD_ID`) for map editor tests
- Some tests may fail without proper authentication setup
- Mobile viewport tests run on Pixel 5 emulation
- Desktop tests run on Chromium
