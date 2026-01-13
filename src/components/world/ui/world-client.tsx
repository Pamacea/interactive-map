"use client";

import { useEffect } from "react";
import { MapCanvas } from "@/components/world/ui/map-canvas";
import { Sidebar } from "@/components/world/ui/sidebar";
import { WorldNavigation } from "@/components/world/ui/world-navigation";
import { AutosaveIndicator } from "@/components/world/ui/autosave-indicator";
import { useResizableSidebar } from "@/components/world/logic/use-resizable-sidebar";
import { useMapStore } from "@/stores/map-store";
import { useAutosave } from "@/hooks/use-autosave";
import { updateWorldState } from "@/actions/worlds";
import type { GameWorld } from "@/types/world.type";

interface WorldClientProps {
  world: GameWorld;
}

export function WorldClient({ world }: WorldClientProps) {
  const { width, isCollapsed, isResizing, startResize, toggleCollapse, sidebarRef } = useResizableSidebar();
  const setLayers = useMapStore((state) => state.setLayers);
  const layers = useMapStore((state) => state.layers);
  const grid = useMapStore((state) => state.grid);
  const snap = useMapStore((state) => state.snap);
  const scale = useMapStore((state) => state.scale);

  // Initialize layers from world data
  useEffect(() => {
    if (world.layers && world.layers.length > 0) {
      const mappedLayers = world.layers.map((layer) => ({
        id: layer.id,
        name: layer.name,
        visible: layer.isVisible,
        locked: false,
        opacity: layer.opacity,
        zIndex: layer.zIndex,
      }));
      setLayers(mappedLayers);
    }
  }, [world.layers, setLayers]);

  // Prepare world state for autosave
  const worldState = {
    layers,
    grid,
    snap,
    scale,
  };

  // Setup autosave
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
      onError: (error) => {
        console.error("[WorldClient] Autosave error:", error);
      },
    }
  );

  // DEBUG: Log what WorldClient receives
  console.log("[DEBUG WorldClient] Component props:", {
    worldId: world.id,
    worldTitle: world.title,
    mapImageProp: world.map,
    mapImageType: typeof world.map,
    isMapNull: world.map === null,
    isMapUndefined: world.map === undefined
  });

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
          showPinsSection={!!world.layers && world.layers.length > 0}
        />

        <main className="flex-1 relative flex flex-col">
          <MapCanvas mapImage={world.map} worldId={world.id} />
          <AutosaveIndicator status={status} />
        </main>
      </div>
    </div>
  );
}
