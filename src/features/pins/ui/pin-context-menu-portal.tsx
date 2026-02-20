"use client";

import { createPortal } from "react-dom";
import type { PinContextMenuProps } from "./pin-context-menu";
import { PinContextMenu } from "./pin-context-menu";

/**
 * Portal wrapper for PinContextMenu.
 *
 * Renders the context menu outside the map container to avoid
 * clipping from parent overflow-hidden styles.
 */
export function PinContextMenuPortal(props: PinContextMenuProps) {
  return createPortal(<PinContextMenu {...props} />, document.body);
}
