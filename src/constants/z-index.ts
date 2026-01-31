/**
 * Z-index layer constants for the application.
 *
 * Usage:
 *   style={{ zIndex: Z_INDEX.floatingPanel }}
 *   or in Tailwind: className="z-[20]"
 *
 * Note: For Tailwind classes, use the numeric value directly.
 * This file serves as documentation and for dynamic values.
 */
export const Z_INDEX = {
  // Base layers
  base: 0,
  map: 1,
  pin: 10,

  // Floating UI elements
  floatingPanel: 20,
  activeFloatingPanel: 25,
  floatingHeader: 30,
  moduleDock: 30,

  // Overlays and dropdowns
  dropdown: 40,
  popover: 45,
  contextMenu: 50,

  // Modals and notifications
  modal: 60,
  toast: 70,
} as const;

export type ZIndexValue = (typeof Z_INDEX)[keyof typeof Z_INDEX];

/**
 * Get the next available z-index for bringing a panel to front.
 * This is a simple implementation; for complex scenarios, use a store.
 */
export function getNextZIndex(base: ZIndexValue = Z_INDEX.floatingPanel): number {
  return base + 1;
}

/**
 * Default z-index values for common UI elements as Tailwind classes.
 * Use these in className for consistency.
 */
export const Z_INDEX_CLASSES = {
  base: "z-0",
  map: "z-[1]",
  pin: "z-10",
  floatingPanel: "z-20",
  activeFloatingPanel: "z-[25]",
  floatingHeader: "z-30",
  moduleDock: "z-30",
  dropdown: "z-[40]",
  popover: "z-[45]",
  contextMenu: "z-50",
  modal: "z-[60]",
  toast: "z-[70]",
} as const;
