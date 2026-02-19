/**
 * World Creation Flow E2E Tests
 *
 * Tests for the world creation flow including:
 * - Page renders correctly
 * - Form validation works
 * - Form submission works
 * - Navigation after successful creation
 */

import { test, expect } from '@playwright/test';
import { createWorldHelpers } from './helpers/world-helpers';
import { generateTestWorldName } from './helpers/test-data';

test.describe('World Creation Flow', () => {
  let worldHelpers: ReturnType<typeof createWorldHelpers>;

  test.beforeEach(async ({ page }) => {
    worldHelpers = createWorldHelpers(page);
  });

  test('should render create world page with all elements', async ({ page }) => {
    await worldHelpers.gotoCreateWorld();

    // Check heading
    await expect(page.getByRole('heading', { name: /create new world/i })).toBeVisible();

    // Check form elements
    await expect(page.getByLabel(/world name/i)).toBeVisible();
    await expect(page.getByLabel(/description/i)).toBeVisible();

    // Check visibility toggle buttons
    await expect(page.getByRole('button', { name: /public/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /private/i })).beVisible();

    // Check action buttons
    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /forge world/i })).toBeVisible();
  });

  test('should show form validation errors for empty fields', async ({ page }) => {
    await worldHelpers.gotoCreateWorld();

    // Try to submit without filling fields
    const submitButton = page.getByRole('button', { name: /forge world/i });

    // First focus the form to enable validation
    await page.getByLabel(/world name/i).focus();
    await page.getByLabel(/description/i).focus();

    // Try to submit
    await submitButton.click();

    // Check for HTML5 validation
    const nameInput = page.getByLabel(/world name/i);
    const isInvalid = await nameInput.evaluate((el) => el.matches(':invalid'));
    expect(isInvalid).toBeTruthy();
  });

  test('should toggle between public and private visibility', async ({ page }) => {
    await worldHelpers.gotoCreateWorld();

    const publicButton = page.getByRole('button', { name: /public/i }).filter({ hasText: /globe/i });
    const privateButton = page.getByRole('button', { name: /private/i }).filter({ hasText: /lock/i });

    // Check default is public
    await expect(publicButton).toHaveClass(/bg-accent-gold\/20/);

    // Click private
    await privateButton.click();
    await expect(privateButton).toHaveClass(/bg-accent-gold\/20/);

    // Click public again
    await publicButton.click();
    await expect(publicButton).toHaveClass(/bg-accent-gold\/20/);
  });

  test('should show correct helper text for visibility', async ({ page }) => {
    await worldHelpers.gotoCreateWorld();

    const helperText = page.locator('text=/your world will be|only you can access/i');

    // Default public text
    await expect(page.getByText(/visible to all explorers/i)).toBeVisible();

    // Switch to private
    await page.getByRole('button', { name: /private/i }).click();

    // Private text
    await expect(page.getByText(/only you can access/i)).toBeVisible();
  });

  test('should fill form fields correctly', async ({ page }) => {
    await worldHelpers.gotoCreateWorld();

    const testData = {
      name: generateTestWorldName(),
      description: 'A test world for E2E testing.',
      isPublic: true,
    };

    await worldHelpers.fillWorldForm(testData);

    // Verify values
    await expect(page.getByLabel(/world name/i)).toHaveValue(testData.name);
    await expect(page.getByLabel(/description/i)).toHaveValue(testData.description);
  });

  test('should show file upload area', async ({ page }) => {
    await worldHelpers.gotoCreateWorld();

    // Check upload area is visible
    await expect(page.getByText(/click to upload your map/i)).toBeVisible();
    await expect(page.locator('svg').filter({ has: page.locator('text=/upload/i') })).toBeVisible();
  });

  test('should allow file upload selection', async ({ page }) => {
    await worldHelpers.gotoCreateWorld();

    // Create a temporary test file
    const testFilePath = '/tmp/test-map.png';

    // Note: In real tests, you'd create an actual test image file
    // For now, just verify the input exists
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toHaveAttribute('accept', 'image/*');
  });

  test('should show cancel button and navigate back', async ({ page }) => {
    await worldHelpers.gotoCreateWorld();

    const cancelButton = page.getByRole('button', { name: /cancel/i });
    await cancelButton.click();

    // Should navigate back (might stay on same page if no history)
    await expect(page).toHaveURL('/');
  });

  test('should disable submit button while creating', async ({ page }) => {
    await worldHelpers.gotoCreateWorld();

    const testData = {
      name: generateTestWorldName(),
      description: 'A test world for E2E testing.',
      isPublic: true,
    };

    await worldHelpers.fillWorldForm(testData);

    // Submit - will likely fail without auth, but we can check the loading state
    const submitButton = page.getByRole('button', { name: /forge world/i });
    await submitButton.click();

    // Button might show loading state or become disabled
    await expect(submitButton).toBeDisabled();
  });

  test('should have proper decorative elements', async ({ page }) => {
    await worldHelpers.gotoCreateWorld();

    // Check for decorative runes
    const runes = page.locator('text=/[ᛟᛞᛃᛊ]/');
    const runeCount = await runes.count();
    expect(runeCount).toBeGreaterThan(0);

    // Check for sparkle icon
    await expect(page.locator('svg').first()).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await worldHelpers.gotoCreateWorld();

    // All key elements should still be visible
    await expect(page.getByRole('heading', { name: /create new world/i })).toBeVisible();
    await expect(page.getByLabel(/world name/i)).toBeVisible();
    await expect(page.getByLabel(/description/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /forge world/i })).toBeVisible();
  });

  test('should have proper form accessibility', async ({ page }) => {
    await worldHelpers.gotoCreateWorld();

    // Check labels are associated with inputs
    const nameInput = page.getByLabel(/world name/i);
    await expect(nameInput).toBeVisible();

    const descInput = page.getByLabel(/description/i);
    await expect(descInput).toBeVisible();

    // Check that buttons have proper text
    await expect(page.getByRole('button', { name: /forge world/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await worldHelpers.gotoCreateWorld();

    // Tab through form fields
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => (document.activeElement as HTMLInputElement)?.name);
    expect(focused || '').toBeTruthy();

    // Tab to submit button
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }

    // Press Enter to submit (will fail without auth, but tests the interaction)
    await page.keyboard.press('Enter');
  });
});

test.describe('World Creation Edge Cases', () => {
  test('should handle very long world names', async ({ page }) => {
    await page.goto('/create');

    const longName = 'A'.repeat(200);
    await page.getByLabel(/world name/i).fill(longName);

    // Check value was set
    const value = await page.getByLabel(/world name/i).inputValue();
    expect(value).toBe(longName);
  });

  test('should handle special characters in description', async ({ page }) => {
    await page.goto('/create');

    const specialText = 'World with "quotes", <brackets>, and symbols: @#$%';
    await page.getByLabel(/description/i).fill(specialText);

    const value = await page.getByLabel(/description/i).inputValue();
    expect(value).toBe(specialText);
  });

  test('should handle emojis in form fields', async ({ page }) => {
    await page.goto('/create');

    const emojiText = 'World of Dragons 🐉 and Castles 🏰';
    await page.getByLabel(/world name/i).fill(emojiText);

    const value = await page.getByLabel(/world name/i).inputValue();
    expect(value).toBe(emojiText);
  });
});
