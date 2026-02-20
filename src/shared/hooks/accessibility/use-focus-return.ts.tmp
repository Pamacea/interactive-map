import { useRef, useEffect } from 'react';

/**
 * useFocusReturn - Return focus to element after component unmounts
 *
 * Useful for dialogs, popups, and dropdowns to restore
 * keyboard focus to the triggering element when closed.
 *
 * @param enabled - Whether focus return is active
 * @param deps - Dependencies to re-capture focus
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * useFocusReturn(isOpen);
 *
 * return (
 *   <>
 *     <button onClick={() => setIsOpen(true)}>Open</button>
 *     {isOpen && <Modal onClose={() => setIsOpen(false)} />}
 *   </>
 * );
 * ```
 */
export function useFocusReturn(enabled: boolean, deps: React.DependencyList = []) {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) {
      // When disabled (dialog closes), restore focus
      previousActiveElement.current?.focus();
      previousActiveElement.current = null;
      return;
    }

    // When enabled (dialog opens), save current focus
    previousActiveElement.current = document.activeElement as HTMLElement;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);
}

/**
 * useFocusManagement - Combined focus management for dialogs
 *
 * Captures focus on mount, returns focus on unmount.
 * Use this for modals, dialogs, and popovers.
 *
 * @param isOpen - Whether the dialog is open
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * useFocusManagement(isOpen);
 *
 * return (
 *   <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
 *     <DialogContent>Content</DialogContent>
 *   </Dialog>
 * );
 * ```
 */
export function useFocusManagement(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    // Save current focus when dialog opens
    const previousFocus = document.activeElement as HTMLElement;

    // Return focus when dialog closes
    return () => {
      previousFocus?.focus();
    };
  }, [isOpen]);
}
