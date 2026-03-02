"use client";

import * as React from "react";
import { X, BookOpen } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { linkGalleryItemToLore } from "@/features/gallery/actions";
import type { GalleryItemWithRelations } from "@/types/gallery.type";
import type { LoreEntry } from "@/types/world.type";

interface LinkToLoreDialogProps {
  image: GalleryItemWithRelations;
  loreEntries: LoreEntry[];
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LinkToLoreDialog({
  image,
  loreEntries,
  open,
  onClose,
  onSuccess,
}: LinkToLoreDialogProps) {
  const [search, setSearch] = React.useState("");
  const [selectedLoreId, setSelectedLoreId] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Filter out already linked lore
  const availableLore = React.useMemo(() => {
    return loreEntries.filter((lore) => lore.id !== image.loreEntryId);
  }, [loreEntries, image.loreEntryId]);

  const filteredLore = React.useMemo(() => {
    if (!search) return availableLore;
    return availableLore.filter((lore) =>
      lore.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [availableLore, search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoreId) return;

    setIsSubmitting(true);

    try {
      await linkGalleryItemToLore(image.id, selectedLoreId);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to link to lore:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-sm bg-obsidian border border-iron shadow-xl p-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Link to Lore</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Image preview */}
        {image.imageUrl && (
          <div className="mb-4 rounded-sm overflow-hidden border border-border-subtle">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.imageUrl}
              alt={image.title}
              className="w-full h-24 object-cover"
            />
          </div>
        )}

        {/* Search */}
        <div className="mb-4">
          <Label htmlFor="lore-search">Search Lore Entries</Label>
          <Input
            id="lore-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
          />
        </div>

        {/* Lore list */}
        <div className="flex-1 overflow-y-auto border border-border-subtle rounded-sm mb-4">
          {filteredLore.length === 0 ? (
            <div className="p-4 text-center text-text-muted text-sm">
              {search ? "No lore entries found" : "No lore entries available"}
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {filteredLore.map((lore) => (
                <button
                  key={lore.id}
                  type="button"
                  onClick={() => setSelectedLoreId(lore.id)}
                  className={`w-full p-3 text-left hover:bg-white/5 transition-colors flex items-start gap-3 ${
                    selectedLoreId === lore.id ? "bg-accent-gold/10" : ""
                  }`}
                >
                  <BookOpen className="h-4 w-4 mt-0.5 text-accent-gold flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {lore.title}
                    </p>
                    {lore.content && (
                      <p className="text-xs text-text-secondary truncate">
                        {lore.content.slice(0, 50)}...
                      </p>
                    )}
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-xs bg-purple-500/20 text-purple-400">
                      {lore.category}
                    </span>
                  </div>
                  {selectedLoreId === lore.id && (
                    <span className="text-accent-gold text-sm">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedLoreId || isSubmitting}
            className="bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30"
          >
            {isSubmitting ? "Linking..." : "Link"}
          </Button>
        </div>
      </div>
    </div>
  );
}
