"use client";

import * as React from "react";
import { X, ChevronLeft, ChevronRight, MapPin, GripVertical, Image as ImageIcon, Plus, Tag, Link2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelectedPinId, useClearSelection, useUpdatePinServer } from "@/stores/use-pins-store";
import { usePinById } from "@/stores/use-pins-store";
import { useUpdatePin } from "@/stores/pins/use-pins-data-store";
import { useShowPanel, useHidePanel, usePanelState, useToggleCollapse } from "@/store/use-floating-panels-store";
import type { OptimizedWorldLayer } from "@/types/world.type";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PinIconPicker } from "@/components/pins/ui/pin-icon-picker";
import { PinGallerySection } from "@/components/pins/ui/pin-gallery-section";
import type { Pin } from "@/types/pin.type";
import type { GalleryItemWithRelations } from "@/types/gallery.type";

/**
 * Pin Details Sidebar - Fixed position sidebar inspired by LoL interactive map
 * - Fixed position on right side of screen
 * - Collapsible to narrow strip (60px)
 * - Expandable width (380px - 600px)
 * - Not draggable, unlike FloatingPanel
 * - Smooth transitions for collapse/expand
 */

interface PinDetailsSidebarProps {
  worldId: string;
  worldLayers?: OptimizedWorldLayer[];
}

export function PinDetailsSidebar({ worldId, worldLayers = [] }: PinDetailsSidebarProps) {
  const selectedPinId = useSelectedPinId();
  const clearSelection = useClearSelection();
  const pin = usePinById(selectedPinId ?? "");
  const showPanel = useShowPanel();
  const hidePanel = useHidePanel();
  const toggleCollapse = useToggleCollapse();
  const panelState = usePanelState("pin-details");

  // Auto-show sidebar when pin is selected
  // Auto-hide sidebar when pin is deselected
  // Using refs to avoid dependency issues with Zustand functions
  const showPanelRef = React.useRef(showPanel);
  const hidePanelRef = React.useRef(hidePanel);

  React.useEffect(() => {
    showPanelRef.current = showPanel;
    hidePanelRef.current = hidePanel;
  });

  React.useEffect(() => {
    if (selectedPinId && pin) {
      // Show sidebar when pin is selected
      if (!panelState.isVisible) {
        showPanelRef.current("pin-details");
      }
    } else if (!selectedPinId && panelState.isVisible) {
      // Hide sidebar when no pin is selected
      hidePanelRef.current("pin-details");
    }
  }, [selectedPinId, pin, panelState.isVisible]);

  // Custom close handler
  const handleClose = () => {
    clearSelection();
  };

  const handleToggleCollapse = () => {
    toggleCollapse("pin-details");
  };

  // Don't render if not visible OR if no pin is selected
  if (!panelState.isVisible || !selectedPinId) return null;

  const isCollapsed = panelState.isCollapsed;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "fixed right-0 top-0 h-full bg-obsidian/95 backdrop-blur-md border-l border-iron shadow-2xl z-20 transition-all duration-300 ease-in-out",
        "flex flex-col",
        isCollapsed ? "w-16" : "w-[380px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-iron bg-obsidian/50">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-5 h-5 text-accent-gold flex-shrink-0" />
            <h2 className="text-sm font-display font-semibold text-bone uppercase tracking-wide truncate">
              {pin?.title || "Pin Details"}
            </h2>
          </div>
        ) : (
          <MapPin className="w-5 h-5 text-accent-gold mx-auto" />
        )}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={handleToggleCollapse}
            className="p-1.5 text-bone-dark/60 hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-bone-dark/60 hover:text-blood hover:bg-blood/10 rounded-sm transition-colors"
            aria-label="Close sidebar"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-iron/20 scrollbar-track-transparent">
          {pin ? (
            <PinSidebarContent
              pin={pin}
              worldId={worldId}
            />
          ) : (
            <div className="flex items-center justify-center h-full min-h-40 p-8 text-center">
              <div className="space-y-2">
                <MapPin className="w-8 h-8 text-text-muted mx-auto" />
                <p className="text-sm text-text-muted">No pin selected</p>
                <p className="text-xs text-text-muted">
                  Click on a pin to view its details
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Resize handle */}
      <div className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-accent-gold/30 transition-colors group">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4 text-text-muted" />
        </div>
      </div>
    </div>
  );
}

