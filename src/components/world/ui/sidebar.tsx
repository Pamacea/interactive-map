"use client";

import { useState, ForwardedRef, forwardRef } from "react";
import { Layers, Settings2, ChevronRight, ChevronLeft } from "lucide-react";
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

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ slug, worldId, width, isCollapsed, isResizing, onToggle, onResizeStart, worldLayers }, ref) => {
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
        ref={ref}
        className={`relative h-full flex flex-col bg-background-card border-r border-border-subtle ${
          isResizing ? "" : "transition-all duration-300 ease-in-out"
        }`}
        style={{ width: isCollapsed ? 70 : width }}
      >
        <button
          onClick={onToggle}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-12 w-4 -translate-x-1/2 rounded-md bg-background-card/90 backdrop-blur-sm border border-border-subtle text-text-muted hover:text-accent-gold hover:border-accent-gold/50 hover:bg-accent-gold/10 transition-all duration-200 flex items-center justify-center shadow-sm"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <SidebarHeader title={title} worldId={worldId} isCollapsed={isCollapsed} onTitleUpdate={() => {}} />

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
);

Sidebar.displayName = "Sidebar";
