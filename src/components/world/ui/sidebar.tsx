"use client";

import { useState } from "react";
import { Layers, Settings2 } from "lucide-react";
import { LayersPanel } from "./layers-panel";
import { PropertiesPanel } from "./properties-panel";
import { SidebarHeader } from "./sidebar-header";
import { ResizeHandle } from "./resize-handle";
import { CollapsibleSection } from "./collapsible-section";
import type { MapLayer } from "@/types/world.type";

interface SidebarProps {
  slug: string;
  worldId: string;
  width: number;
  isCollapsed: boolean;
  isResizing: boolean;
  onToggle: () => void;
  onResizeStart: (e: React.MouseEvent) => void;
  worldLayers?: MapLayer[];
}

export function Sidebar({ slug, worldId, width, isCollapsed, isResizing, onToggle, onResizeStart, worldLayers }: SidebarProps) {
  const [layersOpen, setLayersOpen] = useState(true);
  const [propertiesOpen, setPropertiesOpen] = useState(true);
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const handleIconClick = (section: "layers" | "properties") => {
    if (section === "layers") {
      setLayersOpen(true);
      setPropertiesOpen(false);
    } else {
      setLayersOpen(false);
      setPropertiesOpen(true);
    }
    onToggle();
  };

  return (
    <div
      className="relative h-full flex flex-col bg-background-card border-r border-border-subtle transition-all duration-300 ease-in-out"
      style={{ width: isCollapsed ? 70 : width }}
    >
      <SidebarHeader title={title} worldId={worldId} isCollapsed={isCollapsed} onToggle={onToggle} />

      {isCollapsed ? (
        <div className="flex-1 flex flex-col items-center py-4 gap-2">
          <button
            onClick={() => handleIconClick("layers")}
            className="relative w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-200 group text-text-muted hover:text-accent-gold hover:bg-background-elevated"
            title="Layers"
          >
            <Layers className="w-5 h-5" />
            <span className="absolute left-full ml-3 px-2 py-1 text-sm font-medium bg-background-elevated border border-border-subtle text-text-primary rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
              Layers
            </span>
          </button>

          <button
            onClick={() => handleIconClick("properties")}
            className="relative w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-200 group text-text-muted hover:text-accent-gold hover:bg-background-elevated"
            title="Properties"
          >
            <Settings2 className="w-5 h-5" />
            <span className="absolute left-full ml-3 px-2 py-1 text-sm font-medium bg-background-elevated border border-border-subtle text-text-primary rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
              Properties
            </span>
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <CollapsibleSection title="Layers" isOpen={layersOpen} onToggle={() => setLayersOpen(!layersOpen)}>
            <LayersPanel worldLayers={worldLayers} />
          </CollapsibleSection>

          <CollapsibleSection title="Properties" isOpen={propertiesOpen} onToggle={() => setPropertiesOpen(!propertiesOpen)}>
            <PropertiesPanel />
          </CollapsibleSection>
        </div>
      )}

      <ResizeHandle onResizeStart={onResizeStart} isResizing={isResizing} />
    </div>
  );
}

