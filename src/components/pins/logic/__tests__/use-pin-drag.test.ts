import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { usePinDrag } from '../use-pin-drag'
import { updatePinPosition } from '@/actions/pins'

// Mock the updatePinPosition server action
vi.mock('@/actions/pins', () => ({
  updatePinPosition: vi.fn(),
}))

// Mock the useToast hook
const mockShowToast = vi.fn()
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}))

describe('usePinDrag', () => {
  const mockConfig = {
    pinId: 'pin-123',
    latitude: 0.5,
    longitude: 0.5,
    mapWidth: 1000,
    mapHeight: 800,
    scale: 1,
    isLocked: false,
  }

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
    // Mock window methods
    global.window.addEventListener = vi.fn()
    global.window.removeEventListener = vi.fn()
  })

  afterEach(() => {
    // Clean up any remaining event listeners
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => usePinDrag(mockConfig))

      expect(result.current.isDragging).toBe(false)
      expect(result.current.dragPosition).toBeNull()
      expect(result.current.hasMovedDuringDrag).toBe(false)
      expect(typeof result.current.handleMouseDown).toBe('function')
    })

    it('should accept custom callbacks', () => {
      const onSelectPin = vi.fn()
      const onUpdatePin = vi.fn()

      const { result } = renderHook(() =>
        usePinDrag({
          ...mockConfig,
          onSelectPin,
          onUpdatePin,
        })
      )

      expect(typeof result.current.handleMouseDown).toBe('function')
    })
  })

  describe('drag threshold behavior', () => {
    it('should not start dragging on small movements (< 3px)', async () => {
      const { result } = renderHook(() => usePinDrag(mockConfig))

      // Create a mock mouse event
      const mouseDownEvent = {
        button: 0,
        clientX: 500,
        clientY: 400,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent

      // Start drag
      act(() => {
        result.current.handleMouseDown(mouseDownEvent)
      })

      // Small movement (< 3px)
      const mouseMoveEvent = {
        clientX: 502, // Only 2px movement
        clientY: 400,
      } as MouseEvent

      act(() => {
        // Simulate mouse move by calling the stored handler
        const moveHandler = (global.window.addEventListener as jest.Mock).mock.calls.find(
          (call) => call[0] === 'mousemove'
        )?.[1]
        if (moveHandler) moveHandler(mouseMoveEvent)
      })

      // Should not be dragging yet
      expect(result.current.isDragging).toBe(false)
      expect(result.current.hasMovedDuringDrag).toBe(false)
    })

    it('should start dragging after movement threshold (> 3px)', async () => {
      const { result } = renderHook(() => usePinDrag(mockConfig))

      const mouseDownEvent = {
        button: 0,
        clientX: 500,
        clientY: 400,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handleMouseDown(mouseDownEvent)
      })

      // Large movement (> 3px)
      const mouseMoveEvent = {
        clientX: 510, // 10px movement
        clientY: 400,
      } as MouseEvent

      act(() => {
        const moveHandler = (global.window.addEventListener as jest.Mock).mock.calls.find(
          (call) => call[0] === 'mousemove'
        )?.[1]
        if (moveHandler) moveHandler(mouseMoveEvent)
      })

      // Should be dragging now
      expect(result.current.isDragging).toBe(true)
      expect(result.current.hasMovedDuringDrag).toBe(true)
    })

    it('should trigger onSelectPin on drag start', () => {
      const onSelectPin = vi.fn()

      const { result } = renderHook(() =>
        usePinDrag({
          ...mockConfig,
          onSelectPin,
        })
      )

      const mouseDownEvent = {
        button: 0,
        clientX: 500,
        clientY: 400,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handleMouseDown(mouseDownEvent)
      })

      expect(onSelectPin).toHaveBeenCalledWith('pin-123')
    })
  })

  describe('position clamping', () => {
    it('should clamp position to map boundaries on X axis', async () => {
      const onUpdatePin = vi.fn()
      const { result } = renderHook(() =>
        usePinDrag({
          ...mockConfig,
          onUpdatePin,
        })
      )

      // Start drag
      const mouseDownEvent = {
        button: 0,
        clientX: 500,
        clientY: 400,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handleMouseDown(mouseDownEvent)
      })

      // Move beyond right boundary
      const mouseMoveEvent = {
        clientX: 2000, // Far beyond map width (1000)
        clientY: 400,
      } as MouseEvent

      act(() => {
        const moveHandler = (global.window.addEventListener as jest.Mock).mock.calls.find(
          (call) => call[0] === 'mousemove'
        )?.[1]
        if (moveHandler) moveHandler(mouseMoveEvent)
      })

      // Position should be clamped to map width
      expect(result.current.dragPosition).not.toBeNull()
      if (result.current.dragPosition) {
        expect(result.current.dragPosition.x).toBeLessThanOrEqual(1000)
      }
    })

    it('should clamp position to map boundaries on Y axis', async () => {
      const onUpdatePin = vi.fn()
      const { result } = renderHook(() =>
        usePinDrag({
          ...mockConfig,
          onUpdatePin,
        })
      )

      const mouseDownEvent = {
        button: 0,
        clientX: 500,
        clientY: 400,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handleMouseDown(mouseDownEvent)
      })

      // Move beyond bottom boundary
      const mouseMoveEvent = {
        clientX: 500,
        clientY: 1500, // Far beyond map height (800)
      } as MouseEvent

      act(() => {
        const moveHandler = (global.window.addEventListener as jest.Mock).mock.calls.find(
          (call) => call[0] === 'mousemove'
        )?.[1]
        if (moveHandler) moveHandler(mouseMoveEvent)
      })

      // Position should be clamped to map height
      expect(result.current.dragPosition).not.toBeNull()
      if (result.current.dragPosition) {
        expect(result.current.dragPosition.y).toBeLessThanOrEqual(800)
      }
    })

    it('should clamp position to minimum boundaries (0, 0)', async () => {
      const { result } = renderHook(() => usePinDrag(mockConfig))

      const mouseDownEvent = {
        button: 0,
        clientX: 500,
        clientY: 400,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handleMouseDown(mouseDownEvent)
      })

      // Move to negative coordinates
      const mouseMoveEvent = {
        clientX: -100,
        clientY: -50,
      } as MouseEvent

      act(() => {
        const moveHandler = (global.window.addEventListener as jest.Mock).mock.calls.find(
          (call) => call[0] === 'mousemove'
        )?.[1]
        if (moveHandler) moveHandler(mouseMoveEvent)
      })

      // Position should be clamped to minimum 0
      expect(result.current.dragPosition).not.toBeNull()
      if (result.current.dragPosition) {
        expect(result.current.dragPosition.x).toBeGreaterThanOrEqual(0)
        expect(result.current.dragPosition.y).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('optimistic updates', () => {
    it('should call onUpdatePin with normalized coordinates after drag', async () => {
      const onUpdatePin = vi.fn()
      vi.mocked(updatePinPosition).mockResolvedValue({} as any)

      const { result } = renderHook(() =>
        usePinDrag({
          ...mockConfig,
          onUpdatePin,
        })
      )

      // Start drag
      const mouseDownEvent = {
        button: 0,
        clientX: 500,
        clientY: 400,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handleMouseDown(mouseDownEvent)
      })

      // Move pin
      const mouseMoveEvent = {
        clientX: 600,
        clientY: 500,
      } as MouseEvent

      act(() => {
        const moveHandler = (global.window.addEventListener as jest.Mock).mock.calls.find(
          (call) => call[0] === 'mousemove'
        )?.[1]
        if (moveHandler) moveHandler(mouseMoveEvent)
      })

      // End drag
      const mouseUpEvent = {
        clientX: 600,
        clientY: 500,
      } as MouseEvent

      act(() => {
        const upHandler = (global.window.addEventListener as jest.Mock).mock.calls.find(
          (call) => call[0] === 'mouseup'
        )?.[1]
        if (upHandler) upHandler(mouseUpEvent)
      })

      await waitFor(() => {
        expect(onUpdatePin).toHaveBeenCalledWith('pin-123', {
          latitude: expect.any(Number),
          longitude: expect.any(Number),
        })
      })

      // Verify coordinates are normalized (0-1 range)
      const updateCall = onUpdatePin.mock.calls[0][1]
      expect(updateCall.latitude).toBeGreaterThanOrEqual(0)
      expect(updateCall.latitude).toBeLessThanOrEqual(1)
      expect(updateCall.longitude).toBeGreaterThanOrEqual(0)
      expect(updateCall.longitude).toBeLessThanOrEqual(1)
    })

    it('should call updatePinPosition server action in background', async () => {
      const onUpdatePin = vi.fn()
      vi.mocked(updatePinPosition).mockResolvedValue({ id: 'pin-123', latitude: 0.6, longitude: 0.6 })

      const { result } = renderHook(() =>
        usePinDrag({
          ...mockConfig,
          onUpdatePin,
        })
      )

      const mouseDownEvent = {
        button: 0,
        clientX: 500,
        clientY: 400,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handleMouseDown(mouseDownEvent)
      })

      const mouseMoveEvent = {
        clientX: 600,
        clientY: 500,
      } as MouseEvent

      act(() => {
        const moveHandler = (global.window.addEventListener as jest.Mock).mock.calls.find(
          (call) => call[0] === 'mousemove'
        )?.[1]
        if (moveHandler) moveHandler(mouseMoveEvent)
      })

      const mouseUpEvent = {
        clientX: 600,
        clientY: 500,
      } as MouseEvent

      act(() => {
        const upHandler = (global.window.addEventListener as jest.Mock).mock.calls.find(
          (call) => call[0] === 'mouseup'
        )?.[1]
        if (upHandler) upHandler(mouseUpEvent)
      })

      await waitFor(() => {
        expect(updatePinPosition).toHaveBeenCalledWith('pin-123', expect.any(Number), expect.any(Number))
      })
    })
  })

  describe('event listener cleanup', () => {
    it('should remove window event listeners after drag completes', async () => {
      const { result } = renderHook(() => usePinDrag(mockConfig))

      const mouseDownEvent = {
        button: 0,
        clientX: 500,
        clientY: 400,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handleMouseDown(mouseDownEvent)
      })

      const mouseUpEvent = {
        clientX: 500,
        clientY: 400,
      } as MouseEvent

      act(() => {
        const upHandler = (global.window.addEventListener as jest.Mock).mock.calls.find(
          (call) => call[0] === 'mouseup'
        )?.[1]
        if (upHandler) upHandler(mouseUpEvent)
      })

      await waitFor(() => {
        expect(global.window.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function))
        expect(global.window.removeEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function))
      })
    })

    it('should clean up even if drag never started (small movement)', async () => {
      const { result } = renderHook(() => usePinDrag(mockConfig))

      const mouseDownEvent = {
        button: 0,
        clientX: 500,
        clientY: 400,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handleMouseDown(mouseDownEvent)
      })

      const mouseUpEvent = {
        clientX: 501,
        clientY: 400,
      } as MouseEvent

      act(() => {
        const upHandler = (global.window.addEventListener as jest.Mock).mock.calls.find(
          (call) => call[0] === 'mouseup'
        )?.[1]
        if (upHandler) upHandler(mouseUpEvent)
      })

      // Should still clean up even though drag never started
      await waitFor(() => {
        expect(global.window.removeEventListener).toHaveBeenCalled()
      })
    })
  })

  describe('layer lock prevention', () => {
    it('should not start drag when layer is locked', () => {
      const onSelectPin = vi.fn()

      const { result } = renderHook(() =>
        usePinDrag({
          ...mockConfig,
          isLocked: true,
          onSelectPin,
        })
      )

      const mouseDownEvent = {
        button: 0,
        clientX: 500,
        clientY: 400,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handleMouseDown(mouseDownEvent)
      })

      // Should not start dragging
      expect(result.current.isDragging).toBe(false)

      // Should not call onSelectPin
      expect(onSelectPin).not.toHaveBeenCalled()

      // Should not add event listeners
      expect(global.window.addEventListener).not.toHaveBeenCalled()
    })

    it('should respect isLocked changes between renders', () => {
      const { result, rerender } = renderHook(
        ({ isLocked }) => usePinDrag({ ...mockConfig, isLocked }),
        { initialProps: { isLocked: false } }
      )

      // Should work when not locked
      const mouseDownEvent = {
        button: 0,
        clientX: 500,
        clientY: 400,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handleMouseDown(mouseDownEvent)
      })

      expect(global.window.addEventListener).toHaveBeenCalled()

      // Reset and lock
      vi.clearAllMocks()
      rerender({ isLocked: true })

      act(() => {
        result.current.handleMouseDown(mouseDownEvent)
      })

      // Should not add event listeners when locked
      expect(global.window.addEventListener).not.toHaveBeenCalled()
    })
  })

  describe('mouse button handling', () => {
    it('should only start drag on left mouse button (button 0)', () => {
      const { result } = renderHook(() => usePinDrag(mockConfig))

      const rightClickEvent = {
        button: 2, // Right mouse button
        clientX: 500,
        clientY: 400,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handleMouseDown(rightClickEvent)
      })

      // Should not start dragging
      expect(result.current.isDragging).toBe(false)
      expect(global.window.addEventListener).not.toHaveBeenCalled()
    })

    it('should ignore middle mouse button', () => {
      const { result } = renderHook(() => usePinDrag(mockConfig))

      const middleClickEvent = {
        button: 1, // Middle mouse button
        clientX: 500,
        clientY: 400,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handleMouseDown(middleClickEvent)
      })

      // Should not start dragging
      expect(result.current.isDragging).toBe(false)
      expect(global.window.addEventListener).not.toHaveBeenCalled()
    })
  })

  describe('scale handling', () => {
    it('should adjust movement by scale factor', () => {
      const { result } = renderHook(() =>
        usePinDrag({
          ...mockConfig,
          scale: 2, // 2x zoom
        })
      )

      const mouseDownEvent = {
        button: 0,
        clientX: 500,
        clientY: 400,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handleMouseDown(mouseDownEvent)
      })

      // Move 10px on screen at 2x scale = 5px actual movement
      const mouseMoveEvent = {
        clientX: 510,
        clientY: 400,
      } as MouseEvent

      act(() => {
        const moveHandler = (global.window.addEventListener as jest.Mock).mock.calls.find(
          (call) => call[0] === 'mousemove'
        )?.[1]
        if (moveHandler) moveHandler(mouseMoveEvent)
      })

      // With scale=2, 10px screen movement = 5px actual
      // Should still start dragging (5px > 3px threshold)
      expect(result.current.isDragging).toBe(true)
    })
  })

  describe('error handling', () => {
    it('should handle updatePinPosition errors gracefully', async () => {
      const onUpdatePin = vi.fn()
      vi.mocked(updatePinPosition).mockRejectedValue(new Error('Database error'))

      const { result } = renderHook(() =>
        usePinDrag({
          ...mockConfig,
          onUpdatePin,
        })
      )

      const mouseDownEvent = {
        button: 0,
        clientX: 500,
        clientY: 400,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.handleMouseDown(mouseDownEvent)
      })

      const mouseMoveEvent = {
        clientX: 600,
        clientY: 500,
      } as MouseEvent

      act(() => {
        const moveHandler = (global.window.addEventListener as jest.Mock).mock.calls.find(
          (call) => call[0] === 'mousemove'
        )?.[1]
        if (moveHandler) moveHandler(mouseMoveEvent)
      })

      const mouseUpEvent = {
        clientX: 600,
        clientY: 500,
      } as MouseEvent

      act(() => {
        const upHandler = (global.window.addEventListener as jest.Mock).mock.calls.find(
          (call) => call[0] === 'mouseup'
        )?.[1]
        if (upHandler) upHandler(mouseUpEvent)
      })

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(
          'Failed to save pin position. Please check your connection.',
          'error'
        )
      })
    })
  })
})
