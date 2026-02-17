/**
 * World Creation Helpers for E2E Tests
 *
 * Utilities for testing world creation and management flows.
 */

import { Page, expect } from '@playwright/test';
import { createTestWorld } from './test-data';

export class WorldHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to create world page
   */
  async gotoCreateWorld() {
    await this.page.goto('/create');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill in world creation form
   */
  async fillWorldForm(data: {
    name: string;
    description: string;
    isPublic: boolean;
  }) {
    // Fill world name
    await this.page.getByLabel(/world name/i).fill(data.name);

    // Fill description
    await this.page.getByLabel(/description/i).fill(data.description);

    // Set visibility
    const visibilityButton = data.isPublic
      ? this.page.getByRole('button', { name: /public/i }).filter({ hasText: /globe/i })
      : this.page.getByRole('button', { name: /private/i }).filter({ hasText: /lock/i });

    await visibilityButton.click();
  }

  /**
   * Submit the world creation form
   */
  async submitWorldForm() {
    const submitButton = this.page.getByRole('button', { name: /forge world/i });
    await submitButton.click();
  }

  /**
   * Create a complete world with form fill and submission
   */
  async createWorld(data?: {
    name?: string;
    description?: string;
    isPublic?: boolean;
  }) {
    const worldData = createTestWorld(data);

    await this.gotoCreateWorld();
    await this.fillWorldForm(worldData);
    await this.submitWorldForm();

    return worldData;
  }

  /**
   * Wait for navigation to world page after creation
   */
  async waitForWorldPage(): Promise<string> {
    await this.page.waitForURL(/\/world\/[a-zA-Z0-9-]+$/);
    const url = this.page.url();
    const match = url.match(/\/world\/([a-zA-Z0-9-]+)$/);
    return match ? match[1] : '';
  }

  /**
   * Cancel world creation
   */
  async cancelCreation() {
    const cancelButton = this.page.getByRole('button', { name: /cancel/i });
    await cancelButton.click();
  }

  /**
   * Check if form validation errors are shown
   */
  async expectValidationErrors(): Promise<void> {
    // Check for required field errors
    const nameInput = this.page.getByLabel(/world name/i);
    await expect(nameInput).toBeFocused();

    // Browser's built-in validation
    const isInvalid = await nameInput.evaluate((el) => el.matches(':invalid'));
    expect(isInvalid).toBeTruthy();
  }

  /**
   * Upload a map image
   * Note: For E2E tests, use a small test image
   */
  async uploadMapImage(filePath: string) {
    // Click the upload area
    const uploadArea = this.page.getByText(/click to upload your map/i);
    await uploadArea.click();

    // Set the file input
    const fileInput = this.page.getByLabel(/map image/i).or(
      this.page.locator('input[type="file"]')
    );
    await fileInput.setInputFiles(filePath);
  }

  /**
   * Check if world creation is in progress
   */
  async isCreating(): Promise<boolean> {
    const submitButton = this.page.getByRole('button', { name: /forging/i });
    return await submitButton.isVisible();
  }
}

/**
 * Create world helpers for a page
 */
export function createWorldHelpers(page: Page): WorldHelpers {
  return new WorldHelpers(page);
}
