"use client";

import { useState, ForwardedRef, forwardRef } from "react";
import { Layers, Settings2, ChevronRight, ChevronLeft, MapPin, Filter } from "lucide-react";
import { LayersPanel } from "./layers-panel";
import { PropertiesPanel } from "./properties-panel";
import { PinsFilterPanel } from "./pins-filter-panel";
import { SidebarHeader } from "./sidebar-header";
import { ResizeHandle } from "./resize-handle";
import { CollapsibleSection } from "./collapsible-section";
import { PinList } from "@/components/pins/ui/pin-list";
import { PinActionDropdown } from "@/components/pins/ui/pin-action-dropdown";
import { useSelectedLayerId } from "@/stores/map-store";
import { usePinsStore } from "@/stores/use-pins-store";
import type { OptimizedWorldLayer } from "@/types/world.type";

interface SidebarProps {
  slug: string;
  worldId: string;
  width: number;
  isCollapsed: boolean;
  isResizing: boolean;
  onToggle: () => void;
  onResizeStart: (e: React.MouseEvent) => void;
  worldLayers?: OptimizedWorldLayer[];
  showPinsSection?: boolean;
  mapImage?: string | null;
}

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ slug, worldId, width, isCollapsed, isResizing, onToggle, onResizeStart, worldLayers, showPinsSection = false, mapImage }, ref) => {
    const [layersOpen, setLayersOpen] = useState(true);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [propertiesOpen, setPropertiesOpen] = useState(true);
    const [pinsOpen, setPinsOpen] = useState(true);
    const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const selectedLayerId = useSelectedLayerId();
    const startCreating = usePinsStore((state) => state.startCreating);
    const isCreating = usePinsStore((state) => state.isCreating);

    const handleTogglePlaceMode = () => {
      startCreating();
    };

    const handleIconClick = (section: "layers" | "filters" | "properties" | "pins") => {
      if (section === "layers") {
        setLayersOpen(true);
        setFiltersOpen(false);
        setPropertiesOpen(false);
        setPinsOpen(false);
      } else if (section === "filters") {
        setLayersOpen(false);
        setFiltersOpen(true);
        setPropertiesOpen(false);
        setPinsOpen(false);
      } else if (section === "properties") {
        setLayersOpen(false);
        setFiltersOpen(false);
        setPropertiesOpen(true);
        setPinsOpen(false);
      } else if (section === "pins") {
        setLayersOpen(false);
        setFiltersOpen(false);
        setPropertiesOpen(false);
        setPinsOpen(true);
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

            {showPinsSection && selectedLayerId && (
              <button
                onClick={() => handleIconClick("pins")}
                className="relative w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-200 group text-text-muted hover:text-accent-gold hover:bg-background-elevated"
                title="Pins"
              >
                <MapPin className="w-5 h-5" />
                <span className="absolute left-full ml-3 px-2 py-1 text-sm font-medium bg-background-elevated border border-border-subtle text-text-primary rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                  Pins
                </span>
              </button>
            )}

            <button
              onClick={() => handleIconClick("filters")}
              className="relative w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-200 group text-text-muted hover:text-accent-gold hover:bg-background-elevated"
              title="Filters"
            >
              <Filter className="w-5 h-5" />
              <span className="absolute left-full ml-3 px-2 py-1 text-sm font-medium bg-background-elevated border border-border-subtle text-text-primary rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                Filters
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
              <LayersPanel worldId={worldId} worldLayers={worldLayers} mapImage={mapImage} />
            </CollapsibleSection>

            {showPinsSection && selectedLayerId && (
              <CollapsibleSection title="Pins" isOpen={pinsOpen} onToggle={() => setPinsOpen(!pinsOpen)}>
                <div className="space-y-3">
                  <PinActionDropdown
                    worldId={worldId}
                    onAddPin={startCreating}
                    onTogglePlaceMode={handleTogglePlaceMode}
                    isPlacingMode={isCreating}
                    isLayerSelected={!!selectedLayerId}
                  />
                  <PinList worldId={worldId} />
                </div>
              </CollapsibleSection>
            )}

            <CollapsibleSection title="Filters" isOpen={filtersOpen} onToggle={() => setFiltersOpen(!filtersOpen)}>
              <PinsFilterPanel />
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
