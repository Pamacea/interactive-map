/**
 * Accessibility Hooks
 *
 * Collection of React hooks for implementing accessibility features:
 * - Focus management (trap, return)
 * - Keyboard navigation
 * - Screen reader announcements
 */

export { useFocusTrap } from './use-focus-trap';
export { useFocusReturn, useFocusManagement } from './use-focus-return';
export { useKeyboardNav, useMapKeyboardNav, MAP_SHORTCUTS } from './use-keyboard-nav';
export { useAnnounce, useLiveRegion, announce } from './use-announce';
