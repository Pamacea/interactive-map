import { Layers, MapPin, Filter, Settings2, BookOpen } from "lucide-react";

interface SidebarCollapsedProps {
  onIconClick: (section: "layers" | "filters" | "properties" | "pins" | "lore") => void;
  selectedLayerId: string | null;
  showPinsSection: boolean;
}

export function SidebarCollapsed({ onIconClick, selectedLayerId, showPinsSection }: SidebarCollapsedProps) {
  return (
    <div className="flex-1 flex flex-col items-center py-4 gap-2">
      <CollapsedButton onClick={() => onIconClick("layers")} icon={Layers} label="Layers" />

      {showPinsSection && selectedLayerId && (
        <CollapsedButton onClick={() => onIconClick("pins")} icon={MapPin} label="Pins" />
      )}

      <CollapsedButton onClick={() => onIconClick("lore")} icon={BookOpen} label="Lore" />

      <CollapsedButton onClick={() => onIconClick("filters")} icon={Filter} label="Filters" />
      <CollapsedButton onClick={() => onIconClick("properties")} icon={Settings2} label="Properties" />
    </div>
  );
}

interface CollapsedButtonProps {
  onClick: () => void;
  icon: any;
  label: string;
}

function CollapsedButton({ onClick, icon: Icon, label }: CollapsedButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-200 group text-text-muted hover:text-accent-gold hover:bg-background-elevated"
      title={label}
    >
      <Icon className="w-5 h-5" />
      <span className="absolute left-full ml-3 px-2 py-1 text-sm font-medium bg-background-elevated border border-border-subtle text-text-primary rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
        {label}
      </span>
    </button>
  );
}
