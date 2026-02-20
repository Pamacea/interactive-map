import { MapPin, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SearchTabsProps {
  activeTab: "all" | "pins" | "lore";
  onTabChange: (tab: "all" | "pins" | "lore") => void;
  totalCount: number;
  pinsCount: number;
  loreCount: number;
}

export function SearchTabs({
  activeTab,
  onTabChange,
  totalCount,
  pinsCount,
  loreCount,
}: SearchTabsProps) {
  return (
    <div className="flex border-b border-border-subtle">
      <SearchTab
        active={activeTab === "all"}
        onClick={() => onTabChange("all")}
        count={totalCount}
        label="All"
      />
      <SearchTab
        active={activeTab === "pins"}
        onClick={() => onTabChange("pins")}
        count={pinsCount}
        label="Pins"
        icon={<MapPin className="w-4 h-4" />}
      />
      <SearchTab
        active={activeTab === "lore"}
        onClick={() => onTabChange("lore")}
        count={loreCount}
        label="Lore"
        icon={<BookOpen className="w-4 h-4" />}
      />
    </div>
  );
}

interface SearchTabProps {
  active: boolean;
  onClick: () => void;
  count: number;
  label: string;
  icon?: React.ReactNode;
}

function SearchTab({ active, onClick, count, label, icon }: SearchTabProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 rounded-none",
        active
          ? "text-accent-gold bg-background-elevated border-b-2 border-accent-gold"
          : "text-text-muted hover:text-text-secondary"
      )}
    >
      {icon}
      {label}
      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
        {count}
      </Badge>
    </Button>
  );
}
