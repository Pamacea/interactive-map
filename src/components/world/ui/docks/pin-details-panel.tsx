"use client";

import * as React from "react";
import { MapPin, Image as ImageIcon, Tag, Link2, GripVertical, Settings, Layers, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PinIconPicker } from "@/components/pins/ui/pin-icon-picker";
import { PinGallerySection } from "@/components/pins/ui/pin-gallery-section";
import { TagAutosuggestTextarea } from "@/components/world/ui/shared/tag-autosuggest-textarea";
import { LinkedContentRenderer } from "@/components/world/ui/shared/linked-content-renderer";
import { CollapsibleSection } from "./shared/collapsible-section";
import type { Pin } from "@/types/pin.type";
import { generateSlug } from "@/lib/slug";
import { useUpdatePin } from "@/stores/pins/use-pins-data-store";
import { useMapStore } from "@/stores/map-store";

interface PinDetailsPanelProps {
  pin: Pin;
  worldId: string;
}

/**
 * PinDetailsPanel - Refactored pin details for the right dock
 *
 * Uses collapsible sections to organize content:
 * - Header (title, icon, color)
 * - Description (with tag support)
 * - Tags/References
 * - Gallery
 * - Lore/Linked content
 * - Metadata (coords, properties)
 * - Appearance settings
 */
export function PinDetailsPanel({ pin, worldId }: PinDetailsPanelProps) {
  const queryClient = useQueryClient();
  const updatePin = useUpdatePin();

  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(pin.title);
  const titleInputRef = React.useRef<HTMLInputElement>(null);

  const [isEditingDesc, setIsEditingDesc] = React.useState(false);
  const [editedDesc, setEditedDesc] = React.useState(pin.description || "");

  const updatePinServer = React.useCallback(async (data: Parameters<typeof import("@/actions/pins").updatePin>[0]) => {
    const { updatePin: updatePinAction } = await import("@/actions/pins");
    return updatePinAction(data);
  }, []);

  React.useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const handleSaveTitle = async () => {
    if (editedTitle.trim() && editedTitle !== pin.title) {
      await updatePinServer({ id: pin.id, title: editedTitle.trim() });

      // Update slug
      const generatedSlug = generateSlug(editedTitle.trim());
      if (generatedSlug) {
        await updatePinServer({ id: pin.id, slug: generatedSlug });
      }

      queryClient.invalidateQueries({ queryKey: ["pin-by-id"] });
      queryClient.invalidateQueries({ queryKey: ["pins"] });
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

  const config = {
    color: pin.color,
    label: pin.pinType,
  };

  // Prevent map interactions when editing in the panel
  const handleInteraction = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className="h-full flex flex-col"
      onMouseDown={handleInteraction}
      onMouseUp={handleInteraction}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      onTouchEnd={handleInteraction}
      onTouchMove={handleInteraction}
    >
      {/* Pin Header */}
      <div className="p-4 border-b border-iron bg-obsidian/50">
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
          <div className="flex-1 min-w-0 space-y-2">
            {/* Type | Tag row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-sm bg-black/30"
                style={{ color: config.color }}
              >
                {config.label}
              </span>

              {pin.slug ? (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-sm bg-accent-gold/10 border border-accent-gold/30 text-accent-gold">
                  <span className="opacity-60">#</span>
                  <span className="font-mono">{pin.slug}</span>
                </span>
              ) : null}
            </div>

            {/* Title row */}
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  ref={titleInputRef}
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleSaveTitle)}
                  className="flex-1 bg-transparent text-lg font-semibold text-text-primary border-b-2 border-accent-gold outline-none px-1 py-0.5"
                  data-no-shortcut="true"
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable content with collapsible sections */}
      <div className="flex-1 overflow-y-auto">
        <CollapsibleSection
          title="Description"
          icon={<MapPin className="w-4 h-4" />}
          defaultOpen={true}
          storageKey={`pin-${pin.id}-description`}
        >
          {!isEditingDesc ? (
            <div
              className="cursor-pointer rounded-sm p-3 -mx-1 border border-transparent hover:border-border-subtle hover:bg-white/5 transition-all min-h-16 group"
              onClick={() => setIsEditingDesc(true)}
            >
              {pin.description ? (
                <DescriptionWithTags content={pin.description} worldId={worldId} />
              ) : (
                <p className="text-sm text-text-muted italic group-hover:not-italic">
                  Add a description... Use #tag to create links
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <TagAutosuggestTextarea
                value={editedDesc}
                onChange={(newValue) => setEditedDesc(newValue)}
                worldId={worldId}
                placeholder="Add a description... Use #tag to create links"
                minRows={4}
                onCancel={() => {
                  setEditedDesc(pin.description || "");
                  setIsEditingDesc(false);
                }}
              />
              <div className="flex items-center justify-end gap-2">
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
          )}
        </CollapsibleSection>

        <ReferencesSection pinId={pin.id} description={pin.description} worldId={worldId} />

        <PinLayerSection pin={pin} />

        <PinGalleryCollapsibleSection pin={pin} worldId={worldId} />

        <AppearanceSection pin={pin} updatePin={updatePin} />

        <CollapsibleSection
          title="Coordinates"
          icon={<GripVertical className="w-4 h-4" />}
          defaultOpen={false}
          storageKey={`pin-${pin.id}-coordinates`}
        >
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
        </CollapsibleSection>

        <PropertiesSection pin={pin} />
      </div>
    </div>
  );
}

