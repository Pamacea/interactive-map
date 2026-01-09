import { Filter, Grid3X3, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResultsHeaderProps {
  filteredCount: number;
  viewMode: "grid" | "list";
  showFilters: boolean;
  activeFilters: string[];
  onViewModeChange: (mode: "grid" | "list") => void;
  onToggleFilters: () => void;
  onToggleFilter: (filter: string) => void;
  onClearAllFilters: () => void;
}

export function ResultsHeader({
  filteredCount,
  viewMode,
  showFilters,
  activeFilters,
  onViewModeChange,
  onToggleFilters,
  onToggleFilter,
  onClearAllFilters,
}: ResultsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <ResultsCount count={filteredCount} activeFilters={activeFilters} onToggleFilter={onToggleFilter} onClearAll={onClearAllFilters} />
      <Actions viewMode={viewMode} showFilters={showFilters} onViewModeChange={onViewModeChange} onToggleFilters={onToggleFilters} />
    </div>
  );
}

function ResultsCount({ count, activeFilters, onToggleFilter, onClearAll }: { count: number; activeFilters: string[]; onToggleFilter: (filter: string) => void; onClearAll: () => void }) {
  return (
    <div>
      <p className="text-text-secondary">
        Showing <span className="font-semibold text-text-primary">{count}</span> worlds
      </p>
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {activeFilters.map((filter) => (
            <ActiveFilterBadge key={filter} filter={filter} onRemove={() => onToggleFilter(filter)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ActiveFilterBadge({ filter, onRemove }: { filter: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className="flex items-center gap-1 px-2 py-1 bg-accent-gold/10 border border-accent-gold/30 rounded-md text-xs text-accent-gold hover:bg-accent-gold/20 transition-colors"
    >
      {filter}
      <X className="w-3 h-3" />
    </button>
  );
}

function Actions({ viewMode, showFilters, onViewModeChange, onToggleFilters }: { viewMode: "grid" | "list"; showFilters: boolean; onViewModeChange: (mode: "grid" | "list") => void; onToggleFilters: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <FilterToggleButton show={showFilters} onToggle={onToggleFilters} />
      <ViewModeToggle currentMode={viewMode} onModeChange={onViewModeChange} />
    </div>
  );
}

function FilterToggleButton({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className={cn(
        "lg:hidden",
        show && "bg-accent-gold/10 text-accent-gold"
      )}
    >
      <Filter className="w-4 h-4" />
    </Button>
  );
}

function ViewModeToggle({ currentMode, onModeChange }: { currentMode: "grid" | "list"; onModeChange: (mode: "grid" | "list") => void }) {
  return (
    <div className="flex items-center bg-background-card rounded-md border border-border-subtle">
      <ViewModeButton mode="grid" currentMode={currentMode} onModeChange={onModeChange}>
        <Grid3X3 className="w-4 h-4" />
      </ViewModeButton>
      <ViewModeButton mode="list" currentMode={currentMode} onModeChange={onModeChange}>
        <List className="w-4 h-4" />
      </ViewModeButton>
    </div>
  );
}

function ViewModeButton({ mode, currentMode, onModeChange, children }: { mode: "grid" | "list"; currentMode: "grid" | "list"; onModeChange: (mode: "grid" | "list") => void; children: React.ReactNode }) {
  const isActive = mode === currentMode;
  return (
    <button
      onClick={() => onModeChange(mode)}
      className={cn(
        "p-2 transition-colors",
        isActive
          ? "text-accent-gold bg-background-card-hover"
          : "text-text-muted hover:text-text-primary"
      )}
    >
      {children}
    </button>
  );
}
