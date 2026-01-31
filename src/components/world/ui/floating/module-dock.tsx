"use client";

import { memo } from "react";
import {
  Layers,
  BookOpen,
  Filter,
  Settings2,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePanelState, useTogglePanel } from "@/store/use-floating-panels-store";
import type { FloatingPanelId } from "@/store/use-floating-panels-store";

interface DockButtonProps {
  id: FloatingPanelId;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function DockButton({ id, icon, label, isActive }: DockButtonProps) {
  const togglePanel = useTogglePanel();

  return (
    <button
      onClick={() => togglePanel(id)}
      type="button"
      className={cn(
        "w-12 h-12 bg-background-card/95 backdrop-blur-sm rounded-md border border-border-subtle shadow-lg flex items-center justify-center transition-all",
        "text-text-secondary hover:text-accent-gold hover:border-accent-gold/50 hover:bg-accent-gold/10",
        "focus:outline-none focus:ring-2 focus:ring-accent-gold/50",
        isActive && "border-accent-gold text-accent-gold bg-accent-gold/10"
      )}
      title={isActive ? `Hide ${label}` : `Show ${label}`}
      aria-label={isActive ? `Hide ${label}` : `Show ${label}`}
      aria-pressed={isActive}
    >
      {icon}
    </button>
  );
}

export const ModuleDock = memo(function ModuleDock() {
  const layersPanel = usePanelState("layers");
  const lorePanel = usePanelState("lore");
  const filtersPanel = usePanelState("filters");
  const propertiesPanel = usePanelState("properties");

  const anyVisible =
    layersPanel.isVisible ||
    lorePanel.isVisible ||
    filtersPanel.isVisible ||
    propertiesPanel.isVisible;

  return (
    <div className="fixed bottom-6 left-6 z-30">
      <div
        className={cn(
          "bg-background-base/95 backdrop-blur-sm rounded-md border border-border-subtle shadow-xl p-2",
          "flex items-center gap-2 transition-all"
        )}
      >
        {/* Drag handle */}
        <div className="flex items-center gap-1 pr-2 border-r border-border-subtle">
          <GripVertical className="w-4 h-4 text-text-muted" />
        </div>

        {/* Module toggle buttons */}
        <DockButton
          id="layers"
          icon={<Layers className="w-5 h-5" />}
          label="Layers"
          isActive={layersPanel.isVisible}
        />
        <DockButton
          id="lore"
          icon={<BookOpen className="w-5 h-5" />}
          label="Lore"
          isActive={lorePanel.isVisible}
        />
        <DockButton
          id="filters"
          icon={<Filter className="w-5 h-5" />}
          label="Filters"
          isActive={filtersPanel.isVisible}
        />
        <DockButton
          id="properties"
          icon={<Settings2 className="w-5 h-5" />}
          label="Properties"
          isActive={propertiesPanel.isVisible}
        />
      </div>

      {/* Active indicator */}
      {anyVisible && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-accent-gold rounded-full shadow-glow-medium" />
      )}
    </div>
  );
});
