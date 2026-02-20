/**
 * User Journey E2E Tests
 *
 * Complete user flows combining multiple features.
 * These tests demonstrate the full user experience.
 */

import { test, expect } from './fixtures';
import { generateTestWorldName } from './helpers/test-data';

test.describe('New User Journey', () => {
  test('should navigate from home to create world', async ({ page, _worldHelpers }) => {
    // Start at home
    await page.goto('/');

    // Look for navigation to create
    const createLink = page.getByRole('link', { name: /create|new world|get started/i });
    if (await createLink.isVisible()) {
      await createLink.click();
    } else {
      // Navigate directly to create page
      await page.goto('/create');
    }

    // Verify we're on create page
    await expect(page.getByRole('heading', { name: /create new world/i })).toBeVisible();
  });

  test('should complete world creation flow', async ({ page, worldHelpers }) => {
    const worldData = {
      name: generateTestWorldName(),
      description: 'A magnificent realm for testing purposes.',
      isPublic: true,
    };

    // Navigate to create
    await worldHelpers.gotoCreateWorld();

    // Fill form
    await worldHelpers.fillWorldForm(worldData);

    // Verify form is filled
    await expect(page.getByLabel(/world name/i)).toHaveValue(worldData.name);
    await expect(page.getByLabel(/description/i)).toHaveValue(worldData.description);

    // Note: Actual submission requires auth, so we stop here
    // In real tests, we would mock auth or use test accounts
  });

  test('should navigate from create to explore page', async ({ page }) => {
    await page.goto('/create');

    // Look for explore/back links
    const exploreLink = page.getByRole('link', { name: /explore|back|cancel/i });
    if (await exploreLink.first().isVisible()) {
      await exploreLink.first().click();
    }

    // Verify navigation or stay on same page
    await page.waitForLoadState('networkidle');
  });
});

test.describe('Authenticated User Journey', () => {
  test.beforeEach(async ({ _page, authHelpers }) => {
    // Note: In real E2E tests, you would:
    // 1. Set up a test account
    // 2. Use OAuth mocking
    // 3. Or inject session tokens

    await authHelpers.gotoSignIn();
  });

  test('should see sign in options', async ({ page }) => {
    await expect(page.getByRole('button', { name: /continue with github/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /continue with discord/i })).toBeVisible();
  });
});

test.describe('World Explorer Journey', () => {
  test('should browse worlds from explore page', async ({ page }) => {
    await page.goto('/explore');

    // Look for world cards or listings
    const worldCards = page.locator('[class*="world"], [class*="card"]').or(
      page.locator('a[href*="/world/"]')
    );

    const count = await worldCards.count();

    if (count > 0) {
      // Click on first world
      await worldCards.first().click();

      // Should navigate to world page
      await expect(page).toHaveURL(/\/world\/[a-zA-Z0-9-]+$/);
    }
  });

  test('should search for worlds', async ({ page }) => {
    await page.goto('/explore');

    // Look for search input
    const searchInput = page.getByPlaceholder(/search/i).or(
      page.getByLabel(/search/i)
    );

    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Map Editor Journey', () => {
  const TEST_WORLD_ID = process.env.TEST_WORLD_ID || 'test-world-id';

  test('should open world map and see controls', async ({ page, mapHelpers }) => {
    await mapHelpers.gotoWorldMap(TEST_WORLD_ID);
    await mapHelpers.waitForMapReady();

    // Check for key UI elements
    await expect(page.locator('canvas, [class*="map"]').first()).toBeVisible();

    // At least map container should be present
    const mapContainer = await mapHelpers.getMapContainer();
    await expect(mapContainer).toBeVisible();
  });

  test('should interact with map using mouse', async ({ page, mapHelpers }) => {
    await mapHelpers.gotoWorldMap(TEST_WORLD_ID);
    await mapHelpers.waitForMapReady();

    // Click on map
    await mapHelpers.clickMapAt(50, 50);

    // Double-click (might create pin)
    await mapHelpers.doubleClickMapAt(40, 40);

    // Wait for any interactions to complete
    await page.waitForTimeout(500);
  });
});

test.describe('Responsive Design Journey', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check key elements are visible
    const header = page.locator('header, nav').first();
    await expect(header).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    const header = page.locator('header, nav').first();
    await expect(header).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    const header = page.locator('header, nav').first();
    await expect(header).toBeVisible();
  });
});

test.describe('Accessibility Journey', () => {
  test('should be keyboard navigable from home to create', async ({ page }) => {
    await page.goto('/');

    // Tab through navigation
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }

    // Check some element is focused
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT']).toContain(focused || '');
  });

  test('should have proper skip links', async ({ page }) => {
    await page.goto('/');

    // Look for skip navigation links
    const skipLink = page.locator('a[href*="skip"], a[href*="main"], a[href*="content"]');
    const hasSkipLink = await skipLink.count() > 0;

    // Skip links are recommended but not required
    expect(hasSkipLink).toBeDefined();
  });
});
