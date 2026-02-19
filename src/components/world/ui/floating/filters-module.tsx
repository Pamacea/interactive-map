"use client";

import { Filter } from "lucide-react";
import { FloatingPanel } from "./floating-panel";
import { PinsFilterPanel } from "../pins-filter-panel";
import { usePanelState } from "@/store/use-floating-panels-store";

/**
 * FiltersModule - Floating panel for map pin filters
 *
 * Features:
 * - Lazy rendering (only renders when visible)
 * - Global filter state shared across app
 */
export function FiltersModule() {
  const { isVisible } = usePanelState("filters");

  return (
    <FloatingPanel
      panelId="filters"
      title="Filters"
      icon={<Filter className="w-4 h-4" />}
    >
      {isVisible && <PinsFilterPanel />}
    </FloatingPanel>
  );
}
