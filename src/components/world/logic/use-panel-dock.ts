import { useFloatingPanelsStore } from "@/store/use-floating-panels-store";

/**
 * Hook for managing the module dock state.
 * Provides convenient accessors for panel visibility and toggle actions.
 */
export function usePanelDock() {
  const layersPanel = useFloatingPanelsStore((state) => state.panels.layers);
  const lorePanel = useFloatingPanelsStore((state) => state.panels.lore);
  const filtersPanel = useFloatingPanelsStore((state) => state.panels.filters);
  const propertiesPanel = useFloatingPanelsStore((state) => state.panels.properties);

  const togglePanel = useFloatingPanelsStore((state) => state.togglePanel);

  const anyVisible =
    layersPanel.isVisible ||
    lorePanel.isVisible ||
    filtersPanel.isVisible ||
    propertiesPanel.isVisible;

  return {
    panels: {
      layers: layersPanel,
      lore: lorePanel,
      filters: filtersPanel,
      properties: propertiesPanel,
    },
    togglePanel,
    anyVisible,
  };
}
