/**
 * Event Capture Hook - Fixed Version
 *
 * Simple hook for components that need to capture all events
 * (popups, context menus, dialogs, etc.)
 */

import { useEffect } from "react";
import { inputManager, INPUT_PRIORITY } from "@/lib/input-manager";

export type CaptureScope = "context-menu" | "popup" | "sidebar" | "input-field";

export interface UseEventCaptureOptions {
  /**
   * Whether to capture events
   * @default true
   */
  enabled?: boolean;

  /**
   * The scope/priority of this capture
   */
  scope?: CaptureScope;

  /**
   * Callback when Escape is pressed
   */
  onEscape?: () => void;

  /**
   * Callback when capture is lost (another element captured events)
   */
  onCaptureLost?: () => void;
}

/**
 * Hook to capture all events for a component
 *
 * Use this in popups, context menus, dialogs to prevent
 * map interactions while open.
 *
 * @example
 * function MyPopup({ onClose }) {
 *   useEventCapture({
 *     scope: "popup",
 *     onEscape: onClose,
 *   });
 *   return <div>Popup content</div>;
 * }
 */
export function useEventCapture({
  enabled = true,
  scope = "popup",
  onEscape,
  onCaptureLost,
}: UseEventCaptureOptions = {}): void {
  useEffect(() => {
    if (!enabled) return;

    const cleanup = inputManager.register({
      element: scope,
      priority: scope === "context-menu" ? INPUT_PRIORITY.CONTEXT_MENU :
                 scope === "popup" ? INPUT_PRIORITY.POPUP :
                 scope === "sidebar" ? INPUT_PRIORITY.SIDEBAR :
                 INPUT_PRIORITY.INPUT_FIELD,
      handlers: {
        keyboard: {
          down: (e: KeyboardEvent) => {
            // Handle Escape
            if (e.key === "Escape") {
              onEscape?.();
              return true; // Handled - prevent default
            }

            // Block other keyboard shortcuts from reaching the map
            return true; // Handled
          },
        },
        mouse: {
          // Block mouse events from reaching the map
          click: () => true, // Handled
          down: () => true, // Handled
          wheel: () => true, // Handled
        },
      },
      enabled: () => enabled,
    });

    // Listen for capture lost events
    const unsubscribeModeChange = inputManager.on("mode-change", () => {
      // If another element captured events, notify
      if (onCaptureLost && inputManager.getFocusedElement() !== scope) {
        onCaptureLost();
      }
    });

    return () => {
      cleanup();
      unsubscribeModeChange();
    };
  }, [enabled, scope, onEscape, onCaptureLost]);

  // Set focused element when mounted
  useEffect(() => {
    if (enabled) {
      inputManager.setFocusedElement(scope);
      return () => {
        if (inputManager.getFocusedElement() === scope) {
          inputManager.setFocusedElement("none");
        }
      };
    }
  }, [enabled, scope]);
}
