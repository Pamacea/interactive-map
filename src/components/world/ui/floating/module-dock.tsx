"use client";

import { memo } from "react";
import {
  Layers,
  BookOpen,
  Filter,
  Settings2,
  Users,
  User,
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
        "w-8 h-8 bg-obsidian/80 backdrop-blur-sm rounded-sm border border-iron shadow-lg flex items-center justify-center transition-all py-2 px-2",
        "text-bone-dark hover:text-accent-gold hover:border-accent-gold/50 hover:bg-accent-gold/10",
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
  const charactersPanel = usePanelState("characters");
  const filtersPanel = usePanelState("filters");
  const propertiesPanel = usePanelState("properties");
  const membersPanel = usePanelState("members");


  return (
    <div className="fixed bottom-4 left-4 z-30">
      <div className="relative bg-obsidian/80 backdrop-blur-md rounded-sm border border-iron shadow-xl overflow-hidden group hover:border-accent-gold/50 transition-all duration-300">
        {/* Ornate gold corners */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent-gold/40 group-hover:border-accent-gold transition-colors pointer-events-none" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent-gold/40 group-hover:border-accent-gold transition-colors pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent-gold/40 group-hover:border-accent-gold transition-colors pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent-gold/40 group-hover:border-accent-gold transition-colors pointer-events-none" />

        {/* Cracked pattern overlay */}
        <div className="absolute inset-0 bg-crack-pattern opacity-[0.03] pointer-events-none" />

        <div className="relative p-2 flex items-center gap-2 py-3 px-4">
          {/* Drag handle with rune decoration */}
          <div className="flex items-center gap-1 pr-2 border-r border-iron/50">
            <span className="text-accent-gold/30 text-xs">ᛟ</span>
            <GripVertical className="w-4 h-4 text-bone-dark/60" />
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
            id="characters"
            icon={<User className="w-5 h-5" />}
            label="Characters"
            isActive={charactersPanel.isVisible}
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
          <DockButton
            id="members"
            icon={<Users className="w-5 h-5" />}
            label="Members"
            isActive={membersPanel.isVisible}
          />
        </div>
      </div>
    </div>
  );
});
