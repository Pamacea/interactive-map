import { Search } from "lucide-react";
import { memo } from "react";
import { WorldCard } from "@/shared/ui/world-card";
import { MetallicButton } from "@/shared/ui/metallic-button";
import { cn } from "@/shared/utils";
import type { GameWorld } from "@/types/world.type";

interface WorldsGridProps {
  worlds: GameWorld[];
  viewMode: "grid" | "list";
  onClearFilters: () => void;
}

export const WorldsGrid = memo(function WorldsGrid({ worlds, viewMode, onClearFilters }: WorldsGridProps) {
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
}, (prevProps, nextProps) => {
  return (
    prevProps.worlds.length === nextProps.worlds.length &&
    prevProps.worlds === nextProps.worlds &&
    prevProps.viewMode === nextProps.viewMode
  );
});

const EmptyState = memo(function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
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
});

const EmptyStateIcon = memo(function EmptyStateIcon() {
  return (
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-sm bg-background-card border border-border-subtle">
      <Search className="w-8 h-8 text-text-muted" />
    </div>
  );
});

const EmptyStateTitle = memo(function EmptyStateTitle() {
  return (
    <h3 className="text-4xl font-display font-semibold text-text-primary">
      No worlds found
    </h3>
  );
});

const EmptyStateDescription = memo(function EmptyStateDescription() {
  return (
    <p className="text-xl text-text-secondary">
      Try adjusting your search or filters to find what you&apos;re looking for.
    </p>
  );
});

const EmptyStateAction = memo(function EmptyStateAction({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <MetallicButton variant="silver" size="md" onClick={onClearFilters}>
      Clear All Filters
    </MetallicButton>
  );
});
