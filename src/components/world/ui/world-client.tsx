"use client";

import { Suspense, useCallback, lazy, memo, useEffect } from "react";
import { MapSkeleton } from "@/components/world/ui/map-skeleton";
import { FloatingParticles } from "@/components/ui/particles";
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
  MembersModule,
  CharactersModule,
  ActivityModule,
  CommentsModule,
} from "@/components/world/ui/floating";
import type { OptimizedWorld } from "@/types/world.type";
import type { Pin } from "@/types/pin.type";
import type { LoreEntry } from "@/types/lore.type";
import type { Character } from "@prisma/client";
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
  characters: Character[];
  isAuthenticated: boolean;
  currentUserId?: string;
  worldOwnerId: string;
}

function FloatingUI({ world, pins, currentUserId, worldOwnerId }: {
  world: OptimizedWorld;
  pins: Pin[];
  currentUserId?: string;
  worldOwnerId: string;
}) {
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

      <CharactersModule worldId={world.id} />

      <FiltersModule />

      <PropertiesModule />

      {/* Members module - only show if authenticated */}
      {currentUserId && (
        <MembersModule
          worldId={world.id}
          worldOwnerId={worldOwnerId}
          currentUserId={currentUserId}
        />
      )}

      {/* Activity module - only show if authenticated */}
      {currentUserId && (
        <ActivityModule worldId={world.id} />
      )}

      {/* Comments module - only show if authenticated */}
      {currentUserId && (
        <CommentsModule worldId={world.id} />
      )}
    </>
  );
}

export const WorldClient = memo(function WorldClient({
  world,
  pins,
  loreEntries,
  characters,
  isAuthenticated,
  currentUserId,
  worldOwnerId,
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
        <div className="h-screen bg-void relative overflow-hidden">
          {/* Fantasy background effects */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-grain opacity-[0.04]" aria-hidden="true" />
            <FloatingParticles />
          </div>

          {/* Ambient glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-accent-gold/5 rounded-sm blur-[150px] pointer-events-none" />

          {/* Map canvas takes full screen */}
          <ErrorBoundary
            onError={(error, errorInfo) => {
              console.error("[MapCanvas ErrorBoundary] Error:", error);
              console.error("[MapCanvas ErrorBoundary] Error message:", error.message);
              console.error("[MapCanvas ErrorBoundary] Stack:", error.stack);
              console.error("[MapCanvas ErrorBoundary] Component stack:", errorInfo.componentStack);
              // Store error globally for debugging
              (window as any).__lastError = {
                message: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack
              };
            }}
            fallback={
              <div className="h-full flex items-center justify-center bg-void">
                <div className="text-center">
                  <p className="text-bone-dark mb-2">Map canvas failed to load</p>
                  <p className="text-xs text-text-muted">Check console for details</p>
                </div>
              </div>
            }
          >
            <Suspense fallback={<MapSkeleton />}>
              <MapCanvas mapImage={world.map} worldId={world.id} />
            </Suspense>
          </ErrorBoundary>

          {/* Floating UI */}
          <Suspense fallback={null}>
            <FloatingUI
              world={world}
              pins={pins}
              currentUserId={currentUserId}
              worldOwnerId={worldOwnerId}
            />
          </Suspense>

          {/* Pass characters to MapCanvas for character popup support */}
          <script
            id="world-characters-data"
            type="application/json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                characters.map((c) => ({
                  id: c.id,
                  name: c.name,
                  portraitUrl: c.portraitUrl,
                  characterType: c.characterType,
                  level: c.level,
                  faction: c.faction,
                }))
              ),
            }}
          />

          {/* Autosave indicator */}
          <Suspense fallback={null}>
            {/* We'll need to adapt AutosaveIndicator to floating */}
          </Suspense>
        </div>
      </MapExportProvider>
    </ErrorBoundary>
  );
});
