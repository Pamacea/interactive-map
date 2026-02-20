'use client';

import { useCallback, useRef } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { updatePresence } from '@/actions/presence';

interface CursorPosition {
  x: number;
  y: number;
}

interface ViewportState {
  x: number;
  y: number;
  zoom: number;
}

interface UseCursorBroadcastOptions {
  worldId: string;
  sessionId: string;
  enabled?: boolean;
  debounceMs?: number;
  onError?: (error: Error) => void;
}

export function useCursorBroadcast({
  worldId,
  sessionId,
  enabled = true,
  debounceMs = 200,
  onError,
}: UseCursorBroadcastOptions) {
  const lastPositionRef = useRef<CursorPosition | null>(null);
  const lastViewportRef = useRef<ViewportState | null>(null);
  const pendingUpdateRef = useRef<Promise<void> | null>(null);

  const sendPositionUpdate = useCallback(
    async (position: CursorPosition) => {
      if (!enabled) return;

      // Wait for previous update to complete
      if (pendingUpdateRef.current) {
        try {
          await pendingUpdateRef.current;
        } catch {
          // Previous update failed, proceed with new one
        }
      }

      pendingUpdateRef.current = updatePresence({
        worldId,
        sessionId,
        cursorX: position.x,
        cursorY: position.y,
      });

      try {
        await pendingUpdateRef.current;
      } catch (err) {
        onError?.(err instanceof Error ? err : new Error('Failed to update cursor'));
      } finally {
        pendingUpdateRef.current = null;
      }
    },
    [enabled, worldId, sessionId, onError],
  );

  const debouncedPositionUpdate = useDebounce(sendPositionUpdate, debounceMs);

  const updateCursor = useCallback(
    (x: number, y: number) => {
      if (!enabled) return;

      // Clamp values to valid range [0, 1]
      const clampedX = Math.max(0, Math.min(1, x));
      const clampedY = Math.max(0, Math.min(1, y));

      const position = { x: clampedX, y: clampedY };

      if (!lastPositionRef.current) {
        lastPositionRef.current = position;
        void sendPositionUpdate(position);
        return;
      }

      const dx = Math.abs(position.x - lastPositionRef.current.x);
      const dy = Math.abs(position.y - lastPositionRef.current.y);

      // Only send updates if position changed significantly (>1%)
      if (dx > 0.01 || dy > 0.01) {
        lastPositionRef.current = position;
        void debouncedPositionUpdate(position);
      }
    },
    [enabled, sendPositionUpdate, debouncedPositionUpdate],
  );

  const broadcastViewport = useCallback(
    async (viewport: ViewportState) => {
      if (!enabled) return;

      // Only send if viewport changed significantly
      if (lastViewportRef.current) {
        const zoomChanged = Math.abs(viewport.zoom - lastViewportRef.current.zoom) > 0.1;
        const positionChanged =
          Math.abs(viewport.x - lastViewportRef.current.x) > 50 ||
          Math.abs(viewport.y - lastViewportRef.current.y) > 50;

        if (!zoomChanged && !positionChanged) {
          return;
        }
      }

      lastViewportRef.current = viewport;

      try {
        await updatePresence({
          worldId,
          sessionId,
          viewport: {
            x: viewport.x,
            y: viewport.y,
            zoom: viewport.zoom,
            width: 0,
            height: 0,
          },
        });
      } catch (err) {
        onError?.(err instanceof Error ? err : new Error('Failed to update viewport'));
      }
    },
    [enabled, worldId, sessionId, onError],
  );

  const broadcastSelection = useCallback(
    async (selectedPinId: string | null) => {
      if (!enabled) return;

      try {
        await updatePresence({
          worldId,
          sessionId,
          selectedPinId,
        });
      } catch (err) {
        onError?.(err instanceof Error ? err : new Error('Failed to update selection'));
      }
    },
    [enabled, worldId, sessionId, onError],
  );

  return {
    updateCursor,
    broadcastViewport,
    broadcastSelection,
  };
}
