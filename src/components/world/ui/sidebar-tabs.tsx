"use client";

import { useCallback } from "react";
import { Layers, Settings2, Filter } from "lucide-react";

type TabValue = "layers" | "filters" | "properties";

interface SidebarTabsProps {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}

export function SidebarTabs({ activeTab, onTabChange }: SidebarTabsProps) {
  const handleTabChange = useCallback(
    (tab: TabValue) => {
      onTabChange(tab);
    },
    [onTabChange]
  );

  return (
    <div className="flex border-b border-border-subtle">
      <button
        onClick={() => handleTabChange("layers")}
        className={`
          flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
          ${
            activeTab === "layers"
              ? "text-accent-gold bg-background-elevated border-b-2 border-accent-gold"
              : "text-text-muted hover:text-text-secondary"
          }
        `}
      >
        <Layers className="w-4 h-4" />
        Layers
      </button>

      <button
        onClick={() => handleTabChange("filters")}
        className={`
          flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
          ${
            activeTab === "filters"
              ? "text-accent-gold bg-background-elevated border-b-2 border-accent-gold"
              : "text-text-muted hover:text-text-secondary"
          }
        `}
      >
        <Filter className="w-4 h-4" />
        Filters
      </button>

      <button
        onClick={() => handleTabChange("properties")}
        className={`
          flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
          ${
            activeTab === "properties"
              ? "text-accent-gold bg-background-elevated border-b-2 border-accent-gold"
              : "text-text-muted hover:text-text-secondary"
          }
        `}
      >
        <Settings2 className="w-4 h-4" />
        Properties
      </button>
    </div>
  );
}
