/**
 * use-tool-cursor - Active tool cursor management
 *
 * This hook provides the appropriate cursor based on the current tool mode
 * and interaction state (dragging, selecting, measuring, etc.).
 *
 * The cursor reflects:
 * - Active tool mode (select, create-pin, pan, measure, area)
 * - Interaction state (isDragging, isSelecting, isMeasuring)
 * - Temporary mode overrides (space+drag for pan)
 *
 * Usage:
 *   const cursor = useToolCursor(isDragging);
 *   <div style={{ cursor }} />
 */

import { useToolMode } from "@/stores/tools";
import { useIsMeasuring } from "@/stores/tools";
import { useIsSelecting } from "@/stores/tools";
import { TOOL_CURSORS, TOOL_ACTIVE_CURSORS, type ToolMode } from "@/stores/tools";

/**
 * Get the appropriate cursor for the current tool and interaction state
 *
 * @param isDragging - Whether the user is currently dragging (for grab/grabbing)
 * @param isActive - Optional override for whether the tool is in active state
 * @returns CSS cursor value
 */
export function useToolCursor(isDragging = false, isActive?: boolean): string {
  const mode = useToolMode();
  const isSelecting = useIsSelecting();
  const isMeasuring = useIsMeasuring();

  // Determine if we should show the "active" cursor
  // Active cursors are shown when:
  // - User is actively interacting (selecting, measuring, dragging)
  // - Or when explicitly provided via isActive prop
  const showActiveCursor = isSelecting || isMeasuring || isDragging || isActive;

  return showActiveCursor
    ? TOOL_ACTIVE_CURSORS[mode]
    : TOOL_CURSORS[mode];
}

/**
 * Get cursor for a specific tool mode (useful for preview buttons)
 *
 * @param mode - The tool mode to get cursor for
 * @param isActive - Whether the cursor should be in active state
 * @returns CSS cursor value
 */
export function getCursorForTool(mode: ToolMode, isActive = false): string {
  return isActive ? TOOL_ACTIVE_CURSORS[mode] : TOOL_CURSORS[mode];
}

/**
 * Create a cursor style object for inline styles
 *
 * @param isDragging - Whether the user is currently dragging
 * @returns React.CSSProperties with cursor set
 */
export function useCursorStyle(isDragging = false): React.CSSProperties {
  const cursor = useToolCursor(isDragging);
  return { cursor };
}

// Re-export types from tools store
export type { ToolMode };
export { TOOL_CURSORS, TOOL_ACTIVE_CURSORS };
