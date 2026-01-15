import { CollapsibleSection } from "../collapsible-section";
import { LayersPanel } from "../layers-panel";
import { PinsFilterPanel } from "../pins-filter-panel";
import { PropertiesPanel } from "../properties-panel";
import { PinActionDropdown, PinList } from "@/components/pins/ui";

interface SidebarExpandedProps {
  worldId: string;
  worldLayers: any[];
  mapImage?: string | null;
  selectedLayerId: string | null;
  showPinsSection: boolean;
  isCreating: boolean;
  startCreating: () => void;
  layersOpen: boolean;
  setLayersOpen: (open: boolean) => void;
  pinsOpen: boolean;
  setPinsOpen: (open: boolean) => void;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  propertiesOpen: boolean;
  setPropertiesOpen: (open: boolean) => void;
}

export function SidebarExpanded({
  worldId,
  worldLayers,
  mapImage,
  selectedLayerId,
  showPinsSection,
  isCreating,
  startCreating,
  layersOpen,
  setLayersOpen,
  pinsOpen,
  setPinsOpen,
  filtersOpen,
  setFiltersOpen,
  propertiesOpen,
  setPropertiesOpen,
}: SidebarExpandedProps) {
  return (
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
              onTogglePlaceMode={startCreating}
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
  );
}
