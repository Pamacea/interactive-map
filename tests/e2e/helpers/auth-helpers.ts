/**
 * Authentication Helpers for E2E Tests
 *
 * Utilities for managing authentication state in tests.
 * Note: Since this app uses OAuth (GitHub/Discord), true auth testing
 * requires mocking or using test accounts. These helpers provide the
 * structure for auth flows.
 */

import { Page } from '@playwright/test';

export class AuthHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to sign in page
   */
  async gotoSignIn() {
    await this.page.goto('/auth/signin');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    // Check for authenticated user indicators
    // This will depend on your app's auth state representation
    const url = this.page.url();
    return !url.includes('/auth/signin') && !url.includes('/auth/register');
  }

  /**
   * Click GitHub sign in button
   * Note: This will redirect to GitHub OAuth
   * For true E2E tests, you would need to:
   * 1. Use a test GitHub account
   * 2. Mock the OAuth flow
   * 3. Use session storage to simulate auth
   */
  async clickGitHubSignIn() {
    const button = this.page.getByRole('button', { name: /continue with github/i });
    await button.click();
  }

  /**
   * Click Discord sign in button
   */
  async clickDiscordSignIn() {
    const button = this.page.getByRole('button', { name: /continue with discord/i });
    await button.click();
  }

  /**
   * Simulate authentication by setting session storage
   * This is a helper for testing authenticated routes without real OAuth
   */
  async mockAuthSession(userId: string = 'test-user-id') {
    await this.page.evaluate((id) => {
      // Set a mock session in localStorage or sessionStorage
      sessionStorage.setItem('next-auth.session-token', `mock-token-${id}`);
    }, userId);
  }

  /**
   * Clear authentication session
   */
  async clearAuthSession() {
    await this.page.evaluate(() => {
      sessionStorage.clear();
      localStorage.clear();
    });
  }

  /**
   * Sign out (if sign out functionality exists)
   */
  async signOut() {
    // Look for sign out button/link and click it
    const signOutButton = this.page.getByRole('button', { name: /sign out|logout|log out/i });
    if (await signOutButton.isVisible()) {
      await signOutButton.click();
    }
  }
}

/**
 * Create auth helpers for a page
 */
export function createAuthHelpers(page: Page): AuthHelpers {
  return new AuthHelpers(page);
}
