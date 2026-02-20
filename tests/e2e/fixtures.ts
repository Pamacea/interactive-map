/**
 * E2E Test Fixtures
 *
 * Shared fixtures and setup for E2E tests.
 */

/* eslint-disable react-hooks/rules-of-hooks */
// The `use` function here is Playwright's fixture API, not React's use() hook

import { test as base } from '@playwright/test';
import { createAuthHelpers } from './helpers/auth-helpers';
import { createWorldHelpers } from './helpers/world-helpers';
import { createMapHelpers } from './helpers/map-helpers';

// Extend base test with custom fixtures
export const test = base.extend<{
  authHelpers: ReturnType<typeof createAuthHelpers>;
  worldHelpers: ReturnType<typeof createWorldHelpers>;
  mapHelpers: ReturnType<typeof createMapHelpers>;
}>({
  authHelpers: async ({ page }, use) => {
    const helpers = createAuthHelpers(page);
    await use(helpers);
  },
  worldHelpers: async ({ page }, use) => {
    const helpers = createWorldHelpers(page);
    await use(helpers);
  },
  mapHelpers: async ({ page }, use) => {
    const helpers = createMapHelpers(page);
    await use(helpers);
  },
});

export { expect } from '@playwright/test';
