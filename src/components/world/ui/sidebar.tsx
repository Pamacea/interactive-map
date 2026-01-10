import { LayersPanel } from "./layers-panel";
import { PropertiesPanel } from "./properties-panel";
import { SidebarHeader } from "./sidebar-header";
import { ResizeHandle } from "./resize-handle";

interface SidebarProps {
  slug: string;
  width: number;
  isCollapsed: boolean;
  isResizing: boolean;
  onToggle: () => void;
  onResizeStart: (e: React.MouseEvent) => void;
}

export function Sidebar({ slug, width, isCollapsed, isResizing, onToggle, onResizeStart }: SidebarProps) {
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div
      className="relative h-full flex flex-col bg-background-card border-r border-border-subtle"
      style={{ width: isCollapsed ? 60 : width }}
    >
      <SidebarHeader title={title} isCollapsed={isCollapsed} onToggle={onToggle} />

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <LayersPanel />
          <PropertiesPanel />
        </div>
      )}

      <ResizeHandle onResizeStart={onResizeStart} isResizing={isResizing} />
    </div>
  );
}

