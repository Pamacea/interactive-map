/**
 * Viewport Selectors - Optimized selectors for viewport state
 *
 * Provides memoized selectors for common viewport queries.
 * Use these to avoid unnecessary re-renders when accessing viewport data.
 */

import type { ViewportTransform } from "@/components/world/logic/use-viewport";

// ============================================================================
// Types
// ============================================================================

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

// ============================================================================
// Transform Selectors
// ============================================================================

/**
 * Get scale from transform
 */
export const selectScale = (transform: ViewportTransform): number =>
  transform.scale;

/**
 * Get translation from transform
 */
export const selectTranslation = (transform: ViewportTransform): { x: number; y: number } => ({
  x: transform.translateX,
  y: transform.translateY,
});

/**
 * Check if transform is at default (no zoom/pan)
 */
export const selectIsDefaultTransform = (transform: ViewportTransform): boolean =>
  transform.scale === 1 && transform.translateX === 0 && transform.translateY === 0;

/**
 * Check if transform is zoomed in
 */
export const selectIsZoomedIn = (transform: ViewportTransform): boolean =>
  transform.scale > 1;

/**
 * Check if transform is zoomed out
 */
export const selectIsZoomedOut = (transform: ViewportTransform): boolean =>
  transform.scale < 1;

// ============================================================================
// Coordinate Conversion Selectors
// ============================================================================

/**
 * Convert screen coordinates to world coordinates
 */
export const selectScreenToWorld = (
  transform: ViewportTransform,
  screenPoint: Point
): Point => ({
  x: (screenPoint.x - transform.translateX) / transform.scale,
  y: (screenPoint.y - transform.translateY) / transform.scale,
});

/**
 * Convert world coordinates to screen coordinates
 */
export const selectWorldToScreen = (
  transform: ViewportTransform,
  worldPoint: Point
): Point => ({
  x: worldPoint.x * transform.scale + transform.translateX,
  y: worldPoint.y * transform.scale + transform.translateY,
});

/**
 * Convert bounds from world to screen space
 */
export const selectWorldBoundsToScreen = (
  transform: ViewportTransform,
  worldBounds: Bounds
): Bounds => {
  const topLeft = selectWorldToScreen(transform, { x: worldBounds.minX, y: worldBounds.minY });
  const bottomRight = selectWorldToScreen(transform, { x: worldBounds.maxX, y: worldBounds.maxY });

  return {
    minX: Math.min(topLeft.x, bottomRight.x),
    minY: Math.min(topLeft.y, bottomRight.y),
    maxX: Math.max(topLeft.x, bottomRight.x),
    maxY: Math.max(topLeft.y, bottomRight.y),
  };
};

/**
 * Convert bounds from screen to world space
 */
export const selectScreenBoundsToWorld = (
  transform: ViewportTransform,
  screenBounds: Bounds
): Bounds => {
  const topLeft = selectScreenToWorld(transform, { x: screenBounds.minX, y: screenBounds.minY });
  const bottomRight = selectScreenToWorld(transform, { x: screenBounds.maxX, y: screenBounds.maxY });

  return {
    minX: Math.min(topLeft.x, bottomRight.x),
    minY: Math.min(topLeft.y, bottomRight.y),
    maxX: Math.max(topLeft.x, bottomRight.x),
    maxY: Math.max(topLeft.y, bottomRight.y),
  };
};

// ============================================================================
// Visibility Selectors
// ============================================================================

/**
 * Check if a world point is visible in the viewport
 */
export const selectIsWorldPointVisible = (
  transform: ViewportTransform,
  viewportSize: Size,
  worldPoint: Point
): boolean => {
  const screenPoint = selectWorldToScreen(transform, worldPoint);
  return (
    screenPoint.x >= 0 &&
    screenPoint.x <= viewportSize.width &&
    screenPoint.y >= 0 &&
    screenPoint.y <= viewportSize.height
  );
};

/**
 * Check if world bounds are visible in the viewport
 */
export const selectIsWorldBoundsVisible = (
  transform: ViewportTransform,
  viewportSize: Size,
  worldBounds: Bounds
): boolean => {
  const screenBounds = selectWorldBoundsToScreen(transform, worldBounds);
  return (
    screenBounds.maxX >= 0 &&
    screenBounds.minX <= viewportSize.width &&
    screenBounds.maxY >= 0 &&
    screenBounds.minY <= viewportSize.height
  );
};

