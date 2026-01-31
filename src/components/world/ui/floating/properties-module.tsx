"use client";

import { Settings2 } from "lucide-react";
import { FloatingPanel } from "./floating-panel";
import { PropertiesPanel } from "../properties-panel";

export function PropertiesModule() {
  return (
    <FloatingPanel
      panelId="properties"
      title="Properties"
      icon={<Settings2 className="w-4 h-4" />}
    >
      <PropertiesPanel />
    </FloatingPanel>
  );
}
