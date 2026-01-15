/**
 * Pin Marker Sub-Components
 *
 * Atomic components and hooks for pin marker rendering.
 * Extracted from the monolithic 430-line pin-marker.tsx.
 *
 * Architecture:
 * - UI Components: Pure presentational components
 * - Logic Hooks: Custom hooks for state management
 * - Utility Hooks: Calculation and styling helpers
 *
 * NOTE: Main PinMarker and MemoizedPinMarker are exported from ../pin-marker.tsx
 * to avoid circular dependencies. This file only exports the atomic sub-components.
 */

// UI Components
export { MarkerContainer } from "./marker-container";
export { MarkerIcon } from "./marker-icon";
export { MarkerSelectionRing } from "./marker-selection-ring";

// Logic Hooks
export { useMarkerVisibility } from "./use-marker-visibility";
export { useMarkerStyling } from "./use-marker-styling";
