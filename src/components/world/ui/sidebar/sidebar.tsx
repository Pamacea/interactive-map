"use client";

import { ForwardedRef, forwardRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { SidebarHeader } from "../sidebar-header";
import { ResizeHandle } from "../resize-handle";
import { SidebarCollapsed } from "./sidebar-collapsed";
import { SidebarExpanded } from "./sidebar-expanded";
import { useSidebarState } from "./use-sidebar-state";
import { useSelectedLayerId } from "@/stores/map-store";
import type { OptimizedWorldLayer } from "@/types/world.type";
import type { Pin } from "@/types/pin.type";

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
  initialPins?: Pin[];
}

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      slug,
      worldId,
      width,
      isCollapsed,
      isResizing,
      onToggle,
      onResizeStart,
      worldLayers,
      showPinsSection = false,
      mapImage,
      initialPins = [],
    },
    ref
  ) => {
    const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const selectedLayerId = useSelectedLayerId();

    const {
      layersOpen,
      setLayersOpen,
      filtersOpen,
      setFiltersOpen,
      propertiesOpen,
      setPropertiesOpen,
      pinsOpen,
      setPinsOpen,
      loreOpen,
      setLoreOpen,
      galleryOpen,
      setGalleryOpen,
      isCreating,
      startCreating,
      handleTogglePlaceMode,
      handleIconClick: handleIconClickState,
    } = useSidebarState(initialPins);

    const handleIconClick = (section: "layers" | "filters" | "properties" | "pins" | "lore" | "gallery") => {
      handleIconClickState(section, onToggle);
    };

    return (
      <div
        ref={ref}
        className={`relative h-full flex flex-col bg-background-card border-r border-border-subtle ${
          isResizing ? "" : "transition-all duration-300 ease-in-out"
        }`}
        style={{ width: isCollapsed ? 70 : width }}
      >
        {/* Toggle Button */}
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
          <SidebarCollapsed
            onIconClick={handleIconClick}
            selectedLayerId={selectedLayerId}
            showPinsSection={showPinsSection}
          />
        ) : (
          <SidebarExpanded
            worldId={worldId}
            worldLayers={worldLayers || []}
            mapImage={mapImage}
            selectedLayerId={selectedLayerId}
            showPinsSection={showPinsSection}
            isCreating={isCreating}
            startCreating={handleTogglePlaceMode}
            layersOpen={layersOpen}
            setLayersOpen={setLayersOpen}
            pinsOpen={pinsOpen}
            setPinsOpen={setPinsOpen}
            loreOpen={loreOpen}
            setLoreOpen={setLoreOpen}
            filtersOpen={filtersOpen}
            setFiltersOpen={setFiltersOpen}
            propertiesOpen={propertiesOpen}
            setPropertiesOpen={setPropertiesOpen}
            galleryOpen={galleryOpen}
            setGalleryOpen={setGalleryOpen}
          />
        )}

        <ResizeHandle onResizeStart={onResizeStart} isResizing={isResizing} />
      </div>
    );
  }
);

Sidebar.displayName = "Sidebar";
