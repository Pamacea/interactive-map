"use client";

import * as React from "react";
import { ImageIcon, Plus } from "lucide-react";
import { cn } from "@/shared/utils";
import { Button } from "@/shared/ui/button";
import type { GalleryItemWithRelations } from "@/types/gallery.type";
import { GalleryImageCard } from "./gallery-image-card";
import { GallerySelectionDialog } from "./gallery-selection-dialog";
import { GalleryLayoutControls, getGridClass, getImageClass, type GalleryLayout } from "./gallery-layout-controls";

interface PinGallerySectionProps {
  pinId: string;
  worldId: string;
  linkedImages?: GalleryItemWithRelations[];
  onImageLinked?: (image: GalleryItemWithRelations) => void;
  onImageUnlinked?: (imageId: string) => void;
}

/**
 * Pin Gallery Section
 * Manages and displays gallery images linked to a pin
 */
export function PinGallerySection({
  pinId,
  worldId,
  linkedImages = [],
  onImageLinked,
  onImageUnlinked,
}: PinGallerySectionProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [unlinkingImageId, setUnlinkingImageId] = React.useState<string | null>(null);
  const [layout, setLayout] = React.useState<GalleryLayout>("grid-3");

  const handleUnlinkImage = async (imageId: string) => {
    setUnlinkingImageId(imageId);
    try {
      const { updateGalleryItem } = await import("@/features/gallery/actions");
      const _result = await updateGalleryItem({ id: imageId, pinId: null });
      if (result.success) {
        onImageUnlinked?.(imageId);
      }
    } catch (error) {
      console.error("Failed to unlink image:", error);
    } finally {
      setUnlinkingImageId(null);
    }
  };

  const handleCaptionUpdate = async (imageId: string, caption: string) => {
    try {
      const { updateGalleryItemCaption } = await import("@/features/gallery/actions");
      await updateGalleryItemCaption(imageId, caption);
      const updatedImage = linkedImages.find(img => img.id === imageId);
      if (updatedImage) {
        onImageLinked?.({ ...updatedImage, caption } as GalleryItemWithRelations);
      }
    } catch (error) {
      console.error("Failed to update caption:", error);
    }
  };

  const handleTitleUpdate = async (imageId: string, title: string) => {
    try {
      const { updateGalleryItem } = await import("@/features/gallery/actions");
      const _result = await updateGalleryItem({ id: imageId, title });
      if (result.success) {
        const updatedImage = linkedImages.find(img => img.id === imageId);
        if (updatedImage) {
          onImageLinked?.({ ...updatedImage, title } as GalleryItemWithRelations);
        }
      }
    } catch (error) {
      console.error("Failed to update title:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with layout selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
            Gallery
          </h4>
          {linkedImages.length > 0 && (
            <span className="text-xs text-text-muted">
              {linkedImages.length} image{linkedImages.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Layout selector */}
          <GalleryLayoutControls layout={layout} onLayoutChange={setLayout} />

          <GallerySelectionDialog
            worldId={worldId}
            pinId={pinId}
            linkedImages={linkedImages}
            onImageLinked={(img) => onImageLinked?.(img)}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          >
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-3 text-xs text-accent-gold hover:text-accent-gold/80 border border-accent-gold/30 hover:bg-accent-gold/20"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </GallerySelectionDialog>
        </div>
      </div>

      {/* Linked images grid with layouts */}
      {linkedImages.length === 0 ? (
        <div
          className="rounded-sm p-6 -mx-4 text-center border border-dashed border-border-subtle hover:border-accent-gold/50 transition-colors cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        >
          <ImageIcon className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-secondary">No images linked</p>
          <p className="text-xs text-text-muted mt-2">
            Click to add images from your gallery
          </p>
        </div>
      ) : (
        <div className={cn(
          getGridClass(layout),
          layout === "horizontal-3" ? "max-h-96 overflow-y-auto pr-1" : ""
        )}>
          {linkedImages.map((image, index) => (
            <GalleryImageCard
              key={image.id}
              image={image}
              onUnlink={() => handleUnlinkImage(image.id)}
              isUnlinking={unlinkingImageId === image.id}
              onCaptionUpdate={(caption) => handleCaptionUpdate(image.id, caption)}
              onTitleUpdate={(title) => handleTitleUpdate(image.id, title)}
              sizeClass={getImageClass(index, layout)}
              layout={layout}
            />
          ))}
        </div>
      )}

      {/* Image count badge */}
      {linkedImages.length > 0 && (
        <div className="flex items-center justify-between text-xs text-text-muted pt-1">
          <span>{linkedImages.length} image{linkedImages.length > 1 ? "s" : ""} linked</span>
        </div>
      )}
    </div>
  );
}
