import { useState, useEffect } from "react";
import { useSetPins } from "@/stores/pins/use-pins-data-store";
import { useIsCreatingPin, useStartCreating } from "@/stores/pins/use-pins-ui-store";
import { useLoreStore } from "@/stores/use-lore-store";
import { useSelectedLayerId } from "@/stores/map-store";
import type { Pin } from "@/types/pin.type";

export function useSidebarState(initialPins: Pin[]) {
  const [layersOpen, setLayersOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(true);
  const [pinsOpen, setPinsOpen] = useState(true);
  const [loreOpen, setLoreOpen] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(true);

  const selectedLayerId = useSelectedLayerId();

  // Use new modular stores
  const startCreating = useStartCreating();
  const isCreating = useIsCreatingPin();
  const setPins = useSetPins();

  // Initialize lore store with initial data if needed
  const setLoreEntries = useLoreStore((state) => state.setLoreEntries);

  // Initialize pins store with initialPins from props
  useEffect(() => {
    if (initialPins && initialPins.length > 0) {
      setPins(initialPins as any);
    }
  }, [initialPins, setPins]);

  const handleTogglePlaceMode = () => {
    startCreating();
  };

  const handleIconClick = (section: "layers" | "filters" | "properties" | "pins" | "lore" | "gallery", onToggle: () => void) => {
    // Reset all sections
    setLayersOpen(section === "layers");
    setFiltersOpen(section === "filters");
    setPropertiesOpen(section === "properties");
    setPinsOpen(section === "pins");
    setLoreOpen(section === "lore");
    setGalleryOpen(section === "gallery");

    // Expand sidebar if collapsed
    onToggle();
  };

  return {
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
    handleIconClick,
  };
}