/**
 * Get visible world bounds
 */
export const selectVisibleWorldBounds = (
  transform: ViewportTransform,
  viewportSize: Size
): Bounds => {
  const screenBounds: Bounds = {
    minX: 0,
    minY: 0,
    maxX: viewportSize.width,
    maxY: viewportSize.height,
  };
  return selectScreenBoundsToWorld(transform, screenBounds);
};

// ============================================================================
// Zoom Selectors
// ============================================================================

/**
 * Get zoom percentage (0-200)
 */
export const selectZoomPercentage = (transform: ViewportTransform): number =>
  Math.round(transform.scale * 100);

/**
 * Check if at min zoom
 */
export const selectIsAtMinZoom = (transform: ViewportTransform, minZoom = 0.1): boolean =>
  transform.scale <= minZoom;

/**
 * Check if at max zoom
 */
export const selectIsAtMaxZoom = (transform: ViewportTransform, maxZoom = 5): boolean =>
  transform.scale >= maxZoom;

/**
 * Check if can zoom in
 */
export const selectCanZoomIn = (transform: ViewportTransform, maxZoom = 5): boolean =>
  transform.scale < maxZoom;

/**
 * Check if can zoom out
 */
export const selectCanZoomOut = (transform: ViewportTransform, minZoom = 0.1): boolean =>
  transform.scale > minZoom;

/**
 * Calculate new zoom level with step
 */
export const selectZoomInLevel = (transform: ViewportTransform, step = 0.2, maxZoom = 5): number =>
  Math.min(transform.scale + step, maxZoom);

/**
 * Calculate new zoom level with step
 */
export const selectZoomOutLevel = (transform: ViewportTransform, step = 0.2, minZoom = 0.1): number =>
  Math.max(transform.scale - step, minZoom);

/**
 * Calculate zoom level to fit bounds
 */
export const selectZoomToFitBounds = (
  viewportSize: Size,
  bounds: Bounds,
  padding = 20
): number => {
  const boundsWidth = bounds.maxX - bounds.minX;
  const boundsHeight = bounds.maxY - bounds.minY;

  const scaleX = (viewportSize.width - padding * 2) / boundsWidth;
  const scaleY = (viewportSize.height - padding * 2) / boundsHeight;

  return Math.min(scaleX, scaleY, 5); // Cap at max zoom
};

/**
 * Calculate zoom level to fit size
 */
export const selectZoomToFitSize = (
  viewportSize: Size,
  contentSize: Size,
  padding = 20
): number => {
  const scaleX = (viewportSize.width - padding * 2) / contentSize.width;
  const scaleY = (viewportSize.height - padding * 2) / contentSize.height;

  return Math.min(scaleX, scaleY, 5); // Cap at max zoom
};

// ============================================================================
// Centering Selectors
// ============================================================================

/**
 * Get center point of viewport in screen coordinates
 */
export const selectViewportCenter = (viewportSize: Size): Point => ({
  x: viewportSize.width / 2,
  y: viewportSize.height / 2,
});

/**
 * Get center point of viewport in world coordinates
 */
export const selectWorldCenter = (
  transform: ViewportTransform,
  viewportSize: Size
): Point => {
  const screenCenter = selectViewportCenter(viewportSize);
  return selectScreenToWorld(transform, screenCenter);
};

/**
 * Calculate transform to center on world point
 */
export const selectCenterOnPointTransform = (
  currentTransform: ViewportTransform,
  viewportSize: Size,
  worldPoint: Point
): ViewportTransform => {
  const screenCenter = selectViewportCenter(viewportSize);
  return {
    scale: currentTransform.scale,
    translateX: screenCenter.x - worldPoint.x * currentTransform.scale,
    translateY: screenCenter.y - worldPoint.y * currentTransform.scale,
  };
};

/**
 * Calculate transform to center on bounds
 */
