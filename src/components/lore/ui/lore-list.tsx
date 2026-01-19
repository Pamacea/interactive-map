"use client";

import { useState, useMemo } from "react";
import { BookOpen, Badge, Plus, Search, Filter } from "lucide-react";
import { useLoreStore } from "@/stores/use-lore-store";
import { LoreCategory } from "@/types/lore.type";
import { LoreCard } from "./lore-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge as ShadcnBadge } from "@/components/ui/badge";

interface LoreListProps {
  worldId: string;
}

export function LoreList({ worldId }: LoreListProps) {
  const loreEntries = useLoreStore((state) => state.loreEntries);
  const selectedLoreId = useLoreStore((state) => state.selectedLoreId);
  const searchTerm = useLoreStore((state) => state.searchTerm);
  const categoryFilters = useLoreStore((state) => state.categoryFilters);
  const showVisibleOnly = useLoreStore((state) => state.showVisibleOnly);

  const selectLore = useLoreStore((state) => state.selectLore);
  const setSearchTerm = useLoreStore((state) => state.setSearchTerm);
  const toggleCategoryFilter = useLoreStore((state) => state.toggleCategoryFilter);
  const toggleShowVisibleOnly = useLoreStore((state) => state.toggleShowVisibleOnly);
  const startCreating = useLoreStore((state) => state.startCreating);

  // Local filter state for UI
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Filter lore entries based on filters
  const filteredLoreEntries = useMemo(() => {
    return loreEntries.filter((lore) => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          lore.title.toLowerCase().includes(searchLower) ||
          lore.content.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (!categoryFilters[lore.category]) {
        return false;
      }

      // Visibility filter
      if (showVisibleOnly && !lore.isVisible) {
        return false;
      }

      return true;
    });
  }, [loreEntries, searchTerm, categoryFilters, showVisibleOnly]);

  // Category labels for display
  const categoryLabels: Record<LoreCategory, string> = {
    GENERAL: "General",
    HISTORY: "History",
    GEOGRAPHY: "Geography",
    CHARACTERS: "Characters",
    FACTIONS: "Factions",
    MAGIC: "Magic",
    ITEMS: "Items",
    QUESTS: "Quests",
    CUSTOM: "Custom",
  };

  // Handle search input with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    setSearchTerm(value);
  };

  const loreCount = filteredLoreEntries.length;
  const totalCount = loreEntries.length;

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-secondary">Lore</h2>
        <Button
          size="sm"
          variant="ghost"
          onClick={startCreating}
          className="h-8 px-3 text-accent-gold hover:bg-accent-gold/10"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
        <Input
          type="text"
          placeholder="Search lore..."
          value={localSearchTerm}
          onChange={handleSearchChange}
          className="pl-9 h-9"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={showVisibleOnly ? "default" : "outline"}
          onClick={toggleShowVisibleOnly}
          className={`
            px-2 py-1 text-xs h-7
            ${showVisibleOnly
              ? "bg-accent-gold/20 text-accent-gold border-accent-gold/30 hover:bg-accent-gold/30"
              : ""
            }
          `}
        >
          Visible Only
        </Button>
        <div className="ml-auto">
          <ShadcnBadge
            variant="outline"
            className="text-xs bg-accent-gold/10 text-accent-gold border-accent-gold/30"
          >
            {loreCount}
            {totalCount > loreCount && ` / ${totalCount}`}
          </ShadcnBadge>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-1">
        {Object.entries(categoryLabels).map(([category, label]) => {
          const isEnabled = categoryFilters[category as LoreCategory];
          return (
            <Button
              key={category}
              size="sm"
              variant={isEnabled ? "outline" : "ghost"}
              onClick={() => toggleCategoryFilter(category as LoreCategory)}
              className={`
                px-2 py-1 text-xs h-7
                ${isEnabled
                  ? "bg-background-elevated text-text-secondary border-border-base"
                  : "bg-background-base text-text-muted border-border-base opacity-50"
                }
              `}
              title={`Filter by ${label}`}
            >
              {label}
            </Button>
          );
        })}
      </div>

      {/* Lore List */}
      {filteredLoreEntries.length === 0 ? (
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="flex flex-col items-center gap-1 text-center">
            <BookOpen className="w-12 h-12 text-text-muted" />
            <p className="text-sm text-text-muted">No lore entries found</p>
            <p className="text-xs text-text-muted">
              {totalCount > 0
                ? "Try adjusting your filters"
                : "Create your first lore entry"}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredLoreEntries.map((lore) => (
            <LoreCard
              key={lore.id}
              lore={lore}
              isSelected={selectedLoreId === lore.id}
              onSelect={() => selectLore(lore.id)}
              categoryLabel={categoryLabels[lore.category]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
