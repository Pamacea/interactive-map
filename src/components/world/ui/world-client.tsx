"use client";

import { useEffect } from "react";
import { MapCanvas } from "@/components/world/ui/map-canvas";
import { Sidebar } from "@/components/world/ui/sidebar";
import { WorldNavigation } from "@/components/world/ui/world-navigation";
import { useResizableSidebar } from "@/components/world/logic/use-resizable-sidebar";
import { useMapStore } from "@/stores/map-store";
import type { GameWorld } from "@/types/world.type";

interface WorldClientProps {
  world: GameWorld;
}

export function WorldClient({ world }: WorldClientProps) {
  const { width, isCollapsed, isResizing, startResize, toggleCollapse, sidebarRef } = useResizableSidebar();
  const setLayers = useMapStore((state) => state.setLayers);

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

  return (
    <div className="h-screen bg-background-base">
      <WorldNavigation />
      <div className="flex h-[calc(100vh-3rem)]">
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
        />

        <main className="flex-1 relative">
          <MapCanvas mapImage={world.map} />
        </main>
      </div>
    </div>
  );
}
