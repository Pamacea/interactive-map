"use client";

import * as React from "react";
import { Tag, MapPin, Image as ImageIcon, User, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

// Helper to generate slug from title (client-side version for fallback)
function generateSlugFromTitle(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);
}

interface SuggestionItem {
  id: string;
  type: "pin" | "image" | "lore" | "character" | "tag";
  name: string;
  slug: string; // The slug/tag value to insert
  icon: React.ReactNode;
}

interface TagAutosuggestTextareaProps {
  value: string;
  onChange: (value: string) => void;
  worldId: string;
  placeholder?: string;
  className?: string;
  minRows?: number;
  onCancel?: () => void;
}

export function TagAutosuggestTextarea({
  value,
  onChange,
  worldId,
  placeholder = "Add a description... Use # to link pins, characters, lore, images",
  className,
  minRows = 6,
  onCancel,
}: TagAutosuggestTextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const suggestionListRef = React.useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = React.useState(0);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Fetch all data in parallel for suggestions
  const { data: pins = [] } = useQuery({
    queryKey: ["autosuggest-pins", worldId],
    queryFn: async () => {
      const { getPinsByWorld } = await import("@/actions/pins");
      return getPinsByWorld(worldId);
    },
    enabled: !!worldId && showSuggestions,
  });

  const { data: galleryItems = [] } = useQuery({
    queryKey: ["autosuggest-gallery", worldId],
    queryFn: async () => {
      const { getGalleryItemsByWorld } = await import("@/actions/gallery");
      return getGalleryItemsByWorld(worldId);
    },
    enabled: !!worldId && showSuggestions,
  });

  const { data: loreEntries = [] } = useQuery({
    queryKey: ["autosuggest-lore", worldId],
    queryFn: async () => {
      const { getLoreEntriesByWorld } = await import("@/actions/lore");
      return getLoreEntriesByWorld(worldId);
    },
    enabled: !!worldId && showSuggestions,
  });

  const { data: characters = [] } = useQuery({
    queryKey: ["autosuggest-characters", worldId],
    queryFn: async () => {
      const { getCharactersByWorld } = await import("@/actions/characters");
      return getCharactersByWorld(worldId);
    },
    enabled: !!worldId && showSuggestions,
  });

  // Type labels for display
  const typeLabels: Record<string, string> = {
    pin: "Location",
    image: "Image",
    lore: "Lore",
    character: "Character",
    tag: "Tag",
  };

  // Generate suggestions based on search query
  const suggestions = React.useMemo((): SuggestionItem[] => {
    if (!searchQuery) return [];

    const query = searchQuery.toLowerCase();
    const items: SuggestionItem[] = [];

    // Add pins (with slug)
    pins.forEach((pin: any) => {
      if (pin.title?.toLowerCase().includes(query) || pin.slug?.toLowerCase().includes(query)) {
        items.push({
          id: pin.id,
          type: "pin",
          name: pin.title,
          slug: pin.slug || pin.id,
          icon: <MapPin className="h-4 w-4" />,
        });
      }
    });

    // Add characters (with slug)
    characters.forEach((char: any) => {
      if (char.name?.toLowerCase().includes(query) || char.slug?.toLowerCase().includes(query)) {
        items.push({
          id: char.id,
          type: "character",
          name: char.name,
          slug: char.slug || char.id,
          icon: <User className="h-4 w-4" />,
        });
      }
    });

    // Add lore (with slug)
    loreEntries.forEach((entry: any) => {
      if (entry.title?.toLowerCase().includes(query) || entry.slug?.toLowerCase().includes(query)) {
        items.push({
          id: entry.id,
          type: "lore",
          name: entry.title,
          slug: entry.slug || entry.id,
          icon: <FileText className="h-4 w-4" />,
        });
      }
    });

    // Add images (using slug, fallback to title without extension)
    galleryItems.forEach((item: any) => {
      const title = item.title || "";
      if (title.toLowerCase().includes(query)) {
        items.push({
          id: item.id,
          type: "image",
          name: title,
          slug: item.slug || generateSlugFromTitle(title),
          icon: <ImageIcon className="h-4 w-4" />,
        });
      }
    });

    // Limit to 8 suggestions
    return items.slice(0, 8);
  }, [searchQuery, pins, galleryItems, loreEntries, characters]);

  // Find current tag being typed
  const currentTagRef = React.useRef<{ start: number; end: number } | null>(null);

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const textBeforeCursor = value.substring(0, cursorPosition);
    // Match # followed by any characters (including spaces for multi-word searches)
    const hashtagMatch = textBeforeCursor.match(/#([^\s]*)$/);

    if (hashtagMatch) {
      const tagStart = cursorPosition - hashtagMatch[0].length;
      currentTagRef.current = { start: tagStart, end: cursorPosition };
      setSearchQuery(hashtagMatch[1]);
      setShowSuggestions(true);
      setActiveIndex(0);
    } else {
      currentTagRef.current = null;
      setShowSuggestions(false);
      setSearchQuery("");
    }
  }, [value, cursorPosition]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Escape" && onCancel) {
        onCancel();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case "Enter":
        e.preventDefault();
        insertSuggestion(suggestions[activeIndex]);
        break;
      case "Escape":
        e.preventDefault();
        setShowSuggestions(false);
        break;
      case "Tab":
        e.preventDefault();
        insertSuggestion(suggestions[activeIndex]);
        break;
    }
  };

  // Insert suggestion into textarea
  const insertSuggestion = (suggestion: SuggestionItem) => {
    if (!currentTagRef.current) return;

    const { start, end } = currentTagRef.current;
    // Insert just #slug - clean and simple
    const insertValue = `#${suggestion.slug}`;

    const newValue =
      value.substring(0, start) + insertValue + value.substring(end) + " ";
    onChange(newValue);

    // Move cursor after inserted tag
    setTimeout(() => {
      const newCursorPos = start + insertValue.length + 1;
      textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
      setCursorPosition(newCursorPos);
      setShowSuggestions(false);
    }, 0);
  };

  // Handle cursor position change
  const handleCursorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.target.selectionStart);
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Scroll active suggestion into view
  React.useEffect(() => {
    if (showSuggestions && suggestionListRef.current) {
      const activeElement = suggestionListRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex, showSuggestions]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={handleCursorChange}
        onKeyUp={handleCursorChange}
        className={cn(
          "w-full px-3 py-2 bg-background-input border border-border-subtle rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:border-accent-gold focus:outline-none resize-y",
          className
        )}
        placeholder={placeholder}
        style={{ minHeight: `${minRows * 1.5}rem` }}
        data-no-shortcut="true"
      />

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionListRef}
          className="absolute z-50 w-full mt-1 bg-obsidian border border-border-subtle rounded-sm shadow-lg max-h-64 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.id}`}
              type="button"
              onClick={() => insertSuggestion(suggestion)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-left transition-colors",
                index === activeIndex
                  ? "bg-accent-gold/20 text-accent-gold"
                  : "hover:bg-iron/50 text-text-primary"
              )}
            >
              <span className={cn(
                "flex-shrink-0",
                index === activeIndex ? "text-accent-gold" : "text-text-muted"
              )}>
                {suggestion.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{suggestion.name}</p>
                <p className="text-xs text-text-muted font-mono">#{suggestion.slug}</p>
              </div>
              <span className="text-xs text-text-muted uppercase shrink-0">{typeLabels[suggestion.type]}</span>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && searchQuery.length > 0 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-obsidian border border-border-subtle rounded-sm shadow-lg px-3 py-2 text-sm text-text-muted">
          No results for &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
}
