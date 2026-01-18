import { CollapsibleSection } from "../collapsible-section";
import { LayersPanel } from "../layers-panel";
import { PinsFilterPanel } from "../pins-filter-panel";
import { PropertiesPanel } from "../properties-panel";
import { PinActionDropdown, PinList } from "@/components/pins/ui";
import { LoreList, LoreForm } from "@/components/lore/ui";
import { ImageGallery } from "@/components/gallery/ui";
import { useLoreStore } from "@/stores/use-lore-store";

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
  loreOpen: boolean;
  setLoreOpen: (open: boolean) => void;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  propertiesOpen: boolean;
  setPropertiesOpen: (open: boolean) => void;
  galleryOpen: boolean;
  setGalleryOpen: (open: boolean) => void;
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
  loreOpen,
  setLoreOpen,
  filtersOpen,
  setFiltersOpen,
  propertiesOpen,
  setPropertiesOpen,
  galleryOpen,
  setGalleryOpen,
}: SidebarExpandedProps) {
  // Lore state
  const isCreatingLore = useLoreStore((state) => state.isCreating);
  const isEditingLore = useLoreStore((state) => state.isEditing);
  const selectedLoreId = useLoreStore((state) => state.selectedLoreId);
  const loreEntries = useLoreStore((state) => state.loreEntries);

  // Get selected lore entry for editing
  const selectedLore = selectedLoreId
    ? loreEntries.find((lore) => lore.id === selectedLoreId)
    : undefined;

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

      <CollapsibleSection title="Lore" isOpen={loreOpen} onToggle={() => setLoreOpen(!loreOpen)}>
        <div className="space-y-3">
          {(isCreatingLore || isEditingLore) ? (
            <LoreForm
              worldId={worldId}
              lore={selectedLore}
              onSuccess={() => {
                setLoreOpen(true);
              }}
            />
          ) : (
            <LoreList worldId={worldId} />
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Filters" isOpen={filtersOpen} onToggle={() => setFiltersOpen(!filtersOpen)}>
        <PinsFilterPanel />
      </CollapsibleSection>

      <CollapsibleSection title="Properties" isOpen={propertiesOpen} onToggle={() => setPropertiesOpen(!propertiesOpen)}>
        <PropertiesPanel />
      </CollapsibleSection>

      <CollapsibleSection title="Gallery" isOpen={galleryOpen} onToggle={() => setGalleryOpen(!galleryOpen)}>
        <ImageGallery worldId={worldId} />
      </CollapsibleSection>
    </div>
  );
}
