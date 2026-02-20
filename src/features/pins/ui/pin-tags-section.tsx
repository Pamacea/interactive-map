"use client";

import * as React from "react";
import { Plus, Link, Image as ImageIcon, User, MapPin, Tag, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReferenceType } from "@prisma/client";

// Reference type icons
const REFERENCE_TYPES: Record<
  ReferenceType,
  { icon: React.ReactNode; label: string; color: string }
> = {
  PIN_TO_PIN: { icon: <MapPin className="h-3 w-3" />, label: "Pin", color: "#3b82f6" },
  PIN_TO_IMAGE: { icon: <ImageIcon className="h-3 w-3" />, label: "Image", color: "#10b981" },
  PIN_TO_CHARACTER: { icon: <User className="h-3 w-3" />, label: "Character", color: "#f59e0b" },
  PIN_TO_REGION: { icon: <MapPin className="h-3 w-3" />, label: "Region", color: "#8b5cf6" },
  PIN_TO_LORE: { icon: <Link className="h-3 w-3" />, label: "Lore", color: "#ec4899" },
  CUSTOM: { icon: <Tag className="h-3 w-3" />, label: "Custom", color: "#6b7280" },
};

interface PinTagsSectionProps {
  pinId: string;
  worldId: string;
  availablePins?: Array<{ id: string; title: string }>;
  availableCharacters?: Array<{ id: string; name: string }>;
}

