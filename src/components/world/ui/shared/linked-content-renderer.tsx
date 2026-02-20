"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSelectPin } from "@/stores/use-pins-store";

interface LinkedContentRendererProps {
  content: string;
  className?: string;
  worldId: string;
}

/**
 * Renders text with #tags converted to clickable links
 * Attempts to find and navigate to the actual entity (pin, character, lore)
 * Falls back to search if entity not found
 */
export function LinkedContentRenderer({ content, className, worldId }: LinkedContentRendererProps) {
  const _router = useRouter();
  const selectPin = useSelectPin();

  // Fetch all entities to resolve tags
  const { data: pins = [] } = useQuery({
    queryKey: ["world-pins", worldId],
    queryFn: async () => {
      const { getPinsByWorld } = await import("@/actions/pins");
      return getPinsByWorld(worldId);
    },
    enabled: !!worldId && content.includes("#"),
  });

  const { data: characters = [] } = useQuery({
    queryKey: ["world-characters", worldId],
    queryFn: async () => {
      const { getCharactersByWorld } = await import("@/actions/characters");
      return getCharactersByWorld(worldId);
    },
    enabled: !!worldId && content.includes("#"),
  });

  const { data: loreEntries = [] } = useQuery({
    queryKey: ["world-lore", worldId],
    queryFn: async () => {
      const { getLoreEntriesByWorld } = await import("@/actions/lore");
      return getLoreEntriesByWorld(worldId);
    },
    enabled: !!worldId && content.includes("#"),
  });

  // Build a lookup map for slug -> entity
  const entityMap = React.useMemo(() => {
    const map = new Map<string, { type: string; id: string; name: string }>();

    pins.forEach((pin: { id: string; slug?: string; title: string }) => {
      if (pin.slug) map.set(pin.slug, { type: "pin", id: pin.id, name: pin.title });
    });

    characters.forEach((char: { id: string; slug?: string; name: string }) => {
      if (char.slug) map.set(char.slug, { type: "character", id: char.id, name: char.name });
    });

    loreEntries.forEach((entry: { id: string; slug?: string; title: string }) => {
      if (entry.slug) map.set(entry.slug, { type: "lore", id: entry.id, name: entry.title });
    });

    return map;
  }, [pins, characters, loreEntries]);

  // Parse content and convert #tags to links
  const renderContent = () => {
    if (!content) return null;

    // Split by # but keep the delimiter
    const parts = content.split(/(#[\w-]+)/g);

    return parts.map((part, index) => {
      // Check if this part is a hashtag
      if (part.startsWith("#")) {
        const slug = part.substring(1);
        const entity = entityMap.get(slug);

        return (
          <TagLink
            key={`tag-${index}-${slug}`}
            slug={slug}
            entity={entity}
            onClick={() => handleTagClick(slug, entity)}
          />
        );
      }
      // Regular text - preserve line breaks
      return (
        <span key={`text-${index}`} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  const handleTagClick = (slug: string, entity: { type: string; id: string; name: string } | undefined) => {
    if (entity) {
      // If it's a pin, select it
      if (entity.type === "pin") {
        selectPin(entity.id);
      } else {
        // For other entities, open their details
        // TODO: Implement character/lore detail panels
        console.log(`Opening ${entity.type}: ${entity.name}`);
      }
    } else {
      // Fallback to search
      router.push(`/world/${worldId}?q=${encodeURIComponent(slug)}`);
    }
  };

  return (
    <div className={cn("text-sm text-text-secondary leading-relaxed", className)}>
      {renderContent()}
    </div>
  );
}

interface TagLinkProps {
  slug: string;
  entity: { type: string; id: string; name: string } | undefined;
  onClick: () => void;
}

function TagLink({ slug, entity, onClick }: TagLinkProps) {
  const hasEntity = !!entity;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-accent-gold hover:text-accent-gold/80 hover:bg-accent-gold/20 font-medium transition-colors",
        hasEntity ? "bg-accent-gold/10" : "bg-accent-gold/5 opacity-80"
      )}
      title={hasEntity ? `View ${entity.name}` : `Search for "${slug}"`}
    >
      #{hasEntity ? entity.name : slug}
    </button>
  );
}
