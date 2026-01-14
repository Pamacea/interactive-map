"use client";

import {
  useGrid,
  useSnap,
  useMapStore,
} from "@/stores/map-store";
import { PinPropertiesSection } from "./pin-properties-section";
import { MapPropertiesSection } from "./map-properties-section";
import { usePropertiesPanel } from "../logic/use-properties-panel";

export function PropertiesPanel() {
  const grid = useGrid();
  const snap = useSnap();
  const setGrid = useMapStore((state) => state.setGrid);
  const setSnap = useMapStore((state) => state.setSnap);

  const { selectedPin, formState, isUpdating, handleUpdatePin } =
    usePropertiesPanel();

  return (
    <div className="space-y-4">
      {selectedPin ? (
        <PinPropertiesSection
          pin={selectedPin}
          formState={formState}
          isUpdating={isUpdating}
          onUpdate={handleUpdatePin}
        />
      ) : (
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
            <svg
              className="w-4 h-4 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs font-display font-medium text-text-secondary uppercase tracking-wider">
              Pin Properties
            </span>
          </div>
          <div className="px-3 py-4 rounded-sm bg-background-elevated border border-border-subtle text-center">
            <p className="text-sm text-text-muted">No pin selected</p>
            <p className="text-xs text-text-muted/70 mt-1">
              Click a pin on the map to edit its properties
            </p>
          </div>
        </section>
      )}

      <MapPropertiesSection
        grid={grid}
        snap={snap}
        onGridChange={setGrid}
        onSnapChange={setSnap}
      />
    </div>
  );
}
