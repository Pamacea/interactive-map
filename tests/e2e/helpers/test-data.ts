/**
 * Test Data Helpers for E2E Tests
 *
 * Provides deterministic test data for consistent testing.
 */

export const testUsers = {
  github: {
    email: 'e2e-test-github@example.com',
    name: 'E2E GitHub Test User',
  },
  discord: {
    email: 'e2e-test-discord@example.com',
    name: 'E2E Discord Test User',
  },
} as const;

export const testWorlds = {
  minimal: {
    name: 'Test Realm E2E',
    description: 'A test world for E2E testing purposes.',
    isPublic: true,
  },
  withDescription: {
    name: 'Kingdom of E2E Tests',
    description: 'A vast and detailed realm filled with automated tests and brave little testers fighting against bugs. This world has existed since the beginning of time.',
    isPublic: true,
  },
  private: {
    name: 'Secret E2E Dungeon',
    description: 'A hidden world accessible only to its creator.',
    isPublic: false,
  },
} as const;

export const testPins = {
  city: {
    name: 'Capital City',
    description: 'The grand capital of the realm',
    type: 'city',
  },
  dungeon: {
    name: 'Dark Dungeon',
    description: 'A dangerous dungeon filled with monsters',
    type: 'dungeon',
  },
  poi: {
    name: 'Ancient Ruins',
    description: 'Mysterious ruins of an ancient civilization',
    type: 'poi',
  },
} as const;

/**
 * Generates a unique test world name with timestamp
 */
export function generateTestWorldName(prefix = 'E2E Test World'): string {
  return `${prefix} - ${Date.now()}`;
}

/**
 * Generates a unique test email
 */
export function generateTestEmail(): string {
  return `e2e-test-${Date.now()}@example.com`;
}

/**
 * Creates a test world object with unique name
 */
export function createTestWorld(overrides?: Partial<typeof testWorlds.minimal>) {
  return {
    ...testWorlds.minimal,
    name: generateTestWorldName(),
    ...overrides,
  };
}
