"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useLoreStore } from "@/stores/use-lore-store";
import { LoreCategory } from "@/types/lore.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <div className="flex flex-col gap-4 p-4 bg-background-elevated border border-border-base rounded-sm">
      <div className="flex items-center justify-between">
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-sm">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Title */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="lore-title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lore-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
            disabled={isSubmitting}
            maxLength={200}
          />
          <p className="text-xs text-text-muted">
            {title.length} / 200 characters
          </p>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="lore-category">Category</Label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as LoreCategory)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="lore-category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="lore-content">
            Content <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="lore-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your lore entry here... (Markdown supported)"
            rows={8}
            disabled={isSubmitting}
            maxLength={50000}
            className="resize-y"
          />
          <p className="text-xs text-text-muted">
            {content.length} / 50,000 characters
          </p>
        </div>

        {/* Visibility toggles */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              id="lore-visible"
              checked={isVisible}
              onCheckedChange={(checked) => setIsVisible(checked === true)}
              disabled={isSubmitting}
            />
            <Label
              htmlFor="lore-visible"
              className="cursor-pointer text-text-secondary"
            >
              Visible in map
            </Label>
          </div>

          <div className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              id="lore-public"
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(checked === true)}
              disabled={isSubmitting}
            />
            <Label
              htmlFor="lore-public"
              className="cursor-pointer text-text-secondary"
            >
              Public
            </Label>
          </div>
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
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </div>
            ) : (
              <>{isEditing ? "Update" : "Create"}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
