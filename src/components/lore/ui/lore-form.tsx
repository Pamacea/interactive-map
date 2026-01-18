"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useLoreStore } from "@/stores/use-lore-store";
import { LoreCategory } from "@/types/lore.type";
import { Button } from "@/components/ui/button";
import type { LoreEntry } from "@/types/lore.type";

interface LoreFormProps {
  worldId: string;
  lore?: LoreEntry;
  onSuccess?: () => void;
}

export function LoreForm({ worldId, lore, onSuccess }: LoreFormProps) {
  const isEditing = !!lore;

  const [title, setTitle] = useState(lore?.title || "");
  const [content, setContent] = useState(lore?.content || "");
  const [category, setCategory] = useState<LoreCategory>(lore?.category || "GENERAL");
  const [isVisible, setIsVisible] = useState(lore?.isVisible ?? false);
  const [isPublic, setIsPublic] = useState(lore?.isPublic ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLoreEntry = useLoreStore((state) => state.createLoreEntry);
  const updateLoreEntryServer = useLoreStore((state) => state.updateLoreEntryServer);
  const stopCreating = useLoreStore((state) => state.stopCreating);
  const stopEditing = useLoreStore((state) => state.stopEditing);

  // Category options
  const categories: { value: LoreCategory; label: string }[] = [
    { value: "GENERAL", label: "General" },
    { value: "HISTORY", label: "History" },
    { value: "GEOGRAPHY", label: "Geography" },
    { value: "CHARACTERS", label: "Characters" },
    { value: "FACTIONS", label: "Factions" },
    { value: "MAGIC", label: "Magic" },
    { value: "ITEMS", label: "Items" },
    { value: "QUESTS", label: "Quests" },
    { value: "CUSTOM", label: "Custom" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && lore) {
        // Update existing lore entry
        await updateLoreEntryServer({
          id: lore.id,
          title: title.trim(),
          content: content.trim(),
          category,
          isVisible,
          isPublic,
        });
      } else {
        // Create new lore entry
        await createLoreEntry({
          title: title.trim(),
          content: content.trim(),
          category,
          isVisible,
          isPublic,
          gameWorldId: worldId,
        });
      }

      // Reset form
      setTitle("");
      setContent("");
      setCategory("GENERAL");
      setIsVisible(false);
      setIsPublic(true);

      // Close form
      stopCreating();
      stopEditing();

      // Call success callback
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save lore entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    stopCreating();
    stopEditing();
  };

  return (
    <div className="p-4 bg-background-elevated border border-border-base rounded-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-secondary">
          {isEditing ? "Edit Lore Entry" : "New Lore Entry"}
        </h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-sm">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
            className="w-full h-10 px-3 text-sm bg-background-base border border-border-base rounded-sm focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-accent-gold placeholder:text-text-muted"
            disabled={isSubmitting}
            maxLength={200}
          />
          <p className="text-xs text-text-muted mt-1">
            {title.length} / 200 characters
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as LoreCategory)}
            className="w-full h-10 px-3 text-sm bg-background-base border border-border-base rounded-sm focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-accent-gold cursor-pointer"
            disabled={isSubmitting}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your lore entry here... (Markdown supported)"
            rows={8}
            className="w-full px-3 py-2 text-sm bg-background-base border border-border-base rounded-sm focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-accent-gold placeholder:text-text-muted resize-y"
            disabled={isSubmitting}
            maxLength={50000}
          />
          <p className="text-xs text-text-muted mt-1">
            {content.length} / 50,000 characters
          </p>
        </div>

        {/* Visibility toggles */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="w-4 h-4 rounded-sm border-border-base text-accent-gold focus:ring-accent-gold"
              disabled={isSubmitting}
            />
            <span className="text-sm text-text-secondary">Visible in map</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 rounded-sm border-border-base text-accent-gold focus:ring-accent-gold"
              disabled={isSubmitting}
            />
            <span className="text-sm text-text-secondary">Public</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="h-9 px-4"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="h-9 px-4 bg-accent-gold text-white hover:bg-accent-gold/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>{isEditing ? "Update" : "Create"}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
