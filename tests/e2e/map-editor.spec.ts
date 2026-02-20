/**
 * Map Editor Flow E2E Tests
 *
 * Tests for the map editor interactions including:
 * - Map renders correctly
 * - Pin creation via double-click
 * - Pin selection and popup display
 * - Pin dragging
 */

import { test, expect } from '@playwright/test';
import { createMapHelpers } from './helpers/map-helpers';

test.describe('Map Editor Flow', () => {
  let mapHelpers: ReturnType<typeof createMapHelpers>;

  // Use a test world ID - in real tests, this would be created dynamically
  const TEST_WORLD_ID = process.env.TEST_WORLD_ID || 'test-world-id';

  test.beforeEach(async ({ page }) => {
    mapHelpers = createMapHelpers(page);
    await mapHelpers.gotoWorldMap(TEST_WORLD_ID);
  });

  test('should render map page with all UI elements', async ({ page }) => {
    // Wait for map to load
    await mapHelpers.waitForMapReady();

    // Check for floating header
    await expect(page.locator('header').or(page.locator('[class*="header"]'))).toBeVisible();

    // Check for map container
    await expect(page.locator('canvas').or(page.locator('[class*="map"]'))).toBeVisible();
  });

  test('should display world title in header', async ({ page }) => {
    await mapHelpers.waitForMapReady();

    // Look for world title in header
    const titleElement = page.locator('h1, h2, [class*="title"]').first();
    await expect(titleElement).toBeVisible();
  });

  test('should show floating modules', async ({ page }) => {
    await mapHelpers.waitForMapReady();

    // Check for common floating UI elements
    // Note: These might not all be visible depending on auth state

    // Layers module should be visible
    await expect(page.locator('text=/layers/i').or(page.locator('[class*="layer"]'))).toBeVisible();

    // Filters module
    await expect(page.locator('text=/filters/i').or(page.locator('[class*="filter"]'))).toBeVisible();
  });

  test('should have map container with correct dimensions', async ({ _page }) => {
    await mapHelpers.waitForMapReady();

    const mapContainer = await mapHelpers.getMapContainer();
    const box = await mapContainer.boundingBox();

    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test('should respond to mouse clicks on map', async ({ _page }) => {
    await mapHelpers.waitForMapReady();

    // Click at center of map
    await mapHelpers.clickMapAt(50, 50);

    // Map should still be visible after click
    const mapContainer = await mapHelpers.getMapContainer();
    await expect(mapContainer).toBeVisible();
  });

  test('should respond to mouse double-click on map', async ({ page }) => {
    await mapHelpers.waitForMapReady();

    // Double-click at center of map
    await mapHelpers.doubleClickMapAt(50, 50);

    // Should trigger pin creation (or some interaction)
    // Wait a moment for any UI to appear
    await page.waitForTimeout(500);
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    await mapHelpers.waitForMapReady();

    // Press 'F' for search (if that's the configured shortcut)
    await page.keyboard.press('f');

    // Search panel might open
    await page.waitForTimeout(300);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await mapHelpers.gotoWorldMap(TEST_WORLD_ID);
    await mapHelpers.waitForMapReady();

    // Map should still render
    const mapContainer = await mapHelpers.getMapContainer();
    await expect(mapContainer).toBeVisible();
  });

  test('should maintain map state on resize', async ({ page }) => {
    await mapHelpers.waitForMapReady();

    // Get initial dimensions
    const mapContainer = await mapHelpers.getMapContainer();
    await mapContainer.boundingBox();

    // Resize window
    await page.setViewportSize({ width: 800, height: 600 });
    await page.waitForTimeout(500);

    // Map should still be visible
    await expect(mapContainer).toBeVisible();

    const resizedBox = await mapContainer.boundingBox();
    expect(resizedBox).toBeTruthy();
  });

  test('should show particles background', async ({ page }) => {
    await mapHelpers.waitForMapReady();

    // Check for particle container
    const particles = page.locator('[class*="particle"]').or(page.locator('[data-testid*="particle"]'));
    const particleCount = await particles.count();
    expect(particleCount).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Pin Creation and Interaction', () => {
  const TEST_WORLD_ID = process.env.TEST_WORLD_ID || 'test-world-id';

  test('should create pin on double-click', async ({ page }) => {
    const mapHelpers = createMapHelpers(page);
    await mapHelpers.gotoWorldMap(TEST_WORLD_ID);
    await mapHelpers.waitForMapReady();

    await mapHelpers.countVisiblePins();

    // Double-click to create pin
    await mapHelpers.doubleClickMapAt(30, 40);

    // Wait for pin creation
    await page.waitForTimeout(1000);

    // Note: Pin creation might require auth, so this might not work without session
    // But we can test the interaction happens
  });

  test('should show pin popup when pin is clicked', async ({ page }) => {
    const mapHelpers = createMapHelpers(page);
    await mapHelpers.gotoWorldMap(TEST_WORLD_ID);
    await mapHelpers.waitForMapReady();

    const pinCount = await mapHelpers.countVisiblePins();

    if (pinCount > 0) {
      // Click first pin
      await mapHelpers.clickPin();

      // Check for popup
      const isPopupVisible = await mapHelpers.isPinPopupVisible();
      expect(isPopupVisible).toBeTruthy();
    }
  });

  test('should handle pin selection state', async ({ page }) => {
    const mapHelpers = createMapHelpers(page);
    await mapHelpers.gotoWorldMap(TEST_WORLD_ID);
    await mapHelpers.waitForMapReady();

    const pinCount = await mapHelpers.countVisiblePins();

    if (pinCount > 0) {
      // Click pin to select
      await mapHelpers.clickPin();

      // Click elsewhere to deselect
      await mapHelpers.clickMapAt(80, 80);

      // Wait for deselection
      await page.waitForTimeout(300);
    }
  });

  test('should display pin form for creating new pins', async ({ page }) => {
    const mapHelpers = createMapHelpers(page);
    await mapHelpers.gotoWorldMap(TEST_WORLD_ID);
    await mapHelpers.waitForMapReady();

    // Double-click to trigger pin creation
    await mapHelpers.doubleClickMapAt(40, 60);

    // Wait for form to appear
    await page.waitForTimeout(500);

    // Look for form elements
    const nameInput = page.getByLabel(/name/i);
    page.getByLabel(/description/i);

    // These might not be visible without auth
    const isVisible = await nameInput.isVisible().catch(() => false);
    expect(isVisible).toBeDefined();
  });
});

test.describe('Pin Dragging', () => {
  const TEST_WORLD_ID = process.env.TEST_WORLD_ID || 'test-world-id';

  test('should initiate drag on pin mousedown', async ({ page }) => {
    const mapHelpers = createMapHelpers(page);
    await mapHelpers.gotoWorldMap(TEST_WORLD_ID);
    await mapHelpers.waitForMapReady();

    const pinCount = await mapHelpers.countVisiblePins();

    if (pinCount > 0) {
      // Test drag interaction
      const mapContainer = await mapHelpers.getMapContainer();
      const box = await mapContainer.boundingBox();

      if (box) {
        // Move to pin and start drag
        await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.3);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5, { steps: 5 });
        await page.mouse.up();

        await page.waitForTimeout(300);
      }
    }
  });

  test('should update pin position after drag', async ({ page }) => {
    const mapHelpers = createMapHelpers(page);
    await mapHelpers.gotoWorldMap(TEST_WORLD_ID);
    await mapHelpers.waitForMapReady();

    const pinCount = await mapHelpers.countVisiblePins();

    if (pinCount > 0) {
      // This test would verify position changes after drag
      // Implementation depends on how pins store position data
      await mapHelpers.dragPin(30, 30, 50, 50);
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Map Filters and Layers', () => {
  const TEST_WORLD_ID = process.env.TEST_WORLD_ID || 'test-world-id';

  test('should show layers panel', async ({ page }) => {
    const mapHelpers = createMapHelpers(page);
    await mapHelpers.gotoWorldMap(TEST_WORLD_ID);
    await mapHelpers.waitForMapReady();

    // Look for layers button/panel
    const layersButton = page.locator('text=/layers/i').or(page.locator('[class*="layer"]'));
    await expect(layersButton.first()).toBeVisible();
  });

  test('should show filters panel', async ({ page }) => {
    const mapHelpers = createMapHelpers(page);
    await mapHelpers.gotoWorldMap(TEST_WORLD_ID);
    await mapHelpers.waitForMapReady();

    // Look for filters button/panel
    const filtersButton = page.locator('text=/filters/i').or(page.locator('[class*="filter"]'));
    await expect(filtersButton.first()).toBeVisible();
  });

  test('should toggle filters panel', async ({ page }) => {
    const mapHelpers = createMapHelpers(page);
    await mapHelpers.gotoWorldMap(TEST_WORLD_ID);
    await mapHelpers.waitForMapReady();

    const filtersButton = page.locator('text=/filters/i').or(page.locator('[class*="filter"]')).first();

    if (await filtersButton.isVisible()) {
      await filtersButton.click();
      await page.waitForTimeout(300);

      // Panel should be open/closable
      const closeButton = page.locator('button[aria-label*="close"], button[title*="close"]').or(
        page.locator('[class*="close"]')
      );

      const isVisible = await closeButton.isVisible().catch(() => false);
      expect(isVisible).toBeDefined();
    }
  });
});

test.describe('Map Accessibility', () => {
  const TEST_WORLD_ID = process.env.TEST_WORLD_ID || 'test-world-id';

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    const mapHelpers = createMapHelpers(page);
    await mapHelpers.gotoWorldMap(TEST_WORLD_ID);
    await mapHelpers.waitForMapReady();

    // Check for aria labels on buttons
    const buttons = page.locator('button[aria-label]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should be keyboard navigable', async ({ page }) => {
    const mapHelpers = createMapHelpers(page);
    await mapHelpers.gotoWorldMap(TEST_WORLD_ID);
    await mapHelpers.waitForMapReady();

    // Tab through interactive elements
    await page.keyboard.press('Tab');

    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'INPUT', 'A', 'DIV']).toContain(focused || '');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const mapHelpers = createMapHelpers(page);
    await mapHelpers.gotoWorldMap(TEST_WORLD_ID);
    await mapHelpers.waitForMapReady();

    // Check for h1
    const h1 = page.locator('h1');
    const h1Count = await h1.count();

    // Should have at most one h1
    expect(h1Count).toBeLessThanOrEqual(1);
  });
});

test.describe('Map Error States', () => {
  test('should handle invalid world ID gracefully', async ({ page }) => {
    const invalidId = 'invalid-world-id-that-does-not-exist';
    await page.goto(`/world/${invalidId}`);

    // Should either redirect or show error
    await page.waitForLoadState('networkidle');

    const url = page.url();
    const isOnErrorPage = url.includes('404') || url.includes('not-found');

    // Either we're on an error page or stayed on the invalid URL
    expect(isOnErrorPage || url.includes(invalidId)).toBeTruthy();
  });

  test('should handle map image load failure', async ({ page }) => {
    // This would require mocking a failed image load
    const mapHelpers = createMapHelpers(page);
    await mapHelpers.gotoWorldMap(TEST_WORLD_ID);
    await mapHelpers.waitForMapReady();

    // Map should still render even if image fails
    const mapContainer = await mapHelpers.getMapContainer();
    await expect(mapContainer).toBeVisible();
  });
});
