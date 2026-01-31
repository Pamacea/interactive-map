"use client";

/* eslint-disable simple-import-sort/imports */
import { Suspense, useCallback, lazy, memo, useEffect } from "react";
import { MapSkeleton } from "@/components/world/ui/map-skeleton";
import { useWorldInitialization } from "@/components/world/logic/use-world-initialization";
import { useAutosavePreparation } from "@/components/world/logic/use-autosave-preparation";
import { useAutosave } from "@/hooks/use-autosave";
import { useKeyboardShortcut, SHORTCUTS } from "@/hooks/use-keyboard-shortcut";
import { updateWorldState } from "@/actions/worlds";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { MapExportProvider, useMapExport } from "@/components/export/utils/use-map-export-context";
import { useLoreStore } from "@/stores/use-lore-store";
import { useSelectPin, useSetPins } from "@/stores/use-pins-store";
import { useSearchStore } from "@/store/use-search-store";
import {
  FloatingHeader,
  ModuleDock,
  LayersModule,
  LoreModule,
  FiltersModule,
  PropertiesModule,
} from "@/components/world/ui/floating";
import type { OptimizedWorld } from "@/types/world.type";
import type { Pin } from "@/types/pin.type";
import type { LoreEntry } from "@/types/lore.type";
import type { SearchResultItem } from "@/lib/search-types";

// Dynamic import for MapCanvas to avoid SSR and reduce initial bundle size
// This prevents MapLibre GL (1MB+) from being included in server bundle
// Note: Skeleton components must NOT be lazy-loaded as they need to render immediately
const MapCanvas = lazy(() =>
  import("@/components/world/ui/map-canvas").then((mod) => ({
    default: mod.MapCanvas,
  }))
);

interface WorldClientProps {
  world: OptimizedWorld;
  pins: Pin[];
  loreEntries: LoreEntry[];
  isAuthenticated: boolean;
}

function FloatingUI({ world, pins }: { world: OptimizedWorld; pins: Pin[] }) {
  const { getMapElement } = useMapExport();
  const mapElement = getMapElement();

  const hasLayers = !!world.layers && world.layers.length > 0;

  return (
    <>
      {/* Floating header (bottom-right) */}
      <FloatingHeader
        worldTitle={world.title}
        worldId={world.id}
        mapElement={mapElement}
      />

      {/* Module dock (bottom-left) */}
      <ModuleDock />

      {/* Floating modules */}
      <LayersModule
        worldId={world.id}
        worldLayers={world.layers ?? undefined}
        mapImage={world.map}
      />

      <LoreModule worldId={world.id} />

      <FiltersModule />

      <PropertiesModule />
    </>
  );
}

export const WorldClient = memo(function WorldClient({
  world,
  pins,
  loreEntries,
  isAuthenticated,
}: WorldClientProps) {
  // Initialize layers from world data (handle undefined from Prisma)
  useWorldInitialization(world.layers ?? null);

  // Initialize lore store with server data
  const setLoreEntries = useLoreStore((state) => state.setLoreEntries);
  if (loreEntries && loreEntries.length > 0) {
    setLoreEntries(loreEntries);
  }

  // Initialize pins store with initialPins from props
  const setPins = useSetPins();
  const selectPin = useSelectPin();

  // Initialize pins in store
  useEffect(() => {
    if (pins && pins.length > 0) {
      setPins(pins as any);
    }
  }, [pins, setPins]);

  // Search store for keyboard shortcut
  const toggleSearch = useSearchStore((state) => state.toggleSearch);

  // Handle search result clicks
  const handleSearchResultClick = useCallback(
    (result: SearchResultItem) => {
      if (result.type === "pin") {
        // Select the pin and center on it
        selectPin(result.id);
      } else {
        // Handle lore entry clicks
      }
    },
    [selectPin]
  );

  // Register keyboard shortcuts
  useKeyboardShortcut([
    {
      ...SHORTCUTS.SEARCH,
      handler: toggleSearch,
    },
  ]);

  // Prepare world state for autosave
  const worldState = useAutosavePreparation(pins.length);

  // Setup autosave with authentication state
  const { status } = useAutosave(
    `world-${world.id}`,
    worldState,
    async (data) => {
      await updateWorldState(world.id, {
        layers: data.layers,
        grid: data.grid,
        snap: data.snap,
        scale: data.scale,
      });
    },
    {
      delay: 3000,
      enabled: true,
      isAuthenticated,
    }
  );

  return (
    <ErrorBoundary>
      <MapExportProvider>
        <div className="h-screen bg-background-base relative">
          {/* Map canvas takes full screen */}
          <ErrorBoundary
            fallback={
              <div className="h-full flex items-center justify-center bg-background-base">
                <p className="text-text-secondary">Map canvas failed to load</p>
              </div>
            }
          >
            <Suspense fallback={<MapSkeleton />}>
              <MapCanvas mapImage={world.map} worldId={world.id} />
            </Suspense>
          </ErrorBoundary>

          {/* Floating UI */}
          <Suspense fallback={null}>
            <FloatingUI world={world} pins={pins} />
          </Suspense>

          {/* Autosave indicator */}
          <Suspense fallback={null}>
            {/* We'll need to adapt AutosaveIndicator to floating */}
          </Suspense>
        </div>
      </MapExportProvider>
    </ErrorBoundary>
  );
});
