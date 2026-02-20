import { useEffect, useRef } from 'react';

/**
 * useFocusTrap - Trap focus within a container (for modals, dialogs)
 *
 * Prevents keyboard users from tabbing outside of a modal/dialog.
 * Automatically focuses the first focusable element on mount.
 *
 * @param enabled - Whether focus trap is active
 * @param containerRef - Ref to the container element
 *
 * @example
 * ```tsx
 * const dialogRef = useRef<HTMLDivElement>(null);
 * useFocusTrap(true, dialogRef);
 *
 * return (
 *   <div ref={dialogRef} role="dialog">
 *     <button>Close</button>
 *   </div>
 * );
 * ```
 */
export function useFocusTrap(enabled: boolean, containerRef: React.RefObject<HTMLElement>) {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    // Save the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    const container = containerRef.current;

    // Find all focusable elements within container
    const focusableElements = container.querySelectorAll<
      HTMLElement
    >(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus the first element
    firstElement?.focus();

    // Handle Tab and Shift+Tab
    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift+Tab: if on first element, cycle to last
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab: if on last element, cycle to first
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);

    // Cleanup: restore focus to previous element
    return () => {
      document.removeEventListener('keydown', handleTab);
      previousActiveElement.current?.focus();
    };
  }, [enabled, containerRef]);
}