export const selectCenterOnBoundsTransform = (
  viewportSize: Size,
  bounds: Bounds,
  padding = 20
): ViewportTransform => {
  const boundsCenter = {
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2,
  };

  const zoom = selectZoomToFitBounds(viewportSize, bounds, padding);
  const screenCenter = selectViewportCenter(viewportSize);

  return {
    scale: zoom,
    translateX: screenCenter.x - boundsCenter.x * zoom,
    translateY: screenCenter.y - boundsCenter.y * zoom,
  };
};

// ============================================================================
// Pan Constraints Selectors
// ============================================================================

/**
 * Clamp translation to keep content within viewport
 */
export const selectClampedTranslation = (
  transform: ViewportTransform,
  viewportSize: Size,
  contentSize: Size
): { x: number; y: number } => {
  const { x, y } = selectTranslation(transform);

  // Calculate max translation based on content size and scale
  const maxTranslateX = Math.max(0, (contentSize.width * transform.scale - viewportSize.width) / 2);
  const maxTranslateY = Math.max(0, (contentSize.height * transform.scale - viewportSize.height) / 2);

  return {
    x: Math.max(-maxTranslateX, Math.min(maxTranslateX, x)),
    y: Math.max(-maxTranslateY, Math.min(maxTranslateY, y)),
  };
};

/**
 * Check if content is fully visible in viewport
 */
export const selectIsContentFullyVisible = (
  transform: ViewportTransform,
  viewportSize: Size,
  contentSize: Size
): boolean => {
  const scaledWidth = contentSize.width * transform.scale;
  const scaledHeight = contentSize.height * transform.scale;

  return scaledWidth <= viewportSize.width && scaledHeight <= viewportSize.height;
};

// ============================================================================
// Scale Option Selectors
// ============================================================================

export type ScaleOption = "1:1" | "1:10" | "1:100" | "1:1000" | "1:10000";

const SCALE_TO_ZOOM: Record<ScaleOption, number> = {
  "1:1": 4.0,
  "1:10": 2.0,
  "1:100": 1.0,
  "1:1000": 0.5,
  "1:10000": 0.25,
};

const ZOOM_TO_SCALE: Record<number, ScaleOption> = {
  4.0: "1:1",
  2.0: "1:10",
  1.0: "1:100",
  0.5: "1:1000",
  0.25: "1:10000",
};

/**
 * Get zoom level from scale option
 */
export const selectZoomFromScaleOption = (scaleOption: ScaleOption): number =>
  SCALE_TO_ZOOM[scaleOption];

/**
 * Get scale option from zoom level
 */
export const selectScaleOptionFromZoom = (zoom: number): ScaleOption =>
  ZOOM_TO_SCALE[zoom] ?? "1:100";

/**
 * Get nearest scale option for zoom level
 */
export const selectNearestScaleOption = (zoom: number): ScaleOption => {
  const options = Object.values(SCALE_TO_ZOOM);
  const nearest = options.reduce((prev, curr) =>
    Math.abs(curr - zoom) < Math.abs(prev - zoom) ? curr : prev
  );
  return selectScaleOptionFromZoom(nearest);
};

// ============================================================================
// Combined Selectors (for complex queries)
// ============================================================================

/**
 * Get complete viewport state summary
 */
export const selectViewportSummary = (
  transform: ViewportTransform,
  viewportSize: Size
) => ({
  scale: transform.scale,
  zoomPercent: selectZoomPercentage(transform),
  translate: selectTranslation(transform),
  isDefault: selectIsDefaultTransform(transform),
  isZoomedIn: selectIsZoomedIn(transform),
  isZoomedOut: selectIsZoomedOut(transform),
  canZoomIn: selectCanZoomIn(transform),
  canZoomOut: selectCanZoomOut(transform),
  center: selectWorldCenter(transform, viewportSize),
  visibleBounds: selectVisibleWorldBounds(transform, viewportSize),
});

/**
 * Get transform for animation (interpolated between current and target)
 */
export const selectInterpolatedTransform = (
  from: ViewportTransform,
  to: ViewportTransform,
  progress: number // 0-1
): ViewportTransform => ({
  scale: from.scale + (to.scale - from.scale) * progress,
  translateX: from.translateX + (to.translateX - from.translateX) * progress,
  translateY: from.translateY + (to.translateY - from.translateY) * progress,
});
