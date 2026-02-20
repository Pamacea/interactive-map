/**
 * Viewport Store - Manages map viewport state (zoom, pan, scale)
 *
 * Synchronizes state between main map and mini-map.
 * Persists to localStorage for cross-session consistency.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ViewportTransform {
  scale: number;
  translateX: number;
  translateY: number;
}

interface ViewportState {
  // Current viewport transform
  transform: ViewportTransform;

  // Scale options (map scale ratios)
  scaleOption: "1:1" | "1:10" | "1:100" | "1:1000" | "1:10000";

  // Viewport bounds (for mini-map)
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } | null;

  // Actions
  setTransform: (transform: ViewportTransform) => void;
  setScale: (scale: number) => void;
  setTranslateX: (x: number) => void;
  setTranslateY: (y: number) => void;
  setScaleOption: (option: ViewportState["scaleOption"]) => void;
  setBounds: (bounds: ViewportState["bounds"]) => void;
  reset: () => void;
  center: () => void;

  // Zoom helpers
  zoomIn: (step?: number) => void;
  zoomOut: (step?: number) => void;
}

const DEFAULT_TRANSFORM: ViewportTransform = {
  scale: 1,
  translateX: 0,
  translateY: 0,
};

const SCALE_TO_ZOOM: Record<ViewportState["scaleOption"], number> = {
  "1:1": 4.0,
  "1:10": 2.0,
  "1:100": 1.0,
  "1:1000": 0.5,
  "1:10000": 0.25,
};

export const useViewportStore = create<ViewportState>()(
  persist(
    (set, get) => ({
      transform: DEFAULT_TRANSFORM,
      scaleOption: "1:100",
      bounds: null,

      setTransform: (transform) => set({ transform }),

      setScale: (scale) =>
        set((state) => ({
          transform: { ...state.transform, scale: Math.max(0.1, Math.min(5, scale)) },
        })),

      setTranslateX: (translateX) =>
        set((state) => ({
          transform: { ...state.transform, translateX },
        })),

      setTranslateY: (translateY) =>
        set((state) => ({
          transform: { ...state.transform, translateY },
        })),

      setScaleOption: (scaleOption) =>
        set(() => {
          const targetZoom = SCALE_TO_ZOOM[scaleOption];
          return {
            scaleOption,
            transform: {
              ...get().transform,
              scale: targetZoom,
            },
          };
        }),

      setBounds: (bounds) => set({ bounds }),

      reset: () =>
        set({
          transform: DEFAULT_TRANSFORM,
          scaleOption: "1:100",
        }),

      center: () =>
        set({
          transform: DEFAULT_TRANSFORM,
        }),

      zoomIn: (step = 0.2) =>
        set((state) => {
          const newScale = Math.min(state.transform.scale + step, 5);
          return {
            transform: { ...state.transform, scale: newScale },
          };
        }),

      zoomOut: (step = 0.2) =>
        set((state) => {
          const newScale = Math.max(state.transform.scale - step, 0.1);
          return {
            transform: { ...state.transform, scale: newScale },
          };
        }),
    }),
    {
      name: "viewport-storage",
      partialize: (state) => ({
        scaleOption: state.scaleOption,
        // Don't persist transform - it's session-specific
      }),
    }
  )
);

// Selector hooks for optimized re-renders
export const useViewportTransform = () =>
  useViewportStore((state) => state.transform);
export const useViewportScale = () =>
  useViewportStore((state) => state.transform.scale);
export const useViewportTranslate = () =>
  useViewportStore((state) => ({
    translateX: state.transform.translateX,
    translateY: state.transform.translateY,
  }));
export const useScaleOption = () =>
  useViewportStore((state) => state.scaleOption);
export const useViewportBounds = () =>
  useViewportStore((state) => state.bounds);
