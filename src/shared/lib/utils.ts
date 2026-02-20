import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Check if a keyboard event should be ignored for global shortcuts.
 * Returns true if the event target is an input field or has the data-no-shortcut attribute.
 *
 * This prevents keyboard shortcuts from triggering when the user is typing.
 */
export function shouldIgnoreKeyboardEvent(e: KeyboardEvent): boolean {
  const target = e.target as HTMLElement;

  // Check for editable elements
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable
  ) {
    return true;
  }

  // Check for data-no-shortcut attribute (on target or any parent)
  if (target.closest('[data-no-shortcut]')) {
    return true;
  }

  return false;
}
