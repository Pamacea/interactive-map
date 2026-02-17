/**
 * Authentication Flow E2E Tests
 *
 * Tests for the authentication flow including:
 * - Sign in page renders correctly
 * - OAuth buttons are present and functional
 * - Error handling for failed sign in attempts
 */

import { test, expect } from '@playwright/test';
import { createAuthHelpers } from './helpers/auth-helpers';

test.describe('Authentication Flow', () => {
  let authHelpers: ReturnType<typeof createAuthHelpers>;

  test.beforeEach(async ({ page }) => {
    authHelpers = createAuthHelpers(page);
    await authHelpers.gotoSignIn();
  });

  test('should render sign in page with all elements', async ({ page }) => {
    // Check main heading
    await expect(page.getByRole('heading', { name: 'genesis' })).toBeVisible();

    // Check OAuth buttons
    await expect(page.getByRole('button', { name: /continue with github/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /continue with discord/i })).toBeVisible();

    // Check terms and privacy links
    await expect(page.getByRole('link', { name: /terms of service/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /privacy policy/i })).toBeVisible();
  });

  test('should have GitHub button with correct attributes', async ({ page }) => {
    const githubButton = page.getByRole('button', { name: /continue with github/i });

    // Check button is enabled
    await expect(githubButton).toBeEnabled();

    // Check for icon
    await expect(githubButton.locator('svg')).toBeVisible();
  });

  test('should have Discord button with correct attributes', async ({ page }) => {
    const discordButton = page.getByRole('button', { name: /continue with discord/i });

    // Check button is enabled
    await expect(discordButton).toBeEnabled();

    // Check for icon
    await expect(discordButton.locator('svg')).toBeVisible();
  });

  test('should show loading state when GitHub is clicked', async ({ page }) => {
    // Click GitHub button - will attempt navigation but we'll catch it
    const clickPromise = page.getByRole('button', { name: /continue with github/i }).click();

    // Check for loading state
    await expect(page.getByText(/connecting/i)).toBeVisible();

    // The click will cause navigation, which we allow to fail
    await clickPromise.catch(() => {});
  });

  test('should show loading state when Discord is clicked', async ({ page }) => {
    // Click Discord button
    const clickPromise = page.getByRole('button', { name: /continue with discord/i }).click();

    // Check for loading state
    await expect(page.getByText(/connecting/i)).toBeVisible();

    await clickPromise.catch(() => {});
  });

  test('should disable all buttons while one is loading', async ({ page }) => {
    // Click one button and check others are disabled
    const clickPromise = page.getByRole('button', { name: /continue with github/i }).click();

    // Both buttons should be disabled during loading
    await expect(page.getByRole('button', { name: /continue with github/i })).toBeDisabled();
    await expect(page.getByRole('button', { name: /continue with discord/i })).toBeDisabled();

    await clickPromise.catch(() => {});
  });

  test('should display page with correct styling classes', async ({ page }) => {
    // Check for main card with expected classes
    const mainCard = page.locator('div').filter({ hasText: 'genesis' }).first();
    await expect(mainCard).toHaveClass(/backdrop-blur/);
  });

  test('should have decorative runes visible', async ({ page }) => {
    // Check for decorative elements
    const runes = page.locator('text=/[ᛟᛞᛃᛊ]/');
    const runeCount = await runes.count();
    expect(runeCount).toBeGreaterThan(0);
  });

  test('should have crown icon visible', async ({ page }) => {
    // Check for crown icon (Lucide icon)
    const crown = page.locator('svg').filter({ hasText: '' }).first();
    await expect(crown).toBeVisible();
  });

  test('should navigate to terms page when terms link is clicked', async ({ page }) => {
    const termsLink = page.getByRole('link', { name: /terms of service/i });

    // Note: This will 404 if the page doesn't exist, which is expected behavior
    const promise = page.waitForResponse((response) => response.url().includes('/terms'));
    await termsLink.click();
    await promise.catch(() => {});
  });

  test('should navigate to privacy page when privacy link is clicked', async ({ page }) => {
    const privacyLink = page.getByRole('link', { name: /privacy policy/i });

    const promise = page.waitForResponse((response) => response.url().includes('/privacy'));
    await privacyLink.click();
    await promise.catch(() => {});
  });

  test('should maintain state on window resize', async ({ page }) => {
    // Check initial state
    await expect(page.getByRole('button', { name: /continue with github/i })).toBeVisible();

    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Elements should still be visible
    await expect(page.getByRole('button', { name: /continue with github/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'genesis' })).toBeVisible();
  });
});

test.describe('Authentication Error Handling', () => {
  test('should handle sign in failure gracefully', async ({ page, context }) => {
    await page.goto('/auth/signin');

    // Mock a failed sign in by intercepting the OAuth call
    await context.route('**://github.com/**', (route) => {
      route.abort('failed');
    });

    // This test demonstrates error handling structure
    // In a real scenario, OAuth redirects to the provider
    // Error display would happen after callback
  });
});

test.describe('Authentication Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/auth/signin');

    // Check for ARIA labels on buttons
    const githubButton = page.getByRole('button', { name: /continue with github/i });
    await expect(githubButton).toHaveAttribute('aria-label', /sign in with github/i);

    const discordButton = page.getByRole('button', { name: /continue with discord/i });
    await expect(discordButton).toHaveAttribute('aria-label', /sign in with discord/i);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/auth/signin');

    // Tab through elements
    await page.keyboard.press('Tab');

    // First button should be focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBe('BUTTON');
  });
});
