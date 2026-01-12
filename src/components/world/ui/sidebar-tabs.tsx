"use client";

import { useCallback } from "react";

type TabValue = "layers" | "properties";

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
          flex-1 px-4 py-3 text-sm font-medium transition-all duration-200
          ${
            activeTab === "layers"
              ? "text-accent-gold bg-background-elevated border-b-2 border-accent-gold"
              : "text-text-muted hover:text-text-secondary"
          }
        `}
      >
        Layers
      </button>
      <button
        onClick={() => handleTabChange("properties")}
        className={`
          flex-1 px-4 py-3 text-sm font-medium transition-all duration-200
          ${
            activeTab === "properties"
              ? "text-accent-gold bg-background-elevated border-b-2 border-accent-gold"
              : "text-text-muted hover:text-text-secondary"
          }
        `}
      >
        Properties
      </button>
    </div>
  );
}
