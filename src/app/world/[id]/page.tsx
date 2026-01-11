"use client";

import { MapCanvas } from "@/components/world/ui/map-canvas";
import { Sidebar } from "@/components/world/ui/sidebar";
import { WorldNavigation } from "@/components/world/ui/world-navigation";
import { useResizableSidebar } from "@/components/world/logic/use-resizable-sidebar";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getWorldById } from "@/components/world/methods/get-world-by-slug";

export default function WorldDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { width, isCollapsed, isResizing, startResize, toggleCollapse } = useResizableSidebar();

  const { data: world, isLoading } = useQuery({
    queryKey: ["world", id],
    queryFn: () => getWorldById(id),
  });

  if (isLoading) {
    return <div className="h-screen bg-background-base pt-12">Loading...</div>;
  }

  if (!world) {
    return <div className="h-screen bg-background-base pt-12">World not found</div>;
  }

  return (
    <div className="h-screen bg-background-base">
      <WorldNavigation />
      <div className="flex h-[calc(100vh-3rem)]">
        <Sidebar
          slug={world.title}
          width={width}
          isCollapsed={isCollapsed}
          isResizing={isResizing}
          onToggle={toggleCollapse}
          onResizeStart={startResize}
        />

        <main className="flex-1 relative">
          <MapCanvas mapImage={world.map} />
        </main>
      </div>
    </div>
  );
}
