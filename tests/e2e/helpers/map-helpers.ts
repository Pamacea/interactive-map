/**
 * Map Interaction Helpers for E2E Tests
 *
 * Utilities for testing map editor interactions.
 */

import { Page, expect } from '@playwright/test';
import { testPins } from './test-data';

export class MapHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to a specific world map
   */
  async gotoWorldMap(worldId: string) {
    await this.page.goto(`/world/${worldId}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for map canvas to be ready
   */
  async waitForMapReady(): Promise<void> {
    // Wait for map container to be visible
    const mapContainer = this.page.locator('canvas').or(
      this.page.locator('[class*="map"]')
    );
    await expect(mapContainer.first()).toBeVisible({ timeout: 10000 });
  }

  /**
   * Click on the map at a specific position (relative percentage)
   * @param xPercent - X position as percentage of map width (0-100)
   * @param yPercent - Y position as percentage of map height (0-100)
   */
  async clickMapAt(xPercent: number, yPercent: number): Promise<void> {
    const mapContainer = await this.getMapContainer();
    const box = await mapContainer.boundingBox();

    if (!box) {
      throw new Error('Map container not found or has no dimensions');
    }

    const x = box.x + (box.width * xPercent) / 100;
    const y = box.y + (box.height * yPercent) / 100;

    await this.page.mouse.click(x, y);
  }

  /**
   * Double click on the map (often used to create pins)
   */
  async doubleClickMapAt(xPercent: number, yPercent: number): Promise<void> {
    const mapContainer = await this.getMapContainer();
    const box = await mapContainer.boundingBox();

    if (!box) {
      throw new Error('Map container not found or has no dimensions');
    }

    const x = box.x + (box.width * xPercent) / 100;
    const y = box.y + (box.height * yPercent) / 100;

    await this.page.mouse.dblclick(x, y);
  }

  /**
   * Get the map container element
   */
  async getMapContainer() {
    return this.page.locator('canvas').or(
      this.page.locator('[class*="map"]').first()
    );
  }

  /**
   * Check if a pin is visible on the map
   */
  async isPinVisible(pinName?: string): Promise<boolean> {
    const pin = pinName
      ? this.page.locator(`[data-pin-id]`).filter({ hasText: pinName })
      : this.page.locator(`[data-pin-id]`).first();

    return await pin.isVisible().catch(() => false);
  }

  /**
   * Click on a pin
   */
  async clickPin(pinName?: string): Promise<void> {
    const pin = pinName
      ? this.page.locator(`[data-pin-id]`).filter({ hasText: pinName })
      : this.page.locator(`[data-pin-id]`).first();

    await expect(pin).toBeVisible();
    await pin.click();
  }

  /**
   * Check if pin popup/form is visible
   */
  async isPinPopupVisible(): Promise<boolean> {
    const popup = this.page.locator('[class*="popup"]').or(
      this.page.locator('[class*="pin-form"]')
    );
    return await popup.isVisible().catch(() => false);
  }

  /**
   * Fill in pin creation form
   */
  async fillPinForm(data: {
    name: string;
    description: string;
    type?: string;
  }): Promise<void> {
    // Name field
    const nameInput = this.page.getByLabel(/name/i).or(
      this.page.locator('input[placeholder*="name"]')
    );
    await nameInput.fill(data.name);

    // Description field
    const descInput = this.page.getByLabel(/description/i).or(
      this.page.locator('textarea[placeholder*="description"]')
    );
    await descInput.fill(data.description);

    // Type selection (if provided)
    if (data.type) {
      const typeSelect = this.page.getByLabel(/type/i).or(
        this.page.locator('[class*="type"]')
      );
      await typeSelect.click();
      await this.page.getByRole('option', { name: data.type }).click();
    }
  }

  /**
   * Submit pin form
   */
  async submitPinForm(): Promise<void> {
    const submitButton = this.page.getByRole('button', { name: /save|create|add/i });
    await submitButton.click();
  }

  /**
   * Cancel pin form
   */
  async cancelPinForm(): Promise<void> {
    const cancelButton = this.page.getByRole('button', { name: /cancel|close/i });
    await cancelButton.click();
  }

  /**
   * Create a pin at a specific map location
   */
  async createPinAt(
    xPercent: number,
    yPercent: number,
    pinData = testPins.city
  ): Promise<void> {
    await this.doubleClickMapAt(xPercent, yPercent);
    await expect(await this.isPinPopupVisible()).toBeTruthy();

    await this.fillPinForm(pinData);
    await this.submitPinForm();

    // Wait for pin to be created
    await this.page.waitForTimeout(500);
  }

  /**
   * Drag a pin to a new location
   */
  async dragPin(
    fromXPercent: number,
    fromYPercent: number,
    toXPercent: number,
    toYPercent: number
  ): Promise<void> {
    const mapContainer = await this.getMapContainer();
    const box = await mapContainer.boundingBox();

    if (!box) {
      throw new Error('Map container not found or has no dimensions');
    }

    const fromX = box.x + (box.width * fromXPercent) / 100;
    const fromY = box.y + (box.height * fromYPercent) / 100;
    const toX = box.x + (box.width * toXPercent) / 100;
    const toY = box.y + (box.height * toYPercent) / 100;

    await this.page.mouse.move(fromX, fromY);
    await this.page.mouse.down();
    await this.page.mouse.move(toX, toY, { steps: 10 });
    await this.page.mouse.up();
  }

  /**
   * Get the current zoom level from the page
   */
  async getZoomLevel(): Promise<number> {
    const zoomValue = await this.page.evaluate(() => {
      // This depends on how your map stores zoom state
      const mapContainer = document.querySelector('[class*="map"]');
      return mapContainer?.getAttribute('data-zoom') || '1';
    });
    return parseFloat(zoomValue);
  }

  /**
   * Check if the map is in fullscreen mode
   */
  async isFullscreen(): Promise<boolean> {
    return await this.page.evaluate(() => {
      return !!document.fullscreenElement;
    });
  }

  /**
   * Count visible pins on the map
   */
  async countVisiblePins(): Promise<number> {
    return await this.page.locator(`[data-pin-id]`).count();
  }
}

/**
 * Create map helpers for a page
 */
export function createMapHelpers(page: Page): MapHelpers {
  return new MapHelpers(page);
}
