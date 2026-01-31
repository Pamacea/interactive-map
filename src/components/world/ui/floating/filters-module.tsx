"use client";

import { Filter } from "lucide-react";
import { FloatingPanel } from "./floating-panel";
import { PinsFilterPanel } from "../pins-filter-panel";

export function FiltersModule() {
  return (
    <FloatingPanel
      panelId="filters"
      title="Filters"
      icon={<Filter className="w-4 h-4" />}
    >
      <PinsFilterPanel />
    </FloatingPanel>
  );
}