/**
 * Description with Obsidian-style #tag rendering
 */
interface DescriptionWithTagsProps {
  content: string;
  worldId: string;
}

function DescriptionWithTags({ content, worldId }: DescriptionWithTagsProps) {
  return <LinkedContentRenderer content={content} worldId={worldId} />;
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

function ReferencesSection({ pinId, description }: ReferencesSectionProps) {
  // Extract tags from description
  const extractedTags = React.useMemo(() => {
    if (!description) return [];
    const tagRegex = /#([\w-]+)/g;
    const tags: string[] = [];
    let match;
    while ((match = tagRegex.exec(description)) !== null) {
      tags.push(match[1]);
    }
    return Array.from(new Set(tags));
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
    const tagMap = new Map<string, { count: number; relation?: { tag?: { color?: string }; targetTitle?: string } }>();

    extractedTags.forEach(tag => {
      tagMap.set(tag, { count: (tagMap.get(tag)?.count || 0) + 1 });
    });

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
    <CollapsibleSection
      title="References"
      icon={<Tag className="w-4 h-4" />}
      badge={hasContent ? allTags.length : undefined}
      defaultOpen={hasContent}
      storageKey={`pin-${pinId}-references`}
    >
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
    </CollapsibleSection>
  );
}

/**
 * Pin Layer Section - Allows changing which layer a pin belongs to
 */
interface PinLayerSectionProps {
  pin: Pin;
}

function PinLayerSection({ pin }: PinLayerSectionProps) {
  const queryClient = useQueryClient();
  const layers = useMapStore((state) => state.layers);
  const updatePin = useUpdatePin();
  const [isChangingLayer, setIsChangingLayer] = React.useState(false);

  // Filter out base map layer from options (pins shouldn't be on base map)
  const availableLayers = React.useMemo(() => {
    return layers.filter(layer => !(layer.isBaseMap || layer.type === "BASE_MAP"));
  }, [layers]);

  // Find current layer name
  const currentLayer = React.useMemo(() => {
    return layers.find(layer => layer.id === pin.layerId);
  }, [layers, pin.layerId]);

  const handleLayerChange = async (newLayerId: string) => {
    if (newLayerId === pin.layerId) return;

    setIsChangingLayer(true);
    try {
      const { updatePin: updatePinAction } = await import("@/actions/pins");
      await updatePinAction({ id: pin.id, layerId: newLayerId || null });

      // Update local store optimistically
      updatePin(pin.id, { layerId: newLayerId || null });

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["pin-by-id"] });
      queryClient.invalidateQueries({ queryKey: ["pins"] });
    } catch (error) {
      console.error("Failed to update pin layer:", error);
    } finally {
      setIsChangingLayer(false);
    }
  };

  return (
    <CollapsibleSection
      title="Layer"
      icon={<Layers className="w-4 h-4" />}
      defaultOpen={false}
      storageKey={`pin-${pin.id}-layer`}
    >
      <div className="space-y-2">
        {/* Current layer display */}
        <div className="flex items-center justify-between p-3 rounded-sm bg-black/20 border border-border-subtle">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-text-muted" />
            <span className="text-sm text-text-secondary">
              {currentLayer?.name || "No layer"}
            </span>
          </div>
          {currentLayer && (
            <span className="text-xs px-2 py-0.5 rounded-sm bg-accent-gold/10 border border-accent-gold/30 text-accent-gold">
              Active
            </span>
          )}
        </div>

        {/* Layer selector */}
        <div className="space-y-1.5">
          <label className="text-xs text-text-muted px-1">Move to layer:</label>
          <div className="grid grid-cols-2 gap-1.5">
            {/* No layer option */}
            <button
              onClick={() => handleLayerChange("")}
              disabled={isChangingLayer}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-medium transition-all
                ${!pin.layerId
                  ? "bg-accent-gold/20 border border-accent-gold/50 text-accent-gold"
                  : "bg-black/20 border border-border-subtle text-text-secondary hover:border-border-hover hover:bg-white/5"
                }
                ${isChangingLayer ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {!pin.layerId && <Check className="w-3 h-3" />}
              No layer
            </button>

            {/* Layer options */}
            {availableLayers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => handleLayerChange(layer.id)}
                disabled={isChangingLayer || layer.locked}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-medium transition-all
                  ${pin.layerId === layer.id
                    ? "bg-accent-gold/20 border border-accent-gold/50 text-accent-gold"
                    : "bg-black/20 border border-border-subtle text-text-secondary hover:border-border-hover hover:bg-white/5"
                  }
                  ${layer.locked ? "opacity-50 cursor-not-allowed" : ""}
                  ${isChangingLayer ? "opacity-50" : ""}
                `}
                title={layer.locked ? "This layer is locked" : layer.name}
              >
                {pin.layerId === layer.id && <Check className="w-3 h-3" />}
                <span className="truncate">{layer.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Warning if layer is locked */}
        {currentLayer?.locked && (
          <p className="text-xs text-text-muted italic px-1">
            This pin is on a locked layer.
          </p>
        )}
      </div>
    </CollapsibleSection>
  );
}

/**
 * Pin Gallery Section - Collapsible wrapper around PinGallerySection
 */
interface PinGalleryCollapsibleSectionProps {
  pin: Pin;
  worldId: string;
}

function PinGalleryCollapsibleSection({ pin, worldId }: PinGalleryCollapsibleSectionProps) {
  const [_optimisticallyAddedImages, setOptimisticallyAddedImages] = React.useState<Set<string>>(new Set());
  const [optimisticallyRemovedImages, setOptimisticallyRemovedImages] = React.useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  // Load gallery images for this pin
  const { data: galleryImages = [] } = useQuery({
    queryKey: ["pin-gallery", pin.id],
    queryFn: async () => {
      const { getGalleryItemsByPin } = await import("@/actions/gallery");
      return getGalleryItemsByPin(pin.id);
    },
    enabled: !!pin.id,
  });

  const linkedImages = React.useMemo(() => {
    return galleryImages.filter(img => {
      if (optimisticallyRemovedImages.has(img.id)) return false;
      return true;
    });
  }, [galleryImages, optimisticallyRemovedImages]);

  return (
    <CollapsibleSection
      title="Gallery"
      icon={<ImageIcon className="w-4 h-4" />}
      badge={linkedImages.length > 0 ? linkedImages.length : undefined}
      defaultOpen={linkedImages.length > 0}
      storageKey={`pin-${pin.id}-gallery`}
    >
      <PinGallerySection
        pinId={pin.id}
        worldId={worldId}
        linkedImages={linkedImages}
        onImageLinked={(image) => {
          setOptimisticallyAddedImages(prev => new Set(prev).add(image.id));
          queryClient.invalidateQueries({ queryKey: ["pin-gallery", pin.id] });
        }}
        onImageUnlinked={(imageId) => {
          setOptimisticallyRemovedImages(prev => new Set(prev).add(imageId));
          setOptimisticallyAddedImages(prev => {
            const next = new Set(prev);
            next.delete(imageId);
            return next;
          });
          queryClient.invalidateQueries({ queryKey: ["pin-gallery", pin.id] });
        }}
      />
    </CollapsibleSection>
  );
}

/**
 * Appearance Section - Editable icon and color
 */
interface AppearanceSectionProps {
  pin: Pin;
  updatePin: (pinId: string, updates: Partial<Pin>) => void;
}

function AppearanceSection({ pin, updatePin }: AppearanceSectionProps) {
  const queryClient = useQueryClient();
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

    updatePin(pin.id, data);
    queryClient.invalidateQueries({ queryKey: ["pin-by-id"] });
    queryClient.invalidateQueries({ queryKey: ["pins"] });
  };

  return (
    <CollapsibleSection
      title="Appearance"
      icon={<Settings className="w-4 h-4" />}
      defaultOpen={false}
      storageKey={`pin-${pin.id}-appearance`}
    >
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
        currentIconBackground={pin.iconBackground ?? undefined}
        onUpdate={handleIconUpdate}
        trigger={<button type="button" style={{ display: 'none' }} />}
        open={isIconPickerOpen}
        onOpenChange={setIsIconPickerOpen}
      />
    </CollapsibleSection>
  );
}

/**
 * Properties Section - Shows custom properties
 */
interface PropertiesSectionProps {
  pin: Pin;
}

function PropertiesSection({ pin }: PropertiesSectionProps) {
  const properties = (pin.properties as Record<string, unknown>) || {};
  const hasProperties = Object.keys(properties).length > 0;

  if (!hasProperties) return null;

  return (
    <CollapsibleSection
      title="Properties"
      icon={<Settings className="w-4 h-4" />}
      defaultOpen={false}
      storageKey={`pin-${pin.id}-properties`}
    >
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
    </CollapsibleSection>
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
