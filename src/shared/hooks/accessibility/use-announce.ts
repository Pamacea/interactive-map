import { useEffect, useRef } from 'react';

/**
 * useAnnounce - Announce messages to screen readers
 *
 * Uses ARIA live regions to provide screen reader announcements
 * for dynamic content changes, notifications, and status updates.
 *
 * @param message - Message to announce
 * @param priority - 'polite' (default) or 'assertive'
 * @param clearAfter - Delay to clear message (ms), 0 = never clear
 *
 * @example
 * ```tsx
 * function Component() {
 *   const [status, setStatus] = useState('');
 *   const announce = useAnnounce();
 *
 *   const handleSave = () => {
 *     saveData();
 *     announce('Changes saved successfully');
 *   };
 *
 *   return <button onClick={handleSave}>Save</button>;
 * }
 * ```
 */
export function useAnnounce() {
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  // Create live region on first use
  useEffect(() => {
    if (!liveRegionRef.current) {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.setAttribute('role', 'status');
      liveRegion.className = 'sr-only';
      // Position off-screen but keep in DOM
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
      liveRegionRef.current = liveRegion;
    }

    return () => {
      // Cleanup on unmount
      if (liveRegionRef.current && liveRegionRef.current.parentNode) {
        liveRegionRef.current.parentNode.removeChild(liveRegionRef.current);
      }
    };
  }, []);

  /**
   * Announce a message to screen readers
   */
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!liveRegionRef.current) return;

    // Update aria-live based on priority
    liveRegionRef.current.setAttribute('aria-live', priority);

    // Clear previous message
    liveRegionRef.current.textContent = '';

    // Force browser to process the clear
    requestAnimationFrame(() => {
      // Set new message
      liveRegionRef.current!.textContent = message;
    });
  };

  return announce;
}

/**
 * useLiveRegion - Create a managed live region for frequent updates
 *
 * For components that need to announce status changes frequently.
 *
 * @param message - Message to announce
 * @param priority - 'polite' or 'assertive'
 *
 * @example
 * ```tsx
 * function LoadingSpinner({ isLoading, progress }) {
 *   useLiveRegion(
 *     isLoading ? `Loading: ${progress}% complete` : '',
 *     'polite'
 *   );
 *
 *   return <div>{progress}%</div>;
 * }
 * ```
 */
export function useLiveRegion(message: string, priority: 'polite' | 'assertive' = 'polite') {
  useEffect(() => {
    if (!message) return;

    // Find or create live region
    let liveRegion = document.getElementById('global-live-region');

    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'global-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.setAttribute('role', 'status');
      liveRegion.className = 'sr-only';
      (liveRegion as HTMLElement).style.position = 'absolute';
      (liveRegion as HTMLElement).style.left = '-10000px';
      (liveRegion as HTMLElement).style.width = '1px';
      (liveRegion as HTMLElement).style.height = '1px';
      (liveRegion as HTMLElement).style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
    }

    liveRegion.setAttribute('aria-live', priority);
    liveRegion.textContent = message;

    return () => {
      if (liveRegion) {
        liveRegion.textContent = '';
      }
    };
  }, [message, priority]);
}

/**
 * Announce utility function for standalone use (outside React)
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  let liveRegion = document.getElementById('global-live-region');

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'global-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('role', 'status');
    liveRegion.className = 'sr-only';
    (liveRegion as HTMLElement).style.position = 'absolute';
    (liveRegion as HTMLElement).style.left = '-10000px';
    (liveRegion as HTMLElement).style.width = '1px';
    (liveRegion as HTMLElement).style.height = '1px';
    (liveRegion as HTMLElement).style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
  }

  liveRegion.setAttribute('aria-live', priority);

  // Clear and set message
  liveRegion.textContent = '';
  requestAnimationFrame(() => {
    liveRegion!.textContent = message;
  });
}
