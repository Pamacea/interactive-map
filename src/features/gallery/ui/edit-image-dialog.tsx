"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { updateGalleryItem } from "@/features/gallery/actions";
import type { GalleryItemWithRelations } from "@/types/gallery.type";

interface EditImageDialogProps {
  image: GalleryItemWithRelations;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditImageDialog({
  image,
  open,
  onClose,
  onSuccess,
}: EditImageDialogProps) {
  const [title, setTitle] = React.useState(image.title);
  const [description, setDescription] = React.useState(image.description || "");
  const [caption, setCaption] = React.useState(image.caption || "");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setTitle(image.title);
      setDescription(image.description || "");
      setCaption(image.caption || "");
    }
  }, [open, image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateGalleryItem({
        id: image.id,
        title,
        description: description || null,
        caption: caption || null,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update gallery item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-sm bg-obsidian border border-iron shadow-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Edit Image</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Preview */}
        {image.imageUrl && (
          <div className="mb-4 rounded-sm overflow-hidden border border-border-subtle">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.imageUrl}
              alt={image.title}
              className="w-full h-32 object-cover"
            />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Image title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Image description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Short caption for display"
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
