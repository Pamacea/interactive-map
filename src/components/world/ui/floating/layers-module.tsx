"use client";

import { Layers } from "lucide-react";
import { FloatingPanel } from "./floating-panel";
import { LayersPanel } from "../layers-panel";
import type { OptimizedWorldLayer } from "@/types/world.type";

interface LayersModuleProps {
  worldId: string;
  worldLayers?: OptimizedWorldLayer[];
  mapImage?: string | null;
}

export function LayersModule({ worldId, worldLayers, mapImage }: LayersModuleProps) {
  return (
    <FloatingPanel
      panelId="layers"
      title="Layers"
      icon={<Layers className="w-4 h-4" />}
    >
      <LayersPanel worldId={worldId} worldLayers={worldLayers} mapImage={mapImage} />
    </FloatingPanel>
  );
}
