/**
 * useToolCursor - Hook for getting the appropriate cursor based on active tool
 *
 * This hook provides:
 * - Current cursor class based on tool mode and drag state
 * - Integration with both legacy use-tool-mode and new use-tools-store
 * - Space+drag temporary pan mode support
 */

import { useMemo } from "react";
import { useToolMode as useLegacyToolMode } from "./use-tool-mode";
import { useToolMode as useNewToolMode, TOOL_CURSORS, TOOL_ACTIVE_CURSORS, type ToolMode } from "@/stores/tools";

/**
 * Get the cursor class for the current tool mode
 */
export function useToolCursor(isDragging: boolean = false): string {
  // Use new store if available, fall back to legacy
  const newMode = useNewToolMode();
  const legacyMode = useLegacyToolMode().mode;
  const mode = newMode || legacyMode;

  return useMemo(() => {
    const cursors = isDragging ? TOOL_ACTIVE_CURSORS : TOOL_CURSORS;
    return cursors[mode as ToolMode] || "cursor-default";
  }, [mode, isDragging]);
}

/**
 * Get the raw cursor value (without 'cursor-' prefix) for inline styles
 */
export function useToolCursorValue(isDragging: boolean = false): string {
  const cursorClass = useToolCursor(isDragging);
  return cursorClass.replace("cursor-", "");
}
