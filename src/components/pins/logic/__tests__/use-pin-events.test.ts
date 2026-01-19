import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePinEvents } from '../use-pin-events'

// Mock the event manager module - must be done with factory function
vi.mock('@/lib/event-manager', () => ({
  eventManager: {
    capture: vi.fn(() => vi.fn()),
  },
}))

// Mock the pins store
const mockSetHoverPin = vi.fn()
vi.mock('@/stores/use-pins-store', () => ({
  usePinsStore: vi.fn((selector: (state: any) => any) =>
    selector({
      setHoverPin: mockSetHoverPin,
      hoverPinId: null,
    })
  ),
  useSetHoverPin: vi.fn(() => mockSetHoverPin),
}))

// Import the mocked modules after mocking
import { eventManager } from '@/lib/event-manager'

describe('usePinEvents', () => {
  const mockParams = {
    pinId: 'pin-123',
    isDragging: false,
    isPinSelected: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should initialize with isHovered as false', () => {
      const { result } = renderHook(() => usePinEvents(mockParams))

      expect(result.current.isHovered).toBe(false)
    })

    it('should return event handlers', () => {
      const { result } = renderHook(() => usePinEvents(mockParams))

      expect(typeof result.current.handleMouseEnter).toBe('function')
      expect(typeof result.current.handleMouseLeave).toBe('function')
    })
  })

  describe('hover state management', () => {
    it('should set isHovered to true on mouse enter', () => {
      const { result } = renderHook(() => usePinEvents(mockParams))

      act(() => {
        result.current.handleMouseEnter()
      })

      expect(result.current.isHovered).toBe(true)
      expect(mockSetHoverPin).toHaveBeenCalledWith('pin-123')
    })

    it('should set isHovered to false on mouse leave', () => {
      const { result } = renderHook(() => usePinEvents(mockParams))

      // First enter
      act(() => {
        result.current.handleMouseEnter()
      })

      expect(result.current.isHovered).toBe(true)

      // Then leave
      act(() => {
        result.current.handleMouseLeave()
      })

      expect(result.current.isHovered).toBe(false)
      expect(mockSetHoverPin).toHaveBeenCalledWith(null)
    })

    it('should toggle hover state multiple times', () => {
      const { result } = renderHook(() => usePinEvents(mockParams))

      act(() => {
        result.current.handleMouseEnter()
      })
      expect(result.current.isHovered).toBe(true)

      act(() => {
        result.current.handleMouseLeave()
      })
      expect(result.current.isHovered).toBe(false)

      act(() => {
        result.current.handleMouseEnter()
      })
      expect(result.current.isHovered).toBe(true)

      act(() => {
        result.current.handleMouseLeave()
      })
      expect(result.current.isHovered).toBe(false)

      expect(mockSetHoverPin).toHaveBeenCalledTimes(4)
    })
  })

  describe('event capture integration', () => {
    it('should capture events when pin is hovered', () => {
      const { result } = renderHook(() => usePinEvents(mockParams))

      act(() => {
        result.current.handleMouseEnter()
      })

      expect(eventManager.capture).toHaveBeenCalledWith('pin-marker')
    })

    it('should capture events when pin is selected', () => {
      renderHook(
        (props) => usePinEvents(props),
        { initialProps: { ...mockParams, isPinSelected: true } }
      )

      expect(eventManager.capture).toHaveBeenCalledWith('pin-marker')
    })

    it('should not capture events when dragging and not hovered/selected', () => {
      vi.clearAllMocks()

      renderHook(
        (props) => usePinEvents(props),
        { initialProps: { ...mockParams, isDragging: true, isPinSelected: false } }
      )

      expect(eventManager.capture).not.toHaveBeenCalled()
    })

    it('should release capture when hover ends', async () => {
      const mockRelease = vi.fn()
      vi.mocked(eventManager.capture).mockReturnValue(mockRelease)

      const { result } = renderHook(() => usePinEvents(mockParams))

      act(() => {
        result.current.handleMouseEnter()
      })

      expect(eventManager.capture).toHaveBeenCalled()

      act(() => {
        result.current.handleMouseLeave()
      })

      // Wait for cleanup
      await waitFor(() => {
        expect(mockRelease).toHaveBeenCalled()
      })
    })

    it('should handle multiple capture/release cycles', () => {
      const { result } = renderHook(() => usePinEvents(mockParams))

      // First hover cycle
      act(() => {
        result.current.handleMouseEnter()
      })
      act(() => {
        result.current.handleMouseLeave()
      })

      // Second hover cycle
      act(() => {
        result.current.handleMouseEnter()
      })
      act(() => {
        result.current.handleMouseLeave()
      })

      expect(eventManager.capture).toHaveBeenCalledTimes(2)
    })
  })

  describe('store integration', () => {
    it('should call setHoverPin with pinId on mouse enter', () => {
      const { result } = renderHook(() => usePinEvents(mockParams))

      act(() => {
        result.current.handleMouseEnter()
      })

      expect(mockSetHoverPin).toHaveBeenCalledWith('pin-123')
      expect(mockSetHoverPin).toHaveBeenCalledTimes(1)
    })

    it('should call setHoverPin with null on mouse leave', () => {
      const { result } = renderHook(() => usePinEvents(mockParams))

      act(() => {
        result.current.handleMouseLeave()
      })

      expect(mockSetHoverPin).toHaveBeenCalledWith(null)
    })
  })

  describe('edge cases', () => {
    it('should handle rapid hover state changes', () => {
      const { result } = renderHook(() => usePinEvents(mockParams))

      // Rapidly toggle hover state
      act(() => {
        result.current.handleMouseEnter()
        result.current.handleMouseLeave()
        result.current.handleMouseEnter()
        result.current.handleMouseLeave()
        result.current.handleMouseEnter()
      })

      expect(result.current.isHovered).toBe(true)
      expect(mockSetHoverPin).toHaveBeenCalledTimes(5)
    })

    it('should handle missing pinId gracefully', () => {
      const { result } = renderHook(() =>
        usePinEvents({ ...mockParams, pinId: '' })
      )

      act(() => {
        result.current.handleMouseEnter()
      })

      expect(mockSetHoverPin).toHaveBeenCalledWith('')
    })
  })

  describe('memory leak prevention', () => {
    it('should cleanup event listeners on unmount', () => {
      const mockRelease = vi.fn()
      vi.mocked(eventManager.capture).mockReturnValue(mockRelease)

      const { result, unmount } = renderHook(() => usePinEvents(mockParams))

      act(() => {
        result.current.handleMouseEnter()
      })

      unmount()

      expect(mockRelease).toHaveBeenCalled()
    })

    it('should handle unmount during hover', () => {
      const mockRelease = vi.fn()
      vi.mocked(eventManager.capture).mockReturnValue(mockRelease)

      const { result, unmount } = renderHook(() => usePinEvents(mockParams))

      act(() => {
        result.current.handleMouseEnter()
      })

      unmount()

      expect(mockRelease).toHaveBeenCalled()
    })
  })
})
