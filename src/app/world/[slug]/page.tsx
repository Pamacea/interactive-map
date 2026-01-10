"use client";

import { MapCanvas } from "@/components/world/ui/map-canvas";
import { Sidebar } from "@/components/world/ui/sidebar";
import { WorldNavigation } from "@/components/world/ui/world-navigation";
import { useResizableSidebar } from "@/components/world/logic/use-resizable-sidebar";
import { useParams } from "next/navigation";

export default function WorldDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { width, isCollapsed, isResizing, startResize, toggleCollapse } = useResizableSidebar();

  return (
    <div className="h-screen bg-background-base">
      <WorldNavigation />
      <div className="flex h-[calc(100vh-3rem)]">
        <Sidebar
          slug={slug}
          width={width}
          isCollapsed={isCollapsed}
          isResizing={isResizing}
          onToggle={toggleCollapse}
          onResizeStart={startResize}
        />

        <main className="flex-1 relative">
          <MapCanvas />
        </main>
      </div>
    </div>
  );
}
