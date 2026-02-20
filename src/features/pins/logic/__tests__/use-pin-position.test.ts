import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { usePinPosition } from '../use-pin-position'
import type { Pin } from '@prisma/client'

describe('usePinPosition', () => {
  const mockPin: Pin & {
    layer?: {
      id: string
      isVisible: boolean
      zIndex: number
    } | null
  } = {
    id: 'pin-123',
    title: 'Test Pin',
    description: null,
    pinType: 'CITY',
    latitude: 0.5,
    longitude: 0.5,
    icon: null,
    color: null,
    size: 32,
    opacity: 1,
    isVisible: true,
    gameWorldId: 'world-123',
    userId: 'user-123',
    layerId: null,
    minZoom: 0,
    maxZoom: 200,
    properties: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    layer: null,
  }

  const _mockImageDimensions = { width: 1920, height: 1080 }
  const _mockTransform = { scale: 1, translateX: 0, translateY: 0 }
  const mockLayers = [
    { id: 'layer-1', offsetX: 100, offsetY: 50, locked: false },
    { id: 'layer-2', offsetX: -50, offsetY: -25, locked: true },
  ]

  describe('coordinate conversion', () => {
    it('should convert latitude/longitude to pixel coordinates', () => {
      const { result } = renderHook(() =>
        usePinPosition(mockPin, null, mockImageDimensions, mockTransform, mockLayers)
      )

      // 0.5 * 1920 = 960, 0.5 * 1080 = 540
      expect(result.current.x).toBe(960)
      expect(result.current.y).toBe(540)
    })

    it('should handle zero coordinates (top-left corner)', () => {
      const zeroPin = { ...mockPin, latitude: 0, longitude: 0 }

      const { result } = renderHook(() =>
        usePinPosition(zeroPin, null, mockImageDimensions, mockTransform, mockLayers)
      )

      expect(result.current.x).toBe(0)
      expect(result.current.y).toBe(0)
    })

    it('should handle maximum coordinates (bottom-right corner)', () => {
      const maxPin = { ...mockPin, latitude: 1, longitude: 1 }

      const { result } = renderHook(() =>
        usePinPosition(maxPin, null, mockImageDimensions, mockTransform, mockLayers)
      )

      expect(result.current.x).toBe(1920)
      expect(result.current.y).toBe(1080)
    })

    it('should handle fractional coordinates correctly', () => {
      const fractionalPin = { ...mockPin, latitude: 0.25, longitude: 0.75 }

      const { result } = renderHook(() =>
        usePinPosition(fractionalPin, null, mockImageDimensions, mockTransform, mockLayers)
      )

      // 0.75 * 1920 = 1440, 0.25 * 1080 = 270
      expect(result.current.x).toBe(1440)
      expect(result.current.y).toBe(270)
    })
  })

  describe('layer offset application', () => {
    it('should apply layer offset when pin belongs to a layer', () => {
      const pinWithLayer = {
        ...mockPin,
        layerId: 'layer-1',
        layer: { id: 'layer-1', isVisible: true, zIndex: 0 },
      }

      const { result } = renderHook(() =>
        usePinPosition(pinWithLayer, null, mockImageDimensions, mockTransform, mockLayers)
      )

      // Base position: (960, 540)
      // Layer offset: (100, 50)
      // Expected: (1060, 590)
      expect(result.current.x).toBe(1060)
      expect(result.current.y).toBe(590)
    })

    it('should apply negative layer offsets', () => {
      const pinWithLayer = {
        ...mockPin,
        layerId: 'layer-2',
        layer: { id: 'layer-2', isVisible: true, zIndex: 1 },
      }

      const { result } = renderHook(() =>
        usePinPosition(pinWithLayer, null, mockImageDimensions, mockTransform, mockLayers)
      )

      // Base position: (960, 540)
      // Layer offset: (-50, -25)
      // Expected: (910, 515)
      expect(result.current.x).toBe(910)
      expect(result.current.y).toBe(515)
    })

    it('should handle zero layer offsets', () => {
      const layersWithZero = [{ id: 'layer-3', offsetX: 0, offsetY: 0, locked: false }]
      const pinWithLayer = {
        ...mockPin,
        layerId: 'layer-3',
        layer: { id: 'layer-3', isVisible: true, zIndex: 0 },
      }

      const { result } = renderHook(() =>
        usePinPosition(pinWithLayer, null, mockImageDimensions, mockTransform, layersWithZero)
      )

      // Should be same as base position when offset is zero
      expect(result.current.x).toBe(960)
      expect(result.current.y).toBe(540)
    })

    it('should use zero offset when layer is not found', () => {
      const pinWithMissingLayer = {
        ...mockPin,
        layerId: 'non-existent-layer',
        layer: null,
      }

      const { result } = renderHook(() =>
        usePinPosition(pinWithMissingLayer, null, mockImageDimensions, mockTransform, mockLayers)
      )

      // Should fall back to zero offset
      expect(result.current.x).toBe(960)
      expect(result.current.y).toBe(540)
      expect(result.current.layerOffsetX).toBe(0)
      expect(result.current.layerOffsetY).toBe(0)
    })

    it('should handle pins without layerId', () => {
      const pinWithoutLayer = {
        ...mockPin,
        layerId: null,
        layer: null,
      }

      const { result } = renderHook(() =>
        usePinPosition(pinWithoutLayer, null, mockImageDimensions, mockTransform, mockLayers)
      )

      // Should use base position without offset
      expect(result.current.x).toBe(960)
      expect(result.current.y).toBe(540)
      expect(result.current.layer).toBeNull()
    })
  })

  describe('dimension calculation', () => {
    it('should return correct dimensions from imageDimensions', () => {
      const { result } = renderHook(() =>
        usePinPosition(mockPin, null, mockImageDimensions, mockTransform, mockLayers)
      )

      expect(result.current.actualWidth).toBe(1920)
      expect(result.current.actualHeight).toBe(1080)
    })

    it('should handle different image dimensions', () => {
      const differentDimensions = { width: 3840, height: 2160 }

      const { result } = renderHook(() =>
        usePinPosition(mockPin, null, differentDimensions, mockTransform, mockLayers)
      )

      expect(result.current.actualWidth).toBe(3840)
      expect(result.current.actualHeight).toBe(2160)

      // Position should scale with dimensions
      // 0.5 * 3840 = 1920, 0.5 * 2160 = 1080
      expect(result.current.x).toBe(1920)
      expect(result.current.y).toBe(1080)
    })

    it('should handle square image dimensions', () => {
      const squareDimensions = { width: 1000, height: 1000 }

      const { result } = renderHook(() =>
        usePinPosition(mockPin, null, squareDimensions, mockTransform, mockLayers)
      )

      expect(result.current.actualWidth).toBe(1000)
      expect(result.current.actualHeight).toBe(1000)

      // 0.5 * 1000 = 500 for both
      expect(result.current.x).toBe(500)
      expect(result.current.y).toBe(500)
    })
  })

  describe('drag position handling', () => {
    it('should use drag position when provided', () => {
      const dragPosition = { x: 1000, y: 600 }

      const { result } = renderHook(() =>
        usePinPosition(mockPin, dragPosition, mockImageDimensions, mockTransform, mockLayers)
      )

      // Should use drag position instead of pin's stored position
      expect(result.current.x).toBeCloseTo(1000, 10)
      expect(result.current.y).toBe(600)
    })

    it('should convert drag position to lat/lng coordinates', () => {
      const dragPosition = { x: 960, y: 540 }

      const { result } = renderHook(() =>
        usePinPosition(mockPin, dragPosition, mockImageDimensions, mockTransform, mockLayers)
      )

      // 960 / 1920 = 0.5, 540 / 1080 = 0.5
      expect(result.current.latitude).toBe(0.5)
      expect(result.current.longitude).toBe(0.5)
    })

    it('should apply layer offset on top of drag position', () => {
      const pinWithLayer = {
        ...mockPin,
        layerId: 'layer-1',
        layer: { id: 'layer-1', isVisible: true, zIndex: 0 },
      }
      const dragPosition = { x: 500, y: 300 }

      const { result } = renderHook(() =>
        usePinPosition(pinWithLayer, dragPosition, mockImageDimensions, mockTransform, mockLayers)
      )

      // Drag position (500, 300) + layer offset (100, 50) = (600, 350)
      expect(result.current.x).toBe(600)
      expect(result.current.y).toBe(350)
    })

    it('should handle null drag position (use pin coordinates)', () => {
      const { result } = renderHook(() =>
        usePinPosition(mockPin, null, mockImageDimensions, mockTransform, mockLayers)
      )

      // Should fall back to pin's stored coordinates
      expect(result.current.x).toBe(960)
      expect(result.current.y).toBe(540)
      expect(result.current.latitude).toBe(0.5)
      expect(result.current.longitude).toBe(0.5)
    })
  })

  describe('edge cases', () => {
    it('should handle undefined imageDimensions', () => {
      const { result } = renderHook(() =>
        usePinPosition(mockPin, null, undefined, mockTransform, mockLayers)
      )

      // Should default to 0 dimensions
      expect(result.current.actualWidth).toBe(0)
      expect(result.current.actualHeight).toBe(0)
      expect(result.current.x).toBe(0)
      expect(result.current.y).toBe(0)
    })

    it('should handle zero image dimensions', () => {
      const zeroDimensions = { width: 0, height: 0 }

      const { result } = renderHook(() =>
        usePinPosition(mockPin, null, zeroDimensions, mockTransform, mockLayers)
      )

      expect(result.current.actualWidth).toBe(0)
      expect(result.current.actualHeight).toBe(0)
      expect(result.current.x).toBe(0)
      expect(result.current.y).toBe(0)
    })

    it('should handle very small image dimensions', () => {
      const smallDimensions = { width: 100, height: 100 }

      const { result } = renderHook(() =>
        usePinPosition(mockPin, null, smallDimensions, mockTransform, mockLayers)
      )

      expect(result.current.x).toBe(50)
      expect(result.current.y).toBe(50)
    })

    it('should handle very large image dimensions', () => {
      const largeDimensions = { width: 10000, height: 8000 }

      const { result } = renderHook(() =>
        usePinPosition(mockPin, null, largeDimensions, mockTransform, mockLayers)
      )

      expect(result.current.x).toBe(5000)
      expect(result.current.y).toBe(4000)
    })

    it('should handle negative layer offsets', () => {
      const pinWithLayer = {
        ...mockPin,
        layerId: 'layer-2',
        layer: { id: 'layer-2', isVisible: true, zIndex: 1 },
      }

      const { result } = renderHook(() =>
        usePinPosition(pinWithLayer, null, mockImageDimensions, mockTransform, mockLayers)
      )

      // Base (960, 540) + offset (-50, -25) = (910, 515)
      expect(result.current.x).toBe(910)
      expect(result.current.y).toBe(515)
    })

    it('should return layer offset information', () => {
      const pinWithLayer = {
        ...mockPin,
        layerId: 'layer-1',
        layer: { id: 'layer-1', isVisible: true, zIndex: 0 },
      }

      const { result } = renderHook(() =>
        usePinPosition(pinWithLayer, null, mockImageDimensions, mockTransform, mockLayers)
      )

      expect(result.current.layerOffsetX).toBe(100)
      expect(result.current.layerOffsetY).toBe(50)
    })

    it('should return layer reference', () => {
      const pinWithLayer = {
        ...mockPin,
        layerId: 'layer-1',
        layer: { id: 'layer-1', isVisible: true, zIndex: 0 },
      }

      const { result } = renderHook(() =>
        usePinPosition(pinWithLayer, null, mockImageDimensions, mockTransform, mockLayers)
      )

      // The hook returns the layer from the layers array (with offsetX, offsetY, locked)
      // not the pin's layer object (with isVisible, zIndex)
      expect(result.current.layer).toEqual({
        id: 'layer-1',
        offsetX: 100,
        offsetY: 50,
        locked: false,
      })
    })

    it('should return null layer when pin has no layer', () => {
      const { result } = renderHook(() =>
        usePinPosition(mockPin, null, mockImageDimensions, mockTransform, mockLayers)
      )

      expect(result.current.layer).toBeNull()
    })

    it('should handle drag position that exceeds image dimensions', () => {
      const extremeDragPosition = { x: 5000, y: 3000 }

      const { result } = renderHook(() =>
        usePinPosition(mockPin, extremeDragPosition, mockImageDimensions, mockTransform, mockLayers)
      )

      // Should still use the drag position as-is (clamping happens elsewhere)
      expect(result.current.x).toBe(5000)
      expect(result.current.y).toBe(3000)

      // Lat/lng should be calculated based on image dimensions
      // 5000 / 1920 ≈ 2.6, 3000 / 1080 ≈ 2.78
      expect(result.current.latitude).toBeCloseTo(2.78, 1)
      expect(result.current.longitude).toBeCloseTo(2.6, 1)
    })
  })

  describe('memoization', () => {
    it('should memoize position calculation', () => {
      const { result, rerender } = renderHook(
        (props) =>
          usePinPosition(
            props.pin,
            props.dragPosition,
            props.imageDimensions,
            props.transform,
            props.layers
          ),
        {
          initialProps: {
            pin: mockPin,
            dragPosition: null,
            imageDimensions: mockImageDimensions,
            transform: mockTransform,
            layers: mockLayers,
          },
        }
      )

      const firstResult = result.current

      // Re-render with same props
      rerender({
        pin: mockPin,
        dragPosition: null,
        imageDimensions: mockImageDimensions,
        transform: mockTransform,
        layers: mockLayers,
      })

      const secondResult = result.current

      // Should return the same reference (memoized)
      expect(firstResult).toBe(secondResult)
    })

    it('should recalculate when props change', () => {
      const { result, rerender } = renderHook(
        (props) =>
          usePinPosition(
            props.pin,
            props.dragPosition,
            props.imageDimensions,
            props.transform,
            props.layers
          ),
        {
          initialProps: {
            pin: mockPin,
            dragPosition: null,
            imageDimensions: mockImageDimensions,
            transform: mockTransform,
            layers: mockLayers,
          },
        }
      )

      const firstResult = result.current

      // Change pin position
      const newPin = { ...mockPin, latitude: 0.75, longitude: 0.75 }
      rerender({
        pin: newPin,
        dragPosition: null,
        imageDimensions: mockImageDimensions,
        transform: mockTransform,
        layers: mockLayers,
      })

      const secondResult = result.current

      // Should return different result when props change
      expect(firstResult).not.toBe(secondResult)
      expect(secondResult.x).toBe(1440)
      expect(secondResult.y).toBe(810)
    })
  })

  describe('transform parameter', () => {
    it('should accept transform parameter but not use it in calculation', () => {
      const differentTransform = { scale: 2, translateX: 100, translateY: 50 }

      const { result } = renderHook(() =>
        usePinPosition(mockPin, null, mockImageDimensions, differentTransform, mockLayers)
      )

      // Transform should be accepted but not affect calculation
      // Position is based on pin coordinates and image dimensions only
      expect(result.current.x).toBe(960)
      expect(result.current.y).toBe(540)
    })
  })

  describe('coordinate precision', () => {
    it('should handle high-precision coordinates', () => {
      const precisePin = {
        ...mockPin,
        latitude: 0.123456789,
        longitude: 0.987654321,
      }

      const { result } = renderHook(() =>
        usePinPosition(precisePin, null, mockImageDimensions, mockTransform, mockLayers)
      )

      // Should preserve precision in returned lat/lng
      expect(result.current.latitude).toBeCloseTo(0.123456789, 9)
      expect(result.current.longitude).toBeCloseTo(0.987654321, 9)

      // Pixel coordinates should also be precise
      expect(result.current.x).toBeCloseTo(1896.297, 0)
      expect(result.current.y).toBeCloseTo(133.333, 0)
    })

    it('should handle very small coordinate values', () => {
      const tinyPin = { ...mockPin, latitude: 0.001, longitude: 0.001 }

      const { result } = renderHook(() =>
        usePinPosition(tinyPin, null, mockImageDimensions, mockTransform, mockLayers)
      )

      expect(result.current.x).toBeCloseTo(1.92, 1)
      expect(result.current.y).toBeCloseTo(1.08, 1)
    })
  })
})
