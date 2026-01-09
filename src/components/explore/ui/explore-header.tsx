import { SearchBar } from "@/components/ui/search-bar";
import { Globe } from "lucide-react";

interface ExploreHeaderProps {
  onSearch: (filters: { query: string }) => void;
}

export function ExploreHeader({ onSearch }: ExploreHeaderProps) {
  return (
    <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 border-b border-border-subtle">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-accent-gold" />
          <span className="text-sm font-display font-semibold text-accent-gold">
            Discover Worlds
          </span>
        </div>

        <h1 className="text-6xl sm:text-7xl font-display font-bold text-text-primary">
          Explore Fantasy Worlds
        </h1>

        <p className="text-base text-text-secondary">
          Discover incredible fantasy worlds, RPG campaigns, and creative maps built by our
          community of world builders.
        </p>

        <div className="w-full">
          <SearchBar
            placeholder="Search by world name, description, or creator..."
            onSearch={onSearch}
          />
        </div>
      </div>
    </section>
  );
}
