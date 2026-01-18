"use client";

import { Suspense } from "react";
import { MapCanvas } from "@/components/world/ui/map-canvas";
import { Sidebar } from "@/components/world/ui/sidebar";
import { WorldNavigation } from "@/components/world/ui/world-navigation";
import { AutosaveIndicator } from "@/components/world/ui/autosave-indicator";
import { SidebarSkeleton } from "@/components/world/ui/sidebar-skeleton";
import { MapSkeleton } from "@/components/world/ui/map-skeleton";
import { useResizableSidebar } from "@/components/world/logic/use-resizable-sidebar";
import { useWorldInitialization } from "@/components/world/logic/use-world-initialization";
import { useAutosavePreparation } from "@/components/world/logic/use-autosave-preparation";
import { useAutosave } from "@/hooks/use-autosave";
import { updateWorldState } from "@/actions/worlds";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useLoreStore } from "@/stores/use-lore-store";
import type { OptimizedWorld } from "@/types/world.type";
import type { Pin } from "@/types/pin.type";
import type { LoreEntry } from "@/types/lore.type";

interface WorldClientProps {
  world: OptimizedWorld;
  pins: Pin[];
  loreEntries: LoreEntry[];
  isAuthenticated: boolean;
}

export function WorldClient({ world, pins, loreEntries, isAuthenticated }: WorldClientProps) {
  // Initialize layers from world data (handle undefined from Prisma)
  useWorldInitialization(world.layers ?? null);

  // Initialize lore store with server data
  const setLoreEntries = useLoreStore((state) => state.setLoreEntries);
  if (loreEntries && loreEntries.length > 0) {
    setLoreEntries(loreEntries);
  }

  // Sidebar state
  const { width, isCollapsed, isResizing, startResize, toggleCollapse, sidebarRef } = useResizableSidebar();

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
      onError: (error) => {
        console.error("[WorldClient] Autosave error:", error);
      },
    }
  );

  const hasLayers = !!world.layers && world.layers.length > 0;
  const hasPins = pins.length > 0;

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("[WorldClient] Component error:", error);
        console.error("[WorldClient] Component stack:", errorInfo.componentStack);
      }}
    >
      <div className="h-screen bg-background-base flex flex-col">
        <WorldNavigation />
        <div className="flex flex-1 overflow-hidden">
          <ErrorBoundary
            fallback={
              <div className="w-64 bg-background-card border-r border-border-subtle p-4 flex items-center justify-center">
                <p className="text-sm text-text-secondary">Sidebar failed to load</p>
              </div>
            }
          >
            <Suspense fallback={<SidebarSkeleton />}>
              <Sidebar
                ref={sidebarRef}
                slug={world.title}
                worldId={world.id}
                width={width}
                isCollapsed={isCollapsed}
                isResizing={isResizing}
                onToggle={toggleCollapse}
                onResizeStart={startResize}
                worldLayers={world.layers}
                showPinsSection={hasLayers}
                mapImage={world.map}
                initialPins={pins}
              />
            </Suspense>
          </ErrorBoundary>
          <main className="flex-1 relative flex flex-col">
            <ErrorBoundary
              fallback={
                <div className="flex-1 flex items-center justify-center bg-background-base">
                  <p className="text-text-secondary">Map canvas failed to load</p>
                </div>
              }
            >
              <Suspense fallback={<MapSkeleton />}>
                <MapCanvas mapImage={world.map} worldId={world.id} />
              </Suspense>
            </ErrorBoundary>
            <AutosaveIndicator status={status} />
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
