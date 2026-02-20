/**
 * Unified Keyboard Shortcuts Hook - Fixed Version
 *
 * Provides a simple way to register keyboard shortcuts
 * with proper scoping and conflict prevention.
 */

import { useEffect } from "react";
import { inputManager, INPUT_PRIORITY, isHTMLElement } from "@/lib/input-manager";

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  handler: (e: KeyboardEvent) => boolean;
  description?: string;
}

export interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
  scope?: "context-menu" | "popup" | "map-canvas" | "sidebar" | "input-field" | "none";
  ignoreInputFields?: boolean;
}

/**
 * Hook for registering keyboard shortcuts
 *
 * @example
 * useKeyboardShortcuts({
 *   shortcuts: [
 *     { key: "Escape", handler: () => onClose() },
 *     { key: "Delete", handler: () => onDelete() },
 *     { key: "s", ctrl: true, handler: () => onSave() },
 *   ],
 *   scope: "popup",
 * });
 */
export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
  scope = "popup",
  ignoreInputFields = true,
}: UseKeyboardShortcutsOptions): void {
  useEffect(() => {
    if (!enabled) return;

    const cleanup = inputManager.register({
      element: scope,
      priority: scope === "context-menu" ? INPUT_PRIORITY.CONTEXT_MENU :
                 scope === "popup" ? INPUT_PRIORITY.POPUP :
                 INPUT_PRIORITY.MAP_CANVAS,
      handlers: {
        keyboard: {
          down: (e: KeyboardEvent) => {
            // Check if we should ignore input fields
            if (ignoreInputFields && isHTMLElement(e.target)) {
              const target = e.target;
              if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
              ) {
                // Still handle Escape in input fields
                if (e.key !== "Escape") {
                  return false; // Let input handle other keys
                }
              }
            }

            // Find matching shortcut
            const shortcut = shortcuts.find((s) => {
              const keyMatch = s.key.toLowerCase() === e.key.toLowerCase();
              const ctrlMatch = s.ctrl === undefined || s.ctrl === e.ctrlKey;
              const shiftMatch = s.shift === undefined || s.shift === e.shiftKey;
              const altMatch = s.alt === undefined || s.alt === e.altKey;
              const metaMatch = s.meta === undefined || s.meta === e.metaKey;

              return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch;
            });

            if (shortcut) {
              return shortcut.handler(e); // Return handler result
            }

            return false; // Not handled, continue
          },
        },
        mouse: {}, // Empty mouse handlers - this hook only handles keyboard
      },
      enabled: () => enabled,
    });

    return cleanup;
  }, [shortcuts, enabled, scope, ignoreInputFields]);
}

/**
 * Predefined shortcut sets for common UI patterns
 */
export const COMMON_SHORTCUTS = {
  CLOSE: { key: "Escape", description: "Close" },
  CONFIRM: { key: "Enter", description: "Confirm" },
  DELETE: { key: "Delete", description: "Delete" },
  SAVE: { key: "s", ctrl: true, description: "Save" },
  UNDO: { key: "z", ctrl: true, description: "Undo" },
  REDO: { key: "y", ctrl: true, description: "Redo" },
  SELECT_ALL: { key: "a", ctrl: true, description: "Select all" },
} as const satisfies Readonly<Record<string, Omit<KeyboardShortcut, "handler">>>;
