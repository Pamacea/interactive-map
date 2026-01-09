import { SearchBar } from "@/components/ui/search-bar";

interface ExploreHeaderProps {
  onSearch: (filters: { query: string }) => void;
}

export function ExploreHeader({ onSearch }: ExploreHeaderProps) {
  return (
    <section className="pt-24 pb-12 px-4 border-b border-border-subtle">
      <div className="max-w-7xl mx-auto">
        <HeaderContent />
        <SearchBarWrapper onSearch={onSearch} />
      </div>
    </section>
  );
}

function HeaderContent() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
        Explore <span className="text-gradient">Worlds</span>
      </h1>
      <p className="text-lg text-text-secondary">
        Discover incredible fantasy worlds, RPG campaigns, and creative maps
        built by our community of world builders.
      </p>
    </div>
  );
}

function SearchBarWrapper({ onSearch }: { onSearch: (filters: { query: string }) => void }) {
  return (
    <div className="mt-8 max-w-2xl">
      <SearchBar
        placeholder="Search by world name, description, or creator..."
        onSearch={onSearch}
      />
    </div>
  );
}
