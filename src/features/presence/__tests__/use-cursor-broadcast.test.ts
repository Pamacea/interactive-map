/**
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCursorBroadcast } from '../logic/use-cursor-broadcast';

vi.mock('@/features/presence/actions', () => ({
  updatePresence: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('@/shared/hooks/use-debounce', () => ({
  useDebounce: (fn: (...args: unknown[]) => unknown) => fn,
}));

describe('useCursorBroadcast (polling version)', () => {
  const mockProps = {
    worldId: 'world-123',
    sessionId: 'session-abc',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with broadcast functions', () => {
    const { result } = renderHook(() =>
      useCursorBroadcast(mockProps),
    );

    expect(result.current).toHaveProperty('updateCursor');
    expect(result.current).toHaveProperty('broadcastViewport');
    expect(result.current).toHaveProperty('broadcastSelection');
  });

  it('should broadcast cursor position update', async () => {
    const { updatePresence } = await import('@/features/presence/actions');
    const { result } = renderHook(() =>
      useCursorBroadcast(mockProps),
    );

    await act(async () => {
      await result.current.updateCursor(0.5, 0.7);
    });

    expect(updatePresence).toHaveBeenCalledWith({
      worldId: mockProps.worldId,
      sessionId: mockProps.sessionId,
      cursorX: 0.5,
      cursorY: 0.7,
    });
  });

  it('should clamp cursor values to valid range [0, 1]', async () => {
    const { updatePresence } = await import('@/features/presence/actions');
    const { result } = renderHook(() =>
      useCursorBroadcast(mockProps),
    );

    await act(async () => {
      await result.current.updateCursor(1.5, -0.5); // Out of range
    });

    expect(updatePresence).toHaveBeenCalledWith({
      worldId: mockProps.worldId,
      sessionId: mockProps.sessionId,
      cursorX: 1, // Clamped
      cursorY: 0, // Clamped
    });
  });

  it('should broadcast viewport update', async () => {
    const { updatePresence } = await import('@/features/presence/actions');
    const { result } = renderHook(() =>
      useCursorBroadcast(mockProps),
    );

    const viewport: { x: number; y: number; zoom: number } = { x: 100, y: 200, zoom: 1.5 };

    await act(async () => {
      await result.current.broadcastViewport(viewport);
    });

    expect(updatePresence).toHaveBeenCalledWith({
      worldId: mockProps.worldId,
      sessionId: mockProps.sessionId,
      viewport: {
        x: 100,
        y: 200,
        zoom: 1.5,
        width: 0,
        height: 0,
      },
    });
  });

  it('should broadcast selection change', async () => {
    const { updatePresence } = await import('@/features/presence/actions');
    const { result } = renderHook(() =>
      useCursorBroadcast(mockProps),
    );

    await act(async () => {
      await result.current.broadcastSelection('pin-456');
    });

    expect(updatePresence).toHaveBeenCalledWith({
      worldId: mockProps.worldId,
      sessionId: mockProps.sessionId,
      selectedPinId: 'pin-456',
    });
  });

  it('should broadcast null selection change', async () => {
    const { updatePresence } = await import('@/features/presence/actions');
    const { result } = renderHook(() =>
      useCursorBroadcast(mockProps),
    );

    await act(async () => {
      await result.current.broadcastSelection(null);
    });

    expect(updatePresence).toHaveBeenCalledWith({
      worldId: mockProps.worldId,
      sessionId: mockProps.sessionId,
      selectedPinId: null,
    });
  });

  it('should not broadcast when disabled', async () => {
    const { updatePresence } = await import('@/features/presence/actions');
    const { result } = renderHook(() =>
      useCursorBroadcast({ ...mockProps, enabled: false }),
    );

    await act(async () => {
      await result.current.updateCursor(0.5, 0.7);
    });

    expect(updatePresence).not.toHaveBeenCalled();
  });

  it('should call onError when update fails', async () => {
    const mockError = new Error('Update failed');
    const { updatePresence } = await import('@/features/presence/actions');
    (updatePresence as unknown).mockRejectedValue(mockError);

    const onError = vi.fn();

    const { result } = renderHook(() =>
      useCursorBroadcast({ ...mockProps, onError }),
    );

    await act(async () => {
      await result.current.updateCursor(0.5, 0.7);
    });

    expect(onError).toHaveBeenCalledWith(mockError);
  });

  it('should skip viewport updates when position change is small', async () => {
    const { updatePresence } = await import('@/features/presence/actions');
    const { result } = renderHook(() =>
      useCursorBroadcast(mockProps),
    );

    const viewport = { x: 100, y: 200, zoom: 1.5 };

    // First update should go through
    await act(async () => {
      await result.current.broadcastViewport(viewport);
    });

    expect(updatePresence).toHaveBeenCalledTimes(1);

    // Small change should be skipped
    await act(async () => {
      await result.current.broadcastViewport({ x: 110, y: 210, zoom: 1.5 });
    });

    expect(updatePresence).toHaveBeenCalledTimes(1);
  });

  it('should handle NaN cursor values gracefully', async () => {
    const { updatePresence } = await import('@/features/presence/actions');
    const { result } = renderHook(() =>
      useCursorBroadcast(mockProps),
    );

    await act(async () => {
      await result.current.updateCursor(NaN, NaN);
    });

    // NaN should be ignored entirely - no call made
    expect(updatePresence).not.toHaveBeenCalled();
  });
});
