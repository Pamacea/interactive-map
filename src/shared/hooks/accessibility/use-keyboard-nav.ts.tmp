import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  handler: (event: KeyboardEvent) => void;
  description: string;
}

/**
 * useKeyboardNav - Register global keyboard shortcuts
 *
 * Provides keyboard navigation and shortcuts for the application.
 * Prevents default browser behavior when needed.
 *
 * @param shortcuts - Array of keyboard shortcuts
 * @param enabled - Whether shortcuts are active
 *
 * @example
 * ```tsx
 * useKeyboardNav([
 *   {
 *     key: 'k',
 *     ctrlKey: true,
 *     handler: () => alert('Cmd+K pressed'),
 *     description: 'Open command palette'
 *   },
 *   {
 *     key: 'Escape',
 *     handler: () => setIsModalOpen(false),
 *     description: 'Close modal'
 *   }
 * ], true);
 * ```
 */
export function useKeyboardNav(
  shortcuts: KeyboardShortcut[],
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is typing in an input
      const target = event.target as HTMLElement;
      const isInputTarget =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      // Find matching shortcut
      const matchedShortcut = shortcuts.find((shortcut) => {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.altKey ? event.altKey : !event.altKey;
        const metaMatch = shortcut.metaKey ? event.metaKey : !event.metaKey;

        return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch;
      });

      if (matchedShortcut) {
        // Allow shortcuts in inputs (like Escape to close)
        // but prevent others from triggering while typing
        if (isInputTarget && matchedShortcut.key !== 'Escape') {
          return;
        }

        event.preventDefault();
        matchedShortcut.handler(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, enabled]);
}

/**
 * Map-specific keyboard shortcuts for navigation
 */
export const MAP_SHORTCUTS = {
  ZOOM_IN: { key: '+', description: 'Zoom in' },
  ZOOM_OUT: { key: '-', description: 'Zoom out' },
  ZOOM_RESET: { key: '0', description: 'Reset zoom' },
  PAN_UP: { key: 'ArrowUp', description: 'Pan map up' },
  PAN_DOWN: { key: 'ArrowDown', description: 'Pan map down' },
  PAN_LEFT: { key: 'ArrowLeft', description: 'Pan map left' },
  PAN_RIGHT: { key: 'ArrowRight', description: 'Pan map right' },
  TOGGLE_SIDEBAR: { key: 'b', description: 'Toggle sidebar' },
  NEW_PIN: { key: 'p', description: 'Create new pin' },
  DELETE_PIN: { key: 'Delete', description: 'Delete selected pin' },
  ESCAPE: { key: 'Escape', description: 'Cancel / Close dialog' },
} as const;

/**
 * Helper to create map keyboard shortcuts
 */
export function useMapKeyboardNav(handlers: {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  onPan?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onToggleSidebar?: () => void;
  onNewPin?: () => void;
  onDeletePin?: () => void;
  onEscape?: () => void;
}, enabled: boolean = true) {
  const shortcuts: KeyboardShortcut[] = [];

  if (handlers.onZoomIn) {
    shortcuts.push({ ...MAP_SHORTCUTS.ZOOM_IN, handler: handlers.onZoomIn });
  }
  if (handlers.onZoomOut) {
    shortcuts.push({ ...MAP_SHORTCUTS.ZOOM_OUT, handler: handlers.onZoomOut });
  }
  if (handlers.onZoomReset) {
    shortcuts.push({ ...MAP_SHORTCUTS.ZOOM_RESET, handler: handlers.onZoomReset });
  }
  if (handlers.onPan) {
    shortcuts.push(
      { ...MAP_SHORTCUTS.PAN_UP, handler: () => handlers.onPan!('up') },
      { ...MAP_SHORTCUTS.PAN_DOWN, handler: () => handlers.onPan!('down') },
      { ...MAP_SHORTCUTS.PAN_LEFT, handler: () => handlers.onPan!('left') },
      { ...MAP_SHORTCUTS.PAN_RIGHT, handler: () => handlers.onPan!('right') }
    );
  }
  if (handlers.onToggleSidebar) {
    shortcuts.push({ ...MAP_SHORTCUTS.TOGGLE_SIDEBAR, handler: handlers.onToggleSidebar });
  }
  if (handlers.onNewPin) {
    shortcuts.push({ ...MAP_SHORTCUTS.NEW_PIN, handler: handlers.onNewPin });
  }
  if (handlers.onDeletePin) {
    shortcuts.push({ ...MAP_SHORTCUTS.DELETE_PIN, handler: handlers.onDeletePin });
  }
  if (handlers.onEscape) {
    shortcuts.push({ ...MAP_SHORTCUTS.ESCAPE, handler: handlers.onEscape });
  }

  useKeyboardNav(shortcuts, enabled);
}