export function PinTagsSection({
  pinId,
  worldId,
  availablePins = [],
  availableCharacters = [],
}: PinTagsSectionProps) {
  const _queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<ReferenceType>("CUSTOM");
  const [_selectedTargetId, setSelectedTargetId] = React.useState<string | null>(null);
  const [tagInput, setTagInput] = React.useState("");

  // Fetch existing tag relations for this pin
  const { data: relations = [], refetch: _refetch } = useQuery({
    queryKey: ["pin-tags", pinId],
    queryFn: async () => {
      const { getPinTagRelations } = await import("@/features/tags");
      return getPinTagRelations(pinId);
    },
    enabled: !!pinId,
    staleTime: 1000 * 60 * 5, // 5 minutes - tags don't change often
    gcTime: 1000 * 60 * 30, // 30 minutes - cache cleanup
  });

  // Fetch world tags
  const { data: worldTags = [] } = useQuery({
    queryKey: ["world-tags", worldId],
    queryFn: async () => {
      const { getTagsByWorld } = await import("@/features/tags");
      return getTagsByWorld(worldId);
    },
    enabled: isDialogOpen,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: async (name: string) => {
      const { createTag } = await import("@/features/tags");
      return createTag({ name, gameWorldId: worldId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["world-tags", worldId] });
    },
  });

  // Add relation mutation
  const addRelationMutation = useMutation({
    mutationFn: async (data: {
      tagId?: string;
      referenceType: ReferenceType;
      targetId?: string;
      targetTitle?: string;
      notes?: string;
    }) => {
      const { addTagRelation } = await import("@/features/tags");
      return addTagRelation({ pinId, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pin-tags", pinId] });
      setIsDialogOpen(false);
      setSearchTerm("");
      setSelectedTargetId(null);
      setTagInput("");
    },
  });

  // Remove relation mutation
  const removeRelationMutation = useMutation({
    mutationFn: async (relationId: string) => {
      const { removeTagRelation } = await import("@/features/tags");
      return removeTagRelation(relationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pin-tags", pinId] });
    },
  });

  // Quick link to another pin
  const handleLinkPin = (targetPinId: string, targetTitle: string) => {
    addRelationMutation.mutate({
      referenceType: "PIN_TO_PIN",
      targetId: targetPinId,
      targetTitle,
    });
  };

  // Add tag
  const handleAddTag = async (tagName: string) => {
    // Check if tag exists
    const existingTag = worldTags.find((t) => t.name === tagName || t.name === `#${tagName}`);
    if (existingTag) {
      // Add relation with existing tag
      addRelationMutation.mutate({
        tagId: existingTag.id,
        referenceType: "CUSTOM",
      });
    } else {
      // Create new tag and add relation
      const _result = await createTagMutation.mutateAsync(tagName);
      if (result.success) {
        addRelationMutation.mutate({
          tagId: result.data.tag.id,
          referenceType: "CUSTOM",
        });
      }
    }
  };

  // Filter available items based on search and type
  const filteredItems = React.useMemo(() => {
    let items: Array<{ id: string; title: string; type: ReferenceType }> = [];

    switch (selectedType) {
      case "PIN_TO_PIN":
        items = availablePins.map((p) => ({ ...p, type: "PIN_TO_PIN" as const }));
        break;
      case "PIN_TO_CHARACTER":
        items = availableCharacters.map((c) => ({ id: c.id, title: c.name, type: "PIN_TO_CHARACTER" as const }));
        break;
      case "PIN_TO_IMAGE":
        // Would need to fetch available images
        items = [];
        break;
      default:
        items = [];
    }

    if (searchTerm) {
      items = items.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return items;
  }, [selectedType, availablePins, availableCharacters, searchTerm]);

  // Filter tags
  const filteredTags = React.useMemo(() => {
    if (!tagInput) return worldTags.slice(0, 8);
    return worldTags.filter((tag) =>
      tag.name.toLowerCase().includes(tagInput.toLowerCase())
    ).slice(0, 8);
  }, [worldTags, tagInput]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <Tag className="h-3 w-3" />
          References & Tags
        </h4>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-accent-gold hover:text-accent-gold/80"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-obsidian border border-border-subtle max-w-md">
            <DialogHeader>
              <DialogTitle className="text-text-primary">Add Reference or Tag</DialogTitle>
              <DialogDescription className="text-text-secondary">
                Link this pin to other content in your world.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Reference Type Selector */}
              <div className="flex flex-wrap gap-2">
                {(Object.keys(REFERENCE_TYPE) as ReferenceType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-sm border-2 text-xs font-medium transition-all",
                      selectedType === type
                        ? "border-accent-gold bg-accent-gold/20 text-text-primary"
                        : "border-border-subtle text-text-muted hover:border-iron hover:text-text-secondary"
                    )}
                  >
                    {REFERENCE_TYPES[type].icon}
                    {REFERENCE_TYPES[type].label}
                  </button>
                ))}
              </div>

              {/* Content based on type */}
              {selectedType === "CUSTOM" ? (
                // Tag input with autocomplete
                <div className="space-y-2">
                  <Input
                    placeholder="Type to search or create a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="bg-background-input border border-border-subtle text-text-primary"
                  />
                  {tagInput && filteredTags.length > 0 && (
                    <div className="border border-border-subtle rounded-sm bg-black/20 max-h-40 overflow-y-auto">
                      {filteredTags.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleAddTag(tag.name)}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent-gold/10 text-left"
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: tag.color || "#3b82f6" }}
                          />
                          <span className="text-sm text-text-primary">{tag.name}</span>
                        </button>
                      ))}
                      {filteredTags.length === 0 && tagInput && (
                        <button
                          type="button"
                          onClick={() => {
                            const newTagName = tagInput.startsWith("#") ? tagInput : `#${tagInput}`;
                            handleAddTag(newTagName);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent-gold/10 text-left text-accent-gold"
                        >
                          <Plus className="h-3 w-3" />
                          <span className="text-sm">Create &quot;{tagInput}&quot;</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                // Item selector for pins, characters, etc.
                <div className="space-y-2">
                  <Input
                    placeholder={`Search ${REFERENCE_TYPES[selectedType].label.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-background-input border border-border-subtle text-text-primary"
                  />
                  <div className="border border-border-subtle rounded-sm bg-black/20 max-h-48 overflow-y-auto">
                    {searchTerm === "" ? (
                      <p className="text-xs text-text-muted p-3 text-center">
                        Type to search {REFERENCE_TYPES[selectedType].label.toLowerCase()}...
                      </p>
                    ) : filteredTags.length === 0 ? (
                      <p className="text-xs text-text-muted p-3 text-center">
                        No results found
                      </p>
                    ) : (
                      filteredItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleLinkPin(item.id, item.title)}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent-gold/10 text-left border-b border-border-subtle last:border-0"
                        >
                          {REFERENCE_TYPES[item.type].icon}
                          <span className="text-sm text-text-primary truncate flex-1 text-left">
                            {item.title}
                          </span>
                          <Plus className="h-3 w-3 text-text-muted" />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Display existing relations */}
      {relations.length === 0 ? (
        <div className="rounded-sm p-4 -mx-2 text-center border border-dashed border-border-subtle">
          <Tag className="w-6 h-6 text-text-muted mx-auto mb-2" />
          <p className="text-sm text-text-secondary">No references yet</p>
          <p className="text-xs text-text-muted mt-1">
            Link to other pins, characters, or add custom tags.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {relations.map((relation) => {
            const typeInfo = REFERENCE_TYPES[relation.referenceType];
            return (
              <div
                key={relation.id}
                className="flex items-center gap-2 p-2 rounded-sm bg-black/20 border border-border-subtle group"
              >
                {/* Type icon */}
                <div
                  className="p-1.5 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: `${typeInfo.color}20` }}
                >
                  {typeInfo.icon}
                </div>

                {/* Tag if present */}
                {relation.tag && (
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: `${relation.tag.color}20`,
                      color: relation.tag.color || "#3b82f6",
                    }}
                  >
                    {relation.tag.name}
                  </span>
                )}

                {/* Target title */}
                <span className="text-sm text-text-primary truncate flex-1">
                  {relation.targetTitle || typeInfo.label}
                </span>

                {/* Notes indicator */}
                {relation.notes && (
                  <span className="text-xs text-text-muted italic" title={relation.notes}>
                    &quot;{relation.notes.slice(0, 20)}{relation.notes.length > 20 ? '...' : ''}&quot;
                  </span>
                )}

                {/* Remove button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-text-muted opacity-0 group-hover:opacity-100 hover:text-red-500 flex-shrink-0"
                  onClick={() => removeRelationMutation.mutate(relation.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
