import { Search } from "lucide-react";
import { WorldCard } from "@/components/ui/world-card";
import { MetallicButton } from "@/components/ui/metallic-button";
import { cn } from "@/lib/utils";
import type { GameWorld } from "@/types/world.type";

interface WorldsGridProps {
  worlds: GameWorld[];
  viewMode: "grid" | "list";
  onClearFilters: () => void;
}

export function WorldsGrid({ worlds, viewMode, onClearFilters }: WorldsGridProps) {
  if (worlds.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <div className={cn(
      viewMode === "grid"
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        : "flex flex-col gap-4"
    )}>
      {worlds.map((world) => (
        <WorldCard key={world.id} {...world} viewMode={viewMode} />
      ))}
    </div>
  );
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="text-center py-16 sm:py-24 flex flex-col items-center gap-6">
      <EmptyStateIcon />
      <div className="flex flex-col gap-2">
        <EmptyStateTitle />
        <EmptyStateDescription />
      </div>
      <EmptyStateAction onClearFilters={onClearFilters} />
    </div>
  );
}

function EmptyStateIcon() {
  return (
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-background-card border border-border-subtle">
      <Search className="w-8 h-8 text-text-muted" />
    </div>
  );
}

function EmptyStateTitle() {
  return (
    <h3 className="text-4xl font-display font-semibold text-text-primary">
      No worlds found
    </h3>
  );
}

function EmptyStateDescription() {
  return (
    <p className="text-xl text-text-secondary">
      Try adjusting your search or filters to find what you're looking for.
    </p>
  );
}

function EmptyStateAction({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <MetallicButton variant="silver" size="md" onClick={onClearFilters}>
      Clear All Filters
    </MetallicButton>
  );
}
