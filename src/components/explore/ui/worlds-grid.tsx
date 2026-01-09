import { Search } from "lucide-react";
import { WorldCard } from "@/components/ui/world-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface World {
  id: string;
  slug: string;
  title: string;
  description: string;
  pinCount: number;
  loreCount: number;
  author: { name: string };
  isPublic: boolean;
}

interface WorldsGridProps {
  worlds: World[];
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
        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        : "space-y-4"
    )}>
      {worlds.map((world) => (
        <WorldCard key={world.id} {...world} />
      ))}
    </div>
  );
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="text-center py-16">
      <EmptyStateIcon />
      <EmptyStateTitle />
      <EmptyStateDescription />
      <EmptyStateAction onClearFilters={onClearFilters} />
    </div>
  );
}

function EmptyStateIcon() {
  return (
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background-card border border-border-subtle mb-4">
      <Search className="w-8 h-8 text-text-muted" />
    </div>
  );
}

function EmptyStateTitle() {
  return (
    <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
      No worlds found
    </h3>
  );
}

function EmptyStateDescription() {
  return (
    <p className="text-text-secondary mb-6">
      Try adjusting your search or filters to find what you're looking for.
    </p>
  );
}

function EmptyStateAction({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <Button variant="secondary" onClick={onClearFilters}>
      Clear All Filters
    </Button>
  );
}
