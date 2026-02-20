"use client";

import {
  useGrid,
  useSnap,
  useMapStore,
} from "@/stores/map-store";
import { PinPropertiesSection } from "./pin-properties-section";
import { MapPropertiesSection } from "./map-properties-section";
import { usePropertiesPanel } from "../logic/use-properties-panel";
import { eventManager } from "@/lib/event-manager";
import { useEffect } from "react";
import { MapPin } from "lucide-react";

export function PropertiesPanel() {
  const grid = useGrid();
  const snap = useSnap();
  const setGrid = useMapStore((state) => state.setGrid);
  const setSnap = useMapStore((state) => state.setSnap);

  const { selectedPin, formState, isUpdating, error, handleUpdatePin, handleIconUpload, retryUpdate } =
    usePropertiesPanel();

  // Capture sidebar events when pin is selected
  useEffect(() => {
    if (selectedPin) {
      const release = eventManager.capture("sidebar");
      return () => release();
    }
  }, [selectedPin]);

  return (
    <div className="space-y-4">
      {selectedPin ? (
        <PinPropertiesSection
          pin={selectedPin}
          formState={formState}
          isUpdating={isUpdating}
          error={error}
          onUpdate={handleUpdatePin}
          onIconUpload={handleIconUpload}
          onRetry={retryUpdate}
        />
      ) : (
        <section className="space-y-3">
          <div className="relative flex items-center gap-2 px-3 py-2.5  bg-stone/50 border-t border-accent-gold/50 border-b-iron/50">
            <MapPin className="w-4 h-4 text-accent-gold/60" />
            <span className="text-xs font-display font-semibold text-accent-gold uppercase tracking-widest">
              Pin Properties
            </span>
            <div className="ml-auto flex items-center gap-1">
              <span className="text-accent-gold/30 text-xs">ᛟ</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
          </div>
          <div className="px-3 py-6 rounded-b-md bg-obsidian/60 border-x border-b border-iron/50 text-center">
            <p className="text-sm text-bone-dark font-fell">No pin selected</p>
            <p className="text-xs text-bone-dark/60 mt-2 font-fell">
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
