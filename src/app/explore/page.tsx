"use client";

import { useState } from "react";
import { SearchBar, SearchFilters } from "@/components/ui/search-bar";
import { WorldCard } from "@/components/ui/world-card";
import { NavigationBar } from "@/components/ui/navigation-bar";
import { Button } from "@/components/ui/button";
import { Filter, Grid3X3, List, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data - will come from API later
const allWorlds = [
  {
    id: "1",
    slug: "eldoria-chronicles",
    title: "Eldoria Chronicles",
    description: "A vast high fantasy realm with ancient dragons, magical kingdoms, and epic wars that shaped the continent.",
    pinCount: 247,
    loreCount: 58,
    author: { name: "MythWeaver" },
    isPublic: true,
  },
  {
    id: "2",
    slug: "shadow-veil",
    title: "Shadow Veil",
    description: "Dark fantasy world torn between light and darkness, where demons walk among mortals.",
    pinCount: 189,
    loreCount: 42,
    author: { name: "DarkLord99" },
    isPublic: true,
  },
  {
    id: "3",
    slug: "azure-coast",
    title: "The Azure Coast",
    description: "Tropical archipelago of trading cities, pirates, and ancient sea temples.",
    pinCount: 156,
    loreCount: 35,
    author: { name: "SeaCaptain" },
    isPublic: true,
  },
  {
    id: "4",
    slug: "iron-kingdoms",
    title: "Iron Kingdoms",
    description: "Steampunk fantasy where dwarves build massive machines and humans mine rare crystals.",
    pinCount: 203,
    loreCount: 47,
    author: { name: "SteamEngineer" },
    isPublic: true,
  },
  {
    id: "5",
    slug: "whispering-woods",
    title: "Whispering Woods",
    description: "Enchanted forest home to elves, fey creatures, and ancient druidic circles.",
    pinCount: 134,
    loreCount: 39,
    author: { name: "ForestKeeper" },
    isPublic: true,
  },
  {
    id: "6",
    slug: "crimson-wastes",
    title: "Crimson Wastes",
    description: "Brutal desert wasteland where warlords battle for control of oasis fortresses.",
    pinCount: 98,
    loreCount: 28,
    author: { name: "SandWarrior" },
    isPublic: true,
  },
];

type ViewMode = "grid" | "list";

export default function ExplorePage() {
  const [filters, setFilters] = useState<SearchFilters>({ query: "" });
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Filter worlds based on search query
  const filteredWorlds = allWorlds.filter((world) => {
    if (!filters.query) return true;
    const searchLower = filters.query.toLowerCase();
    return (
      world.title.toLowerCase().includes(searchLower) ||
      world.description.toLowerCase().includes(searchLower) ||
      world.author.name.toLowerCase().includes(searchLower)
    );
  });

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setFilters({ query: "" });
  };

  return (
    <div className="min-h-screen bg-background-base">
      {/* Navigation */}
      <NavigationBar />

      {/* Header Section */}
      <section className="pt-24 pb-12 px-4 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
              Explore <span className="text-gradient">Worlds</span>
            </h1>
            <p className="text-lg text-text-secondary">
              Discover incredible fantasy worlds, RPG campaigns, and creative maps
              built by our community of world builders.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl">
            <SearchBar
              placeholder="Search by world name, description, or creator..."
              onSearch={handleSearch}
            />
          </div>
        </div>
      </section>

      {/* Filters & Results Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters */}
            <aside
              className={cn(
                "lg:w-64 flex-shrink-0",
                "bg-background-card rounded-lg border border-border-subtle",
                "transition-all duration-300",
                !showFilters && "hidden lg:block"
              )}
            >
              <div className="p-4 space-y-6">
                {/* Filter Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-accent-gold" />
                    <h3 className="font-display font-semibold text-text-primary">
                      Filters
                    </h3>
                  </div>
                  {activeFilters.length > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-text-muted hover:text-accent-gold transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Pin Type Filter */}
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-3">
                    Content Type
                  </h4>
                  <div className="space-y-2">
                    {[
                      { label: "Cities & Settlements", value: "cities" },
                      { label: "Dungeons & Instances", value: "dungeons" },
                      { label: "Characters & NPCs", value: "characters" },
                      { label: "Quests & Stories", value: "quests" },
                    ].map((filter) => (
                      <label
                        key={filter.value}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={activeFilters.includes(filter.value)}
                          onChange={() => toggleFilter(filter.value)}
                          className="w-4 h-4 rounded border-border-subtle text-accent-gold focus:ring-accent-gold focus:ring-offset-0"
                        />
                        <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                          {filter.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Faction Filter */}
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-3">
                    Factions
                  </h4>
                  <div className="space-y-2">
                    {[
                      { label: "Light & Divine", value: "light", color: "bg-faction-light" },
                      { label: "Dark & Shadow", value: "dark", color: "bg-faction-dark" },
                      { label: "Nature & Wild", value: "nature", color: "bg-faction-nature" },
                      { label: "Fire & Aggression", value: "fire", color: "bg-faction-fire" },
                      { label: "Ice & Cold", value: "ice", color: "bg-faction-ice" },
                    ].map((filter) => (
                      <label
                        key={filter.value}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={activeFilters.includes(filter.value)}
                          onChange={() => toggleFilter(filter.value)}
                          className="w-4 h-4 rounded border-border-subtle text-accent-gold focus:ring-accent-gold focus:ring-offset-0"
                        />
                        <div className={cn("w-3 h-3 rounded-full", filter.color)} />
                        <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                          {filter.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* World Size Filter */}
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-3">
                    World Size
                  </h4>
                  <div className="space-y-2">
                    {["Small (< 50 pins)", "Medium (50-200)", "Large (200+)"].map(
                      (size) => (
                        <label
                          key={size}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="size"
                            className="w-4 h-4 border-border-subtle text-accent-gold focus:ring-accent-gold focus:ring-offset-0"
                          />
                          <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                            {size}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
            </aside>

            {/* Results Area */}
            <div className="flex-1 space-y-6">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary">
                    Showing <span className="font-semibold text-text-primary">{filteredWorlds.length}</span> worlds
                  </p>
                  {activeFilters.length > 0 && (
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {activeFilters.map((filter) => (
                        <button
                          key={filter}
                          onClick={() => toggleFilter(filter)}
                          className="flex items-center gap-1 px-2 py-1 bg-accent-gold/10 border border-accent-gold/30 rounded-md text-xs text-accent-gold hover:bg-accent-gold/20 transition-colors"
                        >
                          {filter}
                          <X className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Filter Toggle (Mobile) */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                      "lg:hidden",
                      showFilters && "bg-accent-gold/10 text-accent-gold"
                    )}
                  >
                    <Filter className="w-4 h-4" />
                  </Button>

                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-background-card rounded-md border border-border-subtle">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "p-2 transition-colors",
                        viewMode === "grid"
                          ? "text-accent-gold bg-background-card-hover"
                          : "text-text-muted hover:text-text-primary"
                      )}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "p-2 transition-colors",
                        viewMode === "list"
                          ? "text-accent-gold bg-background-card-hover"
                          : "text-text-muted hover:text-text-primary"
                      )}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Grid */}
              {filteredWorlds.length > 0 ? (
                <div
                  className={cn(
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  )}
                >
                  {filteredWorlds.map((world) => (
                    <WorldCard key={world.id} {...world} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background-card border border-border-subtle mb-4">
                    <Search className="w-8 h-8 text-text-muted" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
                    No worlds found
                  </h3>
                  <p className="text-text-secondary mb-6">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <Button variant="secondary" onClick={clearAllFilters}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
