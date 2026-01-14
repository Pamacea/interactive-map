"use client";

import { MapCanvas } from "@/components/world/ui/map-canvas";
import { Sidebar } from "@/components/world/ui/sidebar";
import { WorldNavigation } from "@/components/world/ui/world-navigation";
import { AutosaveIndicator } from "@/components/world/ui/autosave-indicator";
import { useResizableSidebar } from "@/components/world/logic/use-resizable-sidebar";
import { useWorldInitialization } from "@/components/world/logic/use-world-initialization";
import { useAutosavePreparation } from "@/components/world/logic/use-autosave-preparation";
import { useAutosave } from "@/hooks/use-autosave";
import { updateWorldState } from "@/actions/worlds";
import { usePins } from "@/components/pins/logic/use-pins";
import type { GameWorld } from "@/types/world.type";

interface WorldClientProps {
  world: GameWorld;
  isAuthenticated: boolean;
}

export function WorldClient({ world, isAuthenticated }: WorldClientProps) {
  // Initialize layers from world data (handle undefined from Prisma)
  useWorldInitialization(world.layers ?? null);

  // Sidebar state
  const { width, isCollapsed, isResizing, startResize, toggleCollapse, sidebarRef } = useResizableSidebar();

  // Get pins data for autosave tracking
  const { pins } = usePins(world.id);

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

  return (
    <div className="h-screen bg-background-base flex flex-col">
      <WorldNavigation />
      <div className="flex flex-1 overflow-hidden">
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
        />
        <main className="flex-1 relative flex flex-col">
          <MapCanvas mapImage={world.map} worldId={world.id} />
          <AutosaveIndicator status={status} />
        </main>
      </div>
    </div>
  );
}
