import { ChevronLeft, ChevronRight } from "lucide-react";
import { MetallicButton } from "@/components/ui/metallic-button";

interface SidebarHeaderProps {
  title: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ title, isCollapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-background-elevated">
      {!isCollapsed && (
        <div className="flex flex-col">
          <h2 className="text-lg font-display font-semibold text-text-primary leading-tight">
            {title}
          </h2>
          <span className="text-xs text-text-muted mt-0.5">World Editor</span>
        </div>
      )}
      <MetallicButton
        variant="silver"
        size="sm"
        onClick={onToggle}
        className="!p-2 shrink-0"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </MetallicButton>
    </div>
  );
}
