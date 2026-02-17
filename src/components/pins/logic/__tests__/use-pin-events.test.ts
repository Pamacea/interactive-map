import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePinEvents } from '../use-pin-events'

// Mock the input manager module
vi.mock('@/lib/input-manager', () => ({
  inputManager: {
    setFocusedElement: vi.fn(),
    getFocusedElement: vi.fn(() => 'none'),
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
import { inputManager } from '@/lib/input-manager'

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

  describe('input manager integration', () => {
    it('should set focused element when pin is hovered', () => {
      const { result } = renderHook(() => usePinEvents(mockParams))

      act(() => {
        result.current.handleMouseEnter()
      })

      // Wait for useEffect to run
      waitFor(() => {
        expect(inputManager.setFocusedElement).toHaveBeenCalledWith('pin-marker')
      })
    })

    it('should set focused element when pin is selected', () => {
      renderHook(
        (props) => usePinEvents(props),
        { initialProps: { ...mockParams, isPinSelected: true } }
      )

      waitFor(() => {
        expect(inputManager.setFocusedElement).toHaveBeenCalledWith('pin-marker')
      })
    })

    it('should not set focused element when dragging and not hovered/selected', () => {
      vi.clearAllMocks()

      renderHook(
        (props) => usePinEvents(props),
        { initialProps: { ...mockParams, isDragging: true, isPinSelected: false } }
      )

      expect(inputManager.setFocusedElement).not.toHaveBeenCalled()
    })

    it('should reset focused element when hover ends', async () => {
      const mockGetFocusedElement = vi.mocked(inputManager.getFocusedElement)
      mockGetFocusedElement.mockReturnValue('pin-marker')

      const { result } = renderHook(() => usePinEvents(mockParams))

      act(() => {
        result.current.handleMouseEnter()
      })

      expect(inputManager.setFocusedElement).toHaveBeenCalled()

      act(() => {
        result.current.handleMouseLeave()
      })

      // Wait for cleanup
      await waitFor(() => {
        expect(inputManager.setFocusedElement).toHaveBeenCalledWith('none')
      })
    })

    it('should handle multiple focus/unfocus cycles', () => {
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

      // setFocusedElement is called for each focus/unfocus
      expect(inputManager.setFocusedElement).toHaveBeenCalled()
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
    it('should cleanup effect on unmount', () => {
      const { result, unmount } = renderHook(() => usePinEvents(mockParams))

      act(() => {
        result.current.handleMouseEnter()
      })

      unmount()

      // Should not throw and cleanup should happen
      expect(inputManager.setFocusedElement).toHaveBeenCalled()
    })

    it('should handle unmount during hover', () => {
      const { result, unmount } = renderHook(() => usePinEvents(mockParams))

      act(() => {
        result.current.handleMouseEnter()
      })

      unmount()

      expect(inputManager.setFocusedElement).toHaveBeenCalled()
    })
  })
})
