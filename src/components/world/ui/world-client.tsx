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
import type { OptimizedWorld } from "@/types/world.type";
import type { Pin } from "@/types/pin.type";

interface WorldClientProps {
  world: OptimizedWorld;
  pins: Pin[];
  isAuthenticated: boolean;
}

export function WorldClient({ world, pins, isAuthenticated }: WorldClientProps) {
  // Initialize layers from world data (handle undefined from Prisma)
  useWorldInitialization(world.layers ?? null);

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
    <div className="h-screen bg-background-base flex flex-col">
      <WorldNavigation />
      <div className="flex flex-1 overflow-hidden">
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
        <main className="flex-1 relative flex flex-col">
          <Suspense fallback={<MapSkeleton />}>
            <MapCanvas mapImage={world.map} worldId={world.id} />
          </Suspense>
          <AutosaveIndicator status={status} />
        </main>
      </div>
    </div>
  );
}
