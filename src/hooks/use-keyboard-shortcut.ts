import { useEffect } from "react";

interface KeyboardShortcutOptions {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  handler: () => void;
  preventDefault?: boolean;
}

/**
 * Hook to register global keyboard shortcuts
 * @param shortcuts - Array of shortcut configurations
 */
export function useKeyboardShortcut(shortcuts: KeyboardShortcutOptions[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const {
          key,
          ctrlKey = false,
          metaKey = false,
          shiftKey = false,
          altKey = false,
          handler,
          preventDefault = true,
        } = shortcut;

        // Check if all modifiers match
        const keyMatch = e.key.toLowerCase() === key.toLowerCase();

        // Special handling for ctrl/meta: if both are true, match either (Ctrl OR Cmd)
        let ctrlMetaMatch = true;
        if (ctrlKey && metaKey) {
          // Match if Ctrl OR Cmd is pressed (cross-platform)
          ctrlMetaMatch = e.ctrlKey || e.metaKey;
        } else {
          // Exact match required
          const ctrlMatch = e.ctrlKey === ctrlKey;
          const metaMatch = e.metaKey === metaKey;
          ctrlMetaMatch = ctrlMatch && metaMatch;
        }

        const shiftMatch = e.shiftKey === shiftKey;
        const altMatch = e.altKey === altKey;

        if (keyMatch && ctrlMetaMatch && shiftMatch && altMatch) {
          if (preventDefault) {
            e.preventDefault();
          }
          handler();
          break; // Only execute first matching shortcut
        }
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]);
}

/**
 * Common keyboard shortcut presets
 */
export const SHORTCUTS = {
  SEARCH: { key: "k", ctrlKey: true, metaKey: true },
  ESCAPE: { key: "Escape" },
  SAVE: { key: "s", ctrlKey: true, metaKey: true },
} as const;