/**
 * Pin Sidebar Content - Main content area for the sidebar
 * Inspired by LoL's champion detail sidebar with sections
 */
interface PinSidebarContentProps {
  pin: Pin;
  worldId: string;
}

function PinSidebarContent({ pin, worldId }: PinSidebarContentProps) {
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(pin.title);
  const titleInputRef = React.useRef<HTMLInputElement>(null);

  const [isEditingDesc, setIsEditingDesc] = React.useState(false);
  const [editedDesc, setEditedDesc] = React.useState(pin.description || "");

  const [linkedImages, setLinkedImages] = React.useState<GalleryItemWithRelations[]>([]);

  const updatePinServer = useUpdatePinServer();
  const queryClient = useQueryClient();

  const config = {
    color: pin.color,
    label: pin.pinType,
  };

  // Load gallery images for this pin
  const { data: galleryImages = [] } = useQuery({
    queryKey: ["pin-gallery", pin.id],
    queryFn: async () => {
      const { getGalleryItemsByPin } = await import("@/actions/gallery");
      return getGalleryItemsByPin(pin.id);
    },
    enabled: !!pin.id,
  });

  // Update linkedImages when galleryImages changes
  React.useEffect(() => {
    setLinkedImages(galleryImages);
  }, [galleryImages]);

  React.useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const handleSaveTitle = async () => {
    if (editedTitle.trim() && editedTitle !== pin.title) {
      await updatePinServer({ id: pin.id, title: editedTitle.trim() });
      queryClient.invalidateQueries({ queryKey: ["pin-by-id"] });
    } else {
      setEditedTitle(pin.title);
    }
    setIsEditingTitle(false);
  };

  const handleSaveDescription = async () => {
    if (editedDesc !== pin.description) {
      await updatePinServer({ id: pin.id, description: editedDesc });
      queryClient.invalidateQueries({ queryKey: ["pin-by-id"] });
    }
    setIsEditingDesc(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      action();
    } else if (e.key === "Escape") {
      if (isEditingTitle) {
        setEditedTitle(pin.title);
        setIsEditingTitle(false);
      } else {
        setEditedDesc(pin.description || "");
        setIsEditingDesc(false);
      }
    }
  };

  const properties = (pin.properties as Record<string, unknown>) || {};

  return (
    <div className="p-5 space-y-6">
      {/* Header Section - Pin Type and Title */}
      <section className="space-y-3">
        <div className="flex items-start gap-3">
          {/* Pin type indicator with ornate border */}
          <div
            className="flex h-12 w-12 items-center justify-center rounded-sm flex-shrink-0 ring-1 ring-inset ring-white/10 relative"
            style={{ backgroundColor: `${config.color}15` }}
          >
            {/* Ornate corners */}
            <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent-gold/40" />
            <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent-gold/40" />
            <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent-gold/40" />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent-gold/40" />

            <span className="text-2xl" style={{ color: config.color }}>
              {getPinEmoji(pin.pinType)}
            </span>
          </div>

          {/* Title with inline edit */}
          <div className="flex-1 min-w-0">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  ref={titleInputRef}
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleSaveTitle)}
                  className="flex-1 bg-transparent text-lg font-semibold text-text-primary border-b-2 border-accent-gold outline-none px-1 py-0.5"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleSaveTitle}
                  className="h-7 w-7 text-green-500 hover:text-green-400"
                >
                  ✓
                </Button>
              </div>
            ) : (
              <div
                className="group cursor-pointer py-1 px-2 rounded hover:bg-white/5 transition-colors -ml-2"
                onClick={() => setIsEditingTitle(true)}
              >
                <h3 className="text-lg font-display font-semibold text-text-primary truncate">
                  {pin.title}
                </h3>
                <p
                  className="text-xs font-medium uppercase tracking-wider mt-1"
                  style={{ color: config.color }}
                >
                  {config.label}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Description Section with Obsidian-style #tag support */}
      <section>
        <div className="relative mb-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-iron" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-obsidian px-2 text-xs text-text-muted uppercase tracking-wider">
              Description
            </span>
          </div>
        </div>

        {!isEditingDesc ? (
          <div
            className="cursor-pointer rounded-sm p-3 -mx-3 border border-transparent hover:border-border-subtle hover:bg-white/5 transition-all min-h-16 group"
            onClick={() => setIsEditingDesc(true)}
          >
            {pin.description ? (
              <DescriptionWithTags content={pin.description} />
            ) : (
              <p className="text-sm text-text-muted italic group-hover:not-italic">
                Add a description... Use #tag to create links
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <textarea
              value={editedDesc}
              onChange={(e) => setEditedDesc(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setEditedDesc(pin.description || "");
                  setIsEditingDesc(false);
                }
              }}
              className="w-full min-h-24 px-3 py-2 bg-background-input border border-border-subtle rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:border-accent-gold focus:outline-none resize-y font-mono"
              placeholder="Add a description... Use #tag to create links"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-text-muted">
                Tip: Use #tag-name to create clickable tags
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditedDesc(pin.description || "");
                    setIsEditingDesc(false);
                  }}
                  className="h-7 text-xs text-text-muted"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveDescription}
                  className="h-7 text-xs bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* References Section - Extracted from description */}
      <ReferencesSection pinId={pin.id} description={pin.description} worldId={worldId} />

      {/* Gallery Section - Full component with add button */}
      <section>
        <div className="relative mb-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-iron" />
          </div>
          <div className="relative flex justify-between items-center">
            <span className="bg-obsidian px-2 text-xs text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3 h-3" />
              Gallery
            </span>
            <span className="bg-obsidian px-2 text-xs text-accent-gold">
              {linkedImages.length}
            </span>
          </div>
        </div>
        <PinGallerySection
          pinId={pin.id}
          worldId={worldId}
          linkedImages={linkedImages}
          onImageLinked={(image) => {
            setLinkedImages((prev) => [...prev, image]);
            queryClient.invalidateQueries({ queryKey: ["pin-gallery", pin.id] });
          }}
          onImageUnlinked={(imageId) => {
            setLinkedImages((prev) => prev.filter((img) => img.id !== imageId));
            queryClient.invalidateQueries({ queryKey: ["pin-gallery", pin.id] });
          }}
        />
      </section>

      {/* Icon & Appearance Section - Editable */}
      <PinSidebarAppearance pin={pin} worldId={worldId} />

      {/* Coordinates Section */}
      <section>
        <div className="relative mb-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-iron" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-obsidian px-2 text-xs text-text-muted uppercase tracking-wider">
              Coordinates
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-sm bg-black/20 border border-border-subtle text-center">
            <div className="text-xs text-text-muted mb-1">Latitude</div>
            <div className="text-sm font-mono text-text-primary">
              {pin.latitude.toFixed(4)}
            </div>
          </div>
          <div className="p-3 rounded-sm bg-black/20 border border-border-subtle text-center">
            <div className="text-xs text-text-muted mb-1">Longitude</div>
            <div className="text-sm font-mono text-text-primary">
              {pin.longitude.toFixed(4)}
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      {Object.keys(properties).length > 0 && (
        <section>
          <div className="relative mb-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-iron" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-obsidian px-2 text-xs text-text-muted uppercase tracking-wider">
                Properties
              </span>
            </div>
          </div>
          <div className="space-y-1 rounded-sm bg-black/20 p-3">
            {Object.entries(properties).slice(0, 6).map(([key, value]) => (
              <div
                key={key}
                className="flex items-start justify-between gap-3 text-sm py-1 px-2 rounded hover:bg-white/5"
              >
                <span className="text-text-muted capitalize text-xs">{key}</span>
                <span className="text-text-primary text-xs font-medium text-right">
                  {String(value)}
                </span>
              </div>
            ))}
            {Object.keys(properties).length > 6 && (
              <div className="text-xs text-text-muted text-center py-1 text-accent-gold/60">
                +{Object.keys(properties).length - 6} more
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Description with Obsidian-style #tag rendering
 * Parses #tags and renders them as clickable links
 */
interface DescriptionWithTagsProps {
  content: string;
}

function DescriptionWithTags({ content }: DescriptionWithTagsProps) {
  // Parse the content and replace #tags with clickable elements
  const parsedContent = React.useMemo(() => {
    const tagRegex = /#([\w-]+)/g;
    const parts: Array<{ text: string; isTag: boolean; tag?: string }> = [];
    let lastIndex = 0;
    let match;

    while ((match = tagRegex.exec(content)) !== null) {
      // Add text before the tag
      if (match.index > lastIndex) {
        parts.push({ text: content.slice(lastIndex, match.index), isTag: false });
      }
      // Add the tag
      parts.push({ text: match[0], isTag: true, tag: match[1] });
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({ text: content.slice(lastIndex), isTag: false });
    }

    return parts;
  }, [content]);

  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
      {parsedContent.map((part, i) => (
        <React.Fragment key={i}>
          {part.isTag ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30 cursor-pointer transition-colors">
              <Tag className="h-3 w-3" />
              {part.tag}
            </span>
          ) : (
            part.text
          )}
        </React.Fragment>
      ))}
    </p>
  );
}

/**
 * Get emoji for pin type
 */
function getPinEmoji(pinType: string): string {
  const emojiMap: Record<string, string> = {
    CITY: "🏰",
    VILLAGE: "🏠",
    POI: "📍",
    CHARACTER: "👤",
    DUNGEON: "⚔️",
    SHOP: "🛒",
    QUEST: "📜",
    TREASURE: "💎",
    CUSTOM: "📍",
  };
  return emojiMap[pinType] || "📍";
}

/**
 * References Section - Shows tags extracted from description
 */
interface ReferencesSectionProps {
  pinId: string;
  description: string | null;
  worldId: string;
}

function ReferencesSection({ pinId, description, worldId }: ReferencesSectionProps) {
  // Extract tags from description
  const extractedTags = React.useMemo(() => {
    if (!description) return [];
    const tagRegex = /#([\w-]+)/g;
    const tags: string[] = [];
    let match;
    while ((match = tagRegex.exec(description)) !== null) {
      tags.push(match[1]);
    }
    return Array.from(new Set(tags)); // Unique tags
  }, [description]);

  // Fetch relations from database
  const { data: relations = [] } = useQuery({
    queryKey: ["pin-tags", pinId],
    queryFn: async () => {
      const { getPinTagRelations } = await import("@/actions/tags");
      return getPinTagRelations(pinId);
    },
    enabled: !!pinId,
  });

  // Combine extracted tags with database relations
  const allTags = React.useMemo(() => {
    const tagMap = new Map<string, { count: number; relation?: any }>();

    // Count extracted tags from description
    extractedTags.forEach(tag => {
      tagMap.set(tag, { count: (tagMap.get(tag)?.count || 0) + 1 });
    });

    // Add relations from database
    relations.forEach(relation => {
      if (relation.tag) {
        const tagName = relation.tag.name.replace(/^#/, '');
        tagMap.set(tagName, {
          count: (tagMap.get(tagName)?.count || 0) + 1,
          relation
        });
      }
    });

    return Array.from(tagMap.entries()).map(([name, data]) => ({ name, ...data }));
  }, [extractedTags, relations]);

  const hasContent = extractedTags.length > 0 || relations.length > 0;

  return (
    <section>
      <div className="relative mb-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-iron" />
        </div>
        <div className="relative flex justify-between items-center">
          <span className="bg-obsidian px-2 text-xs text-text-muted uppercase tracking-wider">
            References
          </span>
          <span className="bg-obsidian px-2 text-xs text-accent-gold">
            {allTags.length}
          </span>
        </div>
      </div>

      {!hasContent ? (
        <p className="text-xs text-text-muted text-center py-4">
          No references. Use #tag in description to create links.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {allTags.map(({ name, relation }) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-medium bg-black/30 border border-border-subtle hover:border-accent-gold/50 transition-colors cursor-pointer"
              style={{
                color: relation?.tag?.color || "#d4af37"
              }}
            >
              <Tag className="h-3 w-3" />
              #{name}
              {relation?.targetTitle && (
                <Link2 className="h-3 w-3 ml-1 opacity-60" />
              )}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * Icon & Appearance Section - Editable with PinIconPicker
 */
interface PinSidebarAppearanceProps {
  pin: Pin;
  worldId: string;
}

function PinSidebarAppearance({ pin, worldId }: PinSidebarAppearanceProps) {
  const queryClient = useQueryClient();
  const updatePin = useUpdatePin(); // Import from pins store to update local state
  const [isIconPickerOpen, setIsIconPickerOpen] = React.useState(false);

  const handleIconUpdate = async (data: {
    icon?: string;
    color?: string;
    iconShape?: import("@prisma/client").IconShape;
    iconSize?: number;
    customIcon?: string | null;
    iconBackground?: string | null;
  }) => {
    const { updatePinIconCustomization } = await import("@/actions/pins");
    const result = await updatePinIconCustomization(pin.id, data);

    if (!result.success) {
      console.error("Failed to update icon customization:", result.error);
      return;
    }

    // Update local store immediately for instant map update
    updatePin(pin.id, data);
    // Also invalidate queries for consistency
    queryClient.invalidateQueries({ queryKey: ["pin-by-id"] });
    queryClient.invalidateQueries({ queryKey: ["pins"] });
  };

  return (
    <section onClick={(e) => e.stopPropagation()}>
      <div className="relative mb-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-iron" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-obsidian px-2 text-xs text-text-muted uppercase tracking-wider">
            Appearance
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Icon Picker */}
        <div className="flex items-center justify-between p-3 rounded-sm bg-black/20 border border-border-subtle hover:border-accent-gold/30 transition-colors">
          <div className="flex items-center gap-3">
            {/* Live preview */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center ring-1 ring-inset ring-white/10"
              style={{ backgroundColor: `${pin.color}20` }}
            >
              {pin.customIcon ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={pin.customIcon}
                  alt="Custom icon"
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <span className="text-lg" style={{ color: pin.color }}>
                  {pin.icon || "📍"}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm text-text-secondary">Icon</p>
              <p className="text-xs text-text-muted capitalize">
                {pin.iconShape?.toLowerCase() || "circle"} • {pin.iconSize || pin.size}px
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setIsIconPickerOpen(true);
            }}
            className="h-7 px-2 text-xs text-accent-gold hover:text-accent-gold/80"
          >
            Customize
          </Button>
        </div>

        {/* Color preview */}
        <div className="flex items-center justify-between px-3 py-2 rounded-sm bg-black/20 border border-border-subtle">
          <span className="text-xs text-text-muted">Color</span>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-sm ring-1 ring-inset ring-white/20"
              style={{ backgroundColor: pin.color }}
            />
            <span className="text-xs font-mono text-text-secondary">{pin.color}</span>
          </div>
        </div>

        {/* Shape preview */}
        <div className="flex items-center justify-between px-3 py-2 rounded-sm bg-black/20 border border-border-subtle">
          <span className="text-xs text-text-muted">Shape</span>
          <div className="flex items-center gap-2">
            <ShapePreviewMini shape={pin.iconShape ?? "CIRCLE"} color={pin.color} />
            <span className="text-xs text-text-secondary capitalize">
              {pin.iconShape?.toLowerCase() || "circle"}
            </span>
          </div>
        </div>
      </div>

      {/* PinIconPicker Dialog */}
      <PinIconPicker
        pinId={pin.id}
        currentIcon={pin.icon ?? undefined}
        currentColor={pin.color}
        currentShape={pin.iconShape ?? undefined}
        currentSize={pin.iconSize ?? pin.size}
        currentCustomIcon={pin.customIcon ?? undefined}
        currentIconBackground={(pin as any).iconBackground ?? undefined}
        onUpdate={handleIconUpdate}
        trigger={<button type="button" style={{ display: 'none' }} />}
        open={isIconPickerOpen}
        onOpenChange={setIsIconPickerOpen}
      />
    </section>
  );
}

/**
 * Mini shape preview component
 */
interface ShapePreviewMiniProps {
  shape: string;
  color: string;
}

function ShapePreviewMini({ shape, color }: ShapePreviewMiniProps) {
  const clipPaths: Record<string, string> = {
    CIRCLE: "circle(50%)",
    SQUARE: "inset(0%)",
    TRIANGLE: "polygon(50% 0%, 0% 100%, 100% 100%)",
    STAR: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
    HEXAGON: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
    DIAMOND: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    CUSTOM: "circle(50%)",
  };

  return (
    <div
      className="w-5 h-5"
      style={{
        backgroundColor: `${color}40`,
        clipPath: clipPaths[shape] || clipPaths.CIRCLE,
      }}
    />
  );
}
