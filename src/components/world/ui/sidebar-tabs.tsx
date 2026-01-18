"use client";

import { useCallback } from "react";
import { Layers, Settings2, Filter, Image } from "lucide-react";

type TabValue = "layers" | "filters" | "properties" | "gallery";

interface SidebarTabsProps {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}

const tabs = [
  { value: "layers" as TabValue, label: "Layers", icon: Layers },
  { value: "filters" as TabValue, label: "Filters", icon: Filter },
  { value: "properties" as TabValue, label: "Properties", icon: Settings2 },
  { value: "gallery" as TabValue, label: "Gallery", icon: Image },
];

export function SidebarTabs({ activeTab, onTabChange }: SidebarTabsProps) {
  const handleTabChange = useCallback(
    (tab: TabValue) => {
      onTabChange(tab);
    },
    [onTabChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        const prevIndex = index === 0 ? tabs.length - 1 : index - 1;
        onTabChange(tabs[prevIndex].value);
        break;
      case "ArrowRight":
        e.preventDefault();
        const nextIndex = index === tabs.length - 1 ? 0 : index + 1;
        onTabChange(tabs[nextIndex].value);
        break;
      case "Home":
        e.preventDefault();
        onTabChange(tabs[0].value);
        break;
      case "End":
        e.preventDefault();
        onTabChange(tabs[tabs.length - 1].value);
        break;
    }
  };

  const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);

  return (
    <div role="tablist" aria-label="Sidebar panels" className="flex border-b border-border-subtle">
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${tab.value}-panel`}
            id={`${tab.value}-tab`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleTabChange(tab.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`
              flex-1 px-4 py-3 text-sm font-medium transition-all duration-200
              flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent-gold/50
              ${
                isActive
                  ? "text-accent-gold bg-background-elevated border-b-2 border-accent-gold"
                  : "text-text-muted hover:text-text-secondary"
              }
            `}
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
