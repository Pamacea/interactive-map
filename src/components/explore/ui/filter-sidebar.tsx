import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  showFilters: boolean;
  activeFilters: string[];
  onToggleFilter: (filter: string) => void;
  onClearAll: () => void;
}

export function FilterSidebar({ showFilters, activeFilters, onToggleFilter, onClearAll }: FilterSidebarProps) {
  return (
    <aside
      className={cn(
        "lg:w-64 flex-shrink-0",
        "bg-background-card rounded-lg border border-border-subtle",
        "transition-all duration-300",
        !showFilters && "hidden lg:block"
      )}
    >
      <div className="p-4 space-y-6">
        <FilterHeader activeFilters={activeFilters} onClearAll={onClearAll} />
        <ContentTypeFilter onToggle={onToggleFilter} activeFilters={activeFilters} />
        <FactionFilter onToggle={onToggleFilter} activeFilters={activeFilters} />
        <WorldSizeFilter />
      </div>
    </aside>
  );
}

function FilterHeader({ activeFilters, onClearAll }: { activeFilters: string[]; onClearAll: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-5 h-5 text-accent-gold" />
        <h3 className="font-display font-semibold text-text-primary">
          Filters
        </h3>
      </div>
      {activeFilters.length > 0 && (
        <button
          onClick={onClearAll}
          className="text-xs text-text-muted hover:text-accent-gold transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
}

function ContentTypeFilter({ onToggle, activeFilters }: { onToggle: (filter: string) => void; activeFilters: string[] }) {
  const filters = [
    { label: "Cities & Settlements", value: "cities" },
    { label: "Dungeons & Instances", value: "dungeons" },
    { label: "Characters & NPCs", value: "characters" },
    { label: "Quests & Stories", value: "quests" },
  ];

  return (
    <div>
      <h4 className="text-sm font-medium text-text-secondary mb-3">
        Content Type
      </h4>
      <div className="space-y-2">
        {filters.map((filter) => (
          <FilterCheckbox
            key={filter.value}
            label={filter.label}
            value={filter.value}
            checked={activeFilters.includes(filter.value)}
            onChange={() => onToggle(filter.value)}
          />
        ))}
      </div>
    </div>
  );
}

function FactionFilter({ onToggle, activeFilters }: { onToggle: (filter: string) => void; activeFilters: string[] }) {
  const filters = [
    { label: "Light & Divine", value: "light", color: "bg-faction-light" },
    { label: "Dark & Shadow", value: "dark", color: "bg-faction-dark" },
    { label: "Nature & Wild", value: "nature", color: "bg-faction-nature" },
    { label: "Fire & Aggression", value: "fire", color: "bg-faction-fire" },
    { label: "Ice & Cold", value: "ice", color: "bg-faction-ice" },
  ];

  return (
    <div>
      <h4 className="text-sm font-medium text-text-secondary mb-3">
        Factions
      </h4>
      <div className="space-y-2">
        {filters.map((filter) => (
          <FactionCheckbox
            key={filter.value}
            label={filter.label}
            value={filter.value}
            color={filter.color}
            checked={activeFilters.includes(filter.value)}
            onChange={() => onToggle(filter.value)}
          />
        ))}
      </div>
    </div>
  );
}

function WorldSizeFilter() {
  const sizes = ["Small (< 50 pins)", "Medium (50-200)", "Large (200+)"];

  return (
    <div>
      <h4 className="text-sm font-medium text-text-secondary mb-3">
        World Size
      </h4>
      <div className="space-y-2">
        {sizes.map((size) => (
          <label key={size} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="size"
              className="w-4 h-4 border-border-subtle text-accent-gold focus:ring-accent-gold focus:ring-offset-0"
            />
            <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
              {size}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function FilterCheckbox({ label, value, checked, onChange }: { label: string; value: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-border-subtle text-accent-gold focus:ring-accent-gold focus:ring-offset-0"
      />
      <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
        {label}
      </span>
    </label>
  );
}

function FactionCheckbox({ label, value, color, checked, onChange }: { label: string; value: string; color: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-border-subtle text-accent-gold focus:ring-accent-gold focus:ring-offset-0"
      />
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
        {label}
      </span>
    </label>
  );
}
