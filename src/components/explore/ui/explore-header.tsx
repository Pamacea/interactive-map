import { SearchBar } from "@/components/ui/search-bar";
import { MetallicButton } from "@/components/ui/metallic-button";
import { Globe } from "lucide-react";

interface ExploreHeaderProps {
  onSearch: (filters: { query: string }) => void;
}

export function ExploreHeader({ onSearch }: ExploreHeaderProps) {
  return (
    <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 border-b border-border-subtle bg-gradient-to-b from-background-base to-background-elevated overflow-hidden">
      <ExploreBackground />
      <div className="relative z-10 max-w-7xl mx-auto">
        <HeaderContent />
        <SearchBarWrapper onSearch={onSearch} />
      </div>
    </section>
  );
}

function ExploreBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(212,175,55,0.08),transparent_50%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl" />
    </>
  );
}

function HeaderContent() {
  return (
    <div className="max-w-3xl mx-auto text-center mb-8">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-background-card/80 backdrop-blur-md border border-accent-gold/30 mb-6">
        <Globe className="w-4 h-4 text-accent-gold" />
        <span className="text-sm font-display font-semibold text-accent-gold">
          Discover Worlds
        </span>
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-text-primary mb-4">
        Explore{" "}
        <span className="bg-gradient-to-r from-accent-gold via-yellow-400 to-accent-gold bg-clip-text text-transparent">
          Fantasy Worlds
        </span>
      </h1>
      <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto">
        Discover incredible fantasy worlds, RPG campaigns, and creative maps built by our
        community of world builders.
      </p>
    </div>
  );
}

function SearchBarWrapper({ onSearch }: { onSearch: (filters: { query: string }) => void }) {
  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <SearchBar
        placeholder="Search by world name, description, or creator..."
        onSearch={onSearch}
      />
    </div>
  );
}
